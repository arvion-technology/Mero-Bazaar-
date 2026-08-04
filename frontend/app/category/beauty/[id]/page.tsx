"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import {
  FiMapPin, FiArrowLeft, FiPhone, FiShare2,
  FiCalendar, FiStar, FiClock, FiScissors, FiHome,
  FiFrown, FiZap, FiCheck,
} from "react-icons/fi";
import { FaHeart, FaSpa } from "react-icons/fa";
import { toBeautyCard, toBeautyDetail } from "@/lib/adapters/beautyAdapter";
import type { BeautyListing, BeautyCard } from "@/app/types/beauty";
import type { BeautyDetail } from "@/app/types/listing";

const RELATED_LIMIT = 3;

async function fetchBeautyListing(id: string): Promise<BeautyListing | null> {
  const res = await fetch(`/api/beauty/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load listing (${res.status})`);
  return res.json();
}

async function fetchBeautyListings(): Promise<BeautyListing[]> {
  const res = await fetch("/api/beauty", { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  return [];
}

export default function BeautyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<BeautyDetail | null | undefined>(undefined); // undefined = loading, null = not found
  const [related, setRelated] = useState<BeautyCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    fetchBeautyListing(id)
      .then(async (raw) => {
        if (cancelled) return;
        if (!raw) {
          setItem(null);
          return;
        }
        const detail = toBeautyDetail(raw);
        setItem(detail);

        const all = await fetchBeautyListings();
        if (cancelled) return;
        const relatedCards = all
          .filter((l) => l.id !== raw.id && l.beauty?.serviceType === raw.beauty?.serviceType)
          .slice(0, RELATED_LIMIT)
          .map((l) => {
            try {
              return toBeautyCard(l);
            } catch {
              return null;
            }
          })
          .filter((c): c is BeautyCard => c !== null);
        setRelated(relatedCards);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Failed to load listing");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const getCategoryBadgeStyle = (serviceType: string) => {
    switch (serviceType) {
      case "Makeup Artist": return { background: "#db2777", color: "#fff" };
      case "Salon": return { background: "#7c3aed", color: "#fff" };
      case "Barber": return { background: "#0f766e", color: "#fff" };
      case "Skincare": return { background: "#1d4ed8", color: "#fff" };
      case "Spa": return { background: "#059669", color: "#fff" };
      case "Cosmetics": return { background: "#e11d48", color: "#fff" };
      case "Bridal": return { background: "#f59e0b", color: "#fff" };
      default: return { background: "#6b7280", color: "#fff" };
    }
  };

  const renderStars = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            fill={i < fullStars || (i === fullStars && hasHalf) ? "#f59e0b" : "none"}
            color={i < fullStars || (i === fullStars && hasHalf) ? "#f59e0b" : "#d1d5db"}
          />
        ))}
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111", marginLeft: 6 }}>{rating.toFixed(1)}</span>
        {reviewCount > 0 && (
          <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 3 }}>({reviewCount} Reviews)</span>
        )}
      </div>
    );
  };

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; }
    html, body { overflow-x: hidden; }
    .bd-wrap { min-height: 100vh; background: #f5f5f5; font-family: 'Inter', -apple-system, sans-serif; }
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
    .bd-main-img-wrap { position: relative; width: 100%; height: 390px; overflow: hidden; background: #e5e7eb; }
    .bd-main-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .bd-img-cat-badge { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.4px; }
    .bd-img-fav-btn { position: absolute; top: 10px; left: 10px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.92); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: transform 0.15s; padding: 0; }
    .bd-img-fav-btn:hover { transform: scale(1.12); }
    .bd-posted-tag { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.58); color: #fff; font-size: 10px; font-weight: 600; border-radius: 6px; padding: 3px 8px; backdrop-filter: blur(4px); }
    .bd-home-tag { position: absolute; bottom: 10px; right: 10px; background: rgba(225,29,72,0.88); color: #fff; font-size: 10px; font-weight: 700; border-radius: 6px; padding: 3px 8px; display: flex; align-items: center; gap: 4px; }
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
    .bd-subs-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
    .bd-sub-pill { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 5px; background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
    .bd-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
    .bd-detail-item { background: #f9fafb; border-radius: 8px; padding: 10px 12px; border: 1px solid #f0f0f0; }
    .bd-detail-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
    .bd-detail-val { font-size: 13px; font-weight: 700; color: #111; }
    .bd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .bd-badge-home { display: inline-flex; align-items: center; gap: 5px; background: #fce7f3; color: #be185d; border: 1px solid #fbcfe8; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
    .bd-badge-bridal { display: inline-flex; align-items: center; gap: 5px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
    .bd-badge-tag { display: inline-flex; align-items: center; gap: 5px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px; }
    .bd-avail { display: flex; align-items: center; gap: 8px; background: #fce7f3; border: 1px solid #fbcfe8; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #be185d; margin-bottom: 14px; }
    .bd-avail-dot { width: 8px; height: 8px; border-radius: 50%; background: #e11d48; flex-shrink: 0; animation: bdpulse 1.4s infinite; }
    @keyframes bdpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .bd-actions { display: flex; gap: 10px; }
    .bd-btn-book { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 13px; background: #e11d48; color: #fff; font-size: 14px; font-weight: 800; border: none; border-radius: 9px; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.15s; text-decoration: none; }
    .bd-btn-book:hover { background: #be123c; transform: translateY(-1px); }
    .bd-btn-phone, .bd-btn-share { width: 48px; height: 48px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; background: #f9fafb; color: #374151; cursor: pointer; transition: all 0.15s; }
    .bd-btn-phone:hover { background: #fce7f3; border-color: #fbcfe8; color: #be185d; }
    .bd-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }
    .bd-provider-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .bd-provider-title { font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .bd-provider-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .bd-provider-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #f43f5e, #e11d48); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 800; flex-shrink: 0; }
    .bd-provider-name { font-size: 14px; font-weight: 800; color: #111; }
    .bd-provider-phone { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .bd-provider-chat-btn { display: flex; align-items: center; gap: 6px; background: #e11d48; color: #fff; font-size: 12.5px; font-weight: 800; border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-family: inherit; white-space: nowrap; transition: background 0.15s; }
    .bd-provider-chat-btn:hover { background: #be123c; }
    .bd-reviews-panel { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .bd-review-item { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .bd-review-item:last-child { border-bottom: none; }
    .bd-review-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .bd-review-name { font-size: 12.5px; font-weight: 700; color: #111; }
    .bd-review-date { font-size: 10.5px; color: #9ca3af; }
    .bd-review-comment { font-size: 12.5px; color: #4b5563; line-height: 1.5; }
    .bd-tips { background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 10px; padding: 14px 16px; }
    .bd-tips-title { font-size: 12px; font-weight: 800; color: #be185d; margin-bottom: 8px; }
    .bd-tip-item { display: flex; align-items: flex-start; gap: 6px; font-size: 11.5px; color: #831843; margin-bottom: 5px; line-height: 1.5; }
    .bd-tip-item:last-child { margin-bottom: 0; }
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
    .bd-state { min-height: 60vh; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; flex-direction: column; text-align: center; padding: 40px 20px; }
    @media (max-width: 900px) {
      .bd-grid { grid-template-columns: 1fr; }
      .bd-related-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 540px) {
      .bd-body { padding: 16px 14px 40px; }
      .bd-related-grid { grid-template-columns: 1fr; }
      .bd-thumb { width: 56px; height: 56px; }
    }
  `;

  if (error) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          html, body { overflow-x: hidden; }
          .bd-404 {
            min-height: 80vh; display: flex; align-items: center; justify-content: center;
            font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column;
            text-align: center; padding: 40px 20px;
          }
          .bd-404 h1 { font-size: 22px; font-weight: 800; color: #111; margin: 12px 0 6px; }
          .bd-404 p { font-size: 14px; color: #888; margin: 0 0 18px; }
          .bd-back-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: #e11d48; color: #fff; font-weight: 700; font-size: 13px;
            padding: 10px 22px; border-radius: 8px; text-decoration: none;
          }
        `}</style>
        <div className="bd-404">
          <FiFrown size={56} color="#e11d48" />
          <h1>Service Not Found</h1>
          <p>The beauty service you are looking for does not exist.</p>
          <Link href="/category/beauty" className="bd-back-btn">
            <FiArrowLeft size={14} /> Back to Services
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const badgeStyle = getCategoryBadgeStyle(item.serviceType);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        .bd-wrap {
          min-height: 100vh; background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── BREADCRUMB ── */
        .bd-breadcrumb-bar {
          background: #fff; border-bottom: 1px solid #e5e7eb;
        }
        .bd-breadcrumb-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 12px 24px;
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9ca3af;
        }
        .bd-breadcrumb-inner a {
          color: #9ca3af; text-decoration: none; transition: color 0.15s;
        }
        .bd-breadcrumb-inner a:hover { color: #e11d48; }
        .bd-breadcrumb-inner span.active { color: #374151; font-weight: 600; }

        /* ── MAIN BODY ── */
        .bd-body {
          max-width: 1200px; margin: 0 auto;
          padding: 24px 20px 60px;
        }

        /* ── BACK LINK ── */
        .bd-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 18px;
          transition: color 0.15s;
        }
        .bd-back:hover { color: #e11d48; }

        /* ── GRID ── */
        .bd-grid {
          display: grid; grid-template-columns: 1fr 400px; gap: 24px;
          align-items: start;
        }

        /* ── LEFT: IMAGE CARD ── */
        .bd-img-section {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .bd-main-img-wrap {
          position: relative;
          width: 100%;
          height: 390px;
          overflow: hidden;
          background: #e5e7eb;
        }
        .bd-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .bd-img-cat-badge {
          position: absolute; top: 10px; right: 10px;
          font-size: 10px; font-weight: 800;
          padding: 3px 8px; border-radius: 5px;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .bd-img-fav-btn {
          position: absolute; top: 10px; left: 10px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0;
        }
        .bd-img-fav-btn:hover { transform: scale(1.12); }

        .bd-posted-tag {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(0,0,0,0.58); color: #fff;
          font-size: 10px; font-weight: 600; border-radius: 6px;
          padding: 3px 8px; backdrop-filter: blur(4px);
        }
        .bd-home-tag {
          position: absolute; bottom: 10px; right: 10px;
          background: rgba(225,29,72,0.88); color: #fff;
          font-size: 10px; font-weight: 700; border-radius: 6px;
          padding: 3px 8px; display: flex; align-items: center; gap: 4px;
        }

        /* ── THUMBNAILS: OUTSIDE THE BOX ── */
        .bd-thumb-strip {
          display: flex; gap: 8px;
          margin-top: 10px;
          padding: 0 2px;
        }
        .bd-thumb {
          width: 64px; height: 64px; border-radius: 8px;
          object-fit: cover; cursor: pointer; border: 2px solid transparent;
          transition: border-color 0.15s, opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
          background: #e5e7eb;
        }
        .bd-thumb:hover { opacity: 0.85; transform: translateY(-1px); }
        .bd-thumb.active { border-color: #e11d48; }

        /* ── RIGHT: DETAILS PANEL ── */
        .bd-right { display: flex; flex-direction: column; gap: 16px; }

        .bd-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .bd-name { font-size: 22px; font-weight: 900; color: #111; margin: 0 0 6px; }
        .bd-category {
          font-size: 13px; color: #6b7280; margin: 0 0 10px;
        }
        .bd-price-label {
          font-size: 11px; font-weight: 600; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px;
          margin: 0 0 2px;
        }
        .bd-price { font-size: 26px; font-weight: 900; color: #e11d48; margin: 0 0 12px; }
        .bd-price-divider {
          width: 40px; height: 3px; background: #f43f5e;
          border-radius: 2px; margin-bottom: 14px;
        }

        .bd-location {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: #6b7280; margin-bottom: 14px;
        }

        .bd-desc {
          font-size: 13.5px; color: #4b5563; line-height: 1.7;
          margin-bottom: 16px;
        }

        /* Sub-services pills */
        .bd-subs-row {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-bottom: 14px;
        }
        .bd-sub-pill {
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 5px;
          background: #fdf2f8; color: #be185d;
          border: 1px solid #fbcfe8;
        }

        /* Details grid */
        .bd-details-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 14px;
        }
        .bd-detail-item {
          background: #f9fafb; border-radius: 8px;
          padding: 10px 12px;
          border: 1px solid #f0f0f0;
        }
        .bd-detail-label {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;
        }
        .bd-detail-val { font-size: 13px; font-weight: 700; color: #111; }

        /* Badges row */
        .bd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .bd-badge-home {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fce7f3; color: #be185d; border: 1px solid #fbcfe8;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .bd-badge-bridal {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fef3c7; color: #92400e; border: 1px solid #fde68a;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .bd-badge-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }

        /* Availability */
        .bd-avail {
          display: flex; align-items: center; gap: 8px;
          background: #fce7f3; border: 1px solid #fbcfe8; border-radius: 8px;
          padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #be185d;
          margin-bottom: 14px;
        }
        .bd-avail-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #e11d48;
          flex-shrink: 0; animation: bdpulse 1.4s infinite;
        }
        @keyframes bdpulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Action Buttons */
        .bd-actions { display: flex; gap: 10px; }
        .bd-btn-book {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 13px;
          background: #e11d48; color: #fff;
          font-size: 14px; font-weight: 800; border: none;
          border-radius: 9px; cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.15s;
          text-decoration: none;
        }
        .bd-btn-book:hover { background: #be123c; transform: translateY(-1px); }
        .bd-btn-phone {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .bd-btn-phone:hover { background: #fce7f3; border-color: #fbcfe8; color: #be185d; }
        .bd-btn-share {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .bd-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }

        /* Provider Panel */
        .bd-provider-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 18px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .bd-provider-title {
          font-size: 12px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .bd-provider-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .bd-provider-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #f43f5e, #e11d48);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; font-weight: 800; flex-shrink: 0;
        }
        .bd-provider-name { font-size: 14px; font-weight: 800; color: #111; }
        .bd-provider-phone { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .bd-provider-chat-btn {
          display: flex; align-items: center; gap: 6px;
          background: #e11d48; color: #fff;
          font-size: 12.5px; font-weight: 800; border: none;
          padding: 9px 18px; border-radius: 8px; cursor: pointer;
          font-family: inherit; white-space: nowrap;
          transition: background 0.15s;
        }
        .bd-provider-chat-btn:hover { background: #be123c; }

        /* Safety tips panel */
        .bd-tips {
          background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 10px;
          padding: 14px 16px;
        }
        .bd-tips-title { font-size: 12px; font-weight: 800; color: #be185d; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .bd-tip-item {
          display: flex; align-items: flex-start; gap: 6px;
          font-size: 11.5px; color: #831843; margin-bottom: 5px; line-height: 1.5;
        }
        .bd-tip-item:last-child { margin-bottom: 0; }

        /* ── RELATED ── */
        .bd-related { margin-top: 32px; }
        .bd-related-title {
          font-size: 17px; font-weight: 800; color: #111; margin-bottom: 14px;
        }
        .bd-related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        }
        .bd-rel-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          border: 1px solid #e5e7eb; text-decoration: none; color: inherit;
          display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .bd-rel-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .bd-rel-img-wrap { aspect-ratio: 16/11; overflow: hidden; background: #e5e7eb; }
        .bd-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .bd-rel-card:hover .bd-rel-img { transform: scale(1.05); }
        .bd-rel-body { padding: 10px 12px; }
        .bd-rel-name { font-size: 13.5px; font-weight: 700; color: #111; margin: 0 0 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bd-rel-price { font-size: 13px; font-weight: 800; color: #e11d48; }
        .bd-rel-loc { font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 3px; margin-top: 3px; }
        .bd-rel-rating {
          display: flex; align-items: center; gap: 2px; margin-top: 4px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .bd-grid { grid-template-columns: 1fr; }
          .bd-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .bd-body { padding: 16px 14px 40px; }
          .bd-related-grid { grid-template-columns: 1fr; }
          .bd-thumb { width: 56px; height: 56px; }
        }
      `}</style>

      <div className="bd-wrap">
        <div className="bd-breadcrumb-bar">
          <div className="bd-breadcrumb-inner">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/category/beauty">Hair, Beauty & Wellness</Link>
            <span>/</span>
            <span className="active">{item.title}</span>
          </div>
        </div>

        <div className="bd-body">
          <Link href="/category/beauty" className="bd-back">
            <FiArrowLeft size={14} /> Back to all services
          </Link>

          <div className="bd-grid">
            <div>
              <div className="bd-img-section">
                <div className="bd-main-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images[activeImg] ?? item.images[0]} alt={item.title} className="bd-main-img" />

                  <span className="bd-img-cat-badge" style={badgeStyle}>{item.serviceType}</span>

                  <button className="bd-img-fav-btn" onClick={() => setIsFav(!isFav)}>
                    {isFav ? <FaHeart size={16} color="#ef4444" /> : <FaHeart size={16} color="#d1d5db" />}
                  </button>

                  <span className="bd-posted-tag">
                    <FiClock size={10} style={{ marginRight: 4 }} />
                    {item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo}d ago`}
                  </span>

                  {item.homeVisit && (
                    <span className="bd-home-tag">
                      <FiHome size={10} /> Home Visit Available
                    </span>
                  )}
                </div>
              </div>

              {item.images.length > 1 && (
                <div className="bd-thumb-strip">
                  {item.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${item.title} ${idx + 1}`}
                      className={`bd-thumb${activeImg === idx ? " active" : ""}`}
                      onClick={() => setActiveImg(idx)}
                    />
                  ))}
                </div>
              )}

              <div className="bd-tips" style={{ marginTop: 16 }}>
                <p className="bd-tips-title">
                  <FiZap size={14} /> Beauty Service Tips
                </p>
                <div className="bd-tip-item">
                  <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                  Check provider reviews and portfolio before booking
                </div>
                <div className="bd-tip-item">
                  <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                  Confirm product brands if you have allergies or preferences
                </div>
                <div className="bd-tip-item">
                  <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                  For home visits, ensure a clean and well-lit space
                </div>
                <div className="bd-tip-item">
                  <FiCheck size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                  Always patch test new products 24 hours before events
                </div>
              </div>

              {item.reviews.length > 0 && (
                <div className="bd-reviews-panel" style={{ marginTop: 16 }}>
                  <p className="bd-provider-title">Reviews</p>
                  {item.reviews.map((r, i) => (
                    <div key={i} className="bd-review-item">
                      <div className="bd-review-head">
                        <span className="bd-review-name">{r.reviewerName}</span>
                        <span className="bd-review-date">{r.createdAt}</span>
                      </div>
                      {renderStars(r.rating, 0)}
                      {r.comment && <p className="bd-review-comment" style={{ marginTop: 4 }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bd-right">
              <div className="bd-panel">
                <h1 className="bd-name">{item.title}</h1>
                <p className="bd-category">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <FiScissors size={11} color="#9ca3af" />
                    {item.serviceType}
                  </span>
                </p>
                <p className="bd-price-label">Starting From</p>
                <p className="bd-price">{item.price}</p>
                <div className="bd-price-divider" />

                <div style={{ marginBottom: 12 }}>{renderStars(item.rating, item.reviews.length)}</div>

                <div className="bd-location">
                  <FiMapPin size={14} />
                  {item.location}
                </div>

                {item.detailedDescription && <p className="bd-desc">{item.detailedDescription}</p>}

                {item.tags.length > 0 && (
                  <div className="bd-subs-row">
                    {item.tags.map((tag) => (
                      <span key={tag} className="bd-sub-pill">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="bd-details-grid">
                  {item.duration !== "N/A" && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Duration</p>
                      <p className="bd-detail-val">
                        <FiClock size={11} style={{ marginRight: 4 }} />
                        {item.duration}
                      </p>
                    </div>
                  )}
                  {item.studioLocation !== "N/A" && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Studio Location</p>
                      <p className="bd-detail-val">{item.studioLocation}</p>
                    </div>
                  )}
                  {item.experienceLevel !== "N/A" && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Experience</p>
                      <p className="bd-detail-val">{item.experienceLevel}</p>
                    </div>
                  )}
                  {item.genderPreference !== "N/A" && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Gender Preference</p>
                      <p className="bd-detail-val">{item.genderPreference}</p>
                    </div>
                  )}
                  <div className="bd-detail-item">
                    <p className="bd-detail-label">Posted</p>
                    <p className="bd-detail-val">
                      {item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo} day${item.postedDaysAgo > 1 ? "s" : ""} ago`}
                    </p>
                  </div>
                </div>

                <div className="bd-badges-row">
                  {item.homeVisit && (
                    <span className="bd-badge-home">
                      <FiHome size={11} /> Home Visit Available
                    </span>
                  )}
                  {item.bridalAvailable && (
                    <span className="bd-badge-bridal">
                      <FaSpa size={11} /> Bridal Service
                    </span>
                  )}
                </div>

                <div className="bd-avail">
                  <span className="bd-avail-dot" />
                  Currently Accepting Bookings
                </div>

                <div className="bd-actions">
                  <Link href={`tel:${item.seller.phone}`} className="bd-btn-book">
                    <FiCalendar size={16} />
                    Book Now
                  </Link>
                  <button className="bd-btn-phone" onClick={() => window.open(`tel:${item.seller.phone}`, "_self")}>
                    <FiPhone size={16} />
                  </button>
                  <button
                    className="bd-btn-share"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: item.title, url: window.location.href });
                      }
                    }}
                  >
                    <FiShare2 size={16} />
                  </button>
                </div>
              </div>

              <div className="bd-provider-panel">
                <p className="bd-provider-title">Service Provider</p>
                <div className="bd-provider-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="bd-provider-avatar">{(item.seller.name ?? "P")[0]}</div>
                    <div>
                      <p className="bd-provider-name">{item.seller.name}</p>
                      <p className="bd-provider-phone">{item.seller.phone}</p>
                    </div>
                  </div>
                  <button className="bd-provider-chat-btn" onClick={() => window.open(`tel:${item.seller.phone}`, "_self")}>
                    <FiPhone size={13} /> Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="bd-related">
              <p className="bd-related-title">Similar {item.serviceType} Services</p>
              <div className="bd-related-grid">
                {related.map((r) => (
                  <Link key={r.id} href={`/category/beauty/${r.id}`} className="bd-rel-card">
                    <div className="bd-rel-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.thumb} alt={r.title} className="bd-rel-img" />
                    </div>
                    <div className="bd-rel-body">
                      <p className="bd-rel-name">{r.title}</p>
                      <p className="bd-rel-price">{r.price}</p>
                      {r.city && <p className="bd-rel-loc"><FiMapPin size={10} />{r.city}</p>}
                      <div className="bd-rel-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            size={10}
                            fill={i < Math.floor(r.rating ?? 0) ? "#f59e0b" : "none"}
                            color={i < Math.floor(r.rating ?? 0) ? "#f59e0b" : "#d1d5db"}
                          />
                        ))}
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#111", marginLeft: 3 }}>{(r.rating ?? 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}