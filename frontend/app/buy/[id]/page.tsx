"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import SellerCard from "@/components/SellerCard";
import type { BuyProduct } from "@/app/types/buy";
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
import { toBuyDetail, toBuyCard } from "@/lib/buyAdapter";
import type { RawListing } from "@/lib/buyAdapter";


/* ─────────── TOAST TYPE ─────────── */
interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

/* ─────────── STYLES ─────────── */
const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; }
html, body { overflow-x: hidden; }
.bd-wrap { min-height: 100vh; background: #f5f5f5; font-family: 'Inter', -apple-system, sans-serif; }

.toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.toast-item { display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: #fff; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #10b981; font-size: 13px; font-weight: 600; color: #111827; animation: toastSlide 0.35s cubic-bezier(0.32, 0.72, 0, 1); pointer-events: auto; min-width: 260px; max-width: 360px; }
.toast-item.info { border-left-color: #3b82f6; }
.toast-item.error { border-left-color: #ef4444; }
@keyframes toastSlide { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

.bd-breadcrumb-bar { background: #fff; border-bottom: 1px solid #e5e7eb; }
.bd-breadcrumb-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9ca3af; }
.bd-breadcrumb-inner a { color: #9ca3af; text-decoration: none; transition: color 0.15s; }
.bd-breadcrumb-inner a:hover { color: #e11d48; }
.bd-breadcrumb-inner span.active { color: #374151; font-weight: 600; }

.bd-body { max-width: 1200px; margin: 0 auto; padding: 24px 20px 60px; }

.bd-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #6b7280; text-decoration: none; margin-bottom: 18px; transition: color 0.15s; }
.bd-back:hover { color: #e11d48; }

.bd-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; align-items: start; }

.bd-img-section { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.bd-main-img-wrap { position: relative; width: 100%; height: 420px; overflow: hidden; background: #e5e7eb; }
.bd-main-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bd-img-cat-badge { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.4px; }
.bd-img-fav-btn { position: absolute; top: 10px; left: 10px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.92); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: transform 0.15s; padding: 0; }
.bd-img-fav-btn:hover { transform: scale(1.12); }
.bd-posted-tag { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.58); color: #fff; font-size: 10px; font-weight: 600; border-radius: 6px; padding: 3px 8px; backdrop-filter: blur(4px); }
.bd-delivery-tag { position: absolute; bottom: 10px; right: 10px; background: rgba(16,185,129,0.88); color: #fff; font-size: 10px; font-weight: 700; border-radius: 6px; padding: 3px 8px; display: flex; align-items: center; gap: 4px; }

.bd-thumb-strip { display: flex; gap: 8px; margin-top: 10px; padding: 0 2px; }
.bd-thumb { width: 64px; height: 64px; border-radius: 8px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s, opacity 0.15s, transform 0.15s; flex-shrink: 0; background: #e5e7eb; }
.bd-thumb:hover { opacity: 0.85; transform: translateY(-1px); }
.bd-thumb.active { border-color: #e11d48; }

.bd-right { display: flex; flex-direction: column; gap: 16px; }

.bd-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

.bd-name { font-size: 22px; font-weight: 900; color: #111; margin: 0 0 6px; }
.bd-category { font-size: 13px; color: #6b7280; margin: 0 0 10px; }
.bd-price-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 2px; }
.bd-price { font-size: 26px; font-weight: 900; color: #e11d48; margin: 0 0 12px; }
.bd-price-divider { width: 40px; height: 3px; background: #f43f5e; border-radius: 2px; margin-bottom: 14px; }
.bd-location { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #6b7280; margin-bottom: 14px; }
.bd-desc { font-size: 13.5px; color: #4b5563; line-height: 1.7; margin-bottom: 16px; }

.bd-tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.bd-tag-pill { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 5px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

.bd-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.bd-detail-item { background: #f9fafb; border-radius: 8px; padding: 10px 12px; border: 1px solid #f0f0f0; }
.bd-detail-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
.bd-detail-val { font-size: 13px; font-weight: 700; color: #111; }

.bd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.bd-badge-delivery { display: inline-flex; align-items: center; gap: 5px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
.bd-badge-warranty { display: inline-flex; align-items: center; gap: 5px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
.bd-badge-negotiable { display: inline-flex; align-items: center; gap: 5px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }

.bd-avail { display: flex; align-items: center; gap: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #059669; margin-bottom: 14px; }
.bd-avail-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; flex-shrink: 0; animation: bdpulse 1.4s infinite; }
@keyframes bdpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.bd-actions { display: flex; gap: 10px; }
.bd-btn-buy { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 13px; background: #e11d48; color: #fff; font-size: 14px; font-weight: 800; border: none; border-radius: 9px; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.15s; text-decoration: none; }
.bd-btn-buy:hover { background: #be123c; transform: translateY(-1px); }
.bd-btn-cart { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 13px; background: #fff0f3; color: #e11d48; border: 1.5px solid #fecdd3; font-size: 14px; font-weight: 800; border-radius: 9px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.bd-btn-cart:hover { background: #e11d48; color: #fff; border-color: #e11d48; transform: translateY(-1px); }
.bd-btn-offer { width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 12px; margin-top: 8px; background: #fff; color: #374151; border: 1.5px solid #e5e7eb; font-size: 14px; font-weight: 700; border-radius: 9px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.bd-btn-offer:hover { background: #f9fafb; border-color: #d1d5db; }
.bd-btn-phone { width: 48px; height: 48px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; background: #f9fafb; color: #374151; cursor: pointer; transition: all 0.15s; }
.bd-btn-phone:hover { background: #fce7f3; border-color: #fbcfe8; color: #be185d; }
.bd-btn-share { width: 48px; height: 48px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; background: #f9fafb; color: #374151; cursor: pointer; transition: all 0.15s; }
.bd-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }

.bd-tips { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 16px; }
.bd-tips-title { font-size: 12px; font-weight: 800; color: #1d4ed8; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.bd-tip-item { display: flex; align-items: flex-start; gap: 6px; font-size: 11.5px; color: #1e40af; margin-bottom: 5px; line-height: 1.5; }
.bd-tip-item:last-child { margin-bottom: 0; }

.bd-reviews-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-top: 16px; }
.bd-review-item { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
.bd-review-item:last-child { border-bottom: none; }
.bd-review-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.bd-review-name { font-size: 13px; font-weight: 700; color: #111; }
.bd-review-date { font-size: 11px; color: #9ca3af; }
.bd-review-comment { font-size: 12.5px; color: #4b5563; margin: 4px 0 0; line-height: 1.5; }

.bd-related { margin-top: 32px; }
.bd-related-title { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 14px; }
.bd-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.bd-rel-card { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; text-decoration: none; color: inherit; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
.bd-rel-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.bd-rel-img-wrap { aspect-ratio: 16/11; overflow: hidden; background: #e5e7eb; }
.bd-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.bd-rel-card:hover .bd-rel-img { transform: scale(1.05); }
.bd-rel-body { padding: 10px 12px; }
.bd-rel-name { font-size: 13.5px; font-weight: 700; color: #111; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bd-rel-price { font-size: 13px; font-weight: 800; color: #e11d48; }
.bd-rel-loc { font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 3px; margin-top: 3px; }
.bd-rel-rating { display: flex; align-items: center; gap: 2px; margin-top: 4px; }

/* ─── 404 STATE ─── */
.bd-404 { min-height: 80vh; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column; text-align: center; padding: 40px 20px; }
.bd-404-icon { color: #d1d5db; margin-bottom: 16px; }
.bd-404 h1 { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 6px; }
.bd-404 p { font-size: 14px; color: #9ca3af; margin: 0 0 20px; }
.bd-back-btn { display: inline-flex; align-items: center; gap: 6px; background: #e11d48; color: #fff; font-weight: 700; font-size: 14px; padding: 11px 28px; border-radius: 8px; text-decoration: none; transition: background 0.15s, transform 0.15s; }
.bd-back-btn:hover { background: #be123c; transform: translateY(-1px); }
.bd-back-btn:active { transform: scale(0.97); }

/* ─── ERROR STATE ─── */
.bd-error { min-height: 60vh; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column; text-align: center; padding: 40px 20px; }
.bd-error-icon { color: #ef4444; margin-bottom: 16px; }
.bd-error h1 { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 6px; }
.bd-error p { font-size: 14px; color: #9ca3af; margin: 0 0 20px; }
.bd-error-btn { display: inline-flex; align-items: center; gap: 6px; background: #e11d48; color: #fff; font-weight: 700; font-size: 14px; padding: 11px 28px; border-radius: 8px; border: none; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.15s; }
.bd-error-btn:hover { background: #be123c; transform: translateY(-1px); }
.bd-error-btn:active { transform: scale(0.97); }

.bd-skeleton-main { width: 100%; height: 420px; background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%); background-size: 200% 100%; animation: skeletonPulse 1.2s infinite; border-radius: 12px; }
.bd-skeleton-line { height: 16px; background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%); background-size: 200% 100%; animation: skeletonPulse 1.2s infinite; border-radius: 4px; margin-bottom: 10px; }
.bd-skeleton-line.short { width: 50%; }
.bd-skeleton-line.xshort { width: 30%; }
.bd-skeleton-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; }
@keyframes skeletonPulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (max-width: 900px) {
  .bd-grid { grid-template-columns: 1fr; }
  .bd-related-grid { grid-template-columns: repeat(2, 1fr); }
  .toast-container { right: 12px; top: 12px; }
}
@media (max-width: 540px) {
  .bd-body { padding: 16px 14px 40px; }
  .bd-related-grid { grid-template-columns: 1fr; }
  .bd-thumb { width: 56px; height: 56px; }
  .bd-main-img-wrap { height: 280px; }
  .bd-details-grid { grid-template-columns: 1fr; }
  .toast-item { min-width: auto; max-width: calc(100vw - 24px); font-size: 12px; padding: 10px 14px; }
}
`;

/* ─────────── COMPONENT ─────────── */
export default function BuyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<BuyProduct | null>(null);
  const [similarItems, setSimilarItems] = useState<BuyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  /* ─── FETCH PRODUCT ─── */
const fetchProduct = useCallback(async () => {
  if (!id) return;
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`/api/listings/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        setProduct(null);
        setLoading(false);
        return;
      }
      throw new Error("Failed to fetch product");
    }
    const raw: RawListing = await res.json();
    const detail = toBuyDetail(raw);
    setProduct(detail);

    const similarRes = await fetch(`/api/listings/related?category=${detail.category}&limit=3&exclude=${id}`);
    if (similarRes.ok) {
      const rawSimilar: RawListing[] = await similarRes.json();
      setSimilarItems(rawSimilar.map(toBuyCard));
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

  /* ─── TOAST HELPERS ─── */
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
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

  const toggleFav = () => {
    setIsFav((v) => !v);
    if (!isFav) {
      showToast(`${product?.title} saved to wishlist`, "info");
    } else {
      showToast(`${product?.title} removed from wishlist`, "info");
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

  /* ─── BREADCRUMB ─── */
  const categoryLabel =
    product?.category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") ?? "";

  const getConditionBadgeStyle = (condition: string) => {
    switch (condition) {
      case "new": return { background: "#10b981", color: "#fff" };
      case "used": return { background: "#f43f5e", color: "#fff" };
      default: return { background: "#6b7280", color: "#fff" };
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            fill={i < fullStars ? "#f59e0b" : "none"}
            color={i < fullStars ? "#f59e0b" : "#d1d5db"}
          />
        ))}
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111", marginLeft: 6 }}>{rating.toFixed(1)}</span>
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

  /* ─── 404 STATE ─── */
  if (!loading && !product && !error) {
    return (
      <>
        <style>{pageStyles}</style>
        <div className="bd-404">
          <FiFrown size={56} className="bd-404-icon" />
          <h1>Product Not Found</h1>
          <p>The item you are looking for does not exist.</p>
          <Link href="/buy" className="bd-back-btn">
            <FiArrowLeft size={14} /> Back to Browse
          </Link>
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

      <div className="bd-wrap">
        {/* Breadcrumb */}
        <div className="bd-breadcrumb-bar">
          <div className="bd-breadcrumb-inner">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/buy">Buy</Link>
            <span>/</span>
            {product && (
              <>
                <Link href={`/buy?category=${product.category}`}>{categoryLabel}</Link>
                <span>/</span>
              </>
            )}
            <span className="active">{product?.title ?? "Loading..."}</span>
          </div>
        </div>

        {loading ? (
          <div className="bd-body">
            <div className="bd-grid">
              <div>
                <div className="bd-skeleton-main" />
                <div style={{ marginTop: 16 }}>
                  <div className="bd-skeleton-line" />
                  <div className="bd-skeleton-line short" />
                  <div className="bd-skeleton-line xshort" />
                </div>
              </div>
              <div className="bd-skeleton-panel">
                <div className="bd-skeleton-line" />
                <div className="bd-skeleton-line short" />
                <div className="bd-skeleton-line xshort" />
                <div className="bd-skeleton-line" style={{ marginTop: 20 }} />
                <div className="bd-skeleton-line short" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bd-error">
            <FiAlertCircle size={56} className="bd-error-icon" />
            <h1>Error loading product</h1>
            <p>{error}</p>
            <button className="bd-error-btn" onClick={fetchProduct}>
              <FiRefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : product ? (
          <>
            <div className="bd-body">
              <Link href="/buy" className="bd-back">
                <FiArrowLeft size={14} /> Back to all listings
              </Link>

              <div className="bd-grid">
                {/* LEFT COLUMN */}
                <div>
                  <div className="bd-img-section">
                    <div className="bd-main-img-wrap">
                      <img src={product.images[activeImg] ?? product.images[0]} alt={product.title} className="bd-main-img" />

                      {product.badge && (
                        <span className="bd-img-cat-badge" style={badgeStyle}>{product.badge}</span>
                      )}

                      <button className="bd-img-fav-btn" onClick={toggleFav}>
                        {isFav ? <FaHeart size={18} color="#ef4444" /> : <FaHeart size={18} color="#d1d5db" />}
                      </button>

                      <span className="bd-posted-tag">
                        <FiClock size={10} style={{ marginRight: 4 }} />
                        {product.postedDaysAgo === 0 ? "Today" : `${product.postedDaysAgo}d ago`}
                      </span>

                      {product.deliveryAvailable && (
                        <span className="bd-delivery-tag">
                          <FiTruck size={10} /> Delivery Available
                        </span>
                      )}
                    </div>
                  </div>

                  {product.images.length > 1 && (
                    <div className="bd-thumb-strip">
                      {product.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${product.title} ${idx + 1}`}
                          className={`bd-thumb${activeImg === idx ? " active" : ""}`}
                          onClick={() => setActiveImg(idx)}
                        />
                      ))}
                    </div>
                  )}

                  <div className="bd-tips" style={{ marginTop: 16 }}>
                    <p className="bd-tips-title">
                      <FiZap size={14} /> Safety Tips
                    </p>
                    <div className="bd-tip-item">
                      <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                      Meet in a safe public place for inspection
                    </div>
                    <div className="bd-tip-item">
                      <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                      Inspect the item thoroughly before paying
                    </div>
                    <div className="bd-tip-item">
                      <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                      Never pay in advance without seeing the product
                    </div>
                    <div className="bd-tip-item">
                      <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                      Check original documents for vehicles and property
                    </div>
                  </div>

                  {product.reviews.length > 0 && (
                    <div className="bd-reviews-panel">
                      <p className="bd-seller-title">Reviews</p>
                      {product.reviews.map((r, i) => (
                        <div key={i} className="bd-review-item">
                          <div className="bd-review-head">
                            <span className="bd-review-name">{r.reviewerName}</span>
                            <span className="bd-review-date">{r.createdAt}</span>
                          </div>
                          {renderStars(r.rating)}
                          {r.comment && <p className="bd-review-comment">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="bd-right">
                  <div className="bd-panel">
                    <h1 className="bd-name">{product.title}</h1>
                    <p className="bd-category">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <FiTag size={11} color="#9ca3af" />
                        {categoryLabel}
                      </span>
                    </p>
                    <p className="bd-price-label">Price</p>
                    <p className="bd-price">{product.priceDisplay}</p>
                    <div className="bd-price-divider" />

                    <div style={{ marginBottom: 12 }}>{renderStars(product.seller.rating)}</div>

                    <div className="bd-location">
                      <FiMapPin size={14} />
                      {product.location}
                    </div>

                    {product.detailedDescription && <p className="bd-desc">{product.detailedDescription}</p>}

                    {product.tags.length > 0 && (
                      <div className="bd-tags-row">
                        {product.tags.map((tag) => (
                          <span key={tag} className="bd-tag-pill">{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="bd-details-grid">
                      {product.details.map((d) => (
                        <div key={d.label} className="bd-detail-item">
                          <p className="bd-detail-label">{d.label}</p>
                          <p className="bd-detail-val">{d.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bd-badges-row">
                      {product.deliveryAvailable && (
                        <span className="bd-badge-delivery">
                          <FiTruck size={11} /> Free Delivery
                        </span>
                      )}
                      {product.warrantyAvailable && (
                        <span className="bd-badge-warranty">
                          <FiShield size={11} /> Warranty Included
                        </span>
                      )}
                      {product.negotiable && (
                        <span className="bd-badge-negotiable">
                          <FiRotateCcw size={11} /> Price Negotiable
                        </span>
                      )}
                    </div>

                    <div className="bd-avail">
                      <span className="bd-avail-dot" />
                      Item Available — Ready to Ship
                    </div>

                    <div className="bd-actions">
                      <button className="bd-btn-buy" onClick={buyNow}>
                        <FiShoppingCart size={16} />
                        Buy Now
                      </button>
                      <button className="bd-btn-cart" onClick={addToCart}>
                        <FiShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                    <button className="bd-btn-offer" onClick={makeOffer}>
                      <FiCalendar size={16} />
                      Make an Offer
                    </button>

                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button className="bd-btn-phone" onClick={() => window.open(`tel:${product.seller.phone}`, "_self")}>
                        <FiPhone size={16} />
                      </button>
                      <button className="bd-btn-share" onClick={shareItem}>
                        <FiShare2 size={16} />
                      </button>
                    </div>
                  </div>

                  <SellerCard
                    seller={{
                      ...product.seller,
                      avatar: product.seller.avatar ?? "/default-avatar.png",
                      isPro: product.seller.isPro ?? false,
                      isTrusted: product.seller.isTrusted ?? false,
                      responseRate: product.seller.responseRate ?? "N/A",
                      avgResponseTime: product.seller.avgResponseTime ?? "N/A",
                    }}
                    reviews={product.reviews}
                    listingId={product.id}
                    sellerId={product.seller.id}
                  />
                </div>
              </div>

              {similarItems.length > 0 && (
                <div className="bd-related">
                  <p className="bd-related-title">Similar Items in {categoryLabel}</p>
                  <div className="bd-related-grid">
                    {similarItems.map((item) => (
                      <Link key={item.id} href={`/buy/${item.id}`} className="bd-rel-card">
                        <div className="bd-rel-img-wrap">
                          <img src={item.thumb} alt={item.title} className="bd-rel-img" />
                        </div>
                        <div className="bd-rel-body">
                          <p className="bd-rel-name">{item.title}</p>
                          <p className="bd-rel-price">{item.priceDisplay}</p>
                          <p className="bd-rel-loc"><FiMapPin size={10} />{item.location}</p>
                          <div className="bd-rel-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar
                                key={i}
                                size={10}
                                fill={i < Math.floor(item.seller.rating ?? 0) ? "#f59e0b" : "none"}
                                color={i < Math.floor(item.seller.rating ?? 0) ? "#f59e0b" : "#d1d5db"}
                              />
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