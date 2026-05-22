"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";

// ─── Data ───────────────────────────────────────────────────────────────────

const LISTING_DATA: Record<string, ListingDetail> = {
  "toyota-land-cruiser-prado-2020": {
    id: "toyota-land-cruiser-prado-2020",
    listingId: "#VH765812",
    title: "Toypta land Cruiser Prado TXL 2020",
    price: "Rs. 1,50,00,000",
    negotiable: true,
    location: "Lalitpur, Bagmati",
    distanceFrom: "2.5km from Lagankhe",
    postedDaysAgo: 2,
    driven: "15,000km",
    isVerified: true,
    category: "Cars",
    breadcrumbs: ["Vehicles", "Cars", "Tyota"],
    images: ["/car1.jpg", "/car2.jpg", "/car3.jpg", "/car4.jpg", "/car5.jpg", "/car6.jpg", "/car7.jpg", "/car8.jpg"],
    description: "Excellent condition Toyota Land Cruiser Pardo TXL 2020 for sale . Well maintained, origional paints, full service from authorized service center Luxury SUV with powerful performance and premium cofort. This vehicle has been meticulously maintained with full service history. All original parts, never been in an accident. Ready to drive. Serious buyers only please.",
    specs: {
      make: "Toyota",
      model: "Land Cruiser Parda",
      year: "2020",
      fuel: "Diesel",
      transmission: "Automatic",
      driven: "15,000km",
    },
    details: {
      driveType: "4WD",
      bodyType: "SUV",
      exteriorColor: "Black",
      mileage: "15000km",
      interiorColor: "Beige",
      fuelType: "Diesel",
      ownership: "1st Owner",
      transmission: "Automatic",
      registration: "Bagmati,2020",
      engine: "2755cc",
    },
    seller: {
      name: "Riya Shah",
      avatar: "/lady.jpg",
      rating: 4.8,
      reviewCount: 26,
      isVerified: true,
      isPro: true,
      isTrusted: true,
      memberSince: "Jan2022",
      totalListing: 24,
      responseRate: "98%",
      avgResponseTime: "10min",
      phone: "+977-9841000000",
    },
  },
  "hundai-creta-2022": {
    id: "hundai-creta-2022",
    listingId: "#VH123456",
    title: "Hundai Creta 2022",
    price: "Rs. 32,50,000",
    negotiable: true,
    location: "Kathmandu, Bagmati",
    distanceFrom: "1.2km from city center",
    postedDaysAgo: 5,
    driven: "8,200km",
    isVerified: true,
    category: "Cars",
    breadcrumbs: ["Vehicles", "Cars", "Hyundai"],
    images: ["/Hundai Creta 2022.jpg", "/car3.jpg", "/car5.jpg", "/car7.jpg"],
    description: "Well maintained Hyundai Creta 2022 in excellent condition. Single owner, all service records available. Fuel efficient and comfortable for city and highway driving.",
    specs: {
      make: "Hyundai",
      model: "Creta",
      year: "2022",
      fuel: "Petrol",
      transmission: "Automatic",
      driven: "8,200km",
    },
    details: {
      driveType: "FWD",
      bodyType: "SUV",
      exteriorColor: "White",
      mileage: "8200km",
      interiorColor: "Black",
      fuelType: "Petrol",
      ownership: "1st Owner",
      transmission: "Automatic",
      registration: "Bagmati,2022",
      engine: "1497cc",
    },
    seller: {
      name: "Ram Sharma",
      avatar: "/lady.jpg",
      rating: 4.5,
      reviewCount: 12,
      isVerified: true,
      isPro: false,
      isTrusted: true,
      memberSince: "Mar2021",
      totalListing: 8,
      responseRate: "95%",
      avgResponseTime: "20min",
      phone: "+977-9841000001",
    },
  },
  "bajaj-pulsar": {
    id: "bajaj-pulsar",
    listingId: "#VH654321",
    title: "Bajaj Pulsar N160 Dual Channel",
    price: "Rs. 3,25,000",
    negotiable: false,
    location: "Kathmandu, Bagmati",
    distanceFrom: "0.8km from center",
    postedDaysAgo: 1,
    driven: "12,000km",
    isVerified: true,
    category: "Bikes",
    breadcrumbs: ["Vehicles", "Bikes", "Bajaj"],
    images: ["/bajaj.avif", "/car6.jpg", "/car8.jpg"],
    description: "Bajaj Pulsar N160 Dual Channel ABS in pristine condition. Powerful 160cc engine, dual channel ABS, great mileage. Perfect for daily commute and weekend rides.",
    specs: {
      make: "Bajaj",
      model: "Pulsar N160",
      year: "2023",
      fuel: "Petrol",
      transmission: "Manual",
      driven: "12,000km",
    },
    details: {
      driveType: "Chain",
      bodyType: "Naked Bike",
      exteriorColor: "Red",
      mileage: "12000km",
      interiorColor: "N/A",
      fuelType: "Petrol",
      ownership: "1st Owner",
      transmission: "Manual 6-Speed",
      registration: "Bagmati,2023",
      engine: "160cc",
    },
    seller: {
      name: "Sita Poudel",
      avatar: "/lady.jpg",
      rating: 4.2,
      reviewCount: 8,
      isVerified: true,
      isPro: false,
      isTrusted: false,
      memberSince: "Jun2023",
      totalListing: 3,
      responseRate: "90%",
      avgResponseTime: "30min",
      phone: "+977-9841000002",
    },
  },
};

// Fallback for unknown listing IDs - pull from any known data
const FALLBACK_LISTING: ListingDetail = LISTING_DATA["toyota-land-cruiser-prado-2020"];

const RELATED_LISTINGS = [
  { id: "hundai-creta-2022", title: "Hundai Creta 2022", price: "Rs. 32,50,000", location: "Kathmandu", image: "/Hundai Creta 2022.jpg", verified: true },
  { id: "harley-davidson", title: "Harley-Davidson", price: "Rs. 2,00,000", location: "Kathmandu", image: "/Harley-Davidson.jpg", verified: true },
  { id: "bajaj-pulsar", title: "Bajaj Pulsar N160", price: "Rs. 3,25,000", location: "Pokhara", image: "/bajaj.avif", verified: true },
  { id: "scooter", title: "Honda Scooter", price: "Rs. 32,000", location: "Kathmandu", image: "/Scooter.jpg", verified: false },
  { id: "toyota-hiace", title: "Toyota HiAce Van", price: "Rs. 45,00,000", location: "Lalitpur", image: "/Hundai Creta 2022.jpg", verified: false },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type ListingDetail = {
  id: string;
  listingId: string;
  title: string;
  price: string;
  negotiable: boolean;
  location: string;
  distanceFrom: string;
  postedDaysAgo: number;
  driven: string;
  isVerified: boolean;
  category: string;
  breadcrumbs: string[];
  images: string[];
  description: string;
  specs: {
    make: string;
    model: string;
    year: string;
    fuel: string;
    transmission: string;
    driven: string;
  };
  details: {
    driveType: string;
    bodyType: string;
    exteriorColor: string;
    mileage: string;
    interiorColor: string;
    fuelType: string;
    ownership: string;
    transmission: string;
    registration: string;
    engine: string;
  };
  seller: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    isPro: boolean;
    isTrusted: boolean;
    memberSince: string;
    totalListing: number;
    responseRate: string;
    avgResponseTime: string;
    phone: string;
  };
};

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="ld-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#F39C12" : "none"}>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="#F39C12"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ListingDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const listing = LISTING_DATA[id] ?? FALLBACK_LISTING;

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [callRevealed, setCallRevealed] = useState(false);
  const [favRelated, setFavRelated] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const visibleThumbs = listing.images.slice(0, 5);
  const extraCount = listing.images.length - 5;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ld-page {
          background: #f5f6f8;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 64px;
        }

        /* ── Top Bar ── */
        .ld-topbar {
          background: #fff;
          border-bottom: 1px solid #ececec;
          padding: 11px 0;
        }
        .ld-topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* ── Breadcrumb ── */
        .ld-breadcrumb {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
          font-size: 12.5px;
          color: #888;
        }
        .ld-bc-link {
          color: #C0392B;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.18s;
        }
        .ld-bc-link:hover { opacity: 0.75; text-decoration: underline; }
        .ld-bc-sep { color: #ccc; font-size: 11px; }
        .ld-bc-current { color: #555; font-weight: 500; }
        .ld-listing-id {
          font-size: 12px;
          color: #999;
          font-weight: 500;
          white-space: nowrap;
        }
        .ld-report {
          font-size: 12px;
          color: #C0392B;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.18s;
          white-space: nowrap;
        }
        .ld-report:hover { opacity: 0.75; text-decoration: underline; }

        /* ── Main layout ── */
        .ld-container {
          max-width: 1200px;
          margin: 22px auto 0;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 330px;
          gap: 22px;
          align-items: start;
        }
        .ld-left { display: flex; flex-direction: column; gap: 16px; }

        /* ── Image Card ── */
        .ld-img-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .ld-main-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #1a1a2e;
          cursor: zoom-in;
        }
        .ld-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
          display: block;
        }
        .ld-main-img-wrap:hover .ld-main-img { transform: scale(1.04); }

        /* Thumbnails */
        .ld-thumbs {
          display: flex;
          gap: 8px;
          padding: 10px 12px;
          overflow-x: auto;
          background: #fff;
          scrollbar-width: none;
        }
        .ld-thumbs::-webkit-scrollbar { display: none; }
        .ld-thumb-wrap {
          flex-shrink: 0;
          position: relative;
          width: 80px;
          height: 56px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2.5px solid transparent;
          transition: border-color 0.2s, transform 0.18s;
        }
        .ld-thumb-wrap:hover { transform: translateY(-2px); }
        .ld-thumb-wrap.active { border-color: #C0392B; }
        .ld-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ld-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.54);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
        }

        /* ── Info Card ── */
        .ld-info-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 22px 22px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .ld-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #eafaf1;
          color: #1e8449;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 5px;
          margin-bottom: 10px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .ld-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 4px;
        }
        .ld-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.3;
          margin: 0;
          flex: 1;
        }
        .ld-action-btns {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ld-action-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          position: relative;
        }
        .ld-action-btn:hover { background: #f5f5f5; border-color: #ccc; transform: scale(1.1); }
        .ld-action-btn.fav-active { border-color: #e74c3c; background: #fff5f5; }
        .ld-price {
          font-size: 24px;
          font-weight: 900;
          color: #1a1a1a;
          margin: 6px 0 2px;
        }
        .ld-negotiable {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          color: #888;
          background: #f5f5f5;
          border-radius: 5px;
          padding: 2px 8px;
          margin-bottom: 10px;
        }

        /* Meta row */
        .ld-meta-row {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 16px;
          font-size: 13px;
        }
        .ld-loc {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #555;
          font-weight: 500;
        }
        .ld-driven-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #888;
          font-weight: 400;
        }
        .ld-posted {
          color: #aaa;
          font-size: 12px;
        }
        .ld-map-link {
          color: #C0392B;
          font-size: 12.5px;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 3px;
          margin-left: auto;
          transition: opacity 0.18s;
        }
        .ld-map-link:hover { opacity: 0.75; }

        /* ── Specs Bar ── */
        .ld-specs-bar {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .ld-spec-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          background: #f8f9fb;
          border-radius: 10px;
          padding: 10px 6px 9px;
          border: 1px solid #eef0f3;
          text-align: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .ld-spec-chip:hover { background: #f0f2f8; border-color: #d9dde8; }
        .ld-spec-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }
        .ld-spec-val {
          font-size: 12px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.2;
        }
        .ld-spec-label {
          font-size: 10px;
          color: #999;
          font-weight: 500;
        }

        /* ── Description Card ── */
        .ld-desc-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 22px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .ld-section-title {
          font-size: 16px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 11px;
        }
        .ld-desc-text {
          font-size: 13.5px;
          color: #444;
          line-height: 1.8;
          margin: 0;
        }
        .ld-desc-text.clamped {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ld-see-more {
          display: inline-block;
          margin-top: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #2980b9;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          transition: opacity 0.18s;
        }
        .ld-see-more:hover { opacity: 0.72; }

        /* ── Details Card ── */
        .ld-details-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 22px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.07);
          border-top: 3px solid #C0392B;
        }
        .ld-details-grid {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
        }
        .ld-details-col { display: flex; flex-direction: column; }
        .ld-details-divider { background: #f0f0f0; margin: 0 22px; }
        .ld-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f5f5f5;
          font-size: 13px;
          gap: 10px;
        }
        .ld-detail-row:last-child { border-bottom: none; }
        .ld-detail-label { color: #777; font-weight: 400; }
        .ld-detail-val { color: #1a1a1a; font-weight: 700; text-align: right; }

        /* ── RIGHT COLUMN ── */
        .ld-right { display: flex; flex-direction: column; gap: 16px; }

        /* ── Seller Card ── */
        .ld-seller-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 18px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.08);
          position: sticky;
          top: 80px;
        }
        .ld-seller-card-title {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        .ld-seller-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .ld-seller-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .ld-seller-avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.14);
          display: block;
        }
        .ld-avatar-placeholder {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C0392B 0%, #8e1c10 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.14);
        }
        .ld-seller-online {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #27ae60;
          border: 2px solid #fff;
        }
        .ld-seller-name {
          font-size: 16px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 4px;
        }
        .ld-rating-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ld-rating-num {
          font-size: 13.5px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .ld-stars { display: flex; gap: 2px; }
        .ld-reviews { font-size: 11.5px; color: #888; }

        /* Seller badges */
        .ld-seller-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 14px;
        }
        .ld-sbadge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .ld-sbadge-verified { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
        .ld-sbadge-pro { background: #fef9e7; color: #b7950b; border: 1px solid #f9e79f; }
        .ld-sbadge-trusted { background: #f4ecf7; color: #7d3c98; border: 1px solid #d7bde2; }

        /* Stats */
        .ld-seller-stats {
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 14px;
        }
        .ld-stat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f8f8f8;
          font-size: 12.5px;
        }
        .ld-stat-row:last-child { border-bottom: none; }
        .ld-stat-label { color: #777; }
        .ld-stat-val { color: #1a1a1a; font-weight: 700; }

        /* CTA buttons */
        .ld-cta-btns { display: flex; flex-direction: column; gap: 8px; }
        .ld-btn-call {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(39,174,96,0.32);
          transition: opacity 0.2s, transform 0.15s;
        }
        .ld-btn-call:hover { opacity: 0.9; transform: translateY(-1px); }
        .ld-btn-chat {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #8e44ad 0%, #6c3483 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(142,68,173,0.28);
          transition: opacity 0.2s, transform 0.15s;
        }
        .ld-btn-chat:hover { opacity: 0.9; transform: translateY(-1px); }
        .ld-btn-msg {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          color: #333;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-family: inherit;
          transition: background 0.18s, border-color 0.18s;
        }
        .ld-btn-msg:hover { background: #f5f5f5; border-color: #ccc; }

        /* ── Location Card ── */
        .ld-location-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 14px rgba(0,0,0,0.08);
        }
        .ld-location-card-title {
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
          padding: 16px 18px 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        .ld-map-area {
          width: 100%;
          height: 185px;
          position: relative;
          overflow: hidden;
          background: #e8efe8;
        }
        .ld-map-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .ld-map-pin-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -100%) translateY(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: mapPinBounce 2s ease-in-out infinite;
          z-index: 5;
        }
        @keyframes mapPinBounce {
          0%, 100% { transform: translate(-50%, -100%) translateY(4px); }
          50%       { transform: translate(-50%, -100%) translateY(-2px); }
        }
        .ld-map-label {
          background: #1a1a1a;
          color: #fff;
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 5px;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(0,0,0,0.35);
          margin-top: 3px;
        }
        .ld-map-label::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-bottom-color: #1a1a1a;
        }
        .ld-map-zoom {
          position: absolute;
          right: 10px;
          bottom: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 5;
        }
        .ld-map-zoom-btn {
          width: 26px;
          height: 26px;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: #444;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          line-height: 1;
          transition: background 0.15s;
        }
        .ld-map-zoom-btn:hover { background: #f5f5f5; }
        .ld-map-credit {
          position: absolute;
          bottom: 2px;
          left: 8px;
          font-size: 9px;
          color: #888;
          z-index: 5;
        }
        .ld-location-info {
          padding: 12px 18px;
        }
        .ld-location-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 3px;
        }
        .ld-location-dist {
          font-size: 12px;
          color: #888;
          margin: 0 0 6px;
        }
        .ld-location-extra {
          font-size: 12.5px;
          color: #555;
          margin: 0 0 8px;
        }
        .ld-map-view-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          border-top: 1px solid #f0f0f0;
          padding: 10px 18px;
          transition: background 0.18s;
        }
        .ld-map-view-link:hover { background: #fff5f5; }

        /* ── Related Listings ── */
        .ld-related-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 24px 0;
        }
        .ld-related-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .ld-related-title {
          font-size: 18px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
        }
        .ld-related-viewall {
          font-size: 13px;
          font-weight: 600;
          color: #C0392B;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 3px;
          transition: opacity 0.18s;
        }
        .ld-related-viewall:hover { opacity: 0.75; }
        .ld-related-scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 10px;
          scrollbar-width: thin;
          scrollbar-color: #ddd transparent;
        }
        .ld-related-scroll::-webkit-scrollbar { height: 4px; }
        .ld-related-scroll::-webkit-scrollbar-track { background: transparent; }
        .ld-related-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        .ld-rel-card {
          flex-shrink: 0;
          width: 168px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid #ebebeb;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          position: relative;
        }
        .ld-rel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.1);
          border-color: #ddd;
        }
        .ld-rel-img-wrap {
          width: 100%;
          height: 112px;
          overflow: hidden;
          position: relative;
        }
        .ld-rel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s;
        }
        .ld-rel-card:hover .ld-rel-img { transform: scale(1.07); }
        .ld-rel-heart {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          z-index: 3;
          padding: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.14);
          transition: transform 0.18s;
        }
        .ld-rel-heart:hover { transform: scale(1.18); }
        .ld-rel-badge {
          position: absolute;
          bottom: 7px;
          left: 7px;
          background: #27ae60;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .ld-rel-body {
          padding: 9px 10px 11px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .ld-rel-name {
          font-size: 12px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }
        .ld-rel-price {
          font-size: 12.5px;
          font-weight: 800;
          color: #C0392B;
          margin: 2px 0 0;
        }
        .ld-rel-loc {
          font-size: 10.5px;
          color: #aaa;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        /* ── Tooltip ── */
        .ld-tooltip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 10;
        }
        .ld-action-btn:hover .ld-tooltip { opacity: 1; }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .ld-container {
            grid-template-columns: 1fr;
          }
          .ld-seller-card { position: static; }
          .ld-right { order: -1; }
          .ld-specs-bar { grid-template-columns: repeat(3, 1fr); }
          .ld-details-grid { grid-template-columns: 1fr; }
          .ld-details-divider { display: none; }
        }
        @media (max-width: 720px) {
          .ld-topbar-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 8px 16px;
          }
          .ld-breadcrumb { font-size: 11px; }
          .ld-listing-id, .ld-report { font-size: 11px; }
        }
        @media (max-width: 600px) {
          .ld-container { padding: 0 12px; margin-top: 12px; gap: 12px; }
          .ld-related-section { padding: 16px 12px 0; }
          .ld-info-card { padding: 14px 14px 16px; }
          .ld-desc-card, .ld-details-card { padding: 14px 14px; }
          .ld-title { font-size: 16px; }
          .ld-price { font-size: 20px; }
          .ld-specs-bar { grid-template-columns: repeat(3, 1fr); gap: 6px; }
          .ld-spec-chip { padding: 8px 4px 7px; }
          .ld-spec-icon { width: 26px; height: 26px; }
          .ld-meta-row { gap: 10px; font-size: 12px; }
          .ld-map-link { margin-left: 0; }
          .ld-seller-card { padding: 16px 14px; }
          .ld-thumb-wrap { width: 64px; height: 46px; }
          .ld-related-title { font-size: 16px; }
          .ld-rel-card { width: 148px; }
          .ld-rel-img-wrap { height: 98px; }
          .ld-section-title { font-size: 15px; }
          .ld-details-grid { grid-template-columns: 1fr; }
          .ld-details-divider { display: none; }
        }
        @media (max-width: 420px) {
          .ld-specs-bar { grid-template-columns: repeat(2, 1fr); }
          .ld-container { padding: 0 10px; }
          .ld-title { font-size: 15px; }
          .ld-price { font-size: 18px; }
          .ld-rel-card { width: 136px; }
        }
      `}</style>

      <div className="ld-page">

        {/* ── Top Bar: breadcrumb + listing id + report ── */}
        <div className="ld-topbar">
          <div className="ld-topbar-inner">
            <nav className="ld-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="ld-bc-link">Home</Link>
              <span className="ld-bc-sep">›</span>
              <Link href="/category/vehicles" className="ld-bc-link">Vehicles</Link>
              {listing.breadcrumbs.slice(1).map((crumb, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span className="ld-bc-sep">›</span>
                  <span className="ld-bc-current">{crumb}</span>
                </span>
              ))}
              <span className="ld-bc-sep">›</span>
              <span className="ld-bc-current" style={{ color: "#1a1a1a", fontWeight: 600 }}>{listing.title}</span>
            </nav>
            <span className="ld-listing-id">Listing ID: {listing.listingId}</span>
            <a href="#report" className="ld-report">Reporting this listing</a>
          </div>
        </div>

        {/* ── Main 2-col layout ── */}
        <div className="ld-container">

          {/* ── LEFT COLUMN ── */}
          <div className="ld-left">

            {/* Image Gallery */}
            <div className="ld-img-card">
              <div className="ld-main-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.images[activeImg]}
                  alt={listing.title}
                  className="ld-main-img"
                />
              </div>
              <div className="ld-thumbs">
                {visibleThumbs.map((src, i) => (
                  <div
                    key={i}
                    className={`ld-thumb-wrap${activeImg === i ? " active" : ""}`}
                    onClick={() => setActiveImg(i)}
                    role="button"
                    aria-label={`View image ${i + 1}`}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Thumbnail ${i + 1}`} className="ld-thumb-img" />
                    {i === 4 && extraCount > 0 && (
                      <div className="ld-thumb-overlay">+{extraCount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Title / Price / Meta */}
            <div className="ld-info-card">
              {listing.isVerified && (
                <div className="ld-verified-badge">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="#1e8449" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="10" stroke="#1e8449" strokeWidth="2" />
                  </svg>
                  Verified Car
                </div>
              )}

              <div className="ld-title-row">
                <h1 className="ld-title">{listing.title}</h1>
                <div className="ld-action-btns">
                  {/* Share */}
                  <button className="ld-action-btn" aria-label="Share listing" onClick={handleShare} id="share-btn">
                    <span className="ld-tooltip">{copied ? "Copied!" : "Share"}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="18" cy="5" r="3" stroke="#555" strokeWidth="1.8" />
                      <circle cx="6" cy="12" r="3" stroke="#555" strokeWidth="1.8" />
                      <circle cx="18" cy="19" r="3" stroke="#555" strokeWidth="1.8" />
                      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                  {/* Wishlist */}
                  <button
                    className={`ld-action-btn${isFav ? " fav-active" : ""}`}
                    aria-label="Save to wishlist"
                    onClick={() => setIsFav((v) => !v)}
                    id="wishlist-btn"
                  >
                    <span className="ld-tooltip">{isFav ? "Saved" : "Save"}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
                        stroke={isFav ? "#e74c3c" : "#888"}
                        strokeWidth="1.8"
                        fill={isFav ? "#e74c3c" : "none"}
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="ld-price">{listing.price}</div>
              {listing.negotiable && <span className="ld-negotiable">Negotiable</span>}

              <div className="ld-meta-row">
                <span className="ld-loc">
                  <svg width="11" height="13" viewBox="0 0 11 15" fill="none">
                    <path d="M5.5 0C3.015 0 1 2.015 1 4.5C1 8.125 5.5 15 5.5 15S10 8.125 10 4.5C10 2.015 7.985 0 5.5 0ZM5.5 6.25C4.535 6.25 3.75 5.465 3.75 4.5C3.75 3.535 4.535 2.75 5.5 2.75C6.465 2.75 7.25 3.535 7.25 4.5C7.25 5.465 6.465 6.25 5.5 6.25Z" fill="#888" />
                  </svg>
                  {listing.location}
                </span>
                <span className="ld-driven-meta">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#bbb" strokeWidth="1.8" />
                    <path d="M12 7v5l3 2" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  {listing.driven}
                </span>
                <span className="ld-posted">
                  Posted {listing.postedDaysAgo} day{listing.postedDaysAgo !== 1 ? "s" : ""} ago
                </span>
                <a href="#location" className="ld-map-link">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#C0392B" opacity="0.15" />
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#C0392B" strokeWidth="1.8" />
                    <circle cx="12" cy="9" r="2.5" fill="#C0392B" />
                  </svg>
                  View on Map
                </a>
              </div>

              {/* Specs bar */}
              <div className="ld-specs-bar">
                {/* Make */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17l2-6h14l2 6H3z" stroke="#C0392B" strokeWidth="1.6" strokeLinejoin="round" />
                      <circle cx="7" cy="17" r="2" stroke="#C0392B" strokeWidth="1.6" />
                      <circle cx="17" cy="17" r="2" stroke="#C0392B" strokeWidth="1.6" />
                      <path d="M5 11l2-5h10l2 5" stroke="#C0392B" strokeWidth="1.4" />
                    </svg>
                  </div>
                  <span className="ld-spec-val">{listing.specs.make}</span>
                  <span className="ld-spec-label">Make</span>
                </div>
                {/* Model */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="7" width="18" height="12" rx="2" stroke="#2471A3" strokeWidth="1.6" />
                      <path d="M7 7V5a5 5 0 0110 0v2" stroke="#2471A3" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="ld-spec-val" style={{ fontSize: 10 }}>{listing.specs.model}</span>
                  <span className="ld-spec-label">Model</span>
                </div>
                {/* Year */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="17" rx="2" stroke="#27AE60" strokeWidth="1.6" />
                      <path d="M3 9h18" stroke="#27AE60" strokeWidth="1.4" />
                      <path d="M8 2v3M16 2v3" stroke="#27AE60" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="ld-spec-val">{listing.specs.year}</span>
                  <span className="ld-spec-label">Year</span>
                </div>
                {/* Fuel */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 21V6a2 2 0 012-2h6a2 2 0 012 2v15H5z" stroke="#F39C12" strokeWidth="1.6" />
                      <path d="M15 8h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" stroke="#F39C12" strokeWidth="1.6" />
                      <path d="M9 11h2" stroke="#F39C12" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="ld-spec-val">{listing.specs.fuel}</span>
                  <span className="ld-spec-label">Fuel</span>
                </div>
                {/* Transmission */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="6" cy="6" r="2.5" stroke="#8E44AD" strokeWidth="1.6" />
                      <circle cx="18" cy="6" r="2.5" stroke="#8E44AD" strokeWidth="1.6" />
                      <circle cx="6" cy="18" r="2.5" stroke="#8E44AD" strokeWidth="1.6" />
                      <circle cx="18" cy="18" r="2.5" stroke="#8E44AD" strokeWidth="1.6" />
                      <path d="M6 8.5V15.5M18 8.5V15.5M8.5 6H15.5M8.5 18H15.5" stroke="#8E44AD" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="ld-spec-val" style={{ fontSize: 9.5 }}>{listing.specs.transmission}</span>
                  <span className="ld-spec-label">Transmission</span>
                </div>
                {/* Driven */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#16A085" strokeWidth="1.6" />
                      <path d="M12 7v5l3.5 2" stroke="#16A085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="ld-spec-val" style={{ fontSize: 10 }}>{listing.specs.driven}</span>
                  <span className="ld-spec-label">Driven</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="ld-desc-card">
              <h2 className="ld-section-title">Description</h2>
              <p className={`ld-desc-text${!showFull ? " clamped" : ""}`}>
                {listing.description}
              </p>
              <button className="ld-see-more" onClick={() => setShowFull((v) => !v)} id="desc-toggle">
                {showFull ? "See Less" : "See More"}
              </button>
            </div>

            {/* Vehicle Details */}
            <div className="ld-details-card">
              <h2 className="ld-section-title">Vehicles Details</h2>
              <div className="ld-details-grid">
                {/* Left col */}
                <div className="ld-details-col">
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Drive Type</span>
                    <span className="ld-detail-val">{listing.details.driveType}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Exterior color</span>
                    <span className="ld-detail-val">{listing.details.exteriorColor}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Interior color</span>
                    <span className="ld-detail-val">{listing.details.interiorColor}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Ownership</span>
                    <span className="ld-detail-val">{listing.details.ownership}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Registratio</span>
                    <span className="ld-detail-val">{listing.details.registration}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="ld-details-divider" />

                {/* Right col */}
                <div className="ld-details-col">
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Body Type</span>
                    <span className="ld-detail-val">{listing.details.bodyType}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Mileage</span>
                    <span className="ld-detail-val">{listing.details.mileage}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Fuel Type</span>
                    <span className="ld-detail-val">{listing.details.fuelType}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Transmission</span>
                    <span className="ld-detail-val">{listing.details.transmission}</span>
                  </div>
                  <div className="ld-detail-row">
                    <span className="ld-detail-label">Engine</span>
                    <span className="ld-detail-val">{listing.details.engine}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="ld-right">

            {/* Seller Card */}
            <div className="ld-seller-card">
              <p className="ld-seller-card-title">Seller information</p>

              <div className="ld-seller-top">
                <div className="ld-seller-avatar-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
                    className="ld-seller-avatar"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                      const placeholder = document.createElement("div");
                      placeholder.className = "ld-avatar-placeholder";
                      placeholder.textContent = listing.seller.name.charAt(0);
                      el.parentNode?.insertBefore(placeholder, el);
                    }}
                  />
                  <span className="ld-seller-online" aria-label="Online" />
                </div>
                <div>
                  <p className="ld-seller-name">{listing.seller.name}</p>
                  <div className="ld-rating-row">
                    <span className="ld-rating-num">{listing.seller.rating}</span>
                    <StarRating rating={listing.seller.rating} />
                    <span className="ld-reviews">({listing.seller.reviewCount} Reviews)</span>
                  </div>
                </div>
              </div>

              <div className="ld-seller-badges">
                {listing.seller.isVerified && (
                  <span className="ld-sbadge ld-sbadge-verified">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#1e8449" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="#1e8449" strokeWidth="2" />
                    </svg>
                    Verified Seller
                  </span>
                )}
                {listing.seller.isPro && (
                  <span className="ld-sbadge ld-sbadge-pro">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="#b7950b" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                    Pro Member
                  </span>
                )}
                {listing.seller.isTrusted && (
                  <span className="ld-sbadge ld-sbadge-trusted">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L3 7v6c0 5.25 3.9 10.14 9 11.36C17.1 23.14 21 18.25 21 13V7L12 2z" stroke="#7d3c98" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                    Trusted
                  </span>
                )}
              </div>

              <div className="ld-seller-stats">
                <div className="ld-stat-row">
                  <span className="ld-stat-label">Member since</span>
                  <span className="ld-stat-val">{listing.seller.memberSince}</span>
                </div>
                <div className="ld-stat-row">
                  <span className="ld-stat-label">Total listing</span>
                  <span className="ld-stat-val">{listing.seller.totalListing}</span>
                </div>
                <div className="ld-stat-row">
                  <span className="ld-stat-label">Response Rate</span>
                  <span className="ld-stat-val">{listing.seller.responseRate}</span>
                </div>
                <div className="ld-stat-row">
                  <span className="ld-stat-label">Avg. Response Time</span>
                  <span className="ld-stat-val">{listing.seller.avgResponseTime}</span>
                </div>
              </div>

              <div className="ld-cta-btns">
                <button
                  className="ld-btn-call"
                  id="call-seller-btn"
                  onClick={() => setCallRevealed(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 10.94 19.79 19.79 0 01.44 2.27 2 2 0 012.42.09h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.19-1.19a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  {callRevealed ? listing.seller.phone : "📞  Call"}
                </button>
                <button className="ld-btn-chat" id="chat-seller-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                  Chat Now
                </button>
                <button className="ld-btn-msg" id="message-seller-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#555" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M22 6l-10 7L2 6" stroke="#555" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Message
                </button>
              </div>
            </div>

            {/* Location Card */}
            <div className="ld-location-card" id="location">
              <p className="ld-location-card-title">Location</p>
              <div className="ld-map-area">
                <div className="ld-map-bg" />
                <div className="ld-map-pin">
                  <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
                    <path d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.27 21.73 0 14 0Z" fill="#C0392B" />
                    <circle cx="14" cy="14" r="6" fill="#fff" />
                  </svg>
                  <span className="ld-map-label">{listing.location}</span>
                </div>
              </div>
              <div className="ld-location-info">
                <p className="ld-location-name">{listing.location}</p>
                <p className="ld-location-dist">{listing.distanceFrom}</p>
                <p className="ld-location-extra">{listing.location.split(",")[0]}, Nepal</p>
              </div>
              <a href="https://www.google.com/maps/place/Lalitpur/@27.6574688,85.323152,10330m/data=!3m2!1e3!4b1!4m6!3m5!1s0x39eb19d3cf18ca51:0xd10ec3d53656e18f!8m2!3d27.6587525!4d85.3247183!16zL20vMDRtX3h0?entry=ttu&g_ep=EgoyMDI2MDUxNy4wIKXMDSoASAFQAw%3D%3D" target="" rel="noopener noreferrer" className="ld-map-view-link">
                View on Map
              </a>
            </div>

          </div>
        </div>

        {/* ── Related Listings ── */}
        <div className="ld-related-section">
          <div className="ld-related-header">
            <h2 className="ld-related-title">Related Listing</h2>
            <Link href="/category/vehicles" className="ld-related-viewall">
              View All
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#C0392B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="ld-related-scroll">
            {RELATED_LISTINGS.filter((r) => r.id !== listing.id).map((rel) => {
              const isFavRel = !!favRelated[rel.id];
              return (
                <Link key={rel.id} href={`/listing/${rel.id}`} className="ld-rel-card">
                  <div className="ld-rel-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rel.image} alt={rel.title} className="ld-rel-img" />
                    <button
                      className="ld-rel-heart"
                      aria-label="Save"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFavRelated((p) => ({ ...p, [rel.id]: !p[rel.id] }));
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={isFavRel ? "#E74C3C" : "none"}>
                        <path
                          d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
                          stroke={isFavRel ? "#E74C3C" : "#999"}
                          strokeWidth="1.8"
                        />
                      </svg>
                    </button>
                    {rel.verified && (
                      <span className="ld-rel-badge">
                        <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="ld-rel-body">
                    <p className="ld-rel-name">{rel.title}</p>
                    <p className="ld-rel-price">{rel.price}</p>
                    <p className="ld-rel-loc">
                      <svg width="9" height="11" viewBox="0 0 11 15" fill="none">
                        <path d="M5.5 0C3.015 0 1 2.015 1 4.5C1 8.125 5.5 15 5.5 15S10 8.125 10 4.5C10 2.015 7.985 0 5.5 0ZM5.5 6.25C4.535 6.25 3.75 5.465 3.75 4.5C3.75 3.535 4.535 2.75 5.5 2.75C6.465 2.75 7.25 3.535 7.25 4.5C7.25 5.465 6.465 6.25 5.5 6.25Z" fill="#bbb" />
                      </svg>
                      {rel.location}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
