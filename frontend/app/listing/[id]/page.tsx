"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import {
  FiShare2, FiHeart, FiMapPin, FiClock, FiPhone,
  FiMessageSquare, FiMail, FiChevronRight, FiCheckCircle,
  FiShield, FiTruck, FiTag, FiCalendar, FiDroplet,
} from "react-icons/fi";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";

// ─── Data ───────────────────────────────────────────────────────────────────

const LISTING_DATA: Record<string, ListingDetail> = {
  "toyota-land-cruiser-prado-2020": {
    id: "toyota-land-cruiser-prado-2020",
    listingId: "#VH765812",
    title: "Toyota Land Cruiser Prado TXL 2020",
    price: "Rs. 1,50,00,000",
    negotiable: true,
    location: "Lalitpur, Bagmati",
    distanceFrom: "2.5km from Lagankhe",
    postedDaysAgo: 2,
    driven: "15,000km",
    isVerified: true,
    category: "Cars",
    breadcrumbs: ["Vehicles", "Cars", "Toyota"],
    images: ["/car1.jpg", "/car2.jpg", "/car3.jpg", "/car4.jpg", "/car5.jpg", "/car6.jpg", "/car7.jpg", "/car8.jpg"],
    description: "Excellent condition Toyota Land Cruiser Prado TXL 2020 for sale. Well maintained, original paint, full service from authorized service center. Luxury SUV with powerful performance and premium comfort. This vehicle has been meticulously maintained with full service history. All original parts, never been in an accident. Ready to drive. Serious buyers only please.",
    lat: 27.6588,
    lng: 85.3247,
    specs: {
      make: "Toyota",
      model: "Land Cruiser Prado",
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
      registration: "Bagmati, 2020",
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
      memberSince: "Jan 2022",
      totalListing: 24,
      responseRate: "98%",
      avgResponseTime: "10 min",
      phone: "+977-9841000000",
    },
  },
  "hundai-creta-2022": {
    id: "hundai-creta-2022",
    listingId: "#VH123456",
    title: "Hyundai Creta 2022",
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
    description: "Well maintained Hyundai Creta 2022 in excellent condition. Single owner, all service records available. Fuel efficient and comfortable for city and highway driving. Comes with all original accessories and warranty still valid.",
    lat: 27.7172,
    lng: 85.3240,
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
      registration: "Bagmati, 2022",
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
      memberSince: "Mar 2021",
      totalListing: 8,
      responseRate: "95%",
      avgResponseTime: "20 min",
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
    description: "Bajaj Pulsar N160 Dual Channel ABS in pristine condition. Powerful 160cc engine, dual channel ABS, great mileage. Perfect for daily commute and weekend rides. All documents clear, single owner bike.",
    lat: 27.7172,
    lng: 85.3240,
    specs: {
      make: "Bajaj",
      model: "Pulsar N160",
      year: "2023",
      fuel: "Petrol",
      transmission: "Manual",
      driven: "12,000km",
    },
    details: {
      driveType: "Chain Drive",
      bodyType: "Naked Bike",
      exteriorColor: "Red",
      mileage: "12000km",
      interiorColor: "N/A",
      fuelType: "Petrol",
      ownership: "1st Owner",
      transmission: "Manual 6-Speed",
      registration: "Bagmati, 2023",
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
      memberSince: "Jun 2023",
      totalListing: 3,
      responseRate: "90%",
      avgResponseTime: "30 min",
      phone: "+977-9841000002",
    },
  },
  "bajaj-pulsar-n160": {
    id: "bajaj-pulsar-n160",
    listingId: "#VH654322",
    title: "Bajaj Pulsar N160 2023",
    price: "Rs. 3,45,000",
    negotiable: true,
    location: "Kathmandu, Bagmati",
    distanceFrom: "1.0km from Chabahil",
    postedDaysAgo: 3,
    driven: "12,500km",
    isVerified: true,
    category: "Bikes",
    breadcrumbs: ["Vehicles", "Bikes", "Bajaj"],
    images: ["/bajaj.avif", "/car6.jpg", "/car8.jpg"],
    description: "Bajaj Pulsar N160 in excellent condition. Well maintained with all service records. Dual channel ABS, LED headlights and modern instrument cluster. Ideal for long rides and daily commuting.",
    lat: 27.7200,
    lng: 85.3450,
    specs: {
      make: "Bajaj",
      model: "Pulsar N160",
      year: "2023",
      fuel: "Petrol",
      transmission: "Manual",
      driven: "12,500km",
    },
    details: {
      driveType: "Chain Drive",
      bodyType: "Naked Bike",
      exteriorColor: "Blue/Black",
      mileage: "12500km",
      interiorColor: "N/A",
      fuelType: "Petrol",
      ownership: "1st Owner",
      transmission: "Manual 6-Speed",
      registration: "Bagmati, 2023",
      engine: "160cc",
    },
    seller: {
      name: "Hari Bahadur",
      avatar: "/lady.jpg",
      rating: 4.3,
      reviewCount: 6,
      isVerified: true,
      isPro: false,
      isTrusted: false,
      memberSince: "Aug 2023",
      totalListing: 2,
      responseRate: "88%",
      avgResponseTime: "25 min",
      phone: "+977-9841000005",
    },
  },
  "honda-shine": {
    id: "honda-shine",
    listingId: "#VH112233",
    title: "Honda Shine 2023",
    price: "NPR 1,95,000",
    negotiable: true,
    location: "Kathmandu, Bagmati",
    distanceFrom: "1.5km from Maharajgunj",
    postedDaysAgo: 3,
    driven: "12,500km",
    isVerified: true,
    category: "Bikes",
    breadcrumbs: ["Vehicles", "Bikes", "Honda"],
    images: ["/honda.jpg", "/car6.jpg", "/car8.jpg"],
    description: "Honda Shine 2023 in excellent condition. Well maintained with all service records. Smooth ride and excellent fuel economy. Perfect for city commuting. Single owner, all documents clear and ready for transfer.",
    lat: 27.7350,
    lng: 85.3300,
    specs: {
      make: "Honda",
      model: "Shine",
      year: "2023",
      fuel: "Petrol",
      transmission: "Manual",
      driven: "12,500km",
    },
    details: {
      driveType: "Chain Drive",
      bodyType: "Commuter Bike",
      exteriorColor: "Blue",
      mileage: "12500km",
      interiorColor: "N/A",
      fuelType: "Petrol",
      ownership: "1st Owner",
      transmission: "Manual 5-Speed",
      registration: "Bagmati, 2023",
      engine: "125cc",
    },
    seller: {
      name: "Bibek Thapa",
      avatar: "/lady.jpg",
      rating: 4.4,
      reviewCount: 10,
      isVerified: true,
      isPro: false,
      isTrusted: true,
      memberSince: "Feb 2023",
      totalListing: 5,
      responseRate: "92%",
      avgResponseTime: "15 min",
      phone: "+977-9841000003",
    },
  },
  "hero-splendor": {
    id: "hero-splendor",
    listingId: "#VH998877",
    title: "Hero Splendor Plus 2023",
    price: "NPR 1,65,000",
    negotiable: false,
    location: "Kathmandu, Bagmati",
    distanceFrom: "2km from Baneshwor",
    postedDaysAgo: 4,
    driven: "12,500km",
    isVerified: true,
    category: "Bikes",
    breadcrumbs: ["Vehicles", "Bikes", "Hero"],
    images: ["/Harley-Davidson.jpg", "/car7.jpg", "/car5.jpg"],
    description: "Hero Splendor Plus 2023, brand new condition with very low usage. Excellent fuel efficiency, smooth engine. One of Nepal's best-selling bikes. Great for daily commuting with low maintenance costs. Documents complete.",
    lat: 27.7030,
    lng: 85.3390,
    specs: {
      make: "Hero",
      model: "Splendor Plus",
      year: "2023",
      fuel: "Petrol",
      transmission: "Manual",
      driven: "12,500km",
    },
    details: {
      driveType: "Chain Drive",
      bodyType: "Commuter Bike",
      exteriorColor: "Black/Red",
      mileage: "12500km",
      interiorColor: "N/A",
      fuelType: "Petrol",
      ownership: "1st Owner",
      transmission: "Manual 4-Speed",
      registration: "Bagmati, 2023",
      engine: "97.2cc",
    },
    seller: {
      name: "Anita Gurung",
      avatar: "/lady.jpg",
      rating: 4.6,
      reviewCount: 15,
      isVerified: true,
      isPro: false,
      isTrusted: true,
      memberSince: "May 2022",
      totalListing: 7,
      responseRate: "97%",
      avgResponseTime: "12 min",
      phone: "+977-9841000004",
    },
  },
  "scooter": {
    id: "scooter",
    listingId: "#VH445566",
    title: "Honda Activa Scooter 2024",
    price: "NPR 1,85,000",
    negotiable: true,
    location: "Bhaktapur, Bagmati",
    distanceFrom: "0.5km from Durbar Square",
    postedDaysAgo: 2,
    driven: "5,400km",
    isVerified: true,
    category: "Scooter",
    breadcrumbs: ["Vehicles", "Scooter", "Honda"],
    images: ["/Scooter.jpg", "/car4.jpg", "/car6.jpg"],
    description: "Honda Activa 2024 almost brand new scooter. Very low mileage, kept in garage. Ideal for daily city commuting. Automatic transmission — no gear shifting needed. Excellent for both men and women. All documents ready for transfer.",
    lat: 27.6710,
    lng: 85.4298,
    specs: {
      make: "Honda",
      model: "Activa",
      year: "2024",
      fuel: "Petrol",
      transmission: "Automatic",
      driven: "5,400km",
    },
    details: {
      driveType: "Belt Drive",
      bodyType: "Scooter",
      exteriorColor: "White",
      mileage: "5400km",
      interiorColor: "N/A",
      fuelType: "Petrol",
      ownership: "1st Owner",
      transmission: "CVT Automatic",
      registration: "Bagmati, 2024",
      engine: "109.51cc",
    },
    seller: {
      name: "Priya Maharjan",
      avatar: "/lady.jpg",
      rating: 4.7,
      reviewCount: 9,
      isVerified: true,
      isPro: false,
      isTrusted: true,
      memberSince: "Jan 2024",
      totalListing: 2,
      responseRate: "96%",
      avgResponseTime: "8 min",
      phone: "+977-9841000006",
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
  lat: number;
  lng: number;
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
    <span style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating)
          ? <FaStar key={i} size={13} color="#F39C12" />
          : <FaRegStar key={i} size={13} color="#F39C12" />
      )}
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
        .ld-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 80px;
          align-self: start;
        }

        /* ── Seller Card ── */
        .ld-seller-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 18px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.08);
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
        .ld-map-pin {
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
          .ld-right { order: -1; position: static; }
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
                  <MdVerified size={12} color="#1e8449" />
                  Verified Car
                </div>
              )}

              <div className="ld-title-row">
                <h1 className="ld-title">{listing.title}</h1>
                <div className="ld-action-btns">
                  {/* Share */}
                  <button className="ld-action-btn" aria-label="Share listing" onClick={handleShare} id="share-btn">
                    <span className="ld-tooltip">{copied ? "Copied!" : "Share"}</span>
                    <FiShare2 size={15} color="#555" />
                  </button>
                  {/* Wishlist */}
                  <button
                    className={`ld-action-btn${isFav ? " fav-active" : ""}`}
                    aria-label="Save to wishlist"
                    onClick={() => setIsFav((v) => !v)}
                    id="wishlist-btn"
                  >
                    <span className="ld-tooltip">{isFav ? "Saved" : "Save"}</span>
                    {isFav ? <FaHeart size={15} color="#e74c3c" /> : <FiHeart size={15} color="#888" />}
                  </button>
                </div>
              </div>

              <div className="ld-price">{listing.price}</div>
              {listing.negotiable && <span className="ld-negotiable">Negotiable</span>}

              <div className="ld-meta-row">
                <span className="ld-loc">
                  <FiMapPin size={12} color="#888" />
                  {listing.location}
                </span>
                <span className="ld-driven-meta">
                  <FiClock size={13} color="#bbb" />
                  {listing.driven}
                </span>
                <span className="ld-posted">
                  Posted {listing.postedDaysAgo} day{listing.postedDaysAgo !== 1 ? "s" : ""} ago
                </span>
                <a href="#location" className="ld-map-link">
                  <FiMapPin size={13} color="#C0392B" />
                  View on Map
                </a>
              </div>

              {/* Specs bar */}
              <div className="ld-specs-bar">
                {/* Make */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon"><FiTruck size={20} color="#C0392B" /></div>
                  <span className="ld-spec-val">{listing.specs.make}</span>
                  <span className="ld-spec-label">Make</span>
                </div>
                {/* Model */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon"><FiTag size={20} color="#2471A3" /></div>
                  <span className="ld-spec-val" style={{ fontSize: 10 }}>{listing.specs.model}</span>
                  <span className="ld-spec-label">Model</span>
                </div>
                {/* Year */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon"><FiCalendar size={20} color="#27AE60" /></div>
                  <span className="ld-spec-val">{listing.specs.year}</span>
                  <span className="ld-spec-label">Year</span>
                </div>
                {/* Fuel */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon"><FiDroplet size={20} color="#F39C12" /></div>
                  <span className="ld-spec-val">{listing.specs.fuel}</span>
                  <span className="ld-spec-label">Fuel</span>
                </div>
                {/* Transmission */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon"><TbManualGearbox size={20} color="#8E44AD" /></div>
                  <span className="ld-spec-val" style={{ fontSize: 9.5 }}>{listing.specs.transmission}</span>
                  <span className="ld-spec-label">Transmission</span>
                </div>
                {/* Driven */}
                <div className="ld-spec-chip">
                  <div className="ld-spec-icon"><FiClock size={20} color="#16A085" /></div>
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
                    <FiCheckCircle size={10} color="#1e8449" />
                    Verified Seller
                  </span>
                )}
                {listing.seller.isPro && (
                  <span className="ld-sbadge ld-sbadge-pro">
                    <FaStar size={10} color="#b7950b" />
                    Pro Member
                  </span>
                )}
                {listing.seller.isTrusted && (
                  <span className="ld-sbadge ld-sbadge-trusted">
                    <FiShield size={10} color="#7d3c98" />
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
                  <FiPhone size={15} color="#fff" />
                  {callRevealed ? listing.seller.phone : "📞  Call"}
                </button>
                <button className="ld-btn-chat" id="chat-seller-btn">
                  <FiMessageSquare size={15} color="#fff" />
                  Chat Now
                </button>
                <button className="ld-btn-msg" id="message-seller-btn">
                  <FiMail size={15} color="#555" />
                  Message
                </button>
              </div>
            </div>

            {/* Location Card */}
            <div className="ld-location-card" id="location">
              <p className="ld-location-card-title">Location</p>
              {/* Real OpenStreetMap embed — no API key needed */}
              <div className="ld-map-area" style={{ height: 220, position: "relative", overflow: "hidden" }}>
                <iframe
                  title="Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.015}%2C${listing.lat - 0.010}%2C${listing.lng + 0.015}%2C${listing.lat + 0.010}&layer=mapnik&marker=${listing.lat}%2C${listing.lng}`}
                />
              </div>
              <div className="ld-location-info">
                <p className="ld-location-name">{listing.location}</p>
                <p className="ld-location-dist">{listing.distanceFrom}</p>
                <p className="ld-location-extra">{listing.location.split(",")[0]}, Nepal</p>
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${listing.lat}&mlon=${listing.lng}#map=15/${listing.lat}/${listing.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ld-map-view-link"
              >
                <FiMapPin size={13} color="#C0392B" /> View Full Map
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
              <FiChevronRight size={13} color="#C0392B" />
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
                      {isFavRel ? <FaHeart size={12} color="#E74C3C" /> : <FiHeart size={12} color="#999" />}
                    </button>
                    {rel.verified && (
                      <span className="ld-rel-badge">
                        <FiCheckCircle size={7} color="#fff" />
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="ld-rel-body">
                    <p className="ld-rel-name">{rel.title}</p>
                    <p className="ld-rel-price">{rel.price}</p>
                    <p className="ld-rel-loc">
                      <FiMapPin size={10} color="#bbb" />
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
