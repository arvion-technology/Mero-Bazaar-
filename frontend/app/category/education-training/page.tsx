"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiSearch, FiMapPin, FiHeart } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { MdSchool } from "react-icons/md";

type EducationListing = {
  id: string;
  name: string;
  category: string;
  type: string;
  rating: number;
  reviews: number;
  location: string;
  city: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  admissionOpen?: boolean;
  enrolled?: number;
  level?: string;
};

const LISTINGS: EducationListing[] = [
  {
    id: "greenfield-international-school",
    name: "Greenfield International School",
    category: "School - Grades 1-12",
    type: "School",
    rating: 4.4,
    reviews: 120,
    location: "Sanepa, Lalitpur, Nepal",
    city: "Lalitpur",
    image: "/school.jpg",
    isVerified: true,
    isFeatured: true,
    admissionOpen: true,
    level: "School",
  },
  {
    id: "kathmandu-model-college",
    name: "Kathmandu Model College (+2 Management)",
    category: "School - +2",
    type: "College",
    rating: 4.8,
    reviews: 120,
    location: "Baneshwor, Kathmandu, Nepal",
    city: "Kathmandu",
    image: "/kathmandu.jpg",
    isVerified: true,
    isFeatured: false,
    admissionOpen: true,
    level: "College",
  },
  {
    id: "bright-future-tuition",
    name: "Bright Future Tuition Center",
    category: "School - Grades 1-12",
    type: "Tuition/Classes",
    rating: 4.8,
    reviews: 120,
    location: "Teku, Kathmandu, Nepal",
    city: "Kathmandu",
    image: "/bright.jpg",
    isVerified: true,
    isFeatured: false,
    admissionOpen: false,
    level: "School",
  },
  {
    id: "python-programming-course",
    name: "Python Programming Complete Course",
    category: "School - Grades 1-12",
    type: "Online Courses",
    rating: 4.8,
    reviews: 120,
    location: "Bhaktapur, Nepal",
    city: "Bhaktapur",
    image: "/python.jpg",
    isVerified: true,
    isFeatured: false,
    admissionOpen: false,
    enrolled: 1200,
    level: "Training",
  },
  {
    id: "nepal-engineering-college",
    name: "Nepal Engineering College",
    category: "Bachelor's Degree",
    type: "College",
    rating: 4.6,
    reviews: 98,
    location: "Changunarayan, Bhaktapur, Nepal",
    city: "Bhaktapur",
    image: "/education.jpg",
    isVerified: true,
    isFeatured: true,
    admissionOpen: true,
    level: "College",
  },
  {
    id: "pokhara-coaching-center",
    name: "Pokhara Coaching Center",
    category: "Entrance Preparation",
    type: "Coaching Center",
    rating: 4.5,
    reviews: 65,
    location: "Lakeside, Pokhara, Nepal",
    city: "Pokhara",
    image: "/bright.jpg",
    isVerified: false,
    isFeatured: false,
    admissionOpen: true,
    level: "Training",
  },
];

const CATEGORIES = ["All", "School", "College", "Tuition/Classes", "Online Courses", "Coaching Center", "Training Institute"];
const LEVELS = ["All Levels", "Pre-School", "School", "College", "+2", "Bachelor's", "Master's", "Training"];
const EDUCATION_TYPES = ["All", "School", "College", "Coaching Center", "Tuition/Classes", "Online Courses", "Others"];
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal"];

const CATEGORY_ICONS: Record<string, string> = {
  School: "🏫",
  College: "🎓",
  "Tuition/Classes": "📚",
  "Online Courses": "💻",
  "Training Institute": "🏆",
  "Study Abroad": "✈️",
};

const CATEGORY_COUNTS: Record<string, number> = {
  School: 1245,
  College: 567,
  "Tuition/Classes": 245,
  "Online Courses": 345,
  "Training Institute": 445,
  "Study Abroad": 145,
};

export default function EducationPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("All Levels");
  const [educationType, setEducationType] = useState("All");
  const [admissionOnly, setAdmissionOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setCity("");
    setLevel("All Levels");
    setEducationType("All");
    setAdmissionOnly(false);
    setActiveCategory("All");
  };

  const displayed = LISTINGS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || l.type === activeCategory;
    const matchCity = !city || l.city === city;
    const matchLevel = level === "All Levels" || l.level?.toLowerCase().includes(level.toLowerCase());
    const matchType = educationType === "All";
    const matchAdmission = !admissionOnly || l.admissionOpen;
    return matchSearch && matchCat && matchCity && matchLevel && matchType && matchAdmission;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ep { background: #f0f4f8; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .ep-hero {
          position: relative; height: 280px; overflow: hidden;
          display: flex; align-items: center;
        }
        .ep-hero-bg {
          position: absolute; inset: 0;
          background: url('/education.jpg') center center / cover no-repeat;
          filter: brightness(0.45);
        }
        .ep-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(67,56,202,0.8) 0%, rgba(139,92,246,0.55) 100%);
        }
        .ep-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .ep-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .ep-hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 6px; line-height: 1.15;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .ep-hero-title span { color: #c4b5fd; }
        .ep-hero-sub {
          color: rgba(255,255,255,0.78); font-size: 14px;
          margin: 0 0 22px; font-weight: 400;
        }
        .ep-search-wrap { position: relative; max-width: 520px; }
        .ep-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .ep-search {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.97); border: none; border-radius: 14px;
          font-size: 14px; color: #333; font-family: inherit; outline: none;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22); transition: box-shadow 0.2s;
        }
        .ep-search:focus { box-shadow: 0 6px 34px rgba(0,0,0,0.3); }
        .ep-hero-watermark {
          position: absolute; bottom: -18px; right: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.05); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        /* ── POPULAR CATEGORIES STRIP ── */
        .ep-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea;
          padding: 18px 0;
        }
        .ep-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
        }
        .ep-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px; }
        .ep-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .ep-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s; text-decoration: none;
          min-width: 130px;
        }
        .ep-cat-card:hover { border-color: #6d28d9; background: #f5f3ff; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(109,40,217,0.12); }
        .ep-cat-card.active { border-color: #6d28d9; background: #ede9fe; box-shadow: 0 4px 16px rgba(109,40,217,0.2); }
        .ep-cat-icon { font-size: 22px; }
        .ep-cat-info {}
        .ep-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .ep-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY ── */
        .ep-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .ep-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        /* ── SIDEBAR ── */
        .ep-sidebar {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #e8ecf0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .esf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f4f8;
        }
        .esf-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .esf-reset {
          font-size: 13px; font-weight: 700; color: #6d28d9;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .esf-reset:hover { opacity: 0.7; }
        .esf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f4f8; }
        .esf-section:last-of-type { border-bottom: none; }
        .esf-label { font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; }

        .esf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e4e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer; transition: border-color 0.2s;
        }
        .esf-select:focus { border-color: #6d28d9; }

        .esf-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .esf-chip {
          padding: 6px 13px; border-radius: 100px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e0e4f0; background: #fff; color: #555;
          cursor: pointer; transition: all 0.18s;
        }
        .esf-chip:hover { border-color: #6d28d9; color: #6d28d9; }
        .esf-chip.active { background: #6d28d9; color: #fff; border-color: #6d28d9; box-shadow: 0 2px 10px rgba(109,40,217,0.3); }

        .esf-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .esf-toggle-label { font-size: 13.5px; font-weight: 600; color: #333; }
        .esf-toggle { position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-block; }
        .esf-toggle input { opacity: 0; width: 0; height: 0; }
        .esf-toggle-track {
          position: absolute; inset: 0;
          background: #ddd; border-radius: 24px; transition: background 0.25s;
        }
        .esf-toggle input:checked + .esf-toggle-track { background: #6d28d9; }
        .esf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
        }
        .esf-toggle input:checked ~ .esf-toggle-thumb { transform: translateX(20px); }

        .esf-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 13px; text-align: center;
          background: linear-gradient(90deg, #6d28d9, #4c1d95);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(109,40,217,0.32);
          transition: opacity 0.18s, transform 0.18s;
        }
        .esf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RESULTS BAR ── */
        .ep-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .ep-results-count { font-size: 14px; color: #666; font-weight: 500; }
        .ep-sort-select {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: border-color 0.2s;
        }
        .ep-sort-select:focus { border-color: #6d28d9; }

        /* ── GRID ── */
        .ep-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

        /* ── CARD ── */
        .ep-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #ececec;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05); cursor: pointer;
        }
        .ep-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(0,0,0,0.13); }
        .ep-img-wrap {
          position: relative; width: 100%; aspect-ratio: 16/9;
          overflow: hidden; background: #ede9fe;
        }
        .ep-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.32s ease; }
        .ep-card:hover .ep-img { transform: scale(1.06); }

        .ep-heart {
          position: absolute; top: 9px; right: 9px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.94); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.16);
          transition: transform 0.18s, background 0.18s;
        }
        .ep-heart:hover { transform: scale(1.18); background: #fff; }

        .ep-badges {
          position: absolute; top: 9px; left: 9px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .ep-badge-verified {
          display: inline-flex; align-items: center; gap: 3px;
          background: #ede9fe; color: #6d28d9; border: 1px solid #c4b5fd;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .ep-badge-featured {
          display: inline-flex; align-items: center; gap: 3px;
          background: #fff8e1; color: #b7950b; border: 1px solid #f9e79f;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .ep-badge-admission {
          display: inline-flex; align-items: center; gap: 3px;
          background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }

        .ep-card-body { padding: 15px 16px 16px; display: flex; flex-direction: column; gap: 5px; }
        .ep-card-name { font-size: 15px; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin: 0; }
        .ep-card-cat { font-size: 13px; font-weight: 600; color: #6d28d9; margin: 0; }
        .ep-card-rating {
          display: flex; align-items: center; gap: 5px; margin-top: 2px;
        }
        .ep-card-stars { color: #f5a623; font-size: 13px; }
        .ep-card-rating-num { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .ep-card-reviews { font-size: 12px; color: #aaa; }
        .ep-card-location { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .ep-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px; padding-top: 10px; border-top: 1px solid #f2f5f3;
        }
        .ep-card-admission-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 700; color: #059669;
        }
        .ep-card-admission-dot { width: 7px; height: 7px; border-radius: 50%; background: #059669; display: inline-block; animation: ep-pulse 1.5s infinite; }
        .ep-enrolled-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 700; color: #6d28d9;
        }
        @keyframes ep-pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .ep-card-view {
          font-size: 12px; font-weight: 700; color: #6d28d9;
          background: #ede9fe; border: none; border-radius: 8px;
          padding: 6px 14px; cursor: pointer; font-family: inherit;
          transition: background 0.18s; text-decoration: none;
        }
        .ep-card-view:hover { background: #ddd6fe; }

        /* ── EMPTY ── */
        .ep-empty { grid-column: 1/-1; padding: 64px 24px; text-align: center; color: #888; }
        .ep-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .ep-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .ep-empty span { font-size: 13px; color: #aaa; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) { .ep-layout { grid-template-columns: 1fr; } .ep-sidebar { display: none; } }
        @media (max-width: 640px) { .ep-hero { height: 220px; } .ep-body { padding: 20px 16px 40px; } .ep-grid { grid-template-columns: 1fr; gap: 12px; } .ep-cats-row { gap: 8px; } .ep-cat-card { min-width: 110px; padding: 8px 12px; } }
      `}</style>

      <div className="ep">
        {/* ── HERO ── */}
        <section className="ep-hero">
          <div className="ep-hero-bg" />
          <div className="ep-hero-overlay" />
          <div className="ep-hero-watermark">Education</div>
          <div className="ep-hero-inner">
            <div className="ep-hero-tag">
              <MdSchool size={14} color="#fff" />
              Nepal&apos;s #1 Education Directory
            </div>
            <h1 className="ep-hero-title">
              Find The Best<br />
              <span>Education &amp; Learning Opportunities</span>
            </h1>
            <p className="ep-hero-sub">Schools, Colleges, Courses, Tuitions &amp; Training Programs near you</p>
            <div className="ep-search-wrap">
              <FiSearch className="ep-search-icon" size={18} color="#bbb" />
              <input
                className="ep-search"
                placeholder="Search schools, colleges, courses............"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── POPULAR CATEGORIES STRIP ── */}
        <section className="ep-cats-strip">
          <div className="ep-cats-inner">
            <p className="ep-cats-label">Popular Categories</p>
            <div className="ep-cats-row">
              {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                <button
                  key={cat}
                  className={`ep-cat-card${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{ border: "none" }}
                >
                  <span className="ep-cat-icon">{icon}</span>
                  <span className="ep-cat-info">
                    <span className="ep-cat-name">{cat}</span>
                    <span className="ep-cat-count">{CATEGORY_COUNTS[cat].toLocaleString()} listings</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN BODY ── */}
        <div className="ep-body">
          <div className="ep-layout">
            {/* ── SIDEBAR ── */}
            <aside className="ep-sidebar">
              <div className="esf-head">
                <p className="esf-head-title">Filters</p>
                <button className="esf-reset" onClick={reset}>Reset</button>
              </div>

              <div className="esf-section">
                <p className="esf-label">Location/City</p>
                <select className="esf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select City</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="esf-section">
                <p className="esf-label">Level</p>
                <select className="esf-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="esf-section">
                <p className="esf-label">Education Type</p>
                <div className="esf-chips">
                  {EDUCATION_TYPES.map((t) => (
                    <button
                      key={t}
                      className={`esf-chip${educationType === t ? " active" : ""}`}
                      onClick={() => setEducationType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="esf-section">
                <div className="esf-toggle-row">
                  <span className="esf-toggle-label">Admission Open</span>
                  <label className="esf-toggle">
                    <input type="checkbox" checked={admissionOnly} onChange={(e) => setAdmissionOnly(e.target.checked)} />
                    <span className="esf-toggle-track" />
                    <span className="esf-toggle-thumb" />
                  </label>
                </div>
              </div>

              <button className="esf-apply">Apply Filters</button>
            </aside>

            {/* ── RIGHT COLUMN ── */}
            <div>
              <div className="ep-results-bar">
                <span className="ep-results-count">
                  <strong>{displayed.length}</strong> results found
                </span>
                <select className="ep-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="ep-grid">
                {displayed.length === 0 ? (
                  <div className="ep-empty">
                    <div className="ep-empty-icon">🎓</div>
                    <p>No results found</p>
                    <span>Try adjusting your filters or search query</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    return (
                      <Link key={l.id} href={`/category/education-training/${l.id}`} className="ep-card">
                        <div className="ep-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.image} alt={l.name} className="ep-img" />
                          <div className="ep-badges">
                            {l.isVerified && <span className="ep-badge-verified">✓ Verified</span>}
                            {l.isFeatured && <span className="ep-badge-featured">⭐ Featured</span>}
                          </div>
                          <button className="ep-heart" aria-label="Save" onClick={(e) => toggleFav(l.id, e)}>
                            {isFav ? <FaHeart size={15} color="#E74C3C" /> : <FiHeart size={15} color="#999" />}
                          </button>
                        </div>
                        <div className="ep-card-body">
                          <p className="ep-card-name">{l.name}</p>
                          <p className="ep-card-cat">{l.category}</p>
                          <div className="ep-card-rating">
                            <FaStar size={12} color="#f5a623" />
                            <span className="ep-card-rating-num">{l.rating}</span>
                            <span className="ep-card-reviews">({l.reviews})</span>
                          </div>
                          <div className="ep-card-location">
                            <FiMapPin size={11} color="#bbb" />
                            {l.location}
                          </div>
                          <div className="ep-card-footer">
                            {l.admissionOpen ? (
                              <span className="ep-card-admission-tag">
                                <span className="ep-card-admission-dot" />
                                Admission Open
                              </span>
                            ) : l.enrolled ? (
                              <span className="ep-enrolled-tag">
                                🎓 Enrolled: {l.enrolled.toLocaleString()}
                              </span>
                            ) : (
                              <span style={{ fontSize: "11px", color: "#bbb" }}>Closed</span>
                            )}
                            <span className="ep-card-view">Learn More →</span>
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
