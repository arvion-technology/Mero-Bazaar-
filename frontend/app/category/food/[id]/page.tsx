"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import {
  FiMapPin, FiMessageSquare, FiArrowLeft,
  FiPhone, FiShare2, FiHeart, FiCheckCircle,
  FiCalendar, FiUser, FiStar, FiClock, FiTruck,
} from "react-icons/fi";
import { FaHeart, FaLeaf, FaShieldAlt, FaUtensils } from "react-icons/fa";

type FoodType = "Veg" | "Non veg" | "Vegan" | "Egg Items";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  foodType: FoodType;
  pricePerMeal: string;
  distance: string;
  location: string;
  district: string;
  images: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isFreshAndHygienic: boolean;
  isOpenToOffers: boolean;
  postedDaysAgo: number;
  description?: string;
  sellerName?: string;
  sellerPhone?: string;
  deliveryTime?: string;
  minOrder?: string;
  openingHours?: string;
};

const RESTAURANTS: Restaurant[] = [
  {
    id: "healthy-home-kitchen",
    name: "Healthy Home kitchen",
    cuisine: "Veg Thali",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Balkumari",
    district: "Lalitpur",
    images: ["/food-healthy.jpg", "/food-healthy2.jpg"],
    rating: 4.6,
    reviewCount: 126,
    tags: ["Veg Thali", "Healthy", "Organic"],
    isFreshAndHygienic: true,
    isOpenToOffers: true,
    postedDaysAgo: 1,
    description: "Authentic homemade veg thali prepared with fresh organic vegetables and pure ghee. Daily changing menu with 8+ items including dal, rice, roti, sabzi, salad, papad, pickle, and dessert. Perfect for daily lunch and dinner. We use zero artificial preservatives.",
    sellerName: "Sunita Sharma",
    sellerPhone: "9812345678",
    deliveryTime: "30-45 min",
    minOrder: "NPR 200",
    openingHours: "7:00 AM - 9:00 PM",
  },
  {
    id: "bhojan-gariha",
    name: "Bhojan Gariha",
    cuisine: "Nepali, Traditional",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Thapathali",
    district: "Kathmandu",
    images: ["/food-nepali.jpg"],
    rating: 4.8,
    reviewCount: 203,
    tags: ["Nepali", "Traditional", "Thali"],
    isFreshAndHygienic: true,
    isOpenToOffers: false,
    postedDaysAgo: 2,
    description: "Traditional Nepali dal-bhat-tarkari served in authentic style. Our recipes have been passed down through generations. We use locally sourced ingredients and cook in pure mustard oil for that authentic taste.",
    sellerName: "Anish Thapa",
    sellerPhone: "9834567890",
    deliveryTime: "40-55 min",
    minOrder: "NPR 250",
    openingHours: "10:00 AM - 10:00 PM",
  },
  {
    id: "thakali-kitchen",
    name: "Thakali Kitchen",
    cuisine: "Veg Thali",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "2km",
    location: "New road",
    district: "Kathmandu",
    images: ["/food-thakali.jpg"],
    rating: 4.5,
    reviewCount: 89,
    tags: ["Veg Thali", "Thakali", "Spicy"],
    isFreshAndHygienic: true,
    isOpenToOffers: true,
    postedDaysAgo: 0,
    description: "Authentic Thakali cuisine from the Mustang region. Famous for our unique timmur pepper and jimbu herb flavors. Our thali includes buckwheat dhindo, gundruk, and traditional pickles.",
    sellerName: "Maya Devi",
    sellerPhone: "9845678901",
    deliveryTime: "35-50 min",
    minOrder: "NPR 200",
    openingHours: "8:00 AM - 9:30 PM",
  },
  {
    id: "burger-house-nepal",
    name: "Burger House Nepal",
    cuisine: "Fast Food, Burgers",
    foodType: "Non veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Ratnapark",
    district: "Kathmandu",
    images: ["/food-burger.jpg", "/food-burger2.jpg"],
    rating: 4.3,
    reviewCount: 156,
    tags: ["Fast Food", "Burgers", "Fries"],
    isFreshAndHygienic: true,
    isOpenToOffers: true,
    postedDaysAgo: 1,
    description: "Juicy handcrafted burgers made with 100% fresh Nepali buffalo meat. Our buns are baked fresh daily. Try our signature Everest Burger with special house sauce and loaded fries.",
    sellerName: "Prakash Rai",
    sellerPhone: "9856789012",
    deliveryTime: "25-40 min",
    minOrder: "NPR 300",
    openingHours: "11:00 AM - 11:00 PM",
  },
  {
    id: "new-momo-hut",
    name: "New Momo Hut",
    cuisine: "Momos, Chinese",
    foodType: "Non veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Balkhu",
    district: "Kathmandu",
    images: ["/food-momo.jpg"],
    rating: 4.7,
    reviewCount: 312,
    tags: ["Momos", "Chinese", "Steam"],
    isFreshAndHygienic: true,
    isOpenToOffers: false,
    postedDaysAgo: 3,
    description: "Kathmandu\'s favorite momo destination. Hand-rolled dumplings with secret spice blend. Available in steam, fried, and jhol varieties. Made fresh every morning with locally sourced meat and vegetables.",
    sellerName: "Hari Prasad",
    sellerPhone: "9823456789",
    deliveryTime: "20-35 min",
    minOrder: "NPR 150",
    openingHours: "9:00 AM - 10:00 PM",
  },
  {
    id: "himalayan-java-coffee",
    name: "Himalayan Java Coffee",
    cuisine: "Cafe, Beverages",
    foodType: "Veg",
    pricePerMeal: "NPR 250/meal",
    distance: "3km",
    location: "Lazimpat",
    district: "Kathmandu",
    images: ["/food-coffee.jpg", "/food-coffee2.jpg"],
    rating: 4.9,
    reviewCount: 445,
    tags: ["Cafe", "Beverages", "Pastry"],
    isFreshAndHygienic: true,
    isOpenToOffers: true,
    postedDaysAgo: 2,
    description: "Premium Himalayan coffee roasted in-house. Sourced from high-altitude farms in Ilam and Gulmi. Pair your coffee with our freshly baked croissants, muffins, and New York cheesecake.",
    sellerName: "Ramesh KC",
    sellerPhone: "9801234567",
    deliveryTime: "15-25 min",
    minOrder: "NPR 100",
    openingHours: "6:30 AM - 8:00 PM",
  },
];

const RELATED_LIMIT = 3;

export default function FoodDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const item = RESTAURANTS.find((l) => l.id === id);

  const getFoodTypeBadgeStyle = (foodType: FoodType) => {
    switch (foodType) {
      case "Veg": return { background: "#16a34a", color: "#fff" };
      case "Non veg": return { background: "#dc2626", color: "#fff" };
      case "Vegan": return { background: "#059669", color: "#fff" };
      case "Egg Items": return { background: "#d97706", color: "#fff" };
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
          .fd-404 {
            min-height: 80vh; display: flex; align-items: center; justify-content: center;
            font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column;
            text-align: center; padding: 40px 20px;
          }
          .fd-404 h1 { font-size: 22px; font-weight: 800; color: #111; margin: 12px 0 6px; }
          .fd-404 p { font-size: 14px; color: #888; margin: 0 0 18px; }
          .fd-back-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: #16a34a; color: #fff; font-weight: 700; font-size: 13px;
            padding: 10px 22px; border-radius: 8px; text-decoration: none;
          }
        `}</style>
        <div className="fd-404">
          <div style={{ fontSize: 56 }}>🍽️</div>
          <h1>Restaurant Not Found</h1>
          <p>The restaurant you are looking for does not exist.</p>
          <Link href="/category/food" className="fd-back-btn">
            <FiArrowLeft size={14} /> Back to Restaurants
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const related = RESTAURANTS.filter((r) => r.id !== item.id && r.foodType === item.foodType).slice(0, RELATED_LIMIT);
  const badgeStyle = getFoodTypeBadgeStyle(item.foodType);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .fd-wrap {
          min-height: 100vh; background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── BREADCRUMB ── */
        .fd-breadcrumb-bar {
          background: #fff; border-bottom: 1px solid #e5e7eb;
        }
        .fd-breadcrumb-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 12px 24px;
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9ca3af;
        }
        .fd-breadcrumb-inner a {
          color: #9ca3af; text-decoration: none; transition: color 0.15s;
        }
        .fd-breadcrumb-inner a:hover { color: #16a34a; }
        .fd-breadcrumb-inner span.active { color: #374151; font-weight: 600; }

        /* ── MAIN BODY ── */
        .fd-body {
          max-width: 1200px; margin: 0 auto;
          padding: 24px 20px 60px;
        }

        /* ── BACK LINK ── */
        .fd-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 18px;
          transition: color 0.15s;
        }
        .fd-back:hover { color: #16a34a; }

        /* ── GRID ── */
        .fd-grid {
          display: grid; grid-template-columns: 1fr 400px; gap: 24px;
          align-items: start;
        }

        /* ── LEFT: IMAGE + THUMBNAILS ── */
        .fd-img-section {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .fd-main-img-wrap {
          position: relative; aspect-ratio: 4/3; overflow: hidden;
          background: #e5e7eb;
        }
        .fd-main-img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .fd-img-cat-badge {
          position: absolute; top: 12px; right: 12px;
          font-size: 10px; font-weight: 800;
          padding: 4px 10px; border-radius: 5px;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .fd-img-fav-btn {
          position: absolute; top: 12px; left: 12px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0;
        }
        .fd-img-fav-btn:hover { transform: scale(1.12); }

        .fd-posted-tag {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(0,0,0,0.58); color: #fff;
          font-size: 10.5px; font-weight: 600; border-radius: 6px;
          padding: 3px 9px; backdrop-filter: blur(4px);
        }
        .fd-hygienic-tag {
          position: absolute; bottom: 12px; right: 12px;
          background: rgba(21,128,61,0.88); color: #fff;
          font-size: 10.5px; font-weight: 700; border-radius: 6px;
          padding: 3px 9px; display: flex; align-items: center; gap: 4px;
        }

        /* Thumbnail strip */
        .fd-thumb-strip {
          display: flex; gap: 8px; padding: 12px;
          overflow-x: auto;
        }
        .fd-thumb {
          width: 72px; height: 72px; border-radius: 8px;
          object-fit: cover; cursor: pointer; border: 2px solid transparent;
          transition: border-color 0.15s, opacity 0.15s;
          flex-shrink: 0;
        }
        .fd-thumb:hover { opacity: 0.8; }
        .fd-thumb.active { border-color: #16a34a; }

        /* ── RIGHT: DETAILS PANEL ── */
        .fd-right { display: flex; flex-direction: column; gap: 16px; }

        .fd-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .fd-name { font-size: 22px; font-weight: 900; color: #111; margin: 0 0 6px; }
        .fd-cuisine { font-size: 13px; color: #6b7280; margin: 0 0 10px; }
        .fd-price { font-size: 26px; font-weight: 900; color: #16a34a; margin: 0 0 12px; }
        .fd-price-divider {
          width: 40px; height: 3px; background: #4ade80;
          border-radius: 2px; margin-bottom: 14px;
        }

        .fd-location {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: #6b7280; margin-bottom: 14px;
        }

        .fd-desc {
          font-size: 13.5px; color: #4b5563; line-height: 1.7;
          margin-bottom: 16px;
        }

        /* Details grid */
        .fd-details-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 14px;
        }
        .fd-detail-item {
          background: #f9fafb; border-radius: 8px;
          padding: 10px 12px;
          border: 1px solid #f0f0f0;
        }
        .fd-detail-label {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;
        }
        .fd-detail-val { font-size: 13px; font-weight: 700; color: #111; }

        /* Badges row */
        .fd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .fd-badge-hygienic {
          display: inline-flex; align-items: center; gap: 5px;
          background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .fd-badge-offer {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fce7f3; color: #be185d; border: 1px solid #fbcfe8;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .fd-badge-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }

        /* Availability */
        .fd-avail {
          display: flex; align-items: center; gap: 8px;
          background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px;
          padding: 10px 14px; font-size: 12.5px; font-weight: 700; color: #92400e;
          margin-bottom: 14px;
        }
        .fd-avail-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;
          flex-shrink: 0; animation: fdpulse 1.4s infinite;
        }
        @keyframes fdpulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Action Buttons */
        .fd-actions { display: flex; gap: 10px; }
        .fd-btn-order {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 13px;
          background: #16a34a; color: #fff;
          font-size: 14px; font-weight: 800; border: none;
          border-radius: 9px; cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.15s;
          text-decoration: none;
        }
        .fd-btn-order:hover { background: #15803d; transform: translateY(-1px); }
        .fd-btn-phone {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .fd-btn-phone:hover { background: #d1fae5; border-color: #4ade80; color: #15803d; }
        .fd-btn-share {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .fd-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }

        /* Seller Panel */
        .fd-seller-panel {
          background: #fff; border-radius: 12px;
          border: 1px solid #e5e7eb; padding: 18px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .fd-seller-title {
          font-size: 12px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .fd-seller-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .fd-seller-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #4ade80, #16a34a);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; font-weight: 800; flex-shrink: 0;
        }
        .fd-seller-name { font-size: 14px; font-weight: 800; color: #111; }
        .fd-seller-phone { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .fd-seller-chat-btn {
          display: flex; align-items: center; gap: 6px;
          background: #16a34a; color: #fff;
          font-size: 12.5px; font-weight: 800; border: none;
          padding: 9px 18px; border-radius: 8px; cursor: pointer;
          font-family: inherit; white-space: nowrap;
          transition: background 0.15s;
        }
        .fd-seller-chat-btn:hover { background: #15803d; }

        /* Safety tips panel */
        .fd-tips {
          background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
          padding: 14px 16px;
        }
        .fd-tips-title { font-size: 12px; font-weight: 800; color: #92400e; margin-bottom: 8px; }
        .fd-tip-item {
          display: flex; align-items: flex-start; gap: 6px;
          font-size: 11.5px; color: #78350f; margin-bottom: 5px; line-height: 1.5;
        }
        .fd-tip-item:last-child { margin-bottom: 0; }

        /* ── RELATED ── */
        .fd-related { margin-top: 32px; }
        .fd-related-title {
          font-size: 17px; font-weight: 800; color: #111; margin-bottom: 14px;
        }
        .fd-related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        }
        .fd-rel-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          border: 1px solid #e5e7eb; text-decoration: none; color: inherit;
          display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .fd-rel-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .fd-rel-img-wrap { aspect-ratio: 16/11; overflow: hidden; background: #e5e7eb; }
        .fd-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .fd-rel-card:hover .fd-rel-img { transform: scale(1.05); }
        .fd-rel-body { padding: 10px 12px; }
        .fd-rel-name { font-size: 13.5px; font-weight: 700; color: #111; margin: 0 0 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fd-rel-price { font-size: 13px; font-weight: 800; color: #16a34a; }
        .fd-rel-loc { font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 3px; margin-top: 3px; }
        .fd-rel-rating {
          display: flex; align-items: center; gap: 2px; margin-top: 4px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .fd-grid { grid-template-columns: 1fr; }
          .fd-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .fd-body { padding: 16px 14px 40px; }
          .fd-related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="fd-wrap">

        {/* ── BREADCRUMB ── */}
        <div className="fd-breadcrumb-bar">
          <div className="fd-breadcrumb-inner">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/category/food">Food & Home Delivery</Link>
            <span>/</span>
            <span className="active">{item.name}</span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="fd-body">
          <Link href="/category/food" className="fd-back">
            <FiArrowLeft size={14} /> Back to all restaurants
          </Link>

          <div className="fd-grid">

            {/* ── LEFT: IMAGE ── */}
            <div>
              <div className="fd-img-section">
                <div className="fd-main-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images[activeImg]} alt={item.name} className="fd-main-img" />

                  {/* Food Type badge */}
                  <span className="fd-img-cat-badge" style={badgeStyle}>
                    {item.foodType}
                  </span>

                  {/* Favourite */}
                  <button className="fd-img-fav-btn" onClick={() => setIsFav(!isFav)}>
                    {isFav
                      ? <FaHeart size={16} color="#ef4444" />
                      : <FaHeart size={16} color="#d1d5db" />}
                  </button>

                  {/* Posted time */}
                  {item.postedDaysAgo !== undefined && (
                    <span className="fd-posted-tag">
                      <FiClock size={10} style={{ marginRight: 4 }} />
                      {item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo}d ago`}
                    </span>
                  )}

                  {/* Hygienic ribbon */}
                  {item.isFreshAndHygienic && (
                    <span className="fd-hygienic-tag">
                      <FaLeaf size={10} /> Fresh & Hygienic
                    </span>
                  )}
                </div>

                {/* Thumbnail strip */}
                {item.images.length > 1 && (
                  <div className="fd-thumb-strip">
                    {item.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${item.name} ${idx + 1}`}
                        className={`fd-thumb${activeImg === idx ? " active" : ""}`}
                        onClick={() => setActiveImg(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Safety Tips */}
              <div className="fd-tips" style={{ marginTop: 16 }}>
                <p className="fd-tips-title">⚠️ Food Safety Tips</p>
                <div className="fd-tip-item">✓ Check food hygiene rating before ordering</div>
                <div className="fd-tip-item">✓ Verify seller has proper food handling license</div>
                <div className="fd-tip-item">✓ Report any food quality issues immediately</div>
                <div className="fd-tip-item">✓ Prefer restaurants with Fresh & Hygienic badge</div>
              </div>
            </div>

            {/* ── RIGHT: DETAILS ── */}
            <div className="fd-right">

              {/* Main Info Panel */}
              <div className="fd-panel">
                <h1 className="fd-name">{item.name}</h1>
                <p className="fd-cuisine">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <FaUtensils size={11} color="#9ca3af" />
                    {item.cuisine}
                  </span>
                </p>
                <p className="fd-price">{item.pricePerMeal}</p>
                <div className="fd-price-divider" />

                {/* Star Rating */}
                <div style={{ marginBottom: 12 }}>
                  {renderStars(item.rating, item.reviewCount)}
                </div>

                <div className="fd-location">
                  <FiMapPin size={14} />
                  {item.distance} {item.location}, {item.district}
                </div>

                {item.description && (
                  <p className="fd-desc">{item.description}</p>
                )}

                {/* Details Grid */}
                <div className="fd-details-grid">
                  {item.deliveryTime && (
                    <div className="fd-detail-item">
                      <p className="fd-detail-label">Delivery Time</p>
                      <p className="fd-detail-val">
                        <FiTruck size={11} style={{ marginRight: 4 }} />
                        {item.deliveryTime}
                      </p>
                    </div>
                  )}
                  {item.minOrder && (
                    <div className="fd-detail-item">
                      <p className="fd-detail-label">Min. Order</p>
                      <p className="fd-detail-val">{item.minOrder}</p>
                    </div>
                  )}
                  {item.openingHours && (
                    <div className="fd-detail-item">
                      <p className="fd-detail-label">Open Hours</p>
                      <p className="fd-detail-val">
                        <FiClock size={11} style={{ marginRight: 4 }} />
                        {item.openingHours}
                      </p>
                    </div>
                  )}
                  {item.postedDaysAgo !== undefined && (
                    <div className="fd-detail-item">
                      <p className="fd-detail-label">Posted</p>
                      <p className="fd-detail-val">
                        {item.postedDaysAgo === 0 ? "Today" : `${item.postedDaysAgo} day${item.postedDaysAgo > 1 ? "s" : ""} ago`}
                      </p>
                    </div>
                  )}
                  <div className="fd-detail-item">
                    <p className="fd-detail-label">Food Type</p>
                    <p className="fd-detail-val">{item.foodType}</p>
                  </div>
                  <div className="fd-detail-item">
                    <p className="fd-detail-label">Distance</p>
                    <p className="fd-detail-val">{item.distance}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="fd-badges-row">
                  {item.isFreshAndHygienic && (
                    <span className="fd-badge-hygienic">
                      <FaLeaf size={11} /> Fresh & Hygienic
                    </span>
                  )}
                  {item.isOpenToOffers && (
                    <span className="fd-badge-offer">
                      <FiCheckCircle size={11} /> Open to Offers
                    </span>
                  )}
                  {item.tags.map((tag) => (
                    <span key={tag} className="fd-badge-tag">#{tag}</span>
                  ))}
                </div>

                {/* Availability */}
                <div className="fd-avail">
                  <span className="fd-avail-dot" />
                  Currently Accepting Orders
                </div>

                {/* Action Buttons */}
                <div className="fd-actions">
                  <Link
                    href={`tel:${item.sellerPhone}`}
                    className="fd-btn-order"
                  >
                    <FiMessageSquare size={16} />
                    Order Now
                  </Link>
                  <button
                    className="fd-btn-phone"
                    onClick={() => window.open(`tel:${item.sellerPhone}`, "_self")}
                  >
                    <FiPhone size={16} />
                  </button>
                  <button
                    className="fd-btn-share"
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

              {/* Seller Panel */}
              <div className="fd-seller-panel">
                <p className="fd-seller-title">Seller Information</p>
                <div className="fd-seller-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="fd-seller-avatar">
                      {(item.sellerName ?? "S")[0]}
                    </div>
                    <div>
                      <p className="fd-seller-name">{item.sellerName ?? "Unknown Seller"}</p>
                      <p className="fd-seller-phone">{item.sellerPhone}</p>
                    </div>
                  </div>
                  <button
                    className="fd-seller-chat-btn"
                    onClick={() => window.open(`tel:${item.sellerPhone}`, "_self")}
                  >
                    <FiPhone size={13} /> Call Now
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── RELATED LISTINGS ── */}
          {related.length > 0 && (
            <div className="fd-related">
              <p className="fd-related-title">Similar {item.foodType} Restaurants</p>
              <div className="fd-related-grid">
                {related.map((r) => (
                  <Link key={r.id} href={`/category/food/${r.id}`} className="fd-rel-card">
                    <div className="fd-rel-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.images[0]} alt={r.name} className="fd-rel-img" />
                    </div>
                    <div className="fd-rel-body">
                      <p className="fd-rel-name">{r.name}</p>
                      <p className="fd-rel-price">{r.pricePerMeal}</p>
                      <p className="fd-rel-loc"><FiMapPin size={10} />{r.distance} {r.location}</p>
                      <div className="fd-rel-rating">
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