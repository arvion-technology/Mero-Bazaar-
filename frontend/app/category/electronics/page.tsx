"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch, FiMapPin, FiHeart, FiSmartphone, FiCamera, FiWatch, FiStar,
} from "react-icons/fi";
import { FaHeart, FaBolt, FaLaptop, FaGamepad } from "react-icons/fa";
import { MdSpeaker, MdVerified } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";

/* Types */
type ElectronicListing = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  location: string;
  city: string;
  image: string;
  condition: "New" | "Used" | "Refurbished";
  isVerified?: boolean;
  isFeatured?: boolean;
  badge?: "New" | "Old" | "Warranty";
};

/*  Listings  */
const LISTINGS: ElectronicListing[] = [
  {
    id: "iphone-13-pro-kathmandu",
    title: "iPhone",
    brand: "Apple",
    category: "Mobile Phones",
    price: "Rs. 1,85,000",
    rating: 4.8,
    reviews: 120,
    location: "Lalitpur,Nepal",
    city: "Lalitpur",
    image: "/iphone.jpg",
    condition: "New",
    isVerified: true,
    isFeatured: true,
    badge: "New",
  },
  {
    id: "macbook-pro-m2-ktm",
    title: "Laptop",
    brand: "Apple",
    category: "Laptops",
    price: "Rs. 2,30,000",
    rating: 4.9,
    reviews: 120,
    location: "Kathmandu,Nepal",
    city: "Kathmandu",
    image: "/laptop.jpg",
    condition: "Used",
    isVerified: true,
    isFeatured: false,
    badge: "Old",
  },
  {
    id: "samsung-galaxy-watch-5",
    title: "Smartwatch",
    brand: "Samsung",
    category: "Smart Watches",
    price: "Rs. 1,500",
    rating: 4.8,
    reviews: 120,
    location: "Bhaktapur,Nepal",
    city: "Bhaktapur",
    image: "/smartwatch.jpg",
    condition: "Used",
    isVerified: true,
    isFeatured: false,
    badge: "Old",
  },
  {
    id: "canon-eos-r50-camera",
    title: "Camera",
    brand: "Canon",
    category: "Cameras",
    price: "15,000",
    rating: 4.8,
    reviews: 120,
    location: "Lalitpur,Nepal",
    city: "Lalitpur",
    image: "/camera.jpg",
    condition: "New",
    isVerified: true,
    isFeatured: true,
    badge: "Warranty",
  },
  {
    id: "iphone-13-pokhara",
    title: "iPhone 13 – 128GB Starlight",
    brand: "Apple",
    category: "Mobile Phones",
    price: "Rs. 1,65,000",
    rating: 4.7,
    reviews: 88,
    location: "Pokhara,Nepal",
    city: "Pokhara",
    image: "/iphone-13.avif",
    condition: "New",
    isVerified: false,
    isFeatured: false,
    badge: "New",
  },
  {
    id: "dell-xps-15-lalitpur",
    title: "Dell XPS 15 – Intel i7, 16GB RAM",
    brand: "Dell",
    category: "Laptops",
    price: "Rs. 1,95,000",
    rating: 4.6,
    reviews: 54,
    location: "Patan, Lalitpur",
    city: "Lalitpur",
    image: "/laptop.jpg",
    condition: "Refurbished",
    isVerified: true,
    isFeatured: false,
    badge: "Warranty",
  },
  {
    id: "samsung-s23-ultra-ktm",
    title: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    category: "Mobile Phones",
    price: "Rs. 1,40,000",
    rating: 4.7,
    reviews: 76,
    location: "Kathmandu,Nepal",
    city: "Kathmandu",
    image: "/iphone.jpg",
    condition: "New",
    isVerified: true,
    isFeatured: true,
    badge: "New",
  },
  {
    id: "apple-watch-ultra",
    title: "Apple Watch Ultra – 49mm",
    brand: "Apple",
    category: "Smart Watches",
    price: "Rs. 1,20,000",
    rating: 4.9,
    reviews: 45,
    location: "Thamel, Kathmandu",
    city: "Kathmandu",
    image: "/smartwatch.jpg",
    condition: "New",
    isVerified: false,
    isFeatured: false,
    badge: "New",
  },
];

const CONDITIONS_OPTIONS = [
  { value: "", label: "New,used,refurbished...." },
  { value: "New", label: "New" },
  { value: "Used", label: "Used" },
  { value: "Refurbished", label: "Refurbished" },
];
const BRANDS = ["All", "Apple", "Samsung", "Dell", "Asus", "Opps", "Others"];
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar"];

const CATEGORY_DATA: { label: string; icon: React.ReactNode; count: number }[] = [
  { label: "Mobile Phones", icon: <FiSmartphone size={20} />, count: 1245 },
  { label: "Laptops",       icon: <FaLaptop size={18} />,     count: 1245 },
  { label: "Gaming",        icon: <FaGamepad size={20} />,    count: 567  },
  { label: "Cameras",       icon: <FiCamera size={20} />,     count: 245  },
  { label: "Audio",         icon: <MdSpeaker size={20} />,    count: 345  },
  { label: "Smart Watches", icon: <FiWatch size={20} />,      count: 445  },
];

/*  Badge styles */
const badgeStyles: Record<string, { bg: string; text: string; border: string }> = {
  New:      { bg: "#eafaf1", text: "#1e8449", border: "#a9dfbf" },
  Old:      { bg: "#e0f7fa", text: "#00695c", border: "#80cbc4" },
  Warranty: { bg: "#ede7f6", text: "#6a1b9a", border: "#ce93d8" },
};

/*  Page Component */
export default function ElectronicsPage() {
  const [search,         setSearch]         = useState("");
  const [sort,           setSort]           = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [city,           setCity]           = useState("");
  const [condition,      setCondition]      = useState("");
  const [activeBrand,    setActiveBrand]    = useState("All");
  const [deliveryOnly,   setDeliveryOnly]   = useState(false);
  const [favorites,      setFavorites]      = useState<Record<string, boolean>>({});

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setActiveCategory("All");
    setCity("");
    setCondition("");
    setActiveBrand("All");
    setDeliveryOnly(false);
  };

  const displayed = LISTINGS.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      l.title.toLowerCase().includes(q) ||
      l.brand.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q);
    const matchCat   = activeCategory === "All" || l.category === activeCategory;
    const matchCity  = !city       || l.city === city;
    const matchCond  = !condition  || l.condition === condition;
    const matchBrand = activeBrand === "All" || l.brand === activeBrand;
    return matchSearch && matchCat && matchCity && matchCond && matchBrand;
  }).sort((a, b) => {
    if (sort === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    if (sort === "rating")   return b.rating - a.rating;
    return 0;
  });

  /* Chevron arrow for selects */
  const arrowBg = `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center`;

  return (
    <>
      {/* Pulse animation for verified dot */}
      <style>{`@keyframes ep-pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      <div style={{ background: "#f2f4f7", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

        {/* HERO  */}
        <section style={{ position: "relative", height: 220, overflow: "hidden", display: "flex", alignItems: "center" }}>
          {/* BG image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/electronicbanner.jpg')",
            backgroundSize: "cover", backgroundPosition: "center 40%",
            filter: "brightness(0.5)",
          }} />
          {/* gradient */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,rgba(5,10,40,0.85) 0%,rgba(50,5,80,0.5) 100%)",
          }} />

          {/* content */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 28px", width: "100%" }}>
            <h1 style={{
              fontSize: "clamp(24px,3.8vw,42px)", fontWeight: 900, color: "#fff",
              margin: "0 0 4px", lineHeight: 1.2,
              textShadow: "0 2px 18px rgba(0,0,0,0.5)",
            }}>
              Find The Best<br />
              <span style={{ color: "#a78bfa" }}>Electronics</span><br />
              Near You
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, margin: "4px 0 16px" }}>
              Phones, Laptop, Cameras, Gaming and more
            </p>

            {/* search */}
            <div style={{ position: "relative", maxWidth: 460 }}>
              <FiSearch
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#C0392B", pointerEvents: "none" }}
                size={17}
              />
              <input
                style={{
                  width: "100%", padding: "12px 16px 12px 42px",
                  background: "rgba(255,255,255,0.97)", border: "none", borderRadius: 12,
                  fontSize: 13, color: "#333", fontFamily: "inherit", outline: "none",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
                }}
                placeholder="Search electronics,brands,gadgets............"
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
                  border: `1.5px solid ${activeCategory === label ? "#7c3aed" : "#e4e8f0"}`,
                  background: activeCategory === label ? "#ede9fe" : "#fafbff",
                  transition: "all 0.18s", minWidth: 120, fontFamily: "inherit",
                  boxShadow: activeCategory === label ? "0 4px 14px rgba(124,58,237,0.18)" : "none",
                }}
              >
                <span style={{ color: activeCategory === label ? "#7c3aed" : "#666", display: "flex" }}>{icon}</span>
                <span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{label}</span>
                  <span style={{ display: "block", fontSize: 11, color: "#aaa" }}>{count.toLocaleString()} listings</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/*  BODY  */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" }}>

            {/*  SIDEBAR */}
            <aside style={{
              background: "#fff", borderRadius: 16,
              border: "1.5px solid #e4e8f0", overflow: "hidden",
              position: "sticky", top: 82,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              {/* head */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 18px 12px", borderBottom: "1.5px solid #f2f4f8",
              }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}>Filters</span>
                <button
                  onClick={reset}
                  style={{ fontSize: 13, fontWeight: 700, color: "#3b5bdb", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Reset
                </button>
              </div>

              {/* Location/City */}
              <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f2f4f8" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Location/City</p>
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

              {/* Condition */}
              <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f2f4f8" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Condition</p>
                <div style={{ position: "relative" }}>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 36px 10px 12px",
                      border: "1.5px solid #f0c0c0", borderRadius: 10,
                      fontSize: 13, color: "#777", fontFamily: "inherit",
                      background: `#fdf5f5 ${arrowBg}`, appearance: "none",
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    {CONDITIONS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brand */}
              <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f2f4f8" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Brand</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setActiveBrand(b)}
                      style={{
                        padding: "5px 13px", borderRadius: 100,
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.18s",
                        border: `1.5px solid ${activeBrand === b ? "#7c3aed" : "#e0e4f0"}`,
                        background: activeBrand === b ? "#7c3aed" : "#fff",
                        color: activeBrand === b ? "#fff" : "#555",
                        boxShadow: activeBrand === b ? "0 2px 8px rgba(124,58,237,0.28)" : "none",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f2f4f8" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Delivery</span>
                    <span style={{ display: "block", fontSize: 12, color: "#888", marginTop: 1 }}>Aviable Now</span>
                  </div>
                  {/* Toggle */}
                  <label style={{ position: "relative", display: "inline-block", width: 44, height: 24, cursor: "pointer", flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                      checked={deliveryOnly}
                      onChange={(e) => setDeliveryOnly(e.target.checked)}
                    />
                    <span style={{
                      position: "absolute", inset: 0, borderRadius: 24,
                      background: deliveryOnly ? "#7c3aed" : "#ddd",
                      transition: "background 0.25s",
                    }} />
                    <span style={{
                      position: "absolute", top: 3, left: deliveryOnly ? 23 : 3,
                      width: 18, height: 18, borderRadius: "50%", background: "#fff",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.25s",
                    }} />
                  </label>
                </div>
              </div>

              {/* Apply button */}
              <div style={{ padding: "12px 18px 18px" }}>
                <button
                  style={{
                    display: "block", width: "100%", padding: "13px",
                    textAlign: "center", fontFamily: "inherit",
                    background: "linear-gradient(90deg,#7c3aed,#5b21b6)",
                    color: "#fff", fontSize: 14, fontWeight: 800,
                    border: "none", borderRadius: 12, cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(124,58,237,0.32)",
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* ══ RIGHT COLUMN ═════════════════════════════════ */}
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
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#555", margin: "0 0 4px" }}>No electronics found</p>
                    <span style={{ fontSize: 13, color: "#aaa" }}>Try adjusting your filters or search</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    const bs = l.badge ? badgeStyles[l.badge] : null;
                    return (
                      <Link
                        key={l.id}
                        href={`/category/electronics/${l.id}`}
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
                        <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "#eeeaf8" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={l.image}
                            alt={l.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.06)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                          />

                          {/* Verified badge top-left */}
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

                          {/* Status badge bottom-right */}
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
                          <p style={{ fontSize: 15, fontWeight: 900, color: "#3b82f6", margin: 0 }}>
                            {l.price}
                          </p>

                          {/* rating */}
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                            <FiStar size={12} color="#f5a623" fill="#f5a623" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
                              {l.rating}({l.reviews})
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

              {/* Learn More */}
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button style={{
                  padding: "11px 36px", borderRadius: 10,
                  background: "none", border: "1.5px solid #d0d4e0",
                  fontSize: 14, fontWeight: 700, color: "#555",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.18s",
                }}>
                  Learn More
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
