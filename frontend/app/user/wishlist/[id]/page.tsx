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
  FiChevronRight,
  FiTruck,
  FiRotateCcw,
  FiCalendar,
  FiZap,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SellerCard from "@/components/SellerCard";
import type { WishlistProduct, WishlistCard } from "@/app/types/wishlist";
import {
  toWishlistDetail,
  toWishlistCard,
  prefixImage,
  formatPrice,
  timeAgo,
  formatDate,
  detectCategoryRoute,
  getCategoryLabel,
  getSpecIcons,
  API_BASE,
} from "@/lib/adapters/wishlistAdapter";

const PRIMARY = "#C0392B";

/* ─────────────── Star Rating ─────────────── */
function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            fill={i < full ? "#f59e0b" : "none"}
            color={i < full ? "#f59e0b" : "#cbd5e1"}
          />
        ))}
      </div>
      {count > 0 && (
        <span style={{ fontSize: 12, color: "#64748b" }}>({count} reviews)</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════ */
/*  MAIN PAGE                             */
/* ═══════════════════════════════════════ */
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

  /* ─── Fetch product ─── */
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/listings/${id}`);
        if (!res.ok)
          throw new Error(
            res.status === 404 ? "Product not found" : `Failed (${res.status})`
          );
        const data = await res.json();
        if (!cancelled) {
          const detail = toWishlistDetail(data);
          setProduct(detail);
          setIsFav(detail.isFavorited ?? false);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ─── Related listings ─── */
  useEffect(() => {
    if (!product?.category) return;
    fetch(
      `${API_BASE}/api/listings?category=${encodeURIComponent(
        product.category
      )}&limit=8`,
      { cache: "no-store" }
    )
      .then((r) => (r.ok ? r.json() : []))
      .then((json) => {
        const list = Array.isArray(json)
          ? json
          : json.listings ?? json.data ?? [];
        setRelated(
          list
            .filter((r: any) => r.id !== product.id)
            .slice(0, 8)
            .map(toWishlistCard)
        );
      })
      .catch(() => {});
  }, [product?.category, product?.id]);

  /* ─── Wishlist check ─── */
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
        await navigator.share({
          title: product?.title,
          url: window.location.href,
        });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    } catch {
      toast.error("Error sharing");
    }
  };

  const handleContact = (type: "chat" | "call") => {
    if (type === "call" && product?.seller?.phone)
      window.location.href = `tel:${product.seller.phone}`;
    else toast.success("Opening chat…");
  };

  /* ─── Cart / Buy / Offer helpers (from buy/id) ─── */
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

  /* ─── Loading ─── */
  if (loading)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          color: "#64748b",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid #e2e8f0",
              borderTopColor: PRIMARY,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: 12, fontSize: 14 }}>Loading…</p>
        </div>
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      </div>
    );

  /* ─── Error ─── */
  if (error || !product)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          gap: 8,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            marginBottom: 8,
          }}
        >
          <FiBox size={28} />
        </div>
        <p style={{ fontWeight: 700, color: "#1e293b", fontSize: 16 }}>
          Couldn&apos;t load
        </p>
        <span style={{ color: "#94a3b8", fontSize: 14 }}>
          {error ?? "Not found"}
        </span>
        <Link
          href="/user/wishlist"
          style={{
            color: PRIMARY,
            fontWeight: 600,
            marginTop: 12,
            textDecoration: "none",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FiArrowLeft size={14} /> Back to Wishlist
        </Link>
      </div>
    );

  /* ─── Render ─── */
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

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <style>{`
        .pd-page { background:#f5f6f8; min-height:100vh; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; padding-bottom:60px; }
        .pd-breadcrumb { background:#fff; border-bottom:1px solid #ececec; padding:12px 0; }
        .pd-breadcrumb-inner { max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:13px; color:#888; }
        .pd-bc-link { color:#555; text-decoration:none; font-weight:500; transition:color 0.18s; }
        .pd-bc-link:hover { color:${PRIMARY}; }
        .pd-bc-sep { color:#bbb; font-size:12px; }
        .pd-bc-current { color:#1a1a1a; font-weight:600; }
        .pd-back-btn { display:inline-flex; align-items:center; gap:8px; padding:8px 14px; border-radius:10px; border:1.5px solid #e0e0e0; background:#fff; color:#555; font-size:13px; font-weight:600; cursor:pointer; margin:16px 24px 4px; font-family:inherit; text-decoration:none; transition:all .2s; }
        .pd-back-btn:hover { background:#f8fafc; border-color:#ccc; color:#1a1a1a; }
        .pd-container { max-width:1200px; margin:12px auto 0; padding:0 24px; display:grid; grid-template-columns:1fr 380px; gap:24px; align-items:start; }
        .pd-left { display:flex; flex-direction:column; gap:18px; min-width:0; }
        .pd-right { display:flex; flex-direction:column; gap:16px; position:sticky; top:20px; }

        /* ── Image Gallery ── */
        .pd-img-card { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.07); }
        .pd-main-img-wrap { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; background:#1a1a2e; }
        .pd-main-img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease; }
        .pd-main-img-wrap:hover .pd-main-img { transform:scale(1.03); }
        .pd-thumbs { display:flex; gap:8px; padding:12px; background:#fff; overflow-x:auto; }
        .pd-thumb-wrap { position:relative; flex-shrink:0; width:90px; height:62px; border-radius:8px; overflow:hidden; cursor:pointer; border:2.5px solid transparent; transition:border-color 0.2s, transform 0.2s; }
        .pd-thumb-wrap:hover { transform:translateY(-2px); }
        .pd-thumb-wrap.active { border-color:${PRIMARY}; }
        .pd-thumb-img { width:100%; height:100%; object-fit:cover; }
        .pd-thumb-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.52); display:flex; align-items:center; justify-content:center; color:#fff; font-size:15px; font-weight:700; }

        /* ── Info Card (left) ── */
        .pd-info-card { background:#fff; border-radius:16px; padding:22px 24px; box-shadow:0 2px 12px rgba(0,0,0,0.07); }
        .pd-verified-badge { display:inline-flex; align-items:center; gap:5px; background:#eafaf1; color:#1e8449; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:5px; margin-bottom:10px; letter-spacing:0.3px; }
        .pd-title-row { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:6px; }
        .pd-title { font-size:22px; font-weight:800; color:#1a1a1a; line-height:1.3; margin:0; word-break:break-word; }
        .pd-action-btns { display:flex; gap:10px; flex-shrink:0; margin-top:2px; }
        .pd-action-btn { width:36px; height:36px; border-radius:50%; border:1.5px solid #e0e0e0; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s, border-color 0.2s, transform 0.2s; color:#888; }
        .pd-action-btn:hover { background:#f5f5f5; border-color:#ccc; transform:scale(1.1); color:#555; }
        .pd-action-btn.fav-active { border-color:#e74c3c; background:#fff5f5; color:#e74c3c; }
        .pd-price { font-size:26px; font-weight:900; color:${PRIMARY}; margin:4px 0 12px; display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
        .pd-price-neg { font-size:13px; color:#16a34a; font-weight:600; background:#f0fdf4; padding:2px 8px; border-radius:4px; }
        .pd-loc-row { display:flex; align-items:center; gap:20px; flex-wrap:wrap; padding-bottom:16px; border-bottom:1px solid #f0f0f0; margin-bottom:16px; }
        .pd-location { display:flex; align-items:center; gap:5px; font-size:13.5px; color:#555; font-weight:500; }
        .pd-dist { display:flex; align-items:center; gap:5px; font-size:13px; color:#777; }
        .pd-features { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; }
        .pd-feat { display:flex; flex-direction:column; align-items:center; gap:6px; background:#f8f9fb; border-radius:10px; padding:12px 6px 10px; border:1px solid #eef0f3; transition:background 0.2s, border-color 0.2s; text-align:center; }
        .pd-feat:hover { background:#f0f2f8; border-color:#d9dde8; }
        .pd-feat-icon { width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:#fff; border-radius:8px; box-shadow:0 1px 4px rgba(0,0,0,0.08); color:${PRIMARY}; }
        .pd-feat-val { font-size:14px; font-weight:800; color:#1a1a1a; }
        .pd-feat-label { font-size:10.5px; color:#888; font-weight:500; text-align:center; line-height:1.3; }

        /* ── Description ── */
        .pd-desc-card { background:#fff; border-radius:16px; padding:22px 24px; box-shadow:0 2px 12px rgba(0,0,0,0.07); }
        .pd-section-title { font-size:17px; font-weight:800; color:#1a1a1a; margin:0 0 12px; }
        .pd-desc-text { font-size:14px; color:#444; line-height:1.75; margin:0; overflow:hidden; transition:max-height 0.35s ease; }
        .pd-desc-text.clamped { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .pd-see-more { display:inline-block; margin-top:8px; font-size:13.5px; font-weight:600; color:#2980b9; background:none; border:none; cursor:pointer; padding:0; font-family:inherit; transition:opacity 0.2s; }
        .pd-see-more:hover { opacity:0.75; }

        /* ── Details ── */
        .pd-details-card { background:#fff; border-radius:16px; padding:22px 24px; box-shadow:0 2px 12px rgba(0,0,0,0.07); border-top:3px solid #4B6BFB; }
        .pd-details-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; }
        .pd-detail-row { display:flex; align-items:center; justify-content:space-between; padding:11px 0; border-bottom:1px solid #f3f4f6; font-size:13.5px; gap:12px; }
        .pd-detail-row:last-child { border-bottom:none; }
        .pd-details-col-left { border-right:1px solid #f0f0f0; padding-right:28px; }
        .pd-details-col-right { padding-left:28px; }
        .pd-detail-label { color:#666; font-weight:400; }
        .pd-detail-val { color:#1a1a1a; font-weight:700; text-align:right; }

        /* ── Tags ── */
        .pd-tags-wrap { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
        .pd-tag { display:inline-flex; align-items:center; padding:5px 12px; background:#f3e8ff; border:1.5px solid #d8b4fe; border-radius:20px; font-size:12.5px; font-weight:500; color:#7c3aed; }

        /* ═══════════════ RIGHT COLUMN ACTION PANEL (from buy/id) ═══════════════ */
        .pd-action-panel { background:#fff; border-radius:16px; border:1px solid #e5e7eb; padding:20px; box-shadow:0 2px 12px rgba(0,0,0,0.07); }
        .pd-action-panel .pd-name { font-size:20px; font-weight:900; color:#111; margin:0 0 4px; line-height:1.3; }
        .pd-action-panel .pd-category { font-size:13px; color:#6b7280; margin:0 0 10px; display:flex; align-items:center; gap:5px; }
        .pd-action-panel .pd-price-label { font-size:11px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 2px; }
        .pd-action-panel .pd-price-big { font-size:28px; font-weight:900; color:${PRIMARY}; margin:0 0 10px; }
        .pd-action-panel .pd-price-divider { width:40px; height:3px; background:${PRIMARY}; border-radius:2px; margin-bottom:14px; opacity:0.8; }
        .pd-action-panel .pd-loc { display:flex; align-items:center; gap:5px; font-size:13px; color:#6b7280; margin-bottom:14px; }
        .pd-action-panel .pd-desc { font-size:13.5px; color:#4b5563; line-height:1.7; margin-bottom:14px; }
        .pd-action-panel .pd-tags-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
        .pd-action-panel .pd-tag-pill { font-size:11px; font-weight:600; padding:4px 10px; border-radius:5px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
        .pd-action-panel .pd-details-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
        .pd-action-panel .pd-detail-item { background:#f9fafb; border-radius:8px; padding:10px 12px; border:1px solid #f0f0f0; }
        .pd-action-panel .pd-detail-label { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px; }
        .pd-action-panel .pd-detail-val { font-size:13px; font-weight:700; color:#111; }
        .pd-action-panel .pd-badges-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
        .pd-action-panel .pd-badge-delivery { display:inline-flex; align-items:center; gap:5px; background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; font-size:11.5px; font-weight:700; padding:5px 12px; border-radius:6px; }
        .pd-action-panel .pd-badge-warranty { display:inline-flex; align-items:center; gap:5px; background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-size:11.5px; font-weight:700; padding:5px 12px; border-radius:6px; }
        .pd-action-panel .pd-badge-negotiable { display:inline-flex; align-items:center; gap:5px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:11.5px; font-weight:700; padding:5px 12px; border-radius:6px; }
        .pd-action-panel .pd-avail { display:flex; align-items:center; gap:8px; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:10px 14px; font-size:12.5px; font-weight:700; color:#059669; margin-bottom:14px; }
        .pd-action-panel .pd-avail-dot { width:8px; height:8px; border-radius:50%; background:#10b981; flex-shrink:0; animation:bdpulse 1.4s infinite; }
        @keyframes bdpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .pd-action-panel .pd-actions { display:flex; gap:10px; }
        .pd-action-panel .pd-btn-buy { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:13px; background:${PRIMARY}; color:#fff; font-size:14px; font-weight:800; border:none; border-radius:9px; cursor:pointer; font-family:inherit; transition:background 0.15s, transform 0.15s; text-decoration:none; }
        .pd-action-panel .pd-btn-buy:hover { background:#a93226; transform:translateY(-1px); }
        .pd-action-panel .pd-btn-cart { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:13px; background:#fdf2f2; color:${PRIMARY}; border:1.5px solid #f5c6c6; font-size:14px; font-weight:800; border-radius:9px; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .pd-action-panel .pd-btn-cart:hover { background:${PRIMARY}; color:#fff; border-color:${PRIMARY}; transform:translateY(-1px); }
        .pd-action-panel .pd-btn-offer { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; padding:12px; margin-top:8px; background:#fff; color:#374151; border:1.5px solid #e5e7eb; font-size:14px; font-weight:700; border-radius:9px; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .pd-action-panel .pd-btn-offer:hover { background:#f9fafb; border-color:#d1d5db; }
        .pd-action-panel .pd-btn-phone { width:48px; height:48px; border-radius:9px; display:flex; align-items:center; justify-content:center; border:1.5px solid #e5e7eb; background:#f9fafb; color:#374151; cursor:pointer; transition:all 0.15s; }
        .pd-action-panel .pd-btn-phone:hover { background:#fce7f3; border-color:#fbcfe8; color:#be185d; }
        .pd-action-panel .pd-btn-share { width:48px; height:48px; border-radius:9px; display:flex; align-items:center; justify-content:center; border:1.5px solid #e5e7eb; background:#f9fafb; color:#374151; cursor:pointer; transition:all 0.15s; }
        .pd-action-panel .pd-btn-share:hover { background:#dbeafe; border-color:#93c5fd; color:#1d4ed8; }
        .pd-action-panel .pd-btn-chat { width:48px; height:48px; border-radius:9px; display:flex; align-items:center; justify-content:center; border:1.5px solid #e5e7eb; background:#f9fafb; color:#374151; cursor:pointer; transition:all 0.15s; }
        .pd-action-panel .pd-btn-chat:hover { background:#dcfce7; border-color:#86efac; color:#15803d; }

        /* ── Related ── */
        .pd-related-section { max-width:1200px; margin:0 auto; padding:28px 24px 0; }
        .pd-related-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .pd-related-title { font-size:20px; font-weight:800; color:#1a1a1a; margin:0; }
        .pd-related-viewall { font-size:13.5px; font-weight:600; color:${PRIMARY}; text-decoration:none; display:flex; align-items:center; gap:4px; transition:opacity 0.2s; }
        .pd-related-viewall:hover { opacity:0.75; }
        .pd-related-scroll { display:flex; gap:14px; overflow-x:auto; padding-bottom:12px; scrollbar-width:thin; scrollbar-color:#ddd transparent; }
        .pd-related-scroll::-webkit-scrollbar { height:5px; }
        .pd-related-scroll::-webkit-scrollbar-track { background:transparent; }
        .pd-related-scroll::-webkit-scrollbar-thumb { background:#ddd; border-radius:3px; }
        .pd-rel-card { flex-shrink:0; width:178px; background:#fff; border-radius:12px; overflow:hidden; border:1.5px solid #ebebeb; text-decoration:none; display:flex; flex-direction:column; transition:transform 0.22s, box-shadow 0.22s, border-color 0.22s; cursor:pointer; }
        .pd-rel-card:hover { transform:translateY(-4px); box-shadow:0 10px 30px rgba(0,0,0,0.1); border-color:#ddd; }
        .pd-rel-img-wrap { width:100%; height:120px; overflow:hidden; position:relative; background:#f8f8f8; }
        .pd-rel-img { width:100%; height:100%; object-fit:cover; transition:transform 0.3s; }
        .pd-rel-card:hover .pd-rel-img { transform:scale(1.07); }
        .pd-rel-body { padding:9px 10px 11px; display:flex; flex-direction:column; gap:3px; }
        .pd-rel-name { font-size:12px; font-weight:700; color:#1a1a1a; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin:0; }
        .pd-rel-price { font-size:12.5px; font-weight:800; color:${PRIMARY}; margin:2px 0 0; }
        .pd-rel-loc { font-size:10.5px; color:#999; margin:0; }

        @media (max-width: 900px) {
          .pd-container { grid-template-columns:1fr; }
          .pd-right { position:static; margin-top:18px; }
          .pd-features { grid-template-columns:repeat(2, 1fr); }
          .pd-details-grid { grid-template-columns:1fr; }
          .pd-details-col-left { border-right:none; padding-right:0; }
          .pd-details-col-right { padding-left:0; }
        }
        @media (max-width: 600px) {
          .pd-title { font-size:18px; }
          .pd-price { font-size:22px; }
          .pd-container { padding:0 14px; margin-top:18px; }
          .pd-related-section { padding:20px 14px 0; }
          .pd-main-img-wrap { height:260px; }
          .pd-thumbs { gap:6px; padding:10px; }
          .pd-thumb-wrap { width:72px; height:52px; }
          .pd-breadcrumb-inner { padding:0 14px; font-size:12px; }
          .pd-info-card, .pd-desc-card, .pd-details-card, .pd-action-panel { padding:16px 18px; }
          .pd-loc-row { gap:10px; }
          .pd-action-btns { gap:8px; }
          .pd-action-btn { width:34px; height:34px; }
          .pd-back-btn { margin:12px 14px 4px; }
        }
      `}</style>

      <div className="pd-page">
        <Link href="/user/wishlist" className="pd-back-btn">
          <FiArrowLeft size={16} /> Back to Wishlist
        </Link>

        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <div className="pd-breadcrumb-inner">
            <Link href="/" className="pd-bc-link">
              Home
            </Link>
            <span className="pd-bc-sep">›</span>
            <Link href="/user/wishlist" className="pd-bc-link">
              Wishlist
            </Link>
            <span className="pd-bc-sep">›</span>
            {categoryRoute && (
              <>
                <Link
                  href={`/category/${categoryRoute}`}
                  className="pd-bc-link"
                >
                  {categoryLabel}
                </Link>
                <span className="pd-bc-sep">›</span>
              </>
            )}
            <span className="pd-bc-current">{product.title}</span>
          </div>
        </nav>

        <div className="pd-container">
          {/* ═══════════════ LEFT COLUMN ═══════════════ */}
          <div className="pd-left">
            {/* ── Image Gallery ── */}
            <div className="pd-img-card">
              <div className="pd-main-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg] ?? "/placeholder.png"}
                  alt={product.title}
                  className="pd-main-img"
                />
              </div>
              {visibleThumbs.length > 0 && (
                <div className="pd-thumbs">
                  {visibleThumbs.map((src, i) => (
                    <div
                      key={i}
                      className={`pd-thumb-wrap${
                        activeImg === i ? " active" : ""
                      }`}
                      onClick={() => setActiveImg(i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`View ${i + 1}`}
                        className="pd-thumb-img"
                      />
                      {i === 4 && extraCount > 0 && (
                        <div className="pd-thumb-overlay">+{extraCount}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info Card ── */}
            <div className="pd-info-card">
              {seller?.isVerified && (
                <div className="pd-verified-badge">
                  <FiCheckCircle size={13} color="#1e8449" />
                  Verified Seller
                </div>
              )}

              <div className="pd-title-row">
                <h1 className="pd-title">{product.title}</h1>
                <div className="pd-action-btns">
                  <button
                    className="pd-action-btn"
                    onClick={handleShare}
                    title="Share"
                  >
                    <FiShare2 size={16} />
                  </button>
                  <button
                    className={`pd-action-btn${
                      isFav ? " fav-active" : ""
                    }`}
                    aria-label="Save to wishlist"
                    onClick={toggleFavorite}
                    disabled={favLoading}
                    title="Save"
                  >
                    {isFav ? (
                      <FaHeart size={16} />
                    ) : (
                      <FiHeart size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pd-price">
                {formatPrice(product.price, product.currency)}
                {product.negotiable && (
                  <span className="pd-price-neg">Negotiable</span>
                )}
              </div>

              <div className="pd-loc-row">
                {product.location && (
                  <span className="pd-location">
                    <FiMapPin size={13} color="#888" />
                    {product.location}
                  </span>
                )}
                {product.postedDaysAgo != null && (
                  <span className="pd-dist">
                    <FiClock size={13} color="#aaa" />
                    {timeAgo(product.postedDaysAgo)}
                  </span>
                )}
                {product.condition && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: "#dbeafe",
                      color: "#1d4ed8",
                    }}
                  >
                    <FiShield size={11} />
                    {product.condition}
                  </span>
                )}
              </div>

              {specIcons.length > 0 && (
                <div className="pd-features">
                  {specIcons.map((spec, i) => (
                    <div key={i} className="pd-feat">
                      <div className="pd-feat-icon">
                        <FiBox size={22} />
                      </div>
                      <span className="pd-feat-val">{spec.value}</span>
                      <span className="pd-feat-label">{spec.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Description ── */}
            {product.description && (
              <div className="pd-desc-card">
                <h2 className="pd-section-title">Description</h2>
                <p
                  className={`pd-desc-text${
                    showFullDesc ? "" : " clamped"
                  }`}
                >
                  {product.description}
                </p>
                {product.description.length > 180 && (
                  <button
                    className="pd-see-more"
                    onClick={() => setShowFullDesc((v) => !v)}
                  >
                    {showFullDesc ? "See Less ▲" : "See More ▼"}
                  </button>
                )}
              </div>
            )}

            {/* ── Details ── */}
            {detailEntries.length > 0 && (
              <div className="pd-details-card">
                <h2 className="pd-section-title">
                  {categoryLabel} Details
                </h2>
                <div className="pd-details-grid">
                  <div className="pd-details-col-left">
                    {leftDetails.map((d) => (
                      <div className="pd-detail-row" key={d.label}>
                        <span className="pd-detail-label">
                          {d.label}
                        </span>
                        <span className="pd-detail-val">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pd-details-col-right">
                    {rightDetails.map((d) => (
                      <div className="pd-detail-row" key={d.label}>
                        <span className="pd-detail-label">
                          {d.label}
                        </span>
                        <span className="pd-detail-val">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Features / Tags ── */}
            {(product.features?.length || product.tags?.length) ? (
              <div className="pd-desc-card">
                <h2 className="pd-section-title">Features & Tags</h2>
                <div className="pd-tags-wrap">
                  {(product.features ?? []).map((f) => (
                    <span key={f} className="pd-tag">
                      {f}
                    </span>
                  ))}
                  {(product.tags ?? []).map((t) => (
                    <span
                      key={t}
                      className="pd-tag"
                      style={{
                        background: "#f0fdf4",
                        borderColor: "#bbf7d0",
                        color: "#15803d",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* ═══════════════ RIGHT COLUMN (from buy/id) ═══════════════ */}
          <div className="pd-right">
            {/* ── Action / Seller Panel ── */}
            <div className="pd-action-panel">
              <h1 className="pd-name">{product.title}</h1>
              <p className="pd-category">
                <FiTag size={11} color="#9ca3af" />
                {categoryLabel}
              </p>

              <p className="pd-price-label">Price</p>
              <p className="pd-price-big">
                {formatPrice(product.price, product.currency)}
              </p>
              <div className="pd-price-divider" />

              {seller && (
                <div style={{ marginBottom: 12 }}>
                  <StarRating
                    rating={seller.rating ?? 0}
                    count={product.reviews?.length ?? 0}
                  />
                </div>
              )}

              {product.location && (
                <div className="pd-loc">
                  <FiMapPin size={14} />
                  {product.location}
                </div>
              )}

              {product.description && (
                <p className="pd-desc">
                  {product.description.length > 120
                    ? product.description.slice(0, 120) + "…"
                    : product.description}
                </p>
              )}

              {(product.tags ?? []).length > 0 && (
                <div className="pd-tags-row">
                  {(product.tags ?? []).map((tag) => (
                    <span key={tag} className="pd-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {(product.details ?? []).length > 0 && (
                <div className="pd-details-grid">
                  {(product.details ?? []).slice(0, 4).map((d) => (
                    <div key={d.label} className="pd-detail-item">
                      <p className="pd-detail-label">{d.label}</p>
                      <p className="pd-detail-val">{d.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pd-badges-row">
              
                {product.deliveryAvailable && (
                  <span className="pd-badge-delivery">
                    <FiTruck size={11} /> Free Delivery
                  </span>
                )}
               
                {product.warrantyAvailable && (
                  <span className="pd-badge-warranty">
                    <FiShield size={11} /> Warranty Included
                  </span>
                )}
                {product.negotiable && (
                  <span className="pd-badge-negotiable">
                    <FiRotateCcw size={11} /> Price Negotiable
                  </span>
                )}
              </div>

              <div className="pd-avail">
                <span className="pd-avail-dot" />
                Item Available — Ready to Ship
              </div>

              <div className="pd-actions">
                <button className="pd-btn-buy" onClick={buyNow}>
                  <FiShoppingCart size={16} />
                  Buy Now
                </button>
                <button className="pd-btn-cart" onClick={addToCart}>
                  <FiShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
              <button className="pd-btn-offer" onClick={makeOffer}>
                <FiCalendar size={16} />
                Make an Offer
              </button>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <button
                  className="pd-btn-phone"
                  onClick={() => handleContact("call")}
                  title="Call seller"
                >
                  <FiPhone size={16} />
                </button>
                <button
                  className="pd-btn-chat"
                  onClick={() => handleContact("chat")}
                  title="Chat with seller"
                >
                  <FiMessageSquare size={16} />
                </button>
                <button
                  className="pd-btn-share"
                  onClick={handleShare}
                  title="Share"
                >
                  <FiShare2 size={16} />
                </button>
              </div>
            </div>

            {/* ── Seller Card ── */}
            {seller && (
              <SellerCard
                seller={{
                  ...seller,
                  avatar:
                    seller.avatar ??
                    seller.image ??
                    "/default-avatar.png",
                  isPro: seller.isPro ?? false,
                  isTrusted: seller.isTrusted ?? false,
                  responseRate: seller.responseRate ?? "N/A",
                  avgResponseTime: seller.avgResponseTime ?? "N/A",
                }}
                reviews={product.reviews ?? []}
                listingId={product.id}
                sellerId={seller.id}
              />
            )}
          </div>
        </div>

        {/* ═══════════════ RELATED LISTINGS ═══════════════ */}
        {related.length > 0 && (
          <div className="pd-related-section">
            <div className="pd-related-header">
              <h2 className="pd-related-title">Related Listings</h2>
              {categoryRoute && (
                <Link
                  href={`/category/${categoryRoute}`}
                  className="pd-related-viewall"
                >
                  View All →
                </Link>
              )}
            </div>
            <div className="pd-related-scroll">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/category/${
                    detectCategoryRoute(item.category) ?? "products"
                  }/${item.id}`}
                  className="pd-rel-card"
                >
                  <div className="pd-rel-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="pd-rel-img"
                    />
                  </div>
                  <div className="pd-rel-body">
                    <p className="pd-rel-name">{item.title}</p>
                    <p className="pd-rel-price">{item.price}</p>
                    <p className="pd-rel-loc">{item.location}</p>
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