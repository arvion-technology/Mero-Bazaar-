"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiHeart,
  FiMapPin,
  FiChevronDown,
  FiZap,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { BsCalendar3, BsShieldCheck, BsArrowRight } from "react-icons/bs";
import { MdOutlineSwapHoriz } from "react-icons/md";

type Badge = { label: string; color: string; bg: string };
type Vehicle = {
  id: string;
  title: string;
  price: string;
  location: string;
  images: string[];
  latitude?: number;
  longitude?: number;

  vehicle: {
    brand: string;
    model: string;
    type: string;
    condition: string;
    fuel_type: string;
    year: number;
    km_driven: number;
    bluebook_status?: string;
  };
};

const EV_FEATURED = {
  id: "electric-scooter",
  price: "NPR 4,20,000",
  range: "150 KM",
  charging: "Fast Charging",
  image: "/Scooter.jpg",
  badge: "Bluebook Verified",
};

const PRICE_RANGES = [
  { label: "0–250K", min: 0, max: 250000 },
  { label: "250–500K", min: 250000, max: 500000 },
  { label: "500–750K", min: 500000, max: 750000 },
  { label: "750K–1M", min: 750000, max: 1000000 },
  { label: "1M+", min: 1000000, max: 200000000 },
];

export default function VehiclesPage() {
  const [brands, setBrands] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCat, setActiveCat] = useState("All Vehicles");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/vehicles");
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();

        setVehicles(json.data || []);
        setBrands(json.filters?.brands || []);
        setConditions(json.filters?.conditions || []);
        setFuelTypes(json.filters?.fuelTypes || []);
        setCategories(["All Vehicles", ...(json.filters?.categories || [])]);

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const generateBadges = (v: Vehicle) => {
  const vehicle = v.vehicle;
  const badges: { label: string; type: "green" | "blue" | "orange" | "gray" }[] = [];

  if (vehicle?.bluebook_status === "verified") {badges.push({ label: "Bluebook Verified", type: "green" });}
  if (vehicle?.fuel_type) {badges.push({label: vehicle.fuel_type.toUpperCase(),type: vehicle.fuel_type === "electric" ? "green" : "blue",});}
  return badges;
  };

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRanges([]);
    setSelectedConditions([]);
    setSelectedFuels([]);
    setActiveCat("All Vehicles");
    setSearch("");
  };

const displayed = vehicles.filter((v) => {
  const s = search.toLowerCase();
  const vehicle = v.vehicle;
  if (s && !v.title.toLowerCase().includes(s) && !vehicle.brand.toLowerCase().includes(s)) return false;
  if (activeCat !== "All Vehicles" && vehicle.type !== activeCat.toLowerCase()) return false;
  if (selectedBrands.length && !selectedBrands.includes(vehicle.brand)) return false;
  if (selectedConditions.length && !selectedConditions.map((c) => c.toLowerCase()).includes(vehicle.condition.toLowerCase())) return false;
  if (selectedFuels.length && !selectedFuels.map((f) => f.toLowerCase()).includes(vehicle.fuel_type.toLowerCase())) return false;

  const price =typeof v.price === "number" ? v.price: parseInt(String(v.price).replace(/[^\d]/g, ""));

  if (selectedPriceRanges.length) {
    const match = selectedPriceRanges.some((lbl) => {
      const r = PRICE_RANGES.find((x) => x.label === lbl);
      return r ? price >= r.min && price <= r.max : false;});
    if (!match) return false;
  }
  return true;

}).sort((a, b) => { const getPrice = (p: number | string ) =>typeof p === "number" ? p : parseInt(String(p).replace(/[^\d]/g, ""));
  if (sort === "price_asc")return getPrice(a.price) - getPrice(b.price);
  if (sort === "price_desc")return getPrice(b.price) - getPrice(a.price);
  return 0;
});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .vp-wrap { background: #f2f4f7; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .vp-hero {
          position: relative; height: 280px; overflow: hidden;
          display: flex; align-items: center;
        }
        .vp-hero-bg {
          position: absolute; inset: 0;
          background: url('/car of hero section.jpg') center center / cover no-repeat;
          filter: brightness(0.42);
        }
        .vp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(185,28,28,0.78) 0%, rgba(31,41,55,0.6) 100%);
        }
        .vp-hero-wm {
          position: absolute; bottom: -18px; left: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.05); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }
        .vp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto; padding: 0 28px; width: 100%;
        }
        .vp-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 12px;
        }
        .vp-breadcrumb span.active { color: #fff; font-weight: 600; }
        .vp-hero h1 {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 6px; line-height: 1.15;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .vp-hero p { color: rgba(255,255,255,0.78); font-size: 14px; margin: 0 0 22px; }
        .vp-search-wrap { position: relative; max-width: 520px; }
        .vp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .vp-search {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.97); border: none; border-radius: 14px;
          font-size: 14px; color: #333; outline: none;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22);
          font-family: inherit; transition: box-shadow 0.2s;
        }
        .vp-search:focus { box-shadow: 0 6px 34px rgba(0,0,0,0.3); }

        /* ── TAB BAR ── */
        .vp-tabs-bar {
          background: #fff; border-bottom: 1.5px solid #eaeaea;
          position: sticky; top: 0; z-index: 30;
        }
        .vp-tabs-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
          display: flex; overflow-x: auto; gap: 8px;
          scrollbar-width: none;
        }
        .vp-tabs-inner::-webkit-scrollbar { display: none; }
        .vp-tab {
          flex-shrink: 0; padding: 16px 22px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          border: none; background: none; font-family: inherit;
          border-bottom: 3px solid transparent;
          color: #666; white-space: nowrap;
          transition: all 0.18s;
        }
        .vp-tab:hover { color: #111; }
        .vp-tab.active { color: #b91c1c; border-bottom-color: #b91c1c; }

        /* ── BODY ── */
        .vp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .vp-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        /* ── SIDEBAR ── */
        .vp-sidebar {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #e4e8f0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .vsb-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f4f8;
        }
        .vsb-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .vsb-reset {
          font-size: 13px; font-weight: 700; color: #b91c1c;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .vsb-reset:hover { opacity: 0.7; }

        .vsb-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f4f8; }
        .vsb-section:last-of-type { border-bottom: none; }
        .vsb-section-title {
          font-size: 11.5px; font-weight: 700; color: #888;
          text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px;
        }
        
        .vsb-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .vsb-chip {
          padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e0e4f0; background: #fff; color: #555;
          cursor: pointer; transition: all 0.18s; font-family: inherit;
        }
        .vsb-chip:hover { border-color: #b91c1c; color: #b91c1c; }
        .vsb-chip.active { background: #b91c1c; color: #fff; border-color: #b91c1c; box-shadow: 0 2px 10px rgba(185,28,28,0.3); }

        .vsb-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .vsb-price-chip {
          display: flex; align-items: center; justify-content: center;
          padding: 8px; border-radius: 10px; cursor: pointer;
          border: 1.5px solid #e8e8f0; font-size: 12px; font-weight: 600;
          color: #555; background: #fafafa; transition: all 0.15s;
          text-align: center; font-family: inherit;
        }
        .vsb-price-chip:hover { border-color: #b91c1c; }
        .vsb-price-chip.active { border-color: #b91c1c; background: #fef2f2; color: #b91c1c; }

        .vsb-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 13px; text-align: center;
          background: linear-gradient(90deg, #b91c1c, #991b1b);
          color: #fff; font-size: 14px; font-weight: 800; border: none;
          border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(185,28,28,0.32);
          transition: opacity 0.18s, transform 0.18s;
        }
        .vsb-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RIGHT COLUMN ── */
        .vp-right { flex: 1; min-width: 0; }
        .vp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .vp-count { font-size: 14px; color: #666; font-weight: 500; }
        .vp-count strong { color: #111; font-weight: 800; }
        .vp-sort-wrap { position: relative; }
        .vp-sort {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: border-color 0.2s;
        }
        .vp-sort:focus { border-color: #b91c1c; }

        /* ── CARD GRID ── */
        .vp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 18px;
        }

        /* ── CARD ── */
        .vp-card {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #ececec; overflow: hidden;
          text-decoration: none; color: inherit;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          position: relative;
        }
        .vp-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(0,0,0,0.12); }
        
        .vp-card-img-wrap {
          position: relative; width: 100%;
          aspect-ratio: 16/11; overflow: hidden; background: #e8eaf0;
        }
        .vp-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.32s ease;
        }
        .vp-card:hover .vp-card-img { transform: scale(1.06); }
        
        .vp-card-cat {
          position: absolute; top: 9px; left: 9px;
          background: rgba(0,0,0,0.52); color: #fff;
          font-size: 10px; font-weight: 700; border-radius: 100px;
          padding: 3px 9px; backdrop-filter: blur(4px);
        }
        .vp-heart {
          position: absolute; top: 9px; right: 9px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.94); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.16);
          transition: transform 0.18s; z-index: 3;
          padding: 0;
        }
        .vp-heart:hover { transform: scale(1.18); background: #fff; }

        .vp-card-body { padding: 14px; display: flex; flex-direction: column; gap: 5px; }
        .vp-card-title {
          font-size: 14.5px; font-weight: 700; color: #1a1a1a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0;
        }
        .vp-card-price { font-size: 16px; font-weight: 900; color: #b91c1c; margin: 2px 0 4px; }
        .vp-card-meta {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #777; font-weight: 500;
        }
        .vp-card-meta-sep { width: 1px; height: 12px; background: #e2e8f0; }
        .vp-card-meta span { display: flex; align-items: center; gap: 3px; }
        .vp-card-badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
        
        .vp-badge {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 3px 8px; border-radius: 6px;
          font-size: 9.5px; font-weight: 700;
        }

        /* ── EV SECTION ── */
        .vp-ev { margin-top: 28px; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1.5px solid #eaeaea; }
        .vp-ev-header {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 20px;
          background: linear-gradient(90deg, #16a34a, #15803d);
        }
        .vp-ev-header-title { font-size: 16px; font-weight: 800; color: #fff; }
        .vp-ev-header-sub { margin-left: auto; font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 600; }
        .vp-ev-body { display: flex; background: #fff; }
        .vp-ev-info { padding: 22px; flex: 0 0 42%; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }
        .vp-ev-price { font-size: 26px; font-weight: 900; color: #111; margin: 0; }
        .vp-ev-divider { width: 40px; height: 2.5px; background: #16a34a; margin: 4px 0; }
        .vp-ev-spec { font-size: 13.5px; color: #444; font-weight: 600; display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
        .vp-ev-spec svg { color: #16a34a; }
        .vp-ev-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;
          font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 8px;
        }
        .vp-ev-link {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 13px; font-weight: 700; color: #16a34a;
          text-decoration: none; margin-top: 8px; transition: color 0.2s;
        }
        .vp-ev-link:hover { color: #15803d; }
        .vp-ev-img-wrap { flex: 1; position: relative; overflow: hidden; min-height: 210px; }
        .vp-ev-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

        /* responsive */
        @media (max-width: 960px) {
          .vp-layout { grid-template-columns: 1fr; }
          .vp-sidebar { display: none; }
          .vp-ev-body { flex-direction: column; }
          .vp-ev-img-wrap { min-height: 180px; }
        }
        @media (max-width: 640px) {
          .vp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .vp-body { padding: 20px 16px 40px; }
          .vp-hero { height: 220px; }
        }
        @media (max-width: 380px) {
          .vp-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vp-wrap">

        {/* ── HERO ── */}
        <section className="vp-hero">
          <div className="vp-hero-bg" />
          <div className="vp-hero-overlay" />
          <div className="vp-hero-wm">Vehicles</div>
          <div className="vp-hero-inner">
            <div className="vp-breadcrumb">
              <span>Home</span>
              <FiChevronDown size={10} style={{ transform: "rotate(-90deg)" }} />
              <span className="active">Vehicles</span>
            </div>
            <h1>Vehicles in Nepal</h1>
            <p>Find the best cars, bikes, scooters and more across Nepal</p>
            <div className="vp-search-wrap">
              <FiSearch className="vp-search-icon" size={17} color="#bbb" />
              <input
                className="vp-search"
                placeholder="Search by name, brand, location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── TAB BAR ── */}
        <div className="vp-tabs-bar">
          <div className="vp-tabs-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`vp-tab${activeCat === cat ? " active" : ""}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="vp-body">
          <div className="vp-layout">

            {/* ── SIDEBAR ── */}
            <aside className="vp-sidebar">
              <div className="vsb-head">
                <span className="vsb-head-title">Filters</span>
                <button className="vsb-reset" onClick={resetFilters}>Reset All</button>
              </div>

              {/* Brand */}
              <div className="vsb-section">
                <p className="vsb-section-title">Brand</p>
                <div className="vsb-chips">
                  {brands.map((b) => (
                    <button
                      key={b}
                      className={`vsb-chip${selectedBrands.includes(b) ? " active" : ""}`}
                      onClick={() => toggle(selectedBrands, b, setSelectedBrands)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="vsb-section">
                <p className="vsb-section-title">Price Range</p>
                <div className="vsb-price-grid">
                  {PRICE_RANGES.map((r) => (
                    <button
                      key={r.label}
                      className={`vsb-price-chip${selectedPriceRanges.includes(r.label) ? " active" : ""}`}
                      onClick={() => toggle(selectedPriceRanges, r.label, setSelectedPriceRanges)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div className="vsb-section">
                <p className="vsb-section-title">Year</p>
                <div className="vsb-chips">
                  <button className="vsb-chip active">
                    2020–2026
                  </button>
                </div>
              </div>

              {/* Condition */}
              <div className="vsb-section">
                <p className="vsb-section-title">Condition</p>
                <div className="vsb-chips">
                  {conditions.map((c) => (
                    <button
                      key={c}
                      className={`vsb-chip${selectedConditions.includes(c) ? " active" : ""}`}
                      onClick={() => toggle(selectedConditions, c, setSelectedConditions)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="vsb-section">
                <p className="vsb-section-title">Fuel Type</p>
                <div className="vsb-chips">
                  {fuelTypes.map((f) => (
                    <button
                      key={f}
                      className={`vsb-chip${selectedFuels.includes(f) ? " active" : ""}`}
                      onClick={() => toggle(selectedFuels, f, setSelectedFuels)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button className="vsb-apply">Apply Filters</button>
            </aside>

            {/* ── RIGHT ── */}
            <div className="vp-right">
              {/* Results bar */}
              <div className="vp-results-bar">
                <span className="vp-count">
                  <strong>{displayed.length}</strong> vehicles found
                </span>
                <div className="vp-sort-wrap">
                  <select
                    className="vp-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                  </select>
                </div>
              </div>

              {/* Cards */}
              {displayed.length === 0 ? (
                <div className="vp-empty">
                  <div className="vp-empty-icon">🔍</div>
                  <p>No vehicles found</p>
                  <span style={{ fontSize: 13, color: "#888" }}>Try adjusting your filters or search term</span>
                </div>
              ) : (
                <>
                  <div className="vp-grid">
                    {displayed.map((v) => {
                      const isFav = !!favorites[v.id];
                      const vehicle = v.vehicle;

                      return (
                        <Link key={v.id} href={`/category/vehicles/${v.id}`} className="vp-card">
                          {/* Image */}
                          <div className="vp-card-img-wrap">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={v.images?.[0] || "/placeholder.png"} alt={v.title} className="vp-card-img" />
                            <span className="vp-card-cat">{vehicle.type}</span>
                            <button className="vp-heart" aria-label="Save" onClick={(e) => toggleFav(v.id, e)}>
                              {isFav
                                ? <FaHeart size={13} color="#b91c1c" />
                                : <FiHeart size={13} color="#999" />}
                            </button>
                          </div>

                          {/* Body */}
                          <div className="vp-card-body">
                            <p className="vp-card-title">{v.title}</p>
                            <p className="vp-card-price">{v.price}</p>

                            {/* Meta */}
                            <div className="vp-card-meta">
                              <span><IoSpeedometerOutline size={12} /> {vehicle.km_driven}</span>
                              <span className="vp-card-meta-sep" />
                              <span><BsCalendar3 size={11} /> {vehicle.year}</span>
                              <span className="vp-card-meta-sep" />
                            <span
                              style={{ cursor: "pointer", color: "#2563eb" }}
                              onClick={(e) => {
                                e.preventDefault();
                                if (v.latitude == null || v.longitude == null) return;

                                window.open(
                                  `https://www.google.com/maps?q=${v.latitude},${v.longitude}`,
                                  "_blank"
                                );
                              }}
                            >
                              <FiMapPin size={11} /> View on map
                            </span>            
                            </div>

                            {/* Badges */}
                            <div className="vp-card-badges">
                              {generateBadges(v).map((b) => {
                                const colorMap = {
                                  green: {bg: "#d1fae5",color: "#065f46",border: "1px solid #a7f3d0"},                                    
                                  blue: {bg: "#dbeafe",color: "#1e40af",border: "1px solid #bfdbfe"},
                                  orange: {bg: "#fef3c7",color: "#92400e",border: "1px solid #fde68a"},
                                 gray: {bg: "#f1f3f5",color: "#374151",border: "1px solid #e5e7eb"},
                                };
                                const style = colorMap[b.type || "gray"];

                                return (
                                  <span key={b.label} className="vp-badge" style={{ background: style.bg,color: style.color,border: style.border}}>
                                    <BsShieldCheck size={9} style={{ marginRight: "3px" }} />
                                    {b.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}