"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiSearch, FiChevronDown,
  FiCreditCard, FiShield, FiHeadphones,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { TbCubeUnfolded } from "react-icons/tb";

// popular searches to show below the search bar
const popularSearches = [
  "Bajaj N160",
  "2BHK Rent Kathmandu",
  "Plumber",
  "Australia Study",
  "Driver Job",
];

// all the locations for the dropdown
const locations = [
  "All Nepal",
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Chitwan",
  "Butwal",
  "Biratnagar",
  "Birgunj",
  "Dharan",
];

// trust badges that show at the bottom - each has an icon, title and subtitle
const trustBadges = [
  {
    id: "verified",
    icon: <MdVerified size={28} color="#C0392B" />,
    title: "Verified Sellers",
    sub: "10,000+ Trusted",
  },
  {
    id: "blockchain",
    icon: <TbCubeUnfolded size={28} color="#4B6BFB" />,
    title: "Blockchain Verified",
    sub: "Tamper-proof records",
  },
  {
    id: "payments",
    icon: <FiCreditCard size={28} color="#27AE60" />,
    title: "Safe Payments",
    sub: "eSewa, Khalti, ConnectIPS",
  },
  {
    id: "protection",
    icon: <FiShield size={28} color="#F39C12" />,
    title: "Buyer Protection",
    sub: "Escrow & Dispute Support",
  },
  {
    id: "support",
    icon: <FiHeadphones size={28} color="#8E44AD" />,
    title: "24/7 Support",
    sub: "We are here for you",
  },
];

export default function HeroSection() {
  // state for the search input and location dropdown
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Nepal");
  const [locOpen, setLocOpen] = useState(false);

  const locRef = useRef<HTMLDivElement>(null);

  // close location dropdown when clicking outside - same pattern as navbar
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (locRef.current && !locRef.current.contains(e.target as Node)) {
        setLocOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <>
      {/* big style block for the whole hero section */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .hero-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          min-height: 340px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('/hero-bg.jpg');
          background-size: cover;
          background-position: center 40%;
          z-index: 0;
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.38) 0%,
            rgba(0,0,0,0.18) 55%,
            rgba(255,255,255,0.85) 100%
          );
        }
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 36px 24px 0;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(39,174,96,0.4);
          border-radius: 20px;
          padding: 4px 14px 4px 8px;
          font-size: 12px;
          font-weight: 500;
          color: #222;
          margin-bottom: 16px;
          backdrop-filter: blur(6px);
        }
        .hero-badge-dot {
          width: 8px; height: 8px;
          background: #27AE60;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.35); opacity: 0.7; }
        }
        .hero-h1 {
          font-size: clamp(30px, 5vw, 48px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 4px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
          letter-spacing: -0.5px;
        }
        .hero-h1-red {
          color: #E74C3C;
          display: block;
          font-size: clamp(34px, 5.5vw, 54px);
          font-weight: 900;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.92);
          margin: 8px 0 22px;
          font-weight: 400;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }
        .hero-search-box {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.14);
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 700px;
          overflow: visible;
          position: relative;
          z-index: 10;
        }
        .hero-search-icon {
          padding: 0 12px 0 16px;
          color: #999;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #333;
          background: transparent;
          padding: 13px 8px 13px 0;
          font-family: inherit;
        }
        .hero-search-input::placeholder { color: #aaa; }
        .hero-divider {
          width: 1px;
          height: 28px;
          background: #e0e0e0;
          flex-shrink: 0;
        }
        .hero-loc-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .hero-loc-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 13px 14px;
          font-size: 13.5px;
          font-weight: 500;
          color: #444;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
        }
        .hero-loc-chevron { transition: transform 0.2s; }
        .hero-loc-chevron.open { transform: rotate(180deg); }
        .hero-loc-dropdown {
          position: absolute;
          bottom: calc(100% + 4px);
          right: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 10px;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.13);
          z-index: 9999;
          min-width: 160px;
          max-height: 220px;
          overflow-y: auto;
          overflow-x: hidden;
          animation: fadeUp 0.15s ease;
          scrollbar-width: thin;
          scrollbar-color: #ddd transparent;
        }
        .hero-loc-dropdown::-webkit-scrollbar { width: 4px; }
        .hero-loc-dropdown::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-loc-opt {
          display: block;
          padding: 9px 16px;
          font-size: 13px;
          color: #444;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .hero-loc-opt:hover { background: #fff5f5; color: #C0392B; }
        .hero-loc-opt.selected { color: #C0392B; font-weight: 600; }
        .hero-search-btn {
          background: #C0392B;
          color: #fff;
          border: none;
          border-radius: 0 9px 9px 0;
          padding: 13px 22px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
          font-family: inherit;
          flex-shrink: 0;
          letter-spacing: 0.2px;
        }
        .hero-search-btn:hover { background: #a93226; }
        .hero-popular {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
          justify-content: center;
          padding-bottom: 28px;
        }
        .hero-popular-label {
          font-size: 12.5px;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .hero-chip {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 20px;
          font-size: 12px;
          color: #fff;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          font-weight: 500;
          white-space: nowrap;
        }
        .hero-chip:hover {
          background: rgba(255,255,255,0.35);
          color: #fff;
        }

        /* trust badges section at the bottom */
        .trust-bar {
          background: #fff;
          border-top: 1px solid #f0f0f0;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
          position: relative;
          z-index: 2;
        }
        .trust-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 16px 18px;
          flex: 1;
          border-right: 1px solid #f0f0f0;
        }
        .trust-item:last-child { border-right: none; }
        .trust-icon { flex-shrink: 0; }
        .trust-title {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }
        .trust-sub {
          font-size: 11.5px;
          color: #888;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }

        /* mobile styles */
        @media (max-width: 768px) {
          .trust-inner {
            flex-wrap: wrap;
            padding: 0 12px;
          }
          .trust-item {
            flex: 1 1 45%;
            border-right: none;
            border-bottom: 1px solid #f0f0f0;
            padding: 12px 10px;
          }
          .hero-search-box { max-width: 95%; }
        }
        @media (max-width: 480px) {
          .trust-item { flex: 1 1 100%; }
          .hero-popular { display: none; }
        }
      `}</style>

      {/* hero section */}
      <section className="hero-wrap">
        <div className="hero-bg" />

        <div className="hero-content">
          {/* little badge at the top */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            नेपालको सबैभन्दा भरोसायो डिजिटल मार्केटप्लेस
          </div>

          {/* main heading */}
          <h1 className="hero-h1">
            किन्ने, बेच्ने, बुक गर्ने
            <span className="hero-h1-red">सबै एकै ठाउमा</span>
          </h1>

          {/* subtitle in english */}
          <p className="hero-sub">Buy, Sell, Book and Find Trusted Services Across Nepal</p>

          {/* search bar with location picker */}
          <div className="hero-search-box">
            {/* search icon on the left */}
            <div className="hero-search-icon">
              <FiSearch size={18} color="#aaa" />
            </div>

            <input
              type="text"
              className="hero-search-input"
              placeholder="Search vehicles, jobs, plumbers, clinics, and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && console.log("search:", query)} // TODO: hook up real search
            />

            <div className="hero-divider" />

            {/* location dropdown */}
            <div className="hero-loc-wrap" ref={locRef}>
              <button
                className="hero-loc-btn"
                onClick={() => setLocOpen(!locOpen)}
              >
                {location}
                <FiChevronDown
                  className={`hero-loc-chevron${locOpen ? " open" : ""}`}
                  size={13}
                  color="#999"
                />
              </button>

              {/* show location options if open */}
              {locOpen && (
                <div className="hero-loc-dropdown">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      className={`hero-loc-opt${location === loc ? " selected" : ""}`}
                      onClick={() => { setLocation(loc); setLocOpen(false); }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="hero-search-btn">Search</button>
          </div>

          {/* popular search chips */}
          <div className="hero-popular">
            <span className="hero-popular-label">Popular Searches:</span>
            {popularSearches.map((term) => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="hero-chip">
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* trust badges bar below the hero */}
      <div className="trust-bar">
        <div className="trust-inner">
          {/* loop through all trust badges */}
          {trustBadges.map((badge) => (
            <div key={badge.id} className="trust-item">
              <div className="trust-icon">{badge.icon}</div>
              <div>
                <div className="trust-title">{badge.title}</div>
                <div className="trust-sub">{badge.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}