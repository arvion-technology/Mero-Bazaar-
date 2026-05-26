"use client";

import { useState } from "react";
import Link from "next/link";

const propertyListings = [
  {
    id: "2bhk-lazimpat",
    title: "2BKH Modern Apartment in Lazimpat",
    price: "Rs. 25,000 / month",
    location: "Lazimpat, Kathmandu",
    meta: ["2 Beds", "2 Baths", "1200 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment1.jpg",
  },
  {
    id: "2bhk-sanepa",
    title: "2BHK Apartment in Sanepa",
    price: "Rs. 17,000 / month",
    location: "Sanepa, Lalitpur",
    meta: ["2 Beds", "1 Bath", "950 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment2.jpg",
  },
  {
    id: "3bhk-lazimpat",
    title: "3BHK Spacious Apartment in Lazimpat",
    price: "Rs. 32,000 / month",
    location: "Lazimpat, Kathmandu",
    meta: ["3 Beds", "2 Baths", "1500 sqft"],
    badge: "FEATURED",
    badgeColor: "#F39C12",
    img: "/apartment.avif",
  },
  {
    id: "2bhk-baneshwor",
    title: "2BHK Apartment in Baneshwor",
    price: "Rs. 11,000 / month",
    location: "Baneshwor, Kathmandu",
    meta: ["2 Beds", "1 Bath", "880 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment3.jpg",
  },
  {
    id: "1bhk-jawalakhel",
    title: "1BHK Apartment in Jawalakhel",
    price: "Rs. 8,000 / month",
    location: "Jawalakhel, Lalitpur",
    meta: ["1 Bed", "1 Bath", "600 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment4.jpg",
  },
  {
    id: "3bhk-bhaktapur",
    title: "3BHK Apartment in Bhaktapur",
    price: "Rs. 20,000 / month",
    location: "Bhaktapur, Bagmati",
    meta: ["3 Beds", "2 Baths", "1350 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment5.jpg",
  },
  {
    id: "2bhk-laganthet",
    title: "2BHK Apartment in Laganthet",
    price: "Rs. 15,000 / month",
    location: "Laganthet, Lalitpur",
    meta: ["2 Beds", "1 Bath", "1050 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment6.jpg",
  },
  {
    id: "studio-thamel",
    title: "Studio Apartment in Thamel",
    price: "Rs. 12,000 / month",
    location: "Thamel, Kathmandu",
    meta: ["1 Bed", "1 Bath", "450 sqft"],
    badge: "FEATURED",
    badgeColor: "#F39C12",
    img: "/apartment7.jpg",
  },
  {
    id: "2bhk-patan",
    title: "2BHK Apartment in Patan",
    price: "Rs. 18,500 / month",
    location: "Patan, Lalitpur",
    meta: ["2 Beds", "2 Baths", "1100 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment8.jpg",
  },
  {
    id: "3bhk-koteshwor",
    title: "3BHK Apartment in Koteshwor",
    price: "Rs. 22,000 / month",
    location: "Koteshwor, Kathmandu",
    meta: ["3 Beds", "2 Baths", "1400 sqft"],
    badge: "VERIFIED",
    badgeColor: "#27AE60",
    img: "/apartment9.jpg",
  },
];

export default function PropertyCategoryPage() {
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

        /* ── Breadcrumb ── */
        .prop-bc {
          background: #fff;
          border-bottom: 1px solid #ececec;
          padding: 12px 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .prop-bc-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #888;
        }
        .prop-bc-link {
          color: #555;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.18s;
        }
        .prop-bc-link:hover { color: #C0392B; }
        .prop-bc-sep { color: #bbb; font-size: 12px; }
        .prop-bc-cur { color: #1a1a1a; font-weight: 600; }

        /* ── Section ── */
        .prop-section {
          background: #f8f8f8;
          padding: 36px 0 48px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .prop-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .prop-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .prop-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin: 0;
        }
        .prop-count {
          font-size: 13px;
          color: #888;
          font-weight: 400;
          margin-left: 8px;
        }

        /* Cards grid */
        .prop-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        /* Card */
        .prop-card {
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
        .prop-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.11);
          border-color: #ddd;
        }

        /* Image area */
        .prop-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .prop-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .prop-card:hover .prop-img { transform: scale(1.05); }

        /* Badge */
        .prop-badge {
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
        .prop-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          flex-shrink: 0;
        }

        /* Heart */
        .prop-heart {
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
        .prop-heart:hover { background: #fff; transform: scale(1.12); }

        /* Card body */
        .prop-body {
          padding: 12px 13px 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }
        .prop-listing-title {
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
        .prop-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #888;
          font-weight: 400;
          margin: 0;
        }
        .prop-location svg { flex-shrink: 0; }
        .prop-price {
          font-size: 14px;
          font-weight: 800;
          color: #C0392B;
          margin: 2px 0 0;
        }
        .prop-divider {
          border: none;
          border-top: 1px solid #f2f2f2;
          margin: 4px 0 2px;
        }
        .prop-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
          flex-wrap: wrap;
        }
        .prop-meta-item {
          font-size: 11.5px;
          color: #666;
          font-weight: 500;
        }
        .prop-meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ccc;
          flex-shrink: 0;
        }

        /* Placeholder */
        .prop-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg,#2d4a7a 0%,#1a2f5a 100%);
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .prop-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 820px) {
          .prop-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 580px) {
          .prop-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .prop-title { font-size: 17px; }
        }
        @media (max-width: 360px) {
          .prop-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Breadcrumb */}
      <nav className="prop-bc" aria-label="Breadcrumb">
        <div className="prop-bc-inner">
          <Link href="/" className="prop-bc-link">Home</Link>
          <span className="prop-bc-sep">›</span>
          <span className="prop-bc-cur">Property</span>
        </div>
      </nav>

      <section className="prop-section">
        <div className="prop-inner">

          {/* Header */}
          <div className="prop-header">
            <h1 className="prop-title">
              Property Listings
              <span className="prop-count">({propertyListings.length} listings)</span>
            </h1>
          </div>

          {/* Grid */}
          <div className="prop-grid">
            {propertyListings.map((item) => (
              <Link key={item.id} href={`/category/property/${item.id}`} className="prop-card">
                {/* Image */}
                <div className="prop-img-wrap">
                  {imgErrors[item.id] ? (
                    <div className="prop-img-placeholder">
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        <path d="M6 26L26 8l20 18" stroke="#4B6BFB" strokeWidth="2.2" strokeLinejoin="round"/>
                        <rect x="12" y="26" width="28" height="20" rx="2" stroke="#4B6BFB" strokeWidth="2"/>
                        <rect x="20" y="34" width="12" height="12" rx="1.5" stroke="#4B6BFB" strokeWidth="2"/>
                      </svg>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.img}
                      alt={item.title}
                      className="prop-img"
                      onError={() => handleImgError(item.id)}
                    />
                  )}

                  {/* Badge */}
                  <span className="prop-badge" style={{ background: item.badgeColor }}>
                    <span className="prop-badge-dot" />
                    {item.badge}
                  </span>

                  {/* Heart */}
                  <button
                    className="prop-heart"
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
                <div className="prop-body">
                  <p className="prop-listing-title">{item.title}</p>
                  <p className="prop-location">
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                      <path
                        d="M5.5 0C3.015 0 1 2.015 1 4.5C1 7.875 5.5 13 5.5 13C5.5 13 10 7.875 10 4.5C10 2.015 7.985 0 5.5 0ZM5.5 6C4.672 6 4 5.328 4 4.5C4 3.672 4.672 3 5.5 3C6.328 3 7 3.672 7 4.5C7 5.328 6.328 6 5.5 6Z"
                        fill="#aaa"
                      />
                    </svg>
                    {item.location}
                  </p>
                  <p className="prop-price">{item.price}</p>
                  <hr className="prop-divider" />
                  <div className="prop-meta">
                    {item.meta.map((m, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {i > 0 && <span className="prop-meta-dot" />}
                        <span className="prop-meta-item">{m}</span>
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
