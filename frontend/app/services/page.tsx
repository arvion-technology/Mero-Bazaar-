"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiChevronDown,
  FiStar,
  FiHeart,
  FiMapPin,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const CATEGORY_HREF_MAP: Record<string, string> = {
  vehicles: "/category/vehicles",
  jobs: "/category/job",
  medical: "/category/medical",
  "trade-and-homerepair": "/category/trade-and-homerepair",
  "rent-and-real-estate": "/category/rent-and-real-estate",
  agriculture: "/category/agriculture-and-livestock",
  "secondhand-goods": "/category/secondhand",
  food: "/category/food",
  beauty: "/category/beauty",
  "hair-beauty": "/category/beauty",
  "home-repair": "/category/trade-and-homerepair",
  cleaning: "/category/trade-and-homerepair",
};

function getListingHref(itemCategory: string): string {
  return CATEGORY_HREF_MAP[itemCategory] || "/category/all";
}

/* ─────────── MOCK DATA ─────────── */
const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Bridal Makeup",
    thumb: "/bridal-makeup.jpg",
    category: "hair-beauty",
    city: "Koteshwor",
    price: "NPR 8,500",
    priceValue: 8500,
    rating: 4.8,
    reviewCount: 128,
    businessName: "Glam Studio",
    tags: "HD Makeup • Hair Style • Draping",
  },
  {
    id: "2",
    title: "Home cleaning Service",
    thumb: "/home-cleaning.jpg",
    category: "cleaning",
    city: "Koteshwor",
    price: "NPR 200/hr",
    priceValue: 200,
    rating: 4.8,
    reviewCount: 128,
    businessName: "",
    tags: "Deep clean your space with trusted professionals",
    extraInfo: "2-4hours",
  },
  {
    id: "3",
    title: "Healthy Home kitchen",
    thumb: "/home-kitchen.jpg",
    category: "agriculture",
    city: "3km Kathmandu",
    price: "NPR 250/meal",
    priceValue: 250,
    rating: 4.8,
    reviewCount: 128,
    businessName: "",
    tags: "Veg Thali • Fresh and Hygienic",
  },
  {
    id: "4",
    title: "General Physician Visit",
    thumb: "/physician.jpg",
    category: "medical",
    city: "Durbarmarg",
    price: "Starting From NPR 800",
    priceValue: 800,
    rating: 4.8,
    reviewCount: 128,
    businessName: "HelathPlus Clinic",
    tags: "",
  },
  {
    id: "5",
    title: "AC Installation & Repair",
    thumb: "/ac-repair.jpg",
    category: "home-repair",
    city: "Koteshwor",
    price: "Rs. 1,500",
    priceValue: 1500,
    rating: 4.8,
    reviewCount: 128,
    businessName: "Cool Care Services",
    tags: "",
  },
  {
    id: "6",
    title: "Facial & Skin Care",
    thumb: "/facial-care.jpg",
    category: "hair-beauty",
    city: "Durbarmarg",
    price: "Rs. 1,500",
    priceValue: 1500,
    rating: 4.8,
    reviewCount: 128,
    businessName: "Glow Beauty Parlour",
    tags: "",
  },
];

/* ─────────── SIDEBAR CONFIG ─────────── */
const SIDEBAR_CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "hair-beauty", label: "Hair & Beauty" },
  { id: "home-repair", label: "Home Repair" },
  { id: "medical", label: "Medical & Dental" },
  { id: "cleaning", label: "Cleaning" },
  { id: "agriculture", label: "Agriculture" },
];

type PriceRange = "Under Rs.1,000" | "Rs.1,000 - Rs.3,000" | "Rs.3,000 - Rs.6,000" | "Above Rs.6,000";
const PRICE_RANGES: PriceRange[] = [
  "Under Rs.1,000",
  "Rs.1,000 - Rs.3,000",
  "Rs.3,000 - Rs.6,000",
  "Above Rs.6,000",
];

const PRICE_PRESETS: Record<PriceRange, [number, number]> = {
  "Under Rs.1,000": [0, 1000],
  "Rs.1,000 - Rs.3,000": [1000, 3000],
  "Rs.3,000 - Rs.6,000": [3000, 6000],
  "Above Rs.6,000": [6000, 10000],
};

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const SLIDER_MAX = 10000;

/* ─────────── COMPONENT ─────────── */
export default function ServicesPage() {
  const [listings] = useState(MOCK_LISTINGS);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [agricultureOnly, setAgricultureOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  /* Price slider state */
  const [priceRange, setPriceRange] = useState<[number, number]>([0, SLIDER_MAX]);
  const [activePricePreset, setActivePricePreset] = useState<PriceRange | null>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* Fake loading */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const value = Math.round(percent * SLIDER_MAX);

      setPriceRange((prev) => {
        if (dragging === "min") {
          return [Math.min(value, prev[1] - 200), prev[1]];
        } else {
          return [prev[0], Math.max(value, prev[0] + 200)];
        }
      });
      setActivePricePreset(null);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => setDragging(null);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => setDragging(null);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current || dragging) return;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const value = Math.round(percent * SLIDER_MAX);
    const mid = (priceRange[0] + priceRange[1]) / 2;

    if (value < mid) {
      setPriceRange([Math.min(value, priceRange[1] - 200), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(value, priceRange[0] + 200)]);
    }
    setActivePricePreset(null);
  };

  const togglePricePreset = (pr: PriceRange) => {
    if (activePricePreset === pr) {
      setActivePricePreset(null);
      setPriceRange([0, SLIDER_MAX]);
    } else {
      setActivePricePreset(pr);
      setPriceRange(PRICE_PRESETS[pr]);
    }
  };

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setPriceRange([0, SLIDER_MAX]);
    setActivePricePreset(null);
    setActiveCategory("all");
    setSelectedRating(null);
    setAgricultureOnly(false);
    setSearch("");
    setSort("popular");
  };

  /* ─── FILTER LOGIC ─── */
  const displayed = listings.filter((item) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = `${item.title} ${item.tags} ${item.city} ${item.businessName}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (agricultureOnly && item.category !== "agriculture") return false;

    /* Price slider */
    const maxPrice = priceRange[1] >= SLIDER_MAX ? Infinity : priceRange[1];
    if (item.priceValue < priceRange[0] || item.priceValue > maxPrice) return false;

    if (selectedRating && item.rating < selectedRating) return false;

    return true;
  });

  /* ─── SORT LOGIC ─── */
  const sortedDisplayed = [...displayed].sort((a, b) => {
    if (sort === "popular") return b.rating - a.rating;
    if (sort === "newest") return parseInt(b.id) - parseInt(a.id);
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price-low") return a.priceValue - b.priceValue;
    if (sort === "price-high") return b.priceValue - a.priceValue;
    return 0;
  });

  const sortLabel: Record<string, string> = {
    popular: "Popular",
    newest: "Newest",
    "price-low": "Price Low to High",
    "price-high": "Price High to Low",
    rating: "Highest Rated",
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={10}
            fill={i < full || (i === full && half) ? "#f59e0b" : "none"}
            color={i < full || (i === full && half) ? "#f59e0b" : "#d1d5db"}
          />
        ))}
      </div>
    );
  };

  const minPct = (priceRange[0] / SLIDER_MAX) * 100;
  const maxPct = (priceRange[1] / SLIDER_MAX) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .sv-wrap { min-height: 100vh; background: #f9fafb; font-family: 'Inter', -apple-system, sans-serif; }

        /* ─── HERO WITH SPLIT BACKGROUND ─── */
        .sv-hero { position: relative; height: 260px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .sv-hero-bg { position: absolute; inset: 0; display: flex; }
        .sv-hero-bg-left, .sv-hero-bg-right { flex: 1; background-size: cover; background-position: center; }
        .sv-hero-bg-left { background-image: url('/hero-left.jpg'); }
        .sv-hero-bg-right { background-image: url('/hero-right.jpg'); }
        .sv-hero-bg-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
        .sv-hero-inner { position: relative; z-index: 2; text-align: center; max-width: 680px; padding: 0 24px; width: 100%; }
        .sv-hero-inner h1 { font-size: 30px; font-weight: 800; color: #fff; margin: 0 0 6px; letter-spacing: -0.3px; }
        .sv-hero-inner p { color: rgba(255,255,255,0.75); font-size: 13.5px; margin: 0 0 22px; }

        /* ─── SEARCH BOX ─── */
        .sv-search-box {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 10px;
          padding: 4px;
          gap: 4px;
          max-width: 640px;
          margin: 0 auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
        }
        .sv-search-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: transparent;
          border-radius: 0;
          padding: 0 16px;
          gap: 10px;
          height: 44px;
          min-width: 0;
        }
        .sv-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #374151;
          font-family: inherit;
          background: transparent;
          width: 100%;
          min-width: 0;
        }
        .sv-search-input::placeholder { color: #9ca3af; }
        .sv-search-btn {
          padding: 0 22px;
          height: 44px;
          background: #e11d48;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .sv-search-btn:hover { background: #be123c; }

        .sv-body { max-width: 1280px; margin: 0 auto; padding: 24px 20px 60px; display: flex; gap: 20px; }

        .sv-sidebar { width: 240px; flex-shrink: 0; background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; align-self: flex-start; position: sticky; top: 20px; overflow: hidden; }
        .sv-sb-head { padding: 14px 18px; font-size: 15px; font-weight: 700; color: #111827; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
        .sv-reset-btn { font-size: 12px; color: #e11d48; font-weight: 600; background: none; border: none; cursor: pointer; font-family: inherit; padding: 4px 8px; border-radius: 5px; transition: background 0.15s; }
        .sv-reset-btn:hover { background: #fef2f2; text-decoration: underline; }
        .sv-sb-section { padding: 14px 18px; border-bottom: 1px solid #f3f4f6; }
        .sv-sb-section:last-of-type { border-bottom: none; }
        .sv-sb-title { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 10px; }

        .sv-cat-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer; }
        .sv-cat-item:last-child { margin-bottom: 0; }
        .sv-cb { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #fff; transition: all 0.15s; cursor: pointer; }
        .sv-cb.checked { border-color: #e11d48; background: #e11d48; }
        .sv-cb.checked::after { content: "✓"; color: #fff; font-size: 9px; font-weight: 800; }
        .sv-cb-label { font-size: 12.5px; color: #4b5563; font-weight: 500; }
        .sv-show-more { font-size: 11.5px; color: #e11d48; font-weight: 600; margin-top: 6px; cursor: pointer; display: inline-block; }

        .sv-price-track { position: relative; height: 4px; background: #e5e7eb; border-radius: 2px; margin: 14px 0 8px; cursor: pointer; user-select: none; touch-action: none; }
        .sv-price-fill { position: absolute; top: 0; bottom: 0; background: #e11d48; border-radius: 2px; opacity: 0.6; }
        .sv-price-handle { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; background: #fff; border: 2.5px solid #e11d48; border-radius: 50%; cursor: grab; z-index: 2; transition: transform 0.1s, box-shadow 0.1s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .sv-price-handle:active { cursor: grabbing; transform: translate(-50%, -50%) scale(1.2); box-shadow: 0 2px 8px rgba(225,29,72,0.35); }
        .sv-price-labels { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; font-weight: 500; }

        .sv-price-options { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }

        .sv-rating-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .sv-rating-btn { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 5px 8px; border-radius: 6px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 11.5px; font-weight: 500; color: #4b5563; transition: all 0.15s; font-family: inherit; }
        .sv-rating-btn:hover { border-color: #f59e0b; background: #fffbeb; }
        .sv-rating-btn.active { border-color: #f59e0b; background: #fef3c7; color: #92400e; }
        .sv-rating-btn svg { fill: #f59e0b; color: #f59e0b; }

        .sv-main { flex: 1; min-width: 0; }
        .sv-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
        .sv-count { font-size: 16px; color: #111827; font-weight: 700; }
        .sv-sort-dropdown { position: relative; }
        .sv-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .sv-sort-btn:hover { border-color: #d1d5db; }
        .sv-sort-menu { position: absolute; top: calc(100% + 6px); right: 0; min-width: 180px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; animation: svSortFade 0.15s ease; }
        @keyframes svSortFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .sv-sort-option { padding: 9px 14px; font-size: 13px; color: #4b5563; cursor: pointer; transition: all 0.15s; border-bottom: 1px solid #f9fafb; }
        .sv-sort-option:last-child { border-bottom: none; }
        .sv-sort-option:hover { background: #fef2f2; color: #e11d48; }
        .sv-sort-option.active { background: #e11d48; color: #fff; }

        .sv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .sv-card { background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; }
        .sv-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .sv-card-img-wrap { position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; background: #f3f4f6; }
        .sv-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .sv-card:hover .sv-card-img { transform: scale(1.04); }
        .sv-card-badge { position: absolute; top: 10px; left: 10px; background: #10b981; color: #fff; font-size: 9px; font-weight: 800; border-radius: 4px; padding: 3px 8px; letter-spacing: 0.3px; text-transform: uppercase; }
        .sv-card-fav { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.95); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.12); transition: all 0.15s; padding: 0; z-index: 2; }
        .sv-card-fav:hover { transform: scale(1.1); }

        .sv-card-body { padding: 14px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .sv-card-title { font-size: 15px; font-weight: 700; color: #111827; margin: 0; line-height: 1.3; }
        .sv-card-tags { font-size: 11.5px; color: #6b7280; font-weight: 500; line-height: 1.4; margin: 0; }
        .sv-card-rating-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
        .sv-card-rating-text { font-size: 11px; color: #6b7280; font-weight: 500; }
        .sv-card-rating-text strong { color: #111827; font-weight: 700; }
        .sv-card-loc { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; font-size: 11.5px; color: #6b7280; font-weight: 500; }
        .sv-card-loc-left { display: flex; align-items: center; gap: 4px; }
        .sv-card-loc svg { color: #e11d48; }
        .sv-card-extra { font-size: 11px; color: #9ca3af; font-weight: 500; margin-top: 2px; }
        .sv-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6; }
        .sv-card-price-label { font-size: 10px; color: #9ca3af; font-weight: 500; display: block; margin-bottom: 1px; }
        .sv-card-price { font-size: 13px; font-weight: 800; color: #111827; }
        .sv-card-btn { padding: 7px 16px; background: #ec4899; color: #fff; font-size: 12px; font-weight: 700; border: none; border-radius: 6px; cursor: pointer; font-family: inherit; text-decoration: none; transition: background 0.15s; display: inline-flex; align-items: center; }
        .sv-card-btn:hover { background: #db2777; }

        .sv-empty, .sv-state { text-align: center; padding: 70px 24px; background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; }
        .sv-empty p, .sv-state p { font-weight: 700; font-size: 16px; color: #111827; margin: 0 0 4px; }
        .sv-empty span, .sv-state span { font-size: 13px; color: #6b7280; }
        .sv-empty-btn { margin-top: 14px; padding: 9px 22px; background: #e11d48; color: #fff; font-weight: 700; font-size: 13px; border: none; border-radius: 7px; cursor: pointer; font-family: inherit; }

        @media (max-width: 1024px) {
          .sv-sidebar { display: none; }
          .sv-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .sv-grid { grid-template-columns: 1fr; }
          .sv-body { padding: 16px 16px 40px; }
          .sv-hero { height: auto; min-height: 240px; padding: 40px 16px; }
          .sv-hero-inner h1 { font-size: 22px; }
          .sv-hero-inner p { font-size: 12.5px; margin-bottom: 18px; }

          /* ─── MOBILE SEARCH — NO ICONS ─── */
          .sv-search-box {
            flex-direction: row;
            align-items: center;
            background: #fff;
            border-radius: 10px;
            padding: 4px;
            gap: 4px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border: 1px solid #e5e7eb;
            max-width: 100%;
          }
          .sv-search-input-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            background: transparent;
            border-radius: 0;
            padding: 0 14px;
            gap: 8px;
            height: 42px;
            min-width: 0;
          }
          .sv-search-input { 
            font-size: 16px; 
            font-weight: 400;
          }
          .sv-search-btn {
            width: auto;
            height: 42px;
            padding: 0 18px;
            border-radius: 8px;
            font-size: 14px;
            justify-content: center;
            font-weight: 700;
            gap: 6px;
          }
          .sv-search-btn:active {
            transform: scale(0.97);
            background: #be123c;
          }
        }
      `}</style>

      <div className="sv-wrap">
        {/* Hero with split background */}
        <section className="sv-hero">
          <div className="sv-hero-bg">
            <div className="sv-hero-bg-left" />
            <div className="sv-hero-bg-right" />
          </div>
          <div className="sv-hero-bg-overlay" />
          <div className="sv-hero-inner">
            <h1>Find Trusted Services Near you</h1>
            <p>From Home repair to beauty & wellness - find the best professionals for your needs</p>
            <div className="sv-search-box">
              <div className="sv-search-input-wrap">
                <input
                  className="sv-search-input"
                  placeholder="What service do you need?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="sv-search-btn">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="sv-body">
          {/* Sidebar */}
          <aside className="sv-sidebar">
            <div className="sv-sb-head">
              <span>Filter</span>
              <button className="sv-reset-btn" onClick={reset}>
                Reset
              </button>
            </div>

            {/* Category */}
            <div className="sv-sb-section">
              <p className="sv-sb-title">Category</p>
              {SIDEBAR_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="sv-cat-item"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className={`sv-cb${activeCategory === cat.id ? " checked" : ""}`} />
                  <span className="sv-cb-label">{cat.label}</span>
                </div>
              ))}
              <span className="sv-show-more">Show more</span>
            </div>

            {/* Price Range */}
            <div className="sv-sb-section">
              <p className="sv-sb-title">Price Range</p>
              <div
                className="sv-price-track"
                ref={trackRef}
                onClick={handleTrackClick}
              >
                <div
                  className="sv-price-fill"
                  style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                />
                <div
                  className="sv-price-handle"
                  style={{ left: `${minPct}%` }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragging("min");
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setDragging("min");
                  }}
                />
                <div
                  className="sv-price-handle"
                  style={{ left: `${maxPct}%` }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragging("max");
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setDragging("max");
                  }}
                />
              </div>
              <div className="sv-price-labels">
                <span>Rs. {priceRange[0].toLocaleString()}</span>
                <span>
                  {priceRange[1] >= SLIDER_MAX
                    ? "Rs. 10,000+"
                    : `Rs. ${priceRange[1].toLocaleString()}`}
                </span>
              </div>
              <div className="sv-price-options">
                {PRICE_RANGES.map((pr) => (
                  <div
                    key={pr}
                    className="sv-cat-item"
                    onClick={() => togglePricePreset(pr)}
                  >
                    <div
                      className={`sv-cb${activePricePreset === pr ? " checked" : ""}`}
                    />
                    <span className="sv-cb-label">{pr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="sv-sb-section">
              <p className="sv-sb-title">Rating</p>
              <div className="sv-rating-grid">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    className={`sv-rating-btn${selectedRating === rating ? " active" : ""}`}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  >
                    <FiStar size={10} /> {rating} & above
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="sv-sb-section">
              <p className="sv-sb-title">Availability</p>
              <div className="sv-cat-item" onClick={() => setAgricultureOnly(!agricultureOnly)}>
                <div className={`sv-cb${agricultureOnly ? " checked" : ""}`} />
                <span className="sv-cb-label">Agriculture</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="sv-main">
            {loading ? (
              <div className="sv-state">
                <p>Loading services…</p>
              </div>
            ) : (
              <>
                <div className="sv-results-header">
                  <span className="sv-count">{sortedDisplayed.length.toLocaleString()} Service Found</span>

                  <div className="sv-sort-dropdown" ref={sortRef}>
                    <button className="sv-sort-btn" onClick={() => setIsSortOpen((v) => !v)}>
                      Sort by: {sortLabel[sort]}
                      <FiChevronDown
                        size={13}
                        style={{ transform: isSortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                      />
                    </button>
                    {isSortOpen && (
                      <div className="sv-sort-menu">
                        {SORT_OPTIONS.map((opt) => (
                          <div
                            key={opt.value}
                            className={`sv-sort-option${sort === opt.value ? " active" : ""}`}
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

                {sortedDisplayed.length === 0 ? (
                  <div className="sv-empty">
                    <FiSearch size={44} style={{ color: '#d1d5db', marginBottom: 14 }} />
                    <p>No services found</p>
                    <span>Try adjusting your filters or search term</span>
                    <br />
                    <button className="sv-empty-btn" onClick={reset}>Reset Filters</button>
                  </div>
                ) : (
                  <div className="sv-grid">
                    {sortedDisplayed.map((item) => {
                      const isFav = !!favorites[item.id];
                      return (
                        <div key={item.id} className="sv-card">
                          <div className="sv-card-img-wrap">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.thumb} alt={item.title} className="sv-card-img" />
                            <span className="sv-card-badge">Available</span>
                            <button className="sv-card-fav" onClick={(e) => toggleFav(item.id, e)}>
                              {isFav ? <FaHeart size={12} color="#ef4444" /> : <FiHeart size={12} color="#9ca3af" />}
                            </button>
                          </div>

                          <div className="sv-card-body">
                            <p className="sv-card-title">{item.title}</p>
                            {item.tags && <p className="sv-card-tags">{item.tags}</p>}

                            <div className="sv-card-rating-row">
                              {renderStars(item.rating)}
                              <span className="sv-card-rating-text">
                                <strong>{item.rating.toFixed(1)}</strong> ({item.reviewCount} Reviews)
                              </span>
                            </div>

                            <div className="sv-card-loc">
                              <span className="sv-card-loc-left">
                                <FiMapPin size={11} />
                                {item.city}
                              </span>
                              {item.businessName && <span>{item.businessName}</span>}
                            </div>

                            {item.extraInfo && <p className="sv-card-extra">{item.extraInfo}</p>}

                            <div className="sv-card-footer">
                              <div>
                                <span className="sv-card-price-label">Starting From</span>
                                <div className="sv-card-price">{item.price}</div>
                              </div>
                              <Link href={getListingHref(item.category)} className="sv-card-btn">
                                Book Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}