"use client";

import Link from "next/link";
import { useState } from "react";

const listings = [
  {
    id: "bajaj-pulsar",
    title: "Bajaj Pulsar N160 Dual Channel",
    location: "Kathmandu, Bagmati",
    price: "Rs. 3,25,000",
    meta: ["2023", "12K km"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/listing/bajaj-pulsar",
    image: "/bajaj.avif",
    category: "vehicles",
  },
  {
    id: "2bhk-apartment",
    title: "2BHK Apartment for Rent",
    location: "Lalitpur, Bagmati",
    price: "Rs. 22,000 / month",
    meta: ["2 Beds", "2 Baths"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/listing/2bhk-apartment",
    image: "/apartment.avif",
    category: "property",
  },
  {
    id: "senior-frontend",
    title: "Senior Frontend Developer",
    location: "Kathmandu, Bagmati",
    price: "Rs. 80,000 – 1,20,000",
    meta: ["Full Time"],
    badge: "FEATURED",
    badgeColor: "#F39C12",
    href: "/listing/senior-frontend",
    image: "/Senior Frontend Developer.webp",
    category: "jobs",
  },
  {
    id: "dental-checkup",
    title: "Dental Checkup & Cleaning",
    location: "Kathmandu, Bagmati",
    price: "Rs. 1,500",
    meta: ["Clinic"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/listing/dental-checkup",
    image: "/Dental Checkup & Cleaning.avif",
    category: "medical",
  },
  {
    id: "iphone-13",
    title: "iPhone 13 128GB (Used)",
    location: "Bhaktapur, Bagmati",
    price: "Rs. 65,000",
    meta: ["Like New"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    href: "/listing/iphone-13",
    image: "/iphone-13.avif",
    category: "electronics",
  },
];

const categoryGradients: Record<string, string> = {
  vehicles: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
  property: "linear-gradient(135deg,#2d4a7a 0%,#1a2f5a 100%)",
  jobs: "linear-gradient(135deg,#0f3460 0%,#1a4a6e 100%)",
  medical: "linear-gradient(135deg,#1e3a5f 0%,#2d5986 100%)",
  electronics: "linear-gradient(135deg,#2c3e50 0%,#34495e 100%)",
};

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "vehicles":
      return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <rect x="4" y="20" width="44" height="20" rx="6" fill="#E74C3C" opacity="0.2" />
          <rect x="4" y="20" width="44" height="20" rx="6" stroke="#E74C3C" strokeWidth="2" />
          <path d="M8 20l6-10h24l6 10" stroke="#E74C3C" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="14" cy="40" r="5" fill="#fff" stroke="#E74C3C" strokeWidth="2" />
          <circle cx="38" cy="40" r="5" fill="#fff" stroke="#E74C3C" strokeWidth="2" />
        </svg>
      );
    case "property":
      return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path d="M6 26L26 8l20 18" stroke="#4B6BFB" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="12" y="26" width="28" height="20" rx="2" stroke="#4B6BFB" strokeWidth="2" />
          <rect x="20" y="34" width="12" height="12" rx="1.5" stroke="#4B6BFB" strokeWidth="2" />
        </svg>
      );
    case "jobs":
      return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <rect x="8" y="20" width="36" height="26" rx="4" stroke="#27AE60" strokeWidth="2" />
          <path d="M20 20v-5a2 2 0 012-2h8a2 2 0 012 2v5" stroke="#27AE60" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 32h36" stroke="#27AE60" strokeWidth="1.6" opacity="0.5" />
          <rect x="20" y="28" width="12" height="8" rx="2" stroke="#27AE60" strokeWidth="1.8" />
        </svg>
      );
    case "medical":
      return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="20" stroke="#2980B9" strokeWidth="2" />
          <path d="M26 16v20M16 26h20" stroke="#2980B9" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "electronics":
      return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <rect x="6" y="10" width="34" height="24" rx="3.5" stroke="#2471A3" strokeWidth="2" />
          <path d="M14 44h24M26 34v10" stroke="#2471A3" strokeWidth="2" strokeLinecap="round" />
          <rect x="40" y="16" width="6" height="14" rx="2" stroke="#2471A3" strokeWidth="1.8" />
        </svg>
      );
    default:
      return null;
  }
};

export default function FeaturedListings() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .fl-section {
          background: #f8f8f8;
          padding: 36px 0 48px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .fl-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .fl-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .fl-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin: 0;
        }
        .fl-view-all {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13.5px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          transition: gap 0.2s, opacity 0.2s;
        }
        .fl-view-all:hover { opacity: 0.8; gap: 8px; }
        .fl-view-all-arrow {
          font-size: 15px;
          transition: transform 0.2s;
        }
        .fl-view-all:hover .fl-view-all-arrow { transform: translateX(2px); }

        /* Cards grid */
        .fl-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        /* Card */
        .fl-card {
          background: #fff;
          border-radius: 12px;
          border: 1.5px solid #ebebeb;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          position: relative;
        }
        .fl-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.11);
          border-color: #ddd;
        }

        /* Image area */
        .fl-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fl-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .fl-card:hover .fl-img { transform: scale(1.05); }
        .fl-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Badge */
        .fl-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6px;
          color: #fff;
          text-transform: uppercase;
          z-index: 2;
        }
        .fl-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          flex-shrink: 0;
        }

        /* Wishlist heart */
        .fl-heart {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          transition: background 0.2s, transform 0.2s;
          border: none;
          padding: 0;
        }
        .fl-heart:hover { background: #fff; transform: scale(1.12); }

        /* Card body */
        .fl-body {
          padding: 12px 13px 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }
        .fl-listing-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.35;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fl-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #888;
          font-weight: 400;
          margin: 0;
        }
        .fl-location svg { flex-shrink: 0; }
        .fl-price {
          font-size: 14px;
          font-weight: 800;
          color: #C0392B;
          margin: 2px 0 0;
        }
        .fl-divider {
          border: none;
          border-top: 1px solid #f2f2f2;
          margin: 4px 0 2px;
        }
        .fl-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
          flex-wrap: wrap;
        }
        .fl-meta-item {
          font-size: 11.5px;
          color: #666;
          font-weight: 500;
        }
        .fl-meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ccc;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .fl-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 820px) {
          .fl-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 580px) {
          .fl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .fl-title { font-size: 17px; }
        }
        @media (max-width: 360px) {
          .fl-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="fl-section">
        <div className="fl-inner">
          {/* Header */}
          <div className="fl-header">
            <h2 className="fl-title">Featured Listings</h2>
            <Link href="/listings" className="fl-view-all">
              View All <span className="fl-view-all-arrow">→</span>
            </Link>
          </div>

          {/* Grid */}
          <div className="fl-grid">
            {listings.map((item) => (
              <Link key={item.id} href={item.href} className="fl-card">
                {/* Image */}
                <div className="fl-img-wrap">
                  {imgErrors[item.id] ? (
                    <div
                      className="fl-img-placeholder"
                      style={{ background: categoryGradients[item.category] || "#eee" }}
                    >
                      <CategoryIcon category={item.category} />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="fl-img"
                      onError={() => handleImgError(item.id)}
                    />
                  )}

                  {/* Badge */}
                  <span className="fl-badge" style={{ background: item.badgeColor }}>
                    <span className="fl-badge-dot" />
                    {item.badge}
                  </span>

                  {/* Heart */}
                  <button
                    className="fl-heart"
                    aria-label="Save to wishlist"
                    onClick={(e) => toggleFavorite(item.id, e)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
                        stroke={favorites[item.id] ? "#E74C3C" : "#999"}
                        strokeWidth="1.8"
                        fill={favorites[item.id] ? "#E74C3C" : "none"}
                      />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="fl-body">
                  <p className="fl-listing-title">{item.title}</p>
                  <p className="fl-location">
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                      <path
                        d="M5.5 0C3.015 0 1 2.015 1 4.5C1 7.875 5.5 13 5.5 13C5.5 13 10 7.875 10 4.5C10 2.015 7.985 0 5.5 0ZM5.5 6C4.672 6 4 5.328 4 4.5C4 3.672 4.672 3 5.5 3C6.328 3 7 3.672 7 4.5C7 5.328 6.328 6 5.5 6Z"
                        fill="#aaa"
                      />
                    </svg>
                    {item.location}
                  </p>
                  <p className="fl-price">{item.price}</p>
                  <hr className="fl-divider" />
                  <div className="fl-meta">
                    {item.meta.map((m, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {i > 0 && <span className="fl-meta-dot" />}
                        <span className="fl-meta-item">{m}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
