"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiPhone, 
  FiMessageSquare, 
  FiShare2, 
  FiHeart, 
  FiTag, 
  FiClock, 
  FiCheckCircle, 
  FiShield, 
  FiAward, 
  FiLayers 
} from "react-icons/fi";
import { FaHeart, FaStar, FaHandshake } from "react-icons/fa";

const LISTINGS = [
  {
    id: "wooden-study-table",
    title: "Wooden Study Table",
    category: "Furniture",
    price: "NPR 8,500",
    location: "Kathmandu, Nepal",
    district: "Kathmandu",
    images: ["/table1.jpg"],
    condition: "Like New" as const,
    postedDaysAgo: 2,
    isOpenToOffers: true,
    sellerName: "Ramesh KC",
    sellerPhone: "9801234567",
    description: "Barely used wooden study table. Perfect for students. Solid wood construction. No scratches or damage.",
  },
  {
    id: "baby-clothes",
    title: "Newborn Baby Girl Summer Clothes for (0-2years)",
    category: "Clothing",
    price: "NPR 500",
    location: "Balkumari, Lalitpur, Nepal",
    district: "Lalitpur",
    images: ["/baby-clothes.jpg"],
    condition: "Like New" as const,
    postedDaysAgo: 1,
    isOpenToOffers: true,
    sellerName: "Sunita Sharma",
    sellerPhone: "9812345678",
    description: "Gently used baby clothes. All washed and sanitized. Various sizes available. Smoke-free home.",
  },
  {
    id: "wooden-bed",
    title: "Wooden Bed",
    category: "Furniture",
    price: "NPR 2,500",
    location: "Balkhu, Kathmandu, Nepal",
    district: "Kathmandu",
    images: ["/bed.jpg"],
    condition: "Good" as const,
    postedDaysAgo: 0,
    isOpenToOffers: true,
    sellerName: "Hari Prasad",
    sellerPhone: "9823456789",
    description: "Single wooden bed in good condition. Minor scratches but sturdy. Mattress not included.",
  },
  {
    id: "science-book",
    title: "Science book(class 10)",
    category: "Books",
    price: "NPR 300",
    location: "Thapathali, Kathmandu, Nepal",
    district: "Kathmandu",
    images: ["/book.jpg"],
    condition: "Good" as const,
    postedDaysAgo: 1,
    isOpenToOffers: false,
    sellerName: "Anish Thapa",
    sellerPhone: "9834567890",
    description: "Class 10 science book in good condition. Some notes written inside. NCERT syllabus.",
  },
  {
    id: "sari",
    title: "Sari",
    category: "Clothing",
    price: "NPR 500",
    location: "New road, Kathmandu, Nepal",
    district: "Kathmandu",
    images: ["/sari.jpg"],
    condition: "Fair" as const,
    postedDaysAgo: 2,
    isOpenToOffers: false,
    sellerName: "Maya Devi",
    sellerPhone: "9845678901",
    description: "Traditional sari. Slightly faded but still beautiful. Perfect for festivals.",
  },
  {
    id: "badminton",
    title: "Badminton",
    category: "Sports",
    price: "NPR 500",
    location: "Ratnapark, Kathmandu, Nepal",
    district: "Kathmandu",
    images: ["/badminton.jpg"],
    condition: "Like New" as const,
    postedDaysAgo: 2,
    isOpenToOffers: true,
    sellerName: "Prakash Rai",
    sellerPhone: "9856789012",
    description: "Badminton racket and shuttlecocks. Used only a few times. Yonex brand.",
  },
];

const CONDITION_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Like New": { bg: "#e8f5e9", color: "#2e7d32", border: "#c8e6c9" },
  "Good": { bg: "#e8f5e9", color: "#1b5e20", border: "#a5d6a7" },
  "Fair": { bg: "#fff8e1", color: "#f57f17", border: "#ffe082" },
  "For parts": { bg: "#ffebee", color: "#c62828", border: "#ffcdd2" },
};

export default function SecondhandDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const item = LISTINGS.find((l) => l.id === id);

  const [isFav, setIsFav] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [chatting, setChatting] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Listing Not Found</h1>
          <p className="text-stone-500 mb-4">The item you are looking for does not exist.</p>
          <Link 
            href="/category/secondhand" 
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold"
          >
            <FiArrowLeft size={18} />
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const related = LISTINGS.filter((l) => l.id !== id).slice(0, 4);

  return (
    <>
      <style>{`
        .sh-page {
          background: #f8f9fa;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 60px;
        }

        /* ── Breadcrumb ── */
        .sh-breadcrumb {
          background: #fff;
          border-bottom: 1px solid #eef0f2;
          padding: 14px 0;
        }
        .sh-breadcrumb-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #71717a;
        }
        .sh-bc-link {
          color: #52525b;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .sh-bc-link:hover { color: #e11d48; }
        .sh-bc-sep { color: #d4d4d8; font-size: 11px; }
        .sh-bc-current { color: #18181b; font-weight: 600; }

        /* ── Layout ── */
        .sh-container {
          max-width: 1200px;
          margin: 32px auto 0;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }

        /* ── Left column ── */
        .sh-left { display: flex; flex-direction: column; gap: 20px; }

        /* Image Card */
        .sh-img-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #eaeaea;
        }
        .sh-main-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: #f4f4f5;
        }
        .sh-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .sh-img-card:hover .sh-main-img { transform: scale(1.02); }

        /* Info Card */
        .sh-info-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #eaeaea;
        }
        .sh-badge-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .sh-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid transparent;
        }
        .sh-badge-cat {
          background: #fff1f2;
          color: #e11d48;
          border-color: #ffe4e6;
        }
        
        .sh-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 8px;
        }
        .sh-title {
          font-size: 24px;
          font-weight: 800;
          color: #18181b;
          line-height: 1.3;
          margin: 0;
        }
        .sh-action-btns {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }
        .sh-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #e4e4e7;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .sh-action-btn:hover {
          background: #fafafa;
          border-color: #a1a1aa;
          transform: scale(1.08);
        }
        .sh-action-btn.fav-active { border-color: #ef4444; background: #fef2f2; }

        .sh-price {
          font-size: 28px;
          font-weight: 900;
          color: #e11d48;
          margin: 6px 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sh-price-tag {
          font-size: 11px;
          font-weight: 700;
          background: #faf5ff;
          color: #7c3aed;
          border: 1px solid #f3e8ff;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .sh-loc-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          padding-top: 16px;
          border-top: 1px solid #f4f4f5;
        }
        .sh-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: #52525b;
          font-weight: 500;
        }

        /* Features */
        .sh-features-title {
          font-size: 12px;
          font-weight: 800;
          color: #71717a;
          margin: 24px 0 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .sh-features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .sh-feat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: #fafafa;
          border-radius: 12px;
          padding: 14px 10px;
          border: 1px solid #f4f4f5;
          transition: all 0.2s;
        }
        .sh-feat:hover { background: #f4f4f5; border-color: #e4e4e7; transform: translateY(-2px); }
        .sh-feat-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          color: #e11d48;
        }
        .sh-feat-val {
          font-size: 13.5px;
          font-weight: 800;
          color: #18181b;
          text-align: center;
        }
        .sh-feat-label {
          font-size: 11px;
          color: #71717a;
          font-weight: 500;
          text-align: center;
        }

        /* Desc Card */
        .sh-desc-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #eaeaea;
        }
        .sh-section-title {
          font-size: 16px;
          font-weight: 800;
          color: #18181b;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sh-desc-text {
          font-size: 14.5px;
          color: #3f3f46;
          line-height: 1.8;
          margin: 0;
        }

        /* Safety Card */
        .sh-safety-card {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          gap: 14px;
        }
        .sh-safety-icon {
          color: #d97706;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .sh-safety-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #78350f;
          margin: 0 0 6px;
        }
        .sh-safety-list {
          margin: 0;
          padding-left: 18px;
          font-size: 13px;
          color: #92400e;
          line-height: 1.6;
        }

        /* ── Sidebar ── */
        .sh-sidebar {
          background: #fff;
          border-radius: 16px;
          padding: 24px 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #eaeaea;
          position: sticky;
          top: 88px;
        }
        .sh-seller-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .sh-avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(225,29,72,0.2);
          position: relative;
        }
        .sh-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #fff;
        }
        .sh-seller-name {
          font-size: 16px;
          font-weight: 800;
          color: #18181b;
          margin: 0 0 2px;
        }
        .sh-seller-stars {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .sh-seller-reviews {
          font-size: 11.5px;
          color: #71717a;
        }

        .sh-stats {
          border-top: 1px solid #f4f4f5;
          border-bottom: 1px solid #f4f4f5;
          padding: 12px 0;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sh-stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .sh-stat-lbl { color: #71717a; }
        .sh-stat-val { color: #18181b; font-weight: 700; }

        /* CTA buttons */
        .sh-ctas {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sh-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          border: none;
          font-family: inherit;
          text-decoration: none;
        }
        .sh-btn-call {
          background: #e11d48;
          color: #fff;
          box-shadow: 0 4px 12px rgba(225,29,72,0.25);
        }
        .sh-btn-call:hover {
          background: #be123c;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(225,29,72,0.35);
        }
        .sh-btn-chat {
          background: #fff;
          color: #18181b;
          border: 1.5px solid #e4e4e7;
        }
        .sh-btn-chat:hover {
          background: #fafafa;
          border-color: #a1a1aa;
        }
        
        /* ── Related listings ── */
        .sh-related {
          max-width: 1200px;
          margin: 40px auto 0;
          padding: 0 24px;
        }
        .sh-related-title {
          font-size: 18px;
          font-weight: 800;
          color: #18181b;
          margin: 0 0 16px;
        }
        .sh-related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .sh-rel-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e4e4e7;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transition: all 0.2s;
        }
        .sh-rel-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
          border-color: #d4d4d8;
        }
        .sh-rel-img-wrap {
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #f4f4f5;
          position: relative;
        }
        .sh-rel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .sh-rel-card:hover .sh-rel-img { transform: scale(1.04); }
        
        .sh-rel-condition {
          position: absolute;
          top: 8px; left: 8px;
          font-size: 9px; font-weight: 700;
          padding: 2px 6px; border-radius: 4px;
          background: rgba(255,255,255,0.9);
          border: 1px solid #e4e4e7;
          color: #18181b;
        }
        .sh-rel-body {
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .sh-rel-name {
          font-size: 13px;
          font-weight: 800;
          color: #18181b;
          margin: 0;
          line-clamp: 2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }
        .sh-rel-price {
          font-size: 13px;
          font-weight: 800;
          color: #e11d48;
          margin: 2px 0 0;
        }
        .sh-rel-loc {
          font-size: 10.5px;
          color: #71717a;
          margin: auto 0 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .sh-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .sh-sidebar {
            position: static;
          }
          .sh-related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }
        @media (max-width: 600px) {
          .sh-container {
            padding: 0 16px;
            margin-top: 20px;
          }
          .sh-related {
            padding: 0 16px;
          }
          .sh-features {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="sh-page">
        {/* Breadcrumb */}
        <nav className="sh-breadcrumb" aria-label="Breadcrumb">
          <div className="sh-breadcrumb-inner">
            <Link href="/" className="sh-bc-link">Home</Link>
            <span className="sh-bc-sep">›</span>
            <Link href="/category/secondhand" className="sh-bc-link">Secondhand</Link>
            <span className="sh-bc-sep">›</span>
            <span className="sh-bc-current">{item.title}</span>
          </div>
        </nav>

        {/* Main layout */}
        <div className="sh-container">
          {/* ── LEFT COLUMN ── */}
          <div className="sh-left">

            {/* Image card */}
            <div className="sh-img-card">
              <div className="sh-main-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="sh-main-img"
                />
              </div>
            </div>

            {/* Product info card */}
            <div className="sh-info-card">
              {/* Badges */}
              <div className="sh-badge-row">
                <span className="sh-badge sh-badge-cat">{item.category}</span>
                <span 
                  className="sh-badge"
                  style={{
                    background: CONDITION_COLORS[item.condition]?.bg || "#fafafa",
                    color: CONDITION_COLORS[item.condition]?.color || "#18181b",
                    borderColor: CONDITION_COLORS[item.condition]?.border || "#eaeaea"
                  }}
                >
                  {item.condition}
                </span>
              </div>

              {/* Title + actions */}
              <div className="sh-title-row">
                <h1 className="sh-title">{item.title}</h1>
                <div className="sh-action-btns">
                  {/* Share */}
                  <button className="sh-action-btn" aria-label="Share listing">
                    <FiShare2 size={16} color="#71717a" />
                  </button>
                  {/* Favourite */}
                  <button
                    className={`sh-action-btn${isFav ? " fav-active" : ""}`}
                    aria-label="Save to wishlist"
                    onClick={() => setIsFav((v) => !v)}
                  >
                    {isFav ? <FaHeart size={16} color="#ef4444" /> : <FiHeart size={16} color="#71717a" />}
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="sh-price">
                {item.price}
                {item.isOpenToOffers && <span className="sh-price-tag">Open to Offers</span>}
              </div>

              {/* Location and Posted Time */}
              <div className="sh-loc-row">
                <span className="sh-meta-item">
                  <FiMapPin size={14} color="#71717a" />
                  {item.location}
                </span>
                <span className="sh-meta-item">
                  <FiClock size={14} color="#71717a" />
                  Posted {item.postedDaysAgo === 0 ? "Today" : item.postedDaysAgo === 1 ? "1 day ago" : `${item.postedDaysAgo} days ago`}
                </span>
              </div>

              {/* Features / Specifications */}
              <h2 className="sh-features-title">Specifications</h2>
              <div className="sh-features">
                {/* Category */}
                <div className="sh-feat">
                  <div className="sh-feat-icon">
                    <FiTag size={20} />
                  </div>
                  <span className="sh-feat-val">{item.category}</span>
                  <span className="sh-feat-label">Category</span>
                </div>
                {/* Condition */}
                <div className="sh-feat">
                  <div className="sh-feat-icon">
                    <FiAward size={20} />
                  </div>
                  <span className="sh-feat-val">{item.condition}</span>
                  <span className="sh-feat-label">Condition</span>
                </div>
                {/* Pricing Type */}
                <div className="sh-feat">
                  <div className="sh-feat-icon">
                    <FaHandshake size={20} />
                  </div>
                  <span className="sh-feat-val">{item.isOpenToOffers ? "Negotiable" : "Fixed Price"}</span>
                  <span className="sh-feat-label">Pricing Type</span>
                </div>
                {/* District */}
                <div className="sh-feat">
                  <div className="sh-feat-icon">
                    <FiMapPin size={20} />
                  </div>
                  <span className="sh-feat-val">{item.district}</span>
                  <span className="sh-feat-label">District</span>
                </div>
              </div>
            </div>

            {/* Description card */}
            <div className="sh-desc-card">
              <h2 className="sh-section-title">
                <FiLayers size={16} color="#e11d48" />
                Description
              </h2>
              <p className="sh-desc-text">{item.description}</p>
            </div>

            {/* Safety Guidelines */}
            <div className="sh-safety-card">
              <FiShield size={24} className="sh-safety-icon" />
              <div>
                <h3 className="sh-safety-title">Safety Guidelines for Buyers</h3>
                <ul className="sh-safety-list">
                  <li>Meet the seller in a public, secure location like a mall or cafe.</li>
                  <li>Always verify and inspect the condition of the item before making any payment.</li>
                  <li>Never transfer money online (eSewa, Khalti, IPS) as advance deposits before seeing the item.</li>
                  <li>Beware of listings offering price quotes that are unrealistically low.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Seller Card) ── */}
          <aside className="sh-sidebar">
            <div className="sh-seller-top">
              <div className="sh-avatar">
                {item.sellerName?.charAt(0) || "U"}
                <span className="sh-online-dot" />
              </div>
              <div>
                <h3 className="sh-seller-name">{item.sellerName || "Verified Seller"}</h3>
                <div className="sh-seller-stars">
                  <FaStar size={11} color="#f59e0b" />
                  <FaStar size={11} color="#f59e0b" />
                  <FaStar size={11} color="#f59e0b" />
                  <FaStar size={11} color="#f59e0b" />
                  <FaStar size={11} color="#e4e4e7" />
                  <span className="sh-seller-reviews">(12 reviews)</span>
                </div>
              </div>
            </div>

            <div className="sh-stats">
              <div className="sh-stat-row">
                <span className="sh-stat-lbl">Response Rate</span>
                <span className="sh-stat-val">97%</span>
              </div>
              <div className="sh-stat-row">
                <span className="sh-stat-lbl">Active Listings</span>
                <span className="sh-stat-val">3 listings</span>
              </div>
              <div className="sh-stat-row">
                <span className="sh-stat-lbl">Member Since</span>
                <span className="sh-stat-val">June 2024</span>
              </div>
            </div>

            <div className="sh-ctas">
              <button 
                className="sh-btn sh-btn-call"
                onClick={() => setPhoneRevealed(!phoneRevealed)}
              >
                <FiPhone size={16} />
                {phoneRevealed ? item.sellerPhone : "Call Seller"}
              </button>
              <button 
                className="sh-btn sh-btn-chat"
                onClick={() => setChatting(!chatting)}
              >
                <FiMessageSquare size={16} />
                {chatting ? "Chat Active" : "Chat Now"}
              </button>
            </div>
          </aside>
        </div>

        {/* ── Related Listings Section ── */}
        {related.length > 0 && (
          <div className="sh-related">
            <h2 className="sh-related-title">More Secondhand Deals</h2>
            <div className="sh-related-grid">
              {related.map((rel) => (
                <Link href={`/category/secondhand/${rel.id}`} key={rel.id} className="sh-rel-card">
                  <div className="sh-rel-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rel.images[0]} alt={rel.title} className="sh-rel-img" />
                    <span className="sh-rel-condition">{rel.condition}</span>
                  </div>
                  <div className="sh-rel-body">
                    <p className="sh-rel-name">{rel.title}</p>
                    <p className="sh-rel-price">{rel.price}</p>
                    <p className="sh-rel-loc">{rel.district}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}