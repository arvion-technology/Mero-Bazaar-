"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch, FiMapPin, FiHeart, FiStar, FiTool,
} from "react-icons/fi";
import {
  FaHeart, FaHardHat, FaBuilding, FaWarehouse,
  FaPaintRoller, FaWrench,
} from "react-icons/fa";
import { MdVerified, MdEngineering } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";
import { GiConcreteBag } from "react-icons/gi";

/* ── Types ───────────────────────────────────────────────────── */
type ConstructionListing = {
  id: string;
  title: string;
  company: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  location: string;
  city: string;
  image: string;
  type: "Residential" | "Commercial" | "Industrial";
  isVerified?: boolean;
  isFeatured?: boolean;
  badge?: "New" | "Ongoing" | "Completed";
};

/* ── Listings ────────────────────────────────────────────────── */
const LISTINGS: ConstructionListing[] = [
  {
    id: "elite-construction-kathmandu",
    title: "Elite Construction Pvt. Ltd.",
    company: "Elite Construction",
    category: "Building Construction",
    price: "Rs. 35,00,000+",
    rating: 4.8,
    reviews: 126,
    location: "Kathmandu, Nepal",
    city: "Kathmandu",
    image: "/Elite Contruction Pvt. Ltd..jpg",
    type: "Commercial",
    isVerified: true,
    isFeatured: true,
    badge: "New",
  },
  {
    id: "dream-house-builder-lalitpur",
    title: "Dream House Builder",
    company: "Dream House Builder",
    category: "House Construction",
    price: "Rs. 18,00,000+",
    rating: 4.7,
    reviews: 98,
    location: "Lalitpur, Nepal",
    city: "Lalitpur",
    image: "/dream house builder.jpg",
    type: "Residential",
    isVerified: true,
    isFeatured: false,
    badge: "Ongoing",
  },
  {
    id: "reliable-engineering-ktm",
    title: "Reliable Engineering Solutions",
    company: "Reliable Engineering",
    category: "Civil Engineering",
    price: "Rs. 50,00,000+",
    rating: 4.9,
    reviews: 74,
    location: "Kathmandu, Nepal",
    city: "Kathmandu",
    image: "/Reliable Engineering.jpg",
    type: "Industrial",
    isVerified: true,
    isFeatured: true,
    badge: "New",
  },
  {
    id: "greenfield-developers-bhaktapur",
    title: "Greenfield Developers",
    company: "Greenfield",
    category: "Real Estate & Construction",
    price: "Rs. 25,00,000+",
    rating: 4.6,
    reviews: 55,
    location: "Bhaktapur, Nepal",
    city: "Bhaktapur",
    image: "/greenfieldd.jpg",
    type: "Residential",
    isVerified: false,
    isFeatured: false,
    badge: "Completed",
  },
  {
    id: "modern-interior-works-pokhara",
    title: "Modern Interior Works",
    company: "Modeern Interior Works",
    category: "Interior Design",
    price: "Rs. 5,00,000+",
    rating: 4.8,
    reviews: 43,
    location: "Pokhara, Nepal",
    city: "Pokhara",
    image: "/Modeern Interior Works.jpg",
    type: "Residential",
    isVerified: true,
    isFeatured: false,
    badge: "New",
  },
  {
    id: "bright-construction-chitwan",
    title: "Bright Construction Co.",
    company: "Bright Construction",
    category: "Building Construction",
    price: "Rs. 12,00,000+",
    rating: 4.5,
    reviews: 62,
    location: "Chitwan, Nepal",
    city: "Chitwan",
    image: "/bright-construction.jpg",
    type: "Commercial",
    isVerified: true,
    isFeatured: false,
    badge: "Ongoing",
  },

];

const CATEGORY_DATA = [
  { label: "Building Construction", icon: <FaBuilding size={18} />, count: 842 },
  { label: "House Construction",    icon: <FaHardHat size={18} />,   count: 1235 },
  { label: "Civil Engineering",     icon: <MdEngineering size={20} />, count: 567 },
  { label: "Interior Design",       icon: <FaPaintRoller size={18} />, count: 345 },
  { label: "Plumbing & Electrical", icon: <FaWrench size={18} />,    count: 428 },
  { label: "Apartment Construction",icon: <FaWarehouse size={18} />, count: 295 },
];

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "Residential", label: "Residential" },
  { value: "Commercial",  label: "Commercial" },
  { value: "Industrial",  label: "Industrial" },
];

const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar"];

const badgeStyles: Record<string, { bg: string; text: string; border: string }> = {
  New:       { bg: "#eafaf1", text: "#1e8449",  border: "#a9dfbf" },
  Ongoing:   { bg: "#fff8e1", text: "#b07000",  border: "#f5d58a" },
  Completed: { bg: "#e8f4fd", text: "#1a5fa8",  border: "#90caf9" },
};

/* ── Page ────────────────────────────────────────────────────── */
export default function ConstructionPage() {
  const [search,         setSearch]         = useState("");
  const [sort,           setSort]           = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [city,           setCity]           = useState("");
  const [activeType,     setActiveType]     = useState("");
  const [verifiedOnly,   setVerifiedOnly]   = useState(false);
  const [favorites,      setFavorites]      = useState<Record<string, boolean>>({});

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setActiveCategory("All"); setCity(""); setActiveType(""); setVerifiedOnly(false);
  };

  const displayed = LISTINGS.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      l.title.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q);
    const matchCat  = activeCategory === "All" || l.category === activeCategory;
    const matchCity = !city        || l.city === city;
    const matchType = !activeType  || l.type === activeType;
    const matchVer  = !verifiedOnly || l.isVerified;
    return matchSearch && matchCat && matchCity && matchType && matchVer;
  }).sort((a, b) => {
    if (sort === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    if (sort === "rating")   return b.rating - a.rating;
    return 0;
  });

  const arrowBg = `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center`;

  return (
    <>
      <style>{`@keyframes con-pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      <div style={{ background: "#f2f4f7", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

        {/* HERO */}
        <section style={{ position: "relative", height: 230, overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/construction banner.jpg')",
            backgroundSize: "cover", backgroundPosition: "center 35%",
            filter: "brightness(0.45)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,rgba(20,10,5,0.88) 0%,rgba(180,80,10,0.45) 100%)",
          }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 28px", width: "100%" }}>
            <h1 style={{
              fontSize: "clamp(24px,3.8vw,42px)", fontWeight: 900, color: "#fff",
              margin: "0 0 4px", lineHeight: 1.2,
              textShadow: "0 2px 18px rgba(0,0,0,0.55)",
            }}>
              Find Trusted<br />
              <span style={{ color: "#f59e0b" }}>Construction</span><br />
              Services Near You
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, margin: "4px 0 16px" }}>
              Buildings, Houses, Engineering, Interior &amp; More
            </p>
            <div style={{ position: "relative", maxWidth: 460 }}>
              <FiSearch
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#f59e0b", pointerEvents: "none" }}
                size={17}
              />
              <input
                style={{
                  width: "100%", padding: "12px 16px 12px 42px",
                  background: "rgba(255,255,255,0.97)", border: "none", borderRadius: 12,
                  fontSize: 13, color: "#333", fontFamily: "inherit", outline: "none",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
                }}
                placeholder="Search construction companies, projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CATEGORY STRIP */}
        <section style={{ background: "#fff", borderBottom: "1.5px solid #eaeaea", padding: "14px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            {CATEGORY_DATA.map(({ label, icon, count }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(activeCategory === label ? "All" : label)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", borderRadius: 12, cursor: "pointer",
                  border: `1.5px solid ${activeCategory === label ? "#d97706" : "#e4e8f0"}`,
                  background: activeCategory === label ? "#fef3c7" : "#fafbff",
                  transition: "all 0.18s", minWidth: 140, fontFamily: "inherit",
                  boxShadow: activeCategory === label ? "0 4px 14px rgba(217,119,6,0.18)" : "none",
                }}
              >
                <span style={{ color: activeCategory === label ? "#d97706" : "#666", display: "flex" }}>{icon}</span>
                <span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{label}</span>
                  <span style={{ display: "block", fontSize: 11, color: "#aaa" }}>{count.toLocaleString()} listings</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* BODY */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" }}>

            {/* SIDEBAR */}
            <aside style={{
              background: "#fff", borderRadius: 16,
              border: "1.5px solid #e4e8f0", overflow: "hidden",
              position: "sticky", top: 82,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 18px 12px", borderBottom: "1.5px solid #f2f4f8",
              }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}>Filters</span>
                <button onClick={reset} style={{ fontSize: 13, fontWeight: 700, color: "#d97706", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Reset
                </button>
              </div>

              {/* City */}
              <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f2f4f8" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
                  <FiMapPin size={12} style={{ marginRight: 5 }} />Location / City
                </p>
                <div style={{ position: "relative" }}>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 36px 10px 12px",
                      border: "1.5px solid #e4e8f0", borderRadius: 10,
                      fontSize: 13, color: "#555", fontFamily: "inherit",
                      background: `#fafafa ${arrowBg}`, appearance: "none",
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="">Select City</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Type */}
              <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f2f4f8" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
                  <FaBuilding size={11} style={{ marginRight: 5 }} />Project Type
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TYPE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setActiveType(t.value)}
                      style={{
                        padding: "5px 13px", borderRadius: 100,
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.18s",
                        border: `1.5px solid ${activeType === t.value ? "#d97706" : "#e0e4f0"}`,
                        background: activeType === t.value ? "#d97706" : "#fff",
                        color: activeType === t.value ? "#fff" : "#555",
                        boxShadow: activeType === t.value ? "0 2px 8px rgba(217,119,6,0.28)" : "none",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f2f4f8" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Verified Only</span>
                    <span style={{ display: "block", fontSize: 12, color: "#888", marginTop: 1 }}>Show trusted companies</span>
                  </div>
                  <label style={{ position: "relative", display: "inline-block", width: 44, height: 24, cursor: "pointer", flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                    />
                    <span style={{ position: "absolute", inset: 0, borderRadius: 24, background: verifiedOnly ? "#d97706" : "#ddd", transition: "background 0.25s" }} />
                    <span style={{ position: "absolute", top: 3, left: verifiedOnly ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.25s" }} />
                  </label>
                </div>
              </div>

              {/* Apply */}
              <div style={{ padding: "12px 18px 18px" }}>
                <button style={{
                  display: "block", width: "100%", padding: "13px",
                  textAlign: "center", fontFamily: "inherit",
                  background: "linear-gradient(90deg,#d97706,#b45309)",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                  border: "none", borderRadius: 12, cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(217,119,6,0.32)",
                }}>
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* RIGHT COLUMN */}
            <div>
              {/* results bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: "#555", fontWeight: 500 }}>
                  <strong style={{ color: "#1a1a1a" }}>{displayed.length}</strong> results found
                </span>
                <div style={{ position: "relative" }}>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{
                      padding: "8px 36px 8px 14px",
                      border: "1.5px solid #e0e4f0", borderRadius: 10,
                      fontSize: 13, fontWeight: 600, color: "#333",
                      background: `#fff ${`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center`}`,
                      appearance: "none", outline: "none", cursor: "pointer",
                      fontFamily: "inherit", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    <option value="newest">Newest</option>
                    <option value="featured">Featured</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* 2-column grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {displayed.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", padding: "60px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#555", margin: "0 0 4px" }}>No construction listings found</p>
                    <span style={{ fontSize: 13, color: "#aaa" }}>Try adjusting your filters or search</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    const bs = l.badge ? badgeStyles[l.badge] : null;
                    return (
                      <Link
                        key={l.id}
                        href={`/category/construction/${l.id}`}
                        style={{
                          background: "#fff", borderRadius: 16,
                          border: "1.5px solid #ececec", overflow: "hidden",
                          textDecoration: "none", display: "flex", flexDirection: "column",
                          position: "relative", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                          transition: "transform 0.22s ease, box-shadow 0.22s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                        }}
                      >
                        {/* image */}
                        <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "#fef3c7" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={l.image}
                            alt={l.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.06)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                          />

                          {/* Verified badge */}
                          {l.isVerified && (
                            <span style={{
                              position: "absolute", top: 8, left: 8,
                              display: "inline-flex", alignItems: "center", gap: 3,
                              background: "#eafaf1", color: "#1e8449", border: "1px solid #a9dfbf",
                              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                            }}>
                              <MdVerified size={10} /> Verified
                            </span>
                          )}

                          {/* Status badge */}
                          {bs && l.badge && (
                            <span style={{
                              position: "absolute", bottom: 8, right: 8,
                              background: bs.bg, color: bs.text,
                              border: `1px solid ${bs.border}`,
                              fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20,
                            }}>
                              {l.badge}
                            </span>
                          )}

                          {/* Type chip */}
                          <span style={{
                            position: "absolute", bottom: 8, left: 8,
                            background: "rgba(0,0,0,0.55)", color: "#fff",
                            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          }}>
                            {l.type}
                          </span>

                          {/* Heart */}
                          <button
                            aria-label="Save"
                            onClick={(e) => toggleFav(l.id, e)}
                            style={{
                              position: "absolute", top: 8, right: 8,
                              width: 30, height: 30, borderRadius: "50%",
                              background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              zIndex: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
                              transition: "transform 0.18s",
                            }}
                          >
                            {isFav ? <FaHeart size={13} color="#E74C3C" /> : <FiHeart size={13} color="#999" />}
                          </button>
                        </div>

                        {/* card body */}
                        <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.35 }}>
                            {l.title}
                          </p>
                          <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{l.category}</p>
                          <p style={{ fontSize: 15, fontWeight: 900, color: "#d97706", margin: 0 }}>
                            {l.price}
                          </p>

                          {/* rating */}
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                            <FiStar size={12} color="#f5a623" fill="#f5a623" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
                              {l.rating} ({l.reviews})
                            </span>
                          </div>

                          {/* location */}
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                            <FiMapPin size={11} color="#bbb" />
                            <span style={{ fontSize: 11, color: "#888" }}>{l.location}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Load More */}
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button style={{
                  padding: "11px 36px", borderRadius: 10,
                  background: "none", border: "1.5px solid #d0d4e0",
                  fontSize: 14, fontWeight: 700, color: "#555",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.18s",
                }}>
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
