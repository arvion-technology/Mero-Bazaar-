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
  employmentType: string; // Maps to Specialty/Specialization
  education: string;      // Maps to Qualifications
  vacancies: number;      // Maps to Available Slots
  postedDate: string;
  description: string;
  requirements: string[]; // Maps to Services Offered
  benefits: string[];     // Maps to Facilities & Amenities
  breadcrumbs: string[];
  company: {
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
    industry: string;     // Maps to Category
    size: string;         // Maps to Capacity/Details
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
  "dr-sudhil-thapa": {
    id: "dr-sudhil-thapa",
    listingId: "#DR-8591",
    title: "Dr. Sudhil Thapa",
    subtitle: "Senior Cardiologist",
    fee: "Rs. 1,000 Consultation Fee",
    type: "Doctors",
    location: "Putalisadak, Kathmandu",
    postedDaysAgo: 2,
    views: 128,
    isVerified: true,
    isFeatured: true,
    availableToday: true,
    images: [
      "/sudhil.jpg",
      "/medical room.jpg",
      "/medical banner.jpg",
      "/hospital.png"
    ],
    experience: "15+ years",
    employmentType: "Cardiologist",
    education: "MBBS, MD (Cardiology)",
    vacancies: 5,
    postedDate: "May 15, 2025",
    description:
      "Dr. Sudhil Thapa is a senior consultant Cardiologist with over 15 years of experience in clinical cardiology and cardiac care. He specializes in interventional cardiology, management of hypertension, ischemic heart disease, and preventive cardiac wellness. He has previously served in several prestigious medical centers in Nepal and India, and is dedicated to delivering patient-centric heart treatments.",
    requirements: [
      "Cardiovascular Consultation & Screening",
      "Electrocardiogram (ECG) Analysis",
      "Echocardiography (ECHO)",
      "Holter Monitoring & Stress Test",
      "Hypertension & Lipid Management"
    ],
    benefits: [
      "Modern Cardiac Diagnostic Setup",
      "Emergency Cardiac Response Team Linkage",
      "Comfortable Private OPD Cabin",
      "Multi-lingual (English, Nepali, Hindi)",
      "Digital Health Records System"
    ],
    breadcrumbs: ["Medical", "Doctors", "Cardiology"],
    company: {
      name: "Nepal Heart Care Center",
      logo: "/hospital.png",
      rating: 4.8,
      reviewCount: 42,
      industry: "Cardiac Healthcare Services",
      size: "10-25 Employees",
      website: "www.nepalheartcare.org.np",
      location: "Putalisadak, Kathmandu",
    },
    mapImage: "/medical room.jpg",
    mapLocation: "Putalisadak, Kathmandu",
    mapDistance: "1.5km from Durbar Marg",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Dr. Thapa's Desk",
      avatar: "/sudhil.jpg",
      rating: 4.8,
      reviewCount: 128,
      isVerified: true,
    },
  },
  "dr-anisha-karki": {
    id: "dr-anisha-karki",
    listingId: "#DR-4482",
    title: "Dr. Anisha Karki",
    subtitle: "Dental Surgeon (BDS)",
    fee: "Rs. 800 Consultation Fee",
    type: "Doctors",
    location: "Lalitpur, Nepal",
    postedDaysAgo: 1,
    views: 95,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/anisha.jpg",
      "/Dental Checkup & Cleaning.avif",
      "/medical room.jpg",
      "/medical banner.jpg"
    ],
    experience: "8+ years",
    employmentType: "Dentist (BDS)",
    education: "BDS (Dental Surgery)",
    vacancies: 8,
    postedDate: "May 16, 2025",
    description:
      "Dr. Anisha Karki is a dental surgeon specializing in cosmetic dentistry, pediatric dentistry, and root canal therapy. She focuses on providing gentle, stress-free dental care to patients of all ages using advanced dentistry techniques. She is a registered member of the Nepal Medical Council and takes pride in restoring beautiful smiles.",
    requirements: [
      "Root Canal Treatment (RCT)",
      "Dental Crown & Bridge Placement",
      "Teeth Whitening & Laser Scaling",
      "Pediatric Dental Checkups & Fillings",
      "Cosmetic Dentistry Consultations"
    ],
    benefits: [
      "Sterilized & Hygienic Dental Setup",
      "Advanced Intraoral Cameras",
      "Orthodontic Support Available",
      "Friendly Staff and Child-friendly Setup",
      "Painless Dental Treatment Methods"
    ],
    breadcrumbs: ["Medical", "Doctors", "Dentistry"],
    company: {
      name: "Apex Dental Care Clinic",
      logo: "/hospital.png",
      rating: 4.9,
      reviewCount: 64,
      industry: "Dental Care Services",
      size: "5-15 Employees",
      website: "www.apexdental.com.np",
      location: "Lagankhel, Lalitpur",
    },
    mapImage: "/Dental Checkup & Cleaning.avif",
    mapLocation: "Lagankhel, Lalitpur",
    mapDistance: "0.5km from Lagankhel Buspark",
    mapCity: "Lalitpur, Nepal",
    postedBy: {
      name: "Apex Dental Desk",
      avatar: "/anisha.jpg",
      rating: 4.9,
      reviewCount: 64,
      isVerified: true,
    },
  },
  "dr-rajan-shah": {
    id: "dr-rajan-shah",
    listingId: "#DR-9821",
    title: "Dr. Rajan Shah",
    subtitle: "Senior Pediatrician",
    fee: "Rs. 900 Consultation Fee",
    type: "Doctors",
    location: "Putalisadak, Kathmandu",
    postedDaysAgo: 3,
    views: 110,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/rajan.jpg",
      "/medical room.jpg",
      "/medical banner.jpg"
    ],
    experience: "12+ years",
    employmentType: "Pediatrician",
    education: "MBBS, MD (Pediatrics)",
    vacancies: 6,
    postedDate: "May 14, 2025",
    description:
      "Dr. Rajan Shah is a highly experienced Pediatrician specializing in newborn care, child development assessment, childhood immunizations, and the treatment of common childhood illnesses. He is committed to providing comprehensive healthcare for infants, children, and adolescents, ensuring their healthy growth and developmental milestones.",
    requirements: [
      "Newborn Care & Health Screenings",
      "Child Growth & Development Monitoring",
      "Routine Childhood Immunizations",
      "Treatment of Pediatric Infections",
      "Nutritional Counseling for Children"
    ],
    benefits: [
      "Child-friendly Examination Cabin",
      "All Major Vaccines Available",
      "Emergency Advisory Support",
      "Spacious Play Area for Kids",
      "Nebulization & Basic Pediatric Care Setup"
    ],
    breadcrumbs: ["Medical", "Doctors", "Pediatrics"],
    company: {
      name: "Kids Clinic Nepal",
      logo: "/hospital.png",
      rating: 4.7,
      reviewCount: 38,
      industry: "Pediatric Healthcare",
      size: "5-10 Employees",
      website: "www.kidsclinic.com.np",
      location: "Putalisadak, Kathmandu",
    },
    mapImage: "/medical room.jpg",
    mapLocation: "Putalisadak, Kathmandu",
    mapDistance: "1.5km from Durbar Marg",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Kids Clinic Desk",
      avatar: "/rajan.jpg",
      rating: 4.8,
      reviewCount: 128,
      isVerified: true,
    },
  },
  "dr-prativa-malla": {
    id: "dr-prativa-malla",
    listingId: "#DR-3329",
    title: "Dr. Prativa Malla",
    subtitle: "Consultant Dermatologist",
    fee: "Rs. 1,000 Consultation Fee",
    type: "Doctors",
    location: "Putalisadak, Kathmandu",
    postedDaysAgo: 2,
    views: 152,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/prativa.jpg",
      "/medical room.jpg",
      "/medical banner.jpg"
    ],
    experience: "10+ years",
    employmentType: "Dermatologist",
    education: "MBBS, MD (Dermatology)",
    vacancies: 4,
    postedDate: "May 15, 2025",
    description:
      "Dr. Prativa Malla is a consultant dermatologist and laser specialist. She offers clinical dermatology treatments for acne, eczema, hair loss, and skin aging, alongside cosmetic skin care and laser procedures, helping patients achieve healthy and glowing skin.",
    requirements: [
      "Clinical Acne & Eczema Treatments",
      "Hair Fall & Alopecia Solutions",
      "Anti-aging Skin Consultations",
      "Laser Skin Rejuvenation",
      "Skin Biopsy & Minor Dermato-surgery"
    ],
    benefits: [
      "State-of-the-Art Laser Machine Setup",
      "Advanced Skin Diagnostic Tools",
      "High-Quality Derma Care Products Store",
      "Comfortable, Private Consultation Suite",
      "Qualified Support Estheticians"
    ],
    breadcrumbs: ["Medical", "Doctors", "Dermatology"],
    company: {
      name: "DermaCare Skin Clinic",
      logo: "/hospital.png",
      rating: 4.8,
      reviewCount: 56,
      industry: "Dermatology & Cosmetology",
      size: "10-20 Employees",
      website: "www.dermacare.com.np",
      location: "Putalisadak, Kathmandu",
    },
    mapImage: "/medical room.jpg",
    mapLocation: "Putalisadak, Kathmandu",
    mapDistance: "1.5km from Durbar Marg",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "DermaCare Desk",
      avatar: "/prativa.jpg",
      rating: 4.8,
      reviewCount: 128,
      isVerified: true,
    },
  },
  "norvic-hospital": {
    id: "norvic-hospital",
    listingId: "#HOSP-8812",
    title: "Norvic International Hospital",
    subtitle: "Multi-Specialty Corporate Hospital",
    fee: "Rs. 1,500 Consultation Fee",
    type: "Hospitals",
    location: "Thapathali, Kathmandu",
    postedDaysAgo: 4,
    views: 520,
    isVerified: true,
    isFeatured: true,
    availableToday: true,
    images: [
      "/nervic.jpg",
      "/hospital.png",
      "/medical banner.jpg",
      "/medical room.jpg"
    ],
    experience: "Established 1993",
    employmentType: "Multi-Specialty",
    education: "ISO 9001:2015 Certified",
    vacancies: 150,
    postedDate: "May 12, 2025",
    description:
      "Norvic International Hospital is a world-class multi-specialty hospital in Thapathali, Kathmandu. It is highly regarded for its state-of-the-art cardiology, gastroenterology, orthopedics, and neurology departments, providing compassionate healthcare services with international standards.",
    requirements: [
      "24/7 Emergency & ICU Services",
      "Interventional Cardiology & Cath Lab",
      "Advanced Joint Replacement & Orthopedics",
      "Comprehensive Wellness Packages",
      "Neurological Surgery & Diagnostic Center"
    ],
    benefits: [
      "Over 200+ Premium Inpatient Beds",
      "Highly Experienced Medical Staff",
      "Advanced Robotic Surgery Center",
      "In-house 24/7 Emergency Pharmacy",
      "Valet Parking & Patient Cafe Services"
    ],
    breadcrumbs: ["Medical", "Hospitals", "Corporate"],
    company: {
      name: "Norvic International Hospital",
      logo: "/hospital.png",
      rating: 4.7,
      reviewCount: 320,
      industry: "Hospital & Clinical Services",
      size: "500+ Employees",
      website: "www.norvichospital.com",
      location: "Thapathali, Kathmandu",
    },
    mapImage: "/nervic.jpg",
    mapLocation: "Thapathali, Kathmandu",
    mapDistance: "1.2km from Tripureshwor",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Norvic Desk",
      avatar: "/hospital.png",
      rating: 4.7,
      reviewCount: 320,
      isVerified: true,
    },
  },
  "kmc-hospital": {
    id: "kmc-hospital",
    listingId: "#HOSP-3456",
    title: "Kathmandu Medical College (KMC)",
    subtitle: "Teaching Hospital & General Healthcare",
    fee: "Rs. 500 Consultation Fee",
    type: "Hospitals",
    location: "Sinamangal, Kathmandu",
    postedDaysAgo: 3,
    views: 380,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/hospital.png",
      "/medical banner.jpg",
      "/medical room.jpg"
    ],
    experience: "Teaching Hospital",
    employmentType: "General Hospital",
    education: "Affiliated with KU",
    vacancies: 250,
    postedDate: "May 13, 2025",
    description:
      "Kathmandu Medical College (KMC) is a premier teaching hospital in Sinamangal, Kathmandu. It delivers affordable, high-quality medical services and education. KMC features comprehensive outpatient services, advanced neonatal care, and general surgery.",
    requirements: [
      "General OPD & Specialist Consultations",
      "KU-Affiliated Medical Education Programs",
      "NICU, PICU & General Ward Services",
      "Major and Minor Surgical Operations",
      "24 Hours Emergency & Trauma Care"
    ],
    benefits: [
      "Highly Affordable Consultations & Bed Charges",
      "Modern Laboratory & Diagnostics Center",
      "24/7 Pharmacy Service",
      "Academic Research & Training Facility",
      "Central Kathmandu Location"
    ],
    breadcrumbs: ["Medical", "Hospitals", "Teaching"],
    company: {
      name: "Kathmandu Medical College",
      logo: "/hospital.png",
      rating: 4.5,
      reviewCount: 450,
      industry: "Medical Education & Healthcare",
      size: "500+ Employees",
      website: "www.kmc.edu.np",
      location: "Sinamangal, Kathmandu",
    },
    mapImage: "/hospital.png",
    mapLocation: "Sinamangal, Kathmandu",
    mapDistance: "0.5km from Tribhuvan International Airport",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "KMC Patient Desk",
      avatar: "/hospital.png",
      rating: 4.5,
      reviewCount: 450,
      isVerified: true,
    },
  },
  "city-dental-clinic": {
    id: "city-dental-clinic",
    listingId: "#CLINIC-7742",
    title: "City Dental Clinic & Care",
    subtitle: "Orthodontics & General Dentistry",
    fee: "Rs. 800 Consultation Fee",
    type: "Clinics",
    location: "Sanepa, Lalitpur",
    postedDaysAgo: 2,
    views: 198,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/Dental Checkup & Cleaning.avif",
      "/medical room.jpg",
      "/medical banner.jpg"
    ],
    experience: "10+ years",
    employmentType: "Dental Clinic",
    education: "BDS, MDS Specialists",
    vacancies: 10,
    postedDate: "May 14, 2025",
    description:
      "City Dental Clinic & Care provides advanced general and cosmetic dentistry services in Sanepa, Lalitpur. With highly qualified dental surgeons, we specialize in root canal therapies, dental implants, teeth alignment (braces), and general checkups.",
    requirements: [
      "Comprehensive Dental Checkup & Hygiene",
      "Dental Implants & Prosthetics",
      "Braces & Orthodontic Care",
      "Root Canal Treatments (RCT)",
      "Teeth Whitening & Scaling"
    ],
    benefits: [
      "Digital X-Ray and Orthopantomogram (OPG)",
      "Sterilized & Hygienic Clinical Setup",
      "Comfortable, Relaxing Dental Chairs",
      "Weekend Consultations Available",
      "Ample Visitor Parking Space"
    ],
    breadcrumbs: ["Medical", "Clinics", "Dental"],
    company: {
      name: "City Dental Clinic & Care",
      logo: "/hospital.png",
      rating: 4.9,
      reviewCount: 88,
      industry: "Dental Healthcare Services",
      size: "10-20 Employees",
      website: "www.citydentalnepal.com",
      location: "Sanepa, Lalitpur",
    },
    mapImage: "/Dental Checkup & Cleaning.avif",
    mapLocation: "Sanepa, Lalitpur",
    mapDistance: "1.5km from Patan Dhoka",
    mapCity: "Lalitpur, Nepal",
    postedBy: {
      name: "City Dental Desk",
      avatar: "/hospital.png",
      rating: 4.9,
      reviewCount: 88,
      isVerified: true,
    },
  },
  "srl-diagnostics": {
    id: "srl-diagnostics",
    listingId: "#LAB-4819",
    title: "SRL Diagnostics Centre",
    subtitle: "ISO Certified Diagnostic & Lab Centre",
    fee: "Rs. 600 Basic Registration Fee",
    type: "Diagnostic",
    location: "Maharajgunj, Kathmandu",
    postedDaysAgo: 2,
    views: 145,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/daignostic centre.jpg",
      "/medical room.jpg",
      "/medical banner.jpg"
    ],
    experience: "ISO 9001:2015",
    employmentType: "Pathology Lab",
    education: "Accredited Diagnostics",
    vacancies: 25,
    postedDate: "May 14, 2025",
    description:
      "SRL Diagnostics Centre is an ISO-certified clinical laboratory in Maharajgunj, Kathmandu. We provide an extensive range of pathology, radiology, biochemistry, and microbiology testing, delivering highly precise reports with fast turnaround times.",
    requirements: [
      "Hematology, Immunology & Pathology Tests",
      "Digital X-Ray & Ultrasound (USG)",
      "Comprehensive Health Checkup Packages",
      "Home Sample Collection Service",
      "Pre-Employment & Visa Health Screenings"
    ],
    benefits: [
      "Automated Diagnostics Instruments",
      "Online Test Report Download Access",
      "Highly Experienced Lab Technologists",
      "Fast Turnaround on Reports",
      "Home Sample Pickup Facility"
    ],
    breadcrumbs: ["Medical", "Diagnostic", "Lab"],
    company: {
      name: "SRL Diagnostics Centre",
      logo: "/hospital.png",
      rating: 4.6,
      reviewCount: 156,
      industry: "Pathology & Radiology Labs",
      size: "20-50 Employees",
      website: "www.srldiagnostics.com.np",
      location: "Maharajgunj, Kathmandu",
    },
    mapImage: "/daignostic centre.jpg",
    mapLocation: "Maharajgunj, Kathmandu",
    mapDistance: "0.3km from Maharajgunj Chowk",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "SRL Lab Desk",
      avatar: "/hospital.png",
      rating: 4.6,
      reviewCount: 156,
      isVerified: true,
    },
  },
  "sajha-pharmacy": {
    id: "sajha-pharmacy",
    listingId: "#PHARM-1123",
    title: "Sajha Swasthya Sewa Cooperative",
    subtitle: "24/7 Pharmacy & Medicine Supply",
    fee: "Rs. 0 (Free Entry/Walk-in)",
    type: "Pharmacy",
    location: "Maharajgunj, Kathmandu",
    postedDaysAgo: 1,
    views: 260,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/medical room.jpg",
      "/medical banner.jpg"
    ],
    experience: "Established 1964",
    employmentType: "General Pharmacy",
    education: "Cooperative Society",
    vacancies: 12,
    postedDate: "May 15, 2025",
    description:
      "Sajha Swasthya Sewa Cooperative is one of Nepal's oldest and most trusted pharmacies. Located in Maharajgunj, Kathmandu, it operates 24/7, offering authentic medicines, surgical supplies, and health accessories at highly subsidized cooperative rates.",
    requirements: [
      "24 Hours Medicine Dispensing",
      "Subsidized Life-saving Drug Supplies",
      "Surgical and Orthopedic Equipment Sales",
      "Vaccine and Cold Chain Drug Storage",
      "OTC and Prescription Drug Guidance"
    ],
    benefits: [
      "Open 24/7, 365 Days a Year",
      "Authentic Medicines Directly from Manufacturers",
      "Government-approved Subsidized Rates",
      "In-depth Pharmacist Advice",
      "Wheelchair Accessible Entrance"
    ],
    breadcrumbs: ["Medical", "Pharmacy", "24/7"],
    company: {
      name: "Sajha Swasthya Sewa",
      logo: "/hospital.png",
      rating: 4.8,
      reviewCount: 92,
      industry: "Pharmaceuticals Supply",
      size: "50-100 Employees",
      website: "www.sajhahealth.org.np",
      location: "Maharajgunj, Kathmandu",
    },
    mapImage: "/medical room.jpg",
    mapLocation: "Maharajgunj, Kathmandu",
    mapDistance: "0.2km from Maharajgunj Chowk",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Sajha Patient Service",
      avatar: "/hospital.png",
      rating: 4.8,
      reviewCount: 92,
      isVerified: true,
    },
  },
  "redcross-ambulance": {
    id: "redcross-ambulance",
    listingId: "#AMB-9988",
    title: "Nepal Red Cross Society Ambulance",
    subtitle: "Emergency Medical Transportation",
    fee: "Charge based on distance",
    type: "Ambulance",
    location: "Red Cross Marg, Kathmandu",
    postedDaysAgo: 1,
    views: 412,
    isVerified: true,
    isFeatured: false,
    availableToday: true,
    images: [
      "/medical room.jpg",
      "/medical banner.jpg"
    ],
    experience: "24/7 Support",
    employmentType: "Ambulance Service",
    education: "First Aid Certified Staff",
    vacancies: 15,
    postedDate: "May 15, 2025",
    description:
      "Nepal Red Cross Society Ambulance Service provides rapid emergency medical transportation across the Kathmandu Valley. Equipped with oxygen, stretchers, and emergency first aid kits, our ambulances are staffed by first-aid-certified personnel to transport patients safely and quickly.",
    requirements: [
      "24/7 Emergency Patient Transportation",
      "First Aid and Resuscitation Support",
      "Oxygen and Stretcher Care Services",
      "Specialized Hospital-to-Hospital Transfers",
      "National Hotline Support integration"
    ],
    benefits: [
      "Fast Response Time within Kathmandu Valley",
      "Staffed with Certified First Aid Experts",
      "Equipped with Essential Lifesaving Tools",
      "Extremely Affordable Non-profit Service Fee",
      "Direct Coordination with Major Emergency Rooms"
    ],
    breadcrumbs: ["Medical", "Ambulance", "Emergency"],
    company: {
      name: "Nepal Red Cross Society",
      logo: "/hospital.png",
      rating: 4.9,
      reviewCount: 120,
      industry: "Emergency Medical Response",
      size: "200-500 Employees",
      website: "www.nrcs.org",
      location: "Red Cross Marg, Kathmandu",
    },
    mapImage: "/medical room.jpg",
    mapLocation: "Red Cross Marg, Kathmandu",
    mapDistance: "1.8km from City Center",
    mapCity: "Kathmandu, Nepal",
    postedBy: {
      name: "Red Cross Emergency",
      avatar: "/hospital.png",
      rating: 4.9,
      reviewCount: 120,
      isVerified: true,
    },
  }
};

const FALLBACK = MEDICAL_DATA["dr-sudhil-thapa"];

const SIMILAR = [
  { id: "dr-sudhil-thapa", title: "Dr. Sudhil Thapa", company: "Nepal Heart Care Center", image: "/sudhil.jpg", location: "Kathmandu" },
  { id: "dr-anisha-karki", title: "Dr. Anisha Karki", company: "Apex Dental Clinic", image: "/anisha.jpg", location: "Lalitpur" },
  { id: "norvic-hospital", title: "Norvic International Hospital", company: "Norvic Corp", image: "/nervic.jpg", location: "Kathmandu" },
  { id: "srl-diagnostics", title: "SRL Diagnostics Centre", company: "SRL Labs", image: "/daignostic centre.jpg", location: "Kathmandu" },
];

const TIME_SLOTS = [
  { time: "10:00", period: "AM" },
  { time: "11:00", period: "AM", selected: true },
  { time: "12:00", period: "PM" },
  { time: "02:00", period: "PM" },
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
        .md2-bc-link { color: #0d9488; text-decoration: none; font-weight: 500; }
        .md2-bc-link:hover { text-decoration: underline; }
        .md2-bc-sep { color: #ccc; font-size: 11px; margin: 0 1px; }
        .md2-bc-cur { color: #444; font-weight: 500; }
        .md2-lid { font-size: 12px; color: #999; font-weight: 500; }
        .md2-report { font-size: 12px; color: #0d9488; font-weight: 600; text-decoration: none; }
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
        .md2-thumb.on { border-color: #0d9488; }
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
        .md2-title { font-size: 20px; font-weight: 850; color: #1a1a1a; margin: 0 0 4px; }
        .md2-fee { font-size: 22px; font-weight: 900; color: #0d9488; margin: 4px 0 8px; }
        .md2-meta-row {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          font-size: 12.5px; color: #666; padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0; margin-bottom: 14px;
        }
        .md2-meta-item { display: flex; align-items: center; gap: 4px; }
        .md2-cta-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .md2-btn-apply {
          flex: 1; padding: 12px 20px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; box-shadow: 0 4px 14px rgba(13,148,136,0.3);
          transition: opacity 0.2s, transform 0.15s;
        }
        .md2-btn-apply:hover { opacity: 0.9; transform: translateY(-1px); }
        .md2-btn-chat {
          flex: 1; padding: 12px 20px; border-radius: 9px;
          border: 1.5px solid #0d9488; background: #fff;
          color: #0d9488; font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: inherit; display: flex; align-items: center; justify-content: center;
          gap: 7px; transition: background 0.18s;
        }
        .md2-btn-chat:hover { background: #f0fdfa; }

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
        .md2-chip:hover { background: #f0fdfa; }
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
          font-weight: 600; color: #0d9488; background: none; border: none;
          cursor: pointer; padding: 0; font-family: inherit;
        }
        .md2-see-more:hover { text-decoration: underline; }

        /* ── Req / Benefits Card ── */
        .md2-req-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .md2-req-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        .md2-req-col-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .md2-req-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: #333; padding: 6px 0;
          border-bottom: 1px solid #f8f8f8;
        }
        .md2-req-item:last-child { border-bottom: none; }
        .md2-req-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #0d9488; flex-shrink: 0; margin-top: 6px;
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
          background: rgba(13,148,136,0.15);
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
          font-size: 12.5px; font-weight: 600; color: #0d9488;
          text-decoration: none; border-top: 1px solid #f0f0f0;
          padding: 9px 16px; transition: background 0.18s;
        }
        .md2-map-link:hover { background: #f0fdfa; }

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
          font-size: 13px; font-weight: 600; color: #0d9488;
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
                    : <Link href="/category/medical" className="md2-bc-link">{crumb}</Link>
                  }
                </span>
              ))}
            </nav>
            <span className="md2-bc-cur" style={{ fontWeight: 700, color: "#333", fontSize: 13 }}>{listing.title}</span>
            <span className="md2-lid">Listing ID: {listing.listingId}</span>
            <a href="#report" className="md2-report">Report This Listing</a>
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
                  {callRevealed ? "Call: +977-9800000000" : "Book Appointment / Call"}
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
                  <div className="md2-chip-icon">🩺</div>
                  <span className="md2-chip-val">{listing.employmentType}</span>
                  <span className="md2-chip-label">Specialization</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">🎓</div>
                  <span className="md2-chip-val">{listing.education}</span>
                  <span className="md2-chip-label">Credentials</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">👥</div>
                  <span className="md2-chip-val">{listing.vacancies > 0 ? `${listing.vacancies} slots` : "Walk-in"}</span>
                  <span className="md2-chip-label">Availability</span>
                </div>
                <div className="md2-chip">
                  <div className="md2-chip-icon">📅</div>
                  <span className="md2-chip-val" style={{ fontSize: 9 }}>{listing.postedDate}</span>
                  <span className="md2-chip-label">Listed On</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md2-desc-card">
              <h2 className="md2-sec-title">Description & Profile</h2>
              <p className={`md2-desc-text${!showFull ? " clip" : ""}`}>{listing.description}</p>
              <button className="md2-see-more" onClick={() => setShowFull((v) => !v)} id="desc-toggle">
                {showFull ? "See Less" : "See More"}
              </button>
            </div>

            {/* Services + Facilities */}
            <div className="md2-req-card">
              <div className="md2-req-grid">
                <div className="md2-req-col">
                  <h2 className="md2-req-col-title">Services & Specializations</h2>
                  {listing.requirements.map((r, i) => (
                    <div className="md2-req-item" key={i}>
                      <span className="md2-req-dot" />
                      {r}
                    </div>
                  ))}
                </div>
                <div className="md2-req-col">
                  <h2 className="md2-req-col-title">Facilities & Amenities</h2>
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
              <p className="md2-company-card-title">Organization Details</p>
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
                  <span className="md2-ci-label">Category</span>
                  <span className="md2-ci-val">{listing.company.industry}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Capacity</span>
                  <span className="md2-ci-val">{listing.company.size}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Website</span>
                  <span className="md2-ci-val" style={{ color: "#0d9488", fontSize: 11 }}>{listing.company.website}</span>
                </div>
                <div className="md2-ci-row">
                  <span className="md2-ci-label">Address</span>
                  <span className="md2-ci-val">{listing.company.location}</span>
                </div>
              </div>
              <a
                href={listing.company.website.startsWith("http") ? listing.company.website : `https://${listing.company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="md2-view-profile"
                id="view-profile-btn"
                style={{ display: "block", textDecoration: "none" }}
              >
                Visit Website
              </a>
            </div>

            {/* Location */}
            <div className="md2-location-card" id="location">
              <p className="md2-location-card-title">Location Map</p>
              <div className="md2-map-area">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.mapImage} alt="Location" className="md2-map-img" />
                <div className="md2-map-overlay">
                  <span className="md2-map-place-name">{listing.mapCity.split(",")[0]}</span>
                  <span className="md2-map-place-sub">{listing.mapCity.split(",")[1]?.trim() || "Nepal"}</span>
                </div>
                <div className="md2-map-pin-anim">
                  <FiMapPin size={28} color="#0d9488" />
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
              <p className="md2-posted-card-title">Listed By</p>
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

        {/* ── Similar Healthcare Services ── */}
        <div className="md2-similar">
          <div className="md2-similar-hdr">
            <h2 className="md2-similar-title">Similar Healthcare Services</h2>
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
