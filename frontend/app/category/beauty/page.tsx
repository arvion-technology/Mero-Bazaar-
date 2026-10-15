"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const CAT_CARD_BASE =
  "flex items-center gap-2.5 py-2.5 px-[18px] rounded-[14px] border-[1.5px] cursor-pointer transition-all duration-[180ms] min-w-[120px] font-[inherit] text-left hover:-translate-y-0.5 max-[640px]:min-w-0 max-[640px]:py-2 max-[640px]:px-3.5 max-[640px]:gap-2 max-[640px]:rounded-[10px] max-[640px]:shrink-0";
const CAT_CARD_IDLE =
  "border-[#e4e8f0] bg-[#fafbff] hover:border-[#e11d48] hover:bg-[#fff1f2] hover:shadow-[0_4px_16px_rgba(225,29,72,0.12)]";
const CAT_CARD_ACTIVE =
  "border-[#e11d48] bg-[#ffe4e6] shadow-[0_4px_16px_rgba(225,29,72,0.2)]";

const CAT_BTN_BASE =
  "flex flex-col items-center gap-[3px] py-2 px-1.5 rounded-lg border-[1.5px] cursor-pointer transition-all duration-150 min-w-[52px] font-[inherit]";
const CAT_BTN_IDLE =
  "border-[#e5e7eb] bg-white hover:border-[#e11d48] hover:bg-[#fff1f2]";
const CAT_BTN_ACTIVE = "border-[#e11d48] bg-[#ffe4e6]";

const FLOAT_BTN_BASE =
  "absolute top-2 w-[30px] h-[30px] rounded-full bg-white/[0.94] border-none flex items-center justify-center cursor-pointer p-0 shadow-[0_1px_6px_rgba(0,0,0,0.15)] transition-[transform,background-color,color] duration-150 ease-in-out z-[4] hover:scale-[1.15] hover:bg-white";

const SB_SECTION =
  "py-3 px-4 border-b border-[#f0f0f0] last-of-type:border-b-0";
const SB_TITLE = "text-[13px] font-bold text-[#374151] mb-2.5";
const CHECK_ROW =
  "flex items-center gap-2 mb-2 cursor-pointer last:mb-0";
const CHECKBOX_BASE =
  "w-3.5 h-3.5 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer";
const CHECKBOX_OFF = "border-[#d1d5db] bg-white";
const CHECKBOX_ON =
  "border-[#e11d48] bg-[#e11d48] after:content-['✓'] after:text-white after:text-[9px] after:font-extrabold";

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

/* component */
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="flex items-center gap-0.5">
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
        <span className="text-[10px] font-bold text-[#111] ml-[3px]">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes sortFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="min-h-screen bg-[#f5f5f5] font-[Inter,-apple-system,sans-serif]">
        <section className="relative h-[220px] overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-[url('/hero-beauty.jpg')] bg-center bg-cover bg-no-repeat brightness-50" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.2)_100%)]" />
          <div className="relative z-[2] max-w-[1200px] mx-auto px-7 w-full">
            <h1 className="text-[26px] font-extrabold text-white mt-0 mb-1.5 [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]">
              Find The Best
              <br />
              Hair, Beauty & Wellness Services
            </h1>
            <p className="text-white/75 text-[13px] mt-0 mb-4 leading-normal">
              Trusted Professionals ready to serve you
            </p>
            <div className="relative max-w-[520px]">
              <FiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa]"
                size={16}
              />
              <input
                className="w-full py-[11px] pr-3.5 pl-[42px] bg-white border-none rounded-lg text-sm text-[#333] outline-none shadow-[0_4px_20px_rgba(0,0,0,0.2)] font-[inherit]"
                placeholder="Search salons, services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="bg-white border-b-[1.5px] border-[#eaeaea] py-[18px] max-[640px]:py-3.5">
          <div className="max-w-[1200px] mx-auto px-6 max-[640px]:px-3">
            <p className="text-[13px] font-bold text-[#888] mt-0 mb-3 uppercase tracking-[0.6px]">
              Browse Categories
            </p>
            <div className="flex gap-3 flex-wrap max-[640px]:flex-nowrap max-[640px]:overflow-x-auto max-[640px]:gap-2 max-[640px]:pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                className={`${CAT_CARD_BASE} ${activeCategory === ALL ? CAT_CARD_ACTIVE : CAT_CARD_IDLE}`}
                onClick={() => setActiveCategory(ALL)}
              >
                <span className="text-[22px] flex items-center text-[#374151]">
                  <FiGrid size={22} />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-[#1a1a1a]">
                    All
                  </span>
                  <span className="block text-[11px] text-[#888]">
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
                      className={`${CAT_CARD_BASE} ${activeCategory === key ? CAT_CARD_ACTIVE : CAT_CARD_IDLE}`}
                      onClick={() => setActiveCategory(key)}
                    >
                      <span
                        className="text-[22px] flex items-center"
                        style={{ color: meta.color }}
                      >
                        <meta.icon size={22} />
                      </span>
                      <span>
                        <span className="block text-[13px] font-bold text-[#1a1a1a]">
                          {meta.label}
                        </span>
                        <span className="block text-[11px] text-[#888]">
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

        <div className="max-w-[1200px] mx-auto pt-5 px-5 pb-[60px] flex gap-[18px] max-[640px]:pt-3.5 max-[640px]:px-3.5 max-[640px]:pb-10">
          <aside className="w-[220px] shrink-0 bg-white rounded-[10px] border border-[#e5e7eb] shadow-[0_2px_8px_rgba(0,0,0,0.06)] self-start sticky top-4 overflow-hidden max-[900px]:hidden">
            <div className="pt-3.5 px-4 pb-2.5 text-[15px] font-extrabold text-[#1a1a1a] border-b border-[#f0f0f0] flex items-center justify-between [&_svg]:text-[#9ca3af]">
              Filter
              <FiChevronDown size={16} />
            </div>

            <div className={SB_SECTION}>
              <p className={SB_TITLE}>Service Category</p>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  className={`${CAT_BTN_BASE} ${activeCategory === ALL ? CAT_BTN_ACTIVE : CAT_BTN_IDLE}`}
                  onClick={() => setActiveCategory(ALL)}
                >
                  <span
                    className={`text-[22px] flex items-center leading-none ${activeCategory === ALL ? "text-[#e11d48]" : "text-[#374151]"}`}
                  >
                    <FiGrid size={20} />
                  </span>
                  <span
                    className={`text-[9px] ${activeCategory === ALL ? "text-[#e11d48] font-bold" : "text-[#374151] font-semibold"}`}
                  >
                    All
                  </span>
                </button>
                {(Object.keys(SERVICE_TYPE_META) as BeautyServiceType[]).map(
                  (key) => {
                    const meta = SERVICE_TYPE_META[key];
                    const active = activeCategory === key;
                    return (
                      <button
                        key={key}
                        className={`${CAT_BTN_BASE} ${active ? CAT_BTN_ACTIVE : CAT_BTN_IDLE}`}
                        onClick={() => setActiveCategory(key)}
                      >
                        <span
                          className={`text-[22px] flex items-center leading-none ${active ? "text-[#e11d48]" : "text-[#374151]"}`}
                        >
                          <meta.icon size={20} />
                        </span>
                        <span
                          className={`text-[9px] ${active ? "text-[#e11d48] font-bold" : "text-[#374151] font-semibold"}`}
                        >
                          {meta.label}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className={SB_SECTION}>
              <p className={SB_TITLE}>Price range</p>
              {PRICE_RANGES.map((pr) => {
                const checked = selectedPriceRanges.includes(pr);
                return (
                  <div
                    key={pr}
                    className={CHECK_ROW}
                    onClick={() => togglePriceRange(pr)}
                  >
                    <div
                      className={`${CHECKBOX_BASE} ${checked ? CHECKBOX_ON : CHECKBOX_OFF}`}
                    />
                    <span
                      className={`text-xs ${checked ? "text-[#111] font-bold" : "text-[#374151] font-medium"}`}
                    >
                      {pr}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={SB_SECTION}>
              <p className={SB_TITLE}>Home Visit</p>
              <div className={CHECK_ROW} onClick={() => setHomeVisit(!homeVisit)}>
                <div
                  className={`${CHECKBOX_BASE} ${homeVisit ? CHECKBOX_ON : CHECKBOX_OFF}`}
                />
                <span
                  className={`text-xs ${homeVisit ? "text-[#111] font-bold" : "text-[#374151] font-medium"}`}
                >
                  Home Visit Available
                </span>
              </div>
            </div>

            <div className={SB_SECTION}>
              <p className={SB_TITLE}>Bridal Packages</p>
              <div
                className={CHECK_ROW}
                onClick={() => setBridalPackage(!bridalPackage)}
              >
                <div
                  className={`${CHECKBOX_BASE} ${bridalPackage ? CHECKBOX_ON : CHECKBOX_OFF}`}
                />
                <span
                  className={`text-xs ${bridalPackage ? "text-[#111] font-bold" : "text-[#374151] font-medium"}`}
                >
                  Bridal Service
                </span>
              </div>
            </div>

            <div className={SB_SECTION}>
              <p className={SB_TITLE}>Sort By</p>
              <div className="relative">
                <select
                  className="w-full py-[7px] px-2.5 rounded-[7px] border border-[#e0e4f0] text-xs text-[#444] bg-[#f9fafb] outline-none font-[inherit] cursor-pointer focus:border-[#e11d48]"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]"
                />
              </div>
            </div>

            <button
              className="block w-full p-2.5 bg-[#f3f4f6] text-[#111] text-[13px] font-bold border-none cursor-pointer font-[inherit] transition-colors duration-150 text-center hover:bg-[#e5e7eb]"
              onClick={reset}
            >
              Reset Filters
            </button>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-[60px] px-6 bg-white rounded-[10px] border border-[#e5e7eb]">
                <p className="font-bold text-base text-[#111] mt-0 mb-1">
                  Loading services…
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-[60px] px-6 bg-white rounded-[10px] border border-[#e5e7eb]">
                <p className="font-bold text-base text-[#111] mt-0 mb-1">
                  Couldn&apos;t load services
                </p>
                <span className="text-[13px] text-[#888]">{error}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span className="text-[15px] text-[#6b7280] font-semibold">
                    <strong className="text-[#111] font-extrabold">
                      {sortedDisplayed.length}
                    </strong>{" "}
                    services found
                  </span>

                  <div className="relative" ref={sortRef}>
                    <button
                      className="flex items-center gap-2 py-2 px-3.5 bg-white border border-[#e0e4f0] rounded-lg text-[13px] font-semibold text-[#333] cursor-pointer font-[inherit] transition-colors duration-200 hover:border-[#bbb]"
                      onClick={() => setIsSortOpen((v) => !v)}
                    >
                      {sortLabel[sort]}
                      <FiChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isSortOpen && (
                      <div className="absolute top-[calc(100%+6px)] right-0 min-w-[180px] bg-white border-[1.5px] border-[#e0e0e0] rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-[200] overflow-hidden animate-[sortFade_0.15s_ease]">
                        {SORT_OPTIONS.map((opt) => (
                          <div
                            key={opt.value}
                            className={`py-2.5 px-4 text-[13px] cursor-pointer transition-all duration-150 border-b border-[#f5f5f5] last:border-b-0 ${
                              sort === opt.value
                                ? "bg-[#e11d48] text-white"
                                : "text-[#444] hover:bg-[#fff1f2] hover:text-[#e11d48]"
                            }`}
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
                  <div className="text-center py-[60px] px-6 bg-white rounded-[10px] border border-[#e5e7eb]">
                    <div className="mb-3 text-[#bbb] flex justify-center">
                      <FiScissors size={48} />
                    </div>
                    <p className="font-bold text-base text-[#111] mt-0 mb-1">
                      No services found
                    </p>
                    <span className="text-[13px] text-[#888]">
                      Try adjusting your filters or search term
                    </span>
                    <br />
                    <button
                      className="mt-3 py-[9px] px-[22px] bg-[#e11d48] text-white font-bold text-[13px] border-none rounded-[7px] cursor-pointer font-[inherit]"
                      onClick={reset}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
                    {sortedDisplayed.map((item) => {
                      const isFav = !!favorites[item.id];
                      const meta = SERVICE_TYPE_META[item.serviceType];
                      return (
                        <div
                          key={item.id}
                          className="group bg-white rounded-[10px] border border-[#e5e7eb] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-[transform,box-shadow] duration-200 no-underline text-inherit hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)]"
                        >
                          <Link
                            href={`/category/beauty/${item.id}`}
                            className="relative block w-full aspect-[4/3] overflow-hidden bg-[#e5e7eb] no-underline"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.thumb}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.06]"
                            />
                            {/* Share */}
                            <button
                              type="button"
                              className={`${FLOAT_BTN_BASE} right-11 text-[#64748b] hover:text-[#e11d48]`}
                              onClick={(e) => shareBeauty(item, e)}
                              aria-label={`Share ${item.title}`}
                              title="Share"
                            >
                              <FiShare2 size={13} />
                            </button>
                            {/* Favorite */}
                            <button
                              type="button"
                              className={`${FLOAT_BTN_BASE} right-2`}
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

                            {item.homeVisit && (
                              <span className="absolute bottom-2 left-2 bg-[rgba(225,29,72,0.9)] text-white text-[9px] font-bold rounded-[5px] py-[3px] px-[7px] flex items-center gap-[3px]">
                                <FiHome size={9} /> Home Visit
                              </span>
                            )}
                          </Link>

                          <div className="p-3.5 flex flex-col gap-[5px] flex-1">
                            <p className="text-[15px] font-extrabold text-[#111] m-0">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[#9ca3af] font-medium m-0">
                              {meta?.label ?? item.serviceType}
                              {item.city ? ` • ${item.city}` : ""}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <div>
                                <span className="text-[10px] text-[#9ca3af] font-medium">
                                  Starting From
                                </span>
                                <div className="text-xs font-bold text-[#e11d48]">
                                  {item.price}
                                </div>
                              </div>
                            </div>

                            <Link
                              href={`/category/beauty/${item.id}`}
                              className="block w-full py-[9px] px-3 bg-[#e11d48] text-white text-xs font-bold border-none rounded-md cursor-pointer font-[inherit] text-center no-underline transition-colors duration-150 mt-2 hover:bg-[#be123c]"
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