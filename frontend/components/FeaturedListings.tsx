"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiHeart, FiMapPin, FiTruck, FiHome, FiBriefcase, FiActivity, FiMonitor, FiTool, FiScissors } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import type { FeaturedCard } from "@/app/types/featured";
import { resolveCardMeta } from "../lib/featuredCard";

const categoryRoute: Record<string, string> = {
  VEHICLE: "/category/vehicles",
  RENTAL: "/category/rent-and-real-estate",
  JOB: "/category/job",
  MEDICAL: "/category/medical",
  TRADES: "/category/trade-and-homerepair",
  BEAUTY: "/category/beauty",
  SECONDHAND: "/category/secondhand",
  FOODS: "/category/foods",
  AGRICULTURE: "/category/agriculture",
};

const categoryGradients: Record<string, string> = {
  VEHICLE: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
  RENTAL: "linear-gradient(135deg,#2d4a7a 0%,#1a2f5a 100%)",
  JOB: "linear-gradient(135deg,#0f3460 0%,#1a4a6e 100%)",
  MEDICAL: "linear-gradient(135deg,#1e3a5f 0%,#2d5986 100%)",
  TRADES: "linear-gradient(135deg,#2c3e50 0%,#34495e 100%)",
  BEAUTY: "linear-gradient(135deg,#6c3483 0%,#4a235a 100%)",
  SECONDHAND: "linear-gradient(135deg,#7d6608 0%,#5d4b00 100%)",
  FOODS: "linear-gradient(135deg,#7b241c 0%,#5b1a13 100%)",
  AGRICULTURE: "linear-gradient(135deg,#186a3b 0%,#0e4f2b 100%)",
};

const CategoryIcon = ({ category }: { category: string }) => {
  const style = { opacity: 0.85 };
  switch (category) {
    case "VEHICLE": return <FiTruck size={52} color="#E74C3C" style={style} />;
    case "RENTAL": return <FiHome size={52} color="#4B6BFB" style={style} />;
    case "JOB": return <FiBriefcase size={52} color="#27AE60" style={style} />;
    case "MEDICAL": return <FiActivity size={52} color="#2980B9" style={style} />;
    case "TRADES": return <FiTool size={52} color="#95A5A6" style={style} />;
    case "BEAUTY": return <FiScissors size={52} color="#AF7AC5" style={style} />;
    default: return <FiMonitor size={52} color="#2471A3" style={style} />;
  }
};

export default function FeaturedListings() {
  const [items, setItems] = useState<FeaturedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/featured/home?limit=5")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

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

        .fl-section { background: #f8f8f8; padding: 36px 0 48px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .fl-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        .fl-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .fl-title { font-size: 20px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; margin: 0; }
        .fl-view-all { display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 600; color: #C0392B; text-decoration: none; transition: gap 0.2s, opacity 0.2s; }
        .fl-view-all:hover { opacity: 0.8; gap: 8px; }
        .fl-view-all-arrow { font-size: 15px; transition: transform 0.2s; }
        .fl-view-all:hover .fl-view-all-arrow { transform: translateX(2px); }

        .fl-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }

        .fl-card { background: #fff; border-radius: 12px; border: 1.5px solid #ebebeb; overflow: hidden; text-decoration: none; display: flex; flex-direction: column; transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease; position: relative; }
        .fl-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(0,0,0,0.11); border-color: #ddd; }

        .fl-img-wrap { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .fl-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .fl-card:hover .fl-img { transform: scale(1.05); }
        .fl-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

        .fl-badge { position: absolute; top: 10px; left: 10px; display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.6px; color: #fff; text-transform: uppercase; z-index: 2; }
        .fl-badge.fl-badge-shift { left: 96px; }
        .fl-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.85); flex-shrink: 0; }

        .fl-heart { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center; z-index: 2; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.12); transition: background 0.2s, transform 0.2s; border: none; padding: 0; }
        .fl-heart:hover { background: #fff; transform: scale(1.12); }

        .fl-body { padding: 12px 13px 14px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .fl-listing-title { font-size: 13.5px; font-weight: 700; color: #1a1a1a; line-height: 1.35; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .fl-location { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #888; font-weight: 400; margin: 0; }
        .fl-price { font-size: 14px; font-weight: 800; color: #C0392B; margin: 2px 0 0; }
        .fl-price-muted { color: #444; font-size: 13px; }
        .fl-price-label { font-size: 10.5px; font-weight: 500; color: #999; margin-right: 4px; text-transform: none; letter-spacing: 0; }
        .fl-divider { border: none; border-top: 1px solid #f2f2f2; margin: 4px 0 2px; }
        .fl-meta { display: flex; align-items: center; gap: 6px; margin: 0; flex-wrap: wrap; }
        .fl-meta-item { font-size: 11.5px; color: #666; font-weight: 500; }
        .fl-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: #ccc; flex-shrink: 0; }

        .fl-skeleton { border-radius: 12px; border: 1.5px solid #ebebeb; background: #eee; aspect-ratio: 4/3.6; animation: flPulse 1.4s ease-in-out infinite; }
        @keyframes flPulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }

        @media (max-width: 1100px) { .fl-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 820px) { .fl-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 580px) { .fl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } .fl-title { font-size: 17px; } }
        @media (max-width: 360px) { .fl-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="fl-section">
        <div className="fl-inner">
          <div className="fl-header">
            <h2 className="fl-title">Featured Listings</h2>
            <Link href="/listing" className="fl-view-all">
              View All <span className="fl-view-all-arrow">→</span>
            </Link>
          </div>

          <div className="fl-grid">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="fl-skeleton" />)}

            {!loading &&
              items.map(({ listing, isPromoted, tier }) => {
                const meta = resolveCardMeta(listing);
                const href = `/listing/${listing.id}`;
                const gradient = categoryGradients[listing.category] || "#eee";

                return (
                  <Link key={listing.id} href={href} className="fl-card">
                    <div className="fl-img-wrap">
                      {imgErrors[listing.id] ? (
                        <div className="fl-img-placeholder" style={{ background: gradient }}>
                          <CategoryIcon category={listing.category} />
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={listing.images[0] ?? "/placeholder.png"}
                          alt={listing.title}
                          className="fl-img"
                          onError={() => handleImgError(listing.id)}
                        />
                      )}

                      {listing.user.isVerified && (
                        <span className="fl-badge" style={{ background: "#27AE60" }}>
                          <span className="fl-badge-dot" />
                          VERIFIED
                        </span>
                      )}
                      {isPromoted && (
                        <span
                          className={`fl-badge ${listing.user.isVerified ? "fl-badge-shift" : ""}`}
                          style={{ background: tier === "PLATINUM" ? "#8E44AD" : "#F39C12" }}
                        >
                          <span className="fl-badge-dot" />
                          {tier === "PLATINUM" ? "PLATINUM" : "FEATURED"}
                        </span>
                      )}

                      <button
                        className="fl-heart"
                        aria-label="Save to wishlist"
                        onClick={(e) => toggleFavorite(listing.id, e)}
                      >
                        {favorites[listing.id]
                          ? <FaHeart size={14} color="#E74C3C" />
                          : <FiHeart size={14} color="#999" />}
                      </button>
                    </div>

                    <div className="fl-body">
                      <p className="fl-listing-title">{listing.title}</p>
                      {meta.city && (
                        <p className="fl-location">
                          <FiMapPin size={11} color="#aaa" />
                          {meta.city}
                        </p>
                      )}
                      <p className={`fl-price ${meta.muted ? "fl-price-muted" : ""}`}>
                        {meta.priceLabel && <span className="fl-price-label">{meta.priceLabel}</span>}
                        {meta.priceText}
                      </p>
                      <hr className="fl-divider" />
                      {meta.subtitle && (
                        <div className="fl-meta">
                          <span className="fl-meta-item">{meta.subtitle}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}

            {!loading && items.length === 0 && <p>No featured listings right now.</p>}
          </div>
        </div>
      </section>
    </>
  );
}