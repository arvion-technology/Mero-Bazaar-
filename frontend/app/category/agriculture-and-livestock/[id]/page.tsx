"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import {
  FiMapPin, FiMessageSquare, FiArrowLeft,
  FiPhone, FiShare2, FiHeart, FiCheckCircle,
  FiCalendar, FiUser,
} from "react-icons/fi";
import { FaHeart, FaLeaf, FaShieldAlt } from "react-icons/fa";

type AgriListing = {
  id: string;
  title: string;
  category: "Produce" | "Livestock" | "Tools" | "Service";
  price: string;
  unit?: string;
  location: string;
  district: string;
  image: string;
  isOrganic?: boolean;
  availability?: string;
  breed?: string;
  age?: string;
  isVaccinated?: boolean;
  healthStatus?: "Vaccinated" | "Non-Vaccinated";
  seasonal?: string;
  description?: string;
  sellerName?: string;
  sellerPhone?: string;
  postedDaysAgo?: number;
};

const LISTINGS: AgriListing[] = [
  {
    id: "organic-tomatoes",
    title: "Organic Tomatoes",
    category: "Produce",
    price: "NPR 120/Kg",
    location: "Chitwan",
    district: "Chitwan",
    image: "/tomatoes.jpg",
    isOrganic: true,
    availability: "Available Always",
    seasonal: "Spring",
    description: "Fresh organic tomatoes grown without pesticides. Perfect for salads, cooking, and daily use. Sourced directly from local farms in Chitwan with zero chemical inputs. Rich in vitamins and antioxidants.",
    sellerName: "Ram Bahadur",
    sellerPhone: "9801234567",
    postedDaysAgo: 2,
  },
  {
    id: "cow-brown",
    title: "Cow",
    category: "Livestock",
    price: "NRP 150,000",
    location: "Rupandehi",
    district: "Rupandehi",
    image: "/cow.jpg",
    breed: "Cow",
    age: "3 years",
    isVaccinated: true,
    healthStatus: "Vaccinated",
    description: "Healthy vaccinated cow with good milk production capacity. Fully health-checked and vaccinated. Produces 10–12 liters of milk per day. Ideal for dairy farming.",
    sellerName: "Hari Prasad",
    sellerPhone: "9807654321",
    postedDaysAgo: 1,
  },
  {
    id: "cauliflower",
    title: "Cauliflower",
    category: "Produce",
    price: "NPR 100/Kg",
    location: "Chitwan",
    district: "Chitwan",
    image: "/cauliflower.jpg",
    isOrganic: true,
    availability: "Available Oct-Dec",
    seasonal: "Autumn",
    description: "Fresh organic cauliflower from local farms. Grown with natural compost, no chemical fertilizers. Harvested fresh daily. Bulk orders available.",
    sellerName: "Sita Devi",
    sellerPhone: "9812345678",
    postedDaysAgo: 3,
  },
  {
    id: "jersey-1",
    title: "Jersey",
    category: "Livestock",
    price: "NRP 150,000",
    location: "Rupandehi",
    district: "Rupandehi",
    image: "/jersey.jpg",
    breed: "Jersey",
    age: "5 years",
    isVaccinated: true,
    healthStatus: "Vaccinated",
    description: "Pure breed Jersey cow with high milk yield. Known for rich and creamy milk. Fully vaccinated and health-certified. Excellent temperament, easy to manage.",
    sellerName: "Gopal Sharma",
    sellerPhone: "9823456789",
    postedDaysAgo: 1,
  },
  {
    id: "organic-potatoes",
    title: "Organic Potatos",
    category: "Produce",
    price: "NPR 140/Kg",
    location: "Chitwan",
    district: "Chitwan",
    image: "/potatoes.jpg",
    isOrganic: true,
    availability: "Available Oct-Dec",
    seasonal: "Autumn",
    description: "Farm fresh organic potatoes grown in rich Chitwan soil. Free from pesticides and chemicals. Available for wholesale and retail. Consistent supply throughout the season.",
    sellerName: "Mohan Thapa",
    sellerPhone: "9834567890",
    postedDaysAgo: 5,
  },
  {
    id: "jersey-2",
    title: "Jersey",
    category: "Livestock",
    price: "NRP 150,000",
    location: "Rupandehi",
    district: "Rupandehi",
    image: "/jersey2.jpg",
    breed: "Jersey",
    age: "5 years",
    isVaccinated: true,
    healthStatus: "Vaccinated",
    description: "Healthy Jersey cow for sale. Vaccinated and health-checked. Good milk production and easy to manage. Suitable for home dairy or commercial farming.",
    sellerName: "Krishna Adhikari",
    sellerPhone: "9845678901",
    postedDaysAgo: 2,
  },
];

const RELATED_LIMIT = 3;

export default function AgriDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const item = LISTINGS.find((l) => l.id === id);

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "Livestock": return { background: "#ec4899", color: "#fff" };
      case "Produce":   return { background: "#10b981", color: "#fff" };
      case "Tools":     return { background: "#3b82f6", color: "#fff" };
      default:          return { background: "#8b5cf6", color: "#fff" };
    }
  };

  if (!item) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
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
          <p>The item you are looking for does not exist.</p>
          <Link href="/category/agriculture-and-livestock" className="al-back-btn">
            <FiArrowLeft size={14} /> Back to Listings
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const related = LISTINGS.filter((l) => l.id !== item.id && l.category === item.category).slice(0, RELATED_LIMIT);
  const badgeStyle = getCategoryBadgeStyle(item.category);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .ald-wrap {
          min-height: 100vh; background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── BREADCRUMB ── */
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

        /* ── MAIN BODY ── */
        .ald-body {
          max-width: 1200px; margin: 0 auto;
          padding: 24px 20px 60px;
        }

        /* ── BACK LINK ── */
        .ald-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 18px;
          transition: color 0.15s;
        }
        .ald-back:hover { color: #15803d; }

        /* ── GRID ── */
        .ald-grid {
          display: grid; grid-template-columns: 1fr 400px; gap: 24px;
          align-items: start;
        }

        /* ── LEFT: IMAGE + THUMBNAILS ── */
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

        /* ── RIGHT: DETAILS PANEL ── */
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

        /* Details grid */
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

        /* Badges row */
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

        /* Availability */
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

        /* Action Buttons */
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

        /* Seller Panel */
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

        /* Safety tips panel */
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

        /* ── RELATED ── */
        .ald-related { margin-top: 32px; }
        .ald-related-title {
          font-size: 17px; font-weight: 800; color: #111; margin-bottom: 14px;
        }
        .ald-related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        }
        .ald-rel-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          border: 1px solid #e5e7eb; text-decoration: none; color: inherit;
          display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ald-rel-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .ald-rel-img-wrap { aspect-ratio: 16/11; overflow: hidden; background: #e5e7eb; }
        .ald-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .ald-rel-card:hover .ald-rel-img { transform: scale(1.05); }
        .ald-rel-body { padding: 10px 12px; }
        .ald-rel-title { font-size: 13.5px; font-weight: 700; color: #111; margin: 0 0 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ald-rel-price { font-size: 13px; font-weight: 800; color: #15803d; }
        .ald-rel-loc { font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 3px; margin-top: 3px; }

        /* Responsive */
        @media (max-width: 900px) {
          .ald-grid { grid-template-columns: 1fr; }
          .ald-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .ald-body { padding: 16px 14px 40px; }
          .ald-related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ald-wrap">

        {/* ── BREADCRUMB ── */}
        <div className="ald-breadcrumb-bar">
          <div className="ald-breadcrumb-inner">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/category/agriculture-and-livestock">Agriculture &amp; Livestock</Link>
            <span>/</span>
            <span className="active">{item.title}</span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="ald-body">
          <Link href="/category/agriculture-and-livestock" className="ald-back">
            <FiArrowLeft size={14} /> Back to all listings
          </Link>

          <div className="ald-grid">

            {/* ── LEFT: IMAGE ── */}
            <div>
              <div className="ald-img-section">
                <div className="ald-main-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="ald-main-img" />

                  {/* Category badge */}
                  <span className="ald-img-cat-badge" style={badgeStyle}>
                    #{item.category}
                  </span>

                  {/* Favourite */}
                  <button className="ald-img-fav-btn" onClick={() => setIsFav(!isFav)}>
                    {isFav
                      ? <FaHeart size={16} color="#ef4444" />
                      : <FaHeart size={16} color="#d1d5db" />}
                  </button>

                  {/* Posted time */}
                  {item.postedDaysAgo !== undefined && (
                    <span className="ald-posted-tag">
                      {item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo}d ago`}
                    </span>
                  )}

                  {/* Organic ribbon */}
                  {item.isOrganic && (
                    <span className="ald-organic-tag">🌿 Organic</span>
                  )}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="ald-tips" style={{ marginTop: 16 }}>
                <p className="ald-tips-title">⚠️ Safety Tips</p>
                <div className="ald-tip-item">✓ Meet in a safe, public location</div>
                <div className="ald-tip-item">✓ Verify livestock health certificates before buying</div>
                <div className="ald-tip-item">✓ Never pay full amount before receiving the item</div>
                <div className="ald-tip-item">✓ Report suspicious listings to our support team</div>
              </div>
            </div>

            {/* ── RIGHT: DETAILS ── */}
            <div className="ald-right">

              {/* Main Info Panel */}
              <div className="ald-panel">
                <h1 className="ald-title">{item.title}</h1>
                <p className="ald-price">{item.price}</p>
                <div className="ald-price-divider" />

                <div className="ald-location">
                  <FiMapPin size={14} />
                  {item.location}, {item.district}
                </div>

                {item.description && (
                  <p className="ald-desc">{item.description}</p>
                )}

                {/* Details Grid */}
                <div className="ald-details-grid">
                  {item.breed && (
                    <div className="ald-detail-item">
                      <p className="ald-detail-label">Breed</p>
                      <p className="ald-detail-val">{item.breed}</p>
                    </div>
                  )}
                  {item.age && (
                    <div className="ald-detail-item">
                      <p className="ald-detail-label">Age</p>
                      <p className="ald-detail-val">{item.age}</p>
                    </div>
                  )}
                  {item.seasonal && (
                    <div className="ald-detail-item">
                      <p className="ald-detail-label">Season</p>
                      <p className="ald-detail-val">{item.seasonal}</p>
                    </div>
                  )}
                  {item.district && (
                    <div className="ald-detail-item">
                      <p className="ald-detail-label">District</p>
                      <p className="ald-detail-val">{item.district}</p>
                    </div>
                  )}
                  {item.postedDaysAgo !== undefined && (
                    <div className="ald-detail-item">
                      <p className="ald-detail-label">Posted</p>
                      <p className="ald-detail-val">{item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo} day${item.postedDaysAgo > 1 ? "s" : ""} ago`}</p>
                    </div>
                  )}
                  <div className="ald-detail-item">
                    <p className="ald-detail-label">Category</p>
                    <p className="ald-detail-val">{item.category}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="ald-badges-row">
                  {item.isOrganic && (
                    <span className="ald-badge-organic">
                      <FaLeaf size={11} /> Organic Certified
                    </span>
                  )}
                  {item.healthStatus && (
                    <span className="ald-badge-vax">
                      <FaShieldAlt size={11} /> {item.healthStatus}
                    </span>
                  )}
                </div>

                {/* Availability */}
                {item.availability && (
                  <div className="ald-avail">
                    <span className="ald-avail-dot" />
                    {item.availability}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="ald-actions">
                  <Link
                    href={`tel:${item.sellerPhone}`}
                    className="ald-btn-chat"
                  >
                    <FiMessageSquare size={16} />
                    Chat Seller
                  </Link>
                  <button
                    className="ald-btn-phone"
                    onClick={() => window.open(`tel:${item.sellerPhone}`, "_self")}
                  >
                    <FiPhone size={16} />
                  </button>
                  <button
                    className="ald-btn-share"
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

              {/* Seller Panel */}
              <div className="ald-seller-panel">
                <p className="ald-seller-title">Seller Information</p>
                <div className="ald-seller-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="ald-seller-avatar">
                      {(item.sellerName ?? "S")[0]}
                    </div>
                    <div>
                      <p className="ald-seller-name">{item.sellerName ?? "Unknown Seller"}</p>
                      <p className="ald-seller-phone">{item.sellerPhone}</p>
                    </div>
                  </div>
                  <button
                    className="ald-seller-chat-btn"
                    onClick={() => window.open(`tel:${item.sellerPhone}`, "_self")}
                  >
                    <FiPhone size={13} /> Call Now
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── RELATED LISTINGS ── */}
          {related.length > 0 && (
            <div className="ald-related">
              <p className="ald-related-title">Similar {item.category} Listings</p>
              <div className="ald-related-grid">
                {related.map((r) => (
                  <Link key={r.id} href={`/category/agriculture-and-livestock/${r.id}`} className="ald-rel-card">
                    <div className="ald-rel-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt={r.title} className="ald-rel-img" />
                    </div>
                    <div className="ald-rel-body">
                      <p className="ald-rel-title">{r.title}</p>
                      <p className="ald-rel-price">{r.price}</p>
                      <p className="ald-rel-loc"><FiMapPin size={10} />{r.location}</p>
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