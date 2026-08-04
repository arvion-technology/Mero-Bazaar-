"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiMapPin,
  FiHeart,
  FiCalendar,
  FiAward,
  FiFilter,
  FiX,
  FiChevronDown,
  FiCheck,
  FiClock,
  FiAlertTriangle,
  FiInbox,
} from "react-icons/fi";
import {
  FaStethoscope,
  FaUserMd,
  FaTooth,
  FaHeartbeat,
  FaSun,
  FaBaby,
  FaBone,
  FaFemale,
  FaBrain,
  FaHeadSideCough,
  FaNotesMedical,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { resolveImage } from "@/lib/adapters/shared";
import { SERVICE_TYPE_LABEL } from "@/lib/adapters/medicalAdapter";
import type { MedicalListing } from "@/app/types/medical";

const SPECIALTIES = Object.values(SERVICE_TYPE_LABEL);
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "fee_low", label: "Fee: Low to High" },
  { value: "fee_high", label: "Fee: High to Low" },
];

/* ---------- Specialty → Icon mapping ---------- */
const SPECIALTY_ICONS: Record<string, React.ElementType> = {
  "All": FaStethoscope,
  "General Medicine": FaUserMd,
  "Dental Care": FaTooth,
  "Cardiology": FaHeartbeat,
  "Dermatology": FaSun,
  "Pediatrics": FaBaby,
  "Orthopedics": FaBone,
  "Gynecology": FaFemale,
  "Neurology": FaBrain,
  "ENT": FaHeadSideCough,
  "Other": FaNotesMedical,
};

export default function MedicalPage() {
  const [listings, setListings] = useState<MedicalListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "fee_low" | "fee_high">("newest");
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  const [city, setCity] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getMedicalListings()
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load listings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setCity("");
    setActiveSpecialty("All");
    setAvailableOnly(false);
    setSearch("");
  };

  const displayed = listings
    .filter((l) => {
      const specialtyLabel = SERVICE_TYPE_LABEL[l.medical.serviceType];
      const matchSearch =
        !search ||
        l.medical.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        specialtyLabel.toLowerCase().includes(search.toLowerCase()) ||
        l.medical.city.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = activeSpecialty === "All" || specialtyLabel === activeSpecialty;
      const matchCity = !city || l.medical.city.toLowerCase() === city.toLowerCase();
      const matchAvail = !availableOnly || l.medical.sameDayBooking;
      return matchSearch && matchSpecialty && matchCity && matchAvail;
    })
    .sort((a, b) => {
      if (sort === "fee_low") return a.medical.appointmentFee - b.medical.appointmentFee;
      if (sort === "fee_high") return b.medical.appointmentFee - a.medical.appointmentFee;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const activeFiltersCount = [
    city,
    activeSpecialty !== "All" ? activeSpecialty : null,
    availableOnly ? "available" : null,
  ].filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .mp { background: #f2f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; }

        .mp-hero {
          position: relative; height: 280px; overflow: hidden;
          display: flex; align-items: center;
        }
        .mp-hero-bg {
          position: absolute; inset: 0;
          background: url('/medical banner.jpg') center center / cover no-repeat;
          filter: brightness(0.42);
        }
        .mp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(15,32,90,0.8) 0%, rgba(10,80,60,0.55) 100%);
        }
        .mp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .mp-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.28);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .mp-hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 6px; line-height: 1.15;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .mp-hero-title span { color: #5ef1c6; }
        .mp-hero-sub {
          color: rgba(255,255,255,0.78); font-size: 14px;
          margin: 0 0 22px; font-weight: 400;
        }
        .mp-search-wrap { position: relative; max-width: 520px; }
        .mp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .mp-search {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.97); border: none; border-radius: 14px;
          font-size: 14px; color: #333; font-family: inherit; outline: none;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22); transition: box-shadow 0.2s;
        }
        .mp-search:focus { box-shadow: 0 6px 34px rgba(0,0,0,0.3); }
        .mp-hero-watermark {
          position: absolute; bottom: -18px; right: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.05); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        .mp-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0;
        }
        .mp-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
        }
        .mp-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px; }
        .mp-cats-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .mp-cat-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 100px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          font-family: inherit; font-size: 12.5px; font-weight: 700; color: #444;
        }
        .mp-cat-chip:hover { border-color: #0d9488; background: #f0fdfa; }
        .mp-cat-chip.active { border-color: #0d9488; background: #0d9488; color: #fff; box-shadow: 0 4px 16px rgba(13,148,136,0.25); }

        .mp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .mp-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        .mp-sidebar {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #e4e8f0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          z-index: 90;
        }
        .msf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f4f8;
        }
        .msf-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .msf-reset {
          font-size: 13px; font-weight: 700; color: #0d9488;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .msf-reset:hover { opacity: 0.7; }
        .msf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f4f8; }
        .msf-section:last-of-type { border-bottom: none; }
        .msf-label { font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; }

        .msf-select-wrap { position: relative; }
        .msf-select-wrap > svg {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .msf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e4e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa; appearance: none; outline: none; cursor: pointer; transition: border-color 0.2s;
        }
        .msf-select:focus { border-color: #0d9488; }

        .msf-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .msf-toggle-label { font-size: 13.5px; font-weight: 600; color: #333; }
        .msf-toggle { position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-block; }
        .msf-toggle input { opacity: 0; width: 0; height: 0; }
        .msf-toggle-track { position: absolute; inset: 0; background: #ddd; border-radius: 24px; transition: background 0.25s; }
        .msf-toggle input:checked + .msf-toggle-track { background: #0d9488; }
        .msf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
        }
        .msf-toggle input:checked ~ .msf-toggle-thumb { transform: translateX(20px); }

        .msf-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 13px; text-align: center;
          background: linear-gradient(90deg, #0d9488, #0f766e);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(13,148,136,0.32);
          transition: opacity 0.18s, transform 0.18s;
        }
        .msf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        .mp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .mp-results-count { font-size: 14px; color: #666; font-weight: 500; }
        .mp-results-count strong { color: #111; font-weight: 800; }

        .mp-sort-dropdown { position: relative; display: inline-block; }
        .mp-sort-trigger {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333; background: #fff;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          cursor: pointer; display: flex; align-items: center; gap: 8px; min-width: 150px;
          position: relative;
        }
        .mp-sort-trigger > svg { position: absolute; right: 12px; }
        .mp-sort-menu {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: #fff; border: 1.5px solid #e0e4f0; border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100;
          min-width: 180px; overflow: hidden; display: flex; flex-direction: column;
        }
        .mp-sort-item {
          padding: 10px 14px; text-align: left; background: #fff; border: none;
          border-bottom: 1px solid #f2f4f8; font-size: 13px; font-weight: 600;
          color: #333; cursor: pointer; display: flex; align-items: center;
          justify-content: space-between; font-family: inherit; transition: background 0.15s;
        }
        .mp-sort-item:last-child { border-bottom: none; }
        .mp-sort-item:hover { background: #f0fdfa; }
        .mp-sort-item.active { background: #f0fdfa; color: #0d9488; }

        .mp-active-filters { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 6px; }
        .mp-active-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f0fdfa; color: #0d9488; border: 1.5px solid #ccfbf1;
          font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 8px;
        }
        .mp-active-tag button {
          background: none; border: none; cursor: pointer; display: flex; align-items: center;
          color: #0f766e; font-weight: 800; font-size: 10px;
        }
        .mp-active-tag button:hover { color: #115e59; }

        .mp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; }

        .mp-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #ececec;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05); cursor: pointer;
          padding: 20px;
        }
        .mp-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(0,0,0,0.12); border-color: #0d9488; }

        .mp-card-header {
          display: flex; gap: 16px; align-items: start;
        }

        .mp-img-wrap {
          position: relative; width: 88px; height: 88px; border-radius: 50%;
          overflow: hidden; background: #e8eaf0; flex-shrink: 0;
          border: 3px solid #f0fdfa; transition: border-color 0.22s;
        }
        .mp-card:hover .mp-img-wrap { border-color: #ccfbf1; }
        .mp-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .mp-heart {
          position: absolute; bottom: 0; right: 0;
          width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 1px solid #e4e8f0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: transform 0.18s, background 0.18s;
        }
        .mp-heart:hover { transform: scale(1.15); background: #f0fdfa; }

        .mp-info { flex: 1; min-width: 0; }
        .mp-specialty-badge {
          font-size: 10.5px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: inline-block;
        }
        .mp-title {
          font-size: 16px; font-weight: 800; color: #111; line-height: 1.3; margin: 0 0 4px;
        }
        .mp-badges {
          display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;
        }
        .mp-badge-verified {
          display: inline-flex; align-items: center; gap: 3px;
          background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf;
          font-size: 9.5px; font-weight: 700; padding: 1.5px 6px; border-radius: 20px;
        }
        .mp-badge-nmc {
          display: inline-flex; align-items: center; gap: 3px;
          background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
          font-size: 9.5px; font-weight: 700; padding: 1.5px 6px; border-radius: 20px;
        }

        .mp-rating-row {
          display: flex; align-items: center; gap: 12px; margin-top: 4px;
        }
        .mp-exp { font-size: 12px; color: #555; display: flex; align-items: center; gap: 4px; }

        .mp-details {
          margin-top: 12px; display: flex; flex-direction: column; gap: 6px;
        }
        .mp-detail-item {
          font-size: 13px; color: #555; display: flex; align-items: center; gap: 6px;
        }
        .mp-detail-item svg { color: #9ca3af; flex-shrink: 0; }

        .mp-languages {
          display: flex; gap: 4px; flex-wrap: wrap; margin-top: 2px;
        }
        .mp-lang-tag {
          font-size: 10px; font-weight: 600; color: #6b7280; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;
        }

        .mp-divider { border: none; border-top: 1px solid #f2f4f8; margin: 16px 0; }

        .mp-card-footer {
          display: flex; flex-direction: column; gap: 12px; margin-top: auto;
        }
        .mp-footer-row {
          display: flex; justify-content: space-between; align-items: center;
        }
        .mp-price-label { font-size: 11.5px; color: #888; margin: 0; }
        .mp-price-val { font-size: 18px; font-weight: 800; color: #111; margin: 0; }

        .mp-status-badges { display: flex; gap: 6px; }
        .mp-status-badge {
          font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 3px;
        }
        .mp-status-avail { background: #d1fae5; color: #065f46; }
        .mp-status-home { background: #e0f2fe; color: #075985; }

        .mp-book-btn {
          width: 100%; padding: 12px; text-align: center;
          background: #0d9488; color: #fff; font-size: 13.5px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 14px rgba(13,148,136,0.25); display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.15s, transform 0.15s;
        }
        .mp-book-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .mp-empty { grid-column: 1/-1; padding: 64px 24px; text-align: center; background: #fff; border-radius: 18px; border: 1.5px solid #ececec; }
        .mp-empty-icon { margin-bottom: 14px; display: flex; justify-content: center; }
        .mp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .mp-empty span { font-size: 13px; color: #aaa; }

        .mp-mobile-filter-bar { display: none; margin-bottom: 16px; }
        .mp-mobile-filter-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #fff; border: 1.5px solid #e4e8f0; border-radius: 12px;
          padding: 12px; font-size: 14px; font-weight: 700; color: #333; cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .mp-mobile-filter-badge {
          background: #0d9488; color: #fff; font-size: 11px; font-weight: 700;
          padding: 2px 7px; border-radius: 100px; margin-left: 2px;
        }

        @media (max-width: 960px) {
          .mp-layout { grid-template-columns: 1fr; }
          .mp-sidebar {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 2000;
            margin: 0;
            border-radius: 0;
            overflow-y: auto;
          }
          .mp-sidebar.show-mobile {
            display: block;
          }
          .mp-mobile-filter-bar { display: block; }
        }
        @media (max-width: 640px) {
          .mp-hero { height: 220px; }
          .mp-body { padding: 20px 16px 40px; }
          .mp-grid { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

      <div className="mp">
        <section className="mp-hero">
          <div className="mp-hero-bg" />
          <div className="mp-hero-overlay" />
          <div className="mp-hero-watermark">Medical</div>
          <div className="mp-hero-inner">
            <div className="mp-hero-tag">
              <FaStethoscope size={12} />
              Nepal&apos;s #1 Healthcare Directory
            </div>
            <h1 className="mp-hero-title">
              Find The Best<br />
              <span>Healthcare Services</span>
            </h1>
            <p className="mp-hero-sub">Trusted doctors and clinics near you</p>
            <div className="mp-search-wrap">
              <FiSearch className="mp-search-icon" size={18} color="#aaa" />
              <input
                className="mp-search"
                placeholder="Search doctors, specialties, cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="mp-cats-strip">
          <div className="mp-cats-inner">
            <p className="mp-cats-label">Specialties</p>
            <div className="mp-cats-row">
              {["All", ...SPECIALTIES].map((s) => {
                const Icon = SPECIALTY_ICONS[s] || FaStethoscope;
                return (
                  <button
                    key={s}
                    className={`mp-cat-chip${activeSpecialty === s ? " active" : ""}`}
                    onClick={() => setActiveSpecialty(s)}
                  >
                    <Icon size={14} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mp-body">
          <div className="mp-mobile-filter-bar">
            <button className="mp-mobile-filter-btn" onClick={() => setShowMobileFilters(true)}>
              <FiFilter size={16} />
              Filters {activeFiltersCount > 0 && <span className="mp-mobile-filter-badge">{activeFiltersCount}</span>}
            </button>
          </div>

          <div className="mp-layout">
            <aside className={`mp-sidebar ${showMobileFilters ? "show-mobile" : ""}`}>
              <div className="msf-head">
                <p className="msf-head-title">Filters</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button className="msf-reset" onClick={reset}>Reset All</button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
                  >
                    <FiX size={18} color="#666" />
                  </button>
                </div>
              </div>

              <div className="msf-section">
                <p className="msf-label">Location / City</p>
                <div className="msf-select-wrap">
                  <select className="msf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Select City</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <FiChevronDown size={14} color="#888" />
                </div>
              </div>

              <div className="msf-section">
                <p className="msf-label">Specialization</p>
                <div className="msf-select-wrap">
                  <select className="msf-select" value={activeSpecialty} onChange={(e) => setActiveSpecialty(e.target.value)}>
                    <option value="All">All Specialization</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <FiChevronDown size={14} color="#888" />
                </div>
              </div>

              <div className="msf-section">
                <div className="msf-toggle-row">
                  <span className="msf-toggle-label">Same-Day Booking</span>
                  <label className="msf-toggle">
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => setAvailableOnly(e.target.checked)}
                    />
                    <span className="msf-toggle-track" />
                    <span className="msf-toggle-thumb" />
                  </label>
                </div>
              </div>

              <button className="msf-apply" onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </button>
            </aside>

            <div>
              <div className="mp-results-bar">
                <div className="mp-results-count">
                  <span>
                    <strong>{displayed.length}</strong> results found
                  </span>
                  {(city || activeSpecialty !== "All" || availableOnly) && (
                    <div className="mp-active-filters">
                      {city && (
                        <span className="mp-active-tag">
                          {city} <button onClick={() => setCity("")}><FiX /></button>
                        </span>
                      )}
                      {activeSpecialty !== "All" && (
                        <span className="mp-active-tag">
                          {activeSpecialty} <button onClick={() => setActiveSpecialty("All")}><FiX /></button>
                        </span>
                      )}
                      {availableOnly && (
                        <span className="mp-active-tag">
                          Same-day <button onClick={() => setAvailableOnly(false)}><FiX /></button>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mp-sort-dropdown" ref={sortRef}>
                  <button className="mp-sort-trigger" onClick={() => setSortOpen(!sortOpen)}>
                    {SORT_OPTIONS.find(o => o.value === sort)?.label}
                    <FiChevronDown size={14} color="#555" />
                  </button>
                  {sortOpen && (
                    <div className="mp-sort-menu">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          className={`mp-sort-item${sort === opt.value ? " active" : ""}`}
                          onClick={() => { setSort(opt.value as typeof sort); setSortOpen(false); }}
                        >
                          {opt.label}
                          {sort === opt.value && <FiCheck size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mp-grid">
                {loading ? (
                  <div className="mp-empty">
                    <div className="mp-empty-icon"><FiClock size={48} color="#0d9488" /></div>
                    <p>Loading listings…</p>
                  </div>
                ) : error ? (
                  <div className="mp-empty">
                    <div className="mp-empty-icon"><FiAlertTriangle size={48} color="#e74c3c" /></div>
                    <p>Couldn&apos;t load listings</p>
                    <span>{error}</span>
                  </div>
                ) : displayed.length === 0 ? (
                  <div className="mp-empty">
                    <div className="mp-empty-icon"><FiInbox size={48} color="#0d9488" /></div>
                    <p>No results found</p>
                    <span>Try adjusting your filters or search query</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    const m = l.medical;
                    const specialtyLabel = SERVICE_TYPE_LABEL[m.serviceType];
                    const thumb = l.images?.[0] ? resolveImage(l.images[0]) : "/placeholder-avatar.png";
                    return (
                      <Link key={l.id} href={`/category/medical/${l.id}`} className="mp-card" style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="mp-card-header">
                          <div className="mp-img-wrap">
                            <img src={thumb} alt={m.doctorName} className="mp-img" />
                            <button className="mp-heart" aria-label="Save" onClick={(e) => toggleFav(l.id, e)}>
                              {isFav ? <FaHeartbeat size={14} color="#e74c3c" /> : <FiHeart size={14} color="#9ca3af" />}
                            </button>
                          </div>
                          <div className="mp-info">
                            <span className="mp-specialty-badge">{specialtyLabel}</span>
                            <h3 className="mp-title">{m.doctorName}</h3>
                            <div className="mp-badges">
                              {m.verificationStatus === "VERIFIED" && (
                                <span className="mp-badge-verified"><FiCheck size={10} strokeWidth={3} /> Verified</span>
                              )}
                              <span className="mp-badge-nmc">NMC NO. {m.nmcLicenseNumber}</span>
                            </div>
                            <div className="mp-rating-row">
                              {m.experience && (
                                <span className="mp-exp">
                                  <FiAward size={13} /> {m.experience}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mp-details">
                          <div className="mp-detail-item">
                            <FiMapPin size={14} />
                            <span>{m.clinicAddress}, {m.city}</span>
                          </div>
                          {m.languages?.length > 0 && (
                            <div className="mp-detail-item">
                              <div className="mp-languages">
                                {m.languages.map((lang) => (
                                  <span key={lang} className="mp-lang-tag">{lang}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <hr className="mp-divider" />

                        <div className="mp-card-footer">
                          <div className="mp-footer-row">
                            <div>
                              <p className="mp-price-label">Consultation Fee</p>
                              <p className="mp-price-val">NPR {m.appointmentFee.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="mp-status-badges">
                              {m.sameDayBooking && (
                                <span className="mp-status-badge mp-status-avail">
                                  <FiCheck size={10} strokeWidth={3} /> Same-Day
                                </span>
                              )}
                              {m.homeVisitAvailable && <span className="mp-status-badge mp-status-home">Home Visit</span>}
                            </div>
                          </div>

                          <div className="mp-book-btn">
                            <FiCalendar size={14} />
                            <span>View & Book</span>
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