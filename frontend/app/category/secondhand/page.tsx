"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { SecondHandListing, SecondHandCategory, SecondHandCondition } from "@/app/types/secondhand";
import {
  FiSearch,
  FiMapPin,
  FiChevronDown,
  FiMessageSquare,
  FiHeart,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  FaHeart,
  FaTshirt,
  FaBook,
  FaFutbol,
  FaBaby,
  FaCouch,
  FaBlender,
  FaTag,
} from "react-icons/fa";

const CATEGORY_ICONS: {
  name: string;
  value: SecondHandCategory;
  icon: typeof FaTshirt;
  color: string;
  bg: string;
}[] = [
  { name: "Clothing", value: "CLOTHING", icon: FaTshirt, color: "#e11d48", bg: "#fff1f2" },
  { name: "Furniture", value: "FURNITURE", icon: FaCouch, color: "#b45309", bg: "#fffbeb" },
  { name: "Books", value: "BOOKS", icon: FaBook, color: "#1d4ed8", bg: "#eff6ff" },
  { name: "Appliances", value: "APPLIANCES", icon: FaBlender, color: "#0f766e", bg: "#f0fdfa" },
  { name: "Sports", value: "SPORTS", icon: FaFutbol, color: "#15803d", bg: "#f0fdf4" },
  { name: "Baby", value: "BABY", icon: FaBaby, color: "#7c3aed", bg: "#faf5ff" },
];

type Condition = "Like New" | "Good" | "Fair" | "For parts";
const CONDITIONS: Condition[] = ["Like New", "Good", "Fair", "For parts"];

const CONDITION_TO_DB: Record<Condition, SecondHandCondition> = {
  "Like New": "LIKE_NEW",
  "Good": "GOOD",
  "Fair": "FAIR",
  "For parts": "FOR_PARTS",
};
const CONDITION_FROM_DB: Record<SecondHandCondition, Condition> = {
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  FOR_PARTS: "For parts",
};

const CONDITION_BADGE: Record<Condition, { bg: string; color: string; dot: string }> = {
  "Like New": { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  "Good": { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  "Fair": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  "For parts": { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Butwal"];
const PLACEHOLDER_IMG = "/placeholder-item.jpg";
const IMG_BASE = process.env.NEXT_PUBLIC_API_URL;   

function daysAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export default function SecondhandPage() {
  const [listings, setListings] = useState<SecondHandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCategory, setActiveCategory] = useState<SecondHandCategory | "">("");
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});

  const loadListings = () => {
    setLoading(true);
    setLoadError(false);
    api
      .getSecondhandListings()
      .then(setListings)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadListings();
  }, []);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const toggleCondition = (c: Condition) =>
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const nextImage = (id: string, total: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndices((p) => ({ ...p, [id]: ((p[id] || 0) + 1) % total }));
  };

  const prevImage = (id: string, total: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndices((p) => ({ ...p, [id]: ((p[id] || 0) - 1 + total) % total }));
  };

  const reset = () => {
    setSelectedConditions([]);
    setSelectedCity("");
    setPriceRange(10000);
    setActiveCategory("");
    setSearch("");
  };

  const displayed = listings.filter((l) => {
    const s = search.toLowerCase();
    if (
      s &&
      !l.title.toLowerCase().includes(s) &&
      !l.secondhand.city.toLowerCase().includes(s)
    )
      return false;
    if (activeCategory && l.secondhand.category !== activeCategory) return false;
    if (
      selectedConditions.length &&
      !selectedConditions.map((c) => CONDITION_TO_DB[c]).includes(l.secondhand.condition)
    )
      return false;
    if (selectedCity && l.secondhand.city !== selectedCity) return false;
    const priceNum = l.secondhand.price ?? l.price ?? 0;
    if (priceNum > priceRange) return false;
    return true;
  });

  const sortedDisplayed = [...displayed].sort((a, b) => {
    if (sort === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === "price-low") return (a.secondhand.price ?? 0) - (b.secondhand.price ?? 0);
    if (sort === "price-high") return (b.secondhand.price ?? 0) - (a.secondhand.price ?? 0);
    return 0;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .sh-wrap {
          min-height: 100vh;
          background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── HERO ── */
        .sh-hero {
          position: relative;
          height: 220px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .sh-hero-bg {
          position: absolute; inset: 0;
          background: url('/hero-thrift.jpg') center center / cover no-repeat;
          filter: brightness(0.45);
        }
        .sh-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(159,18,57,0.75) 0%, rgba(120,10,40,0.5) 100%);
        }
        .sh-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .sh-hero-inner h1 {
          font-size: 26px; font-weight: 800; color: #fff;
          margin: 0 0 4px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .sh-hero-inner h2 {
          font-size: 18px; font-weight: 700; color: #fda4af;
          margin: 0 0 6px;
        }
        .sh-hero-inner p {
          color: rgba(255,255,255,0.65); font-size: 13px; margin: 0 0 16px;
        }
        .sh-search-wrap { position: relative; max-width: 480px; }
        .sh-search-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #aaa;
        }
        .sh-search {
          width: 100%; padding: 11px 14px 11px 38px;
          background: #fff; border: none; border-radius: 8px;
          font-size: 13.5px; color: #333; outline: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          font-family: inherit;
        }

        /* ── HERO TAG ── */
        .sh-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.28);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .sh-hero-watermark {
          position: absolute; bottom: -18px; right: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.04); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        /* ── CATEGORY STRIP ── */
        .sh-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0;
        }
        .sh-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
        }
        .sh-cats-label {
          font-size: 13px; font-weight: 700; color: #888;
          margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px;
        }
        .sh-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .sh-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          min-width: 140px; font-family: inherit; text-align: left;
        }
        .sh-cat-card:hover {
          border-color: #e11d48; background: #fff1f2;
          transform: translateY(-2px); box-shadow: 0 4px 16px rgba(225,29,72,0.12);
        }
        .sh-cat-card.active {
          border-color: #e11d48; background: #ffe4e6;
          box-shadow: 0 4px 16px rgba(225,29,72,0.2);
        }
        .sh-cat-icon { font-size: 22px; display: flex; align-items: center; }
        .sh-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .sh-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY LAYOUT ── */
        .sh-body {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 20px 60px; display: flex; gap: 18px;
        }

        /* ── SIDEBAR ── */
        .sh-sidebar {
          width: 200px; flex-shrink: 0;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          align-self: flex-start;
          position: sticky; top: 16px;
        }
        .sh-sb-head {
          padding: 14px 16px 10px;
          font-size: 15px; font-weight: 800; color: #1a1a1a;
          border-bottom: 1px solid #f0f0f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sh-sb-reset {
          font-size: 12px; font-weight: 600; color: #e11d48;
          background: none; border: none; cursor: pointer;
          font-family: inherit; padding: 2px 6px; border-radius: 4px;
          transition: background 0.15s;
        }
        .sh-sb-reset:hover { background: #fff1f2; }
        .sh-sb-section {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .sh-sb-section:last-of-type { border-bottom: none; }
        .sh-sb-title {
          font-size: 12px; font-weight: 700; color: #374151;
          margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.4px;
        }
        .sh-check-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 6px; cursor: pointer;
        }
        .sh-check-row:last-child { margin-bottom: 0; }
        .sh-checkbox {
          width: 15px; height: 15px; border-radius: 3px;
          border: 1.5px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff; transition: all 0.15s;
          cursor: pointer;
        }
        .sh-checkbox.checked {
          background: #e11d48; border-color: #e11d48;
        }
        .sh-radio {
          width: 15px; height: 15px; border-radius: 50%;
          border: 1.5px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff; transition: all 0.15s;
          cursor: pointer;
        }
        .sh-check-label {
          font-size: 12.5px; color: #374151; font-weight: 500;
        }
        .sh-check-label.checked { color: #111; font-weight: 700; }

        .sh-range {
          width: 100%; accent-color: #e11d48;
          height: 4px; cursor: pointer; margin-bottom: 6px;
        }
        .sh-range-vals {
          display: flex; justify-content: space-between;
          font-size: 10.5px; color: #6b7280; font-weight: 500;
        }
        .sh-range-vals span.hi { color: #be123c; font-weight: 700; }

        .sh-city-select {
          width: 100%; padding: 7px 10px; border-radius: 7px;
          border: 1px solid #e0e4f0; font-size: 12px; color: #444;
          background: #f9fafb; outline: none; font-family: inherit;
          cursor: pointer;
        }
        .sh-city-select:focus { border-color: #e11d48; }

        .sh-apply-btn {
          display: block; width: calc(100% - 32px);
          margin: 12px 16px; padding: 10px 16px;
          background: #e11d48; color: #fff;
          font-size: 13px; font-weight: 700; border: none;
          border-radius: 8px; cursor: pointer; font-family: inherit;
          transition: background 0.15s;
        }
        .sh-apply-btn:hover { background: #be123c; }

        /* ── MAIN ── */
        .sh-main { flex: 1; min-width: 0; }
        .sh-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px; flex-wrap: wrap; gap: 8px;
        }
        .sh-count { font-size: 13px; color: #6b7280; font-weight: 500; }
        .sh-count strong { color: #111; font-weight: 800; }
        .sh-sort {
          padding: 7px 28px 7px 12px; border: 1px solid #e0e4f0;
          border-radius: 8px; font-size: 12.5px; font-weight: 600;
          color: #333; background: #fff; outline: none;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          appearance: none;
        }

        /* ── CARD GRID ── */
        .sh-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        /* ── CARD ── */
        .sh-card {
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none; color: inherit;
        }
        .sh-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }

        .sh-card-img-wrap {
          position: relative; width: 100%; aspect-ratio: 4/3;
          overflow: hidden; background: #e5e7eb;
        }
        .sh-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s;
        }
        .sh-card:hover .sh-card-img { transform: scale(1.06); }

        .sh-card-condition {
          position: absolute; top: 8px; left: 8px;
          font-size: 10px; font-weight: 700; padding: 3px 8px;
          border-radius: 4px; display: flex; align-items: center; gap: 4px;
        }
        .sh-cond-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }
        .sh-card-fav {
          position: absolute; top: 8px; right: 8px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0; z-index: 2;
        }
        .sh-card-fav:hover { transform: scale(1.15); }

        .sh-carousel-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(0,0,0,0.35); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; transition: background 0.15s; padding: 0;
        }
        .sh-carousel-btn:hover { background: rgba(0,0,0,0.55); }
        .sh-carousel-btn.prev { left: 8px; }
        .sh-carousel-btn.next { right: 8px; }
        .sh-dots {
          position: absolute; bottom: 8px; right: 8px;
          display: flex; gap: 4px;
        }
        .sh-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.5); transition: background 0.15s;
        }
        .sh-dot.active { background: #fff; }

        .sh-card-body { padding: 12px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .sh-card-title { font-size: 14px; font-weight: 800; color: #111; margin: 0; line-clamp: 2; }
        .sh-card-price { font-size: 14px; font-weight: 700; color: #111; }
        .sh-card-location {
          display: flex; align-items: center; gap: 4px;
          font-size: 11.5px; color: #6b7280;
        }
        .sh-card-tags {
          display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px;
        }
        .sh-tag {
          font-size: 10px; font-weight: 600; padding: 2px 7px;
          border-radius: 4px; background: #f3e8ff; color: #7c3aed;
        }
        .sh-tag.offer { background: #fce7f3; color: #be185d; }

        .sh-chat-btn {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; padding: 9px;
          background: #4ade80; color: #166534;
          font-size: 12.5px; font-weight: 800; border: none;
          border-radius: 7px; cursor: pointer; font-family: inherit;
          text-decoration: none; margin-top: auto;
          transition: background 0.15s;
        }
        .sh-chat-btn:hover { background: #22c55e; }

        /* ── LOAD MORE ── */
        .sh-load-more { text-align: center; margin-top: 24px; }
        .sh-load-more-btn {
          font-size: 13px; font-weight: 600; color: #6b7280;
          background: none; border: none; cursor: pointer;
          padding: 8px 20px; border-radius: 6px;
          font-family: inherit; transition: background 0.15s, color 0.15s;
        }
        .sh-load-more-btn:hover { background: #f3f4f6; color: #374151; }

        /* ── EMPTY ── */
        .sh-empty {
          text-align: center; padding: 60px 24px;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
        }
        .sh-empty-btn {
          margin-top: 12px; padding: 9px 22px;
          background: #e11d48; color: #fff; font-weight: 700;
          font-size: 13px; border: none; border-radius: 7px;
          cursor: pointer; font-family: inherit;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .sh-sidebar { display: none; }
          .sh-grid { grid-template-columns: repeat(2, 1fr); }
          .sh-cats-row { gap: 8px; }
          .sh-cat-card { min-width: 120px; padding: 8px 12px; }
        }
        @media (max-width: 540px) {
          .sh-grid { grid-template-columns: 1fr; }
          .sh-body { padding: 14px 14px 40px; }
          .sh-cats-row { gap: 6px; }
          .sh-cat-card { min-width: 0; flex: 1; }
        }
      `}</style>

      <div className="sh-wrap">

        {/* ── HERO ── */}
        <section className="sh-hero">
          <div className="sh-hero-bg" />
          <div className="sh-hero-overlay" />
          <div className="sh-hero-watermark">Thrift</div>
          <div className="sh-hero-inner">
            <div className="sh-hero-tag">
              <FaTag size={12} />
              Nepal&apos;s #1 Secondhand Marketplace
            </div>
            <h1>Find The Best</h1>
            <h2>Secondhand Goods services</h2>
            <p>Trusted secondhand goods near you</p>
            <div className="sh-search-wrap">
              <FiSearch className="sh-search-icon" size={15} />
              <input
                className="sh-search"
                placeholder="Search sales, buy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY STRIP ── */}
        <section className="sh-cats-strip">
          <div className="sh-cats-inner">
            <p className="sh-cats-label">Browse Categories</p>
            <div className="sh-cats-row">
              {CATEGORY_ICONS.map((cat) => (
                <button
                  key={cat.value}
                  className={`sh-cat-card${activeCategory === cat.value ? " active" : ""}`}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.value ? "" : cat.value)
                  }
                >
                  <span className="sh-cat-icon" style={{ color: cat.color }}>
                    <cat.icon size={22} />
                  </span>
                  <span>
                    <span className="sh-cat-name">{cat.name}</span>
                    <span className="sh-cat-count">
                      {listings.filter((l) => l.secondhand.category === cat.value).length.toLocaleString()} listings
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="sh-body">

          {/* ── SIDEBAR ── */}
          <aside className="sh-sidebar">
            <div className="sh-sb-head">
              Filter
              <button className="sh-sb-reset" onClick={reset}>Reset</button>
            </div>

            {/* Category */}
            <div className="sh-sb-section">
              <p className="sh-sb-title">Category</p>
              {CATEGORY_ICONS.map((cat) => (
                <div
                  key={cat.value}
                  className="sh-check-row"
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.value ? "" : cat.value)
                  }
                >
                  <div className={`sh-checkbox${activeCategory === cat.value ? " checked" : ""}`}>
                    {activeCategory === cat.value && <FiCheckCircle size={10} color="#fff" />}
                  </div>
                  <span className={`sh-check-label${activeCategory === cat.value ? " checked" : ""}`}>
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Condition */}
            <div className="sh-sb-section">
              <p className="sh-sb-title">Condition</p>
              {CONDITIONS.map((c) => (
                <div key={c} className="sh-check-row" onClick={() => toggleCondition(c)}>
                  <div className={`sh-checkbox${selectedConditions.includes(c) ? " checked" : ""}`}>
                    {selectedConditions.includes(c) && <FiCheckCircle size={10} color="#fff" />}
                  </div>
                  <span className={`sh-check-label${selectedConditions.includes(c) ? " checked" : ""}`}>{c}</span>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="sh-sb-section">
              <p className="sh-sb-title">Price Range</p>
              <input
                type="range"
                min={0}
                max={10000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="sh-range"
              />
              <div className="sh-range-vals">
                <span>0</span>
                <span className="hi">NPR {priceRange.toLocaleString()}</span>
              </div>
            </div>

            {/* City */}
            <div className="sh-sb-section">
              <p className="sh-sb-title">City</p>
              <select
                className="sh-city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select City</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button className="sh-apply-btn" onClick={reset}>Apply Filters</button>
          </aside>

          {/* ── MAIN ── */}
          <div className="sh-main">
            {/* Results bar */}
            <div className="sh-results-bar">
              <span className="sh-count">
                <strong>{loading ? "…" : sortedDisplayed.length}</strong> results found
              </span>
              <div style={{ position: "relative" }}>
                <select
                  className="sh-sort"
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

            {/* Loading */}
            {loading && (
              <div className="sh-empty">
                <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", margin: "0 0 4px" }}>Loading listings…</p>
              </div>
            )}

            {/* Error */}
            {!loading && loadError && (
              <div className="sh-empty">
                <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", margin: "0 0 4px" }}>Couldn&apos;t load listings</p>
                <span style={{ fontSize: 13, color: "#888" }}>Something went wrong fetching data</span>
                <br />
                <button className="sh-empty-btn" onClick={loadListings}>Retry</button>
              </div>
            )}

            {/* Cards */}
            {!loading && !loadError && (
              sortedDisplayed.length === 0 ? (
                <div className="sh-empty">
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: "#111", margin: "0 0 4px" }}>No listings found</p>
                  <span style={{ fontSize: 13, color: "#888" }}>Try adjusting your filters or search term</span>
                  <br />
                  <button className="sh-empty-btn" onClick={reset}>Reset Filters</button>
                </div>
              ) : (
                <div className="sh-grid">
                  {sortedDisplayed.map((item) => {
                    const isFav = !!favorites[item.id];
                    const images = item.images.length ? item.images : [PLACEHOLDER_IMG];
                    const currentImg = imageIndices[item.id] || 0;
                    const hasMultiple = images.length > 1;
                    const conditionLabel = CONDITION_FROM_DB[item.secondhand.condition];
                    const badge = CONDITION_BADGE[conditionLabel];
                    const posted = daysAgo(item.createdAt);
                    const price = item.secondhand.price ?? item.price ?? 0;

                    return (
                      <div key={item.id} className="sh-card">
                        {/* Image */}
                        <Link
                          href={`/category/secondhand/${item.id}`}
                          className="sh-card-img-wrap"
                          style={{ display: "block", textDecoration: "none" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              images[currentImg] && images[currentImg] !== PLACEHOLDER_IMG
                                ? `${IMG_BASE}${images[currentImg]}`
                                : PLACEHOLDER_IMG
                            }
                            alt={item.title}
                            className="sh-card-img"
                          />

                          <span
                            className="sh-card-condition"
                            style={{ background: badge.bg, color: badge.color }}
                          >
                            <span className="sh-cond-dot" style={{ background: badge.dot }} />
                            {conditionLabel}
                          </span>

                          <button className="sh-card-fav" onClick={(e) => toggleFav(item.id, e)}>
                            {isFav
                              ? <FaHeart size={12} color="#ef4444" />
                              : <FiHeart size={12} color="#9ca3af" />}
                          </button>

                          {hasMultiple && (
                            <>
                              <button
                                className="sh-carousel-btn prev"
                                onClick={(e) => prevImage(item.id, images.length, e)}
                              >
                                <FiChevronLeft size={14} />
                              </button>
                              <button
                                className="sh-carousel-btn next"
                                onClick={(e) => nextImage(item.id, images.length, e)}
                              >
                                <FiChevronRight size={14} />
                              </button>
                              <div className="sh-dots">
                                {images.map((_, idx) => (
                                  <div key={idx} className={`sh-dot${idx === currentImg ? " active" : ""}`} />
                                ))}
                              </div>
                            </>
                          )}
                        </Link>

                        {/* Body */}
                        <div className="sh-card-body">
                          <p className="sh-card-title">{item.title}</p>
                          <p className="sh-card-price">NPR {price.toLocaleString()}</p>
                          <div className="sh-card-location">
                            <FiMapPin size={11} />
                            {item.secondhand.city}
                          </div>
                          <div className="sh-card-tags">
                            <span className="sh-tag">
                              {posted === 0 ? "Today" : posted === 1 ? "1 day ago" : `${posted} days ago`}
                            </span>
                            {item.secondhand.isNegotiable && (
                              <span className="sh-tag offer">Open to Offers</span>
                            )}
                          </div>

                          <Link
                            href={`/category/secondhand/${item.id}`}
                            className="sh-chat-btn"
                          >
                            <FiMessageSquare size={13} />
                            {item.secondhand.isNegotiable ? "Buy Now" : "Contact"}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Load More */}
            {!loading && sortedDisplayed.length > 0 && (
              <div className="sh-load-more">
                <button className="sh-load-more-btn">View More</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}