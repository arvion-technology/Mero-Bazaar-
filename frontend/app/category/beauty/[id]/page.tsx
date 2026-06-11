"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import {
  FiMapPin, FiMessageSquare, FiArrowLeft,
  FiPhone, FiShare2, FiHeart, FiCheckCircle,
  FiCalendar, FiUser, FiStar, FiClock, FiTruck,
  FiScissors, FiHome, FiDollarSign,
} from "react-icons/fi";
import { FaHeart, FaLeaf, FaShieldAlt, FaSpa } from "react-icons/fa";

type Gender = "Any" | "Female Only" | "Male Only";

type BeautyService = {
  id: string;
  name: string;
  category: string;
  subServices: string[];
  price: string;
  priceRange: string;
  distance: string;
  location: string;
  district: string;
  images: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isHomeVisit: boolean;
  isBridalService: boolean;
  postedDaysAgo: number;
  description?: string;
  providerName?: string;
  providerPhone?: string;
  serviceTime?: string;
  minBooking?: string;
  openingHours?: string;
  gender?: Gender;
  experience?: string;
};

const SERVICES: BeautyService[] = [
  {
    id: "nail-extension",
    name: "Nail Extension",
    category: "Nails",
    subServices: ["Acrylic", "Gel", "Nail Art"],
    price: "NPR 2,000",
    priceRange: "Starting From",
    distance: "2km",
    location: "Balkumari",
    district: "Lalitpur",
    images: ["/beauty-nails.jpg", "/beauty-nails2.jpg"],
    rating: 4.8,
    reviewCount: 128,
    tags: ["Nails", "Acrylic", "Gel"],
    isHomeVisit: true,
    isBridalService: false,
    postedDaysAgo: 1,
    description: "Professional nail extension services with premium quality products. We offer acrylic, gel, and custom nail art designs. Our technicians are certified and use hygienic, sterilized tools for every client. Perfect for weddings, parties, and everyday glam.",
    providerName: "Priya Sharma",
    providerPhone: "9812345678",
    serviceTime: "1-2 hours",
    minBooking: "NPR 1,500",
    openingHours: "10:00 AM - 7:00 PM",
    gender: "Female Only",
    experience: "5+ years",
  },
  {
    id: "hair-highlights",
    name: "Hair Highlights",
    category: "Hair",
    subServices: ["Global Highlights", "Hair Cut", "Styling"],
    price: "NPR 3,500",
    priceRange: "Starting From",
    distance: "3km",
    location: "Thapathali",
    district: "Kathmandu",
    images: ["/beauty-hair.jpg"],
    rating: 4.9,
    reviewCount: 198,
    tags: ["Hair", "Coloring", "Styling"],
    isHomeVisit: false,
    isBridalService: false,
    postedDaysAgo: 2,
    description: "Premium hair coloring and styling services using international brands like L'Oréal and Wella. Our stylists specialize in balayage, ombre, and global highlights. Includes complimentary hair spa treatment with every color service.",
    providerName: "Anish Thapa",
    providerPhone: "9834567890",
    serviceTime: "2-3 hours",
    minBooking: "NPR 2,000",
    openingHours: "9:00 AM - 8:00 PM",
    gender: "Any",
    experience: "8+ years",
  },
  {
    id: "bridal-makeup",
    name: "Bridal Makeup",
    category: "Makeup",
    subServices: ["HD Makeup", "Hair Style", "Draping"],
    price: "NPR 8,500",
    priceRange: "Starting From",
    distance: "4km",
    location: "New road",
    district: "Kathmandu",
    images: ["/beauty-bridal.jpg", "/beauty-bridal2.jpg"],
    rating: 4.8,
    reviewCount: 102,
    tags: ["Makeup", "Bridal", "HD"],
    isHomeVisit: true,
    isBridalService: true,
    postedDaysAgo: 0,
    description: "Complete bridal makeup package including HD/ airbrush makeup, hairstyling, saree draping, and jewelry setting. We use premium products like MAC, Huda Beauty, and Kryolan. Trial session included. Available for home visits across Kathmandu valley.",
    providerName: "Maya Devi",
    providerPhone: "9845678901",
    serviceTime: "3-4 hours",
    minBooking: "NPR 5,000",
    openingHours: "By Appointment",
    gender: "Female Only",
    experience: "10+ years",
  },
  {
    id: "facial-treatment",
    name: "Facial Treatment",
    category: "Skin",
    subServices: ["Glow Facial", "Deep Cleansing Facial"],
    price: "NPR 2,200",
    priceRange: "Starting From",
    distance: "1km",
    location: "Ratnapark",
    district: "Kathmandu",
    images: ["/beauty-facial.jpg"],
    rating: 4.7,
    reviewCount: 127,
    tags: ["Skin", "Facial", "Glow"],
    isHomeVisit: false,
    isBridalService: false,
    postedDaysAgo: 1,
    description: "Rejuvenating facial treatments using organic and dermatologist-approved products. Services include deep cleansing, anti-aging, acne treatment, and bridal glow facials. We analyze your skin type before recommending the perfect treatment.",
    providerName: "Dr. Sunita KC",
    providerPhone: "9856789012",
    serviceTime: "45-60 min",
    minBooking: "NPR 1,500",
    openingHours: "10:00 AM - 6:00 PM",
    gender: "Any",
    experience: "7+ years",
  },
  {
    id: "mehandi-design",
    name: "Mehandi Design",
    category: "Nails",
    subServices: ["Bridal Mehandi", "Arabic Design"],
    price: "NPR 1,500",
    priceRange: "Starting From",
    distance: "3km",
    location: "Balkhu",
    district: "Kathmandu",
    images: ["/beauty-mehandi.jpg"],
    rating: 4.9,
    reviewCount: 128,
    tags: ["Mehandi", "Bridal", "Arabic"],
    isHomeVisit: true,
    isBridalService: true,
    postedDaysAgo: 3,
    description: "Exquisite mehandi designs for all occasions. Specializing in bridal mehandi with intricate patterns, Arabic style, and contemporary fusion designs. Uses 100% natural henna with essential oils for deep, long-lasting color.",
    providerName: "Hari Prasad",
    providerPhone: "9823456789",
    serviceTime: "1-3 hours",
    minBooking: "NPR 1,000",
    openingHours: "9:00 AM - 8:00 PM",
    gender: "Female Only",
    experience: "12+ years",
  },
  {
    id: "waxing-service",
    name: "Waxing Service",
    category: "Skin",
    subServices: ["Full Body Wax", "Arm & Leg Wax"],
    price: "NPR 1,500",
    priceRange: "Starting From",
    distance: "2km",
    location: "Lazimpat",
    district: "Kathmandu",
    images: ["/beauty-waxing.jpg", "/beauty-waxing2.jpg"],
    rating: 4.5,
    reviewCount: 102,
    tags: ["Waxing", "Full Body", "Hygiene"],
    isHomeVisit: true,
    isBridalService: false,
    postedDaysAgo: 2,
    description: "Professional waxing services with premium Rica and Hive wax products. We maintain strict hygiene standards with disposable strips and spatulas. Services include full body, arms, legs, underarms, and Brazilian waxing. Home visits available.",
    providerName: "Ramesh KC",
    providerPhone: "9801234567",
    serviceTime: "30-90 min",
    minBooking: "NPR 800",
    openingHours: "9:00 AM - 7:00 PM",
    gender: "Female Only",
    experience: "6+ years",
  },
];

const RELATED_LIMIT = 3;

export default function BeautyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const item = SERVICES.find((l) => l.id === id);

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "Makeup": return { background: "#db2777", color: "#fff" };
      case "Hair": return { background: "#7c3aed", color: "#fff" };
      case "Nails": return { background: "#ea580c", color: "#fff" };
      case "Skin": return { background: "#059669", color: "#fff" };
      default: return { background: "#6b7280", color: "#fff" };
    }
  };

  const renderStars = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            fill={i < fullStars ? "#f59e0b" : i === fullStars && hasHalf ? "#f59e0b" : "none"}
            color={i < fullStars || (i === fullStars && hasHalf) ? "#f59e0b" : "#d1d5db"}
          />
        ))}
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111", marginLeft: 6 }}>{rating}</span>
        <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 3 }}>({reviewCount} Reviews)</span>
      </div>
    );
  };

  if (!item) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          .bd-404 {
            min-height: 80vh; display: flex; align-items: center; justify-content: center;
            font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column;
            text-align: center; padding: 40px 20px;
          }
          .bd-404 h1 { font-size: 22px; font-weight: 800; color: #111; margin: 12px 0 6px; }
          .bd-404 p { font-size: 14px; color: #888; margin: 0 0 18px; }
          .bd-back-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: #e11d48; color: #fff; font-weight: 700; font-size: 13px;
            padding: 10px 22px; border-radius: 8px; text-decoration: none;
          }
        `}</style>
        <div className="bd-404">
          <div style={{ fontSize: 56 }}>💅</div>
          <h1>Service Not Found</h1>
          <p>The beauty service you are looking for does not exist.</p>
          <Link href="/category/beauty" className="bd-back-btn">
            <FiArrowLeft size={14} /> Back to Services
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const related = SERVICES.filter((s) => s.id !== item.id && s.category === item.category).slice(0, RELATED_LIMIT);
  const badgeStyle = getCategoryBadgeStyle(item.category);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .bd-wrap {
          min-height: 100vh; background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── BREADCRUMB ── */
        .bd-breadcrumb-bar {
          background: #fff; border-bottom: 1px solid #e5e7eb;
        }
        .bd-breadcrumb-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 12px 24px;
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9ca3af;
        }
        .bd-breadcrumb-inner a {
          color: #9ca3af; text-decoration: none; transition: color 0.15s;
        }
        .bd-breadcrumb-inner a:hover { color: #e11d48; }
        .bd-breadcrumb-inner span.active { color: #374151; font-weight: 600; }

        /* ── MAIN BODY ── */
        .bd-body {
          max-width: 1200px; margin: 0 auto;
          padding: 24px 20px 60px;
        }

        /* ── BACK LINK ── */
        .bd-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 18px;
          transition: color 0.15s;
        }
        .bd-back:hover { color: #e11d48; }

        /* ── GRID ── */
        .bd-grid {
          display: grid; grid-template-columns: 1fr 400px; gap: 24px;
          align-items: start;
        }

        /* ── LEFT: IMAGE + THUMBNAILS ── */
        .bd-img-section {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .bd-main-img-wrap {
          position: relative; aspect-ratio: 4/3; overflow: hidden;
          background: #e5e7eb;
        }
        .bd-main-img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .bd-img-cat-badge {
          position: absolute; top: 12px; right: 12px;
          font-size: 10px; font-weight: 800;
          padding: 4px 10px; border-radius: 5px;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .bd-img-fav-btn {
          position: absolute; top: 12px; left: 12px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0;
        }
        .bd-img-fav-btn:hover { transform: scale(1.12); }

        .bd-posted-tag {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(0,0,0,0.58); color: #fff;
          font-size: 10.5px; font-weight: 600; border-radius: 6px;
          padding: 3px 9px; backdrop-filter: blur(4px);
        }
        .bd-home-tag {
          position: absolute; bottom: 12px; right: 12px;
          background: rgba(225,29,72,0.88); color: #fff;
          font-size: 10.5px; font-weight: 700; border-radius: 6px;
          padding: 3px 9px; display: flex; align-items: center; gap: 4px;
        }

        /* Thumbnail strip */
        .bd-thumb-strip {
          display: flex; gap: 8px; padding: 12px;
          overflow-x: auto;
        }
        .bd-thumb {
          width: 72px; height: 72px; border-radius: 8px;
          object-fit: cover; cursor: pointer; border: 2px solid transparent;
          transition: border-color 0.15s, opacity 0.15s;
          flex-shrink: 0;
        }
        .bd-thumb:hover { opacity: 0.8; }
        .bd-thumb.active { border-color: #e11d48; }

        /* ── RIGHT: DETAILS PANEL ── */
        .bd-right { display: flex; flex-direction: column; gap: 16px; }

        .bd-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .bd-name { font-size: 22px; font-weight: 900; color: #111; margin: 0 0 6px; }
        .bd-category {
          font-size: 13px; color: #6b7280; margin: 0 0 10px;
        }
        .bd-price-label {
          font-size: 11px; font-weight: 600; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px;
          margin: 0 0 2px;
        }
        .bd-price { font-size: 26px; font-weight: 900; color: #e11d48; margin: 0 0 12px; }
        .bd-price-divider {
          width: 40px; height: 3px; background: #f43f5e;
          border-radius: 2px; margin-bottom: 14px;
        }

        .bd-location {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: #6b7280; margin-bottom: 14px;
        }

        .bd-desc {
          font-size: 13.5px; color: #4b5563; line-height: 1.7;
          margin-bottom: 16px;
        }

        /* Sub-services pills */
        .bd-subs-row {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-bottom: 14px;
        }
        .bd-sub-pill {
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 5px;
          background: #fdf2f8; color: #be185d;
          border: 1px solid #fbcfe8;
        }

        /* Details grid */
        .bd-details-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 14px;
        }
        .bd-detail-item {
          background: #f9fafb; border-radius: 8px;
          padding: 10px 12px;
          border: 1px solid #f0f0f0;
        }
        .bd-detail-label {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;
        }
        .bd-detail-val { font-size: 13px; font-weight: 700; color: #111; }

        /* Badges row */
        .bd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .bd-badge-home {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fce7f3; color: #be185d; border: 1px solid #fbcfe8;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .bd-badge-bridal {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fef3c7; color: #92400e; border: 1px solid #fde68a;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .bd-badge-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }

        /* Availability */
        .bd-avail {
          display: flex; align-items: center; gap: 8px;
          background: #fce7f3; border: 1px solid #fbcfe8; border-radius: 8px;
          padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #be185d;
          margin-bottom: 14px;
        }
        .bd-avail-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #e11d48;
          flex-shrink: 0; animation: bdpulse 1.4s infinite;
        }
        @keyframes bdpulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Action Buttons */
        .bd-actions { display: flex; gap: 10px; }
        .bd-btn-book {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 13px;
          background: #e11d48; color: #fff;
          font-size: 14px; font-weight: 800; border: none;
          border-radius: 9px; cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.15s;
          text-decoration: none;
        }
        .bd-btn-book:hover { background: #be123c; transform: translateY(-1px); }
        .bd-btn-phone {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .bd-btn-phone:hover { background: #fce7f3; border-color: #fbcfe8; color: #be185d; }
        .bd-btn-share {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .bd-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }

        /* Provider Panel */
        .bd-provider-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 18px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .bd-provider-title {
          font-size: 12px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .bd-provider-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .bd-provider-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #f43f5e, #e11d48);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; font-weight: 800; flex-shrink: 0;
        }
        .bd-provider-name { font-size: 14px; font-weight: 800; color: #111; }
        .bd-provider-phone { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .bd-provider-chat-btn {
          display: flex; align-items: center; gap: 6px;
          background: #e11d48; color: #fff;
          font-size: 12.5px; font-weight: 800; border: none;
          padding: 9px 18px; border-radius: 8px; cursor: pointer;
          font-family: inherit; white-space: nowrap;
          transition: background 0.15s;
        }
        .bd-provider-chat-btn:hover { background: #be123c; }

        /* Safety tips panel */
        .bd-tips {
          background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 10px;
          padding: 14px 16px;
        }
        .bd-tips-title { font-size: 12px; font-weight: 800; color: #be185d; margin-bottom: 8px; }
        .bd-tip-item {
          display: flex; align-items: flex-start; gap: 6px;
          font-size: 11.5px; color: #831843; margin-bottom: 5px; line-height: 1.5;
        }
        .bd-tip-item:last-child { margin-bottom: 0; }

        /* ── RELATED ── */
        .bd-related { margin-top: 32px; }
        .bd-related-title {
          font-size: 17px; font-weight: 800; color: #111; margin-bottom: 14px;
        }
        .bd-related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        }
        .bd-rel-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          border: 1px solid #e5e7eb; text-decoration: none; color: inherit;
          display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .bd-rel-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .bd-rel-img-wrap { aspect-ratio: 16/11; overflow: hidden; background: #e5e7eb; }
        .bd-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .bd-rel-card:hover .bd-rel-img { transform: scale(1.05); }
        .bd-rel-body { padding: 10px 12px; }
        .bd-rel-name { font-size: 13.5px; font-weight: 700; color: #111; margin: 0 0 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bd-rel-price { font-size: 13px; font-weight: 800; color: #e11d48; }
        .bd-rel-loc { font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 3px; margin-top: 3px; }
        .bd-rel-rating {
          display: flex; align-items: center; gap: 2px; margin-top: 4px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .bd-grid { grid-template-columns: 1fr; }
          .bd-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .bd-body { padding: 16px 14px 40px; }
          .bd-related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="bd-wrap">

        {/* ── BREADCRUMB ── */}
        <div className="bd-breadcrumb-bar">
          <div className="bd-breadcrumb-inner">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/category/beauty">Hair, Beauty & Wellness</Link>
            <span>/</span>
            <span className="active">{item.name}</span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="bd-body">
          <Link href="/category/beauty" className="bd-back">
            <FiArrowLeft size={14} /> Back to all services
          </Link>

          <div className="bd-grid">

            {/* ── LEFT: IMAGE ── */}
            <div>
              <div className="bd-img-section">
                <div className="bd-main-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images[activeImg]} alt={item.name} className="bd-main-img" />

                  {/* Category badge */}
                  <span className="bd-img-cat-badge" style={badgeStyle}>
                    {item.category}
                  </span>

                  {/* Favourite */}
                  <button className="bd-img-fav-btn" onClick={() => setIsFav(!isFav)}>
                    {isFav
                      ? <FaHeart size={16} color="#ef4444" />
                      : <FaHeart size={16} color="#d1d5db" />}
                  </button>

                  {/* Posted time */}
                  {item.postedDaysAgo !== undefined && (
                    <span className="bd-posted-tag">
                      <FiClock size={10} style={{ marginRight: 4 }} />
                      {item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo}d ago`}
                    </span>
                  )}

                  {/* Home Visit ribbon */}
                  {item.isHomeVisit && (
                    <span className="bd-home-tag">
                      <FiHome size={10} /> Home Visit Available
                    </span>
                  )}
                </div>

                {/* Thumbnail strip */}
                {item.images.length > 1 && (
                  <div className="bd-thumb-strip">
                    {item.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${item.name} ${idx + 1}`}
                        className={`bd-thumb${activeImg === idx ? " active" : ""}`}
                        onClick={() => setActiveImg(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Safety Tips */}
              <div className="bd-tips" style={{ marginTop: 16 }}>
                <p className="bd-tips-title">💡 Beauty Service Tips</p>
                <div className="bd-tip-item">✓ Check provider reviews and portfolio before booking</div>
                <div className="bd-tip-item">✓ Confirm product brands if you have allergies or preferences</div>
                <div className="bd-tip-item">✓ For home visits, ensure a clean and well-lit space</div>
                <div className="bd-tip-item">✓ Always patch test new products 24 hours before events</div>
              </div>
            </div>

            {/* ── RIGHT: DETAILS ── */}
            <div className="bd-right">

              {/* Main Info Panel */}
              <div className="bd-panel">
                <h1 className="bd-name">{item.name}</h1>
                <p className="bd-category">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <FiScissors size={11} color="#9ca3af" />
                    {item.category} • {item.subServices.join(", ")}
                  </span>
                </p>
                <p className="bd-price-label">{item.priceRange}</p>
                <p className="bd-price">{item.price}</p>
                <div className="bd-price-divider" />

                {/* Star Rating */}
                <div style={{ marginBottom: 12 }}>
                  {renderStars(item.rating, item.reviewCount)}
                </div>

                <div className="bd-location">
                  <FiMapPin size={14} />
                  {item.distance} {item.location}, {item.district}
                </div>

                {item.description && (
                  <p className="bd-desc">{item.description}</p>
                )}

                {/* Sub-services pills */}
                <div className="bd-subs-row">
                  {item.subServices.map((sub) => (
                    <span key={sub} className="bd-sub-pill">{sub}</span>
                  ))}
                </div>

                {/* Details Grid */}
                <div className="bd-details-grid">
                  {item.serviceTime && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Service Time</p>
                      <p className="bd-detail-val">
                        <FiClock size={11} style={{ marginRight: 4 }} />
                        {item.serviceTime}
                      </p>
                    </div>
                  )}
                  {item.minBooking && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Min. Booking</p>
                      <p className="bd-detail-val">{item.minBooking}</p>
                    </div>
                  )}
                  {item.openingHours && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Open Hours</p>
                      <p className="bd-detail-val">
                        <FiCalendar size={11} style={{ marginRight: 4 }} />
                        {item.openingHours}
                      </p>
                    </div>
                  )}
                  {item.experience && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Experience</p>
                      <p className="bd-detail-val">{item.experience}</p>
                    </div>
                  )}
                  {item.gender && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Gender</p>
                      <p className="bd-detail-val">{item.gender}</p>
                    </div>
                  )}
                  {item.postedDaysAgo !== undefined && (
                    <div className="bd-detail-item">
                      <p className="bd-detail-label">Posted</p>
                      <p className="bd-detail-val">
                        {item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo} day${item.postedDaysAgo > 1 ? "s" : ""} ago`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="bd-badges-row">
                  {item.isHomeVisit && (
                    <span className="bd-badge-home">
                      <FiHome size={11} /> Home Visit Available
                    </span>
                  )}
                  {item.isBridalService && (
                    <span className="bd-badge-bridal">
                      <FaSpa size={11} /> Bridal Service
                    </span>
                  )}
                  {item.tags.map((tag) => (
                    <span key={tag} className="bd-badge-tag">#{tag}</span>
                  ))}
                </div>

                {/* Availability */}
                <div className="bd-avail">
                  <span className="bd-avail-dot" />
                  Currently Accepting Bookings
                </div>

                {/* Action Buttons */}
                <div className="bd-actions">
                  <Link
                    href={`tel:${item.providerPhone}`}
                    className="bd-btn-book"
                  >
                    <FiCalendar size={16} />
                    Book Now
                  </Link>
                  <button
                    className="bd-btn-phone"
                    onClick={() => window.open(`tel:${item.providerPhone}`, "_self")}
                  >
                    <FiPhone size={16} />
                  </button>
                  <button
                    className="bd-btn-share"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: item.name, url: window.location.href });
                      }
                    }}
                  >
                    <FiShare2 size={16} />
                  </button>
                </div>
              </div>

              {/* Provider Panel */}
              <div className="bd-provider-panel">
                <p className="bd-provider-title">Service Provider</p>
                <div className="bd-provider-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="bd-provider-avatar">
                      {(item.providerName ?? "P")[0]}
                    </div>
                    <div>
                      <p className="bd-provider-name">{item.providerName ?? "Unknown Provider"}</p>
                      <p className="bd-provider-phone">{item.providerPhone}</p>
                    </div>
                  </div>
                  <button
                    className="bd-provider-chat-btn"
                    onClick={() => window.open(`tel:${item.providerPhone}`, "_self")}
                  >
                    <FiPhone size={13} /> Call Now
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── RELATED LISTINGS ── */}
          {related.length > 0 && (
            <div className="bd-related">
              <p className="bd-related-title">Similar {item.category} Services</p>
              <div className="bd-related-grid">
                {related.map((r) => (
                  <Link key={r.id} href={`/category/beauty/${r.id}`} className="bd-rel-card">
                    <div className="bd-rel-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.images[0]} alt={r.name} className="bd-rel-img" />
                    </div>
                    <div className="bd-rel-body">
                      <p className="bd-rel-name">{r.name}</p>
                      <p className="bd-rel-price">{r.price}</p>
                      <p className="bd-rel-loc"><FiMapPin size={10} />{r.distance} {r.location}</p>
                      <div className="bd-rel-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            size={10}
                            fill={i < Math.floor(r.rating) ? "#f59e0b" : "none"}
                            color={i < Math.floor(r.rating) ? "#f59e0b" : "#d1d5db"}
                          />
                        ))}
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#111", marginLeft: 3 }}>{r.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}