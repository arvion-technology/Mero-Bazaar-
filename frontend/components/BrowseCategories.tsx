"use client";

import Link from "next/link";

const categories = [
  {
    id: "vehicles",
    label: "Vehicles",
    count: "12,540 Listings",
    href: "/category/vehicles",
    bg: "#fff0f0",
    iconColor: "#E74C3C",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="13" width="32" height="14" rx="4" fill="#E74C3C" opacity="0.15" />
        <rect x="2" y="13" width="32" height="14" rx="4" stroke="#E74C3C" strokeWidth="1.8" />
        <path d="M6 13l4-7h16l4 7" stroke="#E74C3C" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="9" cy="27" r="3.5" fill="#fff" stroke="#E74C3C" strokeWidth="1.8" />
        <circle cx="27" cy="27" r="3.5" fill="#fff" stroke="#E74C3C" strokeWidth="1.8" />
        <path d="M2 19h32" stroke="#E74C3C" strokeWidth="1.2" opacity="0.4" />
        <rect x="14" y="9" width="8" height="5" rx="1" stroke="#E74C3C" strokeWidth="1.2" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "property",
    label: "Property",
    count: "8,732 Listings",
    href: "/category/property",
    bg: "#f0f4ff",
    iconColor: "#4B6BFB",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M4 18L18 6l14 12" stroke="#4B6BFB" strokeWidth="1.8" strokeLinejoin="round" />
        <rect x="8" y="18" width="20" height="14" rx="1.5" stroke="#4B6BFB" strokeWidth="1.8" />
        <rect x="14" y="24" width="8" height="8" rx="1" stroke="#4B6BFB" strokeWidth="1.5" />
        <path d="M12 18v-3a2 2 0 014 0v3" stroke="#4B6BFB" strokeWidth="1.3" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "jobs",
    label: "Jobs",
    count: "6,245 Listings",
    href: "/category/jobs",
    bg: "#f0fff5",
    iconColor: "#27AE60",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="5" y="13" width="26" height="18" rx="3" stroke="#27AE60" strokeWidth="1.8" />
        <path d="M13 13v-3a2 2 0 012-2h6a2 2 0 012 2v3" stroke="#27AE60" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 22h26" stroke="#27AE60" strokeWidth="1.3" opacity="0.4" />
        <rect x="14" y="19" width="8" height="6" rx="1.5" stroke="#27AE60" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "medical",
    label: "Medical",
    count: "3,421 Listings",
    href: "/category/medical",
    bg: "#f0f8ff",
    iconColor: "#2980B9",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="13" stroke="#2980B9" strokeWidth="1.8" />
        <path d="M18 12v12M12 18h12" stroke="#2980B9" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M11 11l14 14M25 11L11 25" stroke="#2980B9" strokeWidth="1" opacity="0.15" />
      </svg>
    ),
  },
  {
    id: "education",
    label: "Education",
    count: "2,184 Listings",
    href: "/category/education",
    bg: "#f5f0ff",
    iconColor: "#8E44AD",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 7l16 8-16 8L2 15l16-8z" stroke="#8E44AD" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 19v7c0 2 4.5 4 10 4s10-2 10-4v-7" stroke="#8E44AD" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M34 15v8" stroke="#8E44AD" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "construction",
    label: "Construction",
    count: "4,567 Listings",
    href: "/category/construction",
    bg: "#fff9f0",
    iconColor: "#F39C12",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4l4 8H28l-5 5 2 9-7-4-7 4 2-9-5-5h6L18 4z" stroke="#F39C12" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        <path d="M6 32h24" stroke="#F39C12" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 24h12v8H12z" stroke="#F39C12" strokeWidth="1.4" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "electronics",
    label: "Electronics",
    count: "5,231 Listings",
    href: "/category/electronics",
    bg: "#f0f4ff",
    iconColor: "#2471A3",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="7" width="24" height="17" rx="2.5" stroke="#2471A3" strokeWidth="1.8" />
        <path d="M10 31h16M18 24v7" stroke="#2471A3" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="28" y="11" width="4" height="10" rx="1.5" stroke="#2471A3" strokeWidth="1.5" />
        <path d="M8 12h14M8 16h10M8 20h7" stroke="#2471A3" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "beauty",
    label: "Beauty & Wellness",
    count: "3,987 Listings",
    href: "/category/beauty",
    bg: "#fff0f8",
    iconColor: "#C0392B",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="12" r="7" stroke="#C0392B" strokeWidth="1.8" />
        <path d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 19v9M14 32h8" stroke="#C0392B" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "home-services",
    label: "Home Services",
    count: "4,321 Listings",
    href: "/category/home-services",
    bg: "#fff9f0",
    iconColor: "#E67E22",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M10 22l4-4 3 3 9-9" stroke="#E67E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="26" r="3" stroke="#E67E22" strokeWidth="1.6" />
        <circle cx="26" cy="10" r="3" stroke="#E67E22" strokeWidth="1.6" />
        <path d="M6 6l24 24" stroke="#E67E22" strokeWidth="1.4" strokeLinecap="round" opacity="0.2" />
      </svg>
    ),
  },
  {
    id: "food",
    label: "Food & Restaurants",
    count: "2,876 Listings",
    href: "/category/food",
    bg: "#f0fff5",
    iconColor: "#27AE60",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 6v10M14 8c0 4 8 4 8 0" stroke="#27AE60" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 16h12l-2 14H14L12 16z" stroke="#27AE60" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 16h16" stroke="#27AE60" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "travel",
    label: "Travel & Tourism",
    count: "1,982 Listings",
    href: "/category/travel",
    bg: "#f0f8ff",
    iconColor: "#2980B9",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M4 22l8-8 6 4 10-10 4 4" stroke="#2980B9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 10l2-6 6 2" stroke="#2980B9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 30h28" stroke="#2980B9" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "more",
    label: "More Categories",
    count: "Explore all",
    href: "/categories",
    bg: "#f5f5f5",
    iconColor: "#888",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="10" cy="18" r="3" fill="#aaa" />
        <circle cx="18" cy="18" r="3" fill="#aaa" />
        <circle cx="26" cy="18" r="3" fill="#aaa" />
      </svg>
    ),
  },
];

export default function BrowseCategories() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .bc-section {
          background: #fff;
          padding: 36px 0 40px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .bc-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .bc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .bc-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin: 0;
        }
        .bc-view-all {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13.5px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          transition: gap 0.2s, opacity 0.2s;
        }
        .bc-view-all:hover {
          opacity: 0.8;
          gap: 8px;
        }
        .bc-view-all-arrow {
          font-size: 15px;
          transition: transform 0.2s;
        }
        .bc-view-all:hover .bc-view-all-arrow {
          transform: translateX(2px);
        }

        /* Grid */
        .bc-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
        }

        /* Card */
        .bc-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 20px 10px 16px;
          background: #fff;
          border: 1.5px solid #f0f0f0;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          text-align: center;
          min-height: 110px;
        }
        .bc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.1);
          border-color: #e0e0e0;
        }

        .bc-icon-wrap {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .bc-card:hover .bc-icon-wrap {
          transform: scale(1.07);
        }

        .bc-label {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          margin: 0;
        }
        .bc-count {
          font-size: 11.5px;
          color: #888;
          font-weight: 400;
          margin: 0;
          line-height: 1;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .bc-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 640px) {
          .bc-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .bc-card { padding: 14px 8px 12px; min-height: 90px; }
          .bc-icon-wrap { width: 48px; height: 48px; }
          .bc-title { font-size: 17px; }
        }
        @media (max-width: 400px) {
          .bc-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <section className="bc-section">
        <div className="bc-inner">
          {/* Section Header */}
          <div className="bc-header">
            <h2 className="bc-title">Browse Categories</h2>
            <Link href="/categories" className="bc-view-all">
              View All Categories
              <span className="bc-view-all-arrow">→</span>
            </Link>
          </div>

          {/* Category Grid */}
          <div className="bc-grid">
            {categories.map((cat) => (
              <Link key={cat.id} href={cat.href} className="bc-card">
                <div
                  className="bc-icon-wrap"
                  style={{ background: cat.bg }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="bc-label">{cat.label}</p>
                  <p className="bc-count">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
