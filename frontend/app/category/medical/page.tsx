"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiMapPin,
  FiHeart,
  FiChevronDown,
  FiCheckCircle,
  FiCalendar,
  FiStar,
  FiHome,
  FiClock,
  FiPhone,
  FiAward,
  FiFilter,
  FiX,
} from "react-icons/fi";

import {
  FaHeart, FaStethoscope, FaHospital, FaClinicMedical, FaPills, FaAmbulance, FaFlask
} from "react-icons/fa";

type MedicalListing = {
  id: string;
  name: string;
  specialty: string;
  type: string;
  rating: number;
  reviews: number;
  location: string;
  city: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  availableToday?: boolean;
};

const LISTINGS: MedicalListing[] = [
  {
    id: "dr-anisha-shah",
    name: "Dr. Anisha Shah",
    specialty: "Cardiologist",
    type: "Doctors",
    rating: 4.8,
    reviews: 120,
    location: "Lalitpur, Nepal",
    city: "Lalitpur",
    image: "/dr anisha.jpg",
    isVerified: true,
    isFeatured: true,
    availableToday: false,
  },
  {
    id: "norvic-international-hospital",
    name: "Norvic International Hospital",
    specialty: "Multi Speciality Hospital",
    type: "Hospitals",
    rating: 4.7,
    reviews: 98,
    location: "Kathmandu, Nepal",
    city: "Kathmandu",
    image: "/nervic.jpg",
    isVerified: true,
    isFeatured: false,
    availableToday: true,
  },
  {
    id: "om-diagnostic-center",
    name: "Om Diagnostic Center",
    specialty: "Diagnostic Center",
    type: "Diagnostic",
    rating: 4.6,
    reviews: 46,
    location: "Bhaktapur, Nepal",
    city: "Bhaktapur",
    image: "/daignostic centre.jpg",
    isVerified: false,
    isFeatured: false,
    availableToday: false,
  },
  {
    id: "dr-anisha-life-care",
    name: "Dr. Anisha Shah",
    specialty: "Life Care Physician",
    type: "Doctors",
    rating: 4.8,
    reviews: 54,
    location: "Balkumari, Lalitpur, Nepal",
    city: "Lalitpur",
    image: "/lady.jpg",
    isVerified: true,
    isFeatured: false,
    availableToday: true,
  },
  {
    id: "dental-checkup-clinic",
    name: "SmileCare Dental Clinic",
    specialty: "Dental Checkup & Cleaning",
    type: "Clinics",
    rating: 4.9,
    reviews: 87,
    location: "Kathmandu, Nepal",
    city: "Kathmandu",
    image: "/Dental Checkup & Cleaning.avif",
    isVerified: true,
    isFeatured: true,
    availableToday: true,
  },
  {
    id: "sunrise-medical-room",
    name: "Sunrise Medical Room",
    specialty: "General Medicine",
    type: "Clinics",
    rating: 4.5,
    reviews: 33,
    location: "Pokhara, Nepal",
    city: "Pokhara",
    image: "/medical room.jpg",
    isVerified: false,
    isFeatured: false,
    availableToday: false,
  },
];

const CATEGORIES = ["All", "Doctors", "Hospitals", "Clinics", "Diagnostic", "Pharmacy", "Ambulance"];
const SPECIALIZATIONS = [
  "All Specialization",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Dentist",
  "General Physician",
];
const SERVICE_TYPES = ["All", "Consultation", "Checkup", "Surgery", "Therapy", "Operation", "Others"];
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal"];

const CATEGORY_ICONS: Record<string, string> = {
  Doctors: "🩺",
  Hospitals: "🏥",
  Clinics: "🏠",
  Diagnostic: "🔬",
  Pharmacy: "💊",
  Ambulance: "🚑",
};

const CATEGORY_COUNTS: Record<string, number> = {
  Doctors: 1245,
  Hospitals: 567,
  Clinics: 245,
  Diagnostic: 345,
  Pharmacy: 445,
  Ambulance: 145,
};

export default function MedicalPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [city, setCity] = useState("");
  const [specialization, setSpecialization] = useState("All Specialization");
  const [serviceType, setServiceType] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setCity("");
    setSpecialization("All Specialization");
    setServiceType("All");
    setAvailableOnly(false);
    setActiveCategory("All");
  };

  const displayed = LISTINGS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.specialty.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || l.type === activeCategory;
    const matchCity = !city || l.city === city;
    const matchSpec =
      specialization === "All Specialization" ||
      l.specialty.toLowerCase().includes(specialization.toLowerCase());
    const matchService = serviceType === "All";
    const matchAvail = !availableOnly || l.availableToday;
    return matchSearch && matchCat && matchCity && matchSpec && matchService && matchAvail;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .mp { background: #f0f4f8; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .mp-hero {
          position: relative; height: 280px; overflow: hidden;
          display: flex; align-items: center;
        }
        .mp-hero-bg {
          position: absolute; inset: 0;
          background: url('/medical banner.jpg') center center / cover no-repeat;
          filter: brightness(0.48);
        }
        .mp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,100,80,0.75) 0%, rgba(0,50,100,0.55) 100%);
        }
        .mp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .mp-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .mp-hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 6px; line-height: 1.15;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .mp-hero-title span { color: #4fffb0; }
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

        /* ── POPULAR CATEGORIES STRIP ── */
        .mp-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea;
          padding: 18px 0;
        }
        .mp-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
        }
        .mp-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px; }
        .mp-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .mp-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s; text-decoration: none;
          min-width: 130px;
        }
        .mp-cat-card:hover { border-color: #0b8a6b; background: #f0faf7; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(11,138,107,0.12); }
        .mp-cat-card.active { border-color: #0b8a6b; background: #e6f7f3; box-shadow: 0 4px 16px rgba(11,138,107,0.2); }
        .mp-cat-icon { font-size: 22px; }
        .mp-cat-info {}
        .mp-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .mp-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY ── */
        .mp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .mp-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        /* ── SIDEBAR ── */
        .mp-sidebar {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #e8ecf0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .msf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f4f8;
        }
        .msf-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .msf-reset {
          font-size: 13px; font-weight: 700; color: #0b8a6b;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .msf-reset:hover { opacity: 0.7; }
        .msf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f4f8; }
        .msf-section:last-of-type { border-bottom: none; }
        .msf-label { font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; }

        .msf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e4e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer; transition: border-color 0.2s;
        }
        .msf-select:focus { border-color: #0b8a6b; }

        .msf-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .msf-chip {
          padding: 6px 13px; border-radius: 100px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e0e8e4; background: #fff; color: #555;
          cursor: pointer; transition: all 0.18s;
        }
        .msf-chip:hover { border-color: #0b8a6b; color: #0b8a6b; }
        .msf-chip.active { background: #0b8a6b; color: #fff; border-color: #0b8a6b; box-shadow: 0 2px 10px rgba(11,138,107,0.3); }

        .msf-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .msf-toggle-label { font-size: 13.5px; font-weight: 600; color: #333; }
        .msf-toggle { position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-block; }
        .msf-toggle input { opacity: 0; width: 0; height: 0; }
        .msf-toggle-track {
          position: absolute; inset: 0;
          background: #ddd; border-radius: 24px; transition: background 0.25s;
        }
        .msf-toggle input:checked + .msf-toggle-track { background: #0b8a6b; }
        .msf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
        }
        .msf-toggle input:checked ~ .msf-toggle-thumb { transform: translateX(20px); }

        .msf-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 13px; text-align: center;
          background: linear-gradient(90deg, #0b8a6b, #056b52);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(11,138,107,0.32);
          transition: opacity 0.18s, transform 0.18s;
        }
        .msf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RESULTS BAR ── */
        .mp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .mp-results-count { font-size: 14px; color: #666; font-weight: 500; }
        .mp-sort-select {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e8e4; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: border-color 0.2s;
        }
        .mp-sort-select:focus { border-color: #0b8a6b; }

        /* ── GRID ── */
        .mp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

        /* ── CARD ── */
        .mp-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #ececec;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05); cursor: pointer;
        }
        .mp-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(0,0,0,0.13); }
        .mp-img-wrap {
          position: relative; width: 100%; aspect-ratio: 16/9;
          overflow: hidden; background: #e8f0ed;
        }
        .mp-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.32s ease; }
        .mp-card:hover .mp-img { transform: scale(1.06); }

        .mp-heart {
          position: absolute; top: 9px; right: 9px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.94); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.16);
          transition: transform 0.18s, background 0.18s;
        }
        .mp-heart:hover { transform: scale(1.18); background: #fff; }

        .mp-badges {
          position: absolute; top: 9px; left: 9px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .mp-badge-verified {
          display: inline-flex; align-items: center; gap: 3px;
          background: #eafaf5; color: #0b8a6b; border: 1px solid #a8dfcf;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .mp-badge-featured {
          display: inline-flex; align-items: center; gap: 3px;
          background: #fff8e1; color: #b7950b; border: 1px solid #f9e79f;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .mp-badge-avail {
          display: inline-flex; align-items: center; gap: 3px;
          background: #eafaf5; color: #0b8a6b; border: 1px solid #a8dfcf;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }

        .mp-card-body { padding: 15px 16px 16px; display: flex; flex-direction: column; gap: 5px; }
        .mp-card-name { font-size: 15px; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin: 0; }
        .mp-card-specialty { font-size: 13px; font-weight: 600; color: #0b8a6b; margin: 0; }
        .mp-card-rating {
          display: flex; align-items: center; gap: 5px; margin-top: 2px;
        }
        .mp-card-stars { color: #f5a623; font-size: 13px; }
        .mp-card-rating-num { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .mp-card-reviews { font-size: 12px; color: #aaa; }
        .mp-card-location { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .mp-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px; padding-top: 10px; border-top: 1px solid #f2f5f3;
        }
        .mp-card-avail-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 700; color: #0b8a6b;
        }
        .mp-card-avail-dot { width: 7px; height: 7px; border-radius: 50%; background: #0b8a6b; display: inline-block; animation: mp-pulse 1.5s infinite; }
        @keyframes mp-pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .mp-card-view {
          font-size: 12px; font-weight: 700; color: #0b8a6b;
          background: #e6f7f3; border: none; border-radius: 8px;
          padding: 6px 14px; cursor: pointer; font-family: inherit;
          transition: background 0.18s; text-decoration: none;
        }
        .mp-card-view:hover { background: #c7efe4; }

        /* ── EMPTY ── */
        .mp-empty { grid-column: 1/-1; padding: 64px 24px; text-align: center; color: #888; }
        .mp-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .mp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .mp-empty span { font-size: 13px; color: #aaa; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) { .mp-layout { grid-template-columns: 1fr; } .mp-sidebar { display: none; } }
        @media (max-width: 640px) { .mp-hero { height: 220px; } .mp-body { padding: 20px 16px 40px; } .mp-grid { grid-template-columns: 1fr; gap: 12px; } .mp-cats-row { gap: 8px; } .mp-cat-card { min-width: 110px; padding: 8px 12px; } }
      `}</style>

      <div className="mp">
        {/* ── HERO ── */}
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
              <span>HealthCare Services</span>
            </h1>
            <p className="mp-hero-sub">Trusted doctors, clinics, hospitals and medical services near you</p>
            <div className="mp-search-wrap">
              <FiSearch className="mp-search-icon" size={18} color="#aaa" />
              <input
                className="mp-search"
                placeholder="Search doctors, clinics, hospitals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── POPULAR CATEGORIES STRIP ── */}
        <section className="mp-cats-strip">
          <div className="mp-cats-inner">
            <p className="mp-cats-label">Popular Categories</p>
            <div className="mp-cats-row">
              {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                <button
                  key={cat}
                  className={`mp-cat-card${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{ border: "none" }}
                >
                  <span className="mp-cat-icon">{icon}</span>
                  <span className="mp-cat-info">
                    <span className="mp-cat-name">{cat}</span>
                    <span className="mp-cat-count">{CATEGORY_COUNTS[cat].toLocaleString()} listings</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN BODY ── */}
        <div className="mp-body">
          <div className="mp-layout">
            {/* ── SIDEBAR ── */}
            <aside className="mp-sidebar">
              <div className="msf-head">
                <p className="msf-head-title">Filters</p>
                <button className="msf-reset" onClick={reset}>Reset</button>
              </div>

              <div className="msf-section">
                <p className="msf-label">Location / City</p>
                <select className="msf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select City</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="msf-section">
                <p className="msf-label">Specialization</p>
                <select className="msf-select" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                  {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="msf-section">
                <p className="msf-label">Service Today</p>
                <div className="msf-chips">
                  {SERVICE_TYPES.map((s) => (
                    <button
                      key={s}
                      className={`msf-chip${serviceType === s ? " active" : ""}`}
                      onClick={() => setServiceType(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="msf-section">
                <div className="msf-toggle-row">
                  <span className="msf-toggle-label">Available Today</span>
                  <label className="msf-toggle">
                    <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
                    <span className="msf-toggle-track" />
                    <span className="msf-toggle-thumb" />
                  </label>
                </div>
              </div>

              <button className="msf-apply">Apply Filters</button>
            </aside>

            {/* ── RIGHT COLUMN ── */}
            <div>
              <div className="mp-results-bar">
                <span className="mp-results-count">
                  <strong>{displayed.length}</strong> results found
                </span>
                <select className="mp-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="mp-grid">
                {displayed.length === 0 ? (
                  <div className="mp-empty">
                    <div className="mp-empty-icon">🏥</div>
                    <p>No results found</p>
                    <span>Try adjusting your filters or search query</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    return (
                      <Link key={l.id} href={`/category/medical/${l.id}`} className="mp-card">
                        <div className="mp-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.image} alt={l.name} className="mp-img" />
                          <div className="mp-badges">
                            {l.isVerified && <span className="mp-badge-verified">✓ Verified</span>}
                            {l.isFeatured && <span className="mp-badge-featured">⭐ Featured</span>}
                          </div>
                           {l.languages && (
                            <div className="mp-detail-item">
                              <FiPhone size={13} style={{ transform: "rotate(90deg)" }} />
                              <div className="mp-languages">
                                {l.languages.map((lang) => (
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
                              <p className="mp-price-val">{l.consultationFee}</p>
                            </div>
                            <div className="mp-status-badges">
                              {l.availableToday && <span className="mp-status-badge mp-status-avail">✓ Available Today</span>}
                              {l.type === "Doctors" && <span className="mp-status-badge mp-status-home">Home Visit</span>}
                            </div>
                          </div>

                          {/* Time Slots */}
                          <div className="mp-slots-grid">
                            {TIME_SLOTS.map((slot) => (
                              <div
                                key={slot.time}
                                className={`mp-slot-btn${slot.selected ? " selected" : ""}`}
                              >
                                <div>{slot.time}</div>
                                <div style={{ fontSize: "9px", opacity: 0.8 }}>{slot.period}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mp-card-footer">
                            {l.availableToday ? (
                              <span className="mp-card-avail-tag">
                                <span className="mp-card-avail-dot" />
                                Available Today
                              </span>
                            ) : (
                              <span style={{ fontSize: "11px", color: "#bbb" }}>By Appointment</span>
                            )}
                            <span className="mp-card-view">Learn More →</span>
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
