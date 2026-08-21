"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import SellerCard from "@/components/SellerCard";
import type { WishlistProduct, RelatedItem, Toast } from "@/app/types/wishlist";
import { toRelatedCard, detectCategoryRoute, getCategoryLabel, timeAgo } from "@/lib/adapters/wishlistAdapter";
import { useSession } from "next-auth/react";
import {
  FiArrowLeft,
  FiMapPin,
  FiHeart,
  FiShare2,
  FiShoppingCart,
  FiCheckCircle,
  FiStar,
  FiClock,
  FiShield,
  FiTruck,
  FiRotateCcw,
  FiCheck,
  FiFrown,
  FiZap,
  FiTag,
  FiPhone,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/* ── Helpers ── */
function prefixImage(path: string | undefined | null): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function formatPrice(price: number | undefined, currency?: string): string {
  if (price == null) return "Price on call";
  return `${currency ?? "NPR"} ${price.toLocaleString("en-IN")}`;
}

/* ─────────── STYLES ─────────── */
const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; }
html, body { overflow-x: hidden; }
.wl-wrap { min-height: 100vh; background: #f5f5f5; font-family: 'Inter', -apple-system, sans-serif; }

.toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.toast-item { display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: #fff; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #10b981; font-size: 13px; font-weight: 600; color: #111827; animation: toastSlide 0.35s cubic-bezier(0.32, 0.72, 0, 1); pointer-events: auto; min-width: 260px; max-width: 360px; }
.toast-item.info { border-left-color: #3b82f6; }
.toast-item.error { border-left-color: #ef4444; }
@keyframes toastSlide { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

.wl-breadcrumb-bar { background: #fff; border-bottom: 1px solid #e5e7eb; }
.wl-breadcrumb-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9ca3af; }
.wl-breadcrumb-inner a { color: #9ca3af; text-decoration: none; transition: color 0.15s; }
.wl-breadcrumb-inner a:hover { color: #C0392B; }
.wl-breadcrumb-inner span.active { color: #374151; font-weight: 600; }

.wl-body { max-width: 1200px; margin: 0 auto; padding: 24px 20px 60px; }

.wl-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #6b7280; text-decoration: none; margin-bottom: 18px; transition: color 0.15s; }
.wl-back:hover { color: #C0392B; }

.wl-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; align-items: start; }

.wl-img-section { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.wl-main-img-wrap { position: relative; width: 100%; height: 420px; overflow: hidden; background: #e5e7eb; }
.wl-main-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
.wl-main-img-wrap:hover .wl-main-img { transform: scale(1.04); }
.wl-img-cat-badge { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.4px; }
.wl-img-fav-btn { position: absolute; top: 10px; left: 10px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.92); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: transform 0.15s; padding: 0; }
.wl-img-fav-btn:hover { transform: scale(1.12); }
.wl-posted-tag { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.58); color: #fff; font-size: 10px; font-weight: 600; border-radius: 6px; padding: 3px 8px; backdrop-filter: blur(4px); }
.wl-delivery-tag { position: absolute; bottom: 10px; right: 10px; background: rgba(16,185,129,0.88); color: #fff; font-size: 10px; font-weight: 700; border-radius: 6px; padding: 3px 8px; display: flex; align-items: center; gap: 4px; }

.wl-thumb-strip { display: flex; gap: 8px; margin-top: 10px; padding: 0 2px; }
.wl-thumb { width: 64px; height: 64px; border-radius: 8px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s, opacity 0.15s, transform 0.15s; flex-shrink: 0; background: #e5e7eb; }
.wl-thumb:hover { opacity: 0.85; transform: translateY(-1px); }
.wl-thumb.active { border-color: #C0392B; }

.wl-right { display: flex; flex-direction: column; gap: 16px; }

.wl-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

.wl-name { font-size: 22px; font-weight: 900; color: #111; margin: 0 0 6px; }
.wl-category { font-size: 13px; color: #6b7280; margin: 0 0 10px; }
.wl-price-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 2px; }
.wl-price { font-size: 26px; font-weight: 900; color: #C0392B; margin: 0 0 12px; }
.wl-price-divider { width: 40px; height: 3px; background: #C0392B; border-radius: 2px; margin-bottom: 14px; }
.wl-location { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #6b7280; margin-bottom: 14px; }
.wl-desc { font-size: 13.5px; color: #4b5563; line-height: 1.7; margin-bottom: 16px; }

.wl-tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.wl-tag-pill { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 5px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

.wl-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.wl-detail-item { background: #f9fafb; border-radius: 8px; padding: 10px 12px; border: 1px solid #f0f0f0; }
.wl-detail-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
.wl-detail-val { font-size: 13px; font-weight: 700; color: #111; }

.wl-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.wl-badge-delivery { display: inline-flex; align-items: center; gap: 5px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
.wl-badge-warranty { display: inline-flex; align-items: center; gap: 5px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
.wl-badge-negotiable { display: inline-flex; align-items: center; gap: 5px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }

.wl-avail { display: flex; align-items: center; gap: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #059669; margin-bottom: 14px; }
.wl-avail-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; flex-shrink: 0; animation: wlpulse 1.4s infinite; }
@keyframes wlpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.wl-actions { display: flex; gap: 10px; }
.wl-btn-buy { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 13px; background: #C0392B; color: #fff; font-size: 14px; font-weight: 800; border: none; border-radius: 9px; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.15s; text-decoration: none; }
.wl-btn-buy:hover { background: #a93226; transform: translateY(-1px); }
.wl-btn-cart { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 13px; background: #fff0f0; color: #C0392B; border: 1.5px solid #fecaca; font-size: 14px; font-weight: 800; border-radius: 9px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.wl-btn-cart:hover { background: #C0392B; color: #fff; border-color: #C0392B; transform: translateY(-1px); }
.wl-btn-offer { width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 12px; margin-top: 8px; background: #fff; color: #374151; border: 1.5px solid #e5e7eb; font-size: 14px; font-weight: 700; border-radius: 9px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.wl-btn-offer:hover { background: #f9fafb; border-color: #d1d5db; }
.wl-btn-phone { width: 48px; height: 48px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; background: #f9fafb; color: #374151; cursor: pointer; transition: all 0.15s; }
.wl-btn-phone:hover { background: #fce7f3; border-color: #fbcfe8; color: #be185d; }
.wl-btn-share { width: 48px; height: 48px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; background: #f9fafb; color: #374151; cursor: pointer; transition: all 0.15s; }
.wl-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }

.wl-tips { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 16px; }
.wl-tips-title { font-size: 12px; font-weight: 800; color: #1d4ed8; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.wl-tip-item { display: flex; align-items: flex-start; gap: 6px; font-size: 11.5px; color: #1e40af; margin-bottom: 5px; line-height: 1.5; }
.wl-tip-item:last-child { margin-bottom: 0; }

.wl-reviews-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-top: 16px; }
.wl-review-item { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
.wl-review-item:last-child { border-bottom: none; }
.wl-review-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.wl-review-name { font-size: 13px; font-weight: 700; color: #111; }
.wl-review-date { font-size: 11px; color: #9ca3af; }
.wl-review-comment { font-size: 12.5px; color: #4b5563; margin: 4px 0 0; line-height: 1.5; }

.wl-related { margin-top: 32px; }
.wl-related-title { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 14px; }
.wl-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.wl-rel-card { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; text-decoration: none; color: inherit; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
.wl-rel-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.wl-rel-img-wrap { aspect-ratio: 16/11; overflow: hidden; background: #e5e7eb; }
.wl-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.wl-rel-card:hover .wl-rel-img { transform: scale(1.05); }
.wl-rel-body { padding: 10px 12px; }
.wl-rel-name { font-size: 13.5px; font-weight: 700; color: #111; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wl-rel-price { font-size: 13px; font-weight: 800; color: #C0392B; }
.wl-rel-loc { font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 3px; margin-top: 3px; }
.wl-rel-rating { display: flex; align-items: center; gap: 2px; margin-top: 4px; }

.wl-404 { min-height: 80vh; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column; text-align: center; padding: 40px 20px; }
.wl-404-icon { color: #d1d5db; margin-bottom: 16px; }
.wl-404 h1 { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 6px; }
.wl-404 p { font-size: 14px; color: #9ca3af; margin: 0 0 20px; }
.wl-back-btn { display: inline-flex; align-items: center; gap: 6px; background: #C0392B; color: #fff; font-weight: 700; font-size: 14px; padding: 11px 28px; border-radius: 8px; text-decoration: none; transition: background 0.15s, transform 0.15s; }
.wl-back-btn:hover { background: #a93226; transform: translateY(-1px); }
.wl-back-btn:active { transform: scale(0.97); }

.wl-error { min-height: 60vh; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column; text-align: center; padding: 40px 20px; }
.wl-error-icon { color: #ef4444; margin-bottom: 16px; }
.wl-error h1 { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 6px; }
.wl-error p { font-size: 14px; color: #9ca3af; margin: 0 0 20px; }
.wl-error-btn { display: inline-flex; align-items: center; gap: 6px; background: #C0392B; color: #fff; font-weight: 700; font-size: 14px; padding: 11px 28px; border-radius: 8px; border: none; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.15s; }
.wl-error-btn:hover { background: #a93226; transform: translateY(-1px); }
.wl-error-btn:active { transform: scale(0.97); }

.wl-skeleton-main { width: 100%; height: 420px; background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%); background-size: 200% 100%; animation: skeletonPulse 1.2s infinite; border-radius: 12px; }
.wl-skeleton-line { height: 16px; background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%); background-size: 200% 100%; animation: skeletonPulse 1.2s infinite; border-radius: 4px; margin-bottom: 10px; }
.wl-skeleton-line.short { width: 50%; }
.wl-skeleton-line.xshort { width: 30%; }
.wl-skeleton-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; }
@keyframes skeletonPulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (max-width: 900px) {
  .wl-grid { grid-template-columns: 1fr; }
  .wl-related-grid { grid-template-columns: repeat(2, 1fr); }
  .toast-container { right: 12px; top: 12px; }
}
@media (max-width: 540px) {
  .wl-body { padding: 16px 14px 40px; }
  .wl-related-grid { grid-template-columns: 1fr; }
  .wl-thumb { width: 56px; height: 56px; }
  .wl-main-img-wrap { height: 280px; }
  .wl-details-grid { grid-template-columns: 1fr; }
  .toast-item { min-width: auto; max-width: calc(100vw - 24px); font-size: 12px; padding: 10px 14px; }
}
`;

/* ─────────── COMPONENT ─────────── */
export default function WishlistDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [product, setProduct] = useState<WishlistProduct | null>(null);
  const [similarItems, setSimilarItems] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const { data: session } = useSession();

  /* ─── FETCH PRODUCT (dynamic, like your original) ─── */
  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setActiveImg(0); // reset image on new product
    try {
      const res = await fetch(`${API_BASE}/api/listings/${id}`, { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 404) {
          setProduct(null);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch product");
      }
      const data: WishlistProduct = await res.json();

      /* Normalize images */
      if (data.images) {
        data.images = data.images.map(prefixImage);
      } else if (data.image) {
        data.images = [prefixImage(data.image)];
      } else {
        data.images = ["/placeholder.png"];
      }

      /* Normalize seller */
      const rawSeller = data.seller ?? data.user ?? data.owner ?? {};
      data.seller = {
        id: rawSeller.id ?? rawSeller._id ?? data.sellerId ?? undefined,
        name: rawSeller.name ?? rawSeller.fullName ?? data.sellerName ?? "Seller",
        image: rawSeller.image ?? rawSeller.avatar ?? rawSeller.photo ?? null,
        avatar: rawSeller.avatar ?? rawSeller.image ?? rawSeller.photo ?? null,
        phone: rawSeller.phone ?? rawSeller.phoneNumber ?? data.sellerPhone ?? undefined,
        email: rawSeller.email ?? data.sellerEmail ?? undefined,
        isVerified: rawSeller.isVerified ?? rawSeller.verified ?? false,
        isPro: rawSeller.isPro ?? rawSeller.pro ?? false,
        isTrusted: rawSeller.isTrusted ?? rawSeller.trusted ?? false,
        rating: typeof rawSeller.rating === "number" ? rawSeller.rating : 0,
        responseRate: rawSeller.responseRate ?? "N/A",
        avgResponseTime: rawSeller.avgResponseTime ?? "N/A",
      };

      /* Normalize reviews */
      if (data.reviews && Array.isArray(data.reviews)) {
        data.reviews = data.reviews.map((r: any) => ({
          reviewerName: r.reviewerName ?? r.user?.name ?? "Anonymous",
          rating: r.rating ?? 5,
          comment: r.comment ?? r.text ?? "",
          createdAt: r.createdAt ?? r.date ?? "",
        }));
      } else {
        data.reviews = [];
      }

      setProduct(data);
      setIsFav(data.isFavorited ?? true);

      /* Fetch similar items */
      if (data.category) {
        const similarRes = await fetch(
          `${API_BASE}/api/listings?category=${encodeURIComponent(data.category)}&limit=8`,
          { cache: "no-store" }
        );
        if (similarRes.ok) {
          const json = await similarRes.json();
          const list = Array.isArray(json) ? json : json.listings ?? json.data ?? [];
          const cards: RelatedItem[] = list
            .filter((r: any) => r.id !== data.id)
            .slice(0, 8)
            .map((r: any) => toRelatedCard(r));
          setSimilarItems(cards);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      showToast("Failed to load product", "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  /* ─── WISHLIST CHECK ─── */
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

  /* ─── TOAST HELPERS ─── */
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const tid = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id: tid, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== tid));
    }, 2500);
  };

  /* ─── ACTIONS ─── */
  const toggleFav = async () => {
    if (!session?.accessToken) {
      showToast("Please log in to manage wishlist", "error");
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
      showToast(data.favorited ? "Added to wishlist" : "Removed from wishlist", "info");
    } catch {
      setIsFav(prev);
      showToast("Something went wrong", "error");
    } finally {
      setFavLoading(false);
    }
  };

  const shareItem = () => {
    if (navigator.share) {
      navigator.share({ title: product?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "info");
    }
  };

  const addToCart = () => {
    if (!product) return;
    showToast(`${product.title} added to cart`);
  };

  const buyNow = () => {
    if (!product) return;
    showToast(`${product.title} added to cart — Proceeding to checkout...`);
  };

  const makeOffer = () => {
    if (!product) return;
    showToast("Offer sent to seller!", "info");
  };

  const handleContact = (type: "chat" | "call") => {
    if (type === "call" && product?.seller?.phone) {
      window.location.href = `tel:${product.seller.phone}`;
    } else {
      showToast("Opening chat...", "info");
    }
  };

  /* ─── DYNAMIC SPECS (exactly like your original detail page) ─── */
  const dynamicSpecs: Record<string, string> = {};
  const specFields = [
    "brand", "model", "year", "mileage", "color", "warranty", "delivery",
    "fuelType", "transmission", "engine", "ram", "storage", "screenSize",
    "material", "size", "weight", "dimensions", "propertyType", "bedrooms",
    "bathrooms", "squareFeet", "furnished", "listingType", "jobType",
    "experience", "qualification", "salary", "employmentType",
  ];
  if (product) {
    specFields.forEach((key) => {
      if (product[key] != null && product[key] !== "") {
        dynamicSpecs[key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())] = String(product[key]);
      }
    });
    if (product.specs) {
      Object.entries(product.specs).forEach(([k, v]) => {
        dynamicSpecs[k] = String(v);
      });
    }
  }
  const specEntries = Object.entries(dynamicSpecs);

  /* ─── RENDER HELPERS ─── */
  const categoryRoute = product ? detectCategoryRoute(product.category) : null;
  const categoryLabel = getCategoryLabel(categoryRoute);
  const locationText = product?.location ?? (product?.area && product?.city ? `${product.area}, ${product.city}` : product?.city ?? "");

  const getConditionBadgeStyle = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case "new": return { background: "#10b981", color: "#fff" };
      case "used": return { background: "#f43f5e", color: "#fff" };
      default: return { background: "#6b7280", color: "#fff" };
    }
  };

  const renderStars = (rating?: number) => {
    const fullStars = Math.floor(rating ?? 0);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar key={i} size={14} fill={i < fullStars ? "#f59e0b" : "none"} color={i < fullStars ? "#f59e0b" : "#d1d5db"} />
        ))}
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111", marginLeft: 6 }}>{(rating ?? 0).toFixed(1)}</span>
      </div>
    );
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case "info": return "#3b82f6";
      case "error": return "#ef4444";
      default: return "#10b981";
    }
  };

  const images = product?.images ?? [];
  const badge = product?.condition
    ? product.condition.charAt(0).toUpperCase() + product.condition.slice(1)
    : undefined;

  /* ─── 404 STATE ─── */
  if (!loading && !product && !error) {
    return (
      <>
        <style>{pageStyles}</style>
        <div className="wl-404">
          <FiFrown size={56} className="wl-404-icon" />
          <h1>Product Not Found</h1>
          <p>The item you are looking for does not exist in your wishlist.</p>
          <Link href="/user/wishlist" className="wl-back-btn"><FiArrowLeft size={14} /> Back to Wishlist</Link>
        </div>
        <Footer />
      </>
    );
  }

  const badgeStyle = product ? getConditionBadgeStyle(product.condition) : {};

  return (
    <>
      <style>{pageStyles}</style>

      {/* ─── TOAST NOTIFICATIONS ─── */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            <FiCheckCircle size={16} color={getToastColor(t.type)} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <div className="wl-wrap">
        {/* Breadcrumb */}
        <div className="wl-breadcrumb-bar">
          <div className="wl-breadcrumb-inner">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/user/wishlist">Wishlist</Link>
            <span>/</span>
            {product && categoryRoute && (
              <><Link href={`/category/${categoryRoute}`}>{categoryLabel}</Link><span>/</span></>
            )}
            <span className="active">{product?.title ?? "Loading..."}</span>
          </div>
        </div>

        {loading ? (
          <div className="wl-body">
            <div className="wl-grid">
              <div>
                <div className="wl-skeleton-main" />
                <div style={{ marginTop: 16 }}>
                  <div className="wl-skeleton-line" />
                  <div className="wl-skeleton-line short" />
                  <div className="wl-skeleton-line xshort" />
                </div>
              </div>
              <div className="wl-skeleton-panel">
                <div className="wl-skeleton-line" />
                <div className="wl-skeleton-line short" />
                <div className="wl-skeleton-line xshort" />
                <div className="wl-skeleton-line" style={{ marginTop: 20 }} />
                <div className="wl-skeleton-line short" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="wl-error">
            <FiAlertCircle size={56} className="wl-error-icon" />
            <h1>Error loading product</h1>
            <p>{error}</p>
            <button className="wl-error-btn" onClick={fetchProduct}><FiRefreshCw size={14} /> Try Again</button>
          </div>
        ) : product ? (
          <>
            <div className="wl-body">
              <Link href="/user/wishlist" className="wl-back"><FiArrowLeft size={14} /> Back to wishlist</Link>

              <div className="wl-grid">
                {/* LEFT COLUMN */}
                <div>
                  <div className="wl-img-section">
                    <div className="wl-main-img-wrap">
                      <img src={images[activeImg] ?? images[0] ?? "/placeholder.png"} alt={product.title} className="wl-main-img" />
                      {badge && <span className="wl-img-cat-badge" style={badgeStyle}>{badge}</span>}
                      <button className="wl-img-fav-btn" onClick={toggleFav} disabled={favLoading}>
                        {isFav ? <FaHeart size={18} color="#ef4444" /> : <FaHeart size={18} color="#d1d5db" />}
                      </button>
                      <span className="wl-posted-tag"><FiClock size={10} style={{ marginRight: 4 }} />{timeAgo(product.postedDaysAgo)}</span>
                      {product.deliveryAvailable && <span className="wl-delivery-tag"><FiTruck size={10} /> Delivery Available</span>}
                    </div>
                  </div>

                  {images.length > 1 && (
                    <div className="wl-thumb-strip">
                      {images.map((img, idx) => (
                        <img key={idx} src={img} alt={`${product.title} ${idx + 1}`} className={`wl-thumb${activeImg === idx ? " active" : ""}`} onClick={() => setActiveImg(idx)} />
                      ))}
                    </div>
                  )}

                  <div className="wl-tips" style={{ marginTop: 16 }}>
                    <p className="wl-tips-title"><FiZap size={14} /> Safety Tips</p>
                    <div className="wl-tip-item"><FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />Meet in a safe public place for inspection</div>
                    <div className="wl-tip-item"><FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />Inspect the item thoroughly before paying</div>
                    <div className="wl-tip-item"><FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />Never pay in advance without seeing the product</div>
                    <div className="wl-tip-item"><FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />Check original documents for vehicles and property</div>
                  </div>

                  {product.reviews && product.reviews.length > 0 && (
                    <div className="wl-reviews-panel">
                      <p className="wl-tips-title" style={{ color: "#111", marginBottom: 12 }}><FiStar size={14} /> Reviews</p>
                      {product.reviews.map((r, i) => (
                        <div key={i} className="wl-review-item">
                          <div className="wl-review-head"><span className="wl-review-name">{r.reviewerName}</span><span className="wl-review-date">{r.createdAt}</span></div>
                          {renderStars(r.rating)}
                          {r.comment && <p className="wl-review-comment">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="wl-right">
                  <div className="wl-panel">
                    <h1 className="wl-name">{product.title}</h1>
                    <p className="wl-category"><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><FiTag size={11} color="#9ca3af" />{categoryLabel}</span></p>
                    <p className="wl-price-label">Price</p>
                    <p className="wl-price">{formatPrice(product.price, product.currency)}{product.negotiable && <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, marginLeft: 8 }}>(Negotiable)</span>}</p>
                    <div className="wl-price-divider" />
                    <div style={{ marginBottom: 12 }}>{renderStars(product.seller?.rating)}</div>
                    <div className="wl-location"><FiMapPin size={14} />{locationText}</div>
                    {product.description && <p className="wl-desc">{product.description}</p>}

                    {/* ── DYNAMIC TAGS ── */}
                    {(product.features?.length || product.tags?.length) ? (
                      <div className="wl-tags-row">
                        {(product.features ?? product.tags ?? []).map((tag) => <span key={tag} className="wl-tag-pill">{tag}</span>)}
                      </div>
                    ) : null}

                    {/* ── DYNAMIC DETAILS (exactly like your original) ── */}
                    {specEntries.length > 0 && (
                      <div className="wl-details-grid">
                        {specEntries.map(([k, v]) => (
                          <div key={k} className="wl-detail-item">
                            <p className="wl-detail-label">{k}</p>
                            <p className="wl-detail-val">{v}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="wl-badges-row">
                      {product.deliveryAvailable && <span className="wl-badge-delivery"><FiTruck size={11} /> Free Delivery</span>}
                      {product.warrantyAvailable && <span className="wl-badge-warranty"><FiShield size={11} /> Warranty Included</span>}
                      {product.negotiable && <span className="wl-badge-negotiable"><FiRotateCcw size={11} /> Price Negotiable</span>}
                    </div>

                    <div className="wl-avail"><span className="wl-avail-dot" />Item Available — Ready to Ship</div>

                    <div className="wl-actions">
                      <button className="wl-btn-buy" onClick={buyNow}><FiShoppingCart size={16} />Buy Now</button>
                      <button className="wl-btn-cart" onClick={addToCart}><FiShoppingCart size={16} />Add to Cart</button>
                    </div>
                    <button className="wl-btn-offer" onClick={makeOffer}><FiCalendar size={16} />Make an Offer</button>

                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      {product.seller?.phone && <button className="wl-btn-phone" onClick={() => handleContact("call")} title="Call Seller"><FiPhone size={16} /></button>}
                      <button className="wl-btn-share" onClick={shareItem} title="Share"><FiShare2 size={16} /></button>
                    </div>
                  </div>

                  <SellerCard
                    seller={{
                      name: product.seller?.name || "Seller",
                      avatar: product.seller?.avatar ?? product.seller?.image ?? "/default-avatar.png",
                      rating: product.seller?.rating ?? 0,
                      reviewCount: product.reviews?.length ?? 0,
                      isVerified: product.seller?.isVerified ?? false,
                      isPro: product.seller?.isPro ?? false,
                      isTrusted: product.seller?.isTrusted ?? false,
                      memberSince: product.seller?.memberSince ?? "",
                      totalListing: product.seller?.totalListings ?? 0,
                      responseRate: product.seller?.responseRate ?? "N/A",
                      avgResponseTime: product.seller?.avgResponseTime ?? "N/A",
                      phone: product.seller?.phone ?? "",
                    }}
                    reviews={(product.reviews ?? []) as any}
                    listingId={product.id}
                    sellerId={product.seller?.id}
                  />
                </div>
              </div>

              {similarItems.length > 0 && (
                <div className="wl-related">
                  <p className="wl-related-title">Similar Items in {categoryLabel}</p>
                  <div className="wl-related-grid">
                    {similarItems.map((item) => (
                      <Link key={item.id} href={`/user/wishlist/${item.id}`} className="wl-rel-card">
                        <div className="wl-rel-img-wrap"><img src={item.thumb} alt={item.title} className="wl-rel-img" /></div>
                        <div className="wl-rel-body">
                          <p className="wl-rel-name">{item.title}</p>
                          <p className="wl-rel-price">{item.priceDisplay}</p>
                          <p className="wl-rel-loc"><FiMapPin size={10} />{item.location}</p>
                          <div className="wl-rel-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar key={i} size={10} fill={i < Math.floor(item.seller.rating ?? 0) ? "#f59e0b" : "none"} color={i < Math.floor(item.seller.rating ?? 0) ? "#f59e0b" : "#d1d5db"} />
                            ))}
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#111", marginLeft: 3 }}>{(item.seller.rating ?? 0).toFixed(1)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Footer />
          </>
        ) : null}
      </div>
    </>
  );
}