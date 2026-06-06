"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiSearch, FiMapPin, FiStar } from "react-icons/fi";
import { FaHeart, FaStar, FaBuilding, FaHome, FaTree, FaStore, FaBriefcase } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  city: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  isFurnished?: boolean;
  purpose: "Rent" | "Sale" | "Buy";
  rating: number;
  reviews: number;
};

// ── MANUAL IMAGES - Replace these URLs with your own ──
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&h=400&fit=crop",
  apt1: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  apt2: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
  apt3: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
  house1: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  house2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  house3: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  apt4: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
  apt5: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&h=400&fit=crop",
  house4: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
};

const LISTINGS: Property[] = [
  {
    id: "3bhk-balkumari",
    title: "3BHK Apartment",
    price: "Rs. 20,000/month",
    location: "Balkumari, Lalitpur",
    city: "Lalitpur",
    type: "Apartment",
    beds: 3, baths: 1, sqft: 1200,
    image: IMAGES.apt1,
    isFurnished: true, purpose: "Rent",
    rating: 4.8, reviews: 128,
  },
  {
    id: "3bhk-sanepa",
    title: "3BHK House",
    price: "Rs. 80,20,000",
    location: "Sanepa, Lalitpur",
    city: "Lalitpur",
    type: "House",
    beds: 3, baths: 1, sqft: 1500,
    image: IMAGES.house1,
    isFurnished: true, purpose: "Sale",
    rating: 4.8, reviews: 128,
  },
  {
    id: "4th-baneshwor",
    title: "4th floor House",
    price: "Rs. 1,50,00,000",
    location: "Baneshwor, Kathmandu",
    city: "Kathmandu",
    type: "House",
    beds: 4, baths: 3, sqft: 2200,
    image: IMAGES.house2,
    isFurnished: true, purpose: "Buy",
    rating: 4.8, reviews: 128,
  },
  {
    id: "3bhk-balko",
    title: "3BHK Apartment",
    price: "Rs. 20,000/month",
    location: "Balko, Lalitpur",
    city: "Lalitpur",
    type: "Apartment",
    beds: 3, baths: 1, sqft: 1100,
    image: IMAGES.apt2,
    isFurnished: true, purpose: "Rent",
    rating: 4.8, reviews: 128,
  },
  {
    id: "2bhk-lazimpat",
    title: "2BHK Modern Apartment",
    price: "Rs. 25,000 / month",
    location: "Lazimpat, Kathmandu",
    city: "Kathmandu",
    type: "Apartment",
    beds: 2, baths: 2, sqft: 1200,
    image: IMAGES.apt3,
    isVerified: true, isFeatured: true, purpose: "Rent",
    rating: 4.9, reviews: 86,
  },
  {
    id: "house-bhaktapur",
    title: "Private House for Sale",
    price: "Rs. 1,20,00,000",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    type: "House",
    beds: 4, baths: 3, sqft: 2200,
    image: IMAGES.house3,
    isVerified: true, isFeatured: true, purpose: "Sale",
    rating: 4.7, reviews: 45,
  },
  {
    id: "apartment-thamel",
    title: "Studio Apartment in Thamel",
    price: "Rs. 12,000 / month",
    location: "Thamel, Kathmandu",
    city: "Kathmandu",
    type: "Apartment",
    beds: 1, baths: 1, sqft: 450,
    image: IMAGES.apt4,
    isFeatured: true, purpose: "Rent",
    rating: 4.5, reviews: 203,
  },
  {
    id: "house3-pokhara",
    title: "Lakeside House in Pokhara",
    price: "Rs. 1,10,00,000",
    location: "Lakeside, Pokhara",
    city: "Pokhara",
    type: "House",
    beds: 3, baths: 2, sqft: 1650,
    image: IMAGES.house4,
    isVerified: true, purpose: "Sale",
    rating: 4.9, reviews: 67,
  },
];

const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar"];

// ── ICON CATEGORY CARDS (Like Medical Page) ──
const CATEGORY_CARDS = [
  { id: "Apartment", label: "Apartment", icon: FaBuilding, count: 892, color: "#3b5bdb" },
  { id: "House", label: "House", icon: FaHome, count: 645, color: "#2e7d32" },
  { id: "Land", label: "Land", icon: FaTree, count: 320, color: "#6a9c3e" },
  { id: "Commercial", label: "Commercial", icon: FaStore, count: 210, color: "#e65100" },
  { id: "Office", label: "Office", icon: FaBriefcase, count: 155, color: "#1565c0" },
];

export default function PropertyPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeType, setActiveType] = useState("All");

  // Filters
  const [filterSales, setFilterSales] = useState(false);
  const [filterRent, setFilterRent] = useState(false);
  const [filterBuy, setFilterBuy] = useState(false);
  const [filter1BHK, setFilter1BHK] = useState(false);
  const [filter2BHK, setFilter2BHK] = useState(false);
  const [filter3BHK, setFilter3BHK] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterFurnished, setFilterFurnished] = useState(false);
  const [filterUnfurnished, setFilterUnfurnished] = useState(false);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const resetFilters = () => {
    setActiveType("All");
    setFilterSales(false); setFilterRent(false); setFilterBuy(false);
    setFilter1BHK(false); setFilter2BHK(false); setFilter3BHK(false);
    setFilterCity(""); setFilterPrice("");
    setFilterFurnished(false); setFilterUnfurnished(false);
    setSearch("");
  };

  const displayed = LISTINGS.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());

    const matchType = activeType === "All" || l.type === activeType;

    const purposeFilters = [];
    if (filterSales) purposeFilters.push("Sale");
    if (filterRent) purposeFilters.push("Rent");
    if (filterBuy) purposeFilters.push("Buy");
    const matchPurpose = purposeFilters.length === 0 || purposeFilters.includes(l.purpose);

    const bhkFilters = [];
    if (filter1BHK) bhkFilters.push(1);
    if (filter2BHK) bhkFilters.push(2);
    if (filter3BHK) bhkFilters.push(3);
    const matchBHK = bhkFilters.length === 0 || bhkFilters.includes(l.beds);

    const matchCity = !filterCity || l.city === filterCity;

    const matchFurnished = (!filterFurnished && !filterUnfurnished) ||
      (filterFurnished && l.isFurnished) ||
      (filterUnfurnished && !l.isFurnished);

    return matchSearch && matchType && matchPurpose && matchBHK && matchCity && matchFurnished;
  }).sort((a, b) => {
    if (sort === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= Math.floor(rating) ? (
            <FaStar size={14} className="text-yellow-400" />
          ) : star - 0.5 <= rating ? (
            <FaStar size={14} className="text-yellow-400 opacity-60" />
          ) : (
            <FiStar size={14} className="text-gray-300" />
          )}
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .pp { background: #f0e6f6; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .pp-hero {
          position: relative; height: 320px; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .pp-hero-bg {
          position: absolute; inset: 0;
          background: url('${IMAGES.hero}') center / cover no-repeat;
          filter: brightness(0.5);
        }
        .pp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(180,30,50,0.6) 0%, rgba(80,20,60,0.4) 100%);
        }
        .pp-hero-inner {
          position: relative; z-index: 2;
          text-align: center; max-width: 700px; padding: 0 24px;
        }
        .pp-hero-title {
          font-size: clamp(24px, 4vw, 38px); font-weight: 800; color: #fff;
          margin: 0 0 8px; line-height: 1.2;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .pp-hero-sub {
          color: rgba(255,255,255,0.85); font-size: 14px;
          margin: 0 0 24px; font-weight: 500;
        }
        .pp-search-wrap {
          position: relative; max-width: 540px; margin: 0 auto;
        }
        .pp-search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          z-index: 3;
        }
        .pp-search {
          width: 100%; padding: 14px 16px 14px 48px;
          background: rgba(255,255,255,0.98); border: none; border-radius: 12px;
          font-size: 14px; color: #333; font-family: inherit; outline: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        }
        .pp-search::placeholder { color: #999; }

        /* ── CATEGORY STRIP (Like Medical Page) ── */
        .pp-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 24px 0;
        }
        .pp-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
        }
        .pp-cats-label {
          font-size: 13px; font-weight: 700; color: #888;
          margin-bottom: 16px; text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .pp-cats-row {
          display: flex; gap: 16px; flex-wrap: wrap;
        }
        .pp-cat-card {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 20px; border-radius: 14px;
          border: 2px solid #e8e8e8; background: #fff;
          cursor: pointer; transition: all 0.2s ease;
          min-width: 160px; font-family: inherit;
        }
        .pp-cat-card:hover {
          border-color: #3b5bdb;
          background: #f8f9ff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59,91,219,0.12);
        }
        .pp-cat-card.active {
          border-color: #3b5bdb;
          background: #eef2ff;
          box-shadow: 0 4px 16px rgba(59,91,219,0.2);
        }
        .pp-cat-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-cat-info { display: flex; flex-direction: column; }
        .pp-cat-name { font-size: 15px; font-weight: 700; color: #1a1a1a; }
        .pp-cat-count { font-size: 12px; color: #888; font-weight: 500; }

        /* ── MAIN BODY ── */
        .pp-body {
          max-width: 1200px; margin: 0 auto;
          padding: 28px 24px 60px;
        }
        .pp-layout {
          display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start;
        }

        /* ── SIDEBAR ── */
        .pp-sidebar {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8e8e8;
          overflow: hidden;
          position: sticky; top: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .psf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px;
          background: #e74c3c;
        }
        .psf-head-title { font-size: 16px; font-weight: 800; color: #fff; margin: 0; }
        .psf-head-arrow { color: #fff; font-size: 20px; }

        .psf-section { padding: 16px 18px; border-bottom: 1px solid #f0f0f0; }
        .psf-section:last-of-type { border-bottom: none; }
        .psf-label { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px; }

        .psf-checkbox {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 10px; cursor: pointer;
        }
        .psf-checkbox:last-child { margin-bottom: 0; }
        .psf-checkbox input {
          width: 18px; height: 18px; accent-color: #e74c3c;
          cursor: pointer;
        }
        .psf-checkbox span { font-size: 13px; color: #444; font-weight: 500; }

        .psf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e0e0e0; border-radius: 8px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
        }
        .psf-select:focus { border-color: #e74c3c; }

        .psf-readmore {
          display: block; width: 100%; padding: 12px;
          text-align: center; background: #f8f8f8;
          color: #333; font-size: 14px; font-weight: 600;
          border: none; cursor: pointer; font-family: inherit;
          border-top: 1px solid #f0f0f0;
          transition: background 0.2s;
        }
        .psf-readmore:hover { background: #f0f0f0; }

        /* ── RESULTS BAR ── */
        .pp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .pp-results-count { font-size: 14px; color: #888; font-weight: 500; }
        .pp-results-count strong { color: #333; font-weight: 700; }
        .pp-sort-select {
          padding: 8px 32px 8px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit;
        }

        /* ── PROPERTY CARDS (2-2 GRID) ── */
        .pp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .pp-card {
          background: #fff; border-radius: 16px; border: 1px solid #e8e8e8;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column;
          transition: box-shadow 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          cursor: pointer; position: relative;
        }
        .pp-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.1); }

        .pp-card-img-wrap {
          position: relative; width: 100%; height: 200px;
          overflow: hidden; background: #e8eaf0;
        }
        .pp-card-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .pp-card-badges {
          position: absolute; top: 12px; left: 12px;
          display: flex; gap: 6px;
        }
        .pp-badge {
          font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px;
        }
        .pp-badge-rent { background: #e8f5e9; color: #2e7d32; }
        .pp-badge-sale { background: #fff3e0; color: #e65100; }
        .pp-badge-buy { background: #e3f2fd; color: #1565c0; }
        .pp-badge-furnished {
          position: absolute; top: 12px; right: 12px;
          background: #e8f5e9; color: #2e7d32;
          font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px;
        }

        .pp-heart {
          position: absolute; bottom: 12px; right: 12px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.95); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          transition: transform 0.18s;
        }
        .pp-heart:hover { transform: scale(1.15); }

        .pp-card-body {
          padding: 16px 20px 20px; display: flex; flex-direction: column;
          gap: 6px;
        }
        .pp-card-title {
          font-size: 17px; font-weight: 700; color: #1a1a1a;
          margin: 0;
        }
        .pp-card-price {
          font-size: 15px; font-weight: 700; color: #e74c3c;
          margin: 0;
        }
        .pp-card-details {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px; color: #666;
        }
        .pp-card-detail-item { display: flex; align-items: center; gap: 4px; }
        .pp-card-location {
          font-size: 12px; color: #888;
          display: flex; align-items: center; gap: 4px;
        }
        .pp-card-rating {
          display: flex; align-items: center; gap: 12px;
        }
        .pp-card-reviews {
          font-size: 12px; color: #888;
        }

        .pp-btn-details {
          display: inline-block;
          padding: 8px 20px;
          background: #ffcdcd; color: #c0392b;
          font-size: 12px; font-weight: 700;
          border: none; border-radius: 20px;
          cursor: pointer; font-family: inherit;
          transition: background 0.2s;
          margin-top: 6px;
          align-self: flex-start;
        }
        .pp-btn-details:hover { background: #ffb8b8; }

        /* ── EMPTY ── */
        .pp-empty {
          padding: 64px 24px; text-align: center;
          background: #fff; border-radius: 16px;
          grid-column: 1 / -1;
        }
        .pp-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .pp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .pp-empty span { font-size: 13px; color: #aaa; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .pp-layout { grid-template-columns: 1fr; }
          .pp-sidebar { display: none; }
          .pp-cats-row { justify-content: center; }
        }
        @media (max-width: 640px) {
          .pp-hero { height: 260px; }
          .pp-body { padding: 20px 16px 40px; }
          .pp-grid { grid-template-columns: 1fr; }
          .pp-card-body { padding: 14px 16px 16px; }
          .pp-cat-card { min-width: 140px; padding: 12px 16px; }
        }
      `}</style>

      <div className="pp">
        {/* ── HERO ── */}
        <section className="pp-hero">
          <div className="pp-hero-bg" />
          <div className="pp-hero-overlay" />
          <div className="pp-hero-inner">
            <h1 className="pp-hero-title">
              Find The Best<br />
              Rent & Real Estate Services
            </h1>
            <p className="pp-hero-sub">Trusted Real Estate Services Since 2015</p>
            <div className="pp-search-wrap">
              <FiSearch className="pp-search-icon" size={18} color="#999" />
              <input
                className="pp-search"
                placeholder="Search rent, sales, buy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY STRIP (Like Medical Page with Icons) ── */}
        <section className="pp-cats-strip">
          <div className="pp-cats-inner">
            <p className="pp-cats-label">Property Categories</p>
            <div className="pp-cats-row">
              {CATEGORY_CARDS.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeType === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`pp-cat-card${isActive ? " active" : ""}`}
                    onClick={() => setActiveType(isActive ? "All" : cat.id)}
                  >
                    <div
                      className="pp-cat-icon-wrap"
                      style={{ background: isActive ? cat.color + "20" : "#f5f5f5", color: cat.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="pp-cat-info">
                      <span className="pp-cat-name">{cat.label}</span>
                      <span className="pp-cat-count">{cat.count.toLocaleString()} listings</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MAIN BODY ── */}
        <div className="pp-body">
          <div className="pp-layout">
            {/* ── SIDEBAR ── */}
            <aside className="pp-sidebar">
              <div className="psf-head">
                <p className="psf-head-title">Filters</p>
                <span className="psf-head-arrow">&gt;</span>
              </div>

              <div className="psf-section">
                <p className="psf-label">Property Type</p>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterSales} onChange={(e) => setFilterSales(e.target.checked)} />
                  <span>Sales</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterRent} onChange={(e) => setFilterRent(e.target.checked)} />
                  <span>Rent</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterBuy} onChange={(e) => setFilterBuy(e.target.checked)} />
                  <span>Buy</span>
                </label>
              </div>

              <div className="psf-section">
                <p className="psf-label">Room Types</p>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filter1BHK} onChange={(e) => setFilter1BHK(e.target.checked)} />
                  <span>1BHK</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filter2BHK} onChange={(e) => setFilter2BHK(e.target.checked)} />
                  <span>2BHK</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filter3BHK} onChange={(e) => setFilter3BHK(e.target.checked)} />
                  <span>3BHK</span>
                </label>
              </div>

              <div className="psf-section">
                <p className="psf-label">City</p>
                <select className="psf-select" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="psf-section">
                <p className="psf-label">Price</p>
                <select className="psf-select" value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
                  <option value="">Select price</option>
                  <option value="low">Below Rs. 20,000</option>
                  <option value="mid">Rs. 20,000 - 50,000</option>
                  <option value="high">Above Rs. 50,000</option>
                </select>
              </div>

              <div className="psf-section">
                <p className="psf-label">Furnished status</p>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterFurnished} onChange={(e) => setFilterFurnished(e.target.checked)} />
                  <span>Yes</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterUnfurnished} onChange={(e) => setFilterUnfurnished(e.target.checked)} />
                  <span>No</span>
                </label>
              </div>

              <button className="psf-readmore" onClick={resetFilters}>Reset All Filters</button>
            </aside>

            {/* ── RIGHT COLUMN ── */}
            <div>
              <div className="pp-results-bar">
                <span className="pp-results-count">
                  <strong>{displayed.length}</strong> results found
                </span>
                <select className="pp-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="featured">Featured</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="pp-grid">
                {displayed.length === 0 ? (
                  <div className="pp-empty">
                    <div className="pp-empty-icon">🏠</div>
                    <p>No properties found</p>
                    <span>Try adjusting your filters or search</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    return (
                      <Link key={l.id} href={`/category/rent-and-real-estate/${l.id}`} className="pp-card">
                        <div className="pp-card-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.image} alt={l.title} className="pp-card-img" />
                          <div className="pp-card-badges">
                            <span className={`pp-badge pp-badge-${l.purpose.toLowerCase()}`}>
                              {l.purpose}
                            </span>
                          </div>
                          {l.isFurnished && (
                            <span className="pp-badge-furnished">Full Furnished</span>
                          )}
                          <button className="pp-heart" aria-label="Save" onClick={(e) => toggleFav(l.id, e)}>
                            {isFav ? <FaHeart size={16} color="#E74C3C" /> : <FiHeart size={16} color="#999" />}
                          </button>
                        </div>
                        <div className="pp-card-body">
                          <h3 className="pp-card-title">{l.title}</h3>
                          <p className="pp-card-price">{l.price}</p>
                          <div className="pp-card-details">
                            <span className="pp-card-detail-item">
                              {l.beds}rooms,{l.baths}Kitchen,{l.baths}bath
                            </span>
                            <span className="pp-card-location">
                              <FiMapPin size={12} color="#bbb" />
                              {l.location}
                            </span>
                          </div>
                          <div className="pp-card-rating">
                            <StarRating rating={l.rating} />
                            <span className="pp-card-reviews">({l.reviews} Reviews)</span>
                          </div>
                          <button className="pp-btn-details">View Details</button>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}