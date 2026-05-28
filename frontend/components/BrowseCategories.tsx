"use client";

import Link from "next/link";
import Image from "next/image"; 

const categories = [
  {
    id: "vehicles",
    label: "Vehicles",
    count: "12,540 Listings",
    href: "/category/vehicles",
    bg: "#fff0f0",
    img: "/vehicle.png",
  },
  {
    id: "property",
    label: "Property",
    count: "8,732 Listings",
    href: "/category/property",
    bg: "#f0f4ff",
    img: "/property.png",
  },
  {
    id: "jobs",
    label: "Jobs",
    count: "6,245 Listings",
    href: "/category/jobs",
    bg: "#f0fff5",
    img: "/jobs.png",
  },
  {
    id: "medical",
    label: "Medical",
    count: "3,421 Listings",
    href: "/category/medical",
    bg: "#f0f8ff",
    img: "/medical.png",
  },
  {
    id: "education",
    label: "Education",
    count: "2,184 Listings",
    href: "/category/education",
    bg: "#f5f0ff",
    img: "/education.png",
  },
  {
    id: "construction",
    label: "Construction",
    count: "4,567 Listings",
    href: "/category/construction",
    bg: "#fff9f0",
    img: "/construction.png",
  },
  {
    id: "electronics",
    label: "Electronics",
    count: "5,231 Listings",
    href: "/category/electronics",
    bg: "#f0f4ff",
    img: "/electronics.png",
  },
  {
    id: "beauty",
    label: "Beauty & Wellness",
    count: "3,987 Listings",
    href: "/category/beauty",
    bg: "#fff0f8",
    img: "/beauty and wellness.png",
  },
  {
    id: "home-services",
    label: "Home Services",
    count: "4,321 Listings",
    href: "/category/home-services",
    bg: "#fff9f0",
    img: "/home services.png",
  },
  {
    id: "food",
    label: "Food & Restaurants",
    count: "2,876 Listings",
    href: "/category/food",
    bg: "#f0fff5",
    img: "/food and restaurants.png",
  },
  {
    id: "travel",
    label: "Travel & Tourism",
    count: "1,982 Listings",
    href: "/category/travel",
    bg: "#f0f8ff",
    img: "/travel and tourism.png",
  },
  {
    id: "more",
    label: "More Categories",
    count: "Explore all",
    href: "/categories",
    bg: "#f5f5f5",
    img: null,
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
          overflow: hidden;
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

        /* More categories dots */
        .bc-more-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 100%;
          height: 100%;
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
                  {cat.img ? (
                    <Image
                      src={cat.img}
                      alt={cat.label}
                      width={58}
                      height={58}
                      style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    /* More Categories — dots fallback */
                    <div className="bc-more-dots">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <circle cx="10" cy="18" r="3" fill="#aaa" />
                        <circle cx="18" cy="18" r="3" fill="#aaa" />
                        <circle cx="26" cy="18" r="3" fill="#aaa" />
                      </svg>
                    </div>
                  )}
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
