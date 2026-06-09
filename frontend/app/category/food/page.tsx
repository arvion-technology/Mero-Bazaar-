"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiMapPin,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiCheckCircle,
  FiHeart,
} from "react-icons/fi";
import {
  FaLeaf,
  FaDrumstickBite,
  FaSeedling,
  FaEgg,
  FaHeart,
  FaHamburger,
  FaPizzaSlice,
  FaMugHot,
  FaBreadSlice,
  FaIceCream,
  FaCarrot,
} from "react-icons/fa";
import type { IconType } from "react-icons";

/* ─────────── TYPES ─────────── */
type FoodType = "Veg" | "Non veg" | "Vegan" | "Egg Items";

type PriceRange = "Under Rs.100" | "Rs.100 - Rs.200" | "Rs.200 - Rs.500" | "Above Rs.100";

type DeliveryRange = "Under Rs.100" | "Rs.100 - Rs.200" | "Rs.200 - Rs.500" | "Above Rs.1000";

type Subscription = "Daily Tiffin Available" | "Weekly Plan" | "Monthly Plan";

type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  foodType: FoodType;
  pricePerMeal: string;
  distance: string;
  location: string;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  isFreshAndHygienic: boolean;
  postedDaysAgo: number;
};

/* ─────────── CATEGORY ICONS ─────────── */
const CATEGORY_ICONS = [
  { name: "Fast Food", icon: FaHamburger, count: 1245, color: "#e11d48", bg: "#fff1f2" },
  { name: "Pizza", icon: FaPizzaSlice, count: 890, color: "#f97316", bg: "#fff7ed" },
  { name: "Beverages", icon: FaMugHot, count: 567, color: "#1d4ed8", bg: "#eff6ff" },
  { name: "Bakery", icon: FaBreadSlice, count: 445, color: "#b45309", bg: "#fffbeb" },
  { name: "Desserts", icon: FaIceCream, count: 345, color: "#7c3aed", bg: "#faf5ff" },
  { name: "Healthy", icon: FaCarrot, count: 245, color: "#16a34a", bg: "#f0fdf4" },
];

/* ─────────── DATA ─────────── */
const RESTAURANTS: Restaurant[] = [
  {
    id: "healthy-home-kitchen",
    name: "Healthy Home kitchen",
    cuisine: "Veg Thali",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Kathmandu",
    rating: 4.6,
    reviewCount: 126,
    images: ["/food-healthy.jpg"],
    tags: ["Veg Thali"],
    isFreshAndHygienic: true,
    postedDaysAgo: 1,
  },
  {
    id: "bhojan-gariha",
    name: "Bhojan Gariha",
    cuisine: "Nepali, Traditional",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Kathmandu",
    rating: 4.6,
    reviewCount: 126,
    images: ["/food-nepali.jpg"],
    tags: ["Nepali", "Traditional"],
    isFreshAndHygienic: true,
    postedDaysAgo: 2,
  },
  {
    id: "thakali-kitchen",
    name: "Thakali Kitchen",
    cuisine: "Veg Thali",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "2km",
    location: "Kathmandu",
    rating: 4.6,
    reviewCount: 126,
    images: ["/food-thakali.jpg"],
    tags: ["Veg Thali"],
    isFreshAndHygienic: true,
    postedDaysAgo: 0,
  },
  {
    id: "burger-house-nepal",
    name: "Burger House Nepal",
    cuisine: "Fast Food, Burgers",
    foodType: "Non veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Kathmandu",
    rating: 4.6,
    reviewCount: 126,
    images: ["/food-burger.jpg"],
    tags: ["Fast Food", "Burgers"],
    isFreshAndHygienic: true,
    postedDaysAgo: 1,
  },
  {
    id: "new-momo-hut",
    name: "New Momo Hut",
    cuisine: "Momos, Chinese",
    foodType: "Non veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Kathmandu",
    rating: 4.6,
    reviewCount: 126,
    images: ["/food-momo.jpg"],
    tags: ["Momos", "Chinese"],
    isFreshAndHygienic: true,
    postedDaysAgo: 3,
  },
  {
    id: "himalayan-java-coffee",
    name: "Himalayan Java Coffee",
    cuisine: "Cafe, Beverages",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Kathmandu",
    rating: 4.6,
    reviewCount: 126,
    images: ["/food-coffee.jpg"],
    tags: ["Cafe", "Beverages"],
    isFreshAndHygienic: true,
    postedDaysAgo: 2,
  },
];

const FOOD_TYPES: { name: FoodType; icon: IconType; color: string }[] = [
  { name: "Veg", icon: FaLeaf, color: "#22c55e" },
  { name: "Non veg", icon: FaDrumstickBite, color: "#ef4444" },
  { name: "Vegan", icon: FaSeedling, color: "#16a34a" },
  { name: "Egg Items", icon: FaEgg, color: "#f59e0b" },
];

const PRICE_RANGES: PriceRange[] = [
  "Under Rs.100",
  "Rs.100 - Rs.200",
  "Rs.200 - Rs.500",
  "Above Rs.100",
];

const DELIVERY_RANGES: DeliveryRange[] = [
  "Under Rs.100",
  "Rs.100 - Rs.200",
  "Rs.200 - Rs.500",
  "Above Rs.1000",
];

const SUBSCRIPTIONS: Subscription[] = [
  "Daily Tiffin Available",
  "Weekly Plan",
  "Monthly Plan",
];

const DAYS_OF_WEEK: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ─────────── COMPONENT ─────────── */
export default function FoodDeliveryPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodType[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [selectedDeliveryRanges, setSelectedDeliveryRanges] = useState<DeliveryRange[]>([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Subscription[]>([]);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFoodType = (ft: FoodType) =>
    setSelectedFoodTypes((prev) =>
      prev.includes(ft) ? prev.filter((x) => x !== ft) : [...prev, ft]
    );

  const togglePriceRange = (pr: PriceRange) =>
    setSelectedPriceRanges((prev) =>
      prev.includes(pr) ? prev.filter((x) => x !== pr) : [...prev, pr]
    );

  const toggleDeliveryRange = (dr: DeliveryRange) =>
    setSelectedDeliveryRanges((prev) =>
      prev.includes(dr) ? prev.filter((x) => x !== dr) : [...prev, dr]
    );

  const toggleSubscription = (sub: Subscription) =>
    setSelectedSubscriptions((prev) =>
      prev.includes(sub) ? prev.filter((x) => x !== sub) : [...prev, sub]
    );

  const toggleDay = (day: DayOfWeek) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((x) => x !== day) : [...prev, day]
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
    setSelectedFoodTypes([]);
    setSelectedPriceRanges([]);
    setSelectedDeliveryRanges([]);
    setSelectedSubscriptions([]);
    setSelectedDays([]);
    setActiveCategory("");
    setSearch("");
  };

  const displayed = RESTAURANTS.filter((r) => {
    const s = search.toLowerCase();
    if (s && !r.name.toLowerCase().includes(s) && !r.cuisine.toLowerCase().includes(s)) return false;
    if (activeCategory && !r.cuisine.toLowerCase().includes(activeCategory.toLowerCase())) return false;
    if (selectedFoodTypes.length && !selectedFoodTypes.includes(r.foodType)) return false;
    return true;
  });

  const sortedDisplayed = [...displayed].sort((a, b) => {
    if (sort === "newest") return a.postedDaysAgo - b.postedDaysAgo;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const renderStars = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={11}
            fill={i < fullStars ? "#f59e0b" : i === fullStars && hasHalf ? "#f59e0b" : "none"}
            color={i < fullStars || (i === fullStars && hasHalf) ? "#f59e0b" : "#d1d5db"}
          />
        ))}
        <span style={{ fontSize: 11, fontWeight: 700, color: "#111", marginLeft: 4 }}>{rating}</span>
        <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 2 }}>({reviewCount} Reviews)</span>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .fd-wrap {
          min-height: 100vh;
          background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── HERO ── */
        .fd-hero {
          position: relative;
          height: 260px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .fd-hero-bg {
          position: absolute; inset: 0;
          background: url('/hero-food.jpg') center center / cover no-repeat;
          filter: brightness(0.4);
        }
        .fd-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%);
        }
        .fd-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .fd-hero-inner h1 {
          font-size: 28px; font-weight: 800; color: #fff;
          margin: 0 0 6px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .fd-hero-inner p {
          color: rgba(255,255,255,0.75); font-size: 14px; margin: 0 0 18px;
          line-height: 1.6;
        }
        .fd-search-wrap { position: relative; max-width: 520px; }
        .fd-search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #aaa;
        }
        .fd-search {
          width: 100%; padding: 12px 14px 12px 42px;
          background: #fff; border: none; border-radius: 8px;
          font-size: 14px; color: #333; outline: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          font-family: inherit;
        }

        /* ── CATEGORY STRIP ── */
        .fd-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0;
        }
        .fd-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
        }
        .fd-cats-label {
          font-size: 13px; font-weight: 700; color: #888;
          margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px;
        }
        .fd-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .fd-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          min-width: 140px; font-family: inherit; text-align: left;
        }
        .fd-cat-card:hover {
          border-color: #e11d48; background: #fff1f2;
          transform: translateY(-2px); box-shadow: 0 4px 16px rgba(225,29,72,0.12);
        }
        .fd-cat-card.active {
          border-color: #e11d48; background: #ffe4e6;
          box-shadow: 0 4px 16px rgba(225,29,72,0.2);
        }
        .fd-cat-icon { font-size: 22px; display: flex; align-items: center; }
        .fd-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .fd-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY LAYOUT ── */
        .fd-body {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 20px 60px; display: flex; gap: 18px;
        }

        /* ── SIDEBAR ── */
        .fd-sidebar {
          width: 220px; flex-shrink: 0;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          align-self: flex-start;
          position: sticky; top: 16px;
          overflow: hidden;
        }
        .fd-sb-head {
          padding: 14px 16px 10px;
          font-size: 15px; font-weight: 800; color: #1a1a1a;
          border-bottom: 1px solid #f0f0f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .fd-sb-head svg { color: #9ca3af; }
        .fd-sb-section {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .fd-sb-section:last-of-type { border-bottom: none; }
        .fd-sb-title {
          font-size: 13px; font-weight: 700; color: #374151;
          margin-bottom: 10px;
        }
        .fd-check-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px; cursor: pointer;
        }
        .fd-check-row:last-child { margin-bottom: 0; }
        .fd-radio {
          width: 14px; height: 14px; border-radius: 50%;
          border: 1.5px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff; transition: all 0.15s;
          cursor: pointer;
        }
        .fd-radio.checked {
          border-color: #e11d48;
          background: #e11d48;
        }
        .fd-radio.checked::after {
          content: "";
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fff;
          display: block;
        }
        .fd-check-label {
          font-size: 12.5px; color: #374151; font-weight: 500;
        }
        .fd-check-label.checked { color: #111; font-weight: 700; }

        .fd-days-row {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .fd-day-btn {
          padding: 5px 10px;
          border-radius: 6px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 11px; font-weight: 600; color: #374151;
          cursor: pointer; font-family: inherit;
          transition: all 0.15s;
        }
        .fd-day-btn:hover {
          border-color: #e11d48; color: #e11d48;
        }
        .fd-day-btn.active {
          background: #e11d48; color: #fff;
          border-color: #e11d48;
        }

        .fd-sort-select {
          width: 100%; padding: 7px 10px; border-radius: 7px;
          border: 1px solid #e0e4f0; font-size: 12px; color: #444;
          background: #f9fafb; outline: none; font-family: inherit;
          cursor: pointer;
        }
        .fd-sort-select:focus { border-color: #e11d48; }

        .fd-more-btn {
          display: block; width: 100%;
          padding: 10px;
          background: #f3f4f6; color: #111;
          font-size: 13px; font-weight: 700; border: none;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s;
          text-align: center;
        }
        .fd-more-btn:hover { background: #e5e7eb; }

        /* ── MAIN ── */
        .fd-main { flex: 1; min-width: 0; }
        .fd-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
        }
        .fd-count { font-size: 15px; color: #6b7280; font-weight: 600; }
        .fd-count strong { color: #111; font-weight: 800; }
        .fd-sort-wrap {
          position: relative;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: #fff;
          padding: 0;
          min-width: 120px;
        }
        .fd-sort {
          padding: 8px 28px 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 13px; font-weight: 600;
          color: #333; background: transparent; outline: none;
          cursor: pointer; font-family: inherit;
          appearance: none;
          width: 100%;
        }

        /* ── CARD GRID ── */
        .fd-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* ── CARD ── */
        .fd-card {
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none; color: inherit;
        }
        .fd-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }

        .fd-card-img-wrap {
          position: relative; width: 100%; aspect-ratio: 4/3;
          overflow: hidden; background: #e5e7eb;
        }
        .fd-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s;
        }
        .fd-card:hover .fd-card-img { transform: scale(1.06); }

        .fd-card-fav {
          position: absolute; top: 8px; right: 8px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0; z-index: 2;
        }
        .fd-card-fav:hover { transform: scale(1.15); }

        .fd-carousel-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(0,0,0,0.35); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; transition: background 0.15s; padding: 0;
        }
        .fd-carousel-btn:hover { background: rgba(0,0,0,0.55); }
        .fd-carousel-btn.prev { left: 8px; }
        .fd-carousel-btn.next { right: 8px; }

        .fd-card-body { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .fd-card-name { font-size: 16px; font-weight: 800; color: #111; margin: 0; }
        .fd-card-meta {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px; color: #6b7280;
        }
        .fd-card-meta-left {
          display: flex; align-items: center; gap: 4px;
        }
        .fd-card-price { font-size: 12px; font-weight: 700; color: #111; }
        .fd-card-cuisine {
          font-size: 12px; color: #6b7280; font-weight: 500;
        }
        .fd-card-hygienic {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: #16a34a; font-weight: 600;
        }
        .fd-card-stars {
          margin-top: 2px;
        }
        .fd-card-actions {
          display: flex; gap: 8px; margin-top: 10px;
        }
        .fd-btn-order {
          flex: 1; padding: 8px 12px;
          background: #fff; color: #16a34a;
          font-size: 12px; font-weight: 700;
          border: 1.5px solid #16a34a;
          border-radius: 6px; cursor: pointer;
          font-family: inherit; text-align: center;
          text-decoration: none;
          transition: all 0.15s;
        }
        .fd-btn-order:hover {
          background: #16a34a; color: #fff;
        }
        .fd-btn-subscribe {
          flex: 1; padding: 8px 12px;
          background: #16a34a; color: #fff;
          font-size: 12px; font-weight: 700;
          border: 1.5px solid #16a34a;
          border-radius: 6px; cursor: pointer;
          font-family: inherit; text-align: center;
          text-decoration: none;
          transition: all 0.15s;
        }
        .fd-btn-subscribe:hover {
          background: #15803d;
        }

        /* ── LOAD MORE ── */
        .fd-load-more { text-align: center; margin-top: 28px; }
        .fd-load-more-btn {
          font-size: 14px; font-weight: 600; color: #6b7280;
          background: none; border: none; cursor: pointer;
          padding: 8px 20px; border-radius: 6px;
          font-family: inherit; transition: background 0.15s, color 0.15s;
        }
        .fd-load-more-btn:hover { background: #f3f4f6; color: #374151; }

        /* ── EMPTY ── */
        .fd-empty {
          text-align: center; padding: 60px 24px;
          background: #fff; border-radius: 10px;
          border: 1px solid #e5e7eb;
        }
        .fd-empty-btn {
          margin-top: 12px; padding: 9px 22px;
          background: #e11d48; color: #fff; font-weight: 700;
          font-size: 13px; border: none; border-radius: 7px;
          cursor: pointer; font-family: inherit;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .fd-sidebar { display: none; }
          .fd-grid { grid-template-columns: repeat(2, 1fr); }
          .fd-cats-row { gap: 8px; }
          .fd-cat-card { min-width: 120px; padding: 8px 12px; }
        }
        @media (max-width: 540px) {
          .fd-grid { grid-template-columns: 1fr; }
          .fd-body { padding: 14px 14px 40px; }
          .fd-cats-row { gap: 6px; }
          .fd-cat-card { min-width: 0; flex: 1; }
        }
      `}</style>

      <div className="fd-wrap">

        {/* ── HERO ── */}
        <section className="fd-hero">
          <div className="fd-hero-bg" />
          <div className="fd-hero-overlay" />
          <div className="fd-hero-inner">
            <h1>Food & Home Delivery in Nepal</h1>
            <p>Discover the best Food & Home Delivery and<br />Delicious food around you.</p>
            <div className="fd-search-wrap">
              <FiSearch className="fd-search-icon" size={16} />
              <input
                className="fd-search"
                placeholder="Search for restrunts, cuisines..........."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY STRIP ── */}
        <section className="fd-cats-strip">
          <div className="fd-cats-inner">
            <p className="fd-cats-label">Browse Categories</p>
            <div className="fd-cats-row">
              {CATEGORY_ICONS.map((cat) => (
                <button
                  key={cat.name}
                  className={`fd-cat-card${activeCategory === cat.name ? " active" : ""}`}
                  onClick={() => setActiveCategory(activeCategory === cat.name ? "" : cat.name)}
                >
                  <span className="fd-cat-icon" style={{ color: cat.color }}>
                    <cat.icon size={22} />
                  </span>
                  <span>
                    <span className="fd-cat-name">{cat.name}</span>
                    <span className="fd-cat-count">{cat.count.toLocaleString()} listings</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="fd-body">

          {/* ── SIDEBAR ── */}
          <aside className="fd-sidebar">
            <div className="fd-sb-head">
              Filter
              <FiChevronRight size={16} />
            </div>

            {/* Food Type */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Food Type</p>
              {FOOD_TYPES.map((ft) => (
                <div key={ft.name} className="fd-check-row" onClick={() => toggleFoodType(ft.name)}>
                  <div className={`fd-radio${selectedFoodTypes.includes(ft.name) ? " checked" : ""}`} />
                  <span className={`fd-check-label${selectedFoodTypes.includes(ft.name) ? " checked" : ""}`}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <ft.icon size={13} color={ft.color} />
                      {ft.name}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Price range</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 4px" }}>
                {PRICE_RANGES.map((pr) => (
                  <div key={pr} className="fd-check-row" onClick={() => togglePriceRange(pr)}>
                    <div className={`fd-radio${selectedPriceRanges.includes(pr) ? " checked" : ""}`} />
                    <span className={`fd-check-label${selectedPriceRanges.includes(pr) ? " checked" : ""}`} style={{ fontSize: 11 }}>{pr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Delivery</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 4px" }}>
                {DELIVERY_RANGES.map((dr) => (
                  <div key={dr} className="fd-check-row" onClick={() => toggleDeliveryRange(dr)}>
                    <div className={`fd-radio${selectedDeliveryRanges.includes(dr) ? " checked" : ""}`} />
                    <span className={`fd-check-label${selectedDeliveryRanges.includes(dr) ? " checked" : ""}`} style={{ fontSize: 11 }}>{dr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Subscription</p>
              {SUBSCRIPTIONS.map((sub) => (
                <div key={sub} className="fd-check-row" onClick={() => toggleSubscription(sub)}>
                  <div className={`fd-radio${selectedSubscriptions.includes(sub) ? " checked" : ""}`} />
                  <span className={`fd-check-label${selectedSubscriptions.includes(sub) ? " checked" : ""}`}>{sub}</span>
                </div>
              ))}
            </div>

            {/* Delivery Days */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Delivery days</p>
              <div className="fd-days-row">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    className={`fd-day-btn${selectedDays.includes(day) ? " active" : ""}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Sort By</p>
              <div style={{ position: "relative" }}>
                <select
                  className="fd-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
                <FiChevronDown
                  size={12}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#666" }}
                />
              </div>
            </div>

            <button className="fd-more-btn" onClick={reset}>More</button>
          </aside>

          {/* ── MAIN ── */}
          <div className="fd-main">
            {/* Results bar */}
            <div className="fd-results-bar">
              <span className="fd-count">
                <strong>{sortedDisplayed.length}</strong> Resturants found
              </span>
              <div className="fd-sort-wrap">
                <select
                  className="fd-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <FiChevronDown
                  size={12}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#666" }}
                />
              </div>
            </div>

            {/* Cards */}
            {sortedDisplayed.length === 0 ? (
              <div className="fd-empty">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", margin: "0 0 4px" }}>No restaurants found</p>
                <span style={{ fontSize: 13, color: "#888" }}>Try adjusting your filters or search term</span>
                <br />
                <button className="fd-empty-btn" onClick={reset}>Reset Filters</button>
              </div>
            ) : (
              <div className="fd-grid">
                {sortedDisplayed.map((item) => {
                  const isFav = !!favorites[item.id];
                  const currentImg = imageIndices[item.id] || 0;
                  const hasMultiple = item.images.length > 1;

                  return (
                    <div key={item.id} className="fd-card">
                      {/* Image */}
                      <Link
                        href={`/category/food/${item.id}`}
                        className="fd-card-img-wrap"
                        style={{ display: "block", textDecoration: "none" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.images[currentImg]} alt={item.name} className="fd-card-img" />

                        {/* Fav */}
                        <button className="fd-card-fav" onClick={(e) => toggleFav(item.id, e)}>
                          {isFav
                            ? <FaHeart size={12} color="#ef4444" />
                            : <FiHeart size={12} color="#9ca3af" />}
                        </button>

                        {/* Carousel */}
                        {hasMultiple && (
                          <>
                            <button
                              className="fd-carousel-btn prev"
                              onClick={(e) => prevImage(item.id, item.images.length, e)}
                            >
                              <FiChevronLeft size={14} />
                            </button>
                            <button
                              className="fd-carousel-btn next"
                              onClick={(e) => nextImage(item.id, item.images.length, e)}
                            >
                              <FiChevronRight size={14} />
                            </button>
                          </>
                        )}
                      </Link>

                      {/* Body */}
                      <div className="fd-card-body">
                        <p className="fd-card-name">{item.name}</p>
                        <div className="fd-card-meta">
                          <div className="fd-card-meta-left">
                            <FiMapPin size={11} />
                            <span>{item.distance} {item.location}</span>
                          </div>
                          <span className="fd-card-price">{item.pricePerMeal}</span>
                        </div>
                        <p className="fd-card-cuisine">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 10 }}>🍽️</span>
                            {item.cuisine}
                          </span>
                        </p>
                        {item.isFreshAndHygienic && (
                          <div className="fd-card-hygienic">
                            <span style={{ fontSize: 12 }}>🌿</span>
                            Fresh and Hygenic
                          </div>
                        )}
                        <div className="fd-card-stars">
                          {renderStars(item.rating, item.reviewCount)}
                        </div>

                        <div className="fd-card-actions">
                          <Link href={`/category/food/${item.id}`} className="fd-btn-order">
                            Order Now
                          </Link>
                          <button className="fd-btn-subscribe">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {sortedDisplayed.length > 0 && (
              <div className="fd-load-more">
                <button className="fd-load-more-btn">Views More</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}