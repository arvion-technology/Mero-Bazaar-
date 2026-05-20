"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

type Vehicle = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  isVerified?: boolean;
  category: string;
};

const VEHICLES: Vehicle[] = [
  { id: "hundai-creta-2022", title: "Hundai Creta 2022", price: "Rs. 32,50,000", location: "Kathmandu", image: "/Hundai Creta 2022.jpg", isVerified: true, category: "Car" },
  { id: "harley-davidson", title: "Harley-Davidson", price: "Rs. 2,00,000", location: "Kathmandu", image: "/Harley-Davidson.jpg", isVerified: true, category: "Bike" },
  { id: "getty-bus", title: "Getty Bus", price: "Rs. 3,20,000", location: "Kathmandu", image: "/Getty Bus.jpg", isVerified: true, category: "Buses" },
  { id: "scooter", title: "Scooter", price: "Rs. 32,000", location: "Kathmandu", image: "/Scooter.jpg", isVerified: true, category: "Scooter" },
  { id: "bajaj-pulsar", title: "Bajaj Pulsar N160", price: "Rs. 3,25,000", location: "Pokhara", image: "/bajaj.avif", isVerified: true, category: "Bike" },
  { id: "toyota-hiace", title: "Toyota HiAce Van", price: "Rs. 45,00,000", location: "Lalitpur", image: "/Hundai Creta 2022.jpg", isVerified: false, category: "Car" },
  { id: "honda-activa", title: "Honda Activa 6G", price: "Rs. 1,85,000", location: "Bhaktapur", image: "/Scooter.jpg", isVerified: true, category: "Scooter" },
  { id: "tata-truck", title: "Tata 407 Truck", price: "Rs. 28,00,000", location: "Chitwan", image: "/Getty Bus.jpg", isVerified: false, category: "Trucks" },
]; 

const SUB_CATS = ["All vehicles", "Car", "Trucks", "Bike", "Scooter", "Buses", "Others"];
const CITIES = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan", "Biratnagar", "Butwal"];

export default function VehiclesPage() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCat, setActiveCat] = useState("All vehicles");
  const [priceRange, setPriceRange] = useState(1000000);
  const [city, setCity] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const displayed = VEHICLES.filter((v) => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === "All vehicles" || v.category === activeCat;
    const matchCity = !city || v.location === city;
    const matchVerified = !verifiedOnly || v.isVerified;
    const priceNum = parseInt(v.price.replace(/[^\d]/g, ""));
    const matchPrice = priceNum <= priceRange;
    return matchSearch && matchCat && matchCity && matchVerified && matchPrice;
  }).sort((a, b) => {
    if (sort === "price_asc") return parseInt(a.price.replace(/[^\d]/g, "")) - parseInt(b.price.replace(/[^\d]/g, ""));
    if (sort === "price_desc") return parseInt(b.price.replace(/[^\d]/g, "")) - parseInt(a.price.replace(/[^\d]/g, ""));
    return 0;
  });

  const formatPrice = (val: number) => {
    if (val >= 100000) return `Rs ${(val / 100000).toFixed(0)} Lakh`;
    return `Rs ${val.toLocaleString()}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .vp { background: #f0f0f8; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .vp-hero {
          position: relative;
          height: 230px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .vp-hero-bg {
          position: absolute; inset: 0;
          background: url('/car of hero section.jpg') center center / cover no-repeat;
          filter: brightness(0.72);
        }
        .vp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(180,40,40,0.55) 0%, rgba(100,20,20,0.35) 100%);
        }
        .vp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .vp-hero-title {
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 900; color: #fff;
          margin: 0 0 4px; line-height: 1.15;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .vp-hero-sub {
          color: rgba(255,255,255,0.82);
          font-size: 13.5px; margin: 0 0 18px; font-weight: 400;
        }
        .vp-search-wrap {
          position: relative; max-width: 480px;
        }
        .vp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: #aaa;
        }
        .vp-search {
          width: 100%; padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.93);
          border: none; border-radius: 10px;
          font-size: 14px; color: #333;
          font-family: inherit; outline: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          transition: box-shadow 0.2s;
        }
        .vp-search::placeholder { color: #bbb; }
        .vp-search:focus { box-shadow: 0 4px 24px rgba(0,0,0,0.28); }
        .vp-hero-watermark {
          position: absolute; bottom: -18px; left: 28px;
          font-size: clamp(50px, 10vw, 90px);
          font-weight: 900; color: rgba(255,255,255,0.08);
          letter-spacing: -2px; pointer-events: none;
          user-select: none; line-height: 1;
          z-index: 1;
        }

        /* ── BODY ── */
        .vp-body {
          max-width: 1200px; margin: 0 auto;
          padding: 28px 24px 60px;
        }
        .vp-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 22px;
          align-items: start;
        }

        /* ── SIDEBAR ── */
        .vp-sidebar {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #e8e8f0;
          overflow: hidden;
          position: sticky;
          top: 82px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .vsf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px;
          border-bottom: 1.5px solid #f2f2f5;
        }
        .vsf-head-title {
          font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0;
        }
        .vsf-reset {
          font-size: 13px; font-weight: 700;
          color: #e05c3a; background: none; border: none;
          cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .vsf-reset:hover { opacity: 0.7; }

        /* price range section */
        .vsf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f2f5; }
        .vsf-section:last-of-type { border-bottom: none; }
        .vsf-label {
          font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px;
        }
        .vsf-price-range-val {
          font-size: 12.5px; color: #888; margin: 0 0 12px; font-weight: 500;
        }
        .vsf-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px;
          background: linear-gradient(to right, #e05c3a 0%, #e05c3a var(--pct, 50%), #e0e0e8 var(--pct, 50%), #e0e0e8 100%);
          border-radius: 4px; outline: none; cursor: pointer;
        }
        .vsf-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%; background: #e05c3a;
          cursor: pointer; border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(224,92,58,0.45);
        }
        .vsf-slider::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%; background: #e05c3a;
          cursor: pointer; border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(224,92,58,0.45);
        }

        /* city dropdown */
        .vsf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e8e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          transition: border-color 0.2s;
          margin-bottom: 12px;
        }
        .vsf-select:focus { border-color: #e05c3a; }

        /* verified city toggle */
        .vsf-toggle-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .vsf-toggle-label {
          font-size: 13.5px; font-weight: 600; color: #333;
        }
        .vsf-toggle {
          position: relative; width: 42px; height: 24px;
          cursor: pointer; display: inline-block;
        }
        .vsf-toggle input { opacity: 0; width: 0; height: 0; }
        .vsf-toggle-track {
          position: absolute; inset: 0;
          background: #ddd; border-radius: 24px;
          transition: background 0.25s;
        }
        .vsf-toggle input:checked + .vsf-toggle-track { background: #e05c3a; }
        .vsf-toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: transform 0.25s;
        }
        .vsf-toggle input:checked ~ .vsf-toggle-thumb { transform: translateX(18px); }

        /* sub categories chips */
        .vsf-chips {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px;
        }
        .vsf-chip {
          padding: 6px 14px; border-radius: 100px;
          font-size: 12.5px; font-weight: 600;
          border: 1.5px solid #e0e0e8;
          background: #fff; color: #555;
          cursor: pointer;
          transition: all 0.18s;
        }
        .vsf-chip:hover { border-color: #e05c3a; color: #e05c3a; }
        .vsf-chip.active {
          background: #e05c3a; color: #fff;
          border-color: #e05c3a;
          box-shadow: 0 2px 8px rgba(224,92,58,0.3);
        }

        /* apply button */
        .vsf-apply {
          display: block; width: calc(100% - 36px);
          margin: 4px 18px 18px;
          padding: 12px; text-align: center;
          background: linear-gradient(90deg, #e05c3a, #c0392b);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(192,57,43,0.32);
          transition: opacity 0.18s, transform 0.18s;
          letter-spacing: 0.2px;
        }
        .vsf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RESULTS BAR ── */
        .vp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .vp-results-count {
          font-size: 14px; color: #666; font-weight: 500;
        }
        .vp-sort-select {
          padding: 9px 36px 9px 14px;
          border: 1.5px solid #e0e0e8; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          transition: border-color 0.2s;
        }
        .vp-sort-select:focus { border-color: #e05c3a; }

        /* ── GRID ── */
        .vp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 18px;
        }

        /* ── CARD ── */
        .vp-card {
          background: #fff;
          border-radius: 14px;
          border: 1.5px solid #ececec;
          overflow: hidden;
          text-decoration: none;
          display: flex; flex-direction: column;
          position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          cursor: pointer;
        }
        .vp-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
        }
        .vp-img-wrap {
          position: relative; width: 100%;
          aspect-ratio: 16/11; overflow: hidden;
          background: #f0f0f5;
        }
        .vp-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.32s ease;
        }
        .vp-card:hover .vp-img { transform: scale(1.06); }

        /* heart button */
        .vp-heart {
          position: absolute; top: 9px; right: 9px;
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(255,255,255,0.93);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.14);
          transition: transform 0.18s, background 0.18s;
        }
        .vp-heart:hover { transform: scale(1.18); background: #fff; }

        /* card body */
        .vp-card-body {
          padding: 12px 14px 14px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .vp-card-title {
          font-size: 14px; font-weight: 700; color: #1a1a1a;
          line-height: 1.35; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .vp-card-price {
          font-size: 15px; font-weight: 900; color: #c0392b; margin: 0;
        }
        .vp-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 2px;
        }
        .vp-card-location {
          font-size: 12px; color: #888; font-weight: 500;
        }
        .vp-verified {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 600; color: #27ae60;
        }
        .vp-verified-icon {
          width: 15px; height: 15px; border-radius: 50%;
          background: rgba(39,174,96,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* empty state */
        .vp-empty {
          grid-column: 1/-1; padding: 64px 24px; text-align: center; color: #888;
        }
        .vp-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .vp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .vp-empty span { font-size: 13px; color: #aaa; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .vp-layout { grid-template-columns: 1fr; }
          .vp-sidebar { display: none; }
        }
        @media (max-width: 640px) {
          .vp-hero { height: 200px; }
          .vp-body { padding: 20px 16px 40px; }
          .vp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 380px) {
          .vp-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vp">
        {/* ── HERO ── */}
        <section className="vp-hero">
          <div className="vp-hero-bg" />
          <div className="vp-hero-overlay" />
          <div className="vp-hero-watermark">Vehicles</div>
          <div className="vp-hero-inner">
            <h1 className="vp-hero-title">Vehicles in Nepal</h1>
            <p className="vp-hero-sub">Find the best cars, bikes and more</p>
            <div className="vp-search-wrap">
              <svg className="vp-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#aaa" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                className="vp-search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="vp-body">
          <div className="vp-layout">

            {/* ── SIDEBAR ── */}
            <aside className="vp-sidebar">
              <div className="vsf-head">
                <p className="vsf-head-title">Filters</p>
                <button
                  className="vsf-reset"
                  onClick={() => {
                    setPriceRange(1000000);
                    setCity("");
                    setVerifiedOnly(false);
                    setActiveCat("All vehicles");
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Price Range */}
              <div className="vsf-section">
                <p className="vsf-label">Price Range</p>
                <p className="vsf-price-range-val">Rs. 0-{formatPrice(priceRange)}</p>
                <input
                  type="range"
                  className="vsf-slider"
                  min={0}
                  max={10000000}
                  step={50000}
                  value={priceRange}
                  style={{ "--pct": `${(priceRange / 10000000) * 100}%` } as React.CSSProperties}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
              </div>

              {/* Location / City */}
              <div className="vsf-section">
                <p className="vsf-label">Location/City</p>
                <select
                  className="vsf-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="vsf-toggle-row">
                  <span className="vsf-toggle-label">Verified City</span>
                  <label className="vsf-toggle">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                    />
                    <span className="vsf-toggle-track" />
                    <span className="vsf-toggle-thumb" />
                  </label>
                </div>
              </div>

              {/* Sub Categories */}
              <div className="vsf-section">
                <p className="vsf-label">Sub Categories</p>
                <div className="vsf-chips">
                  {SUB_CATS.map((cat) => (
                    <button
                      key={cat}
                      className={`vsf-chip${activeCat === cat ? " active" : ""}`}
                      onClick={() => setActiveCat(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button className="vsf-apply">Apply Filters</button>
            </aside>

            {/* ── RIGHT COLUMN ── */}
            <div>
              {/* Results bar */}
              <div className="vp-results-bar">
                <span className="vp-results-count">
                  {displayed.length * 154} results found
                </span>
                <select
                  className="vp-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                </select>
              </div>

              {/* Cards grid */}
              <div className="vp-grid">
                {displayed.length === 0 ? (
                  <div className="vp-empty">
                    <div className="vp-empty-icon">🔍</div>
                    <p>No vehicles found</p>
                    <span>Try a different search or filter</span>
                  </div>
                ) : (
                  displayed.map((v) => {
                    const isFav = !!favorites[v.id];
                    return (
                      <Link key={v.id} href={`/listing/${v.id}`} className="vp-card">
                        {/* Image */}
                        <div className="vp-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.image} alt={v.title} className="vp-img" />
                          <button
                            className="vp-heart"
                            aria-label="Save"
                            onClick={(e) => toggleFav(v.id, e)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "#E74C3C" : "none"}>
                              <path
                                d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
                                stroke={isFav ? "#E74C3C" : "#999"}
                                strokeWidth="1.8"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Body */}
                        <div className="vp-card-body">
                          <p className="vp-card-title">{v.title}</p>
                          <p className="vp-card-price">{v.price}</p>
                          <div className="vp-card-footer">
                            <span className="vp-card-location">{v.location}</span>
                            {v.isVerified && (
                              <span className="vp-verified">
                                <span className="vp-verified-icon">
                                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6L5 9L10 3" stroke="#27ae60" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                Verified
                              </span>
                            )}
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