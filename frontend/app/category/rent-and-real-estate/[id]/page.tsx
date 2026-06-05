"use client";

import { useState } from "react";
import Link from "next/link";
import { FiShare2, FiHeart, FiMapPin, FiClock, FiCheckCircle, FiPhone, FiMessageSquare, FiMaximize, FiDroplet, FiLayers, FiCoffee } from "react-icons/fi";
import { FaStar, FaRegStar, FaHeart, FaBed, FaCar } from "react-icons/fa";

const galleryImages = [
  "/apartment1.jpg",
  "/apartment2.jpg",
  "/apartment3.jpg",
  "/apartment4.jpg",
  "/apartment5.jpg",
  "/apartment6.jpg",
  "/apartment7.jpg",
  "/apartment8.jpg",
  "/apartment9.jpg",
  "/Apartment.avif",
];

export default function PropertyDetailPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [callClicked, setCallClicked] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const visibleThumbs = galleryImages.slice(0, 5);
  const extraCount = galleryImages.length - 5;

  return (
    <>
      <style>{`
        .pd-page {
          background: #f5f6f8;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 60px;
        }

        /* ── Breadcrumb ── */
        .pd-breadcrumb {
          background: #fff;
          border-bottom: 1px solid #ececec;
          padding: 12px 0;
        }
        .pd-breadcrumb-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #888;
        }
        .pd-bc-link {
          color: #555;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.18s;
        }
        .pd-bc-link:hover { color: #C0392B; }
        .pd-bc-sep { color: #bbb; font-size: 12px; }
        .pd-bc-current { color: #1a1a1a; font-weight: 600; }

        /* ── Layout ── */
        .pd-container {
          max-width: 1200px;
          margin: 28px auto 0;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }

        /* ── Left column ── */
        .pd-left { display: flex; flex-direction: column; gap: 18px; }

        /* Main image card */
        .pd-img-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }
        .pd-main-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #1a1a2e;
        }
        .pd-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pd-main-img-wrap:hover .pd-main-img { transform: scale(1.03); }

        /* Thumbnails */
        .pd-thumbs {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: #fff;
          overflow-x: auto;
        }
        .pd-thumb-wrap {
          position: relative;
          flex-shrink: 0;
          width: 90px;
          height: 62px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2.5px solid transparent;
          transition: border-color 0.2s, transform 0.2s;
        }
        .pd-thumb-wrap:hover { transform: translateY(-2px); }
        .pd-thumb-wrap.active { border-color: #C0392B; }
        .pd-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pd-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.52);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
        }

        /* Info card */
        .pd-info-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }

        /* Verified badge */
        .pd-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #eafaf1;
          color: #1e8449;
          font-size: 11.5px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 5px;
          margin-bottom: 10px;
          letter-spacing: 0.3px;
        }

        /* Title row */
        .pd-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 6px;
        }
        .pd-title {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.3;
          margin: 0;
        }
        .pd-action-btns {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .pd-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .pd-action-btn:hover {
          background: #f5f5f5;
          border-color: #ccc;
          transform: scale(1.1);
        }
        .pd-action-btn.fav-active { border-color: #e74c3c; background: #fff5f5; }

        /* Price */
        .pd-price {
          font-size: 26px;
          font-weight: 900;
          color: #1a1a1a;
          margin: 4px 0 12px;
        }
        .pd-price span {
          font-size: 15px;
          font-weight: 500;
          color: #888;
        }

        /* Location row */
        .pd-loc-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 16px;
        }
        .pd-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13.5px;
          color: #555;
          font-weight: 500;
        }
        .pd-dist {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #777;
        }
        .pd-map-link {
          color: #C0392B;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
          transition: opacity 0.2s;
        }
        .pd-map-link:hover { opacity: 0.75; }

        /* Features grid */
        .pd-features {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .pd-feat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: #f8f9fb;
          border-radius: 10px;
          padding: 12px 6px 10px;
          border: 1px solid #eef0f3;
          transition: background 0.2s, border-color 0.2s;
        }
        .pd-feat:hover { background: #f0f2f8; border-color: #d9dde8; }
        .pd-feat-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .pd-feat-val {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
        }
        .pd-feat-label {
          font-size: 10.5px;
          color: #888;
          font-weight: 500;
          text-align: center;
          line-height: 1.3;
        }

        /* ── Right column – Seller Card ── */
        .pd-seller-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          position: sticky;
          top: 80px;
        }
        .pd-seller-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .pd-seller-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .pd-seller-avatar {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.12);
        }
        .pd-seller-online {
          position: absolute;
          bottom: 3px;
          right: 3px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #27ae60;
          border: 2px solid #fff;
        }
        .pd-seller-info { flex: 1; }
        .pd-seller-name {
          font-size: 17px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 4px;
        }
        .pd-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pd-rating-num {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .pd-stars {
          display: flex;
          gap: 2px;
        }
        .pd-reviews {
          font-size: 12px;
          color: #888;
        }

        /* Badges */
        .pd-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .pd-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }
        .pd-badge-verified { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
        .pd-badge-pro { background: #fef9e7; color: #d4ac0d; border: 1px solid #f9e79f; }
        .pd-badge-trusted { background: #f4ecf7; color: #7d3c98; border: 1px solid #d7bde2; }

        /* Stats table */
        .pd-stats {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 16px;
        }
        .pd-stat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid #f7f7f7;
          font-size: 13px;
        }
        .pd-stat-row:last-child { border-bottom: none; }
        .pd-stat-label { color: #666; font-weight: 400; }
        .pd-stat-val { color: #1a1a1a; font-weight: 700; }

        /* CTA buttons */
        .pd-cta-btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pd-btn-call {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(39,174,96,0.35);
          font-family: inherit;
        }
        .pd-btn-call:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(39,174,96,0.4);
        }
        .pd-btn-call:active { transform: translateY(0); }
        .pd-btn-call.revealed { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); }

        .pd-btn-chat {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: 2px solid #8e44ad;
          background: linear-gradient(135deg, #8e44ad 0%, #6c3483 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(142,68,173,0.3);
          font-family: inherit;
        }
        .pd-btn-chat:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(142,68,173,0.38);
        }
        .pd-btn-chat:active { transform: translateY(0); }

        /* ── Description card ── */
        .pd-desc-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }
        .pd-section-title {
          font-size: 17px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 12px;
        }
        .pd-desc-text {
          font-size: 14px;
          color: #444;
          line-height: 1.75;
          margin: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .pd-desc-text.clamped {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pd-see-more {
          display: inline-block;
          margin-top: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #2980b9;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          transition: opacity 0.2s;
        }
        .pd-see-more:hover { opacity: 0.75; }

        /* ── Details card ── */
        .pd-details-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          border-top: 3px solid #4B6BFB;
        }
        .pd-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .pd-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid #f3f4f6;
          font-size: 13.5px;
          gap: 12px;
        }
        .pd-detail-row:last-child { border-bottom: none; }
        .pd-detail-label { color: #666; font-weight: 400; }
        .pd-detail-val { color: #1a1a1a; font-weight: 700; }
        .pd-details-divider {
          width: 1px;
          background: #f0f0f0;
          margin: 0 28px;
          align-self: stretch;
        }

        /* ── Related Listings ── */
        .pd-related-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 24px 0;
        }
        .pd-related-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .pd-related-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
        }
        .pd-related-viewall {
          font-size: 13.5px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.2s;
        }
        .pd-related-viewall:hover { opacity: 0.75; }
        .pd-related-scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 12px;
          scrollbar-width: thin;
          scrollbar-color: #ddd transparent;
        }
        .pd-related-scroll::-webkit-scrollbar { height: 5px; }
        .pd-related-scroll::-webkit-scrollbar-track { background: transparent; }
        .pd-related-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        .pd-rel-card {
          flex-shrink: 0;
          width: 178px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid #ebebeb;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          cursor: pointer;
        }
        .pd-rel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-color: #ddd;
        }
        .pd-rel-img-wrap {
          width: 100%;
          height: 120px;
          overflow: hidden;
          position: relative;
        }
        .pd-rel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .pd-rel-card:hover .pd-rel-img { transform: scale(1.07); }
        .pd-rel-badge {
          position: absolute;
          bottom: 7px;
          left: 7px;
          background: #27ae60;
          color: #fff;
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .pd-rel-body {
          padding: 9px 10px 11px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .pd-rel-name {
          font-size: 12px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }
        .pd-rel-price {
          font-size: 12.5px;
          font-weight: 800;
          color: #C0392B;
          margin: 2px 0 0;
        }
        .pd-rel-loc {
          font-size: 10.5px;
          color: #999;
          margin: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .pd-container {
            grid-template-columns: 1fr;
          }
          .pd-seller-card { position: static; }
          .pd-features { grid-template-columns: repeat(3, 1fr); }
          .pd-details-grid { grid-template-columns: 1fr; }
          .pd-details-divider { display: none; }
        }
        @media (max-width: 600px) {
          .pd-title { font-size: 18px; }
          .pd-price { font-size: 22px; }
          .pd-features { grid-template-columns: repeat(3, 1fr); }
          .pd-container { padding: 0 14px; margin-top: 18px; }
          .pd-related-section { padding: 20px 14px 0; }
        }
        @media (max-width: 420px) {
          .pd-features { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="pd-page">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <div className="pd-breadcrumb-inner">
            <Link href="/" className="pd-bc-link">Home</Link>
            <span className="pd-bc-sep">›</span>
            <Link href="/category/rent-and-real-estate" className="pd-bc-link">Property</Link>
            <span className="pd-bc-sep">›</span>
            <Link href="/category/rent-and-real-estate" className="pd-bc-link">Apartment</Link>
            <span className="pd-bc-sep">›</span>
            <span className="pd-bc-current">2BKH Modern Apartment in Lazimpat</span>
          </div>
        </nav>

        {/* Main layout */}
        <div className="pd-container">
          {/* ── LEFT COLUMN ── */}
          <div className="pd-left">

            {/* Image gallery card */}
            <div className="pd-img-card">
              {/* Main image */}
              <div className="pd-main-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryImages[activeImg]}
                  alt="2BKH Modern Apartment in Lazimpat"
                  className="pd-main-img"
                />
              </div>

              {/* Thumbnails */}
              <div className="pd-thumbs">
                {visibleThumbs.map((src, i) => (
                  <div
                    key={i}
                    className={`pd-thumb-wrap${activeImg === i ? " active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`View ${i + 1}`} className="pd-thumb-img" />
                    {i === 4 && extraCount > 0 && (
                      <div className="pd-thumb-overlay">+{extraCount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Property info card */}
            <div className="pd-info-card">
              {/* Verified */}
              <div className="pd-verified-badge">
                <FiCheckCircle size={13} color="#1e8449" />
                Verified
              </div>

              {/* Title + actions */}
              <div className="pd-title-row">
                <h1 className="pd-title">2BKH Modern Apartment in Lazimpat</h1>
                <div className="pd-action-btns">
                  {/* Share */}
                  <button className="pd-action-btn" aria-label="Share listing">
                    <FiShare2 size={16} color="#555" />
                  </button>
                  {/* Favourite */}
                  <button
                    className={`pd-action-btn${isFav ? " fav-active" : ""}`}
                    aria-label="Save to wishlist"
                    onClick={() => setIsFav((v) => !v)}
                  >
                    {isFav ? <FaHeart size={16} color="#e74c3c" /> : <FiHeart size={16} color="#888" />}
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="pd-price">Rs. 25,000 <span>/month</span></div>

              {/* Location */}
              <div className="pd-loc-row">
                <span className="pd-location">
                  <FiMapPin size={13} color="#888" />
                  Lazimpat, Kathmandu
                </span>
                <span className="pd-dist">
                  <FiClock size={13} color="#aaa" />
                  1.2 km from city center
                </span>
                <a href="#map" className="pd-map-link">
                  <FiMapPin size={13} color="#C0392B" />
                  View on Map
                </a>
              </div>

              {/* Features */}
              <div className="pd-features">
                {/* Bedrooms */}
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FaBed size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val">2</span>
                  <span className="pd-feat-label">Bedrooms</span>
                </div>
                {/* Bathrooms */}
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FiDroplet size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val">2</span>
                  <span className="pd-feat-label">Bathrooms</span>
                </div>
                {/* Kitchen */}
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FiCoffee size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val">1</span>
                  <span className="pd-feat-label">Kitchen</span>
                </div>
                {/* Sq ft */}
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FiMaximize size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val" style={{fontSize:"12px"}}>1200</span>
                  <span className="pd-feat-label">Sq. ft</span>
                </div>
                {/* Floor */}
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FiLayers size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val">2</span>
                  <span className="pd-feat-label">Floor</span>
                </div>
                {/* Parking */}
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FaCar size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val" style={{fontSize:"10px",lineHeight:"1.2"}}>Avail.</span>
                  <span className="pd-feat-label">Parking</span>
                </div>
              </div>
            </div>

            {/* ── Description ── */}
            <div className="pd-desc-card">
              <h2 className="pd-section-title">Description</h2>
              <p className={`pd-desc-text${showFull ? "" : " clamped"}`}>
                This is a modern 2BHK apartment located in the heart of Lazimpat with easy access to shopping,
                restaurants, schools and public transport. The apartment is semi-furnished with modular kitchen,
                wardrobes and premium fittings. It enjoys ample natural light through large windows, a spacious
                living area and a beautiful mountain view from the balcony. The building has 24-hour security,
                CCTV surveillance, backup power and a dedicated parking space. Ideal for small families or
                working professionals looking for a comfortable and convenient lifestyle in Kathmandu.
              </p>
              <button className="pd-see-more" onClick={() => setShowFull(v => !v)}>
                {showFull ? "See Less ▲" : "See More ▼"}
              </button>
            </div>

            {/* ── Details ── */}
            <div className="pd-details-card">
              <h2 className="pd-section-title">Details</h2>
              <div className="pd-details-grid">
                {/* Left column */}
                <div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Property type</span>
                    <span className="pd-detail-val">Apartment</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Furnishing</span>
                    <span className="pd-detail-val">Semi-furnished</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Bathrooms</span>
                    <span className="pd-detail-val">2</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Balcony</span>
                    <span className="pd-detail-val">1</span>
                  </div>
                </div>
                {/* Divider */}
                <div className="pd-details-divider" />
                {/* Right column */}
                <div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Floor</span>
                    <span className="pd-detail-val">2nd</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Total floors</span>
                    <span className="pd-detail-val">5</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Parking</span>
                    <span className="pd-detail-val">Yes</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Listed On</span>
                    <span className="pd-detail-val">May 12, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN – Seller Card ── */}
          <div className="pd-seller-card">
            {/* Seller top */}
            <div className="pd-seller-top">
              <div className="pd-seller-avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/lady.jpg"
                  alt="Riya Shah"
                  className="pd-seller-avatar"
                />
                <span className="pd-seller-online" />
              </div>
              <div className="pd-seller-info">
                <p className="pd-seller-name">Riya Shah</p>
                <div className="pd-rating-row">
                  <span className="pd-rating-num">4.8</span>
                  <div className="pd-stars">
                    {[1, 2, 3, 4].map((s) => (
                      <FaStar key={s} size={14} color="#F1C40F" />
                    ))}
                    <FaRegStar size={14} color="#F1C40F" />
                  </div>
                  <span className="pd-reviews">(26 Reviews)</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="pd-badges">
              <span className="pd-badge pd-badge-verified">
                <FiCheckCircle size={11} color="#1e8449" style={{ marginRight: '3px' }} />
                Verified Seller
              </span>
              <span className="pd-badge pd-badge-pro">
                <FaStar size={11} color="#d4ac0d" style={{ marginRight: '3px' }} />
                Pro Member
              </span>
              <span className="pd-badge pd-badge-trusted">
                <FaStar size={11} color="#7d3c98" style={{ marginRight: '3px' }} />
                Trusted
              </span>
            </div>

            {/* Stats */}
            <div className="pd-stats">
              <div className="pd-stat-row">
                <span className="pd-stat-label">Member since</span>
                <span className="pd-stat-val">Jan 2022</span>
              </div>
              <div className="pd-stat-row">
                <span className="pd-stat-label">Total listing</span>
                <span className="pd-stat-val">24</span>
              </div>
              <div className="pd-stat-row">
                <span className="pd-stat-label">Response Rate</span>
                <span className="pd-stat-val">98%</span>
              </div>
              <div className="pd-stat-row">
                <span className="pd-stat-label">Avg. Response Time</span>
                <span className="pd-stat-val">10 min</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pd-cta-btns">
              <button
                id="btn-call-seller"
                className={`pd-btn-call${callClicked ? " revealed" : ""}`}
                onClick={() => setCallClicked(true)}
              >
                <FiPhone size={17} color="#fff" style={{ marginRight: '5px' }} />
                {callClicked ? "+977-98XXXXXXXX" : "Call"}
              </button>
              <button id="btn-chat-seller" className="pd-btn-chat">
                <FiMessageSquare size={17} color="#fff" style={{ marginRight: '5px' }} />
                Chat Now
              </button>
            </div>
          </div>
        </div>

        {/* ── Related Listings ── */}
        <div className="pd-related-section">
          <div className="pd-related-header">
            <h2 className="pd-related-title">Related Listings</h2>
            <Link href="/category/rent-and-real-estate" className="pd-related-viewall">View All →</Link>
          </div>
          <div className="pd-related-scroll">
            {[
              { id:1, title:"2BHK Apartment in Jawalakhel",    price:"Rs. 28,000/month", loc:"Jawalakhel, Lalitpur",  img:"/Apartment.jpg" },
              { id:2, title:"2BHK Apartment in Sanepa",       price:"Rs. 17,000/month", loc:"Sanepa, Lalitpur",     img:"/apartment.avif" },
              { id:3, title:"3BHK Apartment Lazimpat",        price:"Rs. 32,000/month", loc:"Lazimpat, Kathmandu",  img:"/Apartment.jpg" },
              { id:4, title:"2BHK Apartment in Baneshwor",    price:"Rs. 11,000/month", loc:"Baneshwor, Kathmandu", img:"/apartment.avif" },
              { id:5, title:"1BHK Apartment in Jawalakhel",   price:"Rs. 8,000/month",  loc:"Jawalakhel, Lalitpur", img:"/Apartment.jpg" },
              { id:6, title:"3BHK Apartment in Bhaktapur",    price:"Rs. 2,000/month",  loc:"Bhaktapur, Bagmati",  img:"/apartment.avif" },
              { id:7, title:"2BHK Apartment in Laganthet",    price:"Rs. 15,000/month", loc:"Laganthet, Lalitpur",  img:"/Apartment.jpg" },
              { id:8, title:"Studio Apartment in Thamel",     price:"Rs. 12,000/month", loc:"Thamel, Kathmandu",   img:"/apartment.avif" },
            ].map((item) => (
              <div key={item.id} className="pd-rel-card">
                <div className="pd-rel-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.title} className="pd-rel-img" />
                  <span className="pd-rel-badge">
                    <FiCheckCircle size={8} color="#fff" style={{ marginRight: '3px' }} />
                    Verified
                  </span>
                </div>
                <div className="pd-rel-body">
                  <p className="pd-rel-name">{item.title}</p>
                  <p className="pd-rel-price">{item.price}</p>
                  <p className="pd-rel-loc">{item.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
