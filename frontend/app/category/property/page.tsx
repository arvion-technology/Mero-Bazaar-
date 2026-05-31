"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiHome, FiSearch, FiMapPin } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
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
  purpose: "Rent" | "Sale";
};

const LISTINGS: Property[] = [
  {
    id: "2bhk-lazimpat",
    title: "2BHK Modern Apartment in Lazimpat",
    price: "Rs. 25,000 / month",
    location: "Lazimpat, Kathmandu",
    city: "Kathmandu",
    type: "Apartment",
    beds: 2, baths: 2, sqft: 1200,
    image: "/apartment1.jpg",
    isVerified: true, isFeatured: true, purpose: "Rent",
  },
  {
    id: "2bhk-sanepa",
    title: "2BHK Apartment in Sanepa",
    price: "Rs. 17,000 / month",
    location: "Sanepa, Lalitpur",
    city: "Lalitpur",
    type: "Apartment",
    beds: 2, baths: 1, sqft: 950,
    image: "/apartment2.jpg",
    isVerified: true, isFeatured: false, purpose: "Rent",
  },
  {
    id: "3bhk-lazimpat",
    title: "3BHK Spacious Apartment in Lazimpat",
    price: "Rs. 32,000 / month",
    location: "Lazimpat, Kathmandu",
    city: "Kathmandu",
    type: "Apartment",
    beds: 3, baths: 2, sqft: 1500,
    image: "/apartment.avif",
    isVerified: false, isFeatured: true, purpose: "Rent",
  },
  {
    id: "2bhk-baneshwor",
    title: "2BHK Apartment in Baneshwor",
    price: "Rs. 11,000 / month",
    location: "Baneshwor, Kathmandu",
    city: "Kathmandu",
    type: "Apartment",
    beds: 2, baths: 1, sqft: 880,
    image: "/apartment3.jpg",
    isVerified: true, isFeatured: false, purpose: "Rent",
  },
  {
    id: "house-bhaktapur",
    title: "Private House for Sale in Bhaktapur",
    price: "Rs. 1,20,00,000",
    location: "Bhaktapur, Bagmati",
    city: "Bhaktapur",
    type: "House",
    beds: 4, baths: 3, sqft: 2200,
    image: "/house.jpg",
    isVerified: true, isFeatured: true, purpose: "Sale",
  },
  {
    id: "house1-kathmandu",
    title: "Modern House in Budhanilkantha",
    price: "Rs. 85,00,000",
    location: "Budhanilkantha, Kathmandu",
    city: "Kathmandu",
    type: "House",
    beds: 3, baths: 2, sqft: 1800,
    image: "/house1.jpg",
    isVerified: true, isFeatured: false, purpose: "Sale",
  },
  {
    id: "house2-lalitpur",
    title: "Family House in Godawari",
    price: "Rs. 95,00,000",
    location: "Godawari, Lalitpur",
    city: "Lalitpur",
    type: "House",
    beds: 4, baths: 3, sqft: 2000,
    image: "/house2.jpg",
    isVerified: false, isFeatured: false, purpose: "Sale",
  },
  {
    id: "apartment-patan",
    title: "2BHK Apartment in Patan",
    price: "Rs. 18,500 / month",
    location: "Patan, Lalitpur",
    city: "Lalitpur",
    type: "Apartment",
    beds: 2, baths: 2, sqft: 1100,
    image: "/apartment8.jpg",
    isVerified: true, isFeatured: false, purpose: "Rent",
  },
  {
    id: "apartment-thamel",
    title: "Studio Apartment in Thamel",
    price: "Rs. 12,000 / month",
    location: "Thamel, Kathmandu",
    city: "Kathmandu",
    type: "Apartment",
    beds: 1, baths: 1, sqft: 450,
    image: "/apartment7.jpg",
    isVerified: false, isFeatured: true, purpose: "Rent",
  },
  {
    id: "house3-pokhara",
    title: "Lakeside House in Pokhara",
    price: "Rs. 1,10,00,000",
    location: "Lakeside, Pokhara",
    city: "Pokhara",
    type: "House",
    beds: 3, baths: 2, sqft: 1650,
    image: "/house3.jpg",
    isVerified: true, isFeatured: false, purpose: "Sale",
  },
];

const PROP_TYPES = ["All", "Apartment", "House", "Land", "Commercial", "Office"];
const PURPOSES = ["All", "Rent", "Sale"];
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar"];
const BEDS = ["Any", "1+", "2+", "3+", "4+"];

const TYPE_ICONS: Record<string, string> = {
  Apartment: "🏢",
  House: "🏠",
  Land: "🌿",
  Commercial: "🏪",
  Office: "🏗️",
};

const TYPE_COUNTS: Record<string, number> = {
  Apartment: 892,
  House: 645,
  Land: 320,
  Commercial: 210,
  Office: 155,
};

export default function PropertyPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeType, setActiveType] = useState("All");
  const [purpose, setPurpose] = useState("All");
  const [city, setCity] = useState("");
  const [beds, setBeds] = useState("Any");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setActiveType("All");
    setPurpose("All");
    setCity("");
    setBeds("Any");
    setVerifiedOnly(false);
  };

  const minBeds = beds === "Any" ? 0 : parseInt(beds);

  const displayed = LISTINGS.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "All" || l.type === activeType;
    const matchPurpose = purpose === "All" || l.purpose === purpose;
    const matchCity = !city || l.city === city;
    const matchBeds = l.beds >= minBeds;
    const matchVerified = !verifiedOnly || l.isVerified;
    return matchSearch && matchType && matchPurpose && matchCity && matchBeds && matchVerified;
  }).sort((a, b) => {
    if (sort === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    return 0;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .pp { background: #f2f4f7; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .pp-hero {
          position: relative; height: 280px; overflow: hidden;
          display: flex; align-items: center;
        }
        .pp-hero-bg {
          position: absolute; inset: 0;
          background: url('/Apartment.jpg') center 40% / cover no-repeat;
          filter: brightness(0.45);
        }
        .pp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(20,40,100,0.78) 0%, rgba(80,20,60,0.5) 100%);
        }
        .pp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .pp-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.28);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .pp-hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 6px; line-height: 1.15;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .pp-hero-title span { color: #ffd580; }
        .pp-hero-sub {
          color: rgba(255,255,255,0.78); font-size: 14px;
          margin: 0 0 22px; font-weight: 400;
        }
        .pp-search-wrap { position: relative; max-width: 520px; }
        .pp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .pp-search {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.97); border: none; border-radius: 14px;
          font-size: 14px; color: #333; font-family: inherit; outline: none;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22); transition: box-shadow 0.2s;
        }
        .pp-search:focus { box-shadow: 0 6px 34px rgba(0,0,0,0.3); }
        .pp-hero-watermark {
          position: absolute; bottom: -18px; right: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.05); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        /* ── CATEGORY STRIP ── */
        .pp-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0;
        }
        .pp-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
        }
        .pp-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px; }
        .pp-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .pp-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          min-width: 130px; font-family: inherit;
        }
        .pp-cat-card:hover { border-color: #3b5bdb; background: #eef2ff; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(59,91,219,0.12); }
        .pp-cat-card.active { border-color: #3b5bdb; background: #e8ecff; box-shadow: 0 4px 16px rgba(59,91,219,0.2); }
        .pp-cat-icon { font-size: 22px; }
        .pp-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .pp-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY ── */
        .pp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .pp-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        /* ── SIDEBAR ── */
        .pp-sidebar {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #e4e8f0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .psf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f4f8;
        }
        .psf-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .psf-reset {
          font-size: 13px; font-weight: 700; color: #3b5bdb;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .psf-reset:hover { opacity: 0.7; }
        .psf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f4f8; }
        .psf-section:last-of-type { border-bottom: none; }
        .psf-label { font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; }

        .psf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e4e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer; transition: border-color 0.2s;
        }
        .psf-select:focus { border-color: #3b5bdb; }

        .psf-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .psf-chip {
          padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e0e4f0; background: #fff; color: #555;
          cursor: pointer; transition: all 0.18s; font-family: inherit;
        }
        .psf-chip:hover { border-color: #3b5bdb; color: #3b5bdb; }
        .psf-chip.active { background: #3b5bdb; color: #fff; border-color: #3b5bdb; box-shadow: 0 2px 10px rgba(59,91,219,0.3); }

        .psf-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .psf-toggle-label { font-size: 13.5px; font-weight: 600; color: #333; }
        .psf-toggle { position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-block; }
        .psf-toggle input { opacity: 0; width: 0; height: 0; }
        .psf-toggle-track { position: absolute; inset: 0; background: #ddd; border-radius: 24px; transition: background 0.25s; }
        .psf-toggle input:checked + .psf-toggle-track { background: #3b5bdb; }
        .psf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
        }
        .psf-toggle input:checked ~ .psf-toggle-thumb { transform: translateX(20px); }

        .psf-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 13px; text-align: center;
          background: linear-gradient(90deg, #3b5bdb, #2246c7);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(59,91,219,0.32);
          transition: opacity 0.18s, transform 0.18s;
        }
        .psf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RESULTS BAR ── */
        .pp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .pp-results-count { font-size: 14px; color: #666; font-weight: 500; }
        .pp-sort-select {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: border-color 0.2s;
        }
        .pp-sort-select:focus { border-color: #3b5bdb; }

        /* ── GRID ── */
        .pp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

        /* ── CARD ── */
        .pp-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #ececec;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05); cursor: pointer;
        }
        .pp-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(0,0,0,0.12); }

        .pp-img-wrap {
          position: relative; width: 100%; aspect-ratio: 4/3;
          overflow: hidden; background: #e8eaf0;
        }
        .pp-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.32s ease; }
        .pp-card:hover .pp-img { transform: scale(1.06); }

        .pp-heart {
          position: absolute; top: 9px; right: 9px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.94); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.16);
          transition: transform 0.18s, background 0.18s;
        }
        .pp-heart:hover { transform: scale(1.18); background: #fff; }

        .pp-badges {
          position: absolute; top: 9px; left: 9px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .pp-badge-verified {
          display: inline-flex; align-items: center; gap: 3px;
          background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .pp-badge-featured {
          display: inline-flex; align-items: center; gap: 3px;
          background: #fff8e1; color: #b7950b; border: 1px solid #f9e79f;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .pp-purpose-tag {
          position: absolute; bottom: 9px; left: 9px;
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
        }
        .pp-purpose-rent { background: #eef2ff; color: #3b5bdb; }
        .pp-purpose-sale { background: #fff4e6; color: #d9480f; }

        .pp-card-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 4px; }
        .pp-card-title {
          font-size: 14.5px; font-weight: 700; color: #1a1a1a;
          line-height: 1.35; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .pp-card-price { font-size: 16px; font-weight: 900; color: #3b5bdb; margin: 2px 0 0; }
        .pp-card-location { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .pp-card-divider { border: none; border-top: 1px solid #f2f4f8; margin: 8px 0 4px; }
        .pp-card-meta { display: flex; align-items: center; gap: 14px; }
        .pp-card-meta-item { font-size: 12px; color: #666; font-weight: 500; display: flex; align-items: center; gap: 4px; }

        /* ── EMPTY ── */
        .pp-empty { grid-column: 1/-1; padding: 64px 24px; text-align: center; }
        .pp-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .pp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .pp-empty span { font-size: 13px; color: #aaa; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) { .pp-layout { grid-template-columns: 1fr; } .pp-sidebar { display: none; } }
        @media (max-width: 640px) { .pp-hero { height: 220px; } .pp-body { padding: 20px 16px 40px; } .pp-grid { grid-template-columns: 1fr; gap: 12px; } }
      `}</style>

      <div className="pp">
        {/* ── HERO ── */}
        <section className="pp-hero">
          <div className="pp-hero-bg" />
          <div className="pp-hero-overlay" />
          <div className="pp-hero-watermark">Property</div>
          <div className="pp-hero-inner">
            <div className="pp-hero-tag">
              <FiHome size={13} color="#fff" />
              Nepal&apos;s #1 Property Portal
            </div>
            <h1 className="pp-hero-title">
              Find Your Perfect<br />
              <span>Property in Nepal</span>
            </h1>
            <p className="pp-hero-sub">Browse apartments, houses & land for rent and sale across Nepal</p>
            <div className="pp-search-wrap">
              <FiSearch className="pp-search-icon" size={18} color="#bbb" />
              <input
                className="pp-search"
                placeholder="Search apartments, houses, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY STRIP ── */}
        <section className="pp-cats-strip">
          <div className="pp-cats-inner">
            <p className="pp-cats-label">Property Types</p>
            <div className="pp-cats-row">
              {Object.entries(TYPE_ICONS).map(([type, icon]) => (
                <button
                  key={type}
                  className={`pp-cat-card${activeType === type ? " active" : ""}`}
                  onClick={() => setActiveType(activeType === type ? "All" : type)}
                >
                  <span className="pp-cat-icon">{icon}</span>
                  <span>
                    <span className="pp-cat-name">{type}</span>
                    <span className="pp-cat-count">{TYPE_COUNTS[type].toLocaleString()} listings</span>
                  </span>
                </button>
              ))}
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
                <button className="psf-reset" onClick={reset}>Reset</button>
              </div>

              <div className="psf-section">
                <p className="psf-label">Location / City</p>
                <select className="psf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select City</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="psf-section">
                <p className="psf-label">Purpose</p>
                <div className="psf-chips">
                  {PURPOSES.map((p) => (
                    <button key={p} className={`psf-chip${purpose === p ? " active" : ""}`} onClick={() => setPurpose(p)}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="psf-section">
                <p className="psf-label">Property Type</p>
                <div className="psf-chips">
                  {PROP_TYPES.map((t) => (
                    <button key={t} className={`psf-chip${activeType === t ? " active" : ""}`} onClick={() => setActiveType(t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="psf-section">
                <p className="psf-label">Bedrooms</p>
                <div className="psf-chips">
                  {BEDS.map((b) => (
                    <button key={b} className={`psf-chip${beds === b ? " active" : ""}`} onClick={() => setBeds(b)}>{b}</button>
                  ))}
                </div>
              </div>

              <div className="psf-section">
                <div className="psf-toggle-row">
                  <span className="psf-toggle-label">Verified Only</span>
                  <label className="psf-toggle">
                    <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                    <span className="psf-toggle-track" />
                    <span className="psf-toggle-thumb" />
                  </label>
                </div>
              </div>

              <button className="psf-apply">Apply Filters</button>
            </aside>

            {/* ── RIGHT COLUMN ── */}
            <div>
              <div className="pp-results-bar">
                <span className="pp-results-count">
                  <strong>{displayed.length}</strong> properties found
                </span>
                <select className="pp-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="featured">Featured First</option>
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
                      <Link key={l.id} href={`/category/property/${l.id}`} className="pp-card">
                        <div className="pp-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.image} alt={l.title} className="pp-img" />
                          <div className="pp-badges">
                            {l.isVerified && <span className="pp-badge-verified">✓ Verified</span>}
                            {l.isFeatured && <span className="pp-badge-featured">⭐ Featured</span>}
                          </div>
                          <span className={`pp-purpose-tag ${l.purpose === "Rent" ? "pp-purpose-rent" : "pp-purpose-sale"}`}>
                            For {l.purpose}
                          </span>
                          <button className="pp-heart" aria-label="Save" onClick={(e) => toggleFav(l.id, e)}>
                            {isFav ? <FaHeart size={15} color="#E74C3C" /> : <FiHeart size={15} color="#999" />}
                          </button>
                        </div>
                        <div className="pp-card-body">
                          <p className="pp-card-title">{l.title}</p>
                          <p className="pp-card-price">{l.price}</p>
                          <div className="pp-card-location">
                            <FiMapPin size={11} color="#bbb" />
                            {l.location}
                          </div>
                          <hr className="pp-card-divider" />
                          <div className="pp-card-meta">
                            <span className="pp-card-meta-item">🛏 {l.beds} Bed{l.beds > 1 ? "s" : ""}</span>
                            <span className="pp-card-meta-item">🚿 {l.baths} Bath{l.baths > 1 ? "s" : ""}</span>
                            <span className="pp-card-meta-item">📐 {l.sqft} sqft</span>
                          </div>
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
