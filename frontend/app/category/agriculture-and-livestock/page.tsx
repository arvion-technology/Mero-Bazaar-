"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiMapPin,
  FiChevronDown,
  FiMessageSquare,
  FiHeart,
  FiCheckCircle,
  FiSliders,
  FiPhone,
  FiShare2,
} from "react-icons/fi";
import {
  FaHeart,
  FaLeaf,
  FaSeedling,
  FaTractor,
  FaWrench,
  FaCarrot,
  FaAppleAlt,
} from "react-icons/fa";
import { FaCow } from "react-icons/fa6";

const CATEGORY_ICONS = [
  { name: "Produce",   icon: FaCarrot,   count: 1245, color: "#f97316", bg: "#fff7ed" },
  { name: "Livestock", icon: FaCow,       count: 567,  color: "#b45309", bg: "#fffbeb" },
  { name: "Tools",     icon: FaWrench,    count: 245,  color: "#475569", bg: "#f8fafc" },
  { name: "Service",   icon: FaTractor,   count: 345,  color: "#15803d", bg: "#f0fdf4" },
];

/* ─────────── TYPES ─────────── */
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

/* ─────────── DATA ─────────── */
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
    description: "Fresh organic tomatoes grown without pesticides.",
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
    description: "Healthy vaccinated cow, good milk production.",
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
    description: "Fresh organic cauliflower from local farms.",
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
    description: "Pure breed Jersey cow, high milk yield.",
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
    description: "Farm fresh organic potatoes.",
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
    description: "Healthy Jersey cow for sale.",
    sellerName: "Krishna Adhikari",
    sellerPhone: "9845678901",
    postedDaysAgo: 2,
  },
];

const LISTING_TYPES = ["Produce", "Livestock", "Tools", "Service"];
const SEASONS = ["Spring", "Summer", "Autumn", "Early Fall"];
const DISTRICTS = ["Chitwan", "Rupandehi", "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];
const HEALTH_STATUS = ["Vaccinated", "Not Vaccinated"];

/* ─────────── COMPONENT ─────────── */
export default function AgriculturePage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [selectedHealth, setSelectedHealth] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [showMore, setShowMore] = useState(false);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const toggleType = (t: string) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const toggleSeason = (s: string) =>
    setSelectedSeasons((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleHealth = (h: string) =>
    setSelectedHealth((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );

  const reset = () => {
    setSelectedTypes([]);
    setSelectedSeasons([]);
    setSelectedDistrict("");
    setOrganicOnly(false);
    setSelectedHealth([]);
    setPriceRange(500000);
    setSearch("");
  };

  const displayed = LISTINGS.filter((l) => {
    const s = search.toLowerCase();
    if (s && !l.title.toLowerCase().includes(s) && !l.location.toLowerCase().includes(s)) return false;
    if (selectedTypes.length && !selectedTypes.includes(l.category)) return false;
    if (selectedSeasons.length && l.seasonal && !selectedSeasons.includes(l.seasonal)) return false;
    if (selectedDistrict && l.district !== selectedDistrict) return false;
    if (organicOnly && !l.isOrganic) return false;
    if (selectedHealth.length && l.healthStatus && !selectedHealth.includes(l.healthStatus)) return false;
    const priceNum = parseInt(l.price.replace(/[^0-9]/g, ""));
    if (priceNum > priceRange) return false;
    return true;
  });

  const sortedDisplayed = [...displayed].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, ""));
      case "price-high":
        return parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, ""));
      default:
        return 0;
    }
  });

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "Livestock": return { background: "#ec4899", color: "#fff" };
      case "Produce":   return { background: "#10b981", color: "#fff" };
      case "Tools":     return { background: "#3b82f6", color: "#fff" };
      default:          return { background: "#8b5cf6", color: "#fff" };
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .al-wrap {
          min-height: 100vh;
          background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── HERO ── */
        .al-hero {
          position: relative;
          height: 220px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .al-hero-bg {
          position: absolute; inset: 0;
          background: url('/hero-cows.jpg') center center / cover no-repeat;
          filter: brightness(0.45);
        }
        .al-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(120,60,10,0.7) 0%, rgba(40,80,20,0.5) 100%);
        }
        .al-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .al-hero-inner h1 {
          font-size: 26px; font-weight: 800; color: #fff;
          margin: 0 0 4px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .al-hero-inner h2 {
          font-size: 18px; font-weight: 700; color: #fcd34d;
          margin: 0 0 6px;
        }
        .al-hero-inner p {
          color: rgba(255,255,255,0.65); font-size: 13px; margin: 0 0 16px;
        }
        .al-search-wrap { position: relative; max-width: 480px; }
        .al-search-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #aaa;
        }
        .al-search {
          width: 100%; padding: 11px 14px 11px 38px;
          background: #fff; border: none; border-radius: 8px;
          font-size: 13.5px; color: #333; outline: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          font-family: inherit;
        }

        /* ── BODY LAYOUT ── */
        .al-body {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 20px 60px; display: flex; gap: 18px;
        }

        /* ── SIDEBAR ── */
        .al-sidebar {
          width: 200px; flex-shrink: 0;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          align-self: flex-start;
          position: sticky; top: 16px;
        }
        .al-sb-head {
          padding: 14px 16px 10px;
          font-size: 15px; font-weight: 800; color: #1a1a1a;
          border-bottom: 1px solid #f0f0f0;
        }
        .al-sb-section {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .al-sb-section:last-of-type { border-bottom: none; }
        .al-sb-title {
          font-size: 12px; font-weight: 700; color: #374151;
          margin-bottom: 8px;
        }
        .al-check-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 6px; cursor: pointer;
        }
        .al-check-row:last-child { margin-bottom: 0; }
        .al-checkbox {
          width: 15px; height: 15px; border-radius: 3px;
          border: 1.5px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff; transition: all 0.15s;
          cursor: pointer;
        }
        .al-checkbox.checked {
          background: #4ade80; border-color: #4ade80;
        }
        .al-check-label {
          font-size: 12.5px; color: #374151; font-weight: 500;
        }
        .al-check-label.checked { color: #111; font-weight: 700; }

        .al-range {
          width: 100%; accent-color: #4ade80;
          height: 4px; cursor: pointer; margin-bottom: 6px;
        }
        .al-range-vals {
          display: flex; justify-content: space-between;
          font-size: 10.5px; color: #6b7280; font-weight: 500;
        }
        .al-range-vals span.hi { color: #15803d; font-weight: 700; }

        .al-district-select {
          width: 100%; padding: 7px 10px; border-radius: 7px;
          border: 1px solid #e0e4f0; font-size: 12px; color: #444;
          background: #f9fafb; outline: none; font-family: inherit;
          cursor: pointer;
        }
        .al-district-select:focus { border-color: #4ade80; }

        .al-more-btn {
          display: block; width: 100%;
          padding: 10px 16px; text-align: center;
          font-size: 13px; font-weight: 700; color: #374151;
          background: none; border: none; cursor: pointer;
          border-top: 1px solid #f0f0f0; font-family: inherit;
          transition: background 0.15s;
        }
        .al-more-btn:hover { background: #f9fafb; }

        /* ── MAIN ── */
        .al-main { flex: 1; min-width: 0; }
        .al-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px; flex-wrap: wrap; gap: 8px;
        }
        .al-count { font-size: 13px; color: #6b7280; font-weight: 500; }
        .al-count strong { color: #111; font-weight: 800; }
        .al-sort {
          padding: 7px 28px 7px 12px; border: 1px solid #e0e4f0;
          border-radius: 8px; font-size: 12.5px; font-weight: 600;
          color: #333; background: #fff; outline: none;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          appearance: none;
        }

        /* ── CARD GRID ── */
        .al-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        /* ── CARD ── */
        .al-card {
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none; color: inherit;
          cursor: pointer;
        }
        .al-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }

        .al-card-img-wrap {
          position: relative; width: 100%; aspect-ratio: 4/3;
          overflow: hidden; background: #e5e7eb;
        }
        .al-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s;
        }
        .al-card:hover .al-card-img { transform: scale(1.06); }

        .al-card-cat-badge {
          position: absolute; top: 8px; right: 8px;
          font-size: 9px; font-weight: 800; padding: 3px 8px;
          border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .al-card-fav {
          position: absolute; top: 8px; left: 8px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0; z-index: 2;
        }
        .al-card-fav:hover { transform: scale(1.15); }

        .al-card-body { padding: 12px; display: flex; flex-direction: column; gap: 5px; flex: 1; }

        .al-card-title { font-size: 15px; font-weight: 800; color: #111; margin: 0; }

        .al-card-breed-row {
          font-size: 11.5px; color: #555;
          display: flex; gap: 10px;
        }
        .al-card-breed-row strong { color: #222; font-weight: 700; }

        .al-card-price { font-size: 13px; font-weight: 700; color: #111; }

        .al-card-location {
          display: flex; align-items: center; gap: 4px;
          font-size: 11.5px; color: #6b7280;
        }

        .al-organic-badge {
          display: flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 700; color: #15803d;
        }

        .al-avail-bar {
          display: flex; align-items: center; gap: 6px;
          background: #fde68a; border-radius: 4px;
          padding: 5px 10px; font-size: 11.5px; font-weight: 700; color: #92400e;
        }
        .al-avail-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #f59e0b; flex-shrink: 0;
          animation: alpulse 1.4s infinite;
        }
        @keyframes alpulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .al-vaccinated-row {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-weight: 700; color: #374151;
        }
        .al-vax-dot {
          width: 9px; height: 9px; border-radius: 50%; background: #f97316; flex-shrink: 0;
        }

        .al-chat-btn {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; padding: 9px;
          background: #4ade80; color: #166534;
          font-size: 12.5px; font-weight: 800; border: none;
          border-radius: 7px; cursor: pointer; font-family: inherit;
          text-decoration: none; margin-top: auto;
          transition: background 0.15s;
        }
        .al-chat-btn:hover { background: #22c55e; }

        /* ── LOAD MORE ── */
        .al-load-more {
          text-align: center; margin-top: 24px;
        }
        .al-load-more-btn {
          font-size: 13px; font-weight: 600; color: #6b7280;
          background: none; border: none; cursor: pointer;
          padding: 8px 20px; border-radius: 6px;
          font-family: inherit; transition: background 0.15s, color 0.15s;
        }
        .al-load-more-btn:hover { background: #f3f4f6; color: #374151; }

        /* ── EMPTY ── */
        .al-empty {
          text-align: center; padding: 60px 24px;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
        }
        .al-empty-btn {
          margin-top: 12px; padding: 9px 22px;
          background: #4ade80; color: #166534; font-weight: 700;
          font-size: 13px; border: none; border-radius: 7px;
          cursor: pointer; font-family: inherit;
        }

        /* ── HERO TAG ── */
        .al-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.28);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .al-hero-title span { color: #bbf7d0; }
        .al-hero-watermark {
          position: absolute; bottom: -18px; right: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.04); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        /* ── CATEGORY STRIP ── */
        .al-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0;
        }
        .al-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
        }
        .al-cats-label {
          font-size: 13px; font-weight: 700; color: #888;
          margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px;
        }
        .al-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .al-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          min-width: 140px; font-family: inherit; text-align: left;
        }
        .al-cat-card:hover {
          border-color: #15803d; background: #f0fdf4;
          transform: translateY(-2px); box-shadow: 0 4px 16px rgba(21,128,61,0.12);
        }
        .al-cat-card.active {
          border-color: #15803d; background: #dcfce7;
          box-shadow: 0 4px 16px rgba(21,128,61,0.2);
        }
        .al-cat-icon { font-size: 22px; display: flex; align-items: center; }
        .al-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .al-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .al-sidebar { display: none; }
          .al-grid { grid-template-columns: repeat(2, 1fr); }
          .al-cats-row { gap: 8px; }
          .al-cat-card { min-width: 120px; padding: 8px 12px; }
        }
        @media (max-width: 540px) {
          .al-grid { grid-template-columns: 1fr; }
          .al-body { padding: 14px 14px 40px; }
          .al-cats-row { gap: 6px; }
          .al-cat-card { min-width: 0; flex: 1; }
        }
      `}</style>

      <div className="al-wrap">

        {/* ── HERO ── */}
        <section className="al-hero">
          <div className="al-hero-bg" />
          <div className="al-hero-overlay" />
          <div className="al-hero-watermark">Agri</div>
          <div className="al-hero-inner">
            <div className="al-hero-tag">
              <FaSeedling size={12} />
              Nepal&apos;s #1 Agri Marketplace
            </div>
            <h1>Find The Best</h1>
            <h2>Agriculture &amp; Livestock services</h2>
            <p>Trusted Agriculture &amp; livestock near you</p>
            <div className="al-search-wrap">
              <FiSearch className="al-search-icon" size={15} />
              <input
                className="al-search"
                placeholder="Search sales, buy........"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY ICON STRIP ── */}
        <section className="al-cats-strip">
          <div className="al-cats-inner">
            <p className="al-cats-label">Browse Categories</p>
            <div className="al-cats-row">
              {CATEGORY_ICONS.map((cat) => (
                <button
                  key={cat.name}
                  className={`al-cat-card${selectedTypes.includes(cat.name) ? " active" : ""}`}
                  onClick={() => toggleType(cat.name)}
                >
                  <span className="al-cat-icon" style={{ color: cat.color }}>
                    <cat.icon size={22} />
                  </span>
                  <span>
                    <span className="al-cat-name">{cat.name}</span>
                    <span className="al-cat-count">{cat.count.toLocaleString()} listings</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="al-body">

          {/* ── SIDEBAR ── */}
          <aside className="al-sidebar">
            <div className="al-sb-head">Filter</div>

            {/* Listing Type */}
            <div className="al-sb-section">
              <p className="al-sb-title">Listing Type</p>
              {LISTING_TYPES.map((t) => (
                <div key={t} className="al-check-row" onClick={() => toggleType(t)}>
                  <div className={`al-checkbox${selectedTypes.includes(t) ? " checked" : ""}`}>
                    {selectedTypes.includes(t) && <FiCheckCircle size={10} color="#fff" />}
                  </div>
                  <span className={`al-check-label${selectedTypes.includes(t) ? " checked" : ""}`}>{t}</span>
                </div>
              ))}
            </div>

            {/* Seasonal Product */}
            <div className="al-sb-section">
              <p className="al-sb-title">Seasonal Product</p>
              {SEASONS.map((s) => (
                <div key={s} className="al-check-row" onClick={() => toggleSeason(s)}>
                  <div className={`al-checkbox${selectedSeasons.includes(s) ? " checked" : ""}`}>
                    {selectedSeasons.includes(s) && <FiCheckCircle size={10} color="#fff" />}
                  </div>
                  <span className={`al-check-label${selectedSeasons.includes(s) ? " checked" : ""}`}>{s}</span>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="al-sb-section">
              <p className="al-sb-title">Price Range</p>
              <input
                type="range"
                min={0}
                max={500000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="al-range"
              />
              <div className="al-range-vals">
                <span>0</span>
                <span className="hi">{priceRange.toLocaleString()}</span>
              </div>
            </div>

            {/* Certificated */}
            <div className="al-sb-section">
              <p className="al-sb-title">Certificated</p>
              <div className="al-check-row" onClick={() => setOrganicOnly(!organicOnly)}>
                <div className={`al-checkbox${organicOnly ? " checked" : ""}`}>
                  {organicOnly && <FiCheckCircle size={10} color="#fff" />}
                </div>
                <span className={`al-check-label${organicOnly ? " checked" : ""}`}>
                  Organic Certified
                </span>
              </div>
            </div>

            {/* District */}
            <div className="al-sb-section">
              <p className="al-sb-title">District</p>
              <select
                className="al-district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">Select District</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Livestock health Status */}
            <div className="al-sb-section">
              <p className="al-sb-title">Livestock health Status</p>
              {HEALTH_STATUS.map((h) => (
                <div key={h} className="al-check-row" onClick={() => toggleHealth(h)}>
                  <div className={`al-checkbox${selectedHealth.includes(h) ? " checked" : ""}`}>
                    {selectedHealth.includes(h) && <FiCheckCircle size={10} color="#fff" />}
                  </div>
                  <span className={`al-check-label${selectedHealth.includes(h) ? " checked" : ""}`}>{h}</span>
                </div>
              ))}
            </div>

            <button className="al-more-btn" onClick={() => setShowMore(!showMore)}>
              {showMore ? "Less" : "More"}
            </button>
          </aside>

          {/* ── MAIN ── */}
          <div className="al-main">
            {/* Results bar */}
            <div className="al-results-bar">
              <span className="al-count">
                <strong>{sortedDisplayed.length}</strong> results found
              </span>
              <div style={{ position: "relative" }}>
                <select
                  className="al-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <FiChevronDown
                  size={12}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#666" }}
                />
              </div>
            </div>

            {/* Cards */}
            {sortedDisplayed.length === 0 ? (
              <div className="al-empty">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", margin: "0 0 4px" }}>No listings found</p>
                <span style={{ fontSize: 13, color: "#888" }}>Try adjusting your filters</span>
                <br />
                <button className="al-empty-btn" onClick={reset}>Reset Filters</button>
              </div>
            ) : (
              <div className="al-grid">
                {sortedDisplayed.map((item) => {
                  const isFav = !!favorites[item.id];
                  const badgeStyle = getCategoryBadgeStyle(item.category);

                  return (
                    <div key={item.id} className="al-card">
                      {/* Image */}
                      <Link
                        href={`/category/agriculture-and-livestock/${item.id}`}
                        className="al-card-img-wrap"
                        style={{ display: "block", textDecoration: "none" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.title} className="al-card-img" />
                        <span className="al-card-cat-badge" style={badgeStyle}>
                          #{item.category}
                        </span>
                        <button className="al-card-fav" onClick={(e) => toggleFav(item.id, e)}>
                          {isFav
                            ? <FaHeart size={12} color="#ef4444" />
                            : <FiHeart size={12} color="#9ca3af" />}
                        </button>
                      </Link>

                      {/* Body */}
                      <div className="al-card-body">
                        <p className="al-card-title">{item.title}</p>

                        {/* Breed & Age (Livestock) */}
                        {item.breed && (
                          <div className="al-card-breed-row">
                            <span>Breed: <strong>{item.breed}</strong></span>
                            {item.age && <span>Age: <strong>{item.age}</strong></span>}
                          </div>
                        )}

                        {/* Price */}
                        <p className="al-card-price">{item.price}</p>

                        {/* Organic Certified */}
                        {item.isOrganic && (
                          <div className="al-organic-badge">
                            <FaLeaf size={11} />
                            Organic Certified
                          </div>
                        )}

                        {/* Location */}
                        <div className="al-card-location">
                          <FiMapPin size={11} />
                          {item.location}
                        </div>

                        {/* Availability */}
                        {item.availability && (
                          <div className="al-avail-bar">
                            <span className="al-avail-dot" />
                            {item.availability}
                          </div>
                        )}

                        {/* Vaccinated */}
                        {item.healthStatus && (
                          <div className="al-vaccinated-row">
                            <span className="al-vax-dot" />
                            {item.healthStatus}
                          </div>
                        )}

                        {/* Chat Seller */}
                        <Link
                          href={`/category/agriculture-and-livestock/${item.id}`}
                          className="al-chat-btn"
                        >
                          <FiMessageSquare size={13} />
                          Chat Seller
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {sortedDisplayed.length > 0 && (
              <div className="al-load-more">
                <button className="al-load-more-btn">Views More</button>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}