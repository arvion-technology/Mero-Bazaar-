"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toFoodsCard, FOOD_TYPE_LABEL } from "@/lib/adapters/foodsAdapter";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import type {
  FoodsListing,
  FoodsCard,
  FoodType,
  WeekDay,
} from "@/app/types/foods";
import {
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiCheckCircle,
  FiHeart,
  FiShare2,
} from "react-icons/fi";
import {
  FaUtensils,
  FaBreadSlice,
  FaEgg,
  FaDrumstickBite,
  FaSeedling,
  FaHeart,
  FaWarehouse,
} from "react-icons/fa";
import type { IconType } from "react-icons";

type PriceRange =
  | "Under Rs.100"
  | "Rs.100 - Rs.200"
  | "Rs.200 - Rs.500"
  | "Above Rs.500";

const PRICE_RANGES: PriceRange[] = [
  "Under Rs.100",
  "Rs.100 - Rs.200",
  "Rs.200 - Rs.500",
  "Above Rs.500",
];

const FOOD_TYPE_ICON: Record<FoodType, { icon: IconType; color: string }> = {
  TIFFIN: { icon: FaUtensils, color: "#e11d48" },
  BAKERY: { icon: FaBreadSlice, color: "#b45309" },
  DAIRY: { icon: FaEgg, color: "#f59e0b" },
  MEAT: { icon: FaDrumstickBite, color: "#dc2626" },
  ORGANIC: { icon: FaSeedling, color: "#16a34a" },
  HOME_COOK: { icon: FaHeart, color: "#be185d" },
  WHOLESALE: { icon: FaWarehouse, color: "#1d4ed8" },
};

const FOOD_TYPE_ORDER: FoodType[] = [
  "TIFFIN",
  "BAKERY",
  "DAIRY",
  "MEAT",
  "ORGANIC",
  "HOME_COOK",
  "WHOLESALE",
];

const DAY_LABEL: Record<WeekDay, string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};
const DAYS_OF_WEEK: WeekDay[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const parsePrice = (priceStr: string): number => {
  const match = priceStr.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function FoodDeliveryPage() {
  const [rawListings, setRawListings] = useState<FoodsListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodType[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>(
    [],
  );
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await api.getFoods();
        if (!cancelled) setRawListings(data);
      } catch (err) {
        console.error("Failed to load food listings:", err);
        if (!cancelled)
          setError("Couldn't load restaurants right now. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFoodType = (ft: FoodType) =>
    setSelectedFoodTypes((prev) =>
      prev.includes(ft) ? prev.filter((x) => x !== ft) : [...prev, ft],
    );

  const togglePriceRange = (pr: PriceRange) =>
    setSelectedPriceRanges((prev) =>
      prev.includes(pr) ? prev.filter((x) => x !== pr) : [...prev, pr],
    );

  const toggleDay = (day: WeekDay) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((x) => x !== day) : [...prev, day],
    );

  useEffect(() => {
    if (!session?.accessToken) return;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/mine`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          },
        );
        if (!res.ok) return;

        const data = await res.json();
        const favMap: Record<string, boolean> = {};
        data.forEach((item: { listingId: string }) => {
          favMap[item.listingId] = true;
        });
        setFavorites(favMap);
      } catch {
        // silently ignore
      }
    })();
  }, [session?.accessToken]);

  const toggleFav = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.accessToken) {
      toast.error("Please log in to save listings");
      return;
    }

    const previousState = !!favorites[id];

    // Instant UI update
    setFavorites((p) => ({
      ...p,
      [id]: !previousState,
    }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            listingId: id,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update wishlist");
      }

      const data = await res.json();

      setFavorites((p) => ({
        ...p,
        [id]: data.favorited,
      }));

      toast.success(
        data.favorited ? "Added to wishlist" : "Removed from wishlist",
      );
    } catch (error) {
      console.error("Wishlist error:", error);

      // Rollback UI if API fails
      setFavorites((p) => ({
        ...p,
        [id]: previousState,
      }));

      toast.error("Something went wrong. Please try again.");
    }
  };
  const shareFood = async (item: FoodsCard, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const foodUrl = `${window.location.origin}/category/food/${item.id}`;

    const shareData = {
      title: item.title,
      text: `Check out ${item.title} on HamroCart.`,
      url: foodUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(foodUrl);
        alert("Food listing link copied!");
        return;
      }

      window.prompt("Copy food listing link:", foodUrl);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Food share failed:", error);
    }
  };
  const reset = () => {
    setSelectedFoodTypes([]);
    setSelectedPriceRanges([]);
    setSelectedDays([]);
    setSearch("");
  };

  const categoryCounts: Record<FoodType, number> = FOOD_TYPE_ORDER.reduce(
    (acc, ft) => {
      acc[ft] = rawListings.filter((l) => l.foods?.foodType === ft).length;
      return acc;
    },
    {} as Record<FoodType, number>,
  );

  const filteredRaw = rawListings.filter((l) => {
    if (!l.foods) return false;
    const s = search.toLowerCase();
    if (s && !l.title.toLowerCase().includes(s)) return false;
    if (
      selectedFoodTypes.length &&
      !selectedFoodTypes.includes(l.foods.foodType)
    )
      return false;

    if (selectedPriceRanges.length) {
      const price = l.foods.price;
      const matches = selectedPriceRanges.some((range) => {
        if (range === "Under Rs.100") return price < 100;
        if (range === "Rs.100 - Rs.200") return price >= 100 && price <= 200;
        if (range === "Rs.200 - Rs.500") return price >= 200 && price <= 500;
        if (range === "Above Rs.500") return price > 500;
        return false;
      });
      if (!matches) return false;
    }

    if (selectedDays.length) {
      if (!l.foods.deliveryDays?.some((d) => selectedDays.includes(d)))
        return false;
    }

    return true;
  });

  const sortedRaw = [...filteredRaw].sort((a, b) => {
    if (sort === "price-low")
      return (a.foods?.price ?? 0) - (b.foods?.price ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const cards: FoodsCard[] = sortedRaw.map(toFoodsCard);
  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Newest";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .fd-wrap {
          min-height: 100vh;
          background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
          overflow-x: hidden;
        }

        /* HERO */
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

        /* CATEGORY STRIP */
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
        .fd-cats-row {
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .fd-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          min-width: 140px; font-family: inherit; text-align: left;
          flex-shrink: 0;
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
        .fd-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; white-space: nowrap; }
        .fd-cat-count { font-size: 11px; color: #888; display: block; white-space: nowrap; }

        /* BODY LAYOUT */
        .fd-body {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 20px 60px; display: flex; gap: 18px;
        }

        /* SIDEBAR */
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
        }
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

        /* MAIN */
        .fd-main { flex: 1; min-width: 0; }
        .fd-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
        }
        .fd-count { font-size: 15px; color: #6b7280; font-weight: 600; }
        .fd-count strong { color: #111; font-weight: 800; }

        /* ── CUSTOM SORT DROPDOWN ── */
        .fd-sort-wrap { position: relative; }
        .fd-sort-btn {
          padding: 9px 12px 9px 14px;
          border: 1.5px solid #e0e4f0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          transition: border-color 0.2s;
          white-space: nowrap;
        }
        .fd-sort-btn:hover { border-color: #b91c1c; }
        .fd-sort-btn.open { border-color: #b91c1c; }
        .fd-sort-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: #fff;
          border: 1.5px solid #e0e4f0;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 100;
          min-width: 190px;
          overflow: hidden;
          animation: sortPop 0.18s ease;
        }
        @keyframes sortPop {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fd-sort-option {
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          transition: background 0.12s;
          white-space: nowrap;
        }
          .fd-sort-option:hover { background: #f8fafc; }
        .fd-sort-option.active {
          background: #e0f2fe;
          color: #0369a1;
        }


        /* CARD GRID */
        .fd-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* CARD */
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
        
        .fd-card-share { width: 30px; height: 30px; border-radius: 50%;
          background: rgba(255,255,255,0.94);  border: none;  display: flex;
          align-items: center;  justify-content: center;  cursor: pointer;  padding: 0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.15);  transition:transform 0.15s, background 0.15s, color 0.15s;}
        .fd-card-share:hover {transform: scale(1.15); background: #fff;}
        .fd-card-share { color: #64748b;}
        .fd-card-share:hover {color: #e11d48;}

        .fd-card-badges {
          position: absolute; top: 8px; left: 8px;
          display: flex; flex-direction: column; gap: 4px; z-index: 2;
        }
        .fd-card-badge {
          font-size: 10px; font-weight: 800; padding: 3px 8px;
          border-radius: 5px; text-transform: uppercase; letter-spacing: 0.3px;
        }
        .fd-badge-verified { background: rgba(21,128,61,0.9); color: #fff; }
        .fd-badge-featured { background: rgba(217,119,6,0.9); color: #fff; }

        .fd-card-body { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .fd-card-name { font-size: 16px; font-weight: 800; color: #111; margin: 0; }
        .fd-card-meta {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px; color: #6b7280;
        }
        .fd-card-price { font-size: 13px; font-weight: 700; color: #16a34a; }
        .fd-card-type { font-size: 12px; color: #6b7280; font-weight: 500; }
        .fd-card-posted { font-size: 11px; color: #9ca3af; }
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

        /* EMPTY / LOADING */
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

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .fd-sidebar { display: none; }
          .fd-grid { grid-template-columns: repeat(2, 1fr); }
          .fd-cats-row { gap: 8px; }
          .fd-cat-card { min-width: 130px; }
        }
        @media (max-width: 640px) {
          .fd-grid { grid-template-columns: 1fr; }
          .fd-body { padding: 14px 14px 40px; }
          .fd-cats-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 8px;
            scrollbar-width: none;
          }
          .fd-cats-row::-webkit-scrollbar { display: none; }
          .fd-cat-card { min-width: 130px; flex: 0 0 auto; padding: 10px 14px; }
          .fd-results-bar { flex-direction: column; align-items: stretch; }
          .fd-sort-wrap { width: 100%; min-width: unset; }
        }
      `}</style>

      <div className="fd-wrap">
        {/* HERO */}
        <section className="fd-hero">
          <div className="fd-hero-bg" />
          <div className="fd-hero-overlay" />
          <div className="fd-hero-inner">
            <h1>Food & Home Delivery in Nepal</h1>
            <p>
              Discover the best Food & Home Delivery and
              <br />
              Delicious food around you.
            </p>
            <div className="fd-search-wrap">
              <FiSearch className="fd-search-icon" size={16} />
              <input
                className="fd-search"
                placeholder="Search for restaurants, tiffin, bakery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CATEGORY STRIP */}
        <section className="fd-cats-strip">
          <div className="fd-cats-inner">
            <p className="fd-cats-label">Browse Categories</p>
            <div className="fd-cats-row">
              {FOOD_TYPE_ORDER.map((ft) => {
                const meta = FOOD_TYPE_ICON[ft];
                const active =
                  selectedFoodTypes.length === 1 && selectedFoodTypes[0] === ft;
                return (
                  <button
                    key={ft}
                    className={`fd-cat-card${active ? " active" : ""}`}
                    onClick={() => setSelectedFoodTypes(active ? [] : [ft])}
                  >
                    <span className="fd-cat-icon" style={{ color: meta.color }}>
                      <meta.icon size={22} />
                    </span>
                    <span>
                      <span className="fd-cat-name">{FOOD_TYPE_LABEL[ft]}</span>
                      <span className="fd-cat-count">
                        {categoryCounts[ft]} listings
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="fd-body">
          {/* SIDEBAR */}
          <aside className="fd-sidebar">
            <div className="fd-sb-head">Filter</div>

            {/* Food Type */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Food Type</p>
              {FOOD_TYPE_ORDER.map((ft) => {
                const meta = FOOD_TYPE_ICON[ft];
                return (
                  <div
                    key={ft}
                    className="fd-check-row"
                    onClick={() => toggleFoodType(ft)}
                  >
                    <div
                      className={`fd-radio${selectedFoodTypes.includes(ft) ? " checked" : ""}`}
                    />
                    <span
                      className={`fd-check-label${selectedFoodTypes.includes(ft) ? " checked" : ""}`}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <meta.icon size={13} color={meta.color} />
                        {FOOD_TYPE_LABEL[ft]}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Range */}
            <div className="fd-sb-section">
              <p className="fd-sb-title">Price range</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 4px",
                }}
              >
                {PRICE_RANGES.map((pr) => (
                  <div
                    key={pr}
                    className="fd-check-row"
                    onClick={() => togglePriceRange(pr)}
                  >
                    <div
                      className={`fd-radio${selectedPriceRanges.includes(pr) ? " checked" : ""}`}
                    />
                    <span
                      className={`fd-check-label${selectedPriceRanges.includes(pr) ? " checked" : ""}`}
                      style={{ fontSize: 11 }}
                    >
                      {pr}
                    </span>
                  </div>
                ))}
              </div>
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
                    {DAY_LABEL[day]}
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
                  onChange={(e) =>
                    setSort(e.target.value as "newest" | "price-low")
                  }
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
                <FiChevronDown
                  size={12}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#666",
                  }}
                />
              </div>
            </div>

            <button className="fd-more-btn" onClick={reset}>
              Reset Filters
            </button>
          </aside>

          {/* MAIN */}
          <div className="fd-main">
            {/* Results bar */}
            <div className="fd-results-bar">
              <span className="fd-count">
                <strong>{cards.length}</strong> Restaurants found
              </span>
              <div className="fd-sort-wrap" ref={sortRef}>
                <button
                  className={`fd-sort-btn${sortOpen ? " open" : ""}`}
                  onClick={() => setSortOpen((p) => !p)}
                >
                  {activeSortLabel}
                  <FiChevronDown
                    size={14}
                    style={{
                      transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                {sortOpen && (
                  <div className="fd-sort-dropdown">
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        className={`fd-sort-option${sort === opt.value ? " active" : ""}`}
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="fd-empty">
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#111",
                    margin: 0,
                  }}
                >
                  Loading restaurants…
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="fd-empty">
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#dc2626",
                    margin: "0 0 4px",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Cards */}
            {!loading && !error && cards.length === 0 && (
              <div className="fd-empty">
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#111",
                    margin: 0,
                  }}
                >
                  Loading restaurants...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="fd-empty">
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#dc2626",
                    margin: "0 0 4px",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Cards */}
            {!loading && !error && cards.length === 0 && (
              <div className="fd-empty">
                <div
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FaUtensils size={48} color="#d1d5db" />
                </div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#111",
                    margin: "0 0 4px",
                  }}
                >
                  No restaurants found
                </p>
                <span style={{ fontSize: 13, color: "#888" }}>
                  Try adjusting your filters or search term
                </span>
                <br />
                <button className="fd-empty-btn" onClick={reset}>
                  Reset Filters
                </button>
              </div>
            )}

            {!loading && !error && cards.length > 0 && (
              <div className="fd-grid">
                {cards.map((item) => {
                  const isFav = !!favorites[item.id];
                  return (
                    <div key={item.id} className="fd-card">
                      <Link
                        href={`/category/food/${item.id}`}
                        className="fd-card-img-wrap"
                        style={{ display: "block", textDecoration: "none" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumb}
                          alt={item.title}
                          className="fd-card-img"
                        />

                        <div className="fd-card-badges">
                          {item.isVerified && (
                            <span className="fd-card-badge fd-badge-verified">
                              <FiCheckCircle
                                size={9}
                                style={{ marginRight: 3 }}
                              />
                              Verified
                            </span>
                          )}
                          {item.isFeatured && (
                            <span className="fd-card-badge fd-badge-featured">
                              Featured
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="fd-card-fav"
                          onClick={(e) => toggleFav(item.id, e)}
                          aria-label="Save food listing"
                          title="Save"
                        >
                          {isFav ? (
                            <FaHeart size={12} color="#ef4444" />
                          ) : (
                            <FiHeart size={12} color="#9ca3af" />
                          )}
                        </button>

                        {/* Share */}
                        <button
                          type="button"
                          className="fd-card-share"
                          onClick={(e) => shareFood(item, e)}
                          aria-label={`Share ${item.title}`}
                          title="Share"
                        >
                          <FiShare2 size={13} />
                        </button>
                      </Link>

                      <div className="fd-card-body">
                        <p className="fd-card-name">{item.title}</p>
                        <div className="fd-card-meta">
                          <span className="fd-card-type">{item.foodType}</span>
                          <span className="fd-card-price">{item.price}</span>
                        </div>
                        <span className="fd-card-posted">
                          {item.postedDaysAgo === 0
                            ? "Posted today"
                            : `Posted ${item.postedDaysAgo}d ago`}
                        </span>

                        <div className="fd-card-actions">
                          <Link
                            href={`/category/food/${item.id}`}
                            className="fd-btn-order"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
