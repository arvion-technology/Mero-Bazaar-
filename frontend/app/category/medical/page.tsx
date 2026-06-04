"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiMapPin,
  FiHeart,
  FiChevronDown,
  FiCheckCircle,
  FiCalendar,
  FiStar,
  FiHome,
  FiClock,
  FiPhone,
  FiAward,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { FaHeart, FaStethoscope, FaHospital, FaClinicMedical, FaPills, FaAmbulance, FaFlask } from "react-icons/fa";

type MedicalListing = {
  id: string;
  name: string;
  specialty: string;
  type: string;
  rating: number;
  reviews: number;
  location: string;
  city: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  availableToday?: boolean;
  nmcNo?: string;
  consultationFee?: string;
  experience?: string;
  languages?: string[];
  services?: string[];
};

const LISTINGS: MedicalListing[] = [
  {
    id: "dr-sudhil-thapa",
    name: "Dr. Sudhil Thapa",
    specialty: "Cardiologist",
    type: "Doctors",
    rating: 4.8,
    reviews: 128,
    location: "Putalisadak, Kathmandu",
    city: "Kathmandu",
    image: "/sudhil.jpg",
    isVerified: true,
    availableToday: true,
    nmcNo: "12345",
    consultationFee: "NPR 1,000",
    experience: "15+ years",
    languages: ["English", "Nepali", "Hindi"],
    services: ["Consultation", "Checkup"],
  },
  {
    id: "dr-anisha-karki",
    name: "Dr. Anisha Karki",
    specialty: "BDS (Dentist)",
    type: "Doctors",
    rating: 4.8,
    reviews: 128,
    location: "Lalitpur, Nepal",
    city: "Lalitpur",
    image: "/anisha.jpg",
    isVerified: true,
    availableToday: true,
    nmcNo: "12346",
    consultationFee: "NPR 800",
    experience: "8+ years",
    languages: ["English", "Nepali"],
    services: ["Consultation", "Checkup", "Surgery"],
  },
  {
    id: "dr-rajan-shah",
    name: "Dr. Rajan Shah",
    specialty: "Pediatrician",
    type: "Doctors",
    rating: 4.8,
    reviews: 128,
    location: "Putalisadak, Kathmandu",
    city: "Kathmandu",
    image: "/rajan.jpg",
    isVerified: true,
    availableToday: true,
    nmcNo: "12347",
    consultationFee: "NPR 900",
    experience: "12+ years",
    languages: ["English", "Nepali", "Hindi"],
    services: ["Consultation", "Checkup"],
  },
  {
    id: "dr-prativa-malla",
    name: "Dr. Prativa Malla",
    specialty: "Dermatologist",
    type: "Doctors",
    rating: 4.8,
    reviews: 128,
    location: "Putalisadak, Kathmandu",
    city: "Kathmandu",
    image: "/prativa.jpg",
    isVerified: true,
    availableToday: true,
    nmcNo: "12348",
    consultationFee: "NPR 1,000",
    experience: "10+ years",
    languages: ["English", "Nepali"],
    services: ["Consultation", "Checkup", "Therapy"],
  },
  {
    id: "norvic-hospital",
    name: "Norvic International Hospital",
    specialty: "Multi-Specialty Healthcare",
    type: "Hospitals",
    rating: 4.7,
    reviews: 320,
    location: "Thapathali, Kathmandu",
    city: "Kathmandu",
    image: "/nervic.jpg",
    isVerified: true,
    availableToday: true,
    consultationFee: "NPR 1,500",
    experience: "Established 1993",
    languages: ["English", "Nepali"],
    services: ["Consultation", "Checkup", "Surgery", "Operation"],
  },
  {
    id: "kmc-hospital",
    name: "Kathmandu Medical College (KMC)",
    specialty: "General Medicine & Surgery",
    type: "Hospitals",
    rating: 4.5,
    reviews: 450,
    location: "Sinamangal, Kathmandu",
    city: "Kathmandu",
    image: "/hospital.png",
    isVerified: true,
    availableToday: true,
    consultationFee: "NPR 500",
    experience: "Teaching Hospital",
    languages: ["English", "Nepali"],
    services: ["Consultation", "Checkup", "Surgery", "Others"],
  },
  {
    id: "city-dental-clinic",
    name: "City Dental Clinic & Care",
    specialty: "Orthodontics & Dental Care",
    type: "Clinics",
    rating: 4.9,
    reviews: 88,
    location: "Sanepa, Lalitpur",
    city: "Lalitpur",
    image: "/Dental Checkup & Cleaning.avif",
    isVerified: true,
    availableToday: true,
    consultationFee: "NPR 800",
    experience: "10+ years",
    languages: ["English", "Nepali"],
    services: ["Consultation", "Checkup", "Surgery"],
  },
  {
    id: "srl-diagnostics",
    name: "SRL Diagnostics Centre",
    specialty: "Pathology & Radiology Labs",
    type: "Diagnostic",
    rating: 4.6,
    reviews: 156,
    location: "Maharajgunj, Kathmandu",
    city: "Kathmandu",
    image: "/daignostic centre.jpg",
    isVerified: true,
    availableToday: true,
    consultationFee: "NPR 600",
    experience: "ISO 9001:2015",
    languages: ["English", "Nepali"],
    services: ["Checkup", "Others"],
  },
  {
    id: "sajha-pharmacy",
    name: "Sajha Swasthya Sewa Cooperative",
    specialty: "24/7 Cooperative Pharmacy",
    type: "Pharmacy",
    rating: 4.8,
    reviews: 92,
    location: "Maharajgunj, Kathmandu",
    city: "Kathmandu",
    image: "/medical room.jpg",
    isVerified: true,
    availableToday: true,
    consultationFee: "N/A",
    experience: "Established 1964",
    languages: ["Nepali", "English"],
    services: ["Others"],
  },
  {
    id: "redcross-ambulance",
    name: "Nepal Red Cross Society Ambulance",
    specialty: "Emergency First Response Service",
    type: "Ambulance",
    rating: 4.9,
    reviews: 120,
    location: "Red Cross Marg, Kathmandu",
    city: "Kathmandu",
    image: "/medical room.jpg",
    isVerified: true,
    availableToday: true,
    consultationFee: "N/A",
    experience: "24/7 Support",
    languages: ["Nepali", "English"],
    services: ["Others"],
  }
];

const CATEGORIES = [
  { name: "Doctors", icon: FaStethoscope, count: 1245 },
  { name: "Hospitals", icon: FaHospital, count: 567 },
  { name: "Clinics", icon: FaClinicMedical, count: 245 },
  { name: "Diagnostic", icon: FaFlask, count: 345 },
  { name: "Pharmacy", icon: FaPills, count: 445 },
  { name: "Ambulance", icon: FaAmbulance, count: 145 },
];

const SPECIALIZATIONS = [
  "All Specialization",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Dentist",
  "General Physician",
];

const SERVICE_TYPES = ["All", "Consultation", "Checkup", "Surgery", "Therapy", "Operation", "Others"];
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal"];

const TIME_SLOTS = [
  { time: "10:00", period: "AM" },
  { time: "11:00", period: "AM", selected: true },
  { time: "12:00", period: "PM" },
  { time: "02:00", period: "PM" },
];

export default function MedicalPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("Doctors");
  const [city, setCity] = useState("");
  const [specialization, setSpecialization] = useState("All Specialization");
  const [serviceType, setServiceType] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const reset = () => {
    setCity("");
    setSpecialization("All Specialization");
    setServiceType("All");
    setAvailableOnly(false);
    setActiveCategory("Doctors");
    setSearch("");
  };

  const displayed = LISTINGS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.specialty.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || l.type === activeCategory;
    const matchCity = !city || l.city === city;
    const matchSpec =
      specialization === "All Specialization" ||
      l.specialty.toLowerCase().includes(specialization.toLowerCase());
    const matchService =
      serviceType === "All" ||
      (l.services && l.services.includes(serviceType));
    const matchAvail = !availableOnly || l.availableToday;
    return matchSearch && matchCat && matchCity && matchSpec && matchService && matchAvail;
  });

  const activeFiltersCount = [
    city,
    specialization !== "All Specialization" ? specialization : null,
    serviceType !== "All" ? serviceType : null,
    availableOnly ? "available" : null,
  ].filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .mp { background: #f2f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* ── HERO ── */
        .mp-hero {
          position: relative; height: 280px; overflow: hidden;
          display: flex; align-items: center;
        }
        .mp-hero-bg {
          position: absolute; inset: 0;
          background: url('/medical banner.jpg') center center / cover no-repeat;
          filter: brightness(0.42);
        }
        .mp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(15,32,90,0.8) 0%, rgba(10,80,60,0.55) 100%);
        }
        .mp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .mp-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.28);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .mp-hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 6px; line-height: 1.15;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
        }
        .mp-hero-title span { color: #5ef1c6; }
        .mp-hero-sub {
          color: rgba(255,255,255,0.78); font-size: 14px;
          margin: 0 0 22px; font-weight: 400;
        }
        .mp-search-wrap { position: relative; max-width: 520px; }
        .mp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none;
        }
        .mp-search {
          width: 100%; padding: 14px 16px 14px 46px;
          background: rgba(255,255,255,0.97); border: none; border-radius: 14px;
          font-size: 14px; color: #333; font-family: inherit; outline: none;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22); transition: box-shadow 0.2s;
        }
        .mp-search:focus { box-shadow: 0 6px 34px rgba(0,0,0,0.3); }
        .mp-hero-watermark {
          position: absolute; bottom: -18px; right: 28px;
          font-size: clamp(56px, 11vw, 100px); font-weight: 900;
          color: rgba(255,255,255,0.05); letter-spacing: -3px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        /* ── CATEGORY STRIP ── */
        .mp-cats-strip {
          background: #fff; border-bottom: 1.5px solid #eaeaea; padding: 18px 0;
        }
        .mp-cats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 28px;
        }
        .mp-cats-label { font-size: 13px; font-weight: 700; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.6px; }
        .mp-cats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .mp-cat-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 14px;
          border: 1.5px solid #e4e8f0; background: #fafbff;
          cursor: pointer; transition: all 0.18s;
          min-width: 140px; font-family: inherit; text-align: left;
        }
        .mp-cat-card:hover { border-color: #0d9488; background: #f0fdfa; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(13,148,136,0.12); }
        .mp-cat-card.active { border-color: #0d9488; background: #ccfbf1; box-shadow: 0 4px 16px rgba(13,148,136,0.2); }
        .mp-cat-icon { font-size: 22px; color: #0d9488; display: flex; align-items: center; }
        .mp-cat-card.active .mp-cat-icon { color: #0f766e; }
        .mp-cat-name { font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; }
        .mp-cat-count { font-size: 11px; color: #888; display: block; }

        /* ── BODY ── */
        .mp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .mp-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        /* ── SIDEBAR ── */
        .mp-sidebar {
          background: #fff; border-radius: 18px;
          border: 1.5px solid #e4e8f0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          z-index: 90;
        }
        .msf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f4f8;
        }
        .msf-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .msf-reset {
          font-size: 13px; font-weight: 700; color: #0d9488;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .msf-reset:hover { opacity: 0.7; }
        .msf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f4f8; }
        .msf-section:last-of-type { border-bottom: none; }
        .msf-label { font-size: 13.5px; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; }

        .msf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e4e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer; transition: border-color 0.2s;
        }
        .msf-select:focus { border-color: #0d9488; }

        .msf-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .msf-chip {
          padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e0e4f0; background: #fff; color: #555;
          cursor: pointer; transition: all 0.18s; font-family: inherit;
        }
        .msf-chip:hover { border-color: #0d9488; color: #0d9488; }
        .msf-chip.active { background: #0d9488; color: #fff; border-color: #0d9488; box-shadow: 0 2px 10px rgba(13,148,136,0.3); }

        .msf-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .msf-toggle-label { font-size: 13.5px; font-weight: 600; color: #333; }
        .msf-toggle { position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-block; }
        .msf-toggle input { opacity: 0; width: 0; height: 0; }
        .msf-toggle-track { position: absolute; inset: 0; background: #ddd; border-radius: 24px; transition: background 0.25s; }
        .msf-toggle input:checked + .msf-toggle-track { background: #0d9488; }
        .msf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
        }
        .msf-toggle input:checked ~ .msf-toggle-thumb { transform: translateX(20px); }

        .msf-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 13px; text-align: center;
          background: linear-gradient(90deg, #0d9488, #0f766e);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 18px rgba(13,148,136,0.32);
          transition: opacity 0.18s, transform 0.18s;
        }
        .msf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── RESULTS BAR ── */
        .mp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .mp-results-count { font-size: 14px; color: #666; font-weight: 500; }
        .mp-results-count strong { color: #111; font-weight: 800; }
        .mp-sort-select {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: border-color 0.2s;
        }
        .mp-sort-select:focus { border-color: #0d9488; }

        .mp-active-filters { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 6px; }
        .mp-active-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f0fdfa; color: #0d9488; border: 1.5px solid #ccfbf1;
          font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 8px;
        }
        .mp-active-tag button {
          background: none; border: none; cursor: pointer; display: flex; align-items: center;
          color: #0f766e; font-weight: 800; font-size: 10px;
        }
        .mp-active-tag button:hover { color: #115e59; }

        /* ── GRID ── */
        .mp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; }

        /* ── CARD ── */
        .mp-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #ececec;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05); cursor: pointer;
          padding: 20px;
        }
        .mp-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(0,0,0,0.12); border-color: #0d9488; }

        .mp-card-header {
          display: flex; gap: 16px; align-items: start;
        }

        .mp-img-wrap {
          position: relative; width: 88px; height: 88px; border-radius: 50%;
          overflow: hidden; background: #e8eaf0; flex-shrink: 0;
          border: 3px solid #f0fdfa; transition: border-color 0.22s;
        }
        .mp-card:hover .mp-img-wrap { border-color: #ccfbf1; }
        .mp-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .mp-heart {
          position: absolute; bottom: 0; right: 0;
          width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 1px solid #e4e8f0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: transform 0.18s, background 0.18s;
        }
        .mp-heart:hover { transform: scale(1.15); background: #f0fdfa; }

        .mp-info { flex: 1; min-width: 0; }
        .mp-specialty-badge {
          font-size: 10.5px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: inline-block;
        }
        .mp-title {
          font-size: 16px; font-weight: 800; color: #111; line-height: 1.3; margin: 0 0 4px;
        }
        .mp-badges {
          display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;
        }
        .mp-badge-verified {
          display: inline-flex; align-items: center; gap: 3px;
          background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf;
          font-size: 9.5px; font-weight: 700; padding: 1.5px 6px; border-radius: 20px;
        }
        .mp-badge-nmc {
          display: inline-flex; align-items: center; gap: 3px;
          background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
          font-size: 9.5px; font-weight: 700; padding: 1.5px 6px; border-radius: 20px;
        }

        .mp-rating-row {
          display: flex; align-items: center; gap: 12px; margin-top: 4px;
        }
        .mp-rating {
          font-size: 12.5px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 3px;
        }
        .mp-rating svg { color: #f59e0b; fill: #f59e0b; }
        .mp-reviews { font-size: 11.5px; color: #888; }
        .mp-exp { font-size: 12px; color: #555; display: flex; align-items: center; gap: 4px; }

        .mp-details {
          margin-top: 12px; display: flex; flex-direction: column; gap: 6px;
        }
        .mp-detail-item {
          font-size: 13px; color: #555; display: flex; align-items: center; gap: 6px;
        }
        .mp-detail-item svg { color: #9ca3af; flex-shrink: 0; }

        .mp-languages {
          display: flex; gap: 4px; flex-wrap: wrap; margin-top: 2px;
        }
        .mp-lang-tag {
          font-size: 10px; font-weight: 600; color: #6b7280; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;
        }

        .mp-divider { border: none; border-top: 1px solid #f2f4f8; margin: 16px 0; }

        .mp-card-footer {
          display: flex; flex-direction: column; gap: 12px; margin-top: auto;
        }
        .mp-footer-row {
          display: flex; justify-content: space-between; align-items: center;
        }
        .mp-price-label { font-size: 11.5px; color: #888; margin: 0; }
        .mp-price-val { font-size: 18px; font-weight: 800; color: #111; margin: 0; }

        .mp-status-badges { display: flex; gap: 6px; }
        .mp-status-badge {
          font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px;
        }
        .mp-status-avail { background: #d1fae5; color: #065f46; }
        .mp-status-home { background: #e0f2fe; color: #075985; }

        .mp-slots-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
        }
        .mp-slot-btn {
          text-align: center; padding: 6px 4px; border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; color: #374151; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s;
        }
        .mp-slot-btn:hover { border-color: #0d9488; color: #0d9488; }
        .mp-slot-btn.selected { background: #0d9488; border-color: #0d9488; color: #fff; box-shadow: 0 2px 8px rgba(13,148,136,0.25); }

        .mp-book-btn {
          width: 100%; padding: 12px; text-align: center;
          background: #0d9488; color: #fff; font-size: 13.5px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 14px rgba(13,148,136,0.25); display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.15s, transform 0.15s;
        }
        .mp-book-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── EMPTY ── */
        .mp-empty { grid-column: 1/-1; padding: 64px 24px; text-align: center; background: #fff; border-radius: 18px; border: 1.5px solid #ececec; }
        .mp-empty-icon { font-size: 52px; margin-bottom: 14px; }
        .mp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .mp-empty span { font-size: 13px; color: #aaa; }

        /* ── MOBILE FILTER BAR ── */
        .mp-mobile-filter-bar { display: none; margin-bottom: 16px; }
        .mp-mobile-filter-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #fff; border: 1.5px solid #e4e8f0; border-radius: 12px;
          padding: 12px; font-size: 14px; font-weight: 700; color: #333; cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .mp-mobile-filter-badge {
          background: #0d9488; color: #fff; font-size: 11px; font-weight: 700;
          padding: 2px 7px; border-radius: 100px; margin-left: 2px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .mp-layout { grid-template-columns: 1fr; }
          .mp-sidebar {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 2000;
            margin: 0;
            border-radius: 0;
            overflow-y: auto;
          }
          .mp-sidebar.show-mobile {
            display: block;
          }
          .mp-mobile-filter-bar { display: block; }
        }
        @media (max-width: 640px) {
          .mp-hero { height: 220px; }
          .mp-body { padding: 20px 16px 40px; }
          .mp-grid { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

      <div className="mp">
        {/* ── HERO ── */}
        <section className="mp-hero">
          <div className="mp-hero-bg" />
          <div className="mp-hero-overlay" />
          <div className="mp-hero-watermark">Medical</div>
          <div className="mp-hero-inner">
            <div className="mp-hero-tag">
              <FaStethoscope size={12} />
              Nepal&apos;s #1 Healthcare Directory
            </div>
            <h1 className="mp-hero-title">
              Find The Best<br />
              <span>Healthcare Services</span>
            </h1>
            <p className="mp-hero-sub">Trusted doctors, clinics, hospitals and medical services near you</p>
            <div className="mp-search-wrap">
              <FiSearch className="mp-search-icon" size={18} color="#aaa" />
              <input
                className="mp-search"
                placeholder="Search doctors, clinics, hospitals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY STRIP ── */}
        <section className="mp-cats-strip">
          <div className="mp-cats-inner">
            <p className="mp-cats-label">Medical Categories</p>
            <div className="mp-cats-row">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  className={`mp-cat-card${activeCategory === cat.name ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <span className="mp-cat-icon"><cat.icon size={22} /></span>
                  <span>
                    <span className="mp-cat-name">{cat.name}</span>
                    <span className="mp-cat-count">{cat.count.toLocaleString()} listings</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN BODY ── */}
        <div className="mp-body">
          {/* Mobile Filter Toggle */}
          <div className="mp-mobile-filter-bar">
            <button className="mp-mobile-filter-btn" onClick={() => setShowMobileFilters(true)}>
              <FiFilter size={16} />
              Filters {activeFiltersCount > 0 && <span className="mp-mobile-filter-badge">{activeFiltersCount}</span>}
            </button>
          </div>

          <div className="mp-layout">
            {/* ── SIDEBAR ── */}
            <aside className={`mp-sidebar ${showMobileFilters ? "show-mobile" : ""}`}>
              <div className="msf-head">
                <p className="msf-head-title">Filters</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button className="msf-reset" onClick={reset}>Reset All</button>
                  <button
                    className="lg:hidden"
                    onClick={() => setShowMobileFilters(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
                  >
                    <FiX size={18} color="#666" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="msf-section">
                <p className="msf-label">Location / City</p>
                <select className="msf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select City</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Specialization */}
              <div className="msf-section">
                <p className="msf-label">Specialization</p>
                <select className="msf-select" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div className="msf-section">
                <p className="msf-label">Service Type</p>
                <div className="msf-chips">
                  {SERVICE_TYPES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setServiceType(s)}
                      className={`msf-chip${serviceType === s ? " active" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="msf-section">
                <div className="msf-toggle-row">
                  <span className="msf-toggle-label">Available Today</span>
                  <label className="msf-toggle">
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => setAvailableOnly(e.target.checked)}
                    />
                    <span className="msf-toggle-track" />
                    <span className="msf-toggle-thumb" />
                  </label>
                </div>
              </div>

              <button className="msf-apply" onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </button>
            </aside>

            {/* ── RIGHT COLUMN ── */}
            <div>
              <div className="mp-results-bar">
                <div className="mp-results-count">
                  <span>
                    <strong>{displayed.length}</strong> results found
                  </span>
                  {(city || specialization !== "All Specialization" || serviceType !== "All") && (
                    <div className="mp-active-filters">
                      {city && (
                        <span className="mp-active-tag">
                          {city} <button onClick={() => setCity("")}><FiX /></button>
                        </span>
                      )}
                      {specialization !== "All Specialization" && (
                        <span className="mp-active-tag">
                          {specialization} <button onClick={() => setSpecialization("All Specialization")}><FiX /></button>
                        </span>
                      )}
                      {serviceType !== "All" && (
                        <span className="mp-active-tag">
                          {serviceType} <button onClick={() => setServiceType("All")}><FiX /></button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <select className="mp-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Medical Grid */}
              <div className="mp-grid">
                {displayed.length === 0 ? (
                  <div className="mp-empty">
                    <div className="mp-empty-icon">🏥</div>
                    <p>No results found</p>
                    <span>Try adjusting your filters or search query</span>
                  </div>
                ) : (
                  displayed.map((l) => {
                    const isFav = !!favorites[l.id];
                    return (
                      <Link key={l.id} href={`/category/medical/${l.id}`} className="mp-card" style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="mp-card-header">
                          <div className="mp-img-wrap">
                            <img src={l.image} alt={l.name} className="mp-img" />
                            <button className="mp-heart" aria-label="Save" onClick={(e) => toggleFav(l.id, e)}>
                              {isFav ? <FaHeart size={14} color="#e74c3c" /> : <FiHeart size={14} color="#9ca3af" />}
                            </button>
                          </div>
                          <div className="mp-info">
                            <span className="mp-specialty-badge">{l.specialty}</span>
                            <h3 className="mp-title">{l.name}</h3>
                            <div className="mp-badges">
                              {l.isVerified && <span className="mp-badge-verified">✓ Verified</span>}
                              {l.nmcNo && <span className="mp-badge-nmc">NMC NO. {l.nmcNo}</span>}
                            </div>
                            <div className="mp-rating-row">
                              <span className="mp-rating">
                                <FiStar size={13} /> {l.rating}
                              </span>
                              <span className="mp-reviews">({l.reviews} reviews)</span>
                              {l.experience && (
                                <>
                                  <span style={{ color: "#eee" }}>|</span>
                                  <span className="mp-exp">
                                    <FiAward size={13} /> {l.experience}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mp-details">
                          <div className="mp-detail-item">
                            <FiMapPin size={14} />
                            <span>{l.location}</span>
                          </div>
                          {l.languages && (
                            <div className="mp-detail-item">
                              <FiPhone size={13} style={{ transform: "rotate(90deg)" }} />
                              <div className="mp-languages">
                                {l.languages.map((lang) => (
                                  <span key={lang} className="mp-lang-tag">{lang}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <hr className="mp-divider" />

                        <div className="mp-card-footer">
                          <div className="mp-footer-row">
                            <div>
                              <p className="mp-price-label">Consultation Fee</p>
                              <p className="mp-price-val">{l.consultationFee}</p>
                            </div>
                            <div className="mp-status-badges">
                              {l.availableToday && <span className="mp-status-badge mp-status-avail">✓ Available Today</span>}
                              {l.type === "Doctors" && <span className="mp-status-badge mp-status-home">Home Visit</span>}
                            </div>
                          </div>

                          {/* Time Slots */}
                          <div className="mp-slots-grid">
                            {TIME_SLOTS.map((slot) => (
                              <div
                                key={slot.time}
                                className={`mp-slot-btn${slot.selected ? " selected" : ""}`}
                              >
                                <div>{slot.time}</div>
                                <div style={{ fontSize: "9px", opacity: 0.8 }}>{slot.period}</div>
                              </div>
                            ))}
                          </div>

                          <div className="mp-book-btn">
                            <FiCalendar size={14} />
                            <span>Book Appointment</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Load More */}
              {displayed.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#666",
                      cursor: "pointer",
                      padding: "8px 24px",
                      borderRadius: "8px",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#e4e8f0";
                      e.currentTarget.style.color = "#0d9488";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                      e.currentTarget.style.color = "#666";
                    }}
                  >
                    Load More Results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}