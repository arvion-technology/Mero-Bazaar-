"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: "vehicles",
    labelNp: "सवारी साधन",
    label: "Vehicles",
    count: "12,000+ Listings",
    href: "/category/vehicles",
    bg: "#fff0f0",
    img: "/vehicle.png",
  },
  {
    id: "jobs",
    labelNp: "रोजगार",
    label: "Jobs & Labour Hire",
    count: "13,000+ Listings",
    href: "/category/job",
    bg: "#f0fff5",
    img: "/jobs.png",
  },
  {
    id: "medical",
    labelNp: "स्वास्थ्य",
    label: "Medical & Dental",
    count: "13,600+ Listings",
    href: "/category/medical",
    bg: "#f0f8ff",
    img: "/medical.png",
  },
  {
    id: "trade-and-homerepair",
    labelNp: "घर सेवा",
    label: "Trades & Home Repair",
    count: "6,000+ Listings",
    href: "/category/trade-and-homerepair",
    bg: "#fff9f0",
    img: "/construction.png",
  },
  {
    id: "rent-and-real-estate",
    labelNp: "घरजग्गा",
    label: "Rent & Real Estate",
    count: "12,500+ Listings",
    href: "/category/rent-and-real-estate",
    bg: "#f0f4ff",
    img: "/property.png",
  },
  {
    id: "food",
    labelNp: "कृषि",
    label: "Agriculture & Livestock",
    count: "5,500+ Listings",
    href: "/category/agriculture-and-livestock",
    bg: "#f0fff5",
    img: "/food and restaurants.png",
  },
  {
    id: "electronics",
    labelNp: "पुराना सामान",
    label: "Secondhand Goods",
    count: "15,000+ Listings",
    href: "/category/electronics",
    bg: "#f0f4ff",
    img: "/electronics.png",
  },
  {
    id: "education",
    labelNp: "शिक्षा र तालिम",
    label: "Education & Training",
    count: "5,500+ Listings",
    href: "/category/education-training",
    bg: "#fff9f0",
    img: "/education.png",
  },
  {
    id: "beauty",
    labelNp: "सौन्दर्य",
    label: "Hair, Beauty & Wellness",
    count: "4,500+ Listings",
    href: "/category/beauty",
    bg: "#fff0f8",
    img: "/beauty and wellness.png",
  },
];

export default function BrowseCategories() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .bc-section {
          background: #fff;
          padding: 36px 0 44px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .bc-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
        }

        /* Header */
        .bc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
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
          font-size: 13px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          transition: gap 0.2s, opacity 0.2s;
        }
        .bc-view-all:hover { opacity: 0.8; gap: 8px; }
        .bc-view-all-arrow { font-size: 15px; transition: transform 0.2s; }
        .bc-view-all:hover .bc-view-all-arrow { transform: translateX(2px); }

        /* Grid — 3 columns matching screenshot */
        .bc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        /* Card — horizontal layout like the screenshot */
        .bc-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: #fff;
          border: 1.5px solid #f0f0f0;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .bc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.09);
          border-color: #e0e0e0;
        }

        /* Icon */
        .bc-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          transition: transform 0.2s ease;
        }
        .bc-card:hover .bc-icon-wrap { transform: scale(1.06); }

        /* Text */
        .bc-text { flex: 1; min-width: 0; }
        .bc-label-np {
          font-size: 12px;
          font-weight: 500;
          color: #888;
          margin: 0 0 1px;
          line-height: 1.2;
        }
        .bc-label {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 3px;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bc-count {
          font-size: 12px;
          font-weight: 600;
          color: #C0392B;
          margin: 0;
          line-height: 1;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .bc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .bc-grid { grid-template-columns: 1fr; gap: 10px; }
          .bc-inner { padding: 0 16px; }
          .bc-title { font-size: 17px; }
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
                <div className="bc-icon-wrap" style={{ background: cat.bg }}>
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    width={54}
                    height={54}
                    style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "12px" }}
                  />
                </div>
                <div className="bc-text">
                  <p className="bc-label-np">{cat.labelNp}</p>
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
