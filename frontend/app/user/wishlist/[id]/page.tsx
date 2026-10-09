"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiShare2,
  FiHeart,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiPhone,
  FiMessageSquare,
  FiShoppingCart,
  FiBox,
  FiShield,
  FiTag,
  FiArrowLeft,
  FiStar,
  FiTruck,
  FiRotateCcw,
  FiCalendar,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "@/components/BackButton";
import SellerCard from "@/components/SellerCard";
import type { WishlistProduct, WishlistCard, WishlistReview } from "@/app/types/wishlist";
import {
  toWishlistDetail,
  toWishlistCard,
  formatPrice,
  timeAgo,
  detectCategoryRoute,
  getCategoryLabel,
  getSpecIcons,
  API_BASE,
} from "@/lib/adapters/wishlistAdapter";

/* shared class strings */
const card = "rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)]";
const cardPad = "px-6 py-[22px] max-[600px]:px-[18px] max-[600px]:py-4";
const sectionTitle = "mb-3 text-[17px] font-extrabold text-[#1a1a1a]";
const tagBase =
  "inline-flex items-center rounded-[20px] border-[1.5px] px-3 py-[5px] text-[12.5px] font-medium";
const badgeBase =
  "inline-flex items-center gap-[5px] rounded-md border px-3 py-[5px] text-[11.5px] font-bold";
const iconBtn =
  "flex h-12 w-12 cursor-pointer items-center justify-center rounded-[9px] border-[1.5px] border-gray-200 bg-gray-50 text-gray-700 transition-all duration-150";

/* Star Rating */
function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            fill={i < full ? "#f59e0b" : "none"}
            color={i < full ? "#f59e0b" : "#cbd5e1"}
          />
        ))}
      </div>
      {count > 0 && <span className="text-xs text-slate-500">({count} reviews)</span>}
    </div>
  );
}

export default function WishlistItemDetail() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [product, setProduct] = useState<WishlistProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [related, setRelated] = useState<WishlistCard[]>([]);
  const { data: session } = useSession();

  /* Fetch product */
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/listings/${id}`);
        if (!res.ok)
          throw new Error(res.status === 404 ? "Product not found" : `Failed (${res.status})`);
        const data = await res.json();
        if (!cancelled) {
          const detail = toWishlistDetail(data);
          setProduct(detail);
          setIsFav(detail.isFavorited ?? false);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* Related listings */
  useEffect(() => {
    if (!product?.category) return;
    fetch(`${API_BASE}/api/listings?category=${encodeURIComponent(product.category)}&limit=8`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((json) => {
        const list = Array.isArray(json) ? json : json.listings ?? json.data ?? [];
        setRelated(
          list
            .filter((r: { id: string }) => r.id !== product.id)
            .slice(0, 8)
            .map(toWishlistCard)
        );
      })
      .catch(() => {});
  }, [product?.category, product?.id]);

  /* Wishlist check */
  useEffect(() => {
    if (!session?.accessToken || !id) return;
    fetch(`${API_BASE}/api/wishlist/check/${id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setIsFav(data.favorited);
      })
      .catch(() => {});
  }, [id, session?.accessToken]);

  const toggleFavorite = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in");
      return;
    }
    setFavLoading(true);
    const prev = isFav;
    setIsFav(!prev);
    try {
      const res = await fetch(`${API_BASE}/api/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ listingId: id }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setIsFav(data.favorited);
      toast.success(data.favorited ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      setIsFav(prev);
      toast.error("Something went wrong");
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.title, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    } catch {
      toast.error("Error sharing");
    }
  };

  const handleContact = (type: "chat" | "call") => {
    if (type === "call" && product?.seller?.phone) window.location.href = `tel:${product.seller.phone}`;
    else toast.success("Opening chat…");
  };

  /* Cart / Buy / Offer helpers */
  const addToCart = () => {
    if (!product) return;
    toast.success(`${product.title} added to cart`);
  };

  const buyNow = () => {
    if (!product) return;
    toast.success(`${product.title} added to cart — Proceeding to checkout…`);
  };

  const makeOffer = () => {
    if (!product) return;
    toast.info("Offer sent to seller!");
  };

  /* Loading */
  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-['Inter',sans-serif] text-slate-500">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#C0392B]" />
          <p className="mt-3 text-sm">Loading…</p>
        </div>
      </div>
    );

  /* Error */
  if (error || !product)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-6 font-['Inter',sans-serif]">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FiBox size={28} />
        </div>
        <p className="text-base font-bold text-slate-800">Couldn&apos;t load</p>
        <span className="text-sm text-slate-400">{error ?? "Not found"}</span>
        <Link
          href="/user/wishlist"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C0392B] no-underline"
        >
          <FiArrowLeft size={14} /> Back to Wishlist
        </Link>
      </div>
    );

  /* Render */
  const images = product.images ?? [];
  const visibleThumbs = images.slice(0, 5);
  const extraCount = images.length - 5;
  const categoryRoute = detectCategoryRoute(product.category);
  const categoryLabel = getCategoryLabel(categoryRoute);
  const specIcons = getSpecIcons(product, categoryRoute);

  const detailEntries = product.details ?? [];
  const half = Math.ceil(detailEntries.length / 2);
  const leftDetails = detailEntries.slice(0, half);
  const rightDetails = detailEntries.slice(half);

  const seller = product.seller;

  const renderDetailRow = (d: { label: string; value: unknown }) => (
    <div
      key={d.label}
      className="flex items-center justify-between gap-3 border-b border-[#f3f4f6] py-[11px] text-[13.5px] last:border-b-0"
    >
      <span className="font-normal text-[#666]">{d.label}</span>
      <span className="text-right font-bold text-[#1a1a1a]">{String(d.value)}</span>
    </div>
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} newestOnTop closeOnClick pauseOnHover />

      <div className="min-h-screen bg-[#f5f6f8] pb-[60px] font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif]">
        <div className="mx-6 mt-4 max-[600px]:mx-3.5 max-[600px]:mt-3">
          <BackButton />
        </div>

        <nav className="border-b border-[#ececec] bg-white py-3" aria-label="Breadcrumb">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-1.5 px-6 text-[13px] text-[#888] max-[600px]:px-3.5 max-[600px]:text-xs">
            <Link href="/" className="font-medium text-[#555] no-underline transition-colors duration-200 hover:text-[#C0392B]">
              Home
            </Link>
            <span className="text-xs text-[#bbb]">›</span>
            <Link href="/user/wishlist" className="font-medium text-[#555] no-underline transition-colors duration-200 hover:text-[#C0392B]">
              Wishlist
            </Link>
            <span className="text-xs text-[#bbb]">›</span>
            {categoryRoute && (
              <>
                <Link
                  href={`/category/${categoryRoute}`}
                  className="font-medium text-[#555] no-underline transition-colors duration-200 hover:text-[#C0392B]"
                >
                  {categoryLabel}
                </Link>
                <span className="text-xs text-[#bbb]">›</span>
              </>
            )}
            <span className="font-semibold text-[#1a1a1a]">{product.title}</span>
          </div>
        </nav>

        <div className="mx-auto mt-3 grid max-w-[1200px] grid-cols-[1fr_380px] items-start gap-6 px-6 max-[900px]:grid-cols-1 max-[600px]:mt-[18px] max-[600px]:px-3.5">
          {/* LEFT COLUMN */}
          <div className="flex min-w-0 flex-col gap-[18px]">
            {/* Image Gallery */}
            <div className={`${card} overflow-hidden`}>
              <div className="group relative aspect-video w-full overflow-hidden bg-[#1a1a2e] max-[600px]:aspect-auto max-[600px]:h-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg] ?? "/placeholder.png"}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-[400ms] ease-in-out group-hover:scale-[1.03]"
                />
              </div>
              {visibleThumbs.length > 0 && (
                <div className="flex gap-2 overflow-x-auto bg-white p-3 max-[600px]:gap-1.5 max-[600px]:p-2.5">
                  {visibleThumbs.map((src, i) => (
                    <div
                      key={i}
                      className={`relative h-[62px] w-[90px] shrink-0 cursor-pointer overflow-hidden rounded-lg border-[2.5px] transition-all duration-200 hover:-translate-y-0.5 max-[600px]:h-[52px] max-[600px]:w-[72px] ${
                        activeImg === i ? "border-[#C0392B]" : "border-transparent"
                      }`}
                      onClick={() => setActiveImg(i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`View ${i + 1}`} className="h-full w-full object-cover" />
                      {i === 4 && extraCount > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[15px] font-bold text-white">
                          +{extraCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className={`${card} ${cardPad}`}>
              {seller?.isVerified && (
                <div className="mb-2.5 inline-flex items-center gap-[5px] rounded-[5px] bg-[#eafaf1] px-2.5 py-[3px] text-[11.5px] font-bold tracking-[0.3px] text-[#1e8449]">
                  <FiCheckCircle size={13} color="#1e8449" />
                  Verified Seller
                </div>
              )}

              <div className="mb-1.5 flex items-start justify-between gap-3">
                <h1 className="break-words text-[22px] font-extrabold leading-[1.3] text-[#1a1a1a] max-[600px]:text-lg">
                  {product.title}
                </h1>
                <div className="mt-0.5 flex shrink-0 gap-2.5 max-[600px]:gap-2">
                  <button
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#e0e0e0] bg-white text-[#888] transition-all duration-200 hover:scale-110 hover:border-[#ccc] hover:bg-[#f5f5f5] hover:text-[#555] max-[600px]:h-[34px] max-[600px]:w-[34px]"
                    onClick={handleShare}
                    title="Share"
                  >
                    <FiShare2 size={16} />
                  </button>
                  <button
                    className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-[1.5px] transition-all duration-200 hover:scale-110 max-[600px]:h-[34px] max-[600px]:w-[34px] ${
                      isFav
                        ? "border-[#e74c3c] bg-[#fff5f5] text-[#e74c3c]"
                        : "border-[#e0e0e0] bg-white text-[#888] hover:border-[#ccc] hover:bg-[#f5f5f5] hover:text-[#555]"
                    }`}
                    aria-label="Save to wishlist"
                    onClick={toggleFavorite}
                    disabled={favLoading}
                    title="Save"
                  >
                    {isFav ? <FaHeart size={16} /> : <FiHeart size={16} />}
                  </button>
                </div>
              </div>

              <div className="mb-3 mt-1 flex flex-wrap items-center gap-2 text-[26px] font-black text-[#C0392B] max-[600px]:text-[22px]">
                {formatPrice(product.price, product.currency)}
                {product.negotiable && (
                  <span className="rounded bg-[#f0fdf4] px-2 py-0.5 text-[13px] font-semibold text-[#16a34a]">
                    Negotiable
                  </span>
                )}
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-5 border-b border-[#f0f0f0] pb-4 max-[600px]:gap-2.5">
                {product.location && (
                  <span className="flex items-center gap-[5px] text-[13.5px] font-medium text-[#555]">
                    <FiMapPin size={13} color="#888" />
                    {product.location}
                  </span>
                )}
                {product.postedDaysAgo != null && (
                  <span className="flex items-center gap-[5px] text-[13px] text-[#777]">
                    <FiClock size={13} color="#aaa" />
                    {timeAgo(product.postedDaysAgo)}
                  </span>
                )}
                {product.condition && (
                  <span className="inline-flex items-center gap-[5px] rounded-[20px] bg-blue-100 px-2.5 py-[3px] text-xs font-bold uppercase tracking-[0.3px] text-blue-700">
                    <FiShield size={11} />
                    {product.condition}
                  </span>
                )}
              </div>

              {specIcons.length > 0 && (
                <div className="grid grid-cols-4 gap-2 max-[900px]:grid-cols-2">
                  {specIcons.map((spec, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1.5 rounded-[10px] border border-[#eef0f3] bg-[#f8f9fb] px-1.5 pb-2.5 pt-3 text-center transition-colors duration-200 hover:border-[#d9dde8] hover:bg-[#f0f2f8]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#C0392B] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
                        <FiBox size={22} />
                      </div>
                      <span className="text-sm font-extrabold text-[#1a1a1a]">{spec.value}</span>
                      <span className="text-center text-[10.5px] font-medium leading-[1.3] text-[#888]">
                        {spec.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className={`${card} ${cardPad}`}>
                <h2 className={sectionTitle}>Description</h2>
                <p
                  className={`overflow-hidden text-sm leading-[1.75] text-[#444] ${
                    showFullDesc ? "" : "line-clamp-3"
                  }`}
                >
                  {product.description}
                </p>
                {product.description.length > 180 && (
                  <button
                    className="mt-2 inline-block cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[13.5px] font-semibold text-[#2980b9] transition-opacity duration-200 hover:opacity-75"
                    onClick={() => setShowFullDesc((v) => !v)}
                  >
                    {showFullDesc ? "See Less ▲" : "See More ▼"}
                  </button>
                )}
              </div>
            )}

            {/* Details */}
            {detailEntries.length > 0 && (
              <div className={`${card} ${cardPad} border-t-[3px] border-t-[#4B6BFB]`}>
                <h2 className={sectionTitle}>{categoryLabel} Details</h2>
                <div className="grid grid-cols-2 max-[900px]:grid-cols-1">
                  <div className="border-r border-[#f0f0f0] pr-7 max-[900px]:border-r-0 max-[900px]:pr-0">
                    {leftDetails.map(renderDetailRow)}
                  </div>
                  <div className="pl-7 max-[900px]:pl-0">{rightDetails.map(renderDetailRow)}</div>
                </div>
              </div>
            )}

            {/* Features / Tags */}
            {product.features?.length || product.tags?.length ? (
              <div className={`${card} ${cardPad}`}>
                <h2 className={sectionTitle}>Features &amp; Tags</h2>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {(product.features ?? []).map((f) => (
                    <span key={f} className={`${tagBase} border-[#d8b4fe] bg-[#f3e8ff] text-[#7c3aed]`}>
                      {f}
                    </span>
                  ))}
                  {(product.tags ?? []).map((t) => (
                    <span key={t} className={`${tagBase} border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT COLUMN  */}
          <div className="sticky top-5 flex flex-col gap-4 max-[900px]:static max-[900px]:mt-[18px]">
            {/* ── Action / Seller Panel ── */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)] max-[600px]:px-[18px] max-[600px]:py-4">
              <h1 className="mb-1 text-xl font-black leading-[1.3] text-[#111]">{product.title}</h1>
              <p className="mb-2.5 flex items-center gap-[5px] text-[13px] text-gray-500">
                <FiTag size={11} color="#9ca3af" />
                {categoryLabel}
              </p>

              <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-gray-400">Price</p>
              <p className="mb-2.5 text-[28px] font-black text-[#C0392B]">
                {formatPrice(product.price, product.currency)}
              </p>
              <div className="mb-3.5 h-[3px] w-10 rounded-sm bg-[#C0392B] opacity-80" />

              {seller && (
                <div className="mb-3">
                  <StarRating
                    rating={seller.rating ?? 0}
                    count={(product.reviews as WishlistReview[] | undefined)?.length ?? 0}
                  />
                </div>
              )}

              {product.location && (
                <div className="mb-3.5 flex items-center gap-[5px] text-[13px] text-gray-500">
                  <FiMapPin size={14} />
                  {product.location}
                </div>
              )}

              {product.description && (
                <p className="mb-3.5 text-[13.5px] leading-[1.7] text-gray-600">
                  {product.description.length > 120
                    ? product.description.slice(0, 120) + "…"
                    : product.description}
                </p>
              )}

              {(product.tags ?? []).length > 0 && (
                <div className="mb-3.5 flex flex-wrap gap-1.5">
                  {(product.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[5px] border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {(product.details ?? []).length > 0 && (
                <div className="mb-3.5 grid grid-cols-2 gap-2.5">
                  {(product.details ?? []).slice(0, 4).map((d) => (
                    <div key={d.label} className="rounded-lg border border-[#f0f0f0] bg-gray-50 px-3 py-2.5">
                      <p className="mb-[3px] text-[10px] font-bold uppercase tracking-[0.5px] text-gray-400">
                        {d.label}
                      </p>
                      <p className="text-[13px] font-bold text-[#111]">{String(d.value)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-3.5 flex flex-wrap gap-2">
                {product.deliveryAvailable && (
                  <span className={`${badgeBase} border-emerald-200 bg-emerald-50 text-emerald-600`}>
                    <FiTruck size={11} /> Free Delivery
                  </span>
                )}
                {product.warrantyAvailable && (
                  <span className={`${badgeBase} border-amber-200 bg-amber-100 text-amber-800`}>
                    <FiShield size={11} /> Warranty Included
                  </span>
                )}
                {product.negotiable && (
                  <span className={`${badgeBase} border-blue-200 bg-blue-50 text-blue-700`}>
                    <FiRotateCcw size={11} /> Price Negotiable
                  </span>
                )}
              </div>

              <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] font-bold text-emerald-600">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                Item Available — Ready to Ship
              </div>

              <div className="flex gap-2.5">
                <button
                  className="flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-[9px] border-0 bg-[#C0392B] p-[13px] font-[inherit] text-sm font-extrabold text-white transition-all duration-150 hover:-translate-y-px hover:bg-[#a93226]"
                  onClick={buyNow}
                >
                  <FiShoppingCart size={16} />
                  Buy Now
                </button>
                <button
                  className="flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-[9px] border-[1.5px] border-[#f5c6c6] bg-[#fdf2f2] p-[13px] font-[inherit] text-sm font-extrabold text-[#C0392B] transition-all duration-150 hover:-translate-y-px hover:border-[#C0392B] hover:bg-[#C0392B] hover:text-white"
                  onClick={addToCart}
                >
                  <FiShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
              <button
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-[9px] border-[1.5px] border-gray-200 bg-white p-3 font-[inherit] text-sm font-bold text-gray-700 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50"
                onClick={makeOffer}
              >
                <FiCalendar size={16} />
                Make an Offer
              </button>

              <div className="mt-2.5 flex gap-2.5">
                <button
                  className={`${iconBtn} hover:border-pink-200 hover:bg-pink-100 hover:text-pink-700`}
                  onClick={() => handleContact("call")}
                  title="Call seller"
                >
                  <FiPhone size={16} />
                </button>
                <button
                  className={`${iconBtn} hover:border-green-300 hover:bg-green-100 hover:text-green-700`}
                  onClick={() => handleContact("chat")}
                  title="Chat with seller"
                >
                  <FiMessageSquare size={16} />
                </button>
                <button
                  className={`${iconBtn} hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700`}
                  onClick={handleShare}
                  title="Share"
                >
                  <FiShare2 size={16} />
                </button>
              </div>
            </div>

            {seller ? (
              <SellerCard
                seller={seller}
                reviews={product.reviews ?? []}
                listingId={product.id}
                sellerId={seller.id}
              />
            ) : null}
          </div>
        </div>

        {/* RELATED LISTINGS */}
        {related.length > 0 && (
          <div className="mx-auto max-w-[1200px] px-6 pt-7 max-[600px]:px-3.5 max-[600px]:pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#1a1a1a]">Related Listings</h2>
              {categoryRoute && (
                <Link
                  href={`/category/${categoryRoute}`}
                  className="flex items-center gap-1 text-[13.5px] font-semibold text-[#C0392B] no-underline transition-opacity duration-200 hover:opacity-75"
                >
                  View All →
                </Link>
              )}
            </div>
            <div className="flex gap-3.5 overflow-x-auto pb-3 [scrollbar-color:#ddd_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-[#ddd] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-[5px]">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/category/${detectCategoryRoute(item.category) ?? "products"}/${item.id}`}
                  className="group flex w-[178px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border-[1.5px] border-[#ebebeb] bg-white no-underline transition-all duration-200 hover:-translate-y-1 hover:border-[#ddd] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                >
                  <div className="relative h-[120px] w-full overflow-hidden bg-[#f8f8f8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.07]"
                    />
                  </div>
                  <div className="flex flex-col gap-[3px] px-2.5 pb-[11px] pt-[9px]">
                    <p className="line-clamp-2 text-xs font-bold leading-[1.3] text-[#1a1a1a]">{item.title}</p>
                    <p className="mt-0.5 text-[12.5px] font-extrabold text-[#C0392B]">{item.price}</p>
                    <p className="text-[10.5px] text-[#999]">{item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}