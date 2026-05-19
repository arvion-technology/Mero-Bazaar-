"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

// vehicle type definition
type Vehicle = {
  id: string;
  title: string;
  price: string;
  location: string;
  km: string;
  year: number;
  image: string;
  isSold?: boolean;
  isFeatured?: boolean;
};

// TODO: move this to a separate data file later, getting too long
const VEHICLES: Vehicle[] = [
  { id: "bajaj-pulsar", title: "Bajaj Pulsar N160", price: "NPR 3,25,000", location: "Kathmandu", km: "12,000 km", year: 2023, image: "/bajaj.avif", isFeatured: true },
];

export default function VehiclesPage() {
  // favorites state - tracks which cards are saved
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // all the filter states
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [filterFuels, setFilterFuels] = useState<string[]>([]);
  const [filterConds, setFilterConds] = useState<string[]>([]);
  const [filterMinP, setFilterMinP] = useState("");
  const [filterMaxP, setFilterMaxP] = useState("");
  const [filterMaxKm, setFilterMaxKm] = useState("");

  // toggle favorite on/off - found this pattern on stackoverflow
  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  // filter and sort the vehicles list
  const displayed = VEHICLES
    .filter((v) => v.title.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "price_asc" ? parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, ""))
      : sort === "price_desc" ? parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, ""))
        : 0);

  return (
    <>
      {/* all the styles for this page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .vp { background: #f4f4f8; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* hero section at the top */
        .vp-hero {
          background: linear-gradient(130deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 40px 24px 36px;
          position: relative;
          overflow: hidden;
        }
        .vp-hero::after {
          content: '';
          position: absolute;
          right: -60px; top: -60px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(192,57,43,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .vp-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
        .vp-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(192,57,43,0.2); border: 1px solid rgba(192,57,43,0.4);
          color: #ff8a80; font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; padding: 4px 12px; border-radius: 100px; margin-bottom: 14px;
        }
        .vp-hero-title {
          font-size: clamp(24px,4vw,38px); font-weight: 900; color: #fff;
          margin: 0 0 8px; letter-spacing: -0.4px; line-height: 1.15;
        }
        .vp-hero-title em {
          font-style: normal;
          background: linear-gradient(90deg,#ff6b6b,#ffd93d);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .vp-hero-sub { color: rgba(255,255,255,0.55); font-size: 14px; margin: 0 0 26px; }

        /* search and sort bar */
        .vp-bar {
          display: flex; gap: 10px; flex-wrap: wrap;
        }
        .vp-search-wrap {
          flex: 1; min-width: 220px; position: relative;
        }
        .vp-search-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .vp-search {
          width: 100%; padding: 11px 14px 11px 38px;
          background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 10px; color: #fff; font-size: 13.5px; font-family: inherit; outline: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .vp-search::placeholder { color: rgba(255,255,255,0.4); }
        .vp-search:focus { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.35); }
        .vp-sort {
          padding: 11px 36px 11px 14px; border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08) url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23fff' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          color: #fff; font-size: 13px; font-family: inherit; font-weight: 600;
          outline: none; cursor: pointer; appearance: none;
        }
        .vp-sort option { color: #1a1a1a; background: #fff; }

        /* main body below the hero */
        .vp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 52px; }

        /* sidebar + cards layout */
        .vp-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* filter sidebar on the left */
        .vp-sidebar {
          background: #fff;
          border-radius: 14px;
          border: 1.5px solid #ececec;
          overflow: hidden;
          position: sticky;
          top: 84px;
        }
        .vsf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 15px 16px 13px; border-bottom: 1px solid #f0f0f0;
        }
        .vsf-head-left { display: flex; align-items: center; gap: 8px; }
        .vsf-head-title { font-size: 13.5px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .vsf-badge {
          background: #C0392B; color: #fff; font-size: 9.5px; font-weight: 700;
          border-radius: 100px; padding: 1px 7px; min-width: 18px; text-align: center;
        }
        .vsf-clear { font-size: 11.5px; font-weight: 600; color: #C0392B; background: none; border: none; cursor: pointer; padding: 0; }
        .vsf-clear:hover { opacity: 0.7; }
        .vsf-sec { padding: 14px 16px; border-bottom: 1px solid #f5f5f5; }
        .vsf-sec:last-of-type { border-bottom: none; }
        .vsf-sec-title {
          font-size: 10.5px; font-weight: 800; color: #888;
          text-transform: uppercase; letter-spacing: 0.7px; margin: 0 0 10px;
        }
        .vsf-list { display: flex; flex-direction: column; gap: 7px; }
        .vsf-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; color: #333; font-weight: 500;
          cursor: pointer; user-select: none;
        }
        .vsf-row:hover { color: #C0392B; }
        .vsf-box {
          width: 15px; height: 15px; border-radius: 4px;
          border: 1.8px solid #ddd; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff; transition: background 0.15s, border-color 0.15s;
        }
        .vsf-box.on { background: #C0392B; border-color: #C0392B; }
        .vsf-check { color: #fff; font-size: 9px; font-weight: 900; }
        .vsf-range { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .vsf-input {
          width: 100%; padding: 7px 9px; border: 1.5px solid #e8e8e8;
          border-radius: 8px; font-size: 12px; color: #1a1a1a;
          font-family: inherit; outline: none; background: #fafafa;
          transition: border-color 0.2s;
        }
        .vsf-input:focus { border-color: #C0392B; background: #fff; }
        .vsf-input::placeholder { color: #bbb; }
        .vsf-select {
          width: 100%; padding: 7px 28px 7px 9px; border: 1.5px solid #e8e8e8;
          border-radius: 8px; font-size: 12px; color: #1a1a1a; font-family: inherit;
          outline: none; background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 9px center;
          appearance: none; cursor: pointer; transition: border-color 0.2s;
        }
        .vsf-select:focus { border-color: #C0392B; }
        .vsf-apply {
          display: block; width: calc(100% - 32px); margin: 0 16px 16px;
          padding: 10px; background: linear-gradient(90deg,#C0392B,#e74c3c);
          color: #fff; font-size: 13px; font-weight: 700; border: none;
          border-radius: 10px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 12px rgba(192,57,43,0.28);
          transition: opacity 0.18s, transform 0.18s;
        }
        .vsf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* shows how many results */
        .vp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
        }
        .vp-results-text { font-size: 13px; color: #666; }
        .vp-results-text strong { color: #1a1a1a; font-weight: 700; }

        /* vehicle cards grid */
        .vp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 18px;
        }

        /* hide sidebar on mobile */
        @media (max-width: 900px) {
          .vp-layout { grid-template-columns: 1fr; }
          .vp-sidebar { display: none; }
        }

        /* vehicle card styles */
        .vp-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #ececec;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .vp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.12);
          border-top: 2.5px solid #C0392B;
          border-color: #C0392B;
        }

        /* featured card has gold border */
        .vp-card.featured {
          border-color: #F39C12;
          box-shadow: 0 4px 18px rgba(243,156,18,0.2);
        }
        .vp-card.featured:hover {
          border-color: #e67e22;
          box-shadow: 0 14px 42px rgba(243,156,18,0.28);
        }

        /* sold cards look faded */
        .vp-card.sold { opacity: 0.68; }
        .vp-card.sold:hover {
          transform: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border-color: #ececec;
          border-top-color: #ececec;
        }

        .vp-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #f0f0f5;
        }
        .vp-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.3s ease;
        }
        .vp-card:not(.sold):hover .vp-img { transform: scale(1.06); }

        /* red overlay when sold */
        .vp-sold-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.32);
          display: flex; align-items: center; justify-content: center;
          z-index: 3;
        }
        .vp-sold-stamp {
          background: #C0392B; color: #fff;
          font-size: 15px; font-weight: 900;
          letter-spacing: 3px; padding: 7px 20px;
          border-radius: 6px; text-transform: uppercase;
          transform: rotate(-8deg);
          box-shadow: 0 4px 16px rgba(0,0,0,0.35);
        }

        /* featured star badge */
        .vp-feat-badge {
          position: absolute; top: 10px; left: 10px;
          background: linear-gradient(90deg,#F39C12,#f1c40f);
          color: #6d3a00; font-size: 9.5px; font-weight: 800;
          letter-spacing: 0.6px; text-transform: uppercase;
          padding: 3px 9px 3px 7px; border-radius: 100px; z-index: 2;
          box-shadow: 0 2px 8px rgba(243,156,18,0.45);
          display: inline-flex; align-items: center; gap: 3px;
        }

        /* heart button top right of image */
        .vp-heart {
          position: absolute; top: 10px; right: 10px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.14);
          transition: background 0.18s, transform 0.18s;
        }
        .vp-heart:hover { background: #fff; transform: scale(1.15); }

        .vp-body-card {
          padding: 14px 15px 15px;
          display: flex; flex-direction: column; gap: 6px; flex: 1;
        }

        .vp-card-title {
          font-size: 14px; font-weight: 700; color: #1a1a1a;
          line-height: 1.35; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .vp-price {
          font-size: 16px; font-weight: 900; color: #C0392B; margin: 0;
        }

        .vp-info-row {
          display: flex; align-items: center; gap: 10px;
          font-size: 11.5px; color: #777; flex-wrap: wrap;
        }
        .vp-info-item {
          display: flex; align-items: center; gap: 3px;
        }

        .vp-btn-row {
          display: flex; gap: 8px; margin-top: 4px;
        }
        .vp-btn-heart {
          width: 38px; height: 38px; flex-shrink: 0;
          border: 1.5px solid #f0f0f0; border-radius: 10px;
          background: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.18s, background 0.18s;
        }
        .vp-btn-heart:hover { border-color: #E74C3C; background: #fff5f5; }
        .vp-btn-heart.active { border-color: #E74C3C; background: #fff5f5; }
        .vp-btn-detail {
          flex: 1; padding: 9px 14px;
          background: linear-gradient(90deg, #C0392B, #e74c3c);
          color: #fff; font-size: 13px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          text-align: center; text-decoration: none;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.18s, transform 0.18s;
          box-shadow: 0 4px 12px rgba(192,57,43,0.28);
          font-family: inherit;
        }
        .vp-btn-detail:hover { opacity: 0.88; transform: translateY(-1px); }

        /* empty state when no results */
        .vp-empty {
          grid-column: 1/-1;
          padding: 64px 24px;
          text-align: center;
          color: #888;
        }
        .vp-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .vp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .vp-empty span { font-size: 13px; color: #aaa; }

        /* mobile responsive */
        @media (max-width: 640px) {
          .vp-hero { padding: 28px 16px 24px; }
          .vp-body { padding: 20px 16px 40px; }
          .vp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 380px) {
          .vp-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vp">
        {/* hero banner */}
        <section className="vp-hero">
          <div className="vp-hero-inner">
            <div className="vp-hero-eyebrow">🚗 Vehicles</div>
            <h1 className="vp-hero-title">Find Your Perfect <em>Ride</em> in Nepal</h1>
            <p className="vp-hero-sub">Verified bikes, cars & scooters — real prices, safe deals</p>

            {/* search bar and sort dropdown */}
            <div className="vp-bar">
              <div className="vp-search-wrap">
                <svg className="vp-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                  <path d="M16.5 16.5L21 21" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  className="vp-search"
                  placeholder="Search vehicles, brands, location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className="vp-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* main content area */}
        <div className="vp-body">
          <div className="vp-layout">

            {/* filter sidebar */}
            <aside className="vp-sidebar">
              <div className="vsf-head">
                <div className="vsf-head-left">
                  <p className="vsf-head-title">Filters</p>
                  {/* show badge if any filters are active */}
                  {(filterBrands.length + filterFuels.length + filterConds.length + (filterMinP ? 1 : 0) + (filterMaxP ? 1 : 0)) > 0 && (
                    <span className="vsf-badge">{filterBrands.length + filterFuels.length + filterConds.length + (filterMinP ? 1 : 0) + (filterMaxP ? 1 : 0)}</span>
                  )}
                </div>
                {/* clear all filters button */}
                <button className="vsf-clear" onClick={() => { setFilterBrands([]); setFilterFuels([]); setFilterConds([]); setFilterMinP(""); setFilterMaxP(""); }}>Clear all</button>
              </div>

              {/* brand checkboxes */}
              <div className="vsf-sec">
                <p className="vsf-sec-title">Brand</p>
                <div className="vsf-list">
                  {["Bajaj", "Honda", "Yamaha", "TVS", "Hero", "Suzuki", "Royal Enfield", "KTM"].map(b => (
                    <label key={b} className="vsf-row" onClick={() => setFilterBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b])}>
                      <span className={`vsf-box${filterBrands.includes(b) ? " on" : ""}`}>{filterBrands.includes(b) && <span className="vsf-check">✓</span>}</span>
                      {b}
                    </label>
                  ))}
                </div>
              </div>

              {/* price range inputs */}
              <div className="vsf-sec">
                <p className="vsf-sec-title">Price (NPR)</p>
                <div className="vsf-range">
                  <input className="vsf-input" type="number" placeholder="Min" value={filterMinP} onChange={e => setFilterMinP(e.target.value)} />
                  <input className="vsf-input" type="number" placeholder="Max" value={filterMaxP} onChange={e => setFilterMaxP(e.target.value)} />
                </div>
              </div>

              {/* fuel type checkboxes */}
              <div className="vsf-sec">
                <p className="vsf-sec-title">Fuel Type</p>
                <div className="vsf-list">
                  {["Petrol", "Electric", "Diesel", "Hybrid"].map(f => (
                    <label key={f} className="vsf-row" onClick={() => setFilterFuels(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])}>
                      <span className={`vsf-box${filterFuels.includes(f) ? " on" : ""}`}>{filterFuels.includes(f) && <span className="vsf-check">✓</span>}</span>
                      {f}
                    </label>
                  ))}
                </div>
              </div>

              {/* condition checkboxes */}
              <div className="vsf-sec">
                <p className="vsf-sec-title">Condition</p>
                <div className="vsf-list">
                  {["new", "used"].map(c => (
                    <label key={c} className="vsf-row" style={{ textTransform: "capitalize" }} onClick={() => setFilterConds(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])}>
                      <span className={`vsf-box${filterConds.includes(c) ? " on" : ""}`}>{filterConds.includes(c) && <span className="vsf-check">✓</span>}</span>
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              {/* km driven dropdown */}
              <div className="vsf-sec">
                <p className="vsf-sec-title">KM Driven</p>
                <select className="vsf-select" value={filterMaxKm} onChange={e => setFilterMaxKm(e.target.value)}>
                  <option value="">Any mileage</option>
                  <option value="5000">Under 5,000 km</option>
                  <option value="10000">Under 10,000 km</option>
                  <option value="25000">Under 25,000 km</option>
                  <option value="50000">Under 50,000 km</option>
                </select>
              </div>

              {/* TODO: filters don't actually work yet, need to wire up */}
              <button className="vsf-apply">Apply Filters</button>
            </aside>

            {/* right side - results count + cards grid */}
            <div>
              <div className="vp-results-bar">
                <p className="vp-results-text">
                  Showing <strong>{displayed.length}</strong> of <strong>{VEHICLES.length}</strong> vehicle{VEHICLES.length !== 1 ? "s" : ""}
                </p>
                <Link href="/" style={{ fontSize: 12, color: "#999", textDecoration: "none" }}>← Home</Link>
              </div>

              {/* vehicle cards */}
              <div className="vp-grid">
                {displayed.length === 0 ? (
                  <div className="vp-empty">
                    <div className="vp-empty-icon">🔍</div>
                    <p>No vehicles found</p>
                    <span>Try a different search term</span>
                  </div>
                ) : (
                  displayed.map((v) => {
                    const isFav = !!favorites[v.id];
                    // build class string for the card
                    const cardClass = ["vp-card", v.isFeatured ? "featured" : "", v.isSold ? "sold" : ""].filter(Boolean).join(" ");

                    return (
                      <div key={v.id} className={cardClass}>
                        {/* card image section */}
                        <div className="vp-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.image} alt={v.title} className="vp-img" />

                          {/* sold overlay - only shows if sold */}
                          {v.isSold && (
                            <div className="vp-sold-overlay">
                              <span className="vp-sold-stamp">SOLD</span>
                            </div>
                          )}

                          {/* featured badge - only shows if featured and not sold */}
                          {v.isFeatured && !v.isSold && (
                            <span className="vp-feat-badge">★ Featured</span>
                          )}

                          {/* heart button - saves to favorites */}
                          <button
                            className="vp-heart"
                            aria-label="Save"
                            onClick={(e) => toggleFav(v.id, e)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={isFav ? "#E74C3C" : "none"}>
                              <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
                                stroke={isFav ? "#E74C3C" : "#999"} strokeWidth="1.8" />
                            </svg>
                          </button>
                        </div>

                        {/* card info section */}
                        <div className="vp-body-card">
                          <p className="vp-card-title">{v.title}</p>

                          <p className="vp-price">{v.price}</p>

                          {/* location, km and year info */}
                          <div className="vp-info-row">
                            <span className="vp-info-item">
                              <svg width="10" height="12" viewBox="0 0 11 13" fill="none">
                                <path d="M5.5 0C3.015 0 1 2.015 1 4.5C1 7.875 5.5 13 5.5 13C5.5 13 10 7.875 10 4.5C10 2.015 7.985 0 5.5 0ZM5.5 6C4.672 6 4 5.328 4 4.5C4 3.672 4.672 3 5.5 3C6.328 3 7 3.672 7 4.5C7 5.328 6.328 6 5.5 6Z" fill="#aaa" />
                              </svg>
                              {v.location}
                            </span>
                            <span className="vp-info-item">🛣 {v.km}</span>
                            <span className="vp-info-item">📅 {v.year}</span>
                          </div>

                          {/* wishlist + view details buttons */}
                          <div className="vp-btn-row">
                            <button
                              className={`vp-btn-heart${isFav ? " active" : ""}`}
                              onClick={(e) => toggleFav(v.id, e)}
                              aria-label="Wishlist"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "#E74C3C" : "none"}>
                                <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
                                  stroke={isFav ? "#E74C3C" : "#aaa"} strokeWidth="1.8" />
                              </svg>
                            </button>
                            <Link href={`/listing/${v.id}`} className="vp-btn-detail">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>{/* end right col */}
          </div>{/* end vp-layout */}
        </div>{/* end vp-body */}

        <Footer />
      </div>
    </>
  );
}