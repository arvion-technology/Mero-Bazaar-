 "use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiSearch, FiMapPin, FiHeart } from "react-icons/fi";
import { FaHeart, FaStar, FaHammer } from "react-icons/fa";
import { MdHandyman, MdConstruction, MdPlumbing, MdElectricalServices, MdFormatPaint, MdCleaningServices } from "react-icons/md";

type TradeListing = {
    id: string;
    name: string;
    category: string;
    type: string;
    rating: number;
    reviews: number;
    location: string;
    city: string;
    image: string;
    isVerified?: boolean;
    isFeatured?: boolean;
    isAvailable?: boolean;
    experience?: string;
};

const LISTINGS: TradeListing[] = [
    {
        id: "elite-construction-kathmandu",
        name: "Elite Construction & Renovation",
        category: "Building & Construction",
        type: "Construction",
        rating: 4.8,
        reviews: 134,
        location: "Baneshwor, Kathmandu, Nepal",
        city: "Kathmandu",
        image: "/construction banner.jpg",
        isVerified: true,
        isFeatured: true,
        isAvailable: true,
        experience: "10+ yrs",
    },
    {
        id: "hamro-plumbing-lalitpur",
        name: "Hamro Plumbing Services",
        category: "Plumbing & Water",
        type: "Plumbing",
        rating: 4.6,
        reviews: 89,
        location: "Sanepa, Lalitpur, Nepal",
        city: "Lalitpur",
        image: "https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D",
        isVerified: true,
        isFeatured: false,
        isAvailable: true,
        experience: "7 yrs",
    },
    {
        id: "nepal-electric-works",
        name: "Nepal Electric Works",
        category: "Electrical & Wiring",
        type: "Electrical",
        rating: 4.7,
        reviews: 102,
        location: "New Road, Kathmandu, Nepal",
        city: "Kathmandu",
        image: "https://images.unsplash.com/photo-1595856619767-ab739fa7daae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWxlY3RyaWMlMjB3b3JrZXJ8ZW58MHx8MHx8fDA%3D",
        isVerified: true,
        isFeatured: true,
        isAvailable: true,
        experience: "12 yrs",
    },
    {
        id: "dream-house-builder",
        name: "Dream House Builder Pvt. Ltd",
        category: "Building & Construction",
        type: "Construction",
        rating: 4.5,
        reviews: 76,
        location: "Changunarayan, Bhaktapur, Nepal",
        city: "Bhaktapur",
        image: "/construction banner.jpg",
        isVerified: false,
        isFeatured: false,
        isAvailable: true,
        experience: "5 yrs",
    },
    {
        id: "pokhara-painting-pros",
        name: "Pokhara Painting Professionals",
        category: "Painting & Decorating",
        type: "Painting",
        rating: 4.4,
        reviews: 58,
        location: "Lakeside, Pokhara, Nepal",
        city: "Pokhara",
        image: "https://media.istockphoto.com/id/1015387276/photo/man-in-a-working-overall.webp?a=1&b=1&s=612x612&w=0&k=20&c=hRKgUeDPUhJM5JZi4BNXgQBGGjUflYVzDNvR4-knvxI=",
        isVerified: true,
        isFeatured: false,
        isAvailable: false,
        experience: "8 yrs",
    },
    {
        id: "swift-ac-repair-ktm",
        name: "Swift AC & Appliance Repair",
        category: "Appliance Repair",
        type: "Appliance Repair",
        rating: 4.9,
        reviews: 211,
        location: "Chabahil, Kathmandu, Nepal",
        city: "Kathmandu",
        image: "https://plus.unsplash.com/premium_photo-1683134512538-7b390d0adc9e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUMlMjAlMjYlMjBBcHBsaWFuY2UlMjBSZXBhaXJ8ZW58MHx8MHx8fDA%3D",
        isVerified: true,
        isFeatured: true,
        isAvailable: true,
        experience: "9 yrs",
    },
];

const CATEGORIES = ["All", "Construction", "Plumbing", "Electrical", "Painting", "Appliance Repair", "Carpentry", "Cleaning"];
const TRADE_TYPES = ["All", "Construction", "Plumbing", "Electrical", "Painting", "Appliance Repair", "Others"];
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Construction: <MdConstruction size={22} color="#b45309" />,
    Plumbing: <MdPlumbing size={22} color="#b45309" />,
    Electrical: <MdElectricalServices size={22} color="#b45309" />,
    Painting: <MdFormatPaint size={22} color="#b45309" />,
    "Appliance Repair": <MdHandyman size={22} color="#b45309" />,
    Carpentry: <FaHammer size={20} color="#b45309" />,
    Cleaning: <MdCleaningServices size={22} color="#b45309" />,
};

const CATEGORY_COUNTS: Record<string, number> = {
    Construction: 1820,
    Plumbing: 540,
    Electrical: 730,
    Painting: 310,
    "Appliance Repair": 490,
    Carpentry: 220,
    Cleaning: 680,
};

export default function TradeAndHomeRepairPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [activeCategory, setActiveCategory] = useState("All");
    const [city, setCity] = useState("");
    const [tradeType, setTradeType] = useState("All");
    const [availableOnly, setAvailableOnly] = useState(false);
    const [favorites, setFavorites] = useState<Record<string, boolean>>({});

    const toggleFav = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites((p) => ({ ...p, [id]: !p[id] }));
    };

    const reset = () => {
        setCity("");
        setTradeType("All");
        setAvailableOnly(false);
        setActiveCategory("All");
    };

    const displayed = LISTINGS.filter((l) => {
        const matchSearch =
            l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.category.toLowerCase().includes(search.toLowerCase()) ||
            l.location.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || l.type === activeCategory;
        const matchCity = !city || l.city === city;
        const matchType = tradeType === "All" || l.type === tradeType;
        const matchAvail = !availableOnly || l.isAvailable;
        return matchSearch && matchCat && matchCity && matchType && matchAvail;
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .th { background: #f5f0eb; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .th-hero {
          position: relative; height: 280px; overflow: hidden;
          display: flex; align-items: center;
        }
        .th-hero-bg {
          position: absolute; inset: 0;
          background: url('/construction banner.jpg') center center / cover no-repeat;
          filter: brightness(0.4);
        }
        .th-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(146,64,14,0.85) 0%, rgba(217,119,6,0.60) 100%);
        }
        .th-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .th-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .th-hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 6px; line-height: 1.15;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .th-hero-title span { color: #fcd34d; }
        .th-hero-sub {
          color: rgba(255,255,255,0.78); font-size: 14px;
          margin: 0 0 22px; font-weight: 400;
        }
        .th-search-wrap { position: relative; max-width: 520px; }
        .th-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .th-search {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.97); border: none; border-radius: 14px;
          font-size: 14px; color: #333; font-family: inherit; outline: none;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22); transition: box-shadow 0.2s;
        }
        .th-search:focus { box-shadow: 0 6px 34px rgba(0,0,0,0.3); }
        .th-hero-watermark {
          position: absolute; bottom: -18px; right: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.05); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        /* ── CATEGORY STRIP ── */
        .th-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea;
          padding: 18px 0;
        }
        .th-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
        }
        .th-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px; }
        .th-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .th-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s; text-decoration: none;
          min-width: 130px;
        }
        .th-cat-card:hover { border-color: #b45309; background: #fffbeb; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(180,83,9,0.12); }
        .th-cat-card.active { border-color: #b45309; background: #fef3c7; box-shadow: 0 4px 16px rgba(180,83,9,0.2); }
        .th-cat-icon { font-size: 22px; }
        .th-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .th-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY ── */
        .th-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .th-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        /* ── SIDEBAR ── */
        .th-sidebar {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #e8ecf0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .thf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f4f8;
        }
        .thf-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .thf-reset {
          font-size: 13px; font-weight: 700; color: #b45309;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .thf-reset:hover { opacity: 0.7; }
        .thf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f4f8; }
        .thf-section:last-of-type { border-bottom: none; }
        .thf-label { font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; }
        .thf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e4e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer; transition: border-color 0.2s;
        }
        .thf-select:focus { border-color: #b45309; }
        .thf-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .thf-chip {
          padding: 6px 13px; border-radius: 100px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e0e4f0; background: #fff; color: #555;
          cursor: pointer; transition: all 0.18s;
        }
        .thf-chip:hover { border-color: #b45309; color: #b45309; }
        .thf-chip.active { background: #b45309; color: #fff; border-color: #b45309; box-shadow: 0 2px 10px rgba(180,83,9,0.3); }
        .thf-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .thf-toggle-label { font-size: 13.5px; font-weight: 600; color: #333; }
        .thf-toggle { position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-block; }
        .thf-toggle input { opacity: 0; width: 0; height: 0; }
        .thf-toggle-track {
          position: absolute; inset: 0;
          background: #ddd; border-radius: 24px; transition: background 0.25s;
        }
        .thf-toggle input:checked + .thf-toggle-track { background: #b45309; }
        .thf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
        }
        .thf-toggle input:checked ~ .thf-toggle-thumb { transform: translateX(20px); }
        .thf-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 13px; text-align: center;
          background: linear-gradient(90deg, #b45309, #78350f);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(180,83,9,0.32);
          transition: opacity 0.18s, transform 0.18s;
        }
        .thf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RESULTS BAR ── */
        .th-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .th-results-count { font-size: 14px; color: #666; font-weight: 500; }
        .th-sort-select {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: border-color 0.2s;
        }
        .th-sort-select:focus { border-color: #b45309; }

        /* ── GRID ── */
        .th-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

        /* ── CARD ── */
        .th-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #ececec;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05); cursor: pointer;
        }
        .th-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(0,0,0,0.13); }
        .th-img-wrap {
          position: relative; width: 100%; aspect-ratio: 16/9;
          overflow: hidden; background: #fef3c7;
        }
        .th-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.32s ease; }
        .th-card:hover .th-img { transform: scale(1.06); }
        .th-heart {
          position: absolute; top: 9px; right: 9px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.94); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.16);
          transition: transform 0.18s, background 0.18s;
        }
        .th-heart:hover { transform: scale(1.18); background: #fff; }
        .th-badges {
          position: absolute; top: 9px; left: 9px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .th-badge-verified {
          display: inline-flex; align-items: center; gap: 3px;
          background: #fef3c7; color: #b45309; border: 1px solid #fcd34d;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .th-badge-featured {
          display: inline-flex; align-items: center; gap: 3px;
          background: #fff8e1; color: #b7950b; border: 1px solid #f9e79f;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .th-card-body { padding: 15px 16px 16px; display: flex; flex-direction: column; gap: 5px; }
        .th-card-name { font-size: 15px; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin: 0; }
        .th-card-cat { font-size: 13px; font-weight: 600; color: #b45309; margin: 0; }
        .th-card-rating { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
        .th-card-stars { color: #f5a623; font-size: 13px; }
        .th-card-rating-num { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .th-card-reviews { font-size: 12px; color: #aaa; }
        .th-card-location { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .th-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px; padding-top: 10px; border-top: 1px solid #f2f5f3;
        }
        .th-avail-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 700; color: #059669;
        }
        .th-avail-dot { width: 7px; height: 7px; border-radius: 50%; background: #059669; display: inline-block; animation: th-pulse 1.5s infinite; }
        .th-exp-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 700; color: #b45309;
        }
        @keyframes th-pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .th-card-view {
          font-size: 12px; font-weight: 700; color: #b45309;
          background: #fef3c7; border: none; border-radius: 8px;
          padding: 6px 14px; cursor: pointer; font-family: inherit;
          transition: background 0.18s; text-decoration: none;
        }
        .th-card-view:hover { background: #fde68a; }

        /* ── EMPTY ── */
        .th-empty { grid-column: 1/-1; padding: 64px 24px; text-align: center; color: #888; }
        .th-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .th-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .th-empty span { font-size: 13px; color: #aaa; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) { .th-layout { grid-template-columns: 1fr; } .th-sidebar { display: none; } }
        @media (max-width: 640px) { .th-hero { height: 220px; } .th-body { padding: 20px 16px 40px; } .th-grid { grid-template-columns: 1fr; gap: 12px; } .th-cats-row { gap: 8px; } .th-cat-card { min-width: 110px; padding: 8px 12px; } }
      `}</style>

            <div className="th">
                {/* ── HERO ── */}
                <section className="th-hero">
                    <div className="th-hero-bg" />
                    <div className="th-hero-overlay" />
                    <div className="th-hero-watermark">Trades</div>
                    <div className="th-hero-inner">
                        <div className="th-hero-tag">
                            <MdHandyman size={14} color="#fff" />
                            Nepal&apos;s Trusted Trade Directory
                        </div>
                        <h1 className="th-hero-title">
                            Find Skilled<br />
                            <span>Trades &amp; Home Repair</span> Experts
                        </h1>
                        <p className="th-hero-sub">Builders, Plumbers, Electricians, Painters &amp; more near you</p>
                        <div className="th-search-wrap">
                            <FiSearch className="th-search-icon" size={18} color="#bbb" />
                            <input
                                className="th-search"
                                placeholder="Search tradespeople, services, location…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* ── CATEGORY STRIP ── */}
                <section className="th-cats-strip">
                    <div className="th-cats-inner">
                        <p className="th-cats-label">Browse by Trade</p>
                        <div className="th-cats-row">
                            {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                                <button
                                    key={cat}
                                    className={`th-cat-card${activeCategory === cat ? " active" : ""}`}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{ border: "none" }}
                                >
                                    <span className="th-cat-icon">{icon}</span>
                                    <span>
                                        <span className="th-cat-name">{cat}</span>
                                        <span className="th-cat-count">{CATEGORY_COUNTS[cat].toLocaleString()} listings</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── MAIN BODY ── */}
                <div className="th-body">
                    <div className="th-layout">
                        {/* ── SIDEBAR ── */}
                        <aside className="th-sidebar">
                            <div className="thf-head">
                                <p className="thf-head-title">Filters</p>
                                <button className="thf-reset" onClick={reset}>Reset</button>
                            </div>

                            <div className="thf-section">
                                <p className="thf-label">Location / City</p>
                                <select className="thf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                                    <option value="">Select City</option>
                                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="thf-section">
                                <p className="thf-label">Trade Type</p>
                                <div className="thf-chips">
                                    {TRADE_TYPES.map((t) => (
                                        <button
                                            key={t}
                                            className={`thf-chip${tradeType === t ? " active" : ""}`}
                                            onClick={() => setTradeType(t)}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="thf-section">
                                <div className="thf-toggle-row">
                                    <span className="thf-toggle-label">Available Now</span>
                                    <label className="thf-toggle">
                                        <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
                                        <span className="thf-toggle-track" />
                                        <span className="thf-toggle-thumb" />
                                    </label>
                                </div>
                            </div>

                            <button className="thf-apply">Apply Filters</button>
                        </aside>

                        {/* ── RIGHT COLUMN ── */}
                        <div>
                            <div className="th-results-bar">
                                <span className="th-results-count">
                                    <strong>{displayed.length}</strong> results found
                                </span>
                                <select className="th-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="newest">Newest</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>

                            <div className="th-grid">
                                {displayed.length === 0 ? (
                                    <div className="th-empty">
                                        <div className="th-empty-icon">🛠️</div>
                                        <p>No results found</p>
                                        <span>Try adjusting your filters or search query</span>
                                    </div>
                                ) : (
                                    displayed.map((l) => {
                                        const isFav = !!favorites[l.id];
                                        return (
                                            <Link key={l.id} href={`/category/trade-and-homerepair/${l.id}`} className="th-card">
                                                <div className="th-img-wrap">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={l.image} alt={l.name} className="th-img" />
                                                    <div className="th-badges">
                                                        {l.isVerified && <span className="th-badge-verified">✓ Verified</span>}
                                                        {l.isFeatured && <span className="th-badge-featured">⭐ Featured</span>}
                                                    </div>
                                                    <button className="th-heart" aria-label="Save" onClick={(e) => toggleFav(l.id, e)}>
                                                        {isFav ? <FaHeart size={15} color="#E74C3C" /> : <FiHeart size={15} color="#999" />}
                                                    </button>
                                                </div>
                                                <div className="th-card-body">
                                                    <p className="th-card-name">{l.name}</p>
                                                    <p className="th-card-cat">{l.category}</p>
                                                    <div className="th-card-rating">
                                                        <FaStar size={12} color="#f5a623" />
                                                        <span className="th-card-rating-num">{l.rating}</span>
                                                        <span className="th-card-reviews">({l.reviews})</span>
                                                    </div>
                                                    <div className="th-card-location">
                                                        <FiMapPin size={11} color="#bbb" />
                                                        {l.location}
                                                    </div>
                                                    <div className="th-card-footer">
                                                        {l.isAvailable ? (
                                                            <span className="th-avail-tag">
                                                                <span className="th-avail-dot" />
                                                                Available Now
                                                            </span>
                                                        ) : l.experience ? (
                                                            <span className="th-exp-tag">🔧 {l.experience} exp.</span>
                                                        ) : (
                                                            <span style={{ fontSize: "11px", color: "#bbb" }}>Unavailable</span>
                                                        )}
                                                        <span className="th-card-view">View Details →</span>
                                                    </div>
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
