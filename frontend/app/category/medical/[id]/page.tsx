"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { FiShare2, FiHeart, FiMapPin, FiClock, FiBriefcase, FiEye, FiCheckCircle, FiMail, FiMessageSquare, FiChevronRight } from "react-icons/fi";

// ─── Types ───────────────────────────────────────────────────────────────────

type MedicalDetail = {
  id: string;
  listingId: string;
  title: string;
  subtitle: string;
  fee: string;
  type: string;
  location: string;
  postedDaysAgo: number;
  views: number;
  isVerified: boolean;
  isFeatured: boolean;
  availableToday: boolean;
  images: string[];
  experience: string;
  employmentType: string;
  education: string;
  vacancies: number;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
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
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
};

// ─── Data ────────────────────────────────────────────────────────────────────

const MEDICAL_DATA: Record<string, MedicalDetail> = {
  "staff-nurse": {
    id: "staff-nurse",
    listingId: "#MED784512",
    title: "Staff Nurse",
    subtitle: "MedLife Hospital",
    fee: "Rs. 30,000–50,000/month",
    type: "Full-Time",
    location: "Kathmandu, Nepal",
    postedDaysAgo: 2,
    views: 35,
    isVerified: true,
    isFeatured: true,
    availableToday: true,
    images: [
      "/medical banner.jpg",
      "/medical room.jpg",
      "/hospital.png",
      "/daignostic centre.jpg",
      "/nervic.jpg",
      "/dr anisha.jpg",
      "/Dental Checkup & Cleaning.avif",
      "/lady.jpg",
    ],
    experience: "1–3years",
    employmentType: "Full-time",
    education: "Bachelor's",
    vacancies: 2,
    postedDate: "May 10, 2025",
    description:
      "We are looking for a compassionate and dedicated Staff Nurse to provide high-quality patient care and support in a professional healthcare environment. The ideal candidate should have strong clinical knowledge, excellent communication skills, and the ability to work closely with doctors and healthcare teams to ensure the best treatment and patient experience. You will be responsible for monitoring patients, administering medications, maintaining medical records, and delivering safe and efficient nursing care.",
    requirements: [
      "Registered Nurse qualification",
      "Valid Nepali Nursing council",
      "Basic computer skills",
      "Good problem solving skills",
      "Experince in hospital",
    ],
    benefits: [
      "Competitive Salary",
      "health Insurance",
      "Paid leave",
      "Traning opportunities",
      "Friendly Enviroment",
    ],
    breadcrumbs: ["Job", "Medical & Health"],
    company: {
      name: "MedLife Hospital",
      logo: "/hospital.png",
      rating: 4.5,
      reviewCount: 126,
      industry: "Medical & HealthCare",
      size: "200-500 employees",
      website: "https://share.google/vPS08HJpek059wMGH",
      location: "Kathmandu, Nepal",
    },
    mapImage: "/medical room.jpg",
    mapLocation: "Balkumari lalitpur",
    mapDistance: "2.5km from Lagankhel",
    mapCity: "Balkumari Lalitpur, Nepal",
    postedBy: {
      name: "Anita KC",
      avatar: "/dr anisha.jpg",
      rating: 4.8,
      reviewCount: 126,
      isVerified: true,
    },
  },
  "dr-anisha-shah": {
    id: "dr-anisha-shah",
    listingId: "#MED123456",
    title: "Senior Cardiologist",
    subtitle: "Norvic International Hospital",
    fee: "Rs. 1,500–2,500 per visit",
    type: "Full-Time",
    location: "Lalitpur, Nepal",
    postedDaysAgo: 1,
    views: 54,
    isVerified: true,
    isFeatured: true,
    availableToday: false,
    images: [
      "/dr anisha.jpg",
      "/medical banner.jpg",
      "/nervic.jpg",
      "/medical room.jpg",
      "/hospital.png",
      "/daignostic centre.jpg",
    ],
    experience: "15+years",
    employmentType: "Full-time",
    education: "MBBS, MD",
    vacancies: 1,
    postedDate: "May 15, 2025",
    description:
      "Dr. Anisha Shah is a highly experienced and dedicated Cardiologist with over 15 years of expertise in diagnosing and treating heart-related conditions. She completed her MBBS from Tribhuvan University and her MD in Cardiology from AIIMS, India. She is known for her compassionate care and patient-centered approach. Dr. Shah specializes in interventional cardiology, echocardiography, and preventive heart health. She has treated thousands of patients across Nepal and is widely regarded as one of the top cardiologists in the Kathmandu Valley.",
    requirements: [
      "MBBS degree from recognized university",
      "MD in Cardiology preferred",
      "Valid NMC registration",
      "3+ years clinical experience",
      "Strong communication skills",
    ],
    benefits: [
      "Competitive Salary",
      "Health Insurance",
      "Paid Leave",
      "Training & CME",
      "Modern Equipment",
    ],
    breadcrumbs: ["Job", "Medical & Health"],
    company: {
      name: "Norvic International Hospital",
      logo: "/hospital.png",
      rating: 4.7,
      reviewCount: 98,
      industry: "Medical & HealthCare",
      size: "500+ employees",
      website: "www.norvic.com.np",
      location: "Kathmandu, Nepal",
    },
    mapImage: "/medical banner.jpg",
    mapLocation: "Thapathali, Kathmandu",
    mapDistance: "1.2km from City Center",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Anita KC",
      avatar: "/lady.jpg",
      rating: 4.8,
      reviewCount: 126,
      isVerified: true,
    },
  },
  "dental-checkup-clinic": {
    id: "dental-checkup-clinic",
    listingId: "#MED654321",
    title: "Dental Surgeon",
    subtitle: "SmileCare Dental Clinic",
    fee: "Rs. 500–3,000 per visit",
    type: "Full-Time",
    location: "Kathmandu, Nepal",
    postedDaysAgo: 3,
    views: 22,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/Dental Checkup & Cleaning.avif",
      "/medical room.jpg",
      "/medical banner.jpg",
      "/hospital.png",
      "/daignostic centre.jpg",
    ],
    experience: "2–5years",
    employmentType: "Full-time",
    education: "BDS",
    vacancies: 2,
    postedDate: "May 8, 2025",
    description:
      "SmileCare Dental Clinic is looking for an experienced Dental Surgeon to join our growing team. You will provide comprehensive dental care including checkups, cleanings, fillings, extractions, and cosmetic procedures. The ideal candidate is passionate about oral health and committed to delivering exceptional patient experiences in a modern clinic environment.",
    requirements: [
      "BDS from recognized university",
      "Valid NDA registration",
      "1+ year clinical experience",
      "Knowledge of dental software",
      "Excellent patient communication",
    ],
    benefits: [
      "Competitive Salary",
      "Health Insurance",
      "Paid Leave",
      "Modern Dental Equipment",
      "Friendly Environment",
    ],
    breadcrumbs: ["Job", "Medical & Health"],
    company: {
      name: "SmileCare Dental Clinic",
      logo: "/hospital.png",
      rating: 4.9,
      reviewCount: 87,
      industry: "Dental & HealthCare",
      size: "10-50 employees",
      website: "www.smilecare.com.np",
      location: "Thamel, Kathmandu",
    },
    mapImage: "/daignostic centre.jpg",
    mapLocation: "Thamel, Kathmandu",
    mapDistance: "0.8km from Thamel Chowk",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Dr. Rajan Shrestha",
      avatar: "/lady.jpg",
      rating: 4.9,
      reviewCount: 87,
      isVerified: true,
    },
  },
};

const FALLBACK = MEDICAL_DATA["staff-nurse"];

const SIMILAR = [
  { id: "staff-nurse", title: "Staff Nurse", company: "MedLife Hospital", image: "/medical banner.jpg", location: "Kathmandu" },
  { id: "dr-anisha-shah", title: "Senior Cardiologist", company: "Norvic Hospital", image: "/dr anisha.jpg", location: "Lalitpur" },
  { id: "dental-checkup-clinic", title: "Dental Surgeon", company: "SmileCare Clinic", image: "/Dental Checkup & Cleaning.avif", location: "Kathmandu" },
  { id: "lab-technician", title: "Medical Lab Technician", company: "Om Diagnostic", image: "/daignostic centre.jpg", location: "Bhaktapur" },
  { id: "general-physician", title: "General Physician", company: "Sunrise Medical", image: "/medical room.jpg", location: "Pokhara" },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MedicalDetailPage() {
  const params = useParams();
  const rawId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const listing = MEDICAL_DATA[rawId] ?? FALLBACK;

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [callRevealed, setCallRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const thumbs = listing.images.slice(0, 5);
  const extra = listing.images.length - 5;

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
        .md2-page {
          background: #f5f6f8;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 60px;
        }

        /* ── Topbar ── */
        .md2-topbar {
          background: #fff;
          border-bottom: 1px solid #ececec;
          padding: 10px 0;
        }
        .md2-topbar-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 22px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 6px;
        }
        .md2-breadcrumb {
          display: flex; align-items: center; gap: 4px;
          font-size: 12.5px; color: #888; flex-wrap: wrap;
        }
        .md2-bc-link { color: #C0392B; text-decoration: none; font-weight: 500; }
        .md2-bc-link:hover { text-decoration: underline; }
        .md2-bc-sep { color: #ccc; font-size: 11px; margin: 0 1px; }
        .md2-bc-cur { color: #444; font-weight: 500; }
        .md2-lid { font-size: 12px; color: #999; font-weight: 500; }
        .md2-report { font-size: 12px; color: #C0392B; font-weight: 600; text-decoration: none; }
        .md2-report:hover { text-decoration: underline; }

        /* ── Container ── */
        .md2-wrap {
          max-width: 1180px; margin: 18px auto 0; padding: 0 22px;
          display: grid; grid-template-columns: 1fr 310px; gap: 18px; align-items: start;
        }
        .md2-left { display: flex; flex-direction: column; gap: 14px; }
        .md2-right { display: flex; flex-direction: column; gap: 14px; }

        /* ── Gallery Card ── */
        .md2-gallery {
          background: #fff; border-radius: 14px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          border: 1px solid #e8e8e8;
        }
        .md2-hero-wrap {
          position: relative; width: 100%; height: 280px;
          overflow: hidden; background: #1a1a2e; cursor: zoom-in;
        }
        .md2-hero-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .md2-hero-wrap:hover .md2-hero-img { transform: scale(1.04); }
        .md2-thumbs-row {
          display: flex; gap: 6px; padding: 8px 10px;
          overflow-x: auto; scrollbar-width: none; background: #fff;
        }
        .md2-thumbs-row::-webkit-scrollbar { display: none; }
        .md2-thumb {
          flex-shrink: 0; width: 76px; height: 52px; border-radius: 7px;
          overflow: hidden; cursor: pointer; position: relative;
          border: 2px solid transparent; transition: border-color 0.2s, transform 0.15s;
        }
        .md2-thumb:hover { transform: translateY(-2px); }
        .md2-thumb.on { border-color: #C0392B; }
        .md2-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .md2-thumb-more {
          position: absolute; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px; font-weight: 800;
        }

        /* ── Badge Row ── */
        .md2-badge-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          padding: 10px 14px; border-top: 1px solid #f2f2f2;
          background: #fff;
        }
        .md2-badge-verified {
          display: inline-flex; align-items: center; gap: 4px;
          background: #dff5e9; color: #1a7a43; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #b2e0c2;
        }
        .md2-badge-featured {
          display: inline-flex; align-items: center; gap: 4px;
          background: #fff0d0; color: #b07000; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #f5d58a;
        }
        .md2-badge-spacer { flex: 1; }
        .md2-share-btn, .md2-save-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 600; color: #444;
          background: none; border: none; cursor: pointer; font-family: inherit;
          padding: 4px 6px; border-radius: 6px; transition: background 0.15s;
        }
        .md2-share-btn:hover, .md2-save-btn:hover { background: #f5f5f5; }
        .md2-save-btn.on { color: #e74c3c; }

        /* ── Info Card ── */
        .md2-info-card {
          background: #fff; border-radius: 14px; padding: 18px 20px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .md2-title { font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px; }
        .md2-fee { font-size: 22px; font-weight: 900; color: #1a1a1a; margin: 4px 0 8px; }
        .md2-meta-row {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          font-size: 12.5px; color: #666; padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0; margin-bottom: 14px;
        }
        .md2-meta-item { display: flex; align-items: center; gap: 4px; }
        .md2-cta-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .md2-btn-apply {
          flex: 1; padding: 12px 20px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, #1a5fd4 0%, #0d3d9e 100%);
          color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; box-shadow: 0 4px 14px rgba(26,95,212,0.3);
          transition: opacity 0.2s, transform 0.15s;
        }
        .md2-btn-apply:hover { opacity: 0.9; transform: translateY(-1px); }
        .md2-btn-chat {
          flex: 1; padding: 12px 20px; border-radius: 9px;
          border: 1.5px solid #1a5fd4; background: #fff;
          color: #1a5fd4; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: flex; align-items: center; justify-content: center;
          gap: 7px; transition: background 0.18s;
        }
        .md2-btn-chat:hover { background: #f0f5ff; }

        /* ── Stats Chips ── */
        .md2-chips-row {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 8px; padding-top: 2px;
        }
        .md2-chip {
          display: flex; flex-direction: column; align-items: center;
          gap: 5px; background: #f8f9fb; border-radius: 10px;
          padding: 10px 6px 9px; border: 1px solid #eef0f3; text-align: center;
          transition: background 0.2s;
        }
        .md2-chip:hover { background: #f0f4ff; }
        .md2-chip-icon {
          width: 30px; height: 30px; display: flex; align-items: center;
          justify-content: center; background: #fff; border-radius: 7px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-size: 14px;
        }
        .md2-chip-val { font-size: 11.5px; font-weight: 800; color: #1a1a1a; line-height: 1.2; }
        .md2-chip-label { font-size: 9.5px; color: #999; font-weight: 500; }

        /* ── Description Card ── */
        .md2-desc-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .md2-sec-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .md2-desc-text { font-size: 13px; color: #444; line-height: 1.85; margin: 0; }
        .md2-desc-text.clip {
          display: -webkit-box; -webkit-line-clamp: 4;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .md2-see-more {
          display: inline-block; margin-top: 6px; font-size: 12.5px;
          font-weight: 600; color: #1a5fd4; background: none; border: none;
          cursor: pointer; padding: 0; font-family: inherit;
        }
        .md2-see-more:hover { text-decoration: underline; }

        /* ── Req / Benefits Card ── */
        .md2-req-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .md2-req-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        .md2-req-col {}
        .md2-req-col-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .md2-req-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: #333; padding: 6px 0;
          border-bottom: 1px solid #f8f8f8;
        }
        .md2-req-item:last-child { border-bottom: none; }
        .md2-req-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #1a5fd4; flex-shrink: 0; margin-top: 6px;
        }
        .md2-ben-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #0b8a6b; flex-shrink: 0; margin-top: 6px;
        }

        /* ─────────── RIGHT COLUMN ─────────── */

        /* ── Company Card ── */
        .md2-company-card {
          background: #fff; border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .md2-company-card-title {
          font-size: 13px; font-weight: 800; color: #1a1a1a;
          margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;
        }
        .md2-company-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .md2-company-logo {
          width: 46px; height: 46px; border-radius: 10px; object-fit: contain;
          border: 1px solid #eee; background: #f8f8f8; flex-shrink: 0; display: block;
        }
        .md2-company-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 3px; }
        .md2-company-rating { display: flex; align-items: center; gap: 5px; }
        .md2-company-rnum { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .md2-company-rcount { font-size: 11.5px; color: #888; }
        .md2-company-info { display: flex; flex-direction: column; gap: 0; }
        .md2-ci-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 7px 0; border-bottom: 1px solid #f8f8f8; font-size: 12px; gap: 8px;
        }
        .md2-ci-row:last-child { border-bottom: none; }
        .md2-ci-label { color: #888; font-weight: 500; flex-shrink: 0; }
        .md2-ci-val { color: #1a1a1a; font-weight: 600; text-align: right; word-break: break-all; }
        .md2-view-profile {
          display: block; width: 100%; margin-top: 12px; padding: 11px;
          text-align: center; font-size: 13px; font-weight: 700; color: #333;
          border: 1.5px solid #ddd; border-radius: 9px; background: #fff;
          text-decoration: none; cursor: pointer; font-family: inherit;
          transition: background 0.18s, border-color 0.18s;
        }
        .md2-view-profile:hover { background: #f8f8f8; border-color: #bbb; }

        /* ── Location Card ── */
        .md2-location-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .md2-location-card-title {
          font-size: 13px; font-weight: 800; color: #1a1a1a;
          margin: 0; padding: 14px 16px 10px; border-bottom: 1px solid #f0f0f0;
        }
        .md2-map-area {
          width: 100%; height: 160px; position: relative; overflow: hidden;
        }
        .md2-map-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: saturate(0.6) brightness(0.85);
        }
        .md2-map-overlay {
          position: absolute; inset: 0;
          background: rgba(11,138,107,0.15);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
        }
        .md2-map-place-name {
          font-size: 22px; font-weight: 900; color: #fff;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5); letter-spacing: -0.5px;
        }
        .md2-map-place-sub {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.85);
          text-shadow: 0 1px 6px rgba(0,0,0,0.4); letter-spacing: 1px; text-transform: uppercase;
        }
        .md2-map-pin-anim {
          position: absolute; top: 12px; right: 16px;
          animation: md2PinBounce 2s ease-in-out infinite;
        }
        @keyframes md2PinBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        .md2-location-info { padding: 10px 16px; }
        .md2-loc-name { font-size: 13px; font-weight: 700; color: #1a1a1a; margin: 0 0 2px; }
        .md2-loc-dist { font-size: 11.5px; color: #888; margin: 0 0 1px; }
        .md2-loc-city { font-size: 11.5px; color: #666; margin: 0 0 6px; }
        .md2-map-link {
          display: flex; align-items: center; justify-content: center; gap: 4px;
          font-size: 12.5px; font-weight: 600; color: #C0392B;
          text-decoration: none; border-top: 1px solid #f0f0f0;
          padding: 9px 16px; transition: background 0.18s;
        }
        .md2-map-link:hover { background: #fff5f5; }

        /* ── Posted By Card ── */
        .md2-posted-card {
          background: #fff; border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .md2-posted-card-title {
          font-size: 13px; font-weight: 800; color: #1a1a1a;
          margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;
        }
        .md2-poster-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .md2-poster-avatar {
          width: 46px; height: 46px; border-radius: 50%; object-fit: cover;
          border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.14); display: block;
          flex-shrink: 0;
        }
        .md2-poster-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 3px; }
        .md2-poster-rating { display: flex; align-items: center; gap: 5px; }
        .md2-poster-rnum { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .md2-poster-rcount { font-size: 11.5px; color: #888; }
        .md2-verified-tag {
          display: inline-flex; align-items: center; gap: 4px;
          background: #eafaf5; color: #0b8a6b; border: 1px solid #a8dfcf;
          font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
          margin-bottom: 12px;
        }
        .md2-send-msg {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 11px; border-radius: 9px;
          border: 1.5px solid #ddd; background: #fff; color: #333;
          font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: inherit; transition: background 0.18s;
        }
        .md2-send-msg:hover { background: #f5f5f5; }

        /* ── Similar Section ── */
        .md2-similar {
          max-width: 1180px; margin: 0 auto; padding: 22px 22px 0;
        }
        .md2-similar-hdr {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
        }
        .md2-similar-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .md2-similar-all {
          font-size: 13px; font-weight: 600; color: #C0392B;
          text-decoration: none; display: flex; align-items: center; gap: 3px;
        }
        .md2-similar-all:hover { text-decoration: underline; }
        .md2-similar-row {
          display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;
          scrollbar-width: thin; scrollbar-color: #ddd transparent;
        }
        .md2-similar-row::-webkit-scrollbar { height: 4px; }
        .md2-similar-row::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        .md2-sim-card {
          flex-shrink: 0; width: 160px; background: #fff; border-radius: 11px;
          overflow: hidden; border: 1.5px solid #ebebeb; text-decoration: none;
          display: flex; flex-direction: column; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s; position: relative;
        }
        .md2-sim-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.1); }
        .md2-sim-img-wrap { width: 100%; height: 100px; overflow: hidden; }
        .md2-sim-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .md2-sim-card:hover .md2-sim-img { transform: scale(1.08); }
        .md2-sim-body { padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 2px; }
        .md2-sim-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin: 0; }
        .md2-sim-company { font-size: 10.5px; color: #888; margin: 1px 0 0; }
        .md2-sim-loc { font-size: 10px; color: #aaa; margin: 2px 0 0; display: flex; align-items: center; gap: 2px; }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .md2-wrap { grid-template-columns: 1fr; }
          .md2-right { order: -1; }
          .md2-chips-row { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .md2-wrap { padding: 0 12px; margin-top: 10px; gap: 10px; }
          .md2-similar { padding: 16px 12px 0; }
          .md2-info-card { padding: 14px; }
          .md2-title { font-size: 17px; }
          .md2-fee { font-size: 18px; }
          .md2-chips-row { grid-template-columns: repeat(2, 1fr); }
          .md2-req-grid { grid-template-columns: 1fr; }
          .md2-hero-wrap { height: 200px; }
          .md2-cta-row { flex-direction: column; }
        }
      `}</style>

      <div className="md2-page">

        {/* ── Topbar ── */}
        <div className="md2-topbar">
          <div className="md2-topbar-inner">
            <nav className="md2-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="md2-bc-link">Home</Link>
              {listing.breadcrumbs.map((crumb, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="md2-bc-sep">›</span>
                  {i === listing.breadcrumbs.length - 1
                    ? <span className="md2-bc-cur">{crumb}</span>
                    : <Link href="/category/job" className="md2-bc-link">{crumb}</Link>
                  }
                </span>
              ))}
            </nav>
            <span className="md2-bc-cur" style={{ fontWeight: 700, color: "#333", fontSize: 13 }}>{listing.title}</span>
            <span className="md2-lid">Job ID: {listing.listingId}</span>
            <a href="#report" className="md2-report">Report This Job</a>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="md2-wrap">

          {/* ════════ LEFT ════════ */}
          <div className="md2-left">

            {/* Gallery */}
            <div className="md2-gallery">
              {/* Hero */}
              <div className="md2-hero-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.images[activeImg]} alt={listing.title} className="md2-hero-img" />
              </div>

              {/* Thumbs */}
              <div className="md2-thumbs-row">
                {thumbs.map((src, i) => (
                  <div
                    key={i}
                    className={`md2-thumb${activeImg === i ? " on" : ""}`}
                    onClick={() => setActiveImg(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View image ${i + 1}`}
                    onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" />
                    {i === 4 && extra > 0 && (
                      <div className="md2-thumb-more">+{extra}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Badge Row */}
              <div className="md2-badge-row">
                {listing.isVerified && (
                  <span className="md2-badge-verified">
                    <FiCheckCircle size={9} color="#1a7a43" />
                    Verified Listing
                  </span>
                )}
                {listing.isFeatured && (
                  <span className="md2-badge-featured">⭐ Featured</span>
                )}
                <div className="md2-badge-spacer" />
                <button className="md2-share-btn" onClick={handleShare} id="share-btn">
                  <FiShare2 size={13} color="#555" />
                  {copied ? "Copied!" : "Share"}
                </button>
                <button
                  className={`md2-save-btn${isFav ? " on" : ""}`}
                  onClick={() => setIsFav((v) => !v)}
                  id="save-btn"
                >
                  {isFav ? <FaHeart size={13} color="#e74c3c" /> : <FiHeart size={13} color="#888" />}
                  Save
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="md2-info-card">
              <h1 className="md2-title">{listing.title}</h1>
              <div className="md2-fee">{listing.fee}</div>

              {/* Meta */}
              <div className="md2-meta-row">
                <span className="md2-meta-item">
                  <FiMapPin size={11} color="#888" />
                  {listing.location}
                </span>
                <span className="md2-meta-item">
                  <FiBriefcase size={12} color="#888" />
                  {listing.type}
                </span>
                <span className="md2-meta-item">
                  <FiClock size={12} color="#bbb" />
                  Listed {listing.postedDaysAgo} day{listing.postedDaysAgo !== 1 ? "s" : ""} ago
                </span>
                <span className="md2-meta-item">
                  <FiEye size={12} color="#bbb" />
                  {listing.views} views
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="md2-cta-row">
                <button className="md2-btn-apply" id="apply-btn" onClick={() => setCallRevealed(true)}>
                  Apply Now
                </button>
                <button className="md2-btn-chat" id="chat-btn">
                  <FiMessageSquare size={14} color="#0d9488" style={{ marginRight: '5px' }} />
                  Chat with Provider
                </button>
              </div>

              {/* Stats Chips */}
              <div className="md2-chips-row">
                <div className="md2-chip">
                  <div className="md2-chip-icon">🏅</div>
                  <span className="md2-chip-val">{listing.experience}</span>
                  <span className="md2-chip-label">Experience</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">💼</div>
                  <span className="md2-chip-val">{listing.employmentType}</span>
                  <span className="md2-chip-label">Employment Type</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">🎓</div>
                  <span className="md2-chip-val">{listing.education}</span>
                  <span className="md2-chip-label">Education</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">👥</div>
                  <span className="md2-chip-val">{listing.vacancies} openings</span>
                  <span className="md2-chip-label">Vacancies</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">📅</div>
                  <span className="md2-chip-val" style={{ fontSize: 9 }}>{listing.postedDate}</span>
                  <span className="md2-chip-label">Posted</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md2-desc-card">
              <h2 className="md2-sec-title">Job Description</h2>
              <p className={`md2-desc-text${!showFull ? " clip" : ""}`}>{listing.description}</p>
              <button className="md2-see-more" onClick={() => setShowFull((v) => !v)} id="desc-toggle">
                {showFull ? "See Less" : "See More"}
              </button>
            </div>

            {/* Requirements + Benefits */}
            <div className="md2-req-card">
              <div className="md2-req-grid">
                <div className="md2-req-col">
                  <h2 className="md2-req-col-title">Requirements</h2>
                  {listing.requirements.map((r, i) => (
                    <div className="md2-req-item" key={i}>
                      <span className="md2-req-dot" />
                      {r}
                    </div>
                  ))}
                </div>
                <div className="md2-req-col">
                  <h2 className="md2-req-col-title">Benefits</h2>
                  {listing.benefits.map((b, i) => (
                    <div className="md2-req-item" key={i}>
                      <span className="md2-ben-dot" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ════════ RIGHT ════════ */}
          <div className="md2-right">

            {/* Company Information */}
            <div className="md2-company-card">
              <p className="md2-company-card-title">Company information</p>
              <div className="md2-company-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.company.logo} alt={listing.company.name} className="md2-company-logo" />
                <div>
                  <p className="md2-company-name">{listing.company.name}</p>
                  <div className="md2-company-rating">
                    <span className="md2-company-rnum">{listing.company.rating}</span>
                    <Stars rating={listing.company.rating} size={12} />
                    <span className="md2-company-rcount">({listing.company.reviewCount} Reviews)</span>
                  </div>
                </div>
              </div>
              <div className="md2-company-info">
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Industry</span>
                  <span className="md2-ci-val">{listing.company.industry}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Company Size</span>
                  <span className="md2-ci-val">{listing.company.size}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Website</span>
                  <span className="md2-ci-val" style={{ color: "#1a5fd4", fontSize: 11 }}>{listing.company.website}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Location</span>
                  <span className="md2-ci-val">{listing.company.location}</span>
                </div>
              </div>
              <button className="md2-view-profile" id="view-profile-btn">View Company Profile</button>
            </div>

            {/* Location */}
            <div className="md2-location-card" id="location">
              <p className="md2-location-card-title">Location</p>
              <div className="md2-map-area">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.mapImage} alt="Location" className="md2-map-img" />
                <div className="md2-map-overlay">
                  <span className="md2-map-place-name">{listing.mapCity.split(",")[0]}</span>
                  <span className="md2-map-place-sub">{listing.mapCity.split(",")[1]?.trim() || "Nepal"}</span>
                </div>
                <div className="md2-map-pin-anim">
                  <FiMapPin size={28} color="#C0392B" />
                </div>
              </div>
              <div className="md2-location-info">
                <p className="md2-loc-name">{listing.mapLocation}</p>
                <p className="md2-loc-dist">{listing.mapDistance}</p>
                <p className="md2-loc-city">{listing.mapCity}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(listing.mapLocation + " Nepal")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="md2-map-link"
              >
                <FiMapPin size={12} color="#0d9488" style={{ marginRight: '4px' }} />
                View on Map
              </a>
            </div>

            {/* Posted By */}
            <div className="md2-posted-card">
              <p className="md2-posted-card-title">Posted By</p>
              <div className="md2-poster-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.postedBy.avatar}
                  alt={listing.postedBy.name}
                  className="md2-poster-avatar"
                  onError={(e) => { e.currentTarget.src = "/hospital.png"; }}
                />
                <div>
                  <p className="md2-poster-name">{listing.postedBy.name}</p>
                  <div className="md2-poster-rating">
                    <span className="md2-poster-rnum">{listing.postedBy.rating}</span>
                    <Stars rating={listing.postedBy.rating} size={12} />
                    <span className="md2-poster-rcount">({listing.postedBy.reviewCount} Reviews)</span>
                  </div>
                </div>
              </div>
              {listing.postedBy.isVerified && (
                <div className="md2-verified-tag">
                  <FiCheckCircle size={10} color="#0b8a6b" style={{ marginRight: '4px' }} />
                  Verified Provider
                </div>
              )}
              <button className="md2-send-msg" id="send-msg-btn">
                <FiMail size={14} color="#555" style={{ marginRight: '5px' }} />
                Send Message
              </button>
            </div>

          </div>
        </div>

        {/* ── Similar Jobs ── */}
        <div className="md2-similar">
          <div className="md2-similar-hdr">
            <h2 className="md2-similar-title">Similar Jobs</h2>
            <Link href="/category/medical" className="md2-similar-all">
              View All
              <FiChevronRight size={12} color="#0d9488" />
            </Link>
          </div>
          <div className="md2-similar-row">
            {SIMILAR.filter((s) => s.id !== listing.id).map((sim) => (
              <Link key={sim.id} href={`/category/medical/${sim.id}`} className="md2-sim-card">
                <div className="md2-sim-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sim.image} alt={sim.title} className="md2-sim-img" />
                </div>
                <div className="md2-sim-body">
                  <p className="md2-sim-title">{sim.title}</p>
                  <p className="md2-sim-company">{sim.company}</p>
                  <p className="md2-sim-loc">
                    <FiMapPin size={8} color="#bbb" style={{ marginRight: '3px' }} />
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
