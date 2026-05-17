"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const categories = [
  { name: "Vehicles", slug: "vehicles" },
  { name: "Property", slug: "property" },
  { name: "Jobs & Careers", slug: "jobs-careers" },
  { name: "Medical & Health", slug: "medical-health" },
  { name: "Education & Training", slug: "education-training" },
  { name: "Electronics", slug: "electronics" },
  { name: "Beauty & Wellness", slug: "beauty-wellness" },
  { name: "Trades & Maintenance", slug: "trades-maintenance" },
  { name: "Food & Restaurants", slug: "food-restaurants" },
];

const navLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Services", href: "/services" },
  { label: "Jobs", href: "/category/jobs-careers" },
  { label: "Property", href: "/category/property" },
];

const moreLinks = [
  { label: "Labour Hire", href: "/category/labour-hire" },
  { label: "Events", href: "/category/events" },
  { label: "Home Services", href: "/category/home-services" },
  { label: "Travel & Tourism", href: "/category/travel-tourism" },
];

const PRIMARY = "#C0392B";

export default function Navbar() {
  const [showCategories, setShowCategories] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCats, setShowMobileCats] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const catRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCategories(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMore(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .hnb-nav {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e8e8e8;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .hnb-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          height: 60px;
          gap: 6px;
        }
        .hnb-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 8px;
        }
        .hnb-logo-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
        }
        .hnb-logo-text { line-height: 1.15; }
        .hnb-logo-line1 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: ${PRIMARY};
          letter-spacing: -0.2px;
        }
        .hnb-logo-line2 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.2px;
        }
        .hnb-links {
          display: flex;
          align-items: center;
          margin-left: 150px;
          gap: 0;
          flex: 1;
        }
        .hnb-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 11px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          background: none;
          border: none;
          white-space: nowrap;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          line-height: 1;
        }
        .hnb-btn:hover { background: #f5f5f5; color: #111; }
        .hnb-btn.active { color: ${PRIMARY}; background: #fff5f5; }
        .hnb-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 12px;
          z-index: 200;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          animation: fadeDown 0.15s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hnb-cat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          padding: 10px;
          width: 300px;
        }
        .hnb-cat-item {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .hnb-cat-item:hover { background: #fff5f5; color: ${PRIMARY}; }
        .hnb-view-all {
          border-top: 1px solid #f0f0f0;
          padding: 9px 16px;
          text-align: center;
        }
        .hnb-view-all-link {
          font-size: 12px;
          font-weight: 600;
          color: ${PRIMARY};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .hnb-view-all-link:hover { text-decoration: underline; }
        .hnb-more-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 12px;
          z-index: 200;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          padding: 6px;
          width: 175px;
          animation: fadeDown 0.15s ease;
        }
        .hnb-more-item {
          display: block;
          padding: 9px 12px;
          font-size: 13px;
          color: #444;
          text-decoration: none;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .hnb-more-item:hover { background: #fff5f5; color: ${PRIMARY}; }
        .hnb-right {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .hnb-seller {
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .hnb-seller:hover { color: ${PRIMARY}; }
        .hnb-bell {
          background: none;
          border: none;
          cursor: pointer;
          color: #555;
          padding: 5px;
          display: flex;
          align-items: center;
          border-radius: 50%;
          transition: background 0.15s, color 0.15s;
        }
        .hnb-bell:hover { background: #f5f5f5; color: #111; }
        .hnb-login {
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.1px;
        }
        .hnb-login:hover { background: #a93226; transform: translateY(-1px); }
        .hnb-login:active { transform: translateY(0); }
        .hnb-chevron {
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .hnb-chevron.open { transform: rotate(180deg); }
        .hnb-hamburger {
          display: none;
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #444;
          border-radius: 6px;
        }
        .hnb-hamburger:hover { background: #f5f5f5; }
        .hnb-mobile-menu {
          border-top: 1px solid #f0f0f0;
          background: #fff;
          padding: 10px 16px 16px;
        }
        .hnb-mobile-link {
          display: block;
          padding: 11px 4px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          border-bottom: 1px solid #f5f5f5;
          text-decoration: none;
          transition: color 0.12s;
        }
        .hnb-mobile-link:hover { color: ${PRIMARY}; }
        .hnb-mobile-cats-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 11px 4px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          background: none;
          border: none;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
        }
        .hnb-mobile-sub-link {
          display: block;
          padding: 7px 12px;
          font-size: 13px;
          color: #555;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.12s, color 0.12s;
        }
        .hnb-mobile-sub-link:hover { background: #fff5f5; color: ${PRIMARY}; }
        @media (max-width: 900px) {
          .hnb-links { display: none !important; }
          .hnb-right  { display: none !important; }
          .hnb-hamburger { display: flex !important; }
        }
      `}</style>

      <nav className="hnb-nav">
        <div className="hnb-inner">

          <Link href="/" className="hnb-logo">
            <svg className="hnb-logo-icon" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="38" height="38" rx="8" fill={PRIMARY} />
              <path
                d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10
                   M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28
                   M10 10 Q10 19 10 28
                   M28 10 Q28 19 28 28
                   M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
              <circle cx="19" cy="19" r="3" fill="#fff" opacity="0.9" />
            </svg>
            <div className="hnb-logo-text">
              <span className="hnb-logo-line1">HamroNepal</span>
              <span className="hnb-logo-line2">Bazaar</span>
            </div>
          </Link>

          <div className="hnb-links">

            <div style={{ position: "relative" }} ref={catRef}>
              <button
                className={`hnb-btn${showCategories ? " active" : ""}`}
                onClick={() => { setShowCategories(!showCategories); setShowMore(false); }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="0" y="0" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="5.5" y="0" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="11" y="0" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="0" y="5.5" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="5.5" y="5.5" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="11" y="5.5" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="0" y="11" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="5.5" y="11" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                  <rect x="11" y="11" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
                </svg>
                Categories
                <svg className={`hnb-chevron${showCategories ? " open" : ""}`} width="11" height="11" fill="none" stroke="#999" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCategories && (
                <div className="hnb-dropdown">
                  <div className="hnb-cat-grid">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="hnb-cat-item"
                        onClick={() => setShowCategories(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="hnb-view-all">
                    <Link href="/categories" className="hnb-view-all-link" onClick={() => setShowCategories(false)}>
                      View All Categories
                      <svg width="11" height="11" fill="none" stroke={PRIMARY} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hnb-btn"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ color: hoveredLink === link.href ? PRIMARY : undefined }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ position: "relative" }} ref={moreRef}>
              <button
                className={`hnb-btn${showMore ? " active" : ""}`}
                onClick={() => { setShowMore(!showMore); setShowCategories(false); }}
              >
                More
                <svg className={`hnb-chevron${showMore ? " open" : ""}`} width="11" height="11" fill="none" stroke="#999" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMore && (
                <div className="hnb-more-dropdown">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="hnb-more-item"
                      onClick={() => setShowMore(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hnb-right">
            <Link href="/sell" className="hnb-seller">Become a Seller</Link>

            <button className="hnb-bell" aria-label="Notifications">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <Link href="/login" className="hnb-login">Login / Register</Link>
          </div>

          <button
            className="hnb-hamburger"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {showMobileMenu && (
          <div className="hnb-mobile-menu">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hnb-mobile-link">
                {link.label}
              </Link>
            ))}

            <button className="hnb-mobile-cats-btn" onClick={() => setShowMobileCats(!showMobileCats)}>
              All Categories
              <svg width="14" height="14" fill="none" stroke="#999" viewBox="0 0 24 24"
                style={{ transform: showMobileCats ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMobileCats && (
              <div style={{ paddingLeft: 4, paddingBottom: 4 }}>
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="hnb-mobile-sub-link">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, paddingTop: 14 }}>
              <Link href="/sell" style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 500, color: "#333", border: "1px solid #ddd", borderRadius: 8, padding: "9px 0", textDecoration: "none" }}>
                Become a Seller
              </Link>
              <Link href="/login" style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#fff", background: PRIMARY, borderRadius: 8, padding: "9px 0", textDecoration: "none" }}>
                Login / Register
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}