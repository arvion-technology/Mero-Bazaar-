"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";

// ─── Types ───────────────────────────────────────────────────────────────────

type JobDetail = {
  id: string;
  jobId: string;
  title: string;
  salary: string;
  location: string;
  distanceFrom: string;
  type: string;
  postedDaysAgo: number;
  views: number;
  experience: string;
  education: string;
  vacancies: number;
  postedDate: string;
  isVerified: boolean;
  isFeatured: boolean;
  breadcrumbs: string[];
  images: string[];
  description: string;
  requirements: string[];
  benefits: string[];
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
  postedBy: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
};

// ─── Data ────────────────────────────────────────────────────────────────────

const JOB_DATA: Record<string, JobDetail> = {
  "software-developer-frontend": {
    id: "software-developer-frontend",
    jobId: "#JOB784512",
    title: "Software Developer (Frontend)",
    salary: "Rs. 70,000–100,000/month",
    location: "Kathmandu, Nepal",
    distanceFrom: "2.5km from Lagankhe",
    type: "Full-Time",
    postedDaysAgo: 2,
    views: 36,
    experience: "1–2years",
    education: "Bachelor's",
    vacancies: 2,
    postedDate: "May 10, 2025",
    isVerified: true,
    isFeatured: true,
    breadcrumbs: ["Job", "It & Software"],
    images: ["/job1.jpg", "/job2.jpg", "/job3.jpg", "/job4.jpg", "/job5.jpg"],
    description:
      "We are looking for a passionate Frontend Developer to Build responsive, User-friendly Web Application using modern Technologies. You will work Closely with Designers and Backend developers to create amazing products. This is a great opportunity to work with a fast-growing technology company and gain hands-on experience with cutting-edge tools and frameworks. You will be part of an agile team and contribute to multiple exciting projects.",
    requirements: [
      "1–3 years of experience in HTML, CSS, JavaScript",
      "Responsive design skills",
      "Git & version control",
      "Good problem solving skills",
      "Bachelor's degree in CSE or related field",
      "Strong knowlwdge of React.js",
    ],
    benefits: [
      "Competitive Salary",
      "health Insurance",
      "Flexible working Hours",
      "Career Growth",
      "Friendly Enviroment",
      "Paid Leave",
    ],
    company: {
      name: "Aarovin Technology",
      logo: "/job1.jpg",
      rating: 4.6,
      reviewCount: 126,
      industry: "It & Software",
      size: "50–150 employees",
      website: "https://www.aarovintechnology.com/",
      location: "Kathmandu, Nepal",
    },
    postedBy: {
      name: "Anita KC",
      avatar: "/lady.jpg",
      rating: 4.8,
      reviewCount: 126,
      isVerified: true,
    },
  },
  "senior-backend-engineer": {
    id: "senior-backend-engineer",
    jobId: "#JOB123789",
    title: "Senior Backend Engineer",
    salary: "Rs. 1,20,000–1,80,000/month",
    location: "Lalitpur, Nepal",
    distanceFrom: "1.2km from Pulchowk",
    type: "Full-Time",
    postedDaysAgo: 1,
    views: 52,
    experience: "3–5years",
    education: "Bachelor's",
    vacancies: 1,
    postedDate: "May 12, 2025",
    isVerified: true,
    isFeatured: false,
    breadcrumbs: ["Job", "It & Software"],
    images: ["/job2.jpg", "/job3.jpg", "/job4.jpg", "/job5.jpg", "/job1.jpg"],
    description:
      "We are hiring a Senior Backend Engineer to design and build scalable backend systems using Node.js and cloud services. You will lead architecture decisions and mentor junior engineers.",
    requirements: [
      "3–5 years of backend experience",
      "Node.js, Python or Go expertise",
      "Database design (PostgreSQL, MongoDB)",
      "REST & GraphQL API design",
      "AWS or GCP experience",
      "Strong problem-solving skills",
    ],
    benefits: [
      "Premium Salary Package",
      "Full Health & Dental Insurance",
      "Remote-friendly",
      "Stock Options",
      "Annual Bonus",
      "Learning Budget",
    ],
    company: {
      name: "CloudNine Solutions",
      logo: "/job2.jpg",
      rating: 4.8,
      reviewCount: 89,
      industry: "It & Software",
      size: "100–300 employees",
      website: "https://www.cloudnine.com.np/",
      location: "Lalitpur, Nepal",
    },
    postedBy: {
      name: "Rohit Shrestha",
      avatar: "/lady.jpg",
      rating: 4.6,
      reviewCount: 74,
      isVerified: true,
    },
  },
};

const FALLBACK_JOB = JOB_DATA["software-developer-frontend"];

const SIMILAR_JOBS = [
  { id: "senior-backend-engineer", title: "Senior Backend Engineer", company: "CloudNine Solutions", salary: "Rs. 1,20,000/month", image: "/job2.jpg", type: "Full-Time" },
  { id: "ui-ux-designer", title: "UI/UX Designer", company: "Kreative Studio", salary: "Rs. 60,000/month", image: "/job3.jpg", type: "Full-Time" },
  { id: "marketing-manager", title: "Digital Marketing Manager", company: "Nexus Media", salary: "Rs. 80,000/month", image: "/job4.jpg", type: "Full-Time" },
  { id: "data-analyst", title: "Data Analyst", company: "DataSphere Nepal", salary: "Rs. 90,000/month", image: "/job5.jpg", type: "Remote" },
  { id: "devops-engineer", title: "DevOps Engineer", company: "TechBase Systems", salary: "Rs. 1,50,000/month", image: "/job1.jpg", type: "Full-Time" },
];

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#F39C12" : "none"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#F39C12" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const job = JOB_DATA[id] ?? FALLBACK_JOB;

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [applied, setApplied] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [favSimilar, setFavSimilar] = useState<Record<string, boolean>>({});

  const visibleThumbs = job.images.slice(0, 5);
  const extraCount = job.images.length - 5;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .jd-page {
          background: #f5f6f8; min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 64px;
        }

        /* TOP BAR */
        .jd-topbar { background: #fff; border-bottom: 1px solid #ececec; padding: 11px 0; }
        .jd-topbar-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .jd-breadcrumb { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; font-size: 12.5px; color: #888; }
        .jd-bc-link { color: #1a5fd4; text-decoration: none; font-weight: 500; transition: opacity 0.18s; }
        .jd-bc-link:hover { opacity: 0.75; text-decoration: underline; }
        .jd-bc-sep { color: #ccc; font-size: 11px; }
        .jd-bc-current { color: #555; font-weight: 500; }
        .jd-job-id { font-size: 12px; color: #999; font-weight: 500; }
        .jd-report { font-size: 12px; color: #e74c3c; font-weight: 600; text-decoration: none; transition: opacity 0.18s; }
        .jd-report:hover { opacity: 0.75; text-decoration: underline; }

        /* LAYOUT */
        .jd-container {
          max-width: 1200px; margin: 22px auto 0; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 330px;
          gap: 22px; align-items: start;
        }
        .jd-left { display: flex; flex-direction: column; gap: 16px; }

        /* IMAGE CARD */
        .jd-img-card {
          background: #fff; border-radius: 16px;
          overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .jd-main-img-wrap {
          position: relative; width: 100%; aspect-ratio: 16/9;
          overflow: hidden; background: #1a1a2e; cursor: zoom-in;
        }
        .jd-main-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease; display: block;
        }
        .jd-main-img-wrap:hover .jd-main-img { transform: scale(1.04); }

        /* Thumbnails */
        .jd-thumbs {
          display: flex; gap: 8px; padding: 10px 12px;
          overflow-x: auto; background: #fff; scrollbar-width: none;
        }
        .jd-thumbs::-webkit-scrollbar { display: none; }
        .jd-thumb-wrap {
          flex-shrink: 0; position: relative;
          width: 80px; height: 56px;
          border-radius: 8px; overflow: hidden; cursor: pointer;
          border: 2.5px solid transparent; transition: border-color 0.2s, transform 0.18s;
        }
        .jd-thumb-wrap:hover { transform: translateY(-2px); }
        .jd-thumb-wrap.active { border-color: #1a5fd4; }
        .jd-thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .jd-thumb-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.54);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 14px; font-weight: 800; font-family: 'Inter', sans-serif;
        }

        /* INFO CARD */
        .jd-info-card {
          background: #fff; border-radius: 16px;
          padding: 20px 22px 22px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .jd-badges-row { display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
        .jd-badge-verified {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eafaf1; color: #1e8449; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; letter-spacing: 0.3px; text-transform: uppercase;
        }
        .jd-badge-featured {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff8e1; color: #b7950b; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; letter-spacing: 0.3px; text-transform: uppercase;
        }
        .jd-title-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 10px; margin-bottom: 4px;
        }
        .jd-title {
          font-size: 20px; font-weight: 800; color: #1a1a1a;
          line-height: 1.3; margin: 0; flex: 1;
        }
        .jd-action-btns { display: flex; gap: 8px; flex-shrink: 0; margin-top: 2px; }
        .jd-action-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid #e0e0e0; background: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .jd-action-btn:hover { background: #f5f5f5; border-color: #ccc; transform: scale(1.1); }
        .jd-action-btn.fav-active { border-color: #e74c3c; background: #fff5f5; }

        .jd-salary { font-size: 22px; font-weight: 900; color: #1a1a1a; margin: 6px 0 2px; }
        .jd-meta-row {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          padding-bottom: 14px; border-bottom: 1px solid #f0f0f0;
          margin-bottom: 16px; font-size: 13px;
        }
        .jd-meta-item { display: flex; align-items: center; gap: 5px; color: #555; font-weight: 500; }
        .jd-meta-item svg { flex-shrink: 0; }
        .jd-meta-dot { width: 4px; height: 4px; background: #ddd; border-radius: 50%; }

        /* APPLY BUTTONS */
        .jd-cta-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .jd-btn-apply {
          flex: 1; min-width: 140px; padding: 12px 20px;
          background: linear-gradient(135deg, #1a5fd4 0%, #0d3d9e 100%);
          color: #fff; font-size: 14px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          font-family: inherit; display: flex; align-items: center;
          justify-content: center; gap: 7px;
          box-shadow: 0 4px 14px rgba(26,95,212,0.32);
          transition: opacity 0.2s, transform 0.15s;
        }
        .jd-btn-apply:hover { opacity: 0.9; transform: translateY(-1px); }
        .jd-btn-apply.applied { background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); box-shadow: 0 4px 14px rgba(39,174,96,0.32); }
        .jd-btn-chat {
          flex: 1; min-width: 140px; padding: 12px 20px;
          background: #fff; color: #1a5fd4; font-size: 14px; font-weight: 700;
          border: 1.5px solid #1a5fd4; border-radius: 10px; cursor: pointer;
          font-family: inherit; display: flex; align-items: center;
          justify-content: center; gap: 7px; transition: background 0.18s;
        }
        .jd-btn-chat:hover { background: #eef2ff; }

        /* JOB DETAILS CHIPS */
        .jd-specs-bar {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 8px; margin-bottom: 0;
        }
        .jd-spec-chip {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          background: #f8f9fb; border-radius: 10px; padding: 12px 6px 10px;
          border: 1px solid #eef0f3; text-align: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .jd-spec-chip:hover { background: #f0f2f8; border-color: #d9dde8; }
        .jd-spec-icon {
          width: 34px; height: 34px; display: flex; align-items: center;
          justify-content: center; background: #fff; border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }
        .jd-spec-val { font-size: 12px; font-weight: 800; color: #1a1a1a; line-height: 1.2; }
        .jd-spec-label { font-size: 10px; color: #999; font-weight: 500; }

        /* DESCRIPTION CARD */
        .jd-desc-card {
          background: #fff; border-radius: 16px;
          padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .jd-section-title { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; }
        .jd-desc-text { font-size: 13.5px; color: #444; line-height: 1.8; margin: 0; }
        .jd-desc-text.clamped {
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .jd-see-more {
          display: inline-block; margin-top: 8px;
          font-size: 13px; font-weight: 600; color: #1a5fd4;
          background: none; border: none; cursor: pointer;
          padding: 0; font-family: inherit; transition: opacity 0.18s;
        }
        .jd-see-more:hover { opacity: 0.72; }

        /* REQ & BENEFITS */
        .jd-req-benefits-card {
          background: #fff; border-radius: 16px;
          padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .jd-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .jd-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .jd-list li {
          font-size: 13px; color: #444; display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
        }
        .jd-list li::before {
          content: "•"; color: #1a5fd4; font-weight: 900;
          font-size: 16px; line-height: 1.2; flex-shrink: 0;
        }
        .jd-list.benefits li::before { color: #27ae60; }

        /* SIMILAR JOBS */
        .jd-similar-card {
          background: #fff; border-radius: 16px;
          padding: 0 0 20px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        .jd-similar-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 14px; border-bottom: 1px solid #f5f5f5;
        }
        .jd-similar-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .jd-similar-viewall { font-size: 13px; font-weight: 600; color: #1a5fd4; text-decoration: none; }
        .jd-similar-scroll {
          display: flex; gap: 12px; padding: 14px 16px 4px;
          overflow-x: auto; scrollbar-width: none;
        }
        .jd-similar-scroll::-webkit-scrollbar { display: none; }
        .jd-sim-card {
          flex-shrink: 0; width: 160px; background: #f8f9fb;
          border-radius: 12px; overflow: hidden; text-decoration: none;
          border: 1.5px solid #eee; transition: transform 0.2s, box-shadow 0.2s;
        }
        .jd-sim-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .jd-sim-img { width: 100%; height: 80px; object-fit: cover; display: block; }
        .jd-sim-body { padding: 8px 10px 10px; }
        .jd-sim-company { font-size: 10px; font-weight: 700; color: #1a5fd4; text-transform: uppercase; margin: 0 0 2px; }
        .jd-sim-title { font-size: 12px; font-weight: 700; color: #1a1a1a; margin: 0 0 4px; line-height: 1.3; }
        .jd-sim-type { font-size: 10px; font-weight: 600; color: #3b5bdb; background: #eef2ff; padding: 2px 6px; border-radius: 10px; }

        /* RIGHT COLUMN */
        .jd-right { display: flex; flex-direction: column; gap: 16px; }

        /* COMPANY CARD */
        .jd-company-card {
          background: #fff; border-radius: 16px;
          padding: 20px 18px; box-shadow: 0 2px 14px rgba(0,0,0,0.08);
          position: sticky; top: 80px;
        }
        .jd-company-card-title {
          font-size: 14px; font-weight: 800; color: #1a1a1a;
          margin: 0 0 14px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;
        }
        .jd-company-logo-wrap {
          width: 56px; height: 56px; border-radius: 12px; overflow: hidden;
          border: 1.5px solid #eee; flex-shrink: 0;
        }
        .jd-company-logo { width: 100%; height: 100%; object-fit: cover; display: block; }
        .jd-company-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .jd-company-name { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px; }
        .jd-rating-row { display: flex; align-items: center; gap: 5px; }
        .jd-rating-num { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .jd-reviews { font-size: 11.5px; color: #888; }

        .jd-company-info { border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin-bottom: 14px; }
        .jd-ci-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 9px 0; border-bottom: 1px solid #f8f8f8;
          font-size: 12.5px; gap: 6px;
        }
        .jd-ci-row:last-child { border-bottom: none; }
        .jd-ci-label { color: #777; font-weight: 500; flex-shrink: 0; }
        .jd-ci-val { color: #1a1a1a; font-weight: 600; text-align: right; word-break: break-word; }
        .jd-ci-val a { color: #1a5fd4; text-decoration: none; }
        .jd-ci-val a:hover { text-decoration: underline; }

        .jd-btn-profile {
          width: 100%; padding: 11px;
          background: #fff; color: #1a5fd4; font-size: 13.5px; font-weight: 700;
          border: 1.5px solid #1a5fd4; border-radius: 10px; cursor: pointer;
          font-family: inherit; transition: background 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .jd-btn-profile:hover { background: #eef2ff; }

        /* MAP CARD */
        .jd-map-card {
          background: #fff; border-radius: 16px;
          overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.08);
        }
        .jd-map-card-title {
          font-size: 14px; font-weight: 800; color: #1a1a1a;
          margin: 0; padding: 16px 18px 12px; border-bottom: 1px solid #f0f0f0;
        }
        .jd-map-img-wrap { position: relative; height: 130px; overflow: hidden; }
        .jd-map-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .jd-map-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 10px 14px;
        }
        .jd-map-area { font-size: 13px; font-weight: 700; color: #fff; margin: 0; }
        .jd-map-dist { font-size: 11.5px; color: rgba(255,255,255,0.8); }
        .jd-map-city { font-size: 12px; color: #555; padding: 10px 18px 4px; font-weight: 500; }
        .jd-map-link {
          display: inline-flex; align-items: center; gap: 4px;
          color: #1a5fd4; font-size: 12.5px; font-weight: 600;
          text-decoration: none; padding: 4px 18px 14px;
          transition: opacity 0.18s;
        }
        .jd-map-link:hover { opacity: 0.75; }

        /* POSTED BY CARD */
        .jd-postedby-card {
          background: #fff; border-radius: 16px;
          padding: 18px; box-shadow: 0 2px 14px rgba(0,0,0,0.08);
        }
        .jd-postedby-title {
          font-size: 14px; font-weight: 800; color: #1a1a1a;
          margin: 0 0 14px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;
        }
        .jd-poster-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .jd-poster-avatar-wrap { position: relative; flex-shrink: 0; }
        .jd-poster-avatar {
          width: 52px; height: 52px; border-radius: 50%; object-fit: cover;
          border: 2.5px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.14); display: block;
        }
        .jd-poster-online {
          position: absolute; bottom: 2px; right: 2px;
          width: 11px; height: 11px; border-radius: 50%;
          background: #27ae60; border: 2px solid #fff;
        }
        .jd-poster-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 3px; }
        .jd-poster-badge {
          display: inline-flex; align-items: center; gap: 4px;
          background: #eafaf1; color: #1e8449; font-size: 10.5px; font-weight: 700;
          padding: 2px 8px; border-radius: 20px; border: 1px solid #a9dfbf;
        }
        .jd-btn-msg {
          width: 100%; padding: 11px;
          background: #fff; color: #555; font-size: 13.5px; font-weight: 700;
          border: 1.5px solid #e0e0e0; border-radius: 10px; cursor: pointer;
          font-family: inherit; transition: background 0.18s, border-color 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 2px;
        }
        .jd-btn-msg:hover { background: #f5f5f5; border-color: #ccc; }
        .jd-btn-msg.sent { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .jd-container { grid-template-columns: 1fr; }
          .jd-right { position: static; }
          .jd-two-col { grid-template-columns: 1fr; }
          .jd-specs-bar { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .jd-container { padding: 0 14px; margin-top: 14px; }
          .jd-specs-bar { grid-template-columns: repeat(2, 1fr); }
          .jd-cta-row { flex-direction: column; }
        }
      `}</style>

      <div className="jd-page">
        {/* TOP BAR */}
        <div className="jd-topbar">
          <div className="jd-topbar-inner">
            <nav className="jd-breadcrumb">
              <Link href="/" className="jd-bc-link">Home</Link>
              <span className="jd-bc-sep">›</span>
              <Link href="/category/job" className="jd-bc-link">Job</Link>
              {job.breadcrumbs.map((bc) => (
                <span key={bc} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span className="jd-bc-sep">›</span>
                  <span className="jd-bc-current">{bc}</span>
                </span>
              ))}
              <span className="jd-bc-sep">›</span>
              <span className="jd-bc-current">{job.title}</span>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="jd-job-id">Job ID: {job.jobId}</span>
              <a href="#" className="jd-report">Report This Job</a>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="jd-container">
          {/* LEFT */}
          <div className="jd-left">
            {/* IMAGE GALLERY */}
            <div className="jd-img-card">
              <div className="jd-main-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={job.images[activeImg]} alt={job.title} className="jd-main-img" />
              </div>
              <div className="jd-thumbs">
                {visibleThumbs.map((img, i) => (
                  <div
                    key={i}
                    className={`jd-thumb-wrap${activeImg === i ? " active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Thumb ${i + 1}`} className="jd-thumb-img" />
                    {i === 4 && extraCount > 0 && (
                      <div className="jd-thumb-overlay">+{extraCount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* INFO */}
            <div className="jd-info-card">
              <div className="jd-badges-row">
                {job.isVerified && (
                  <span className="jd-badge-verified">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#1e8449" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Verified Job
                  </span>
                )}
                {job.isFeatured && <span className="jd-badge-featured">⭐ Featured</span>}
              </div>

              <div className="jd-title-row">
                <h1 className="jd-title">{job.title}</h1>
                <div className="jd-action-btns">
                  <button
                    className={`jd-action-btn${isFav ? " fav-active" : ""}`}
                    onClick={() => setIsFav(!isFav)}
                    aria-label="Save job"
                    title="Save"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isFav ? "#E74C3C" : "none"}>
                      <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z" stroke={isFav ? "#E74C3C" : "#999"} strokeWidth="1.8" />
                    </svg>
                  </button>
                  <button
                    className="jd-action-btn"
                    aria-label="Share job"
                    title="Share"
                    onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="18" cy="5" r="3" stroke="#666" strokeWidth="1.8"/>
                      <circle cx="6" cy="12" r="3" stroke="#666" strokeWidth="1.8"/>
                      <circle cx="18" cy="19" r="3" stroke="#666" strokeWidth="1.8"/>
                      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="#666" strokeWidth="1.8"/>
                    </svg>
                  </button>
                </div>
              </div>

              <p className="jd-salary">{job.salary}</p>

              <div className="jd-meta-row">
                <span className="jd-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#bbb"/></svg>
                  {job.location}
                </span>
                <span className="jd-meta-dot" />
                <span className="jd-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#bbb" strokeWidth="1.8"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#bbb" strokeWidth="1.8"/></svg>
                  {job.type}
                </span>
                <span className="jd-meta-dot" />
                <span className="jd-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#bbb" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  Posted {job.postedDaysAgo} Day{job.postedDaysAgo > 1 ? "s" : ""} ago
                </span>
                <span className="jd-meta-dot" />
                <span className="jd-meta-item" style={{ color: "#aaa" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#bbb" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="#bbb" strokeWidth="1.8"/></svg>
                  {job.views} views
                </span>
              </div>

              {/* CTA BUTTONS */}
              <div className="jd-cta-row" style={{ marginBottom: "18px" }}>
                <button
                  className={`jd-btn-apply${applied ? " applied" : ""}`}
                  onClick={() => setApplied(!applied)}
                >
                  {applied ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Applied!</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Apply Now</>
                  )}
                </button>
                <button className="jd-btn-chat">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#1a5fd4" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                  Chat with Employer
                </button>
              </div>

              {/* SPECS */}
              <div className="jd-specs-bar">
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#1a5fd4" strokeWidth="1.8"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#1a5fd4" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <span className="jd-spec-val">{job.experience}</span>
                  <span className="jd-spec-label">Experience</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#1a5fd4" strokeWidth="1.8"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#1a5fd4" strokeWidth="1.8"/></svg>
                  </div>
                  <span className="jd-spec-val">{job.type}</span>
                  <span className="jd-spec-label">Employment Type</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-7 10 7M5 19.5V10.3M19 19.5V10.3" stroke="#1a5fd4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="jd-spec-val">{job.education}</span>
                  <span className="jd-spec-label">Education</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#1a5fd4" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="#1a5fd4" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#1a5fd4" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <span className="jd-spec-val">{job.vacancies} openings</span>
                  <span className="jd-spec-label">Vacancies</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#1a5fd4" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#1a5fd4" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <span className="jd-spec-val">{job.postedDate}</span>
                  <span className="jd-spec-label">Posted</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="jd-desc-card">
              <h2 className="jd-section-title">Job Description</h2>
              <p className={`jd-desc-text${showFull ? "" : " clamped"}`}>{job.description}</p>
              <button className="jd-see-more" onClick={() => setShowFull(!showFull)}>
                {showFull ? "See Less" : "See More"}
              </button>
            </div>

            {/* REQUIREMENTS & BENEFITS */}
            <div className="jd-req-benefits-card">
              <div className="jd-two-col">
                <div>
                  <h2 className="jd-section-title">Requirements</h2>
                  <ul className="jd-list">
                    {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <h2 className="jd-section-title">Benefits</h2>
                  <ul className="jd-list benefits">
                    {job.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* SIMILAR JOBS */}
            <div className="jd-similar-card">
              <div className="jd-similar-head">
                <p className="jd-similar-title">Similar Jobs</p>
                <Link href="/category/job" className="jd-similar-viewall">View All</Link>
              </div>
              <div className="jd-similar-scroll">
                {SIMILAR_JOBS.map((s) => (
                  <Link key={s.id} href={`/category/job/${s.id}`} className="jd-sim-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.title} className="jd-sim-img" />
                    <div className="jd-sim-body">
                      <p className="jd-sim-company">{s.company}</p>
                      <p className="jd-sim-title">{s.title}</p>
                      <span className="jd-sim-type">{s.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="jd-right">
            {/* COMPANY CARD */}
            <div className="jd-company-card">
              <p className="jd-company-card-title">Company information</p>
              <div className="jd-company-top">
                <div className="jd-company-logo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={job.company.logo} alt={job.company.name} className="jd-company-logo" />
                </div>
                <div>
                  <p className="jd-company-name">{job.company.name}</p>
                  <div className="jd-rating-row">
                    <span className="jd-rating-num">{job.company.rating}</span>
                    <StarRating rating={job.company.rating} />
                    <span className="jd-reviews">({job.company.reviewCount} Reviews)</span>
                  </div>
                </div>
              </div>
              <div className="jd-company-info">
                <div className="jd-ci-row">
                  <span className="jd-ci-label">Industry</span>
                  <span className="jd-ci-val">{job.company.industry}</span>
                </div>
                <div className="jd-ci-row">
                  <span className="jd-ci-label">Company Size</span>
                  <span className="jd-ci-val">{job.company.size}</span>
                </div>
                <div className="jd-ci-row">
                  <span className="jd-ci-label">Website</span>
                  <span className="jd-ci-val">
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                      {job.company.website.replace("https://", "")}
                    </a>
                  </span>
                </div>
                <div className="jd-ci-row">
                  <span className="jd-ci-label">Location</span>
                  <span className="jd-ci-val">{job.company.location}</span>
                </div>
              </div>
              <button className="jd-btn-profile">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#1a5fd4" strokeWidth="1.8"/><path d="M8 12h8M12 8v8" stroke="#1a5fd4" strokeWidth="1.8" strokeLinecap="round"/></svg>
                View Company Profile
              </button>
            </div>

            {/* MAP CARD */}
            <div className="jd-map-card">
              <p className="jd-map-card-title">Location</p>
              <div className="jd-map-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/job2.jpg" alt="Map" className="jd-map-img" />
                <div className="jd-map-overlay">
                  <p className="jd-map-area">Lalitpur</p>
                  <span className="jd-map-dist">{job.distanceFrom}</span>
                </div>
              </div>
              <p className="jd-map-city">Lalitpur, Nepal</p>
              <a href="#" className="jd-map-link">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1a5fd4"/></svg>
                View on Map
              </a>
            </div>

            {/* POSTED BY CARD */}
            <div className="jd-postedby-card">
              <p className="jd-postedby-title">Posted By</p>
              <div className="jd-poster-top">
                <div className="jd-poster-avatar-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={job.postedBy.avatar} alt={job.postedBy.name} className="jd-poster-avatar" />
                  <span className="jd-poster-online" />
                </div>
                <div>
                  <p className="jd-poster-name">{job.postedBy.name}</p>
                  <div className="jd-rating-row" style={{ marginBottom: "5px" }}>
                    <span className="jd-rating-num">{job.postedBy.rating}</span>
                    <StarRating rating={job.postedBy.rating} />
                    <span className="jd-reviews">({job.postedBy.reviewCount} Reviews)</span>
                  </div>
                  {job.postedBy.isVerified && (
                    <span className="jd-poster-badge">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#1e8449" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Verified employer
                    </span>
                  )}
                </div>
              </div>
              <button
                className={`jd-btn-msg${msgSent ? " sent" : ""}`}
                onClick={() => setMsgSent(!msgSent)}
              >
                {msgSent ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#1e8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Message Sent!</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#555" strokeWidth="1.8" strokeLinejoin="round"/></svg> Send Message</>
                )}
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
