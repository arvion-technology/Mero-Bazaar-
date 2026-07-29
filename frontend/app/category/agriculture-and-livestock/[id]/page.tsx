"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import {
  FiMapPin, FiMessageSquare, FiArrowLeft,
  FiPhone, FiShare2, FiCheckCircle,
} from "react-icons/fi";
import { FaHeart, FaLeaf, FaShieldAlt } from "react-icons/fa";
import { api } from "@/lib/api";
import { toAgricultureDetail } from "@/lib/adapters/agricultureAdapter";
import type { AgricultureListing } from "@/app/types/agriculture";
import type { AgricultureDetail } from "@/app/types/listing";
import SellerCard from "@/components/SellerCard";

export default function AgriDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isFav, setIsFav] = useState(false);
  const [detail, setDetail] = useState<AgricultureDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    api.getAgricultureListing(id)
      .then((raw: AgricultureListing) => { if (!cancelled) setDetail(toAgricultureDetail(raw)); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load listing"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "Livestock": return { background: "#ec4899", color: "#fff" };
      case "Produce":   return { background: "#10b981", color: "#fff" };
      case "Tool":      return { background: "#3b82f6", color: "#fff" };
      default:          return { background: "#8b5cf6", color: "#fff" };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
        Loading listing...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <>
        <style>{`
          .al-404 {
            min-height: 80vh; display: flex; align-items: center; justify-content: center;
            font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column;
            text-align: center; padding: 40px 20px;
          }
          .al-404 h1 { font-size: 22px; font-weight: 800; color: #111; margin: 12px 0 6px; }
          .al-404 p { font-size: 14px; color: #888; margin: 0 0 18px; }
          .al-back-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: #4ade80; color: #166534; font-weight: 700; font-size: 13px;
            padding: 10px 22px; border-radius: 8px; text-decoration: none;
          }
        `}</style>
        <div className="al-404">
          <div style={{ fontSize: 56 }}>🌾</div>
          <h1>Listing Not Found</h1>
          <p>{error ?? "The item you are looking for does not exist."}</p>
          <Link href="/category/agriculture-and-livestock" className="al-back-btn">
            <FiArrowLeft size={14} /> Back to Listings
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const badgeStyle = getCategoryBadgeStyle(detail.listingType);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .ald-wrap {
          min-height: 100vh; background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .ald-breadcrumb-bar {
          background: #fff; border-bottom: 1px solid #e5e7eb;
        }
        .ald-breadcrumb-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 12px 24px;
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9ca3af;
        }
        .ald-breadcrumb-inner a {
          color: #9ca3af; text-decoration: none; transition: color 0.15s;
        }
        .ald-breadcrumb-inner a:hover { color: #15803d; }
        .ald-breadcrumb-inner span.active { color: #374151; font-weight: 600; }

        .ald-body {
          max-width: 1200px; margin: 0 auto;
          padding: 24px 20px 60px;
        }

        .ald-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 18px;
          transition: color 0.15s;
        }
        .ald-back:hover { color: #15803d; }

        .ald-grid {
          display: grid; grid-template-columns: 1fr 400px; gap: 24px;
          align-items: start;
        }

        .ald-img-section {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .ald-main-img-wrap {
          position: relative; aspect-ratio: 4/3; overflow: hidden;
          background: #e5e7eb;
        }
        .ald-main-img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .ald-img-cat-badge {
          position: absolute; top: 12px; right: 12px;
          font-size: 10px; font-weight: 800;
          padding: 4px 10px; border-radius: 5px;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .ald-img-fav-btn {
          position: absolute; top: 12px; left: 12px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0;
        }
        .ald-img-fav-btn:hover { transform: scale(1.12); }

        .ald-posted-tag {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(0,0,0,0.58); color: #fff;
          font-size: 10.5px; font-weight: 600; border-radius: 6px;
          padding: 3px 9px; backdrop-filter: blur(4px);
        }
        .ald-organic-tag {
          position: absolute; bottom: 12px; right: 12px;
          background: rgba(21,128,61,0.88); color: #fff;
          font-size: 10.5px; font-weight: 700; border-radius: 6px;
          padding: 3px 9px; display: flex; align-items: center; gap: 4px;
        }

        .ald-right { display: flex; flex-direction: column; gap: 16px; }

        .ald-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .ald-title { font-size: 22px; font-weight: 900; color: #111; margin: 0 0 4px; }
        .ald-price { font-size: 26px; font-weight: 900; color: #15803d; margin: 0 0 12px; }
        .ald-price-divider {
          width: 40px; height: 3px; background: #4ade80;
          border-radius: 2px; margin-bottom: 14px;
        }

        .ald-location {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: #6b7280; margin-bottom: 14px;
        }

        .ald-desc {
          font-size: 13.5px; color: #4b5563; line-height: 1.7;
          margin-bottom: 16px;
        }

        .ald-details-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 14px;
        }
        .ald-detail-item {
          background: #f9fafb; border-radius: 8px;
          padding: 10px 12px;
          border: 1px solid #f0f0f0;
        }
        .ald-detail-label {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;
        }
        .ald-detail-val { font-size: 13px; font-weight: 700; color: #111; }

        .ald-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .ald-badge-organic {
          display: inline-flex; align-items: center; gap: 5px;
          background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .ald-badge-vax {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fef3c7; color: #92400e; border: 1px solid #fde68a;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }

        .ald-avail {
          display: flex; align-items: center; gap: 8px;
          background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px;
          padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #92400e;
          margin-bottom: 14px;
        }
        .ald-avail-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;
          flex-shrink: 0; animation: aldpulse 1.4s infinite;
        }
        @keyframes aldpulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .ald-actions { display: flex; gap: 10px; }
        .ald-btn-chat {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 13px;
          background: #4ade80; color: #166534;
          font-size: 14px; font-weight: 800; border: none;
          border-radius: 9px; cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.15s;
          text-decoration: none;
        }
        .ald-btn-chat:hover { background: #22c55e; transform: translateY(-1px); }
        .ald-btn-phone {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .ald-btn-phone:hover { background: #d1fae5; border-color: #4ade80; color: #15803d; }
        .ald-btn-share {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .ald-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }

        .ald-seller-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 18px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .ald-seller-title {
          font-size: 12px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .ald-seller-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .ald-seller-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #4ade80, #15803d);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; font-weight: 800; flex-shrink: 0;
        }
        .ald-seller-name { font-size: 14px; font-weight: 800; color: #111; }
        .ald-seller-phone { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .ald-seller-chat-btn {
          display: flex; align-items: center; gap: 6px;
          background: #4ade80; color: #166534;
          font-size: 12.5px; font-weight: 800; border: none;
          padding: 9px 18px; border-radius: 8px; cursor: pointer;
          font-family: inherit; white-space: nowrap;
          transition: background 0.15s;
        }
        .ald-seller-chat-btn:hover { background: #22c55e; }

        .ald-tips {
          background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
          padding: 14px 16px;
        }
        .ald-tips-title { font-size: 12px; font-weight: 800; color: #92400e; margin-bottom: 8px; }
        .ald-tip-item {
          display: flex; align-items: flex-start; gap: 6px;
          font-size: 11.5px; color: #78350f; margin-bottom: 5px; line-height: 1.5;
        }
        .ald-tip-item:last-child { margin-bottom: 0; }

        @media (max-width: 900px) {
          .ald-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 540px) {
          .ald-body { padding: 16px 14px 40px; }
        }
      `}</style>

      <div className="ald-wrap">
        <div className="ald-breadcrumb-bar">
          <div className="ald-breadcrumb-inner">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/category/agriculture-and-livestock">Agriculture &amp; Livestock</Link><span>/</span>
            <span className="active">{detail.title}</span>
          </div>
        </div>

        <div className="ald-body">
          <Link href="/category/agriculture-and-livestock" className="ald-back">
            <FiArrowLeft size={14} /> Back to all listings
          </Link>

          <div className="ald-grid">
            <div>
              <div className="ald-img-section">
                <div className="ald-main-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={detail.images[0]} alt={detail.title} className="ald-main-img" />
                  <span className="ald-img-cat-badge" style={badgeStyle}>#{detail.listingType}</span>
                  <button className="ald-img-fav-btn" onClick={() => setIsFav(!isFav)}>
                    <FaHeart size={16} color={isFav ? "#ef4444" : "#d1d5db"} />
                  </button>
                  <span className="ald-posted-tag">{detail.postedDaysAgo === 0 ? "Today" : `${detail.postedDaysAgo}d ago`}</span>
                  {detail.organicCertified && <span className="ald-organic-tag">🌿 Organic</span>}
                </div>
              </div>
{/* 
              <div className="ald-tips" style={{ marginTop: 16 }}>
                <p className="ald-tips-title">⚠️ Safety Tips</p>
                <div className="ald-tip-item">✓ Meet in a safe, public location</div>
                <div className="ald-tip-item">✓ Verify livestock health certificates before buying</div>
                <div className="ald-tip-item">✓ Never pay full amount before receiving the item</div>
                <div className="ald-tip-item">✓ Report suspicious listings to our support team</div>
              </div> */}
            </div>

            <div className="ald-right">
              <div className="ald-panel">
                <h1 className="ald-title">{detail.title}</h1>
                <p className="ald-price">{detail.price}</p>
                <div className="ald-price-divider" />
                <div className="ald-location"><FiMapPin size={14} /> {detail.location}</div>
                <p className="ald-desc">{detail.description}</p> 
               {/* currently not visible in the UI */}

                <div className="ald-details-grid">
                  {detail.breed !== "N/A" && (
                    <div className="ald-detail-item"><p className="ald-detail-label">Breed</p><p className="ald-detail-val">{detail.breed}</p></div>
                  )}
                  {detail.age !== "N/A" && (
                    <div className="ald-detail-item"><p className="ald-detail-label">Age</p><p className="ald-detail-val">{detail.age}</p></div>
                  )}
                  {detail.seasonalAvailability !== "N/A" && (
                    <div className="ald-detail-item"><p className="ald-detail-label">Season</p><p className="ald-detail-val">{detail.seasonalAvailability}</p></div>
                  )}
                  <div className="ald-detail-item"><p className="ald-detail-label">District</p><p className="ald-detail-val">{detail.district}</p></div>
                  <div className="ald-detail-item"><p className="ald-detail-label">Posted</p><p className="ald-detail-val">{detail.postedDaysAgo === 0 ? "Today" : `${detail.postedDaysAgo} day${detail.postedDaysAgo > 1 ? "s" : ""} ago`}</p></div>
                  <div className="ald-detail-item"><p className="ald-detail-label">Category</p><p className="ald-detail-val">{detail.listingType}</p></div>
                </div>

                <div className="ald-badges-row">
                  {detail.organicCertified && <span className="ald-badge-organic"><FaLeaf size={11} /> Organic Certified</span>}
                  {detail.healthVaccineStatus !== "N/A" && <span className="ald-badge-vax"><FaShieldAlt size={11} /> {detail.healthVaccineStatus}</span>}
                  <button className="ald-btn-share" onClick={() => { if (navigator.share) navigator.share({ title: detail.title, url: window.location.href }); }}><FiShare2 size={16} /></button>
                </div>
              </div>

                <SellerCard
                  seller={detail.seller}
                  reviews={detail.reviews}
                  listingId={detail.id}
                  sellerId={detail.sellerId}
                />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}