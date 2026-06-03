"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { FaStar, FaRegStar, FaHeart, FaHardHat, FaBuilding } from "react-icons/fa";
import {
  FiShare2, FiHeart, FiMapPin, FiClock, FiEye,
  FiCheckCircle, FiMail, FiMessageSquare, FiChevronRight,
  FiTool, FiUsers, FiPhone,
} from "react-icons/fi";
import { MdEngineering, MdVerified } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";

// ── Types ─────────────────────────────────────────────────────────────────────

type ConstructionDetail = {
  id: string;
  listingId: string;
  title: string;
  subtitle: string;
  price: string;
  projectType: string;
  location: string;
  postedDaysAgo: number;
  views: number;
  isVerified: boolean;
  isFeatured: boolean;
  availableNow: boolean;
  images: string[];
  experience: string;
  projectDuration: string;
  teamSize: string;
  completedProjects: number;
  startDate: string;
  description: string;
  services: string[];
  highlights: string[];
  breadcrumbs: string[];
  company: {
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
    industry: string;
    size: string;
    website: string;
    location: string;
  };
  mapImage: string;
  mapLocation: string;
  mapDistance: string;
  mapCity: string;
  postedBy: {
    name: string;
    role: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
};

// ── Data ──────────────────────────────────────────────────────────────────────

const CONSTRUCTION_DATA: Record<string, ConstructionDetail> = {
  "elite-construction-kathmandu": {
    id: "elite-construction-kathmandu",
    listingId: "#CON784512",
    title: "Contruction Site Supervisor",
    subtitle: "Hamro Construction Pvt. Ltd",
    price: "Rs. 50,000 - 70,000/month",
    projectType: "Full Time",
    location: "Kathmandu,Nepal",
    postedDaysAgo: 2,
    views: 48,
    isVerified: true,
    isFeatured: true,
    availableNow: true,
    images: [
      "/construction banner.jpg",
      "/Elite Contruction Pvt. Ltd..jpg",
      "/dream house builder.jpg",
      "/Reliable Engineering.jpg",
      "/house.jpg",
      "/house1.jpg",
      "/bright.jpg",
      "/greenfield.jpg",
    ],
    experience: "2–5 year",
    projectDuration: "Full Time",
    teamSize: "Bachelor's in Civil Engineering",
    completedProjects: 3,
    startDate: "June 1, 2025",
    description:
      "We are looking for a qualified Construction Site Supervisor to manage daily construction activities and ensure project completion according to quality and safety standards. The ideal candidate will oversee workers, coordinate with subcontractors, and maintain project timelines. You will be responsible for ensuring compliance with all building codes and safety regulations while delivering top-quality results on time and within budget.",
    services: [
      "Supervise daily site operations",
      "Coordinate workers and subcontractors",
      "Monitor project schedules",
      "Ensure workplace safety compliance",
      "Inspect construction quality",
      "Report project progress to management",
      "Manage site materials and equipment",
      "Resolve site-related issues",
    ],
    highlights: [
      "Bachelor's Degree in Civil Engineering or related field",
      "2–5 years of construction experience",
      "Knowledge of construction regulations",
      "Strong leadership skills",
      "Project coordination experience",
      "Good communication skills",
      "Ability to read engineering drawings",
    ],
    breadcrumbs: ["Job", "Contruction & Engineering"],
    company: {
      name: "Hamro Construction Pvt. Ltd",
      logo: "/construction.png",
      rating: 4.5,
      reviewCount: 126,
      industry: "Construction & Engineering",
      size: "20-50 Employees",
      website: "www.tastebudsrestaurant.com",
      location: "Kathmandu,Nepal",
    },
    mapImage: "/kathmandu.jpg",
    mapLocation: "Balkumari lalitpur",
    mapDistance: "2.9km from FunPark",
    mapCity: "Lazimpat,Kathmandu, Nepal",
    postedBy: {
      name: "Anita KC",
      role: "Project Manager",
      avatar: "/lady.jpg",
      rating: 4.8,
      reviewCount: 126,
      isVerified: true,
    },
  },
  "dream-house-builder-lalitpur": {
    id: "dream-house-builder-lalitpur",
    listingId: "#CON123456",
    title: "Civil Site Engineer",
    subtitle: "Dream House Builder",
    price: "Rs. 40,000 - 60,000/month",
    projectType: "Full Time",
    location: "Lalitpur, Nepal",
    postedDaysAgo: 1,
    views: 35,
    isVerified: true,
    isFeatured: false,
    availableNow: true,
    images: [
      "/dream house builder.jpg",
      "/construction banner.jpg",
      "/house.jpg",
      "/house1.jpg",
      "/house2.jpg",
      "/house3.jpg",
    ],
    experience: "1–3 year",
    projectDuration: "Full Time",
    teamSize: "Bachelor's in Civil Engineering",
    completedProjects: 2,
    startDate: "June 15, 2025",
    description:
      "Dream House Builder is seeking a motivated Civil Site Engineer to join our growing team. You will assist in planning, designing, and overseeing construction projects including residential homes and commercial buildings. This is an excellent opportunity to grow your career in a dynamic and collaborative environment with experienced professionals.",
    services: [
      "Assist in project planning and design",
      "Supervise construction workers",
      "Conduct site inspections",
      "Prepare progress reports",
      "Liaise with architects and consultants",
      "Ensure quality standards",
    ],
    highlights: [
      "Bachelor's in Civil Engineering",
      "1–3 years of site experience",
      "AutoCAD proficiency preferred",
      "Strong analytical skills",
      "Good communication",
      "Team player",
    ],
    breadcrumbs: ["Job", "Contruction & Engineering"],
    company: {
      name: "Dream House Builder",
      logo: "/construction.png",
      rating: 4.7,
      reviewCount: 98,
      industry: "Construction & Engineering",
      size: "10-30 Employees",
      website: "www.dreamhousebuilder.com.np",
      location: "Lalitpur, Nepal",
    },
    mapImage: "/house1.jpg",
    mapLocation: "Jawalakhel, Lalitpur",
    mapDistance: "1.5km from Lagankhel",
    mapCity: "Lalitpur, Nepal",
    postedBy: {
      name: "Ramesh Shrestha",
      role: "HR Manager",
      avatar: "/lady.jpg",
      rating: 4.6,
      reviewCount: 64,
      isVerified: true,
    },
  },
  "reliable-engineering-ktm": {
    id: "reliable-engineering-ktm",
    listingId: "#CON654321",
    title: "Senior Structural Engineer",
    subtitle: "Reliable Engineering Solutions",
    price: "Rs. 70,000 - 1,00,000/month",
    projectType: "Full Time",
    location: "Kathmandu, Nepal",
    postedDaysAgo: 3,
    views: 72,
    isVerified: true,
    isFeatured: true,
    availableNow: false,
    images: [
      "/Reliable Engineering.jpg",
      "/construction banner.jpg",
      "/Elite Contruction Pvt. Ltd..jpg",
      "/bright.jpg",
      "/house2.jpg",
    ],
    experience: "5+ years",
    projectDuration: "Full Time",
    teamSize: "Master's in Structural Engineering",
    completedProjects: 5,
    startDate: "July 1, 2025",
    description:
      "Reliable Engineering Solutions is looking for an experienced Senior Structural Engineer to lead major infrastructure projects across Nepal. The candidate will be responsible for designing structural systems, reviewing engineering drawings, and ensuring compliance with international standards. This is a senior-level position ideal for professionals with a proven track record in large-scale civil and structural engineering projects.",
    services: [
      "Design structural systems for buildings",
      "Review and approve engineering drawings",
      "Ensure structural safety compliance",
      "Lead a team of junior engineers",
      "Coordinate with project managers",
      "Conduct site visits and inspections",
      "Prepare structural analysis reports",
    ],
    highlights: [
      "Master's in Structural or Civil Engineering",
      "5+ years of relevant experience",
      "Proficiency in ETABS, SAP2000",
      "Strong project management skills",
      "Knowledge of Nepal Building Code",
      "Leadership and mentoring ability",
      "Excellent report-writing skills",
    ],
    breadcrumbs: ["Job", "Contruction & Engineering"],
    company: {
      name: "Reliable Engineering Solutions",
      logo: "/construction.png",
      rating: 4.9,
      reviewCount: 74,
      industry: "Civil & Structural Engineering",
      size: "50-100 Employees",
      website: "www.reliableengineering.com.np",
      location: "Kathmandu, Nepal",
    },
    mapImage: "/kathmandu.jpg",
    mapLocation: "New Baneshwor, Kathmandu",
    mapDistance: "0.9km from City Center",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Sita Tamang",
      role: "Recruitment Officer",
      avatar: "/lady.jpg",
      rating: 4.9,
      reviewCount: 88,
      isVerified: true,
    },
  },
};

const FALLBACK = CONSTRUCTION_DATA["elite-construction-kathmandu"];

const SIMILAR = [
  { id: "elite-construction-kathmandu",  title: "Construction Site Supervisor", company: "Hamro Construction",    image: "/construction banner.jpg",         location: "Kathmandu" },
  { id: "dream-house-builder-lalitpur",  title: "Civil Site Engineer",           company: "Dream House Builder",    image: "/dream house builder.jpg",         location: "Lalitpur"  },
  { id: "reliable-engineering-ktm",      title: "Senior Structural Engineer",    company: "Reliable Engineering",   image: "/Reliable Engineering.jpg",        location: "Kathmandu" },
  { id: "greenfield-developers-bhaktapur", title: "Project Coordinator",         company: "Greenfield Developers",  image: "/greenfield.jpg",                  location: "Bhaktapur" },
  { id: "modern-interior-works-pokhara", title: "Interior Design Lead",          company: "Modern Interior Works",  image: "/Modeern Interior Works.jpg",      location: "Pokhara"   },
];

// ── Stars ──────────────────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating)
          ? <FaStar key={i} size={size} color="#F5A623" />
          : <FaRegStar key={i} size={size} color="#F5A623" />
      )}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ConstructionDetailPage() {
  const params = useParams();
  const rawId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const listing = CONSTRUCTION_DATA[rawId] ?? FALLBACK;

  const [activeImg,    setActiveImg]    = useState(0);
  const [isFav,        setIsFav]        = useState(false);
  const [showFull,     setShowFull]     = useState(false);
  const [showFullReq,  setShowFullReq]  = useState(false);
  const [copied,       setCopied]       = useState(false);

  const thumbs = listing.images.slice(0, 5);
  const extra  = listing.images.length - 5;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        .cd-page {
          background: #f5f6f8; min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 60px;
        }

        /* Topbar */
        .cd-topbar { background: #fff; border-bottom: 1px solid #ececec; padding: 10px 0; }
        .cd-topbar-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 22px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 6px;
        }
        .cd-breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: #888; flex-wrap: wrap; }
        .cd-bc-link { color: #C0392B; text-decoration: none; font-weight: 500; }
        .cd-bc-link:hover { text-decoration: underline; }
        .cd-bc-sep { color: #ccc; font-size: 11px; margin: 0 1px; }
        .cd-bc-cur { color: #444; font-weight: 500; }
        .cd-lid { font-size: 12px; color: #999; font-weight: 500; }
        .cd-report { font-size: 12px; color: #C0392B; font-weight: 600; text-decoration: none; }
        .cd-report:hover { text-decoration: underline; }

        /* Grid */
        .cd-wrap {
          max-width: 1180px; margin: 18px auto 0; padding: 0 22px;
          display: grid; grid-template-columns: 1fr 310px; gap: 18px; align-items: start;
        }
        .cd-left  { display: flex; flex-direction: column; gap: 14px; }
        .cd-right { display: flex; flex-direction: column; gap: 14px; }

        /* Gallery */
        .cd-gallery { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8; }
        .cd-hero-wrap { position: relative; width: 100%; height: 280px; overflow: hidden; background: #1a1209; cursor: zoom-in; }
        .cd-hero-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .cd-hero-wrap:hover .cd-hero-img { transform: scale(1.04); }

        .cd-thumbs-row {
          display: flex; gap: 6px; padding: 8px 10px;
          overflow-x: auto; scrollbar-width: none; background: #fff;
        }
        .cd-thumbs-row::-webkit-scrollbar { display: none; }
        .cd-thumb {
          flex-shrink: 0; width: 76px; height: 52px; border-radius: 7px;
          overflow: hidden; cursor: pointer; position: relative;
          border: 2px solid transparent; transition: border-color 0.2s, transform 0.15s;
        }
        .cd-thumb:hover { transform: translateY(-2px); }
        .cd-thumb.on { border-color: #d97706; }
        .cd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cd-thumb-more {
          position: absolute; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px; font-weight: 800;
        }

        /* Badge Row */
        .cd-badge-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          padding: 10px 14px; border-top: 1px solid #f2f2f2; background: #fff;
        }
        .cd-badge-verified {
          display: inline-flex; align-items: center; gap: 4px;
          background: #dff5e9; color: #1a7a43; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #b2e0c2;
        }
        .cd-badge-featured {
          display: inline-flex; align-items: center; gap: 4px;
          background: #fff8e1; color: #b07000; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #f5d58a;
        }
        .cd-badge-spacer { flex: 1; }
        .cd-share-btn, .cd-save-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 600; color: #444;
          background: none; border: none; cursor: pointer; font-family: inherit;
          padding: 4px 6px; border-radius: 6px; transition: background 0.15s;
        }
        .cd-share-btn:hover, .cd-save-btn:hover { background: #f5f5f5; }
        .cd-save-btn.on { color: #e74c3c; }

        /* Info Card */
        .cd-info-card {
          background: #fff; border-radius: 14px; padding: 18px 20px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .cd-title { font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px; }
        .cd-subtitle { font-size: 14px; color: #666; font-weight: 500; margin: 0 0 4px; }
        .cd-price { font-size: 22px; font-weight: 900; color: #1a1a1a; margin: 4px 0 8px; }
        .cd-meta-row {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          font-size: 12.5px; color: #666; padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0; margin-bottom: 14px;
        }
        .cd-meta-item { display: flex; align-items: center; gap: 4px; }
        .cd-cta-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .cd-btn-apply {
          flex: 1; padding: 12px 20px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; box-shadow: 0 4px 14px rgba(217,119,6,0.3);
          transition: opacity 0.2s, transform 0.15s;
        }
        .cd-btn-apply:hover { opacity: 0.9; transform: translateY(-1px); }
        .cd-btn-chat {
          flex: 1; padding: 12px 20px; border-radius: 9px;
          border: 1.5px solid #d97706; background: #fff;
          color: #d97706; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: flex; align-items: center; justify-content: center;
          gap: 7px; transition: background 0.18s;
        }
        .cd-btn-chat:hover { background: #fef3c7; }

        /* Stats Chips */
        .cd-chips-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding-top: 2px; }
        .cd-chip {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          background: #f8f9fb; border-radius: 10px; padding: 10px 6px 9px;
          border: 1px solid #eef0f3; text-align: center; transition: background 0.2s;
        }
        .cd-chip:hover { background: #fef3c7; }
        .cd-chip-icon {
          width: 30px; height: 30px; display: flex; align-items: center;
          justify-content: center; background: #fff; border-radius: 7px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px;
        }
        .cd-chip-val   { font-size: 11px; font-weight: 800; color: #1a1a1a; line-height: 1.2; }
        .cd-chip-label { font-size: 9.5px; color: #999; font-weight: 500; }

        /* Description */
        .cd-desc-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .cd-sec-title  { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .cd-desc-text  { font-size: 13px; color: #444; line-height: 1.85; margin: 0; }
        .cd-desc-text.clip { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .cd-see-more {
          display: inline-block; margin-top: 6px; font-size: 12.5px;
          font-weight: 600; color: #d97706; background: none; border: none;
          cursor: pointer; padding: 0; font-family: inherit;
        }
        .cd-see-more:hover { text-decoration: underline; }

        /* Services / Requirements */
        .cd-req-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .cd-req-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        .cd-req-col-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .cd-req-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: #333; padding: 6px 0;
          border-bottom: 1px solid #f8f8f8;
        }
        .cd-req-item:last-child { border-bottom: none; }
        .cd-req-dot { width: 6px; height: 6px; border-radius: 50%; background: #d97706; flex-shrink: 0; margin-top: 6px; }
        .cd-ben-dot { width: 6px; height: 6px; border-radius: 50%; background: #0b8a6b; flex-shrink: 0; margin-top: 6px; }

        /* Right column – Company Card */
        .cd-company-card {
          background: #fff; border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .cd-company-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
        .cd-company-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cd-company-logo { width: 46px; height: 46px; border-radius: 10px; object-fit: contain; border: 1px solid #eee; background: #f8f8f8; flex-shrink: 0; display: block; }
        .cd-company-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 3px; }
        .cd-company-rating { display: flex; align-items: center; gap: 5px; }
        .cd-company-rnum { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .cd-company-rcount { font-size: 11.5px; color: #888; }
        .cd-ci-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 7px 0; border-bottom: 1px solid #f8f8f8; font-size: 12px; gap: 8px;
        }
        .cd-ci-row:last-child { border-bottom: none; }
        .cd-ci-label { color: #888; font-weight: 500; flex-shrink: 0; }
        .cd-ci-val { color: #1a1a1a; font-weight: 600; text-align: right; word-break: break-all; }
        .cd-cta-btns { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
        .cd-cta-full {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; padding: 11px; border-radius: 9px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit; transition: all 0.18s;
          border: none;
        }
        .cd-cta-primary { background: linear-gradient(135deg,#d97706,#b45309); color: #fff; box-shadow: 0 3px 10px rgba(217,119,6,0.3); }
        .cd-cta-primary:hover { opacity: 0.9; }
        .cd-cta-outline { background: #fff; color: #333; border: 1.5px solid #ddd !important; }
        .cd-cta-outline:hover { background: #f8f8f8; }
        .cd-view-profile {
          display: block; width: 100%; margin-top: 8px; padding: 11px;
          text-align: center; font-size: 13px; font-weight: 700; color: #333;
          border: 1.5px solid #ddd; border-radius: 9px; background: #fff;
          text-decoration: none; cursor: pointer; font-family: inherit;
          transition: background 0.18s, border-color 0.18s;
        }
        .cd-view-profile:hover { background: #f8f8f8; border-color: #bbb; }

        /* Location Card */
        .cd-location-card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8; }
        .cd-location-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; margin: 0; padding: 14px 16px 10px; border-bottom: 1px solid #f0f0f0; }
        .cd-map-area { width: 100%; height: 160px; position: relative; overflow: hidden; }
        .cd-map-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(0.6) brightness(0.85); }
        .cd-map-overlay { position: absolute; inset: 0; background: rgba(180,83,6,0.18); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
        .cd-map-place-name { font-size: 22px; font-weight: 900; color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,0.5); letter-spacing: -0.5px; }
        .cd-map-place-sub { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.85); text-shadow: 0 1px 6px rgba(0,0,0,0.4); letter-spacing: 1px; text-transform: uppercase; }
        .cd-map-pin-anim { position: absolute; top: 12px; right: 16px; animation: cdPinBounce 2s ease-in-out infinite; }
        @keyframes cdPinBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .cd-location-info { padding: 10px 16px; }
        .cd-loc-name { font-size: 13px; font-weight: 700; color: #1a1a1a; margin: 0 0 2px; }
        .cd-loc-dist { font-size: 11.5px; color: #888; margin: 0 0 1px; }
        .cd-loc-city { font-size: 11.5px; color: #666; margin: 0 0 6px; }
        .cd-map-link {
          display: flex; align-items: center; justify-content: center; gap: 4px;
          font-size: 12.5px; font-weight: 600; color: #C0392B;
          text-decoration: none; border-top: 1px solid #f0f0f0;
          padding: 9px 16px; transition: background 0.18s;
        }
        .cd-map-link:hover { background: #fff5f5; }

        /* Posted By */
        .cd-posted-card { background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8; }
        .cd-posted-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
        .cd-poster-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .cd-poster-avatar { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.14); display: block; flex-shrink: 0; }
        .cd-poster-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 1px; }
        .cd-poster-role { font-size: 11.5px; color: #888; margin: 0 0 3px; }
        .cd-poster-rating { display: flex; align-items: center; gap: 5px; }
        .cd-poster-rnum { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .cd-poster-rcount { font-size: 11.5px; color: #888; }
        .cd-verified-tag {
          display: inline-flex; align-items: center; gap: 4px;
          background: #eafaf5; color: #0b8a6b; border: 1px solid #a8dfcf;
          font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
          margin-bottom: 12px;
        }
        .cd-send-msg {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 11px; border-radius: 9px;
          border: 1.5px solid #ddd; background: #fff; color: #333;
          font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: background 0.18s;
        }
        .cd-send-msg:hover { background: #f5f5f5; }

        /* Similar Section */
        .cd-similar { max-width: 1180px; margin: 0 auto; padding: 22px 22px 0; }
        .cd-similar-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .cd-similar-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .cd-similar-all { font-size: 13px; font-weight: 600; color: #C0392B; text-decoration: none; display: flex; align-items: center; gap: 3px; }
        .cd-similar-all:hover { text-decoration: underline; }
        .cd-similar-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: #ddd transparent; }
        .cd-similar-row::-webkit-scrollbar { height: 4px; }
        .cd-similar-row::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        .cd-sim-card {
          flex-shrink: 0; width: 160px; background: #fff; border-radius: 11px;
          overflow: hidden; border: 1.5px solid #ebebeb; text-decoration: none;
          display: flex; flex-direction: column; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s; position: relative;
        }
        .cd-sim-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.1); }
        .cd-sim-img-wrap { width: 100%; height: 100px; overflow: hidden; }
        .cd-sim-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .cd-sim-card:hover .cd-sim-img { transform: scale(1.08); }
        .cd-sim-body { padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 2px; }
        .cd-sim-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin: 0; }
        .cd-sim-company { font-size: 10.5px; color: #888; margin: 1px 0 0; }
        .cd-sim-loc { font-size: 10px; color: #aaa; margin: 2px 0 0; display: flex; align-items: center; gap: 2px; }

        /* Responsive */
        @media (max-width: 960px) {
          .cd-wrap { grid-template-columns: 1fr; }
          .cd-right { order: -1; }
          .cd-chips-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cd-wrap { padding: 0 12px; margin-top: 10px; gap: 10px; }
          .cd-similar { padding: 16px 12px 0; }
          .cd-info-card { padding: 14px; }
          .cd-title { font-size: 17px; }
          .cd-price { font-size: 18px; }
          .cd-chips-row { grid-template-columns: repeat(2, 1fr); }
          .cd-req-grid { grid-template-columns: 1fr; }
          .cd-hero-wrap { height: 200px; }
          .cd-cta-row { flex-direction: column; }
        }
      `}</style>

      <div className="cd-page">

        {/* Topbar */}
        <div className="cd-topbar">
          <div className="cd-topbar-inner">
            <nav className="cd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="cd-bc-link">Home</Link>
              {listing.breadcrumbs.map((crumb, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="cd-bc-sep">›</span>
                  {i === listing.breadcrumbs.length - 1
                    ? <span className="cd-bc-cur">{crumb}</span>
                    : <Link href="/category/construction" className="cd-bc-link">{crumb}</Link>
                  }
                </span>
              ))}
              <span className="cd-bc-sep">›</span>
              <span className="cd-bc-cur">{listing.title}</span>
            </nav>
            <span className="cd-lid">Job ID: {listing.listingId}</span>
            <a href="#report" className="cd-report">Report This Job</a>
          </div>
        </div>

        {/* Main Grid */}
        <div className="cd-wrap">

          {/* LEFT */}
          <div className="cd-left">

            {/* Gallery */}
            <div className="cd-gallery">
              <div className="cd-hero-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.images[activeImg]} alt={listing.title} className="cd-hero-img" />
              </div>

              {/* Thumbs */}
              <div className="cd-thumbs-row">
                {thumbs.map((src, i) => (
                  <div
                    key={i}
                    className={`cd-thumb${activeImg === i ? " on" : ""}`}
                    onClick={() => setActiveImg(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View image ${i + 1}`}
                    onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" />
                    {i === 4 && extra > 0 && (
                      <div className="cd-thumb-more">+{extra}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Badge Row */}
              <div className="cd-badge-row">
                {listing.isVerified && (
                  <span className="cd-badge-verified">
                    <FiCheckCircle size={9} color="#1a7a43" style={{ marginRight: 3 }} />
                    Verified Job
                  </span>
                )}
                {listing.isFeatured && (
                  <span className="cd-badge-featured">⭐ Featured</span>
                )}
                <div className="cd-badge-spacer" />
                <button className="cd-share-btn" onClick={handleShare} id="share-btn">
                  <FiShare2 size={13} color="#555" />
                  {copied ? "Copied!" : "Share"}
                </button>
                <button
                  className={`cd-save-btn${isFav ? " on" : ""}`}
                  onClick={() => setIsFav((v) => !v)}
                  id="save-btn"
                >
                  {isFav ? <FaHeart size={13} color="#e74c3c" /> : <FiHeart size={13} color="#888" />}
                  Save
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="cd-info-card">
              <h1 className="cd-title">{listing.title}</h1>
              <p className="cd-subtitle">{listing.subtitle}</p>
              <div className="cd-price">{listing.price}</div>

              {/* Meta */}
              <div className="cd-meta-row">
                <span className="cd-meta-item">
                  <FiMapPin size={11} color="#888" style={{ marginRight: 3 }} />
                  {listing.location}
                </span>
                <span className="cd-meta-item">
                  <FaHardHat size={11} color="#d97706" style={{ marginRight: 3 }} />
                  {listing.projectType}
                </span>
                <span className="cd-meta-item">
                  <FiClock size={12} color="#bbb" style={{ marginRight: 3 }} />
                  Posted {listing.postedDaysAgo} day{listing.postedDaysAgo !== 1 ? "s" : ""} ago
                </span>
                <span className="cd-meta-item">
                  <FiEye size={12} color="#bbb" style={{ marginRight: 3 }} />
                  {listing.views} views
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="cd-cta-row">
                <button className="cd-btn-apply" id="apply-btn">Apply Now</button>
                <button className="cd-btn-chat" id="chat-btn">
                  <FiMessageSquare size={14} color="#d97706" />
                  Chat with Employee
                </button>
              </div>

              {/* Stats Chips */}
              <div className="cd-chips-row">
                <div className="cd-chip">
                  <div className="cd-chip-icon">🏅</div>
                  <span className="cd-chip-val">{listing.experience}</span>
                  <span className="cd-chip-label">Experience</span>
                </div>
                <div className="cd-chip">
                  <div className="cd-chip-icon">💼</div>
                  <span className="cd-chip-val">{listing.projectDuration}</span>
                  <span className="cd-chip-label">Employment Type</span>
                </div>
                <div className="cd-chip">
                  <div className="cd-chip-icon">🎓</div>
                  <span className="cd-chip-val" style={{ fontSize: 9.5 }}>{listing.teamSize}</span>
                  <span className="cd-chip-label">Education</span>
                </div>
                <div className="cd-chip">
                  <div className="cd-chip-icon">👥</div>
                  <span className="cd-chip-val">{listing.completedProjects} opening</span>
                  <span className="cd-chip-label">Vacancies</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="cd-desc-card">
              <h2 className="cd-sec-title">Description</h2>
              <p className={`cd-desc-text${!showFull ? " clip" : ""}`}>{listing.description}</p>
              <button className="cd-see-more" onClick={() => setShowFull((v) => !v)} id="desc-toggle">
                {showFull ? "See Less" : "See More"}
              </button>
            </div>

            {/* Responsibilities + Requirements */}
            <div className="cd-req-card">
              <div className="cd-req-grid">
                <div>
                  <h2 className="cd-req-col-title">Responsibilities</h2>
                  {listing.services.map((s, i) => (
                    <div className="cd-req-item" key={i}>
                      <span className="cd-req-dot" />
                      {s}
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="cd-req-col-title">Description</h2>
                  {(showFullReq ? listing.highlights : listing.highlights.slice(0, 5)).map((h, i) => (
                    <div className="cd-req-item" key={i}>
                      <span className="cd-ben-dot" />
                      {h}
                    </div>
                  ))}
                  {listing.highlights.length > 5 && (
                    <button className="cd-see-more" onClick={() => setShowFullReq((v) => !v)} id="req-toggle">
                      {showFullReq ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="cd-right">

            {/* Company Information */}
            <div className="cd-company-card">
              <p className="cd-company-card-title">Company Information</p>
              <div className="cd-company-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.company.logo} alt={listing.company.name} className="cd-company-logo" />
                <div>
                  <p className="cd-company-name">{listing.company.name}</p>
                  <div className="cd-company-rating">
                    <span className="cd-company-rnum">{listing.company.rating}</span>
                    <Stars rating={listing.company.rating} size={12} />
                    <span className="cd-company-rcount">({listing.company.reviewCount} Reviews)</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="cd-ci-row">
                  <span className="cd-ci-label">Industry</span>
                  <span className="cd-ci-val">{listing.company.industry}</span>
                </div>
                <div className="cd-ci-row">
                  <span className="cd-ci-label">{listing.company.industry}</span>
                  <span className="cd-ci-val" style={{ color: "#d97706" }}>{listing.company.industry}</span>
                </div>
                <div className="cd-ci-row">
                  <span className="cd-ci-label">Company Size</span>
                  <span className="cd-ci-val">{listing.company.size}</span>
                </div>
                <div className="cd-ci-row">
                  <span className="cd-ci-label">Website</span>
                  <span className="cd-ci-val" style={{ color: "#1a5fd4", fontSize: 11 }}>{listing.company.website}</span>
                </div>
                <div className="cd-ci-row">
                  <span className="cd-ci-label">Location</span>
                  <span className="cd-ci-val">
                    <FiMapPin size={10} style={{ marginRight: 3 }} />{listing.company.location}
                  </span>
                </div>
              </div>
              <div className="cd-cta-btns">
                <button className="cd-cta-full cd-cta-primary" id="company-apply-btn">Apply Now</button>
                <button className="cd-cta-full cd-cta-outline" id="company-chat-btn">
                  <FiMessageSquare size={13} style={{ marginRight: 4 }} />Chat With Employer
                </button>
                <button className="cd-cta-full cd-cta-outline" id="company-email-btn">
                  <FiMail size={13} style={{ marginRight: 4 }} />Send Email
                </button>
                <button className="cd-cta-full cd-cta-outline" id="company-profile-btn">
                  👁 Visit Company Profiles
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="cd-location-card" id="location">
              <p className="cd-location-card-title">Location</p>
              <div className="cd-map-area">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.mapImage} alt="Location" className="cd-map-img" />
                <div className="cd-map-overlay">
                  <span className="cd-map-place-name">{listing.mapCity.split(",")[0]}</span>
                  <span className="cd-map-place-sub">{listing.mapCity.split(",")[1]?.trim() || "Nepal"}</span>
                </div>
                <div className="cd-map-pin-anim">
                  <FiMapPin size={28} color="#C0392B" />
                </div>
              </div>
              <div className="cd-location-info">
                <p className="cd-loc-name">{listing.mapLocation}</p>
                <p className="cd-loc-dist">{listing.mapDistance}</p>
                <p className="cd-loc-city">{listing.mapCity}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(listing.mapLocation + " Nepal")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cd-map-link"
              >
                <FiMapPin size={12} color="#C0392B" style={{ marginRight: 4 }} />
                View on Map
              </a>
            </div>

            {/* Posted By */}
            <div className="cd-posted-card">
              <p className="cd-posted-card-title">Posted By</p>
              <div className="cd-poster-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.postedBy.avatar}
                  alt={listing.postedBy.name}
                  className="cd-poster-avatar"
                  onError={(e) => { e.currentTarget.src = "/construction.png"; }}
                />
                <div>
                  <p className="cd-poster-name">{listing.postedBy.name}</p>
                  <p className="cd-poster-role">{listing.postedBy.role}</p>
                  <div className="cd-poster-rating">
                    <Stars rating={listing.postedBy.rating} size={12} />
                  </div>
                </div>
              </div>
              {listing.postedBy.isVerified && (
                <div className="cd-verified-tag">
                  <FiCheckCircle size={10} color="#0b8a6b" style={{ marginRight: 4 }} />
                  Verified employee
                </div>
              )}
              <button className="cd-send-msg" id="send-msg-btn">
                <FiMail size={14} color="#555" style={{ marginRight: 5 }} />
                Send Message
              </button>
            </div>

          </div>
        </div>

        {/* Similar Listings */}
        <div className="cd-similar">
          <div className="cd-similar-hdr">
            <h2 className="cd-similar-title">Similar Devices</h2>
            <Link href="/category/construction" className="cd-similar-all">
              View All
              <FiChevronRight size={12} color="#C0392B" />
            </Link>
          </div>
          <div className="cd-similar-row">
            {SIMILAR.filter((s) => s.id !== listing.id).map((sim) => (
              <Link key={sim.id} href={`/category/construction/${sim.id}`} className="cd-sim-card">
                <div className="cd-sim-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sim.image} alt={sim.title} className="cd-sim-img" />
                </div>
                <div className="cd-sim-body">
                  <p className="cd-sim-title">{sim.title}</p>
                  <p className="cd-sim-company">{sim.company}</p>
                  <p className="cd-sim-loc">
                    <FiMapPin size={8} color="#bbb" style={{ marginRight: 3 }} />
                    {sim.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
