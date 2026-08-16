"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiChevronDown,
  FiMapPin,
  FiHeart,
  FiRotateCcw,
  FiShoppingCart,
  FiCheckCircle,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

/* ─────────── MOCK PRODUCTS (SHARED) ─────────── */
export const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "iPhone 14 Pro 128GB",
    thumb: "/iphone.jpg",
    images: ["/iphone.jpg", "/iphone2.jpg", "/iphone3.jpg"],
    category: "mobiles-tablets",
    condition: "new",
    price: 8500,
    priceDisplay: "NPR 8,500",
    location: "Koteshwor",
    timeAgo: "2 hours ago",
    postedDaysAgo: 0,
    badge: "New",
    badgeColor: "#10b981",
    description: "Brand new iPhone 14 Pro 128GB in Deep Purple. Never used, sealed box with all accessories included. Comes with 1 year Apple warranty. Original bill available.",
    detailedDescription: "This iPhone 14 Pro is in pristine condition. It was received as a gift but never opened. The box contains the iPhone, USB-C to Lightning cable, documentation, and SIM ejector tool. Color: Deep Purple. Storage: 128GB. Warranty valid until next year.",
    seller: { id: "seller-1", name: "Ram Sharma", avatar: "/avatar1.jpg", phone: "9801234567", joined: "Jan 2023", rating: 4.8, listings: 12 },
    tags: ["Apple", "128GB", "Deep Purple", "Sealed Box"],
    details: [
      { label: "Brand", value: "Apple" },
      { label: "Model", value: "iPhone 14 Pro" },
      { label: "Storage", value: "128GB" },
      { label: "Color", value: "Deep Purple" },
      { label: "Warranty", value: "1 Year" },
      { label: "Condition", value: "Brand New" },
    ],
    negotiable: true,
    deliveryAvailable: true,
    warrantyAvailable: true,
    reviews: [
      { reviewerName: "Sita K.", rating: 5, comment: "Genuine product, fast delivery!", createdAt: "2 weeks ago" },
      { reviewerName: "Hari M.", rating: 4, comment: "Good seller, recommended.", createdAt: "1 month ago" },
    ],
  },
  {
    id: "2",
    title: "MacBook Air M1 256GB",
    thumb: "/macbook.png",
    images: ["/macbook.png", "/macbook2.jpg"],
    category: "electronics",
    condition: "used",
    price: 89500,
    priceDisplay: "NPR 89,500",
    location: "Lalitpur",
    timeAgo: "5 hours ago",
    postedDaysAgo: 0,
    badge: "Used",
    badgeColor: "#f43f5e",
    description: "MacBook Air M1 256GB in excellent condition. Battery cycle count only 45. Minor scratches on the bottom. Original charger included. Box available.",
    detailedDescription: "Selling my MacBook Air M1 as I am upgrading to a Pro model. The laptop has been used carefully for office work only. Battery health is at 98%. Comes with original 30W charger and USB-C cable. Minor cosmetic wear on the bottom panel only.",
    seller: { id: "seller-2", name: "Sita Gurung", avatar: "/avatar2.jpg", phone: "9809876543", joined: "Mar 2022", rating: 4.5, listings: 8 },
    tags: ["Apple", "M1 Chip", "256GB", "Silver"],
    details: [
      { label: "Brand", value: "Apple" },
      { label: "Model", value: "MacBook Air M1" },
      { label: "Storage", value: "256GB SSD" },
      { label: "RAM", value: "8GB" },
      { label: "Battery Cycles", value: "45" },
      { label: "Condition", value: "Like New" },
    ],
    negotiable: true,
    deliveryAvailable: true,
    warrantyAvailable: false,
    reviews: [
      { reviewerName: "Dipak R.", rating: 5, comment: "Exactly as described. Very happy!", createdAt: "3 days ago" },
    ],
  },
  {
    id: "3",
    title: "Badminton Racket Set",
    thumb: "/badminton.jpg",
    images: ["/badminton.jpg"],
    category: "sports",
    condition: "used",
    price: 500,
    priceDisplay: "NPR 500",
    location: "Ratnapark, Kathmandu",
    timeAgo: "1 day ago",
    postedDaysAgo: 1,
    badge: "Used",
    badgeColor: "#f43f5e",
    description: "Yonex badminton racket set with 2 rackets and shuttlecocks. Used for 3 months, good condition. Strings are intact.",
    detailedDescription: "Yonex GR-303 badminton racket set. Includes 2 rackets and 3 shuttlecocks. Grip tape is fresh. Strings have good tension. Selling because I am moving to a different city.",
    seller: { id: "seller-3", name: "Hari Prasad", avatar: "/avatar3.jpg", phone: "9812345678", joined: "Jun 2024", rating: 4.2, listings: 3 },
    tags: ["Yonex", "Racket Set", "Sports"],
    details: [
      { label: "Brand", value: "Yonex" },
      { label: "Model", value: "GR-303" },
      { label: "Quantity", value: "2 Rackets" },
      { label: "Includes", value: "3 Shuttlecocks" },
      { label: "Condition", value: "Good" },
      { label: "Usage", value: "3 Months" },
    ],
    negotiable: false,
    deliveryAvailable: false,
    warrantyAvailable: false,
    reviews: [],
  },
  {
    id: "4",
    title: "Wooden Dining Table Set",
    thumb: "/table.png",
    images: ["/table.png", "/table2.jpg"],
    category: "home-living",
    condition: "used",
    price: 18500,
    priceDisplay: "NPR 18,500",
    location: "Lalitpur",
    timeAgo: "1 day ago",
    postedDaysAgo: 1,
    badge: "Used",
    badgeColor: "#f43f5e",
    description: "Solid teak wood dining table with 6 chairs. Beautiful craftsmanship, 2 years old. Moving out sale. Must go this week.",
    detailedDescription: "Handcrafted solid teak wood dining table with matching 6 chairs. The set is 2 years old and has been well maintained. Minor scratches on the table surface that can be polished out. Dimensions: 6ft x 3ft. Chairs have cushion seats.",
    seller: { id: "seller-4", name: "Anita Devi", avatar: "/avatar4.jpg", phone: "9823456789", joined: "Nov 2021", rating: 4.9, listings: 25 },
    tags: ["Teak Wood", "6 Seater", "Dining Set", "Furniture"],
    details: [
      { label: "Material", value: "Solid Teak Wood" },
      { label: "Seats", value: "6 Chairs" },
      { label: "Table Size", value: "6ft x 3ft" },
      { label: "Age", value: "2 Years" },
      { label: "Condition", value: "Good" },
      { label: "Assembly", value: "Pre-assembled" },
    ],
    negotiable: true,
    deliveryAvailable: true,
    warrantyAvailable: false,
    reviews: [
      { reviewerName: "Bikash T.", rating: 5, comment: "Great quality furniture. Seller was very cooperative.", createdAt: "1 week ago" },
    ],
  },
  {
    id: "5",
    title: "Football Jersey (Barcelona)",
    thumb: "/jersey.jpg",
    images: ["/jersey.jpg", "/jersey2.jpg"],
    category: "fashion",
    condition: "new",
    price: 2500,
    priceDisplay: "NPR 2,500",
    location: "Rupandehi",
    timeAgo: "2 hours ago",
    postedDaysAgo: 0,
    badge: "New",
    badgeColor: "#10b981",
    description: "Official Barcelona home jersey 2024/25 season. Size M. Authentic tags attached. Never worn.",
    detailedDescription: "100% authentic Nike Barcelona home jersey for the 2024/25 season. Size Medium. Dri-FIT technology. Player version with heat-pressed badges. Tags still attached. Perfect gift for a Barca fan.",
    seller: { id: "seller-5", name: "Bikash Thapa", avatar: "/avatar5.jpg", phone: "9834567890", joined: "Feb 2024", rating: 4.6, listings: 6 },
    tags: ["Nike", "Barcelona", "Size M", "Authentic"],
    details: [
      { label: "Brand", value: "Nike" },
      { label: "Team", value: "FC Barcelona" },
      { label: "Season", value: "2024/25" },
      { label: "Size", value: "Medium" },
      { label: "Condition", value: "Brand New" },
      { label: "Authenticity", value: "Original" },
    ],
    negotiable: false,
    deliveryAvailable: true,
    warrantyAvailable: false,
    reviews: [],
  },
  {
    id: "6",
    title: "Bajaj Pulsar 150",
    thumb: "/bajaj.avif",
    images: ["/bajaj.avif", "/bajaj2.jpg"],
    category: "vehicles",
    condition: "new",
    price: 850500,
    priceDisplay: "NPR 8,50,500",
    location: "Lalitpur",
    timeAgo: "5 hours ago",
    postedDaysAgo: 0,
    badge: "New",
    badgeColor: "#10b981",
    extra: "1200 Km",
    description: "Bajaj Pulsar 150 2024 model. Single owner, well maintained. All papers clear. Test ride available.",
    detailedDescription: "2024 model Bajaj Pulsar 150 in excellent condition. Single owner, regularly serviced at authorized service center. All documents including blue book, insurance, and pollution certificate are up to date. New tires installed 2 months ago. Test ride available at Lalitpur.",
    seller: { id: "seller-6", name: "Dipak Rana", avatar: "/avatar6.jpg", phone: "9845678901", joined: "Aug 2020", rating: 4.7, listings: 18 },
    tags: ["Bajaj", "Pulsar 150", "2024 Model", "Single Owner"],
    details: [
      { label: "Brand", value: "Bajaj" },
      { label: "Model", value: "Pulsar 150" },
      { label: "Year", value: "2024" },
      { label: "KM Driven", value: "1,200" },
      { label: "Owner", value: "1st" },
      { label: "Condition", value: "Excellent" },
    ],
    negotiable: true,
    deliveryAvailable: false,
    warrantyAvailable: false,
    reviews: [
      { reviewerName: "Maya S.", rating: 5, comment: "Bike is in amazing condition. Papers all clear.", createdAt: "2 weeks ago" },
    ],
  },
  {
    id: "7",
    title: "4th Floor House for Rent",
    thumb: "/house.jpg",
    images: ["/house.jpg", "/house2.jpg", "/house3.jpg"],
    category: "property",
    condition: "used",
    price: 150000,
    priceDisplay: "NPR 1,50,000",
    location: "Ratnapark, Kathmandu",
    timeAgo: "1 day ago",
    postedDaysAgo: 1,
    badge: null,
    badgeColor: "",
    description: "Spacious 4th floor house with 3 bedrooms, 2 bathrooms, kitchen, and living room. 24/7 water supply. Parking available.",
    detailedDescription: "Beautiful 4th floor apartment in a prime location near Ratnapark. The house gets plenty of natural light and has a balcony with city views. 3 spacious bedrooms with built-in wardrobes, 2 modern bathrooms, modular kitchen, and a large living room. 24/7 water and electricity. Covered parking for 1 car and 2 bikes. Close to schools, hospitals, and markets.",
    seller: { id: "seller-7", name: "Property Nepal", avatar: "/avatar7.jpg", phone: "9856789012", joined: "Jan 2020", rating: 4.3, listings: 42 },
    tags: ["3 BHK", "Parking", "Balcony", "Furnished"],
    details: [
      { label: "Type", value: "Apartment" },
      { label: "Bedrooms", value: "3" },
      { label: "Bathrooms", value: "2" },
      { label: "Floor", value: "4th" },
      { label: "Furnishing", value: "Semi-Furnished" },
      { label: "Parking", value: "1 Car + 2 Bikes" },
    ],
    negotiable: true,
    deliveryAvailable: false,
    warrantyAvailable: false,
    reviews: [],
  },
  {
    id: "8",
    title: "Baby Cloth Set (0-6 months)",
    thumb: "/baby.png",
    images: ["/baby.png", "/baby2.jpg"],
    category: "fashion",
    condition: "new",
    price: 1500,
    priceDisplay: "NPR 1,500",
    location: "Lalitpur",
    timeAgo: "1 day ago",
    postedDaysAgo: 1,
    badge: "New",
    badgeColor: "#10b981",
    description: "Soft cotton baby clothes set for 0-6 months. Includes 5 onesies, 3 pairs of socks, and 2 caps. Unisex colors.",
    detailedDescription: "Premium quality 100% organic cotton baby clothing set. Includes 5 short-sleeve onesies, 3 pairs of anti-slip socks, and 2 cute caps. All items are machine washable and have snap buttons for easy diaper changes. Perfect baby shower gift. Colors: white, cream, light blue, light pink, mint green.",
    seller: { id: "seller-8", name: "Maya Shrestha", avatar: "/avatar8.jpg", phone: "9867890123", joined: "Apr 2023", rating: 4.9, listings: 15 },
    tags: ["Organic Cotton", "0-6 Months", "Unisex", "Gift Set"],
    details: [
      { label: "Material", value: "100% Organic Cotton" },
      { label: "Age Group", value: "0-6 Months" },
      { label: "Set Includes", value: "5 Onesies + 3 Socks + 2 Caps" },
      { label: "Gender", value: "Unisex" },
      { label: "Care", value: "Machine Washable" },
      { label: "Condition", value: "Brand New" },
    ],
    negotiable: false,
    deliveryAvailable: true,
    warrantyAvailable: false,
    reviews: [
      { reviewerName: "Anita D.", rating: 5, comment: "So soft and cute! Fast delivery.", createdAt: "3 days ago" },
    ],
  },
];

/* ─────────── CONFIG ─────────── */
const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "mobiles-tablets", label: "Mobiles & Tablets" },
  { id: "electronics", label: "Electronics" },
  { id: "vehicles", label: "Vehicles" },
  { id: "fashion", label: "Fashion" },
  { id: "home-living", label: "Home & Living" },
  { id: "sports", label: "Sports" },
  { id: "property", label: "Property" },
];

const LOCATIONS = ["All Locations", "Koteshwor", "Lalitpur", "Ratnapark, Kathmandu", "Rupandehi"];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
];

const MAX_PRICE = 1000000;

/* ─────────── TOAST TYPE ─────────── */
interface Toast {
  id: number;
  message: string;
  type: "success" | "info";
}

/* ─────────── STYLES ─────────── */
const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; }
.buy-wrap { min-height: 100vh; background: #f9fafb; font-family: 'Inter', -apple-system, sans-serif; }

.toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.toast-item { display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: #fff; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #10b981; font-size: 13px; font-weight: 600; color: #111827; animation: toastSlide 0.35s cubic-bezier(0.32, 0.72, 0, 1); pointer-events: auto; min-width: 260px; max-width: 360px; }
.toast-item.info { border-left-color: #3b82f6; }
.toast-item.exit { animation: toastFade 0.25s ease forwards; }
@keyframes toastSlide { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes toastFade { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }

.buy-hero { position: relative; height: 280px; overflow: hidden; display: flex; align-items: center; background: linear-gradient(135deg, #f5d0c5 0%, #e8b4a2 50%, #d4a08a 100%); }
.buy-hero-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 40px; position: relative; z-index: 2; }
.buy-hero-text { flex: 1; max-width: 520px; }
.buy-hero-text h1 { font-size: 32px; font-weight: 800; color: #1f1f1f; margin: 0 0 8px; letter-spacing: -0.5px; }
.buy-hero-text p { color: #5a4a42; font-size: 14px; margin: 0 0 20px; font-weight: 500; }
.buy-search-box { display: flex; align-items: center; background: #fff; border-radius: 8px; overflow: hidden; max-width: 480px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.buy-search-input { flex: 1; border: none; outline: none; padding: 12px 16px; font-size: 14px; color: #374151; font-family: inherit; }
.buy-search-input::placeholder { color: #9ca3af; }
.buy-search-btn { padding: 0 24px; height: 44px; background: #e11d48; color: #fff; border: none; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.buy-search-btn:hover { background: #be123c; }
.buy-hero-images { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.buy-hero-img { width: 100px; height: 160px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.buy-hero-img:nth-child(2) { width: 90px; height: 140px; margin-top: 20px; }
.buy-hero-img:nth-child(3) { width: 110px; height: 150px; margin-bottom: 10px; }

.buy-body { max-width: 1280px; margin: 0 auto; padding: 24px 20px 60px; display: flex; gap: 20px; }

.buy-sidebar { width: 240px; flex-shrink: 0; background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; align-self: flex-start; position: sticky; top: 20px; overflow: hidden; }
.buy-sb-head { padding: 14px 18px; font-size: 15px; font-weight: 700; color: #111827; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
.buy-sb-reset { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #e11d48; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.15s; font-family: inherit; }
.buy-sb-reset:hover { background: #fef2f2; }
.buy-sb-section { padding: 14px 18px; border-bottom: 1px solid #f3f4f6; }
.buy-sb-section:last-of-type { border-bottom: none; }
.buy-sb-title { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.buy-sb-title svg { color: #9ca3af; }

.buy-cat-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer; }
.buy-cat-item:last-child { margin-bottom: 0; }
.buy-cb { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #fff; transition: all 0.15s; cursor: pointer; }
.buy-cb.checked { border-color: #e11d48; background: #e11d48; }
.buy-cb.checked::after { content: "✓"; color: #fff; font-size: 9px; font-weight: 800; }
.buy-cb-label { font-size: 12.5px; color: #4b5563; font-weight: 500; }

.buy-price-wrap { position: relative; height: 4px; background: #e5e7eb; border-radius: 2px; margin: 14px 0 8px; }
.buy-price-fill { position: absolute; left: 0; top: 0; bottom: 0; background: #e11d48; border-radius: 2px; opacity: 0.3; }
.buy-price-handle { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: #fff; border: 2px solid #e11d48; border-radius: 50%; cursor: pointer; z-index: 2; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
.buy-price-handle-left { left: 0; }
.buy-price-labels { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; font-weight: 500; }
.buy-price-slider { width: 100%; margin-top: 10px; -webkit-appearance: none; height: 4px; border-radius: 2px; background: transparent; outline: none; position: relative; z-index: 3; }
.buy-price-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #e11d48; cursor: pointer; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }

.buy-select-wrap { position: relative; }
.buy-select { width: 100%; padding: 8px 28px 8px 10px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 12px; color: #374151; background: #fff; outline: none; font-family: inherit; cursor: pointer; appearance: none; }
.buy-select-wrap svg { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #9ca3af; }

.buy-cond-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer; }
.buy-cond-item:last-child { margin-bottom: 0; }

.buy-main { flex: 1; min-width: 0; }
.buy-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
.buy-count { font-size: 16px; color: #111827; font-weight: 700; }
.buy-sort-dropdown { position: relative; }
.buy-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.buy-sort-btn:hover { border-color: #d1d5db; }
.buy-sort-menu { position: absolute; top: calc(100% + 6px); right: 0; min-width: 180px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; animation: buySortFade 0.15s ease; }
@keyframes buySortFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.buy-sort-option { padding: 9px 14px; font-size: 13px; color: #4b5563; cursor: pointer; transition: all 0.15s; border-bottom: 1px solid #f9fafb; }
.buy-sort-option:last-child { border-bottom: none; }
.buy-sort-option:hover { background: #fef2f2; color: #e11d48; }
.buy-sort-option.active { background: #e11d48; color: #fff; }

.buy-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.buy-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; }
.buy-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.buy-card-img-wrap { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #f3f4f6; }
.buy-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.buy-card:hover .buy-card-img { transform: scale(1.04); }
.buy-card-badge { position: absolute; top: 10px; right: 10px; font-size: 9px; font-weight: 800; border-radius: 4px; padding: 3px 8px; letter-spacing: 0.3px; text-transform: uppercase; color: #fff; }
.buy-card-fav { position: absolute; top: 10px; left: 10px; width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.95); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.12); transition: all 0.15s; padding: 0; z-index: 2; }
.buy-card-fav:hover { transform: scale(1.1); }

.buy-card-body { padding: 12px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
.buy-card-title { font-size: 14px; font-weight: 700; color: #111827; margin: 0; line-height: 1.3; }
.buy-card-price { font-size: 14px; font-weight: 800; color: #e11d48; margin: 2px 0; }
.buy-card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; font-size: 11.5px; color: #6b7280; font-weight: 500; }
.buy-card-loc { display: flex; align-items: center; gap: 3px; }
.buy-card-loc svg { color: #9ca3af; }

.buy-card-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 8px; border-top: 1px solid #f3f4f6; }
.buy-btn { flex: 1; height: 34px; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s; border: none; white-space: nowrap; }
.buy-btn-add { background: #fff0f3; color: #e11d48; border: 1.5px solid #fecdd3; }
.buy-btn-add:hover { background: #e11d48; color: #fff; border-color: #e11d48; }
.buy-btn-buy { background: #e11d48; color: #fff; box-shadow: 0 2px 8px rgba(225,29,72,0.25); }
.buy-btn-buy:hover { background: #be123c; box-shadow: 0 4px 12px rgba(225,29,72,0.35); }
.buy-btn:active { transform: scale(0.97); }

.buy-empty, .buy-state { text-align: center; padding: 70px 24px; background: #fff; border-radius: 10px; border: 1px solid #e5e7eb; }
.buy-empty p, .buy-state p { font-weight: 700; font-size: 16px; color: #111827; margin: 0 0 4px; }
.buy-empty span, .buy-state span { font-size: 13px; color: #6b7280; }
.buy-empty-btn { margin-top: 14px; padding: 9px 22px; background: #e11d48; color: #fff; font-weight: 700; font-size: 13px; border: none; border-radius: 7px; cursor: pointer; font-family: inherit; }

@media (max-width: 1100px) {
  .buy-hero-images { display: none; }
  .buy-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .buy-sidebar { display: none; }
  .buy-grid { grid-template-columns: repeat(2, 1fr); }
  .toast-container { right: 12px; top: 12px; }
}
@media (max-width: 640px) {
  .buy-grid { grid-template-columns: 1fr; }
  .buy-body { padding: 16px 16px 40px; }
  .buy-hero-text h1 { font-size: 24px; }
  .buy-search-box { flex-direction: column; overflow: visible; background: transparent; box-shadow: none; gap: 8px; }
  .buy-search-input { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .buy-search-btn { width: 100%; border-radius: 8px; height: 44px; }
  .toast-item { min-width: auto; max-width: calc(100vw - 24px); font-size: 12px; padding: 10px 14px; }
}
`;

/* ─────────── COMPONENT ─────────── */
export default function BuyPage() {
  const [products] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [conditionNew, setConditionNew] = useState(false);
  const [conditionUsed, setConditionUsed] = useState(false);

  /* ─── CART & WISHLIST STATE ─── */
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  /* ─── TOAST STATE ─── */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
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

  /* ─── TOAST HELPERS ─── */
  const showToast = (message: string, type: "success" | "info" = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  /* ─── CART ACTIONS ─── */
  const addToCart = (item: typeof MOCK_PRODUCTS[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    showToast(`${item.title} added to cart`);
  };

  const buyNow = (item: typeof MOCK_PRODUCTS[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    showToast(`${item.title} added to cart — Proceeding to checkout...`);
  };

  /* ─── WISHLIST ACTIONS ─── */
  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item = products.find((p) => p.id === id);
    const isCurrentlyFav = !!favorites[id];
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
    if (!isCurrentlyFav) {
      showToast(`${item?.title} added to wishlist`, "info");
    } else {
      showToast(`${item?.title} removed from wishlist`, "info");
    }
  };

  const reset = () => {
    setActiveCategory("all");
    setMaxPrice(MAX_PRICE);
    setSelectedLocation("All Locations");
    setConditionNew(false);
    setConditionUsed(false);
    setSearch("");
    setSort("popular");
  };

  /* ─── FILTER LOGIC ─── */
  const displayed = products.filter((item) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const hay = `${item.title} ${item.location}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (item.price > maxPrice) return false;
    if (selectedLocation !== "All Locations" && item.location !== selectedLocation) return false;
    if (conditionNew && conditionUsed) {
      /* both selected = show all */
    } else if (conditionNew && item.condition !== "new") return false;
    else if (conditionUsed && item.condition !== "used") return false;
    return true;
  });

  /* ─── SORT LOGIC ─── */
  const sortedDisplayed = [...displayed].sort((a, b) => {
    if (sort === "popular") return b.price - a.price;
    if (sort === "newest") return parseInt(b.id) - parseInt(a.id);
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    return 0;
  });

  const sortLabel: Record<string, string> = {
    popular: "Popular",
    newest: "Newest",
    "price-low": "Price Low to High",
    "price-high": "Price High to Low",
  };

  const pricePercent = (maxPrice / MAX_PRICE) * 100;

  return (
    <>
      <style>{pageStyles}</style>

      {/* ─── TOAST NOTIFICATIONS ─── */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            <FiCheckCircle size={16} color={t.type === "info" ? "#3b82f6" : "#10b981"} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <div className="buy-wrap">
        {/* Hero */}
        <section className="buy-hero">
          <div className="buy-hero-inner">
            <div className="buy-hero-text">
              <h1>Find Everything You Need</h1>
              <p>Shop from thousands of new and secondhand items near you</p>
              <div className="buy-search-box">
                <FiSearch size={16} style={{ marginLeft: 14, color: '#9ca3af', flexShrink: 0 }} />
                <input
                  className="buy-search-input"
                  placeholder="Search for product, brand and more"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="buy-search-btn">Search</button>
              </div>
            </div>
            <div className="buy-hero-images">
              <img src="/gift.jpg" alt="" className="buy-hero-img" />
              <img src="/mobile.png" alt="" className="buy-hero-img" />
              <img src="/clothes.png" alt="" className="buy-hero-img" />
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="buy-body">
          {/* Sidebar */}
          <aside className="buy-sidebar">
            <div className="buy-sb-head">
              Filter
              <button className="buy-sb-reset" onClick={reset}>
                <FiRotateCcw size={12} />
                Reset
              </button>
            </div>

            {/* Category */}
            <div className="buy-sb-section">
              <p className="buy-sb-title">Category <FiChevronDown size={12} /></p>
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="buy-cat-item"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className={`buy-cb${activeCategory === cat.id ? " checked" : ""}`} />
                  <span className="buy-cb-label">{cat.label}</span>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="buy-sb-section">
              <p className="buy-sb-title">Price Range</p>
              <div className="buy-price-wrap">
                <div className="buy-price-fill" style={{ width: `${pricePercent}%` }} />
                <div className="buy-price-handle buy-price-handle-left" style={{ left: `${pricePercent}%` }} />
              </div>
              <input
                type="range"
                className="buy-price-slider"
                min="0"
                max={MAX_PRICE}
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="buy-price-labels">
                <span>Rs. 0</span>
                <span>Rs. {maxPrice >= MAX_PRICE ? "10,00,000+" : maxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Location */}
            <div className="buy-sb-section">
              <p className="buy-sb-title">Location</p>
              <div className="buy-select-wrap">
                <select
                  className="buy-select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <FiChevronDown size={12} />
              </div>
            </div>

            {/* Condition */}
            <div className="buy-sb-section">
              <p className="buy-sb-title">Condition</p>
              <div className="buy-cond-item" onClick={() => setConditionNew(!conditionNew)}>
                <div className={`buy-cb${conditionNew ? " checked" : ""}`} />
                <span className="buy-cb-label">New</span>
              </div>
              <div className="buy-cond-item" onClick={() => setConditionUsed(!conditionUsed)}>
                <div className={`buy-cb${conditionUsed ? " checked" : ""}`} />
                <span className="buy-cb-label">Used</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="buy-main">
            {loading ? (
              <div className="buy-state">
                <p>Loading items...</p>
              </div>
            ) : (
              <>
                <div className="buy-results-header">
                  <span className="buy-count">{sortedDisplayed.length.toLocaleString()} Items Found</span>
                  <div className="buy-sort-dropdown" ref={sortRef}>
                    <button className="buy-sort-btn" onClick={() => setIsSortOpen((v) => !v)}>
                      Sort by: {sortLabel[sort]}
                      <FiChevronDown
                        size={13}
                        style={{ transform: isSortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                      />
                    </button>
                    {isSortOpen && (
                      <div className="buy-sort-menu">
                        {SORT_OPTIONS.map((opt) => (
                          <div
                            key={opt.value}
                            className={`buy-sort-option${sort === opt.value ? " active" : ""}`}
                            onClick={() => { setSort(opt.value); setIsSortOpen(false); }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {sortedDisplayed.length === 0 ? (
                  <div className="buy-empty">
                    <FiSearch size={44} style={{ color: '#d1d5db', marginBottom: 14 }} />
                    <p>No items found</p>
                    <span>Try adjusting your filters or search term</span>
                    <br />
                    <button className="buy-empty-btn" onClick={reset}>Reset Filters</button>
                  </div>
                ) : (
                  <div className="buy-grid">
                    {sortedDisplayed.map((item) => {
                      const isFav = !!favorites[item.id];
                      return (
                        <Link key={item.id} href={`/buy/${item.id}`} className="buy-card">
                          <div className="buy-card-img-wrap">
                            <img src={item.thumb} alt={item.title} className="buy-card-img" />
                            {item.badge && (
                              <span className="buy-card-badge" style={{ background: item.badgeColor }}>
                                {item.badge}
                              </span>
                            )}
                            <button className="buy-card-fav" onClick={(e) => toggleFav(item.id, e)}>
                              {isFav ? <FaHeart size={12} color="#ef4444" /> : <FiHeart size={12} color="#9ca3af" />}
                            </button>
                          </div>
                          <div className="buy-card-body">
                            <p className="buy-card-title">{item.title}</p>
                            <p className="buy-card-price">{item.priceDisplay}</p>
                            <div className="buy-card-meta">
                              <span className="buy-card-loc">
                                <FiMapPin size={11} />
                                {item.location}
                              </span>
                              <span>{item.timeAgo}</span>
                            </div>
                            {item.extra && (
                              <div className="buy-card-meta" style={{ marginTop: 0 }}>
                                <span></span>
                                <span>{item.extra}</span>
                              </div>
                            )}
                            <div className="buy-card-actions">
                              <button className="buy-btn buy-btn-add" onClick={(e) => addToCart(item, e)}>
                                <FiShoppingCart size={14} />
                                Add to Cart
                              </button>
                              <button className="buy-btn buy-btn-buy" onClick={(e) => buyNow(item, e)}>
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </Link>
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