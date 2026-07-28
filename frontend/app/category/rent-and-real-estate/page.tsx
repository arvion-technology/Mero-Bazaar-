"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiSearch, FiMapPin, FiStar } from "react-icons/fi";
import { FaHeart, FaStar, FaBuilding, FaHome, FaTree, FaStore, FaBriefcase } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import type { RentalListing, PropertyType } from "@/app/types/realestate";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type DisplayCard = {
  id: string;
  title: string;
  price: string;
  location: string;
  city: string;
  propertyType: PropertyType;
  typeLabel: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  isVerified: boolean;
  isFeatured: boolean;
  isFurnished: boolean;
  purpose: "Rent" | "Sale";
  rating: number;
  reviews: number;
};

const FALLBACK_IMAGE = "/property1.jpg";

function prefixImage(path: string | undefined): string {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  ROOM: "Room",
  FLAT: "Flat",
  APARTMENT: "Apartment",
  HOUSE: "House",
  HOSTEL: "Hostel",
  LAND: "Land",
  SHUTTER: "Shutter",
  OFFICE: "Office Space",
};

function toDisplayCard(listing: RentalListing): DisplayCard | null {
  const rental = listing.rental;
  if (!rental) return null;

  return {
    id: listing.id,
    title: listing.title,
    price:
      rental.listingType === "RENT"
        ? `Rs. ${rental.monthlyRent.toLocaleString()}/month`
        : `Rs. ${rental.monthlyRent.toLocaleString()}`,
    location: rental.area ? `${rental.area}, ${rental.city}` : rental.city,
    city: rental.city,
    propertyType: rental.propertyType,
    typeLabel: PROPERTY_TYPE_LABELS[rental.propertyType],
    beds: rental.bedrooms ?? 0,
    baths: rental.bathrooms ?? 0,
    sqft: rental.squareFeet ?? 0,
    image: prefixImage(listing.images?.[0]),
    isVerified: listing.user?.isVerified ?? false,
    isFeatured: false,
    isFurnished: rental.furnished,
    purpose: rental.listingType === "RENT" ? "Rent" : "Sale",
    rating: 0,
    reviews: 0,
  };
}

const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar"];

const CATEGORY_CARDS: { id: string; label: string; icon: typeof FaBuilding; matches: PropertyType[]; color: string }[] = [
  { id: "Apartment", label: "Apartment", icon: FaBuilding, matches: ["APARTMENT", "FLAT"], color: "#3b5bdb" },
  { id: "House", label: "House", icon: FaHome, matches: ["HOUSE"], color: "#2e7d32" },
  { id: "Land", label: "Land", icon: FaTree, matches: ["LAND"], color: "#6a9c3e" },
  { id: "Commercial", label: "Commercial", icon: FaStore, matches: ["SHUTTER"], color: "#e65100" },
  { id: "Office", label: "Office", icon: FaBriefcase, matches: ["OFFICE"], color: "#1565c0" },
];

const HERO_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&h=400&fit=crop";

export default function PropertyPage() {
  const [listings, setListings] = useState<DisplayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeType, setActiveType] = useState("All");

  const [filterSales, setFilterSales] = useState(false);
  const [filterRent, setFilterRent] = useState(false);
  const [filterBuy, setFilterBuy] = useState(false);
  const [filter1BHK, setFilter1BHK] = useState(false);
  const [filter2BHK, setFilter2BHK] = useState(false);
  const [filter3BHK, setFilter3BHK] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterFurnished, setFilterFurnished] = useState(false);
  const [filterUnfurnished, setFilterUnfurnished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/api/rental`);
        if (!res.ok) throw new Error(`Failed to load listings (${res.status})`);
        const data: RentalListing[] = await res.json();
        if (cancelled) return;
        const cards = data.map(toDisplayCard).filter((c): c is DisplayCard => c !== null);
        setListings(cards);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const resetFilters = () => {
    setActiveType("All");
    setFilterSales(false); setFilterRent(false); setFilterBuy(false);
    setFilter1BHK(false); setFilter2BHK(false); setFilter3BHK(false);
    setFilterCity(""); setFilterPrice("");
    setFilterFurnished(false); setFilterUnfurnished(false);
    setSearch("");
  };

  const activeCategory = CATEGORY_CARDS.find((c) => c.id === activeType);

  const displayed = listings.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());

    const matchType = activeType === "All" || (activeCategory ? activeCategory.matches.includes(l.propertyType) : true);

    const purposeFilters: string[] = [];
    if (filterSales) purposeFilters.push("Sale");
    if (filterRent) purposeFilters.push("Rent");
    const matchPurpose = filterBuy
      ? false // no "Buy" data exists on the backend yet
      : purposeFilters.length === 0 || purposeFilters.includes(l.purpose);

    const bhkFilters = [];
    if (filter1BHK) bhkFilters.push(1);
    if (filter2BHK) bhkFilters.push(2);
    if (filter3BHK) bhkFilters.push(3);
    const matchBHK = bhkFilters.length === 0 || bhkFilters.includes(l.beds);

    const matchCity = !filterCity || l.city === filterCity;

    const matchFurnished = (!filterFurnished && !filterUnfurnished) ||
      (filterFurnished && l.isFurnished) ||
      (filterUnfurnished && !l.isFurnished);

    return matchSearch && matchType && matchPurpose && matchBHK && matchCity && matchFurnished;
  }).sort((a, b) => {
    if (sort === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= Math.floor(rating) ? (
            <FaStar size={14} className="text-yellow-400" />
          ) : star - 0.5 <= rating ? (
            <FaStar size={14} className="text-yellow-400 opacity-60" />
          ) : (
            <FiStar size={14} className="text-gray-300" />
          )}
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .pp { background: #f0e6f6; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .pp-hero { position: relative; height: 320px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .pp-hero-bg { position: absolute; inset: 0; background: url('${HERO_IMAGE}') center / cover no-repeat; filter: brightness(0.5); }
        .pp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(180,30,50,0.6) 0%, rgba(80,20,60,0.4) 100%); }
        .pp-hero-inner { position: relative; z-index: 2; text-align: center; max-width: 700px; padding: 0 24px; }
        .pp-hero-title { font-size: clamp(24px, 4vw, 38px); font-weight: 800; color: #fff; margin: 0 0 8px; line-height: 1.2; text-shadow: 0 2px 12px rgba(0,0,0,0.3); }
        .pp-hero-sub { color: rgba(255,255,255,0.85); font-size: 14px; margin: 0 0 24px; font-weight: 500; }
        .pp-search-wrap { position: relative; max-width: 540px; margin: 0 auto; }
        .pp-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); z-index: 3; }
        .pp-search { width: 100%; padding: 14px 16px 14px 48px; background: rgba(255,255,255,0.98); border: none; border-radius: 12px; font-size: 14px; color: #333; font-family: inherit; outline: none; box-shadow: 0 8px 32px rgba(0,0,0,0.25); }
        .pp-search::placeholder { color: #999; }
        .pp-cats-strip { background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 24px 0; }
        .pp-cats-inner { max-width: 1200px; margin: 0 auto; padding: 0 28px; }
        .pp-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.8px; }
        .pp-cats-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .pp-cat-card { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-radius: 14px; border: 2px solid #e8e8e8; background: #fff; cursor: pointer; transition: all 0.2s ease; min-width: 160px; font-family: inherit; }
        .pp-cat-card:hover { border-color: #3b5bdb; background: #f8f9ff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,91,219,0.12); }
        .pp-cat-card.active { border-color: #3b5bdb; background: #eef2ff; box-shadow: 0 4px 16px rgba(59,91,219,0.2); }
        .pp-cat-icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pp-cat-info { display: flex; flex-direction: column; }
        .pp-cat-name { font-size: 15px; font-weight: 700; color: #1a1a1a; }
        .pp-cat-count { font-size: 12px; color: #888; font-weight: 500; }
        .pp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .pp-layout { display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start; }
        .pp-sidebar { background: #fff; border-radius: 16px; border: 1px solid #e8e8e8; overflow: hidden; position: sticky; top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .psf-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; background: #e74c3c; }
        .psf-head-title { font-size: 16px; font-weight: 800; color: #fff; margin: 0; }
        .psf-head-arrow { color: #fff; font-size: 20px; }
        .psf-section { padding: 16px 18px; border-bottom: 1px solid #f0f0f0; }
        .psf-section:last-of-type { border-bottom: none; }
        .psf-label { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px; }
        .psf-checkbox { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; cursor: pointer; }
        .psf-checkbox:last-child { margin-bottom: 0; }
        .psf-checkbox input { width: 18px; height: 18px; accent-color: #e74c3c; cursor: pointer; }
        .psf-checkbox span { font-size: 13px; color: #444; font-weight: 500; }
        .psf-select { width: 100%; padding: 10px 32px 10px 12px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 13px; color: #444; font-family: inherit; background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center; appearance: none; outline: none; cursor: pointer; }
        .psf-select:focus { border-color: #e74c3c; }
        .psf-readmore { display: block; width: 100%; padding: 12px; text-align: center; background: #f8f8f8; color: #333; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; border-top: 1px solid #f0f0f0; transition: background 0.2s; }
        .psf-readmore:hover { background: #f0f0f0; }
        .pp-results-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .pp-results-count { font-size: 14px; color: #888; font-weight: 500; }
        .pp-results-count strong { color: #333; font-weight: 700; }
        .pp-sort-select { padding: 8px 32px 8px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 13px; font-weight: 600; color: #333; background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center; appearance: none; outline: none; cursor: pointer; font-family: inherit; }
        .pp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .pp-card { background: #fff; border-radius: 16px; border: 1px solid #e8e8e8; overflow: hidden; text-decoration: none; display: flex; flex-direction: column; transition: box-shadow 0.22s ease; box-shadow: 0 2px 12px rgba(0,0,0,0.04); cursor: pointer; position: relative; }
        .pp-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
        .pp-card-img-wrap { position: relative; width: 100%; height: 200px; overflow: hidden; background: #e8eaf0; }
        .pp-card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pp-card-badges { position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; }
        .pp-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
        .pp-badge-rent { background: #e8f5e9; color: #2e7d32; }
        .pp-badge-sale { background: #fff3e0; color: #e65100; }
        .pp-badge-furnished { position: absolute; top: 12px; right: 12px; background: #e8f5e9; color: #2e7d32; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
        .pp-heart { position: absolute; bottom: 12px; right: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.95); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 4; padding: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.15); transition: transform 0.18s; }
        .pp-heart:hover { transform: scale(1.15); }
        .pp-card-body { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 6px; }
        .pp-card-title { font-size: 17px; font-weight: 700; color: #1a1a1a; margin: 0; }
        .pp-card-price { font-size: 15px; font-weight: 700; color: #e74c3c; margin: 0; }
        .pp-card-details { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #666; }
        .pp-card-detail-item { display: flex; align-items: center; gap: 4px; }
        .pp-card-location { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; }
        .pp-card-rating { display: flex; align-items: center; gap: 12px; }
        .pp-card-reviews { font-size: 12px; color: #888; }
        .pp-btn-details { display: inline-block; padding: 8px 20px; background: #ffcdcd; color: #c0392b; font-size: 12px; font-weight: 700; border: none; border-radius: 20px; cursor: pointer; font-family: inherit; transition: background 0.2s; margin-top: 6px; align-self: flex-start; }
        .pp-btn-details:hover { background: #ffb8b8; }
        .pp-empty { padding: 64px 24px; text-align: center; background: #fff; border-radius: 16px; grid-column: 1 / -1; }
        .pp-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .pp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .pp-empty span { font-size: 13px; color: #aaa; }
        @media (max-width: 960px) { .pp-layout { grid-template-columns: 1fr; } .pp-sidebar { display: none; } .pp-cats-row { justify-content: center; } }
        @media (max-width: 640px) { .pp-hero { height: 260px; } .pp-body { padding: 20px 16px 40px; } .pp-grid { grid-template-columns: 1fr; } .pp-card-body { padding: 14px 16px 16px; } .pp-cat-card { min-width: 140px; padding: 12px 16px; } }
      `}</style>

      <div className="pp">
        <section className="pp-hero">
          <div className="pp-hero-bg" />
          <div className="pp-hero-overlay" />
          <div className="pp-hero-inner">
            <h1 className="pp-hero-title">
              Find The Best<br />
              Rent & Real Estate Services
            </h1>
            <p className="pp-hero-sub">Trusted Real Estate Services Since 2015</p>
            <div className="pp-search-wrap">
              <FiSearch className="pp-search-icon" size={18} color="#999" />
              <input
                className="pp-search"
                placeholder="Search rent, sales, buy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="pp-cats-strip">
          <div className="pp-cats-inner">
            <p className="pp-cats-label">Property Categories</p>
            <div className="pp-cats-row">
              {CATEGORY_CARDS.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeType === cat.id;
                const count = listings.filter((l) => cat.matches.includes(l.propertyType)).length;
                return (
                  <button
                    key={cat.id}
                    className={`pp-cat-card${isActive ? " active" : ""}`}
                    onClick={() => setActiveType(isActive ? "All" : cat.id)}
                  >
                    <div
                      className="pp-cat-icon-wrap"
                      style={{ background: isActive ? cat.color + "20" : "#f5f5f5", color: cat.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="pp-cat-info">
                      <span className="pp-cat-name">{cat.label}</span>
                      <span className="pp-cat-count">{count.toLocaleString()} listings</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="pp-body">
          <div className="pp-layout">
            <aside className="pp-sidebar">
              <div className="psf-head">
                <p className="psf-head-title">Filters</p>
                <span className="psf-head-arrow">&gt;</span>
              </div>

              <div className="psf-section">
                <p className="psf-label">Property Type</p>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterSales} onChange={(e) => setFilterSales(e.target.checked)} />
                  <span>Sales</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterRent} onChange={(e) => setFilterRent(e.target.checked)} />
                  <span>Rent</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterBuy} onChange={(e) => setFilterBuy(e.target.checked)} />
                  <span>Buy</span>
                </label>
              </div>

              <div className="psf-section">
                <p className="psf-label">Room Types</p>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filter1BHK} onChange={(e) => setFilter1BHK(e.target.checked)} />
                  <span>1BHK</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filter2BHK} onChange={(e) => setFilter2BHK(e.target.checked)} />
                  <span>2BHK</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filter3BHK} onChange={(e) => setFilter3BHK(e.target.checked)} />
                  <span>3BHK</span>
                </label>
              </div>

              <div className="psf-section">
                <p className="psf-label">City</p>
                <select className="psf-select" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="psf-section">
                <p className="psf-label">Price</p>
                <select className="psf-select" value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
                  <option value="">Select price</option>
                  <option value="low">Below Rs. 20,000</option>
                  <option value="mid">Rs. 20,000 - 50,000</option>
                  <option value="high">Above Rs. 50,000</option>
                </select>
              </div>

              <div className="psf-section">
                <p className="psf-label">Furnished status</p>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterFurnished} onChange={(e) => setFilterFurnished(e.target.checked)} />
                  <span>Yes</span>
                </label>
                <label className="psf-checkbox">
                  <input type="checkbox" checked={filterUnfurnished} onChange={(e) => setFilterUnfurnished(e.target.checked)} />
                  <span>No</span>
                </label>
              </div>

              <button className="psf-readmore" onClick={resetFilters}>Reset All Filters</button>
            </aside>

            <div>
              <div className="pp-results-bar">
                <span className="pp-results-count">
                  <strong>{displayed.length}</strong> results found
                </span>
                <select className="pp-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="featured">Featured</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="pp-grid">
                {loading ? (
                  <div className="pp-empty">
                    <p>Loading listings…</p>
                  </div>
                ) : loadError ? (
                  <div className="pp-empty">
                    <div className="pp-empty-icon">⚠️</div>
                    <p>Couldn't load listings</p>
                    <span>{loadError}</span>
                  </div>
                ) : displayed.length === 0 ? (
                  <div className="pp-empty">
                    <div className="pp-empty-icon">🏠</div>
                    <p>No properties found</p>
                    <span>Try adjusting your filters or search</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    return (
                      <Link key={l.id} href={`/category/rent-and-real-estate/${l.id}`} className="pp-card">
                        <div className="pp-card-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.image} alt={l.title} className="pp-card-img" />
                          <div className="pp-card-badges">
                            <span className={`pp-badge pp-badge-${l.purpose.toLowerCase()}`}>
                              {l.purpose}
                            </span>
                          </div>
                          {l.isFurnished && (
                            <span className="pp-badge-furnished">Full Furnished</span>
                          )}
                          <button className="pp-heart" aria-label="Save" onClick={(e) => toggleFav(l.id, e)}>
                            {isFav ? <FaHeart size={16} color="#E74C3C" /> : <FiHeart size={16} color="#999" />}
                          </button>
                        </div>
                        <div className="pp-card-body">
                          <h3 className="pp-card-title">{l.title}</h3>
                          <p className="pp-card-price">{l.price}</p>
                          <div className="pp-card-details">
                            <span className="pp-card-detail-item">
                              {l.beds} beds, {l.baths} bath
                            </span>
                            <span className="pp-card-location">
                              <FiMapPin size={12} color="#bbb" />
                              {l.location}
                            </span>
                          </div>
                          <div className="pp-card-rating">
                            <StarRating rating={l.rating} />
                            <span className="pp-card-reviews">({l.reviews} Reviews)</span>
                          </div>
                          <button className="pp-btn-details">View Details</button>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}