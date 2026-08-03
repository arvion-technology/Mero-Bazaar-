"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiHeart,
  FiGrid,
  FiScissors,
  FiDroplet,
} from "react-icons/fi";
import {
  FaHeart,
  FaPaintBrush,
  FaHandSparkles,
} from "react-icons/fa";
import type { IconType } from "react-icons";

/* ─────────── TYPES ─────────── */
type PriceRange = "Under Rs.100" | "Rs.100 - Rs.200" | "Rs.200 - Rs.500" | "Above Rs.1000";

type ServiceCategory = "All" | "Makeup" | "Hair" | "Nails" | "Skin";

type HomeVisit = "Home Visit Available";

type BridalPackage = "Bridal Service";

type ServiceType = "Makeup" | "Hair" | "Nails" | "Skin" | "Spa & Massage" | "Threading & Waxing";

type Gender = "Any" | "Female Only" | "Male Only";

type BeautyService = {
  id: string;
  name: string;
  category: string;
  subServices: string[];
  price: string;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  isHomeVisit: boolean;
  postedDaysAgo: number;
  gender: Gender;
};

/* ─────────── CATEGORY ICONS ─────────── */
const SERVICE_CATEGORIES: { name: ServiceCategory; icon: IconType; count: number; color: string }[] = [
  { name: "All", icon: FiGrid, count: 117, color: "#374151" },
  { name: "Makeup", icon: FaPaintBrush, count: 45, color: "#e11d48" },
  { name: "Hair", icon: FiScissors, count: 32, color: "#7c3aed" },
  { name: "Nails", icon: FaHandSparkles, count: 18, color: "#0f766e" },
  { name: "Skin", icon: FiDroplet, count: 22, color: "#1d4ed8" },
];

/* ─────────── DATA ─────────── */
const SERVICES: BeautyService[] = [
  {
    id: "nail-extension",
    name: "Nail Extension",
    category: "Nails",
    subServices: ["Acrylic", "Gel", "Nail Art"],
    price: "NPR 2,000",
    rating: 4.8,
    reviewCount: 128,
    images: ["/beauty-nails.jpg"],
    tags: ["Nails", "Acrylic"],
    isHomeVisit: true,
    postedDaysAgo: 1,
    gender: "Female Only",
  },
  {
    id: "hair-highlights",
    name: "Hair Highlights",
    category: "Hair",
    subServices: ["Global Highlights", "Hair Cut", "Styling"],
    price: "NPR 3,500",
    rating: 4.9,
    reviewCount: 198,
    images: ["/beauty-hair.jpg"],
    tags: ["Hair", "Coloring"],
    isHomeVisit: false,
    postedDaysAgo: 2,
    gender: "Any",
  },
  {
    id: "bridal-makeup",
    name: "Bridal Makeup",
    category: "Makeup",
    subServices: ["HD Makeup", "Hair Style", "Draping"],
    price: "NPR 8,500",
    rating: 4.8,
    reviewCount: 102,
    images: ["/beauty-bridal.jpg"],
    tags: ["Makeup", "Bridal"],
    isHomeVisit: true,
    postedDaysAgo: 0,
    gender: "Female Only",
  },
  {
    id: "facial-treatment",
    name: "Facial Treatment",
    category: "Skin",
    subServices: ["Glow Facial", "Deep Cleansing Facial"],
    price: "NPR 2,200",
    rating: 4.7,
    reviewCount: 127,
    images: ["/beauty-facial.jpg"],
    tags: ["Skin", "Facial"],
    isHomeVisit: false,
    postedDaysAgo: 1,
    gender: "Any",
  },
  {
    id: "mehandi-design",
    name: "Mehandi Design",
    category: "Nails",
    subServices: ["Bridal Mehandi", "Arabic Design"],
    price: "NPR 1,500",
    rating: 4.9,
    reviewCount: 128,
    images: ["/beauty-mehandi.jpg"],
    tags: ["Nails", "Mehandi"],
    isHomeVisit: true,
    postedDaysAgo: 3,
    gender: "Female Only",
  },
  {
    id: "waxing-service",
    name: "Waxing Service",
    category: "Skin",
    subServices: ["Full Body Wax", "Arm & Leg Wax"],
    price: "NPR 1,500",
    rating: 4.5,
    reviewCount: 102,
    images: ["/beauty-waxing.jpg"],
    tags: ["Skin", "Waxing"],
    isHomeVisit: false,
    postedDaysAgo: 2,
    gender: "Any",
  },
];

const PRICE_RANGES: PriceRange[] = [
  "Under Rs.100",
  "Rs.100 - Rs.200",
  "Rs.200 - Rs.500",
  "Above Rs.1000",
];

const SERVICE_TYPES: ServiceType[] = [
  "Makeup",
  "Hair",
  "Nails",
  "Skin",
  "Spa & Massage",
  "Threading & Waxing",
];

const GENDERS: { name: Gender; label: string }[] = [
  { name: "Any", label: "Any" },
  { name: "Female Only", label: "Female Only" },
  { name: "Male Only", label: "Male Only" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

/* ─────────── PRICE PARSER ─────────── */
const parsePrice = (priceStr: string): number => {
  const match = priceStr.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

/* ─────────── COMPONENT ─────────── */
export default function BeautyWellnessPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("All");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [homeVisit, setHomeVisit] = useState(false);
  const [bridalPackage, setBridalPackage] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<ServiceType[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender>("Any");
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const togglePriceRange = (pr: PriceRange) =>
    setSelectedPriceRanges((prev) =>
      prev.includes(pr) ? prev.filter((x) => x !== pr) : [...prev, pr]
    );

  const toggleServiceType = (st: ServiceType) =>
    setSelectedServiceTypes((prev) =>
      prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
    );

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const nextImage = (id: string, total: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndices((p) => ({ ...p, [id]: ((p[id] || 0) + 1) % total }));
  };

  const prevImage = (id: string, total: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndices((p) => ({ ...p, [id]: ((p[id] || 0) - 1 + total) % total }));
  };

  const reset = () => {
    setSelectedPriceRanges([]);
    setHomeVisit(false);
    setBridalPackage(false);
    setSelectedServiceTypes([]);
    setSelectedGender("Any");
    setActiveCategory("All");
    setSearch("");
    setSort("newest");
  };

  const displayed = SERVICES.filter((s) => {
    const searchLower = search.toLowerCase();
    if (searchLower && !s.name.toLowerCase().includes(searchLower) && !s.category.toLowerCase().includes(searchLower)) return false;
    if (activeCategory !== "All" && s.category !== activeCategory) return false;
    if (selectedServiceTypes.length && !selectedServiceTypes.some(st => s.subServices.some(sub => sub.toLowerCase().includes(st.toLowerCase()) || s.category.toLowerCase() === st.toLowerCase()))) return false;

    if (selectedPriceRanges.length) {
      const price = parsePrice(s.price);
      const matches = selectedPriceRanges.some((range) => {
        if (range === "Under Rs.100") return price < 100;
        if (range === "Rs.100 - Rs.200") return price >= 100 && price <= 200;
        if (range === "Rs.200 - Rs.500") return price >= 200 && price <= 500;
        if (range === "Above Rs.1000") return price > 1000;
        return false;
      });
      if (!matches) return false;
    }

    if (homeVisit && !s.isHomeVisit) return false;
    if (selectedGender !== "Any" && s.gender !== selectedGender) return false;

    return true;
  });

  const sortedDisplayed = [...displayed].sort((a, b) => {
    if (sort === "newest") return a.postedDaysAgo - b.postedDaysAgo;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price-low") return parsePrice(a.price) - parsePrice(b.price);
    if (sort === "price-high") return parsePrice(b.price) - parsePrice(a.price);
    if (sort === "popular") return b.reviewCount - a.reviewCount;
    return 0;
  });

  const sortLabel: Record<string, string> = {
    newest: "Newest",
    "price-low": "Price Low to High",
    "price-high": "Price High to Low",
    rating: "Highest Rated",
    popular: "Most Popular",
  };

  const renderStars = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={10}
            fill={i < fullStars ? "#f59e0b" : i === fullStars && hasHalf ? "#f59e0b" : "none"}
            color={i < fullStars || (i === fullStars && hasHalf) ? "#f59e0b" : "#d1d5db"}
          />
        ))}
        <span style={{ fontSize: 10, fontWeight: 700, color: "#111", marginLeft: 3 }}>{rating}</span>
        <span style={{ fontSize: 9, color: "#9ca3af", marginLeft: 2 }}>({reviewCount} Reviews)</span>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .bw-wrap {
          min-height: 100vh;
          background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── HERO ── */
        .bw-hero {
          position: relative;
          height: 220px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .bw-hero-bg {
          position: absolute; inset: 0;
          background: url('/hero-beauty.jpg') center center / cover no-repeat;
          filter: brightness(0.5);
        }
        .bw-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%);
        }
        .bw-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .bw-hero-inner h1 {
          font-size: 26px; font-weight: 800; color: #fff;
          margin: 0 0 6px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .bw-hero-inner p {
          color: rgba(255,255,255,0.75); font-size: 13px; margin: 0 0 16px;
          line-height: 1.5;
        }
        .bw-search-wrap { position: relative; max-width: 520px; }
        .bw-search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #aaa;
        }
        .bw-search {
          width: 100%; padding: 11px 14px 11px 42px;
          background: #fff; border: none; border-radius: 8px;
          font-size: 14px; color: #333; outline: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          font-family: inherit;
        }

        /* ── CATEGORY STRIP ── */
        .bw-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0;
        }
        .bw-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
        }
        .bw-cats-label {
          font-size: 13px; font-weight: 700; color: #888;
          margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px;
        }
        .bw-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .bw-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          min-width: 120px; font-family: inherit; text-align: left;
        }
        .bw-cat-card:hover {
          border-color: #e11d48; background: #fff1f2;
          transform: translateY(-2px); box-shadow: 0 4px 16px rgba(225,29,72,0.12);
        }
        .bw-cat-card.active {
          border-color: #e11d48; background: #ffe4e6;
          box-shadow: 0 4px 16px rgba(225,29,72,0.2);
        }
        .bw-cat-icon { font-size: 22px; display: flex; align-items: center; }
        .bw-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .bw-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY LAYOUT ── */
        .bw-body {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 20px 60px; display: flex; gap: 18px;
        }

        /* ── SIDEBAR ── */
        .bw-sidebar {
          width: 220px; flex-shrink: 0;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          align-self: flex-start;
          position: sticky; top: 16px;
          overflow: hidden;
        }
        .bw-sb-head {
          padding: 14px 16px 10px;
          font-size: 15px; font-weight: 800; color: #1a1a1a;
          border-bottom: 1px solid #f0f0f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .bw-sb-head svg { color: #9ca3af; }
        .bw-sb-section {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .bw-sb-section:last-of-type { border-bottom: none; }
        .bw-sb-title {
          font-size: 13px; font-weight: 700; color: #374151;
          margin-bottom: 10px;
        }

        /* Service Category Icons */
        .bw-cat-row {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .bw-cat-btn {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 8px 6px; border-radius: 8px;
          border: 1.5px solid #e5e7eb; background: #fff;
          cursor: pointer; transition: all 0.15s;
          min-width: 52px; font-family: inherit;
        }
        .bw-cat-btn:hover {
          border-color: #e11d48; background: #fff1f2;
        }
        .bw-cat-btn.active {
          border-color: #e11d48; background: #ffe4e6;
        }
        .bw-cat-icon { line-height: 1; color: #374151; }
        .bw-cat-btn.active .bw-cat-icon { color: #e11d48; }
        .bw-cat-label { font-size: 9px; font-weight: 600; color: #374151; }
        .bw-cat-btn.active .bw-cat-label { color: #e11d48; font-weight: 700; }

        /* Checkbox */
        .bw-check-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px; cursor: pointer;
        }
        .bw-check-row:last-child { margin-bottom: 0; }
        .bw-checkbox {
          width: 14px; height: 14px; border-radius: 3px;
          border: 1.5px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff; transition: all 0.15s;
          cursor: pointer;
        }
        .bw-checkbox.checked {
          border-color: #e11d48;
          background: #e11d48;
        }
        .bw-checkbox.checked::after {
          content: "✓";
          color: #fff;
          font-size: 9px;
          font-weight: 800;
        }
        .bw-check-label {
          font-size: 12px; color: #374151; font-weight: 500;
        }
        .bw-check-label.checked { color: #111; font-weight: 700; }

        /* Service Type Grid */
        .bw-type-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 6px 4px;
        }
        .bw-type-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #6b7280; cursor: pointer;
        }
        .bw-type-item input {
          width: 12px; height: 12px; accent-color: #e11d48;
        }

        /* Gender Pills */
        .bw-gender-row {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .bw-gender-btn {
          padding: 5px 10px;
          border-radius: 6px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 11px; font-weight: 600; color: #374151;
          cursor: pointer; font-family: inherit;
          transition: all 0.15s;
        }
        .bw-gender-btn:hover {
          border-color: #e11d48; color: #e11d48;
        }
        .bw-gender-btn.active {
          background: #e11d48; color: #fff;
          border-color: #e11d48;
        }

        /* Sort */
        .bw-sort-select {
          width: 100%; padding: 7px 10px; border-radius: 7px;
          border: 1px solid #e0e4f0; font-size: 12px; color: #444;
          background: #f9fafb; outline: none; font-family: inherit;
          cursor: pointer;
        }
        .bw-sort-select:focus { border-color: #e11d48; }

        .bw-more-btn {
          display: block; width: 100%;
          padding: 10px;
          background: #f3f4f6; color: #111;
          font-size: 13px; font-weight: 700; border: none;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s;
          text-align: center;
        }
        .bw-more-btn:hover { background: #e5e7eb; }

        /* ── MAIN ── */
        .bw-main { flex: 1; min-width: 0; }
        .bw-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
        }
        .bw-count { font-size: 15px; color: #6b7280; font-weight: 600; }
        .bw-count strong { color: #111; font-weight: 800; }

        /* ── CUSTOM SORT DROPDOWN (No overflow issues) ── */
        .bw-sort-dropdown { position: relative; }
        .bw-sort-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          background: #fff; border: 1px solid #e0e4f0;
          border-radius: 8px; font-size: 13px; font-weight: 600;
          color: #333; cursor: pointer; font-family: inherit;
          transition: border-color 0.2s;
        }
        .bw-sort-btn:hover { border-color: #bbb; }
        .bw-sort-menu {
          position: absolute; top: calc(100% + 6px); right: 0;
          min-width: 180px;
          background: #fff; border: 1.5px solid #e0e0e0; border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 200;
          overflow: hidden;
          animation: sortFade 0.15s ease;
        }
        @keyframes sortFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bw-sort-option {
          padding: 10px 16px; font-size: 13px; color: #444;
          cursor: pointer; transition: all 0.15s;
          border-bottom: 1px solid #f5f5f5;
        }
        .bw-sort-option:last-child { border-bottom: none; }
        .bw-sort-option:hover { background: #fff1f2; color: #e11d48; }
        .bw-sort-option.active { background: #e11d48; color: #fff; }

        /* ── CARD GRID ── */
        .bw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* ── CARD ── */
        .bw-card {
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none; color: inherit;
        }
        .bw-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }

        .bw-card-img-wrap {
          position: relative; width: 100%; aspect-ratio: 4/3;
          overflow: hidden; background: #e5e7eb;
        }
        .bw-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s;
        }
        .bw-card:hover .bw-card-img { transform: scale(1.06); }

        .bw-card-fav {
          position: absolute; top: 8px; right: 8px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0; z-index: 2;
        }
        .bw-card-fav:hover { transform: scale(1.15); }

        .bw-carousel-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(0,0,0,0.35); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; transition: background 0.15s; padding: 0;
        }
        .bw-carousel-btn:hover { background: rgba(0,0,0,0.55); }
        .bw-carousel-btn.prev { left: 8px; }
        .bw-carousel-btn.next { right: 8px; }

        .bw-card-body { padding: 14px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .bw-card-name { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
        .bw-card-subs {
          font-size: 11px; color: #9ca3af; font-weight: 500;
          display: flex; gap: 4px; flex-wrap: wrap;
        }
        .bw-card-subs span:not(:last-child)::after {
          content: "•";
          margin-left: 4px; color: #d1d5db;
        }
        .bw-card-price-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 4px;
        }
        .bw-card-price-label {
          font-size: 10px; color: #9ca3af; font-weight: 500;
        }
        .bw-card-price {
          font-size: 12px; font-weight: 700; color: #e11d48;
        }
        .bw-card-stars {
          margin-top: 2px;
        }
        .bw-card-btn {
          display: block; width: 100%;
          padding: 9px 12px;
          background: #e11d48; color: #fff;
          font-size: 12px; font-weight: 700;
          border: none; border-radius: 6px;
          cursor: pointer; font-family: inherit;
          text-align: center; text-decoration: none;
          transition: background 0.15s;
          margin-top: 8px;
        }
        .bw-card-btn:hover {
          background: #be123c;
        }

        /* ── LOAD MORE ── */
        .bw-load-more { text-align: center; margin-top: 28px; }
        .bw-load-more-btn {
          font-size: 13px; font-weight: 600; color: #6b7280;
          background: none; border: none; cursor: pointer;
          padding: 8px 20px; border-radius: 6px;
          font-family: inherit; transition: background 0.15s, color 0.15s;
        }
        .bw-load-more-btn:hover { background: #f3f4f6; color: #374151; }

        /* ── EMPTY ── */
        .bw-empty {
          text-align: center; padding: 60px 24px;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
        }
        .bw-empty-icon { margin-bottom: 12px; color: #bbb; }
        .bw-empty p { font-weight: 700; font-size: 16px; color: #111; margin: 0 0 4px; }
        .bw-empty span { font-size: 13px; color: #888; }
        .bw-empty-btn {
          margin-top: 12px; padding: 9px 22px;
          background: #e11d48; color: #fff; font-weight: 700;
          font-size: 13px; border: none; border-radius: 7px;
          cursor: pointer; font-family: inherit;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .bw-sidebar { display: none; }
          .bw-grid { grid-template-columns: repeat(2, 1fr); }
          .bw-cats-row { gap: 8px; }
          .bw-cat-card { min-width: 120px; padding: 8px 12px; }
        }

        /* ── MOBILE: Compact horizontal-scroll categories ── */
        @media (max-width: 640px) {
          .bw-grid { grid-template-columns: 1fr; }
          .bw-body { padding: 14px 14px 40px; }
          .bw-cats-strip { padding: 14px 0; }
          .bw-cats-inner { padding: 0 12px; }
          .bw-cats-label { font-size: 11px; margin-bottom: 10px; }
          .bw-cats-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 8px;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .bw-cats-row::-webkit-scrollbar { display: none; }
          .bw-cat-card {
            min-width: auto;
            padding: 8px 14px;
            gap: 8px;
            border-radius: 10px;
            border-width: 1.5px;
            flex-shrink: 0;
          }
          .bw-cat-icon { font-size: 18px; }
          .bw-cat-icon svg { width: 18px; height: 18px; }
          .bw-cat-name { font-size: 13px; white-space: nowrap; }
          .bw-cat-count { font-size: 11px; white-space: nowrap; }
        }
      `}</style>

      <div className="bw-wrap">

        {/* ── HERO ── */}
        <section className="bw-hero">
          <div className="bw-hero-bg" />
          <div className="bw-hero-overlay" />
          <div className="bw-hero-inner">
            <h1>Find The Best<br />Hair, Beauty & Wellness Services</h1>
            <p>Trusted Professionals ready to serve you</p>
            <div className="bw-search-wrap">
              <FiSearch className="bw-search-icon" size={16} />
              <input
                className="bw-search"
                placeholder="Search salons, services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY STRIP ── */}
        <section className="bw-cats-strip">
          <div className="bw-cats-inner">
            <p className="bw-cats-label">Browse Categories</p>
            <div className="bw-cats-row">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  className={`bw-cat-card${activeCategory === cat.name ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <span className="bw-cat-icon" style={{ color: cat.color }}>
                    <cat.icon size={22} />
                  </span>
                  <span>
                    <span className="bw-cat-name">{cat.name}</span>
                    <span className="bw-cat-count">{cat.count} listings</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="bw-body">

          {/* ── SIDEBAR ── */}
          <aside className="bw-sidebar">
            <div className="bw-sb-head">
              Filter
              <FiChevronDown size={16} />
            </div>

            {/* Service Category */}
            <div className="bw-sb-section">
              <p className="bw-sb-title">Service Category</p>
              <div className="bw-cat-row">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    className={`bw-cat-btn${activeCategory === cat.name ? " active" : ""}`}
                    onClick={() => setActiveCategory(cat.name)}
                  >
                    <span className="bw-cat-icon"><cat.icon size={20} /></span>
                    <span className="bw-cat-label">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bw-sb-section">
              <p className="bw-sb-title">Price range</p>
              {PRICE_RANGES.map((pr) => (
                <div key={pr} className="bw-check-row" onClick={() => togglePriceRange(pr)}>
                  <div className={`bw-checkbox${selectedPriceRanges.includes(pr) ? " checked" : ""}`} />
                  <span className={`bw-check-label${selectedPriceRanges.includes(pr) ? " checked" : ""}`}>{pr}</span>
                </div>
              ))}
            </div>

            {/* Home Visit */}
            <div className="bw-sb-section">
              <p className="bw-sb-title">Home Visit</p>
              <div className="bw-check-row" onClick={() => setHomeVisit(!homeVisit)}>
                <div className={`bw-checkbox${homeVisit ? " checked" : ""}`} />
                <span className={`bw-check-label${homeVisit ? " checked" : ""}`}>Home Visit Available</span>
              </div>
            </div>

            {/* Bridal Packages */}
            <div className="bw-sb-section">
              <p className="bw-sb-title">Bridal Packages</p>
              <div className="bw-check-row" onClick={() => setBridalPackage(!bridalPackage)}>
                <div className={`bw-checkbox${bridalPackage ? " checked" : ""}`} />
                <span className={`bw-check-label${bridalPackage ? " checked" : ""}`}>Bridal Service</span>
              </div>
            </div>

            {/* Service Type */}
            <div className="bw-sb-section">
              <p className="bw-sb-title">Service Type</p>
              <div className="bw-type-grid">
                {SERVICE_TYPES.map((st) => (
                  <label key={st} className="bw-type-item">
                    <input
                      type="checkbox"
                      checked={selectedServiceTypes.includes(st)}
                      onChange={() => toggleServiceType(st)}
                    />
                    {st}
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="bw-sb-section">
              <p className="bw-sb-title">Gender</p>
              <div className="bw-gender-row">
                {GENDERS.map((g) => (
                  <button
                    key={g.name}
                    className={`bw-gender-btn${selectedGender === g.name ? " active" : ""}`}
                    onClick={() => setSelectedGender(g.name)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="bw-sb-section">
              <p className="bw-sb-title">Sort By</p>
              <div style={{ position: "relative" }}>
                <select
                  className="bw-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <FiChevronDown
                  size={12}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#666" }}
                />
              </div>
            </div>

            <button className="bw-more-btn" onClick={reset}>More</button>
          </aside>

          {/* ── MAIN ── */}
          <div className="bw-main">
            {/* Results bar */}
            <div className="bw-results-bar">
              <span className="bw-count">
                <strong>{sortedDisplayed.length}</strong> Hair, Beauty & Wellness found
              </span>

              {/* ── CUSTOM SORT DROPDOWN (fixes overflow) ── */}
              <div className="bw-sort-dropdown" ref={sortRef}>
                <button className="bw-sort-btn" onClick={() => setIsSortOpen((v) => !v)}>
                  {sortLabel[sort]}
                  <FiChevronDown
                    size={14}
                    style={{ transform: isSortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  />
                </button>
                {isSortOpen && (
                  <div className="bw-sort-menu">
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        className={`bw-sort-option${sort === opt.value ? " active" : ""}`}
                        onClick={() => {
                          setSort(opt.value);
                          setIsSortOpen(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cards */}
            {sortedDisplayed.length === 0 ? (
              <div className="bw-empty">
                <div className="bw-empty-icon">
                  <FiScissors size={48} />
                </div>
                <p>No services found</p>
                <span>Try adjusting your filters or search term</span>
                <br />
                <button className="bw-empty-btn" onClick={reset}>Reset Filters</button>
              </div>
            ) : (
              <div className="bw-grid">
                {sortedDisplayed.map((item) => {
                  const isFav = !!favorites[item.id];
                  const currentImg = imageIndices[item.id] || 0;
                  const hasMultiple = item.images.length > 1;

                  return (
                    <div key={item.id} className="bw-card">
                      {/* Image */}
                      <Link
                        href={`/category/beauty/${item.id}`}
                        className="bw-card-img-wrap"
                        style={{ display: "block", textDecoration: "none" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.images[currentImg]} alt={item.name} className="bw-card-img" />

                        {/* Fav */}
                        <button className="bw-card-fav" onClick={(e) => toggleFav(item.id, e)}>
                          {isFav
                            ? <FaHeart size={12} color="#ef4444" />
                            : <FiHeart size={12} color="#9ca3af" />}
                        </button>

                        {/* Carousel */}
                        {hasMultiple && (
                          <>
                            <button
                              className="bw-carousel-btn prev"
                              onClick={(e) => prevImage(item.id, item.images.length, e)}
                            >
                              <FiChevronLeft size={14} />
                            </button>
                            <button
                              className="bw-carousel-btn next"
                              onClick={(e) => nextImage(item.id, item.images.length, e)}
                            >
                              <FiChevronRight size={14} />
                            </button>
                          </>
                        )}
                      </Link>

                      {/* Body */}
                      <div className="bw-card-body">
                        <p className="bw-card-name">{item.name}</p>
                        <div className="bw-card-subs">
                          {item.subServices.map((sub, i) => (
                            <span key={i}>{sub}</span>
                          ))}
                        </div>
                        <div className="bw-card-price-row">
                          <div>
                            <span className="bw-card-price-label">Starting From</span>
                            <div className="bw-card-price">{item.price}</div>
                          </div>
                        </div>
                        <div className="bw-card-stars">
                          {renderStars(item.rating, item.reviewCount)}
                        </div>

                        <Link href={`/category/beauty/${item.id}`} className="bw-card-btn">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {sortedDisplayed.length > 0 && (
              <div className="bw-load-more">
                <button className="bw-load-more-btn">Views More</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}