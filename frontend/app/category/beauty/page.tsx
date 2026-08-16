"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiChevronDown,
  FiStar,
  FiHeart,
  FiGrid,
  FiScissors,
  FiDroplet,
  FiHome,
  FiShare2,
} from "react-icons/fi";
import {
  FaHeart,
  FaPaintBrush,
  FaHandSparkles,
  FaSpa,
  FaCut,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { toBeautyCard } from "@/lib/adapters/beautyAdapter";
import type {
  BeautyListing,
  BeautyCard,
  BeautyServiceType,
} from "@/app/types/beauty";

/* ─────────── SERVICE TYPE META (matches Prisma BeautyServiceType enum) ─────────── */
const SERVICE_TYPE_META: Record<
  BeautyServiceType,
  { label: string; icon: IconType; color: string }
> = {
  SALON: { label: "Salon", icon: FiScissors, color: "#7c3aed" },
  BARBER: { label: "Barber", icon: FaCut, color: "#0f766e" },
  MAKEUP_ARTIST: {
    label: "Makeup Artist",
    icon: FaPaintBrush,
    color: "#e11d48",
  },
  SKINCARE: { label: "Skincare", icon: FiDroplet, color: "#1d4ed8" },
  SPA: { label: "Spa", icon: FaSpa, color: "#059669" },
  COSMETICS: { label: "Cosmetics", icon: FaHandSparkles, color: "#db2777" },
  BRIDAL: { label: "Bridal", icon: FaHeart, color: "#f59e0b" },
};

const ALL = "ALL" as const;
type CategoryFilter = BeautyServiceType | typeof ALL;

type PriceRange =
  | "Under Rs.1,000"
  | "Rs.1,000 - Rs.3,000"
  | "Rs.3,000 - Rs.6,000"
  | "Above Rs.6,000";
const PRICE_RANGES: PriceRange[] = [
  "Under Rs.1,000",
  "Rs.1,000 - Rs.3,000",
  "Rs.3,000 - Rs.6,000",
  "Above Rs.6,000",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const parsePrice = (priceStr: string): number => {
  const match = priceStr.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

async function fetchBeautyListings(): Promise<BeautyListing[]> {
  const res = await fetch("/api/beauty", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load listings (${res.status})`);
  const json = await res.json();
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  return [];
}

/* ─────────── COMPONENT ─────────── */
export default function BeautyWellnessPage() {
  const [listings, setListings] = useState<BeautyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(ALL);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>(
    [],
  );
  const [homeVisit, setHomeVisit] = useState(false);
  const [bridalPackage, setBridalPackage] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
    const { data: session } = useSession();


  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBeautyListings()
      .then((raw) => {
        if (cancelled) return;
        const cards = raw
          .map((l) => {
            try {
              return toBeautyCard(l);
            } catch {
              return null;
            }
          })
          .filter((c): c is BeautyCard => c !== null);
        setListings(cards);
        setError(null);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Failed to load listings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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

  const togglePriceRange = (pr: PriceRange) =>
    setSelectedPriceRanges((prev) =>
      prev.includes(pr) ? prev.filter((x) => x !== pr) : [...prev, pr],
    );

  useEffect(() => {
      if (!session?.accessToken) return;
  
      (async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/mine`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
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
        }
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
        data.favorited
          ? "Added to wishlist"
          : "Removed from wishlist"
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
  const shareBeauty = async (item: BeautyCard, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const beautyUrl = `${window.location.origin}/category/beauty/${item.id}`;

    const shareData = {
      title: item.title,
      text: `Check out ${item.title} on HamroCart.`,
      url: beautyUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(beautyUrl);
        alert("Beauty service link copied!");
        return;
      }

      window.prompt("Copy beauty service link:", beautyUrl);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Beauty share failed:", error);
    }
  };

  const reset = () => {
    setSelectedPriceRanges([]);
    setHomeVisit(false);
    setBridalPackage(false);
    setActiveCategory(ALL);
    setSearch("");
    setSort("newest");
  };

  const categoryCount = (key: CategoryFilter) =>
    key === ALL
      ? listings.length
      : listings.filter((l) => l.serviceType === key).length;

  const displayed = listings.filter((s) => {
    const searchLower = search.toLowerCase();
    if (
      searchLower &&
      !s.title.toLowerCase().includes(searchLower) &&
      !(s.city ?? "").toLowerCase().includes(searchLower)
    )
      return false;
    if (activeCategory !== ALL && s.serviceType !== activeCategory)
      return false;

    if (selectedPriceRanges.length) {
      const price = parsePrice(s.price);
      const matches = selectedPriceRanges.some((range) => {
        if (range === "Under Rs.1,000") return price < 1000;
        if (range === "Rs.1,000 - Rs.3,000")
          return price >= 1000 && price <= 3000;
        if (range === "Rs.3,000 - Rs.6,000")
          return price > 3000 && price <= 6000;
        if (range === "Above Rs.6,000") return price > 6000;
        return false;
      });
      if (!matches) return false;
    }

    if (homeVisit && !s.homeVisit) return false;
    if (bridalPackage && !s.bridalAvailable) return false;

    return true;
  });

  const sortedDisplayed = [...displayed].sort((a, b) => {
    if (sort === "newest") return a.postedDaysAgo - b.postedDaysAgo;
    if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    if (sort === "price-low") return parsePrice(a.price) - parsePrice(b.price);
    if (sort === "price-high") return parsePrice(b.price) - parsePrice(a.price);
    return 0;
  });

  const sortLabel: Record<string, string> = {
    newest: "Newest",
    "price-low": "Price Low to High",
    "price-high": "Price High to Low",
    rating: "Highest Rated",
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={10}
            fill={
              i < fullStars || (i === fullStars && hasHalf) ? "#f59e0b" : "none"
            }
            color={
              i < fullStars || (i === fullStars && hasHalf)
                ? "#f59e0b"
                : "#d1d5db"
            }
          />
        ))}
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#111",
            marginLeft: 3,
          }}
        >
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .bw-wrap { min-height: 100vh; background: #f5f5f5; font-family: 'Inter', -apple-system, sans-serif; }
        .bw-hero { position: relative; height: 220px; overflow: hidden; display: flex; align-items: center; }
        .bw-hero-bg { position: absolute; inset: 0; background: url('/hero-beauty.jpg') center center / cover no-repeat; filter: brightness(0.5); }
        .bw-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%); }
        .bw-hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 0 28px; width: 100%; }
        .bw-hero-inner h1 { font-size: 26px; font-weight: 800; color: #fff; margin: 0 0 6px; text-shadow: 0 2px 10px rgba(0,0,0,0.4); }
        .bw-hero-inner p { color: rgba(255,255,255,0.75); font-size: 13px; margin: 0 0 16px; line-height: 1.5; }
        .bw-search-wrap { position: relative; max-width: 520px; }
        .bw-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #aaa; }
        .bw-search { width: 100%; padding: 11px 14px 11px 42px; background: #fff; border: none; border-radius: 8px; font-size: 14px; color: #333; outline: none; box-shadow: 0 4px 20px rgba(0,0,0,0.2); font-family: inherit; }
        .bw-cats-strip { background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0; }
        .bw-cats-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .bw-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px; }
        .bw-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .bw-cat-card { display: flex; align-items: center; gap: 10px; padding: 10px 18px; border-radius: 14px; border: 1.5px solid #e4e8f0; background: #fafbff; cursor: pointer; transition: all 0.18s; min-width: 120px; font-family: inherit; text-align: left; }
        .bw-cat-card:hover { border-color: #e11d48; background: #fff1f2; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(225,29,72,0.12); }
        .bw-cat-card.active { border-color: #e11d48; background: #ffe4e6; box-shadow: 0 4px 16px rgba(225,29,72,0.2); }
        .bw-cat-icon { font-size: 22px; display: flex; align-items: center; }
        .bw-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .bw-cat-count { font-size: 11px; color: #888; display: block; }
        .bw-body { max-width: 1200px; margin: 0 auto; padding: 20px 20px 60px; display: flex; gap: 18px; }
        .bw-sidebar { width: 220px; flex-shrink: 0; background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.06); align-self: flex-start; position: sticky; top: 16px; overflow: hidden; }
        .bw-sb-head { padding: 14px 16px 10px; font-size: 15px; font-weight: 800; color: #1a1a1a; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; }
        .bw-sb-head svg { color: #9ca3af; }
        .bw-sb-section { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; }
        .bw-sb-section:last-of-type { border-bottom: none; }
        .bw-sb-title { font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 10px; }
        .bw-cat-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .bw-cat-btn { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 6px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; transition: all 0.15s; min-width: 52px; font-family: inherit; }
        .bw-cat-btn:hover { border-color: #e11d48; background: #fff1f2; }
        .bw-cat-btn.active { border-color: #e11d48; background: #ffe4e6; }
        .bw-cat-btn .bw-cat-icon { line-height: 1; color: #374151; }
        .bw-cat-btn.active .bw-cat-icon { color: #e11d48; }
        .bw-cat-label { font-size: 9px; font-weight: 600; color: #374151; }
        .bw-cat-btn.active .bw-cat-label { color: #e11d48; font-weight: 700; }
        .bw-check-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer; }
        .bw-check-row:last-child { margin-bottom: 0; }
        .bw-checkbox { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #fff; transition: all 0.15s; cursor: pointer; }
        .bw-checkbox.checked { border-color: #e11d48; background: #e11d48; }
        .bw-checkbox.checked::after { content: "✓"; color: #fff; font-size: 9px; font-weight: 800; }
        .bw-check-label { font-size: 12px; color: #374151; font-weight: 500; }
        .bw-check-label.checked { color: #111; font-weight: 700; }
        .bw-sort-select { width: 100%; padding: 7px 10px; border-radius: 7px; border: 1px solid #e0e4f0; font-size: 12px; color: #444; background: #f9fafb; outline: none; font-family: inherit; cursor: pointer; }
        .bw-sort-select:focus { border-color: #e11d48; }
        .bw-more-btn { display: block; width: 100%; padding: 10px; background: #f3f4f6; color: #111; font-size: 13px; font-weight: 700; border: none; cursor: pointer; font-family: inherit; transition: background 0.15s; text-align: center; }
        .bw-more-btn:hover { background: #e5e7eb; }
        .bw-main { flex: 1; min-width: 0; }
        .bw-results-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
        .bw-count { font-size: 15px; color: #6b7280; font-weight: 600; }
        .bw-count strong { color: #111; font-weight: 800; }
        .bw-sort-dropdown { position: relative; }
        .bw-sort-btn { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fff; border: 1px solid #e0e4f0; border-radius: 8px; font-size: 13px; font-weight: 600; color: #333; cursor: pointer; font-family: inherit; transition: border-color 0.2s; }
        .bw-sort-btn:hover { border-color: #bbb; }
        .bw-sort-menu { position: absolute; top: calc(100% + 6px); right: 0; min-width: 180px; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 200; overflow: hidden; animation: sortFade 0.15s ease; }
        @keyframes sortFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .bw-sort-option { padding: 10px 16px; font-size: 13px; color: #444; cursor: pointer; transition: all 0.15s; border-bottom: 1px solid #f5f5f5; }
        .bw-sort-option:last-child { border-bottom: none; }
        .bw-sort-option:hover { background: #fff1f2; color: #e11d48; }
        .bw-sort-option.active { background: #e11d48; color: #fff; }
        .bw-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .bw-card { background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; }
        .bw-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }
        .bw-card-img-wrap { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #e5e7eb; }
        .bw-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .bw-card:hover .bw-card-img { transform: scale(1.06); }
        .bw-card-fav { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.92); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.15); transition: transform 0.15s; padding: 0; z-index: 2; }
        .bw-card-fav:hover { transform: scale(1.15); }
        .bw-card-share { width: 30px; height: 30px; border-radius: 50%;
         background: rgba(255,255,255,0.94); border: none; display: flex;
         align-items: center; justify-content: center; cursor: pointer;
         padding: 0; box-shadow: 0 1px 6px rgba(0,0,0,0.15); transition:
         transform 0.15s, background 0.15s, color 0.15s;}
         .bw-card-share:hover { transform: scale(1.15); background: #fff;}
         .bw-card-share { color: #64748b;}
         .bw-card-share:hover { color: #e11d48;}
        .bw-card-home-badge { position: absolute; bottom: 8px; left: 8px; background: rgba(225,29,72,0.9); color: #fff; font-size: 9px; font-weight: 700; border-radius: 5px; padding: 3px 7px; display: flex; align-items: center; gap: 3px; }
        .bw-card-body { padding: 14px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .bw-card-name { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
        .bw-card-meta { font-size: 11px; color: #9ca3af; font-weight: 500; }
        .bw-card-price-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
        .bw-card-price-label { font-size: 10px; color: #9ca3af; font-weight: 500; }
        .bw-card-price { font-size: 12px; font-weight: 700; color: #e11d48; }
        .bw-card-stars { margin-top: 2px; }
        .bw-card-btn { display: block; width: 100%; padding: 9px 12px; background: #e11d48; color: #fff; font-size: 12px; font-weight: 700; border: none; border-radius: 6px; cursor: pointer; font-family: inherit; text-align: center; text-decoration: none; transition: background 0.15s; margin-top: 8px; }
        .bw-card-btn:hover { background: #be123c; }
        .bw-empty, .bw-state { text-align: center; padding: 60px 24px; background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; }
        .bw-empty-icon { margin-bottom: 12px; color: #bbb; }
        .bw-empty p, .bw-state p { font-weight: 700; font-size: 16px; color: #111; margin: 0 0 4px; }
        .bw-empty span, .bw-state span { font-size: 13px; color: #888; }
        .bw-empty-btn { margin-top: 12px; padding: 9px 22px; background: #e11d48; color: #fff; font-weight: 700; font-size: 13px; border: none; border-radius: 7px; cursor: pointer; font-family: inherit; }
        @media (max-width: 900px) {
          .bw-sidebar { display: none; }
          .bw-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .bw-grid { grid-template-columns: 1fr; }
          .bw-body { padding: 14px 14px 40px; }
          .bw-cats-strip { padding: 14px 0; }
          .bw-cats-inner { padding: 0 12px; }
          .bw-cats-row { flex-wrap: nowrap; overflow-x: auto; gap: 8px; padding-bottom: 4px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .bw-cats-row::-webkit-scrollbar { display: none; }
          .bw-cat-card { min-width: auto; padding: 8px 14px; gap: 8px; border-radius: 10px; border-width: 1.5px; flex-shrink: 0; }
        }
      `}</style>

      <div className="bw-wrap">
        <section className="bw-hero">
          <div className="bw-hero-bg" />
          <div className="bw-hero-overlay" />
          <div className="bw-hero-inner">
            <h1>
              Find The Best
              <br />
              Hair, Beauty & Wellness Services
            </h1>
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

        <section className="bw-cats-strip">
          <div className="bw-cats-inner">
            <p className="bw-cats-label">Browse Categories</p>
            <div className="bw-cats-row">
              <button
                className={`bw-cat-card${activeCategory === ALL ? " active" : ""}`}
                onClick={() => setActiveCategory(ALL)}
              >
                <span className="bw-cat-icon" style={{ color: "#374151" }}>
                  <FiGrid size={22} />
                </span>
                <span>
                  <span className="bw-cat-name">All</span>
                  <span className="bw-cat-count">
                    {categoryCount(ALL)} listings
                  </span>
                </span>
              </button>
              {(Object.keys(SERVICE_TYPE_META) as BeautyServiceType[]).map(
                (key) => {
                  const meta = SERVICE_TYPE_META[key];
                  return (
                    <button
                      key={key}
                      className={`bw-cat-card${activeCategory === key ? " active" : ""}`}
                      onClick={() => setActiveCategory(key)}
                    >
                      <span
                        className="bw-cat-icon"
                        style={{ color: meta.color }}
                      >
                        <meta.icon size={22} />
                      </span>
                      <span>
                        <span className="bw-cat-name">{meta.label}</span>
                        <span className="bw-cat-count">
                          {categoryCount(key)} listings
                        </span>
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </section>

        <div className="bw-body">
          <aside className="bw-sidebar">
            <div className="bw-sb-head">
              Filter
              <FiChevronDown size={16} />
            </div>

            <div className="bw-sb-section">
              <p className="bw-sb-title">Service Category</p>
              <div className="bw-cat-row">
                <button
                  className={`bw-cat-btn${activeCategory === ALL ? " active" : ""}`}
                  onClick={() => setActiveCategory(ALL)}
                >
                  <span className="bw-cat-icon">
                    <FiGrid size={20} />
                  </span>
                  <span className="bw-cat-label">All</span>
                </button>
                {(Object.keys(SERVICE_TYPE_META) as BeautyServiceType[]).map(
                  (key) => {
                    const meta = SERVICE_TYPE_META[key];
                    return (
                      <button
                        key={key}
                        className={`bw-cat-btn${activeCategory === key ? " active" : ""}`}
                        onClick={() => setActiveCategory(key)}
                      >
                        <span className="bw-cat-icon">
                          <meta.icon size={20} />
                        </span>
                        <span className="bw-cat-label">{meta.label}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="bw-sb-section">
              <p className="bw-sb-title">Price range</p>
              {PRICE_RANGES.map((pr) => (
                <div
                  key={pr}
                  className="bw-check-row"
                  onClick={() => togglePriceRange(pr)}
                >
                  <div
                    className={`bw-checkbox${selectedPriceRanges.includes(pr) ? " checked" : ""}`}
                  />
                  <span
                    className={`bw-check-label${selectedPriceRanges.includes(pr) ? " checked" : ""}`}
                  >
                    {pr}
                  </span>
                </div>
              ))}
            </div>

            <div className="bw-sb-section">
              <p className="bw-sb-title">Home Visit</p>
              <div
                className="bw-check-row"
                onClick={() => setHomeVisit(!homeVisit)}
              >
                <div className={`bw-checkbox${homeVisit ? " checked" : ""}`} />
                <span
                  className={`bw-check-label${homeVisit ? " checked" : ""}`}
                >
                  Home Visit Available
                </span>
              </div>
            </div>

            <div className="bw-sb-section">
              <p className="bw-sb-title">Bridal Packages</p>
              <div
                className="bw-check-row"
                onClick={() => setBridalPackage(!bridalPackage)}
              >
                <div
                  className={`bw-checkbox${bridalPackage ? " checked" : ""}`}
                />
                <span
                  className={`bw-check-label${bridalPackage ? " checked" : ""}`}
                >
                  Bridal Service
                </span>
              </div>
            </div>

            <div className="bw-sb-section">
              <p className="bw-sb-title">Sort By</p>
              <div style={{ position: "relative" }}>
                <select
                  className="bw-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
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

            <button className="bw-more-btn" onClick={reset}>
              Reset Filters
            </button>
          </aside>

          <div className="bw-main">
            {loading ? (
              <div className="bw-state">
                <p>Loading services…</p>
              </div>
            ) : error ? (
              <div className="bw-state">
                <p>Couldn&apos;t load services</p>
                <span>{error}</span>
              </div>
            ) : (
              <>
                <div className="bw-results-bar">
                  <span className="bw-count">
                    <strong>{sortedDisplayed.length}</strong> Hair, Beauty &
                    Wellness found
                  </span>

                  <div className="bw-sort-dropdown" ref={sortRef}>
                    <button
                      className="bw-sort-btn"
                      onClick={() => setIsSortOpen((v) => !v)}
                    >
                      {sortLabel[sort]}
                      <FiChevronDown
                        size={14}
                        style={{
                          transform: isSortOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.2s",
                        }}
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

                {sortedDisplayed.length === 0 ? (
                  <div className="bw-empty">
                    <div className="bw-empty-icon">
                      <FiScissors size={48} />
                    </div>
                    <p>No services found</p>
                    <span>Try adjusting your filters or search term</span>
                    <br />
                    <button className="bw-empty-btn" onClick={reset}>
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="bw-grid">
                    {sortedDisplayed.map((item) => {
                      const isFav = !!favorites[item.id];
                      const meta = SERVICE_TYPE_META[item.serviceType];
                      return (
                        <div key={item.id} className="bw-card">
                          <Link
                            href={`/category/beauty/${item.id}`}
                            className="bw-card-img-wrap"
                            style={{ display: "block", textDecoration: "none" }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.thumb}
                              alt={item.title}
                              className="bw-card-img"
                            />

                            {/* Favorite */}
                            <button
                              type="button"
                              className="bw-card-fav"
                              onClick={(e) => toggleFav(item.id, e)}
                              aria-label="Save beauty service"
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
                              className="bw-card-share"
                              onClick={(e) => shareBeauty(item, e)}
                              aria-label={`Share ${item.title}`}
                              title="Share"
                            >
                              <FiShare2 size={13} />
                            </button>

                            {item.homeVisit && (
                              <span className="bw-card-home-badge">
                                <FiHome size={9} /> Home Visit
                              </span>
                            )}
                          </Link>

                          <div className="bw-card-body">
                            <p className="bw-card-name">{item.title}</p>
                            <p className="bw-card-meta">
                              {meta?.label ?? item.serviceType}
                              {item.city ? ` • ${item.city}` : ""}
                            </p>
                            <div className="bw-card-price-row">
                              <div>
                                <span className="bw-card-price-label">
                                  Starting From
                                </span>
                                <div className="bw-card-price">
                                  {item.price}
                                </div>
                              </div>
                            </div>
                            <div className="bw-card-stars">
                              {renderStars(item.rating ?? 0)}
                            </div>

                            <Link
                              href={`/category/beauty/${item.id}`}
                              className="bw-card-btn"
                            >
                              Book Now
                            </Link>
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
