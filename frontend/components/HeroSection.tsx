"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiSearch, FiChevronDown,
  FiCreditCard, FiShield,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { TbCubeUnfolded } from "react-icons/tb";

const popularSearches = [
  "Bajaj N160",
  "2BHK Rent Kathmandu",
  "Plumber",
  "Australia Study",
  "Driver Job",
];

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

const trustBadges = [
  {
    id: "verified",
    icon: <MdVerified size={26} color="#C0392B" />,
    title: "Verified Sellers",
    sub: "10,000+ Trusted",
  },
  {
    id: "blockchain",
    icon: <TbCubeUnfolded size={26} color="#4B6BFB" />,
    title: "Blockchain Verified",
    sub: "Tamper-proof records",
  },
  {
    id: "payments",
    icon: <FiCreditCard size={26} color="#27AE60" />,
    title: "Safe Payments",
    sub: "eSewa · Khalti · ConnectIPS",
  },
  {
    id: "protection",
    icon: <FiShield size={26} color="#F39C12" />,
    title: "Buyer Protection",
    sub: "Escrow & Dispute Support",
  },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Nepal");
  const [locOpen, setLocOpen] = useState(false);

  const locRef = useRef<HTMLDivElement>(null);

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

        /* ── Hero Wrapper ── */
        .hero-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          min-height: 380px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('/hero-bg.jpg');
          background-size: cover;
          background-position: center 35%;
          z-index: 0;
        }
        /* multi-stop overlay for deeper, more dramatic look */
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(8,8,20,0.62) 0%,
            rgba(15,15,35,0.42) 45%,
            rgba(255,255,255,0.0) 72%,
            rgba(255,255,255,0.88) 100%
          );
        }

        /* ── Hero Content ── */
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 44px 24px 0;
          text-align: center;
        }

        /* floating badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 999px;
          padding: 5px 16px 5px 10px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 18px;
          letter-spacing: 0.1px;
        }
        .hero-badge-dot {
          width: 8px; height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
          flex-shrink: 0;
          box-shadow: 0 0 0 0 rgba(74,222,128,0.6);
        }
        @keyframes pulse-dot {
          0%  { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
          70% { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
          100%{ box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }

        /* headings */
        .hero-h1 {
          font-size: clamp(28px, 4.5vw, 46px);
          font-weight: 800;
          color: #fff;
          line-height: 1.12;
          margin: 0 0 6px;
          text-shadow: 0 3px 18px rgba(0,0,0,0.45);
          letter-spacing: -0.8px;
        }
        .hero-h1-accent {
          display: block;
          font-size: clamp(32px, 5.5vw, 54px);
          font-weight: 900;
          background: linear-gradient(95deg, #ff6b6b 0%, #E74C3C 55%, #ff8c42 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          letter-spacing: -1px;
          line-height: 1.1;
        }
        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.88);
          margin: 10px 0 26px;
          font-weight: 400;
          text-shadow: 0 1px 8px rgba(0,0,0,0.3);
          max-width: 520px;
        }

        /* ── Search Bar ── */
        .hero-search-outer {
          width: 100%;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .hero-search-box {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          width: 100%;
          overflow: visible;
          position: relative;
          z-index: 10;
          transition: box-shadow 0.2s;
        }
        .hero-search-box:focus-within {
          box-shadow: 0 8px 48px rgba(192,57,43,0.22), 0 2px 8px rgba(0,0,0,0.1);
        }
        .hero-loc-wrap {
          position: relative;
          flex-shrink: 0;
          border-right: 1.5px solid #f0f0f0;
        }
        .hero-loc-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 14px 15px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          transition: color 0.15s;
        }
        .hero-loc-btn:hover { color: #C0392B; }
        .hero-loc-chevron { transition: transform 0.2s; flex-shrink: 0; }
        .hero-loc-chevron.open { transform: rotate(180deg); }
        .hero-loc-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 10px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.13);
          z-index: 9999;
          min-width: 170px;
          max-height: 230px;
          overflow-y: auto;
          animation: fadeDown 0.15s ease;
          scrollbar-width: thin;
          scrollbar-color: #e0e0e0 transparent;
        }
        .hero-loc-dropdown::-webkit-scrollbar { width: 4px; }
        .hero-loc-dropdown::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
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
        .hero-loc-opt.selected { color: #C0392B; font-weight: 600; background: #fff5f5; }

        /* search input */
        .hero-search-icon {
          padding: 0 10px 0 14px;
          color: #bbb;
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
          padding: 14px 8px 14px 0;
          font-family: inherit;
          min-width: 0;
        }
        .hero-search-input::placeholder { color: #b0b0b0; }
        .hero-search-btn {
          background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
          color: #fff;
          border: none;
          border-radius: 0 11px 11px 0;
          padding: 14px 26px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: filter 0.15s, transform 0.15s;
          font-family: inherit;
          flex-shrink: 0;
          letter-spacing: 0.2px;
        }
        .hero-search-btn:hover { filter: brightness(1.08); transform: translateX(1px); }
        .hero-search-btn:active { filter: brightness(0.95); transform: none; }

        /* popular searches */
        .hero-popular {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
          justify-content: center;
          padding-bottom: 32px;
        }
        .hero-popular-label {
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .hero-chip {
          display: inline-block;
          padding: 4px 13px;
          background: rgba(255,255,255,0.13);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.38);
          border-radius: 999px;
          font-size: 12px;
          color: #fff;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
          font-weight: 500;
          white-space: nowrap;
        }
        .hero-chip:hover {
          background: rgba(255,255,255,0.26);
          border-color: rgba(255,255,255,0.6);
          transform: translateY(-1px);
        }

        /* ── Trust Bar ── */
        .trust-bar {
          background: #fff;
          border-top: 1px solid #f0f0f0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          position: relative;
          z-index: 2;
        }
        .trust-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: stretch;
          justify-content: space-around;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 20px;
          flex: 1;
          border-right: 1px solid #f3f3f3;
          transition: background 0.18s;
        }
        .trust-item:last-child { border-right: none; }
        .trust-item:hover { background: #fafafa; }
        .trust-icon {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
        }
        .trust-title {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }
        .trust-sub {
          font-size: 11.5px;
          color: #999;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
          margin-top: 1px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .trust-inner { padding: 0 12px; flex-wrap: wrap; }
          .trust-item { flex: 1 1 45%; border-right: none; border-bottom: 1px solid #f3f3f3; padding: 14px 12px; }
          .hero-search-outer { max-width: 95%; }
        }
        @media (max-width: 520px) {
          .trust-item { flex: 1 1 100%; }
          .hero-popular { display: none; }
          .hero-search-btn { padding: 14px 16px; }
        }
      `}</style>

      {/* ── Hero Section ── */}
      <section className="hero-wrap">
        <div className="hero-bg" />

        <div className="hero-content">
          {/* live badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            नेपालको सबैभन्दा भरोसायोग्य डिजिटल मार्केटप्लेस
          </div>

          {/* headline */}
          <h1 className="hero-h1">
            Find Anything, Book Instantly
            <span className="hero-h1-accent">Across Nepal</span>
          </h1>

          <p className="hero-sub">जे खोज्नुहुन्छ, सजिलै पाउनुहोस् — गाडी, घर, जागिर, सेवा र अझ धेरै</p>

          {/* search bar */}
          <div className="hero-search-outer">
            <div className="hero-search-box">
              {/* location picker */}
              <div className="hero-loc-wrap" ref={locRef}>
                <button
                  className="hero-loc-btn"
                  onClick={() => setLocOpen(!locOpen)}
                  aria-label="Select location"
                >
                  📍 {location}
                  <FiChevronDown
                    className={`hero-loc-chevron${locOpen ? " open" : ""}`}
                    size={13}
                    color="#999"
                  />
                </button>
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

              {/* search input */}
              <div className="hero-search-icon">
                <FiSearch size={17} color="#bbb" />
              </div>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search vehicles, jobs, homes, services and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && console.log("search:", query)}
              />

              <button className="hero-search-btn">
                <FiSearch size={15} />
                Search
              </button>
            </div>

            {/* popular chips */}
            <div className="hero-popular">
              <span className="hero-popular-label">Popular:</span>
              {popularSearches.map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="hero-chip">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges Bar ── */}
      <div className="trust-bar">
        <div className="trust-inner">
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