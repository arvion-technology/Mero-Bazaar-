"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { FiHeart, FiPhone, FiGlobe, FiMail, FiMapPin, FiCheckCircle, FiShare2, FiClock, FiCheck, FiMessageSquare } from "react-icons/fi";

// ─── Types ───────────────────────────────────────────────────────────────────

type Program = {
  name: string;
  duration: string;
  fee: string;
  eligibility: string;
};

type SchoolDetail = {
  id: string;
  schoolId: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  location: string;
  distanceFrom: string;
  city: string;
  isVerified: boolean;
  isFeatured: boolean;
  admissionOpen: boolean;
  scholarshipAvailable: boolean;
  onlineClasses: boolean;
  topRated: boolean;
  breadcrumbs: string[];
  images: string[];
  logo: string;
  about: string;
  established: string;
  level: string;
  medium: string;
  board: string;
  students: string;
  feeStarting: string;
  website: string;
  phone: string;
  email: string;
  mapImage: string;
  programs: Program[];
  facilities: { icon: string; label: string }[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const SCHOOL_DATA: Record<string, SchoolDetail> = {
  "greenfield-international-school": {
    id: "greenfield-international-school",
    schoolId: "#SCH784512",
    name: "Oxford Secondary School",
    type: "Contract Institute",
    rating: 4.5,
    reviews: 126,
    location: "Balkumari lalitpur",
    distanceFrom: "2.5km from FunPark",
    city: "Lalitpur",
    isVerified: true,
    isFeatured: true,
    admissionOpen: true,
    scholarshipAvailable: true,
    onlineClasses: true,
    topRated: true,
    breadcrumbs: ["Education", "School"],
    images: [
      "/education.jpg",
      "/bright.jpg",
      "/greenfield.jpg",
      "/python.jpg",
      "/kathmandu.jpg",
    ],
    logo: "/education.png",
    about:
      "oxford Secondary School is one of the leading academic insitutions in Nepal, committed to providing quality education with modern teachng methods and excellent infrastructured.\n\nOur mission is to devekop responsible, creative and future-ready students through academic excellence and holistic development.",
    established: "2005",
    level: "Secondary(+2)",
    medium: "English",
    board: "NEB/Cambridge",
    students: "2500+",
    feeStarting: "Rs. 45,000/year",
    website: "https://www.oxfordsecondary.edu.np/",
    phone: "+977-01-5551234",
    email: "info@oxfordsecondary.edu.np",
    mapImage: "/kathmandu.jpg",
    programs: [
      { name: "Science(+2)", duration: "2year", fee: "Rs. 80,000/year", eligibility: "SEE Passed" },
      { name: "Mnagement", duration: "2year", fee: "Rs. 80,000/year", eligibility: "SEE Passed" },
      { name: "Computer Science", duration: "2year", fee: "Rs. 80,000/year", eligibility: "SEE Passed" },
      { name: "Education", duration: "2year", fee: "Rs. 10,000/year", eligibility: "SEE Passed" },
    ],
    facilities: [
      { icon: "👨‍🏫", label: "Experience Faculty" },
      { icon: "🖥️", label: "Medium Classrooms" },
      { icon: "💻", label: "Computer Labs" },
      { icon: "📚", label: "Library" },
      { icon: "⚽", label: "Sport" },
      { icon: "🚌", label: "Transportation" },
    ],
  },
  "kathmandu-model-college": {
    id: "kathmandu-model-college",
    schoolId: "#SCH123789",
    name: "Kathmandu Model College",
    type: "College Institute",
    rating: 4.8,
    reviews: 89,
    location: "Baneshwor, Kathmandu, Nepal",
    distanceFrom: "1.2km from Baneshwor",
    city: "Kathmandu",
    isVerified: true,
    isFeatured: false,
    admissionOpen: true,
    scholarshipAvailable: false,
    onlineClasses: true,
    topRated: true,
    breadcrumbs: ["Education", "College"],
    images: [
      "/kathmandu.jpg",
      "/education.jpg",
      "/bright.jpg",
      "/greenfield.jpg",
      "/python.jpg",
    ],
    logo: "/education.png",
    about:
      "Kathmandu Model College is a renowned institution in the heart of Kathmandu offering quality +2 Management education. With experienced faculty and modern infrastructure, we prepare students for a successful future in business and commerce.",
    established: "1998",
    level: "College (+2)",
    medium: "English/Nepali",
    board: "NEB",
    students: "1800+",
    feeStarting: "Rs. 55,000/year",
    website: "https://www.kathmandumodelcollege.edu.np/",
    phone: "+977-01-4444555",
    email: "info@kmc.edu.np",
    mapImage: "/kathmandu.jpg",
    programs: [
      { name: "Management(+2)", duration: "2year", fee: "Rs. 55,000/year", eligibility: "SEE Passed" },
      { name: "Accounting", duration: "2year", fee: "Rs. 60,000/year", eligibility: "SEE Passed" },
      { name: "Economics", duration: "2year", fee: "Rs. 55,000/year", eligibility: "SEE Passed" },
      { name: "Marketing", duration: "2year", fee: "Rs. 58,000/year", eligibility: "SEE Passed" },
    ],
    facilities: [
      { icon: "👨‍🏫", label: "Expert Faculty" },
      { icon: "📊", label: "Smart Classes" },
      { icon: "💻", label: "Computer Lab" },
      { icon: "📚", label: "Library" },
      { icon: "🏋️", label: "Gym" },
      { icon: "🚌", label: "Transportation" },
    ],
  },
  "bright-future-tuition": {
    id: "bright-future-tuition",
    schoolId: "#SCH456321",
    name: "Bright Future Tuition Center",
    type: "Tuition Center",
    rating: 4.8,
    reviews: 120,
    location: "Teku, Kathmandu, Nepal",
    distanceFrom: "0.8km from Teku",
    city: "Kathmandu",
    isVerified: true,
    isFeatured: false,
    admissionOpen: false,
    scholarshipAvailable: false,
    onlineClasses: false,
    topRated: false,
    breadcrumbs: ["Education", "Tuition"],
    images: [
      "/bright.jpg",
      "/education.jpg",
      "/python.jpg",
      "/greenfield.jpg",
      "/kathmandu.jpg",
    ],
    logo: "/education.png",
    about:
      "Bright Future Tuition Center provides quality coaching for school students from Grade 1–12. Our experienced teachers ensure every student reaches their full potential with personalized attention and proven teaching methodologies.",
    established: "2012",
    level: "School (1-12)",
    medium: "English",
    board: "NEB",
    students: "500+",
    feeStarting: "Rs. 2,500/month",
    website: "https://www.brightfuture.edu.np/",
    phone: "+977-01-3331234",
    email: "info@brightfuture.edu.np",
    mapImage: "/kathmandu.jpg",
    programs: [
      { name: "Grade 1-5", duration: "1year", fee: "Rs. 2,500/month", eligibility: "Any" },
      { name: "Grade 6-8", duration: "1year", fee: "Rs. 3,000/month", eligibility: "Any" },
      { name: "Grade 9-10", duration: "1year", fee: "Rs. 3,500/month", eligibility: "Any" },
      { name: "Grade 11-12", duration: "1year", fee: "Rs. 4,000/month", eligibility: "SEE Passed" },
    ],
    facilities: [
      { icon: "👨‍🏫", label: "Expert Teachers" },
      { icon: "📝", label: "Study Materials" },
      { icon: "🏆", label: "Mock Tests" },
      { icon: "📚", label: "Library" },
      { icon: "💡", label: "Online Notes" },
      { icon: "📞", label: "Parent Updates" },
    ],
  },
  "python-programming-course": {
    id: "python-programming-course",
    schoolId: "#SCH789654",
    name: "Python Programming Complete Course",
    type: "Online Course",
    rating: 4.8,
    reviews: 120,
    location: "Bhaktapur, Nepal",
    distanceFrom: "Online / Bhaktapur",
    city: "Bhaktapur",
    isVerified: true,
    isFeatured: false,
    admissionOpen: false,
    scholarshipAvailable: false,
    onlineClasses: true,
    topRated: false,
    breadcrumbs: ["Education", "Online Courses"],
    images: [
      "/python.jpg",
      "/education.jpg",
      "/bright.jpg",
      "/greenfield.jpg",
      "/kathmandu.jpg",
    ],
    logo: "/education.png",
    about:
      "A comprehensive Python programming course designed for beginners to advanced learners. Master Python with hands-on projects, live sessions, and mentorship from industry experts. Ideal for students and professionals looking to break into tech.",
    established: "2018",
    level: "Training",
    medium: "English/Nepali",
    board: "Certificate",
    students: "1200+",
    feeStarting: "Rs. 8,000/course",
    website: "https://www.pythonnepal.com/",
    phone: "+977-9841234567",
    email: "info@pythonnepal.com",
    mapImage: "/kathmandu.jpg",
    programs: [
      { name: "Python Basics", duration: "1month", fee: "Rs. 4,000", eligibility: "Any" },
      { name: "Intermediate Python", duration: "2month", fee: "Rs. 6,000", eligibility: "Basics done" },
      { name: "Django Web Dev", duration: "3month", fee: "Rs. 12,000", eligibility: "Intermediate" },
      { name: "Full Stack Python", duration: "6month", fee: "Rs. 20,000", eligibility: "Any" },
    ],
    facilities: [
      { icon: "💻", label: "Live Sessions" },
      { icon: "🎥", label: "Recorded Videos" },
      { icon: "📝", label: "Assignments" },
      { icon: "🏆", label: "Certificate" },
      { icon: "👨‍💻", label: "Mentorship" },
      { icon: "📞", label: "Support" },
    ],
  },
  "nepal-engineering-college": {
    id: "nepal-engineering-college",
    schoolId: "#SCH321654",
    name: "Nepal Engineering College",
    type: "Engineering College",
    rating: 4.6,
    reviews: 98,
    location: "Changunarayan, Bhaktapur, Nepal",
    distanceFrom: "3.0km from Changunarayan",
    city: "Bhaktapur",
    isVerified: true,
    isFeatured: true,
    admissionOpen: true,
    scholarshipAvailable: true,
    onlineClasses: false,
    topRated: true,
    breadcrumbs: ["Education", "College"],
    images: [
      "/education.jpg",
      "/greenfield.jpg",
      "/kathmandu.jpg",
      "/bright.jpg",
      "/python.jpg",
    ],
    logo: "/education.png",
    about:
      "Nepal Engineering College (NEC) is one of the premier engineering institutions affiliated with Pokhara University. We offer world-class engineering education with state-of-the-art labs and experienced faculty committed to excellence.",
    established: "1994",
    level: "Bachelor's Degree",
    medium: "English",
    board: "Pokhara University",
    students: "3000+",
    feeStarting: "Rs. 1,20,000/year",
    website: "https://www.nec.edu.np/",
    phone: "+977-01-6630470",
    email: "info@nec.edu.np",
    mapImage: "/kathmandu.jpg",
    programs: [
      { name: "Civil Engineering", duration: "4year", fee: "Rs. 1,20,000/year", eligibility: "+2 Passed" },
      { name: "Computer Engineering", duration: "4year", fee: "Rs. 1,20,000/year", eligibility: "+2 Passed" },
      { name: "Electronics", duration: "4year", fee: "Rs. 1,15,000/year", eligibility: "+2 Passed" },
      { name: "Electrical", duration: "4year", fee: "Rs. 1,10,000/year", eligibility: "+2 Passed" },
    ],
    facilities: [
      { icon: "🔬", label: "Science Labs" },
      { icon: "💻", label: "Computer Lab" },
      { icon: "📚", label: "Library" },
      { icon: "⚽", label: "Sports" },
      { icon: "🏥", label: "Medical Room" },
      { icon: "🚌", label: "Transportation" },
    ],
  },
  "pokhara-coaching-center": {
    id: "pokhara-coaching-center",
    schoolId: "#SCH987456",
    name: "Pokhara Coaching Center",
    type: "Coaching Center",
    rating: 4.5,
    reviews: 65,
    location: "Lakeside, Pokhara, Nepal",
    distanceFrom: "0.5km from Lakeside",
    city: "Pokhara",
    isVerified: false,
    isFeatured: false,
    admissionOpen: true,
    scholarshipAvailable: false,
    onlineClasses: false,
    topRated: false,
    breadcrumbs: ["Education", "Coaching Center"],
    images: [
      "/bright.jpg",
      "/education.jpg",
      "/greenfield.jpg",
      "/python.jpg",
      "/kathmandu.jpg",
    ],
    logo: "/education.png",
    about:
      "Pokhara Coaching Center specializes in entrance preparation for IOE, IOM, and other competitive exams. Our dedicated coaching programs have helped hundreds of students secure admissions at top engineering and medical colleges.",
    established: "2010",
    level: "Entrance Prep",
    medium: "English/Nepali",
    board: "Certificate",
    students: "400+",
    feeStarting: "Rs. 15,000/course",
    website: "https://www.pokharacoaching.edu.np/",
    phone: "+977-061-441234",
    email: "info@pokharacoaching.edu.np",
    mapImage: "/kathmandu.jpg",
    programs: [
      { name: "IOE Entrance", duration: "6month", fee: "Rs. 15,000", eligibility: "+2 Passed" },
      { name: "IOM Entrance", duration: "6month", fee: "Rs. 18,000", eligibility: "+2 Passed" },
      { name: "BBS Entrance", duration: "3month", fee: "Rs. 10,000", eligibility: "+2 Passed" },
      { name: "SEE Prep", duration: "1year", fee: "Rs. 8,000/year", eligibility: "Grade 9" },
    ],
    facilities: [
      { icon: "👨‍🏫", label: "Expert Faculty" },
      { icon: "📝", label: "Mock Tests" },
      { icon: "📚", label: "Study Material" },
      { icon: "🏆", label: "Success Track" },
      { icon: "💡", label: "Q&A Sessions" },
      { icon: "📞", label: "Parent Support" },
    ],
  },
};

const FALLBACK = SCHOOL_DATA["greenfield-international-school"];

const SIMILAR_SCHOOLS = [
  { id: "kathmandu-model-college", name: "Kathmandu Model College", image: "/kathmandu.jpg", type: "College", rating: 4.8 },
  { id: "bright-future-tuition", name: "Bright Future Tuition Center", image: "/bright.jpg", type: "Tuition", rating: 4.8 },
  { id: "nepal-engineering-college", name: "Nepal Engineering College", image: "/education.jpg", type: "College", rating: 4.6 },
  { id: "pokhara-coaching-center", name: "Pokhara Coaching Center", image: "/bright.jpg", type: "Coaching", rating: 4.5 },
  { id: "python-programming-course", name: "Python Complete Course", image: "/python.jpg", type: "Online", rating: 4.8 },
];

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

export default function EducationDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const school = SCHOOL_DATA[id] ?? FALLBACK;

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [applied, setApplied] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  const visibleThumbs = school.images.slice(0, 5);
  const extraCount = school.images.length - 5;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ed-page {
          background: #f5f6f8; min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 64px;
        }

        /* TOP BAR */
        .ed-topbar { background: #fff; border-bottom: 1px solid #ececec; padding: 11px 0; }
        .ed-topbar-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .ed-breadcrumb { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; font-size: 12.5px; color: #888; }
        .ed-bc-link { color: #6d28d9; text-decoration: none; font-weight: 500; transition: opacity 0.18s; }
        .ed-bc-link:hover { opacity: 0.75; text-decoration: underline; }
        .ed-bc-sep { color: #ccc; font-size: 11px; }
        .ed-bc-current { color: #555; font-weight: 500; }
        .ed-school-id { font-size: 12px; color: #999; font-weight: 600; }
        .ed-report { font-size: 12px; color: #e74c3c; font-weight: 600; text-decoration: none; transition: opacity 0.18s; }
        .ed-report:hover { opacity: 0.75; text-decoration: underline; }

        /* LAYOUT */
        .ed-container {
          max-width: 1200px; margin: 22px auto 0; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 330px;
          gap: 22px; align-items: start;
        }
        .ed-left { display: flex; flex-direction: column; gap: 16px; }

        /* IMAGE GALLERY */
        .ed-img-card {
          background: #fff; border-radius: 16px;
          overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .ed-main-img-wrap {
          position: relative; width: 100%; aspect-ratio: 16/9;
          overflow: hidden; background: #1a1a2e;
        }
        .ed-main-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease; display: block;
        }
        .ed-main-img-wrap:hover .ed-main-img { transform: scale(1.04); }

        /* Thumbnails */
        .ed-thumbs {
          display: flex; gap: 8px; padding: 10px 12px;
          overflow-x: auto; background: #fff; scrollbar-width: none;
        }
        .ed-thumbs::-webkit-scrollbar { display: none; }
        .ed-thumb-wrap {
          flex-shrink: 0; position: relative;
          width: 80px; height: 56px;
          border-radius: 8px; overflow: hidden; cursor: pointer;
          border: 2.5px solid transparent; transition: border-color 0.2s, transform 0.18s;
        }
        .ed-thumb-wrap:hover { transform: translateY(-2px); }
        .ed-thumb-wrap.active { border-color: #6d28d9; }
        .ed-thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ed-thumb-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.54);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 14px; font-weight: 800;
        }

        /* INFO CARD */
        .ed-info-card {
          background: #fff; border-radius: 16px;
          padding: 20px 22px 22px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .ed-badges-row { display: flex; gap: 7px; margin-bottom: 10px; flex-wrap: wrap; }
        .ed-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700; padding: 3px 10px;
          border-radius: 5px; letter-spacing: 0.2px;
        }
        .ed-badge-verified { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
        .ed-badge-top { background: #fff8e1; color: #b7950b; border: 1px solid #f9e79f; }
        .ed-badge-scholarship { background: #ede9fe; color: #6d28d9; border: 1px solid #c4b5fd; }
        .ed-badge-online { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

        .ed-name-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 10px; margin-bottom: 6px;
        }
        .ed-name {
          font-size: 22px; font-weight: 900; color: #1a1a1a;
          line-height: 1.25; margin: 0; flex: 1;
        }
        .ed-action-btns { display: flex; gap: 8px; flex-shrink: 0; margin-top: 3px; }
        .ed-action-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid #e0e0e0; background: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .ed-action-btn:hover { background: #f5f5f5; border-color: #ccc; transform: scale(1.1); }
        .ed-action-btn.fav-active { border-color: #e74c3c; background: #fff5f5; }

        .ed-location-row {
          display: flex; align-items: center; gap: 14px;
          font-size: 13px; color: #666; margin-bottom: 10px; flex-wrap: wrap;
        }
        .ed-loc-item { display: flex; align-items: center; gap: 4px; }
        .ed-view-map {
          font-size: 12.5px; font-weight: 600; color: #6d28d9;
          text-decoration: none; transition: opacity 0.18s;
        }
        .ed-view-map:hover { opacity: 0.75; text-decoration: underline; }

        /* Tags row */
        .ed-tags-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .ed-tag-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 13px; border-radius: 100px; font-size: 12px; font-weight: 600;
          border: 1.5px solid #e0e4f0; background: #f8faff; color: #444;
          cursor: default;
        }
        .ed-tag-chip.green { color: #059669; border-color: #a7f3d0; background: #ecfdf5; }
        .ed-tag-chip.purple { color: #6d28d9; border-color: #c4b5fd; background: #ede9fe; }
        .ed-tag-chip.blue { color: #0369a1; border-color: #bae6fd; background: #e0f2fe; }

        /* Fee */
        .ed-fee-label { font-size: 11.5px; color: #888; margin: 0 0 2px; }
        .ed-fee { font-size: 22px; font-weight: 900; color: #1a1a1a; margin: 0 0 16px; }

        /* CTA BUTTONS */
        .ed-cta-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
        .ed-btn-apply {
          flex: 1; min-width: 140px; padding: 12px 20px;
          background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
          color: #fff; font-size: 14px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          font-family: inherit; display: flex; align-items: center;
          justify-content: center; gap: 7px;
          box-shadow: 0 4px 14px rgba(109,40,217,0.32);
          transition: opacity 0.2s, transform 0.15s;
        }
        .ed-btn-apply:hover { opacity: 0.9; transform: translateY(-1px); }
        .ed-btn-apply.applied { background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); box-shadow: 0 4px 14px rgba(39,174,96,0.32); }
        .ed-btn-chat {
          flex: 1; min-width: 140px; padding: 12px 20px;
          background: #fff; color: #6d28d9; font-size: 14px; font-weight: 700;
          border: 1.5px solid #6d28d9; border-radius: 10px; cursor: pointer;
          font-family: inherit; display: flex; align-items: center;
          justify-content: center; gap: 7px; transition: background 0.18s;
        }
        .ed-btn-chat:hover { background: #f5f3ff; }

        /* FACILITIES */
        .ed-facilities-bar {
          display: grid; grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .ed-facility {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          background: #f8f9fb; border-radius: 10px; padding: 12px 6px 10px;
          border: 1px solid #eef0f3; text-align: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .ed-facility:hover { background: #f0f2f8; border-color: #d9dde8; }
        .ed-facility-icon { font-size: 22px; }
        .ed-facility-label { font-size: 10px; color: #666; font-weight: 600; line-height: 1.2; }

        /* ABOUT CARD */
        .ed-about-card {
          background: #fff; border-radius: 16px;
          padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .ed-section-title { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; }
        .ed-about-text { font-size: 13.5px; color: #444; line-height: 1.8; margin: 0; white-space: pre-line; }
        .ed-about-text.clamped {
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .ed-see-more {
          display: inline-block; margin-top: 8px;
          font-size: 13px; font-weight: 600; color: #6d28d9;
          background: none; border: none; cursor: pointer;
          padding: 0; font-family: inherit; transition: opacity 0.18s;
        }
        .ed-see-more:hover { opacity: 0.72; }

        /* PROGRAMS CARD */
        .ed-programs-card {
          background: #fff; border-radius: 16px;
          padding: 20px 22px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .ed-programs-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
        }
        .ed-program-box {
          border: 1.5px solid #e8ecf8; border-radius: 12px;
          padding: 14px 16px; background: #fafbff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ed-program-box:hover { border-color: #6d28d9; box-shadow: 0 4px 16px rgba(109,40,217,0.1); }
        .ed-prog-name { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .ed-prog-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; padding: 4px 0; border-bottom: 1px solid #f2f4f8;
        }
        .ed-prog-row:last-of-type { border-bottom: none; }
        .ed-prog-label { color: #888; font-weight: 500; }
        .ed-prog-val { color: #1a1a1a; font-weight: 700; }
        .ed-prog-view {
          display: block; width: 100%; margin-top: 12px; padding: 8px;
          text-align: center; font-size: 12px; font-weight: 700;
          color: #6d28d9; background: #ede9fe; border: none;
          border-radius: 8px; cursor: pointer; font-family: inherit;
          transition: background 0.18s;
        }
        .ed-prog-view:hover { background: #ddd6fe; }

        /* SIMILAR SCHOOLS */
        .ed-similar-card {
          background: #fff; border-radius: 16px;
          padding: 0 0 20px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
          overflow: hidden;
        }
        .ed-similar-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 14px; border-bottom: 1px solid #f5f5f5;
        }
        .ed-similar-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .ed-similar-viewall { font-size: 13px; font-weight: 600; color: #6d28d9; text-decoration: none; }
        .ed-similar-scroll {
          display: flex; gap: 12px; padding: 14px 16px 4px;
          overflow-x: auto; scrollbar-width: none;
        }
        .ed-similar-scroll::-webkit-scrollbar { display: none; }
        .ed-sim-card {
          flex-shrink: 0; width: 155px; background: #f8f9fb;
          border-radius: 12px; overflow: hidden; text-decoration: none;
          border: 1.5px solid #eee; transition: transform 0.2s, box-shadow 0.2s;
        }
        .ed-sim-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .ed-sim-img { width: 100%; height: 80px; object-fit: cover; display: block; }
        .ed-sim-body { padding: 8px 10px 10px; }
        .ed-sim-type { font-size: 10px; font-weight: 700; color: #6d28d9; text-transform: uppercase; margin: 0 0 3px; }
        .ed-sim-name { font-size: 12px; font-weight: 700; color: #1a1a1a; margin: 0 0 4px; line-height: 1.3; }
        .ed-sim-rating { font-size: 11px; color: #888; display: flex; align-items: center; gap: 3px; }

        /* RIGHT COLUMN */
        .ed-right { display: flex; flex-direction: column; gap: 16px; }

        /* INSTITUTE CARD */
        .ed-institute-card {
          background: #fff; border-radius: 16px;
          padding: 20px 18px; box-shadow: 0 2px 14px rgba(0,0,0,0.08);
          position: sticky; top: 80px;
        }
        .ed-institute-type {
          font-size: 12px; font-weight: 700; color: #6d28d9;
          text-transform: uppercase; letter-spacing: 0.5px;
          margin: 0 0 8px;
        }
        .ed-institute-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .ed-institute-logo-wrap {
          width: 52px; height: 52px; border-radius: 12px; overflow: hidden;
          border: 1.5px solid #eee; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: #f3f4f6;
        }
        .ed-institute-logo { width: 100%; height: 100%; object-fit: contain; display: block; }
        .ed-institute-name { font-size: 17px; font-weight: 900; color: #1a1a1a; margin: 0 0 5px; line-height: 1.2; }
        .ed-rating-row { display: flex; align-items: center; gap: 5px; }
        .ed-rating-num { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .ed-reviews { font-size: 11.5px; color: #888; }

        .ed-institute-info { border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin-bottom: 14px; }
        .ed-ci-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 9px 0; border-bottom: 1px solid #f8f8f8;
          font-size: 12.5px; gap: 6px;
        }
        .ed-ci-row:last-child { border-bottom: none; }
        .ed-ci-label { color: #777; font-weight: 500; flex-shrink: 0; }
        .ed-ci-val { color: #1a1a1a; font-weight: 600; text-align: right; word-break: break-word; }

        .ed-institute-btns { display: flex; flex-direction: column; gap: 8px; }
        .ed-btn-call {
          width: 100%; padding: 11px;
          background: linear-gradient(135deg, #6d28d9, #4c1d95);
          color: #fff; font-size: 13.5px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          font-family: inherit; display: flex; align-items: center;
          justify-content: center; gap: 6px;
          box-shadow: 0 4px 14px rgba(109,40,217,0.28);
          transition: opacity 0.18s, transform 0.15s;
        }
        .ed-btn-call:hover { opacity: 0.88; transform: translateY(-1px); }
        .ed-btn-outline {
          width: 100%; padding: 11px;
          background: #fff; color: #6d28d9; font-size: 13.5px; font-weight: 700;
          border: 1.5px solid #6d28d9; border-radius: 10px; cursor: pointer;
          font-family: inherit; display: flex; align-items: center;
          justify-content: center; gap: 6px; transition: background 0.18s;
        }
        .ed-btn-outline:hover { background: #f5f3ff; }
        .ed-btn-outline.email { color: #555; border-color: #ddd; }
        .ed-btn-outline.email:hover { background: #f8f9fb; }
        .ed-btn-outline.web { color: #0369a1; border-color: #bae6fd; }
        .ed-btn-outline.web:hover { background: #e0f2fe; }

        /* MAP CARD */
        .ed-map-card {
          background: #fff; border-radius: 16px;
          overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.08);
        }
        .ed-map-card-title {
          font-size: 14px; font-weight: 800; color: #1a1a1a;
          margin: 0; padding: 16px 18px 12px; border-bottom: 1px solid #f0f0f0;
        }
        .ed-map-img-wrap { position: relative; height: 140px; overflow: hidden; }
        .ed-map-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ed-map-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 10px 14px;
        }
        .ed-map-area { font-size: 14px; font-weight: 800; color: #fff; margin: 0; }
        .ed-map-dist { font-size: 11.5px; color: rgba(255,255,255,0.8); }
        .ed-map-city { font-size: 12px; color: #555; padding: 10px 18px 4px; font-weight: 500; }
        .ed-map-link {
          display: inline-flex; align-items: center; gap: 4px;
          color: #6d28d9; font-size: 12.5px; font-weight: 600;
          text-decoration: none; padding: 4px 18px 14px;
          transition: opacity 0.18s;
        }
        .ed-map-link:hover { opacity: 0.75; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ed-container { grid-template-columns: 1fr; }
          .ed-right { position: static; }
          .ed-programs-grid { grid-template-columns: 1fr; }
          .ed-facilities-bar { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .ed-container { padding: 0 14px; margin-top: 14px; }
          .ed-cta-row { flex-direction: column; }
          .ed-facilities-bar { grid-template-columns: repeat(3, 1fr); }
          .ed-programs-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ed-page">
        {/* TOP BAR */}
        <div className="ed-topbar">
          <div className="ed-topbar-inner">
            <nav className="ed-breadcrumb">
              <Link href="/" className="ed-bc-link">Home</Link>
              <span className="ed-bc-sep">›</span>
              <Link href="/category/education-training" className="ed-bc-link">Education</Link>
              {school.breadcrumbs.map((bc) => (
                <span key={bc} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span className="ed-bc-sep">›</span>
                  <span className="ed-bc-current">{bc}</span>
                </span>
              ))}
              <span className="ed-bc-sep">›</span>
              <span className="ed-bc-current">{school.name}</span>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="ed-school-id">Job ID: {school.schoolId}</span>
              <a href="#" className="ed-report">Report This Job</a>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="ed-container">
          {/* LEFT */}
          <div className="ed-left">
            {/* IMAGE GALLERY */}
            <div className="ed-img-card">
              <div className="ed-main-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={school.images[activeImg]} alt={school.name} className="ed-main-img" />
              </div>
              <div className="ed-thumbs">
                {visibleThumbs.map((img, i) => (
                  <div
                    key={i}
                    className={`ed-thumb-wrap${activeImg === i ? " active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Thumb ${i + 1}`} className="ed-thumb-img" />
                    {i === 4 && extraCount > 0 && (
                      <div className="ed-thumb-overlay">+{extraCount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* INFO CARD */}
            <div className="ed-info-card">
              {/* Badges */}
              <div className="ed-badges-row">
                {school.isVerified && (
                  <span className="ed-badge ed-badge-verified">
                    <FiCheck size={9} color="#1e8449" />
                    Verified
                  </span>
                )}
                {school.topRated && <span className="ed-badge ed-badge-top">⭐ Top Rated</span>}
                {school.scholarshipAvailable && <span className="ed-badge ed-badge-scholarship">🎓 Scholarship Available</span>}
                {school.onlineClasses && <span className="ed-badge ed-badge-online">💻 Online Classes</span>}
              </div>

              {/* Name Row */}
              <div className="ed-name-row">
                <h1 className="ed-name">{school.name}</h1>
                <div className="ed-action-btns">
                  <button
                    className={`ed-action-btn${isFav ? " fav-active" : ""}`}
                    onClick={() => setIsFav(!isFav)}
                    aria-label="Save"
                    title="Save"
                  >
                    {isFav ? <FaHeart size={15} color="#E74C3C" /> : <FiHeart size={15} color="#999" />}
                  </button>
                  <button
                    className="ed-action-btn"
                    aria-label="Share"
                    title="Share"
                    onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})}
                  >
                    <FiShare2 size={15} color="#666" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="ed-location-row">
                <span className="ed-loc-item">
                  <FiMapPin size={13} color="#bbb" />
                  {school.location}
                </span>
                <a href="#" className="ed-view-map">View on Map</a>
              </div>

              {/* Tags */}
              <div className="ed-tags-row">
                {school.isVerified && <span className="ed-tag-chip green">✓ Verified</span>}
                {school.topRated && <span className="ed-tag-chip">⭐ Top Rated</span>}
                {school.scholarshipAvailable && <span className="ed-tag-chip purple">🎓 Scholarship Available</span>}
                {school.onlineClasses && <span className="ed-tag-chip blue">💻 Online Classes</span>}
                <span className="ed-tag-chip" style={{ cursor: "pointer" }}>
                  <FiShare2 size={12} color="#888" />
                  Save
                </span>
                <span className="ed-tag-chip" style={{ cursor: "pointer" }}>
                  <FiHeart size={12} color="#888" />
                  Save
                </span>
              </div>

              {/* Fee */}
              <p className="ed-fee-label">Starting From</p>
              <p className="ed-fee">{school.feeStarting}</p>

              {/* CTA */}
              <div className="ed-cta-row">
                <button
                  className={`ed-btn-apply${applied ? " applied" : ""}`}
                  onClick={() => setApplied(!applied)}
                >
                  {applied ? (
                    <><FiCheck size={15} color="#fff" /> Applied!</>
                  ) : (
                    <>Apply Now</>
                  )}
                </button>
                <button
                  className="ed-btn-chat"
                  onClick={() => setMsgSent(true)}
                >
                  <FiMessageSquare size={15} color="#6d28d9" />
                  {msgSent ? "Message Sent!" : "Chat with Employer"}
                </button>
              </div>


              {/* FACILITIES */}
              <div className="ed-facilities-bar">
                {school.facilities.map((f, i) => (
                  <div key={i} className="ed-facility">
                    <span className="ed-facility-icon">{f.icon}</span>
                    <span className="ed-facility-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ABOUT SECTION */}
            <div className="ed-about-card">
              <h2 className="ed-section-title">About Institude</h2>
              <p className={`ed-about-text${showFull ? "" : " clamped"}`}>{school.about}</p>
              <button className="ed-see-more" onClick={() => setShowFull(!showFull)}>
                {showFull ? "See Less" : "See More"}
              </button>
            </div>

            {/* PROGRAMS OFFERED */}
            <div className="ed-programs-card">
              <h2 className="ed-section-title">Programs Offered</h2>
              <div className="ed-programs-grid">
                {school.programs.map((p, i) => (
                  <div key={i} className="ed-program-box">
                    <p className="ed-prog-name">{p.name}</p>
                    <div className="ed-prog-row">
                      <span className="ed-prog-label">Duration</span>
                      <span className="ed-prog-val">{p.duration}</span>
                    </div>
                    <div className="ed-prog-row">
                      <span className="ed-prog-label">Fee</span>
                      <span className="ed-prog-val">{p.fee}</span>
                    </div>
                    <div className="ed-prog-row">
                      <span className="ed-prog-label">Eligibility</span>
                      <span className="ed-prog-val">{p.eligibility}</span>
                    </div>
                    <button className="ed-prog-view">View Details</button>
                  </div>
                ))}
              </div>
            </div>

            {/* SIMILAR SCHOOLS */}
            <div className="ed-similar-card">
              <div className="ed-similar-head">
                <p className="ed-similar-title">Similar School</p>
                <Link href="/category/education-training" className="ed-similar-viewall">View All</Link>
              </div>
              <div className="ed-similar-scroll">
                {SIMILAR_SCHOOLS.filter((s) => s.id !== school.id).map((s) => (
                  <Link key={s.id} href={`/category/education-training/${s.id}`} className="ed-sim-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.name} className="ed-sim-img" />
                    <div className="ed-sim-body">
                      <p className="ed-sim-type">{s.type}</p>
                      <p className="ed-sim-name">{s.name}</p>
                      <span className="ed-sim-rating">
                        ★ {s.rating}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="ed-right">
            {/* INSTITUTE CARD */}
            <div className="ed-institute-card">
              <p className="ed-institute-type">{school.type}</p>
              <div className="ed-institute-top">
                <div className="ed-institute-logo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={school.logo} alt={school.name} className="ed-institute-logo" />
                </div>
                <div>
                  <p className="ed-institute-name">{school.name}</p>
                  <div className="ed-rating-row">
                    <span className="ed-rating-num">{school.rating}</span>
                    <StarRating rating={school.rating} />
                    <span className="ed-reviews">({school.reviews} Reviews)</span>
                  </div>
                </div>
              </div>

              <div className="ed-institute-info">
                <div className="ed-ci-row">
                  <span className="ed-ci-label">Student</span>
                  <span className="ed-ci-val">{school.students}</span>
                </div>
                <div className="ed-ci-row">
                  <span className="ed-ci-label">Established</span>
                  <span className="ed-ci-val">{school.established}</span>
                </div>
                <div className="ed-ci-row">
                  <span className="ed-ci-label">School Level</span>
                  <span className="ed-ci-val">{school.level}</span>
                </div>
                <div className="ed-ci-row">
                  <span className="ed-ci-label">Medium</span>
                  <span className="ed-ci-val">{school.medium}</span>
                </div>
                <div className="ed-ci-row">
                  <span className="ed-ci-label">Board</span>
                  <span className="ed-ci-val">{school.board}</span>
                </div>
              </div>

              <div className="ed-institute-btns">
                <button className="ed-btn-call">
                  <FiPhone size={14} color="#fff" />
                  Call Institute
                </button>
                <button className="ed-btn-outline">
                  <FiClock size={14} color="#6d28d9" />
                  View Company Profile
                </button>
                <button className="ed-btn-outline email">
                  <FiMail size={14} color="#555" />
                  Send Email
                </button>
                <a href={school.website} target="_blank" rel="noopener noreferrer" className="ed-btn-outline web" style={{ textDecoration: "none" }}>
                  <FiGlobe size={14} color="#0369a1" />
                  Visit Website
                </a>
              </div>
            </div>

            {/* MAP CARD */}
            <div className="ed-map-card">
              <p className="ed-map-card-title">Location</p>
              <div className="ed-map-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={school.mapImage} alt="Map" className="ed-map-img" />
                <div className="ed-map-overlay">
                  <p className="ed-map-area">{school.location}</p>
                  <span className="ed-map-dist">{school.distanceFrom}</span>
                </div>
              </div>
              <p className="ed-map-city">Lazimpat,Kathmandu, Nepal</p>
              <a href="#" className="ed-map-link">
                <FiMapPin size={12} color="#6d28d9" />
                View on Map
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
