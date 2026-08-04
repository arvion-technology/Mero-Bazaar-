"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { FiShare2, FiHeart, FiMapPin, FiClock, FiBriefcase, FiCheckCircle, FiMail, FiMessageSquare, FiChevronRight } from "react-icons/fi";
import { api } from "@/lib/api";
import { toMedicalDetail } from "@/lib/adapters/medicalAdapter";
import type { MedicalDetail } from "@/app/types/listing";

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating) ? (
          <FaStar key={i} size={size} color="#F5A623" />
        ) : (
          <FaRegStar key={i} size={size} color="#F5A623" />
        )
      )}
    </span>
  );
}

export default function MedicalDetailPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [listing, setListing] = useState<MedicalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [callRevealed, setCallRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    api
      .getMedicalListing(id)
      .then((raw) => {
        if (!cancelled) setListing(toMedicalDetail(raw));
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load listing");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading listing…
      </div>
    );
  }

  if (error || !listing) {
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
        }}
      >
        <p style={{ fontWeight: 700 }}>Couldn&apos;t load this listing</p>
        <span style={{ color: "#888", fontSize: 13 }}>{error}</span>
        <Link
          href="/category/medical"
          style={{ color: "#0d9488", fontWeight: 600, fontSize: 13 }}
        >
          Back to Medical &amp; Dental
        </Link>
      </div>
    );
  }

  const images =
    listing.images.length > 0 ? listing.images : ["/placeholder-item.jpg"];
  const thumbs = images.slice(0, 5);
  const extra = images.length - 5;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }
        .md2-page {
          background: #f5f6f8;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 60px;
        }

        .md2-topbar {
          background: #fff;
          border-bottom: 1px solid #ececec;
          padding: 10px 0;
        }
        .md2-topbar-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 22px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 6px;
        }
        .md2-breadcrumb {
          display: flex; align-items: center; gap: 4px;
          font-size: 12.5px; color: #888; flex-wrap: wrap;
        }
        .md2-bc-link { color: #0d9488; text-decoration: none; font-weight: 500; }
        .md2-bc-link:hover { text-decoration: underline; }
        .md2-bc-sep { color: #ccc; font-size: 11px; margin: 0 1px; }
        .md2-bc-cur { color: #444; font-weight: 500; }
        .md2-lid { font-size: 12px; color: #999; font-weight: 500; }

        .md2-wrap {
          max-width: 1180px; margin: 18px auto 0; padding: 0 22px;
          display: grid; grid-template-columns: 1fr 310px; gap: 18px; align-items: start;
        }
        .md2-left { display: flex; flex-direction: column; gap: 14px; }
        .md2-right { display: flex; flex-direction: column; gap: 14px; }

        .md2-gallery {
          background: #fff; border-radius: 14px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          border: 1px solid #e8e8e8;
        }
        .md2-hero-wrap {
          position: relative; width: 100%; height: 380px;
          overflow: hidden; background: #f4f4f6; display: flex;
          align-items: center; justify-content: center;
        }
        .md2-hero-img {
          position: relative; z-index: 1;
          width: 100%; height: 100%; max-height: 480px;
          object-fit: contain;
          object-position: center center;
          display: block;
          transition: transform 0.4s ease;
        }
        .md2-hero-wrap:hover .md2-hero-img { transform: scale(1.04); }

        .md2-thumbs-row {
          display: flex; gap: 6px; padding: 8px 10px;
          overflow-x: auto; scrollbar-width: none; background: #fff;
        }
        .md2-thumbs-row::-webkit-scrollbar { display: none; }
        .md2-thumb {
          flex-shrink: 0; width: 76px; height: 52px; border-radius: 7px;
          overflow: hidden; cursor: pointer; position: relative;
          border: 2px solid transparent; transition: border-color 0.2s, transform 0.15s;
        }
        .md2-thumb:hover { transform: translateY(-2px); }
        .md2-thumb.on { border-color: #0d9488; }
        .md2-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .md2-thumb-more {
          position: absolute; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px; font-weight: 800;
        }

        .md2-badge-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          padding: 10px 14px; border-top: 1px solid #f2f2f2;
          background: #fff;
        }
        .md2-badge-verified {
          display: inline-flex; align-items: center; gap: 4px;
          background: #dff5e9; color: #1a7a43; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #b2e0c2;
        }
        .md2-badge-spacer { flex: 1; }
        .md2-share-btn, .md2-save-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 600; color: #444;
          background: none; border: none; cursor: pointer; font-family: inherit;
          padding: 4px 6px; border-radius: 6px; transition: background 0.15s;
        }
        .md2-share-btn:hover, .md2-save-btn:hover { background: #f5f5f5; }
        .md2-save-btn.on { color: #e74c3c; }

        .md2-info-card {
          background: #fff; border-radius: 14px; padding: 18px 20px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .md2-title { font-size: 20px; font-weight: 850; color: #1a1a1a; margin: 0 0 4px; }
        .md2-fee { font-size: 22px; font-weight: 900; color: #0d9488; margin: 4px 0 8px; }
        .md2-meta-row {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          font-size: 12.5px; color: #666; padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0; margin-bottom: 14px;
        }
        .md2-meta-item { display: flex; align-items: center; gap: 4px; }
        .md2-cta-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .md2-btn-apply {
          flex: 1; padding: 12px 20px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; box-shadow: 0 4px 14px rgba(13,148,136,0.3);
          transition: opacity 0.2s, transform 0.15s;
        }
        .md2-btn-apply:hover { opacity: 0.9; transform: translateY(-1px); }
        .md2-btn-chat {
          flex: 1; padding: 12px 20px; border-radius: 9px;
          border: 1.5px solid #0d9488; background: #fff;
          color: #0d9488; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: flex; align-items: center; justify-content: center;
          gap: 7px; transition: background 0.18s;
        }
        .md2-btn-chat:hover { background: #f0fdfa; }

        .md2-chips-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 8px; padding-top: 2px;
        }
        .md2-chip {
          display: flex; flex-direction: column; align-items: center;
          gap: 5px; background: #f8f9fb; border-radius: 10px;
          padding: 10px 6px 9px; border: 1px solid #eef0f3; text-align: center;
          transition: background 0.2s;
        }
        .md2-chip:hover { background: #f0fdfa; }
        .md2-chip-icon {
          width: 30px; height: 30px; display: flex; align-items: center;
          justify-content: center; background: #fff; border-radius: 7px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px;
        }
        .md2-chip-val { font-size: 11.5px; font-weight: 800; color: #1a1a1a; line-height: 1.2; }
        .md2-chip-label { font-size: 9.5px; color: #999; font-weight: 500; }

        .md2-desc-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .md2-sec-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .md2-desc-text { font-size: 13px; color: #444; line-height: 1.85; margin: 0; }
        .md2-desc-text.clip {
          display: -webkit-box; -webkit-line-clamp: 4;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .md2-see-more {
          display: inline-block; margin-top: 6px; font-size: 12.5px;
          font-weight: 600; color: #0d9488; background: none; border: none;
          cursor: pointer; padding: 0; font-family: inherit;
        }
        .md2-see-more:hover { text-decoration: underline; }

        .md2-req-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .md2-req-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        .md2-req-col-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .md2-req-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: #333; padding: 6px 0;
          border-bottom: 1px solid #f8f8f8;
        }
        .md2-req-item:last-child { border-bottom: none; }
        .md2-req-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #0d9488; flex-shrink: 0; margin-top: 6px;
        }

        .md2-company-card {
          background: #fff; border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .md2-company-card-title {
          font-size: 13px; font-weight: 800; color: #1a1a1a;
          margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;
        }
        .md2-company-info { display: flex; flex-direction: column; gap: 0; }
        .md2-ci-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 7px 0; border-bottom: 1px solid #f8f8f8; font-size: 12px; gap: 8px;
        }
        .md2-ci-row:last-child { border-bottom: none; }
        .md2-ci-label { color: #888; font-weight: 500; flex-shrink: 0; }
        .md2-ci-val { color: #1a1a1a; font-weight: 600; text-align: right; word-break: break-word; }

        .md2-location-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .md2-location-card-title {
          font-size: 13px; font-weight: 800; color: #1a1a1a;
          margin: 0; padding: 14px 16px 10px; border-bottom: 1px solid #f0f0f0;
        }
        .md2-map-area {
          width: 100%; height: 160px; position: relative; overflow: hidden;
        }
        .md2-map-iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
          filter: saturate(0.7) brightness(0.9);
        }
        .md2-location-info { padding: 10px 16px; }
        .md2-loc-name { font-size: 13px; font-weight: 700; color: #1a1a1a; margin: 0 0 2px; }
        .md2-loc-city { font-size: 11.5px; color: #666; margin: 0 0 6px; }
        .md2-map-link {
          display: flex; align-items: center; justify-content: center; gap: 4px;
          font-size: 12.5px; font-weight: 600; color: #0d9488;
          text-decoration: none; border-top: 1px solid #f0f0f0;
          padding: 9px 16px; transition: background 0.18s;
        }
        .md2-map-link:hover { background: #f0fdfa; }

        .md2-posted-card {
          background: #fff; border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .md2-posted-card-title {
          font-size: 13px; font-weight: 800; color: #1a1a1a;
          margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;
        }
        .md2-poster-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .md2-poster-avatar {
          width: 46px; height: 46px; border-radius: 50%; object-fit: cover;
          border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.14); display: block;
          flex-shrink: 0;
        }
        .md2-poster-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 3px; }
        .md2-poster-rating { display: flex; align-items: center; gap: 5px; }
        .md2-poster-rnum { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .md2-poster-rcount { font-size: 11.5px; color: #888; }
        .md2-verified-tag {
          display: inline-flex; align-items: center; gap: 4px;
          background: #eafaf5; color: #0b8a6b; border: 1px solid #a8dfcf;
          font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
          margin-bottom: 12px;
        }
        .md2-send-msg {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 11px; border-radius: 9px;
          border: 1.5px solid #ddd; background: #fff; color: #333;
          font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: inherit; transition: background 0.18s;
        }
        .md2-send-msg:hover { background: #f5f5f5; }

        @media (max-width: 960px) {
          .md2-wrap { grid-template-columns: 1fr; }
          .md2-right { order: -1; }
          .md2-chips-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .md2-wrap { padding: 0 12px; margin-top: 10px; gap: 10px; }
          .md2-info-card { padding: 14px; }
          .md2-title { font-size: 17px; }
          .md2-fee { font-size: 18px; }
          .md2-req-grid { grid-template-columns: 1fr; }
          .md2-hero-wrap { height: 200px; }
          .md2-cta-row { flex-direction: column; }
        }
      `}</style>

      <div className="md2-page">
        <div className="md2-topbar">
          <div className="md2-topbar-inner">
            <nav className="md2-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="md2-bc-link">
                Home
              </Link>
              {listing.breadcrumbs.map((crumb, i) => (
                <span
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span className="md2-bc-sep">›</span>
                  {i === listing.breadcrumbs.length - 1 ? (
                    <span className="md2-bc-cur">{crumb}</span>
                  ) : (
                    <Link href="/category/medical" className="md2-bc-link">
                      {crumb}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
            <span
              className="md2-bc-cur"
              style={{ fontWeight: 700, color: "#333", fontSize: 13 }}
            >
              {listing.title}
            </span>
            <span className="md2-lid">Listing ID: {listing.listingId}</span>
          </div>
        </div>

        <div className="md2-wrap">
          <div className="md2-left">
            <div className="md2-gallery">
              <div className="md2-hero-wrap">
                <img
                  src={images[activeImg]}
                  alt={listing.title}
                  className="md2-hero-img"
                />
              </div>

              <div className="md2-thumbs-row">
                {thumbs.map((src, i) => (
                  <div
                    key={i}
                    className={`md2-thumb${activeImg === i ? " on" : ""}`}
                    onClick={() => setActiveImg(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View image ${i + 1}`}
                    onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
                  >
                    <img src={src} alt="" />
                    {i === 4 && extra > 0 && (
                      <div className="md2-thumb-more">+{extra}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="md2-badge-row">
                {listing.isVerified && (
                  <span className="md2-badge-verified">
                    <FiCheckCircle size={9} color="#1a7a43" />
                    Verified Listing
                  </span>
                )}
                <div className="md2-badge-spacer" />
                <button className="md2-share-btn" onClick={handleShare}>
                  <FiShare2 size={13} color="#555" />
                  {copied ? "Copied!" : "Share"}
                </button>
                <button
                  className={`md2-save-btn${isFav ? " on" : ""}`}
                  onClick={() => setIsFav((v) => !v)}
                >
                  {isFav ? (
                    <FaHeart size={13} color="#e74c3c" />
                  ) : (
                    <FiHeart size={13} color="#888" />
                  )}
                  Save
                </button>
              </div>
            </div>

            <div className="md2-info-card">
              <h1 className="md2-title">{listing.doctorName}</h1>
              <div className="md2-fee">{listing.price}</div>

              <div className="md2-meta-row">
                <span className="md2-meta-item">
                  <FiMapPin size={11} color="#888" />
                  {listing.clinicAddress}, {listing.city}
                </span>
                <span className="md2-meta-item">
                  <FiBriefcase size={12} color="#888" />
                  {listing.serviceType}
                </span>
                <span className="md2-meta-item">
                  <FiClock size={12} color="#bbb" />
                  Listed {listing.postedDaysAgo} day
                  {listing.postedDaysAgo !== 1 ? "s" : ""} ago
                </span>
              </div>

              <div className="md2-cta-row">
                <button
                  className="md2-btn-apply"
                  onClick={() => setCallRevealed(true)}
                >
                  {callRevealed
                    ? `Call: ${listing.seller.phone}`
                    : "Book Appointment / Call"}
                </button>
                <button className="md2-btn-chat">
                  <FiMessageSquare
                    size={14}
                    color="#0d9488"
                    style={{ marginRight: "5px" }}
                  />
                  Chat with Provider
                </button>
              </div>

              <div className="md2-chips-row">
                <div className="md2-chip">
                  <div className="md2-chip-icon">🏅</div>
                  <span className="md2-chip-val">{listing.experience || "N/A"}</span>
                  <span className="md2-chip-label">Experience</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">
                    <FaStethoscope size={14} color="#0d9488" />
                  </div>
                  <span className="md2-chip-val">{listing.serviceType}</span>
                  <span className="md2-chip-label">Specialization</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">
                    <FaIdCard size={14} color="#0d9488" />
                  </div>
                  <span className="md2-chip-val">
                    {listing.nmcLicenseNumber}
                  </span>
                  <span className="md2-chip-label">NMC License</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">
                    <FaCalendarCheck size={14} color="#0d9488" />
                  </div>
                  <span className="md2-chip-val">
                    {listing.sameDayBooking
                      ? "Same-day OK"
                      : "Advance booking"}
                  </span>
                  <span className="md2-chip-label">Booking</span>
                </div>
              </div>
            </div>

            <div className="md2-desc-card">
              <h2 className="md2-sec-title">About</h2>
              <p className={`md2-desc-text${!showFull ? " clip" : ""}`}>
                {listing.shortBio || "No bio provided."}
              </p>
              {listing.shortBio && listing.shortBio.length > 200 && (
                <button
                  className="md2-see-more"
                  onClick={() => setShowFull((v) => !v)}
                >
                  {showFull ? "See Less" : "See More"}
                </button>
              )}
            </div>

            <div className="md2-req-card">
              <div className="md2-req-grid">
                <div className="md2-req-col">
                  <h2 className="md2-req-col-title">Services Offered</h2>
                  {listing.servicesOffered.length > 0 ? (
                    listing.servicesOffered.map((r, i) => (
                      <div className="md2-req-item" key={i}>
                        <span className="md2-req-dot" />
                        {r}
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: 13, color: "#999" }}>
                      No services listed.
                    </span>
                  )}
                </div>
                <div className="md2-req-col">
                  <h2 className="md2-req-col-title">Languages Spoken</h2>
                  {listing.languages.length > 0 ? (
                    listing.languages.map((lang, i) => (
                      <div className="md2-req-item" key={i}>
                        <span className="md2-req-dot" />
                        {lang}
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: 13, color: "#999" }}>
                      Not specified.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md2-right">
            <div className="md2-company-card">
              <p className="md2-company-card-title">Clinic Details</p>
              <div className="md2-company-info">
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Clinic Address</span>
                  <span className="md2-ci-val">{listing.clinicAddress}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">City</span>
                  <span className="md2-ci-val">{listing.city}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Home Visit</span>
                  <span className="md2-ci-val">
                    {listing.homeVisitAvailable ? "Available" : "Not available"}
                  </span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Online Appointments</span>
                  <span className="md2-ci-val">
                    {listing.onlineAppointments
                      ? "Available"
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="md2-location-card">
              <p className="md2-location-card-title">Location Map</p>
              <div className="md2-map-area">
                <iframe
                  className="md2-map-iframe"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    listing.clinicAddress + ", " + listing.city
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
              <div className="md2-location-info">
                <p className="md2-loc-name">{listing.clinicAddress}</p>
                <p className="md2-loc-city">{listing.city}</p>
              </div>
              <a
                href={listing.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="md2-map-link"
              >
                <FiMapPin
                  size={12}
                  color="#0d9488"
                  style={{ marginRight: "4px" }}
                />
                View on Map
              </a>
            </div>

            <div className="md2-posted-card">
              <p className="md2-posted-card-title">Doctor</p>
              <div className="md2-poster-top">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="md2-poster-avatar"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-avatar.png";
                  }}
                />
                <div>
                  <p className="md2-poster-name">{listing.seller.name}</p>
                  <div className="md2-poster-rating">
                    <span className="md2-poster-rnum">
                      {listing.seller.rating || "New"}
                    </span>
                    {listing.seller.rating && listing.seller.rating > 0 && (
                      <Stars rating={listing.seller.rating} size={12} />
                    )}
                    {listing.seller.reviewCount ? (
                      <span className="md2-poster-rcount">
                        ({listing.seller.reviewCount} Reviews)
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              {listing.seller.isVerified && (
                <div className="md2-verified-tag">
                  <FiCheckCircle
                    size={10}
                    color="#0b8a6b"
                    style={{ marginRight: "4px" }}
                  />
                  Verified Provider
                </div>
              )}
              <button className="md2-send-msg">
                <FiMail
                  size={14}
                  color="#555"
                  style={{ marginRight: "5px" }}
                />
                Send Message
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}