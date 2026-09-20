"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import type { FeaturedCard } from "@/app/types/featured";
import { resolveCardMeta } from "../../lib/featuredCard";

export default function ListingsPage() {
  const [items, setItems] = useState<FeaturedCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/featured/home?limit=20")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        .page{ padding:40px 0; background:#f8f8f8; min-height:100vh; }
        .container{ max-width:1280px; margin:auto; padding:0 24px; }
        .header{ margin-bottom:30px; }
        .grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .card{ position:relative; background:#fff; border-radius:12px; overflow:hidden; text-decoration:none; color:#111; border:1px solid #eee; transition:.3s; display:block; }
        .card:hover{ transform:translateY(-4px); box-shadow:0 10px 30px rgba(0,0,0,.08); }
        .card img{ width:100%; height:220px; object-fit:cover; display:block; }
        .badge{ position:absolute; top:10px; left:10px; display:flex; align-items:center; gap:4px; color:#fff; font-size:10px; font-weight:700; padding:3px 8px; border-radius:5px; letter-spacing:.3px; }
        .badge.verified{ background:#27AE60; }
        .badge.promoted{ background:#F39C12; left: auto; }
        .badge.verified + .badge.promoted{ left: 96px; }
        .card h3{ padding:12px 14px 4px; font-size:16px; }
        .card p.loc{ padding:0 14px; color:#666; font-size:13px; margin:0; }
        .card p.meta{ padding:4px 14px 0; color:#999; font-size:12px; margin:0; }
        .card strong{ display:block; padding:10px 14px 18px; color:#C0392B; font-size:15px; }
        .skeleton{ background:#eee; border-radius:12px; height:340px; animation:pulse 1.4s ease-in-out infinite; }
        @keyframes pulse{ 0%,100%{opacity:1;} 50%{opacity:.5;} }
        @media(max-width:1024px){ .grid{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:768px){ .grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px){ .grid{ grid-template-columns:1fr; } }
      `}</style>

      <main className="page">
        <div className="container">
          <div className="header">
            <h1>Featured Listings</h1>
            <p>Browse all featured listings</p>
          </div>

          <div className="grid">
            {loading &&
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}

            {!loading &&
              items.map(({ listing, isPromoted }) => {
                const meta = resolveCardMeta(listing);
                return (
                  <Link key={listing.id} href={`/listing/${listing.id}`} className="card">
                    {listing.user.isVerified && (
                      <span className="badge verified">
                        <FiCheckCircle size={10} /> VERIFIED
                      </span>
                    )}
                    {isPromoted && <span className="badge promoted">FEATURED</span>}

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.images[0] ?? "/placeholder.png"} alt={listing.title} />

                    <h3>{listing.title}</h3>
                    {meta.city && (
                      <p className="loc">
                        <FiMapPin size={11} style={{ marginRight: 3 }} />
                        {meta.city}
                      </p>
                    )}
                    {meta.subtitle && <p className="meta">{meta.subtitle}</p>}
                    <strong>
                      {meta.priceLabel && `${meta.priceLabel} `}
                      {meta.priceText}
                    </strong>
                  </Link>
                );
              })}

            {!loading && items.length === 0 && <p>No featured listings right now.</p>}
          </div>
        </div>
      </main>
    </>
  );
}