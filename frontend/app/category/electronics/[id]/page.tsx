"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
    FiShare2, FiHeart, FiMapPin, FiPhone, FiMail, FiEye,
    FiChevronRight, FiAlertTriangle, FiCheckCircle, FiClock,
} from "react-icons/fi";
import {
    FaHeart, FaStar, FaLaptop, FaMobileAlt, FaCamera,
    FaSdCard, FaBatteryFull, FaBoxOpen, FaShieldAlt,
    FaStore, FaUserCircle,
} from "react-icons/fa";
import { MdVerified, MdMemory, MdMonitor } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { HiOutlineChip } from "react-icons/hi";

/* STATIC DATA  */
const PRODUCT = {
    id: "apple-macbook-pro-m3-14",
    title: "Apple macBook Pro M3 14 inch",
    jobId: "#JOB784512",
    price: "Rs. 2,25,000",
    location: "Kathmandu, Nepal",
    isVerified: true,
    rating: 4.5,
    reviews: 126,
    images: [
        "/laptop.jpg",
        "/iphone.jpg",
        "/smartwatch.jpg",
        "/camera.jpg",
        "/iphone-13.avif",
        "/iphone.jpg",
    ],
    description: `This Apple MacBook Pro M3 is in excellent condition and comes with original charger and box. It delivers exceptional performance for programming, video editing, graphic design, and professional work.`,
    specs: {
        category: "Laptop",
        brand: "Apple",
        model: "MacBook Pro M#",
        processor: "Apple M3 Chip",
        ram: "16GB Unified Memory",
        storage: "512GB SSD",
        display: "14inch Retina",
        graphics: "Integrated GPU",
        condition: "Like New",
        warranty: "8month Remaing",
        purchaseYear: "2025",
        listed: "May 12,2026",
    },
    attributes: [
        { icon: <MdMonitor size={22} />, label: '14"', sub: "Retina Display" },
        { icon: <HiOutlineChip size={22} />, label: "Apple M3", sub: "chip" },
        { icon: <MdMemory size={22} />, label: "16GB", sub: "Unified Ram" },
        { icon: <FaSdCard size={22} />, label: "512GB", sub: "SSD Storage" },
        { icon: <FaBatteryFull size={22} />, label: "18Hours", sub: "Battery Life" },
        { icon: <FaBoxOpen size={22} />, label: "Original", sub: "Charger" },
    ],
    seller: {
        name: "Tech World Nepal",
        memberSince: 2020,
        listings: 245,
        responseRate: "98%",
        responseTime: "5min",
        rating: 4.5,
        reviews: 126,
    },
    mapImage: "/map.png",
    mapLabel: "Balkumari lalitpur",
    mapSub: "2.5km from FunPark",
    mapAddress: "Lazimpat,Kathmandu, Nepal",
};

const SIMILAR = [
    { id: "iphone-13-pro-kathmandu", title: "iPhone 13 Pro", price: "Rs. 1,85,000", image: "/iphone.jpg", rating: 4.8 },
    { id: "macbook-pro-m2-ktm", title: "MacBook Pro M2", price: "Rs. 2,10,000", image: "/laptop.jpg", rating: 4.9 },
    { id: "samsung-galaxy-watch-5", title: "Samsung Watch 5", price: "Rs. 45,000", image: "/smartwatch.jpg", rating: 4.7 },
    { id: "canon-eos-r50-camera", title: "Canon EOS R50", price: "Rs. 1,15,000", image: "/camera.jpg", rating: 4.8 },
    { id: "iphone-13-pokhara", title: "iPhone 13 128GB", price: "Rs.1,65,000", image: "/iphone-13.avif", rating: 4.7 },
];

/* STAR RENDERER */
function Stars({ rating }: { rating: number }) {
    return (
        <span style={{ display: "inline-flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <FaStar
                    key={s}
                    size={14}
                    color={s <= Math.round(rating) ? "#f5a623" : "#ddd"}
                />
            ))}
        </span>
    );
}

/*  PAGE */
export default function ElectronicsDetailPage() {
    const [activeImg, setActiveImg] = useState(0);
    const [isFav, setIsFav] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const p = PRODUCT;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f2f4f7; }

        /* ── BREADCRUMB ── */
        .ed-breadcrumb {
          background: #fff; border-bottom: 1px solid #eaeaea;
          padding: 10px 0;
        }
        .ed-breadcrumb-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; gap: 6px;
          flex-wrap: wrap; font-size: 13px;
        }
        .ed-bc-link { color: #6366f1; text-decoration: none; font-weight: 500; }
        .ed-bc-link:hover { text-decoration: underline; }
        .ed-bc-sep { color: #bbb; }
        .ed-bc-cur { color: #555; font-weight: 500; }
        .ed-bc-job { margin-left: auto; font-size: 12.5px; color: #888; }
        .ed-bc-report { font-size: 12.5px; color: #e53e3e; font-weight: 600; cursor: pointer; }
        .ed-bc-report:hover { text-decoration: underline; }

        /* ── BODY ── */
        .ed-body {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 24px 60px;
          display: grid; grid-template-columns: 1fr 340px;
          gap: 20px; align-items: start;
        }

        /* ── LEFT PANEL ── */
        .ed-left { display: flex; flex-direction: column; gap: 18px; }

        /* gallery */
        .ed-gallery {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8ecf4;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .ed-main-img-wrap {
          width: 100%; aspect-ratio: 16/9; overflow: hidden;
          background: #f5f5f8; position: relative;
        }
        .ed-main-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.35s ease;
        }
        .ed-main-img:hover { transform: scale(1.04); }

        .ed-thumbs {
          display: flex; gap: 8px; padding: 12px 14px;
          overflow-x: auto; border-top: 1px solid #f2f2f5;
        }
        .ed-thumb {
          width: 70px; height: 52px; border-radius: 8px;
          overflow: hidden; cursor: pointer; flex-shrink: 0;
          border: 2px solid transparent; transition: border-color 0.18s;
          background: #eee;
        }
        .ed-thumb.active { border-color: #6366f1; }
        .ed-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .ed-thumb-more {
          width: 70px; height: 52px; border-radius: 8px;
          background: rgba(0,0,0,0.55); display: flex;
          align-items: center; justify-content: center;
          color: #fff; font-size: 14px; font-weight: 700;
          cursor: pointer; flex-shrink: 0;
        }

        /* title row */
        .ed-title-row {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8ecf4;
          padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .ed-location-row {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: #888; margin-bottom: 10px;
        }
        .ed-view-map { font-size: 12px; color: #6366f1; text-decoration: none; font-weight: 600; margin-left: 4px; }
        .ed-view-map:hover { text-decoration: underline; }
        .ed-verified-badge {
          display: inline-flex; align-items: center; gap: 4px;
          background: #eafaf3; color: #0d9f6e; border: 1px solid #a8dfcf;
          font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
          margin-bottom: 10px;
        }
        .ed-title { font-size: 22px; font-weight: 800; color: #1a1a1a; margin: 0 0 8px; }
        .ed-actions {
          display: flex; align-items: center; gap: 10px;
          margin-top: 6px;
        }
        .ed-share-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px;
          border: 1.5px solid #e0e4f0; background: #fff;
          font-size: 13px; font-weight: 600; color: #555;
          cursor: pointer; font-family: inherit; transition: all 0.18s;
        }
        .ed-share-btn:hover { border-color: #6366f1; color: #6366f1; }
        .ed-fav-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px;
          border: 1.5px solid #e0e4f0; background: #fff;
          font-size: 13px; font-weight: 600; color: #555;
          cursor: pointer; font-family: inherit; transition: all 0.18s;
        }
        .ed-fav-btn:hover { border-color: #e53e3e; color: #e53e3e; }
        .ed-fav-btn.active { border-color: #e53e3e; background: #fff5f5; color: #e53e3e; }
        .ed-price { font-size: 26px; font-weight: 900; color: #1a1a1a; margin: 12px 0; }
        .ed-buy-btn {
          width: 100%; padding: 14px; border-radius: 12px;
          background: linear-gradient(90deg,#6366f1,#4f46e5);
          color: #fff; font-size: 15px; font-weight: 800;
          border: none; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(99,102,241,0.36);
          transition: opacity 0.18s, transform 0.18s;
          margin-bottom: 16px;
        }
        .ed-buy-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* attributes */
        .ed-attrs {
          display: grid; grid-template-columns: repeat(6,1fr);
          gap: 8px; padding-top: 4px;
        }
        .ed-attr-item {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; padding: 10px 6px; border-radius: 10px;
          background: #f8f9ff; border: 1px solid #e8ecf8; text-align: center;
        }
        .ed-attr-icon { color: #6366f1; display: flex; }
        .ed-attr-label { font-size: 11.5px; font-weight: 700; color: #1a1a1a; line-height: 1.2; }
        .ed-attr-sub { font-size: 10px; color: #888; }

        /* description + details */
        .ed-desc-details {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8ecf4;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .ed-dd-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          divide: split;
        }
        .ed-desc-col {
          padding: 20px; border-right: 1px solid #f2f4f8;
        }
        .ed-details-col {
          padding: 20px;
        }
        .ed-section-title {
          font-size: 15px; font-weight: 800; color: #1a1a1a;
          margin: 0 0 14px; padding-bottom: 8px;
          border-bottom: 2px solid #f0f0f5;
          display: flex; align-items: center; gap: 7px;
        }
        .ed-desc-text { font-size: 13.5px; color: #555; line-height: 1.7; margin: 0; }
        .ed-see-more {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 13px; font-weight: 700; color: #6366f1;
          background: none; border: none; cursor: pointer;
          padding: 0; margin-top: 8px; font-family: inherit;
        }
        .ed-see-more:hover { text-decoration: underline; }

        /* specs table */
        .ed-spec-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 6px 0; font-size: 12.5px;
          border-bottom: 1px solid #f5f5f8;
        }
        .ed-spec-row:last-child { border-bottom: none; }
        .ed-spec-key { color: #888; font-weight: 500; min-width: 90px; }
        .ed-spec-val { color: #1a1a1a; font-weight: 600; text-align: right; }

        /* ── RIGHT PANEL ── */
        .ed-right { display: flex; flex-direction: column; gap: 16px; }

        /* seller card */
        .ed-seller-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8ecf4;
          padding: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .ed-seller-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 14px; }
        .ed-seller-profile {
          display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
        }
        .ed-seller-avatar {
          width: 46px; height: 46px; border-radius: 50%;
          background: linear-gradient(135deg,#6366f1,#a855f7);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ed-seller-name { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .ed-seller-rating { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
        .ed-seller-num { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .ed-seller-reviews { font-size: 12px; color: #888; }

        .ed-seller-meta { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
        .ed-seller-meta-row {
          display: flex; justify-content: space-between;
          font-size: 12.5px; padding: 4px 0;
          border-bottom: 1px solid #f5f5f8;
        }
        .ed-seller-meta-row:last-child { border-bottom: none; }
        .ed-seller-meta-key { color: #888; }
        .ed-seller-meta-val { color: #1a1a1a; font-weight: 600; }

        .ed-call-btn {
          width: 100%; padding: 11px; border-radius: 10px;
          background: linear-gradient(90deg,#22c55e,#16a34a);
          color: #fff; font-size: 13.5px; font-weight: 700;
          border: none; cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          margin-bottom: 8px; box-shadow: 0 3px 14px rgba(34,197,94,0.32);
          transition: opacity 0.18s;
        }
        .ed-call-btn:hover { opacity: 0.9; }
        .ed-email-btn {
          width: 100%; padding: 11px; border-radius: 10px;
          background: #fff; color: #555; font-size: 13.5px; font-weight: 700;
          border: 1.5px solid #e0e4f0; cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          margin-bottom: 8px; transition: all 0.18s;
        }
        .ed-email-btn:hover { border-color: #6366f1; color: #6366f1; }
        .ed-visit-btn {
          width: 100%; padding: 11px; border-radius: 10px;
          background: #fff; color: #555; font-size: 13.5px; font-weight: 700;
          border: 1.5px solid #e0e4f0; cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: all 0.18s;
        }
        .ed-visit-btn:hover { border-color: #6366f1; color: #6366f1; }

        /* location card */
        .ed-location-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8ecf4;
          padding: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .ed-loc-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; }
        .ed-map-img {
          width: 100%; height: 130px; border-radius: 12px;
          object-fit: cover; display: block; margin-bottom: 10px;
        }
        .ed-loc-name { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 3px; }
        .ed-loc-sub { font-size: 12px; color: #888; margin: 0 0 2px; }
        .ed-loc-address { font-size: 12px; color: #888; margin: 0 0 10px; }
        .ed-view-map-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 700; color: #e53e3e;
          background: none; border: none; cursor: pointer;
          padding: 0; font-family: inherit;
        }
        .ed-view-map-btn:hover { text-decoration: underline; }

        /* similar */
        .ed-similar {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8ecf4;
          padding: 20px 20px 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          margin-top: 4px;
        }
        .ed-similar-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .ed-similar-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .ed-view-all { font-size: 13px; font-weight: 700; color: #6366f1; text-decoration: none; }
        .ed-view-all:hover { text-decoration: underline; }
        .ed-similar-grid {
          display: grid; grid-template-columns: repeat(5,1fr); gap: 12px;
        }
        .ed-sim-card {
          border-radius: 12px; overflow: hidden;
          border: 1.5px solid #e8ecf4; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .ed-sim-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }
        .ed-sim-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
        .ed-sim-body { padding: 8px 10px 10px; }
        .ed-sim-title { font-size: 12px; font-weight: 700; color: #1a1a1a; margin: 0 0 3px; line-height: 1.3; }
        .ed-sim-price { font-size: 12.5px; font-weight: 800; color: #6366f1; margin: 0 0 4px; }
        .ed-sim-rating { display: flex; align-items: center; gap: 3px; }

        /* responsive */
        @media (max-width: 1024px) {
          .ed-body { grid-template-columns: 1fr; }
          .ed-right { order: -1; }
          .ed-similar-grid { grid-template-columns: repeat(3,1fr); }
          .ed-attrs { grid-template-columns: repeat(3,1fr); }
        }
        @media (max-width: 640px) {
          .ed-body { padding: 14px 14px 40px; gap: 14px; }
          .ed-dd-grid { grid-template-columns: 1fr; }
          .ed-desc-col { border-right: none; border-bottom: 1px solid #f2f4f8; }
          .ed-similar-grid { grid-template-columns: repeat(2,1fr); }
          .ed-attrs { grid-template-columns: repeat(3,1fr); }
          .ed-title { font-size: 18px; }
        }
      `}</style>

            {/* ── BREADCRUMB ── */}
            <nav className="ed-breadcrumb">
                <div className="ed-breadcrumb-inner">
                    <Link href="/" className="ed-bc-link">Home</Link>
                    <FiChevronRight size={13} className="ed-bc-sep" />
                    <Link href="/category/electronics" className="ed-bc-link">Electronics</Link>
                    <FiChevronRight size={13} className="ed-bc-sep" />
                    <Link href="/category/electronics?cat=Laptops" className="ed-bc-link">Laptops</Link>
                    <FiChevronRight size={13} className="ed-bc-sep" />
                    <span className="ed-bc-cur">{p.title}</span>
                    <span className="ed-bc-job">Job ID: {p.jobId}</span>
                    <button className="ed-bc-report">
                        <FiAlertTriangle size={12} style={{ marginRight: 3 }} />
                        Report This Job
                    </button>
                </div>
            </nav>

            {/* ── MAIN BODY ── */}
            <div className="ed-body">

                {/* LEFT  */}
                <div className="ed-left">

                    {/* Gallery */}
                    <div className="ed-gallery">
                        <div className="ed-main-img-wrap">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={p.images[activeImg]}
                                alt={p.title}
                                className="ed-main-img"
                            />
                        </div>
                        <div className="ed-thumbs">
                            {p.images.slice(0, 5).map((img, i) => (
                                <div
                                    key={i}
                                    className={`ed-thumb${activeImg === i ? " active" : ""}`}
                                    onClick={() => setActiveImg(i)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`thumb-${i}`} />
                                </div>
                            ))}
                            {p.images.length > 5 && (
                                <div className="ed-thumb-more">+{p.images.length - 5}</div>
                            )}
                        </div>
                    </div>

                    {/* Title / Price / Actions */}
                    <div className="ed-title-row">
                        {/* Location */}
                        <div className="ed-location-row">
                            <FiMapPin size={12} color="#bbb" />
                            {p.location}
                            <Link href="#map" className="ed-view-map">View on Map</Link>
                        </div>

                        {/* Verified */}
                        {p.isVerified && (
                            <span className="ed-verified-badge">
                                <MdVerified size={11} /> Verified Product
                            </span>
                        )}

                        {/* Title */}
                        <h1 className="ed-title">{p.title}</h1>

                        {/* Actions */}
                        <div className="ed-actions">
                            <button className="ed-share-btn">
                                <FiShare2 size={14} /> Share
                            </button>
                            <button
                                className={`ed-fav-btn${isFav ? " active" : ""}`}
                                onClick={() => setIsFav(!isFav)}
                            >
                                {isFav
                                    ? <FaHeart size={14} color="#e53e3e" />
                                    : <FiHeart size={14} />}
                                {isFav ? "Saved" : "Save"}
                            </button>
                        </div>

                        {/* Price */}
                        <div className="ed-price">{p.price}</div>

                        {/* Buy Button */}
                        <button className="ed-buy-btn">Buy Now</button>

                        {/* Attribute chips */}
                        <div className="ed-attrs">
                            {p.attributes.map((a, i) => (
                                <div key={i} className="ed-attr-item">
                                    <span className="ed-attr-icon">{a.icon}</span>
                                    <span className="ed-attr-label">{a.label}</span>
                                    <span className="ed-attr-sub">{a.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description + Spec Details */}
                    <div className="ed-desc-details">
                        <div className="ed-dd-grid">
                            {/* Description */}
                            <div className="ed-desc-col">
                                <h2 className="ed-section-title">
                                    <FaBoxOpen size={15} color="#6366f1" />
                                    Product Description
                                </h2>
                                <p className="ed-desc-text">
                                    {showMore ? p.description : p.description.slice(0, 160) + "..."}
                                </p>
                                <button className="ed-see-more" onClick={() => setShowMore(!showMore)}>
                                    {showMore ? "See Less ↑" : "See More ↓"}
                                </button>
                            </div>

                            {/* Specs (left column) */}
                            <div className="ed-details-col">
                                <h2 className="ed-section-title">
                                    <BsGraphUp size={14} color="#6366f1" />
                                    Details
                                </h2>
                                {[
                                    ["Category", p.specs.category],
                                    ["Brand", p.specs.brand],
                                    ["Model", p.specs.model],
                                    ["Processor", p.specs.processor],
                                    ["Ram", p.specs.ram],
                                    ["Processor", p.specs.storage],
                                ].map(([k, v]) => (
                                    <div key={k + v} className="ed-spec-row">
                                        <span className="ed-spec-key">{k}</span>
                                        <span className="ed-spec-val">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Second specs row – full width */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #f2f4f8" }}>
                            <div style={{ padding: "16px 20px", borderRight: "1px solid #f2f4f8" }}>
                                {[
                                    ["Display", p.specs.display],
                                    ["Graphics", p.specs.graphics],
                                    ["Condition", p.specs.condition],
                                ].map(([k, v]) => (
                                    <div key={k} className="ed-spec-row">
                                        <span className="ed-spec-key">{k}</span>
                                        <span className="ed-spec-val">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: "16px 20px" }}>
                                {[
                                    ["Warranty", p.specs.warranty],
                                    ["Purchase Year", p.specs.purchaseYear],
                                    ["Listed", p.specs.listed],
                                ].map(([k, v]) => (
                                    <div key={k} className="ed-spec-row">
                                        <span className="ed-spec-key">{k}</span>
                                        <span className="ed-spec-val">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Similar Devices */}
                    <div className="ed-similar">
                        <div className="ed-similar-head">
                            <h2 className="ed-similar-title">Similar Devices</h2>
                            <Link href="/category/electronics" className="ed-view-all">View All</Link>
                        </div>
                        <div className="ed-similar-grid">
                            {SIMILAR.map((s) => (
                                <Link key={s.id} href={`/category/electronics/${s.id}`} className="ed-sim-card">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={s.image} alt={s.title} className="ed-sim-img" />
                                    <div className="ed-sim-body">
                                        <p className="ed-sim-title">{s.title}</p>
                                        <p className="ed-sim-price">{s.price}</p>
                                        <div className="ed-sim-rating">
                                            <Stars rating={s.rating} />
                                            <span style={{ fontSize: 11, color: "#888" }}>{s.rating}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT ═══ */}
                <div className="ed-right">

                    {/* Seller Card */}
                    <div className="ed-seller-card">
                        <h3 className="ed-seller-title">Seller Imformation</h3>

                        <div className="ed-seller-profile">
                            <div className="ed-seller-avatar">
                                <FaStore size={20} color="#fff" />
                            </div>
                            <div>
                                <div className="ed-seller-name">{p.seller.name}</div>
                                <div className="ed-seller-rating">
                                    <span className="ed-seller-num">{p.seller.rating}</span>
                                    <Stars rating={p.seller.rating} />
                                    <span className="ed-seller-reviews">({p.seller.reviews} Reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="ed-seller-meta">
                            <div className="ed-seller-meta-row">
                                <span className="ed-seller-meta-key">Member Since</span>
                                <span className="ed-seller-meta-val">{p.seller.memberSince}</span>
                            </div>
                            <div className="ed-seller-meta-row">
                                <span className="ed-seller-meta-key">listing</span>
                                <span className="ed-seller-meta-val">{p.seller.listings}</span>
                            </div>
                            <div className="ed-seller-meta-row">
                                <span className="ed-seller-meta-key">Response Rate</span>
                                <span className="ed-seller-meta-val">{p.seller.responseRate}</span>
                            </div>
                            <div className="ed-seller-meta-row">
                                <span className="ed-seller-meta-key">Response Time</span>
                                <span className="ed-seller-meta-val">{p.seller.responseTime}</span>
                            </div>
                        </div>

                        <button className="ed-call-btn">
                            <FiPhone size={15} /> Call Institute
                        </button>
                        <button className="ed-email-btn">
                            <FiMail size={15} /> Send Email
                        </button>
                        <button className="ed-visit-btn">
                            <FiEye size={15} /> Visit Store
                        </button>
                    </div>

                    {/* Location Card */}
                    <div className="ed-location-card" id="map">
                        <h3 className="ed-loc-title">Location</h3>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.mapImage} alt="Map" className="ed-map-img" />
                        <p className="ed-loc-name">{p.mapLabel}</p>
                        <p className="ed-loc-sub">{p.mapSub}</p>
                        <p className="ed-loc-address">
                            <FiMapPin size={11} style={{ marginRight: 3 }} />
                            {p.mapAddress}
                        </p>
                        <button className="ed-view-map-btn">
                            <FiMapPin size={12} color="#e53e3e" /> View on Map
                        </button>

                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}
