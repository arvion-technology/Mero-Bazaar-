"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { FiHeart, FiShare2, FiMapPin, FiBriefcase, FiClock, FiEye, FiMessageSquare, FiUser, FiUsers, FiCalendar, FiCheckCircle, FiSend, FiPlusSquare, FiCheck } from "react-icons/fi";
import { FaStar, FaRegStar, FaHeart, FaGraduationCap } from "react-icons/fa";

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
  lat: number;
  lng: number;
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
    distanceFrom: "2.5km from Thamel",
    type: "Full-Time",
    postedDaysAgo: 2,
    views: 36,
    experience: "1–2 years",
    education: "Bachelor's",
    vacancies: 2,
    postedDate: "May 10, 2025",
    isVerified: true,
    isFeatured: true,
    breadcrumbs: ["Job", "IT & Software"],
    images: ["/job1.jpg", "/job2.jpg", "/job3.jpg", "/job4.jpg", "/job5.jpg"],
    description: "We are looking for a passionate Frontend Developer to build responsive, user-friendly web applications using modern technologies. You will work closely with designers and backend developers to create amazing products. This is a great opportunity to work with a fast-growing technology company and gain hands-on experience with cutting-edge tools and frameworks.",
    requirements: [
      "1–3 years of experience in HTML, CSS, JavaScript",
      "Responsive design skills",
      "Git & version control",
      "Good problem solving skills",
      "Bachelor's degree in CSE or related field",
      "Strong knowledge of React.js",
    ],
    benefits: [
      "Competitive Salary",
      "Health Insurance",
      "Flexible working Hours",
      "Career Growth",
      "Friendly Environment",
      "Paid Leave",
    ],
    lat: 27.7172,
    lng: 85.3240,
    company: {
      name: "Aarovin Technology",
      logo: "/job1.jpg",
      rating: 4.6,
      reviewCount: 126,
      industry: "IT & Software",
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
    experience: "3–5 years",
    education: "Bachelor's",
    vacancies: 1,
    postedDate: "May 12, 2025",
    isVerified: true,
    isFeatured: false,
    breadcrumbs: ["Job", "IT & Software"],
    images: ["/job2.jpg", "/job3.jpg", "/job4.jpg", "/job5.jpg", "/job1.jpg"],
    description: "We are hiring a Senior Backend Engineer to design and build scalable backend systems using Node.js and cloud services. You will lead architecture decisions and mentor junior engineers in a collaborative, fast-paced environment.",
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
    lat: 27.6588,
    lng: 85.3247,
    company: {
      name: "CloudNine Solutions",
      logo: "/job2.jpg",
      rating: 4.8,
      reviewCount: 89,
      industry: "IT & Software",
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
  "sales-executive": {
    id: "sales-executive",
    jobId: "#JOB100001",
    title: "Sales Executive",
    salary: "NPR 30,000–45,000/month",
    location: "Kathmandu, Nepal",
    distanceFrom: "1.0km from New Baneshwor",
    type: "Full-Time",
    postedDaysAgo: 1,
    views: 48,
    experience: "0–2 years",
    education: "Intermediate",
    vacancies: 5,
    postedDate: "Jun 13, 2025",
    isVerified: true,
    isFeatured: false,
    breadcrumbs: ["Job", "Sales"],
    images: ["/job1.jpg", "/job3.jpg", "/job5.jpg"],
    description: "XYZ Corporation is hiring energetic Sales Executives to expand our client base across Kathmandu. You will be responsible for identifying new business opportunities, maintaining client relationships, and achieving monthly sales targets. Freshers with good communication skills are welcome.",
    requirements: [
      "Strong communication and negotiation skills",
      "Proven ability to achieve targets",
      "Knowledge of sales techniques",
      "Willingness to travel within the city",
      "Minimum Intermediate (10+2) level education",
    ],
    benefits: [
      "Attractive Sales Incentives",
      "Travel Allowance",
      "Mobile Allowance",
      "Festival Bonus",
      "Career Growth",
    ],
    lat: 27.7003,
    lng: 85.3390,
    company: {
      name: "XYZ Corporation Pvt. Ltd.",
      logo: "/job1.jpg",
      rating: 4.1,
      reviewCount: 34,
      industry: "Sales & Marketing",
      size: "200–500 employees",
      website: "https://www.xyzcorp.com.np/",
      location: "Kathmandu, Nepal",
    },
    postedBy: {
      name: "Ramesh Khanal",
      avatar: "/lady.jpg",
      rating: 4.2,
      reviewCount: 18,
      isVerified: true,
    },
  },
  "accountant": {
    id: "accountant",
    jobId: "#JOB100002",
    title: "Accountant",
    salary: "NPR 28,000–40,000/month",
    location: "Butwal, Nepal",
    distanceFrom: "0.5km from Traffic Chowk",
    type: "Full-Time",
    postedDaysAgo: 2,
    views: 29,
    experience: "1–3 years",
    education: "Bachelor's",
    vacancies: 2,
    postedDate: "Jun 12, 2025",
    isVerified: true,
    isFeatured: false,
    breadcrumbs: ["Job", "Finance"],
    images: ["/job2.jpg", "/job4.jpg", "/job1.jpg"],
    description: "Finance Hub Pvt. Ltd. is looking for a qualified Accountant to manage day-to-day accounting operations including bookkeeping, bank reconciliation, VAT filing, and financial reporting. Experience with Tally or similar accounting software is required.",
    requirements: [
      "Bachelor's degree in Accounting or Finance",
      "Proficiency in Tally ERP",
      "Knowledge of Nepal tax regulations",
      "Experience with VAT/TDS filing",
      "Strong attention to detail",
    ],
    benefits: [
      "Provident Fund & Gratuity",
      "Medical Insurance",
      "Festival Bonus",
      "Paid Annual Leave",
      "Stable Work Environment",
    ],
    lat: 27.6933,
    lng: 83.4545,
    company: {
      name: "Finance Hub Pvt. Ltd.",
      logo: "/job2.jpg",
      rating: 4.3,
      reviewCount: 22,
      industry: "Finance & Accounting",
      size: "20–50 employees",
      website: "https://www.financehub.com.np/",
      location: "Butwal, Nepal",
    },
    postedBy: {
      name: "Sushma Tharu",
      avatar: "/lady.jpg",
      rating: 4.4,
      reviewCount: 11,
      isVerified: true,
    },
  },
  "delivery-rider": {
    id: "delivery-rider",
    jobId: "#JOB100003",
    title: "Delivery Rider",
    salary: "NPR 1,500–2,000/day",
    location: "Kathmandu, Nepal",
    distanceFrom: "Central Kathmandu",
    type: "Full-Time",
    postedDaysAgo: 3,
    views: 61,
    experience: "0–1 year",
    education: "SLC/SEE",
    vacancies: 10,
    postedDate: "Jun 11, 2025",
    isVerified: true,
    isFeatured: false,
    breadcrumbs: ["Job", "Gig/Freelance"],
    images: ["/job3.jpg", "/job1.jpg", "/job5.jpg"],
    description: "Pizza House is looking for reliable Delivery Riders to join our growing fleet in Kathmandu. You will deliver orders to customers on time while maintaining the highest standard of customer service. A valid driving license and a personal bike are mandatory.",
    requirements: [
      "Valid two-wheeler driving license",
      "Own motorcycle or scooter",
      "Knowledge of Kathmandu roads",
      "Good communication skills",
      "Punctual and reliable",
    ],
    benefits: [
      "Daily Earnings + Tips",
      "Fuel Allowance",
      "Flexible Shifts",
      "Accident Insurance",
      "Performance Bonus",
    ],
    lat: 27.7172,
    lng: 85.3240,
    company: {
      name: "Pizza House",
      logo: "/job3.jpg",
      rating: 3.9,
      reviewCount: 15,
      industry: "Food & Beverage",
      size: "10–30 employees",
      website: "https://www.pizzahouse.com.np/",
      location: "Kathmandu, Nepal",
    },
    postedBy: {
      name: "Bikash Adhikari",
      avatar: "/lady.jpg",
      rating: 4.0,
      reviewCount: 8,
      isVerified: false,
    },
  },
  "graphics-designer": {
    id: "graphics-designer",
    jobId: "#JOB100004",
    title: "Graphics Designer",
    salary: "NPR 30,000–50,000/month",
    location: "Kathmandu, Nepal",
    distanceFrom: "0.8km from Durbarmarg",
    type: "Full-Time",
    postedDaysAgo: 2,
    views: 44,
    experience: "1–2 years",
    education: "Bachelor's / Diploma",
    vacancies: 2,
    postedDate: "Jun 12, 2025",
    isVerified: true,
    isFeatured: true,
    breadcrumbs: ["Job", "Design"],
    images: ["/job4.jpg", "/job2.jpg", "/job3.jpg"],
    description: "Creative Studio is seeking a talented Graphics Designer to join our dynamic team. You will create visual concepts for branding, social media, print, and digital marketing campaigns. The ideal candidate is creative, detail-oriented, and proficient in Adobe Creative Suite.",
    requirements: [
      "Proficiency in Adobe Photoshop & Illustrator",
      "Strong portfolio of design work",
      "Understanding of branding & typography",
      "Experience with social media graphics",
      "Ability to meet tight deadlines",
    ],
    benefits: [
      "Creative Work Environment",
      "Skill Development Budget",
      "Health Insurance",
      "Festival Bonus",
      "Flexible Hours",
    ],
    lat: 27.7126,
    lng: 85.3139,
    company: {
      name: "Creative Studio",
      logo: "/job4.jpg",
      rating: 4.5,
      reviewCount: 41,
      industry: "Design & Media",
      size: "10–50 employees",
      website: "https://www.creativestudio.com.np/",
      location: "Kathmandu, Nepal",
    },
    postedBy: {
      name: "Priya Tamang",
      avatar: "/lady.jpg",
      rating: 4.5,
      reviewCount: 29,
      isVerified: true,
    },
  },
  "ui-ux-designer": {
    id: "ui-ux-designer",
    jobId: "#JOB100005",
    title: "UI/UX Designer",
    salary: "NPR 60,000–90,000/month",
    location: "Kathmandu, Nepal",
    distanceFrom: "1.5km from Lazimpat",
    type: "Part-Time",
    postedDaysAgo: 3,
    views: 37,
    experience: "2–4 years",
    education: "Bachelor's",
    vacancies: 1,
    postedDate: "Jun 11, 2025",
    isVerified: true,
    isFeatured: false,
    breadcrumbs: ["Job", "Design"],
    images: ["/job3.jpg", "/job1.jpg", "/job5.jpg"],
    description: "Kreative Studio is hiring a UI/UX Designer to craft beautiful and intuitive user experiences. You will work on mobile and web applications, conducting user research, creating wireframes, and building high-fidelity prototypes. Strong Figma skills are essential.",
    requirements: [
      "2+ years of UI/UX design experience",
      "Expert-level Figma or Adobe XD skills",
      "User research & usability testing",
      "Strong portfolio of digital products",
      "Understanding of mobile-first design",
    ],
    benefits: [
      "Flexible Part-time Hours",
      "Remote Work Option",
      "Portfolio Building Projects",
      "Skill Development",
      "Competitive Pay",
    ],
    lat: 27.7289,
    lng: 85.3178,
    company: {
      name: "Kreative Studio",
      logo: "/job3.jpg",
      rating: 4.4,
      reviewCount: 33,
      industry: "Design & UX",
      size: "5–20 employees",
      website: "https://www.kreativestudio.com.np/",
      location: "Kathmandu, Nepal",
    },
    postedBy: {
      name: "Nisha Karmacharya",
      avatar: "/lady.jpg",
      rating: 4.7,
      reviewCount: 21,
      isVerified: true,
    },
  },
  "marketing-manager": {
    id: "marketing-manager",
    jobId: "#JOB100006",
    title: "Digital Marketing Manager",
    salary: "NPR 80,000–1,10,000/month",
    location: "Pokhara, Nepal",
    distanceFrom: "0.3km from Lakeside",
    type: "Full-Time",
    postedDaysAgo: 5,
    views: 55,
    experience: "3–5 years",
    education: "Bachelor's",
    vacancies: 1,
    postedDate: "Jun 09, 2025",
    isVerified: true,
    isFeatured: true,
    breadcrumbs: ["Job", "Marketing"],
    images: ["/job4.jpg", "/job2.jpg", "/job1.jpg"],
    description: "Nexus Media is looking for an experienced Digital Marketing Manager to lead all digital marketing efforts across SEO, SEM, social media, email campaigns, and analytics. You will manage a team of 4 marketers and report directly to the CEO. Pokhara-based candidates preferred.",
    requirements: [
      "3+ years in digital marketing",
      "Expertise in Google Ads & Meta Ads",
      "Strong SEO/SEM knowledge",
      "Google Analytics & data-driven mindset",
      "Team leadership experience",
      "Bachelor's degree in Marketing or related field",
    ],
    benefits: [
      "Leadership Role",
      "High Salary + Performance Bonus",
      "Full Health Coverage",
      "Annual Retreats",
      "Paid Leave",
      "Career Advancement",
    ],
    lat: 28.2096,
    lng: 83.9856,
    company: {
      name: "Nexus Media",
      logo: "/job4.jpg",
      rating: 4.6,
      reviewCount: 58,
      industry: "Media & Marketing",
      size: "30–80 employees",
      website: "https://www.nexusmedia.com.np/",
      location: "Pokhara, Nepal",
    },
    postedBy: {
      name: "Aman Gurung",
      avatar: "/lady.jpg",
      rating: 4.6,
      reviewCount: 40,
      isVerified: true,
    },
  },
  "construction-worker": {
    id: "construction-worker",
    jobId: "#JOB100007",
    title: "Construction Supervisor",
    salary: "NPR 25,000–35,000/month",
    location: "Chitwan, Nepal",
    distanceFrom: "Near Bharatpur Hospital",
    type: "Full-Time",
    postedDaysAgo: 1,
    views: 22,
    experience: "2–5 years",
    education: "Diploma / Bachelor's",
    vacancies: 3,
    postedDate: "Jun 13, 2025",
    isVerified: true,
    isFeatured: false,
    breadcrumbs: ["Job", "Construction"],
    images: ["/job2.jpg", "/job5.jpg", "/job3.jpg"],
    description: "Nepal Build Co. is seeking Construction Supervisors to oversee residential and commercial construction projects in Chitwan. You will coordinate labor teams, manage materials, ensure quality control, and enforce safety standards on site.",
    requirements: [
      "2+ years in construction supervision",
      "Knowledge of Civil Engineering basics",
      "Ability to read construction drawings",
      "Strong safety management skills",
      "Good communication with labor teams",
      "Valid driving license preferred",
    ],
    benefits: [
      "Site Allowance",
      "Travel Reimbursement",
      "Accident Insurance",
      "Festival Bonus",
      "Accommodation Support",
    ],
    lat: 27.6752,
    lng: 84.4304,
    company: {
      name: "Nepal Build Co.",
      logo: "/job2.jpg",
      rating: 4.0,
      reviewCount: 19,
      industry: "Construction",
      size: "50–200 employees",
      website: "https://www.nepalbuild.com.np/",
      location: "Chitwan, Nepal",
    },
    postedBy: {
      name: "Suresh Rana",
      avatar: "/lady.jpg",
      rating: 4.1,
      reviewCount: 14,
      isVerified: false,
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
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating)
          ? <FaStar key={i} size={13} color="#F39C12" />
          : <FaRegStar key={i} size={13} color="#F39C12" />
      )}
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
          background: #f5f6f8;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          flex-direction: column;
        }
        .jd-main { flex: 1; }

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
        .jd-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 80px;
          align-self: start;
        }

        /* COMPANY CARD */
        .jd-company-card {
          background: #fff; border-radius: 16px;
          padding: 20px 18px; box-shadow: 0 2px 14px rgba(0,0,0,0.08);
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

        <div className="jd-main">
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
                    <FiCheckCircle size={10} color="#1e8449" />
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
                    {isFav ? <FaHeart size={15} color="#E74C3C" /> : <FiHeart size={15} color="#999" />}
                  </button>
                  <button
                    className="jd-action-btn"
                    aria-label="Share job"
                    title="Share"
                    onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})}
                  >
                    <FiShare2 size={15} color="#666" />
                  </button>
                </div>
              </div>

              <p className="jd-salary">{job.salary}</p>

              <div className="jd-meta-row">
                <span className="jd-meta-item">
                  <FiMapPin size={13} color="#bbb" />
                  {job.location}
                </span>
                <span className="jd-meta-dot" />
                <span className="jd-meta-item">
                  <FiBriefcase size={13} color="#bbb" />
                  {job.type}
                </span>
                <span className="jd-meta-dot" />
                <span className="jd-meta-item">
                  <FiClock size={13} color="#bbb" />
                  Posted {job.postedDaysAgo} Day{job.postedDaysAgo > 1 ? "s" : ""} ago
                </span>
                <span className="jd-meta-dot" />
                <span className="jd-meta-item" style={{ color: "#aaa" }}>
                  <FiEye size={13} color="#bbb" />
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
                    <><FiCheck size={15} color="#fff" /> Applied!</>
                  ) : (
                    <><FiSend size={15} color="#fff" /> Apply Now</>
                  )}
                </button>
                <button className="jd-btn-chat">
                  <FiMessageSquare size={15} color="#1a5fd4" />
                  Chat with Employer
                </button>
              </div>

              {/* SPECS */}
              <div className="jd-specs-bar">
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon"><FiUser size={18} color="#1a5fd4" /></div>
                  <span className="jd-spec-val">{job.experience}</span>
                  <span className="jd-spec-label">Experience</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon"><FiBriefcase size={18} color="#1a5fd4" /></div>
                  <span className="jd-spec-val">{job.type}</span>
                  <span className="jd-spec-label">Employment Type</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon"><FaGraduationCap size={18} color="#1a5fd4" /></div>
                  <span className="jd-spec-val">{job.education}</span>
                  <span className="jd-spec-label">Education</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon"><FiUsers size={18} color="#1a5fd4" /></div>
                  <span className="jd-spec-val">{job.vacancies} openings</span>
                  <span className="jd-spec-label">Vacancies</span>
                </div>
                <div className="jd-spec-chip">
                  <div className="jd-spec-icon"><FiCalendar size={18} color="#1a5fd4" /></div>
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
                <FiPlusSquare size={14} color="#1a5fd4" />
                View Company Profile
              </button>
            </div>

            {/* MAP CARD */}
            <div className="jd-map-card">
              <p className="jd-map-card-title">Location</p>
              {/* Real OpenStreetMap embed — no API key needed */}
              <div style={{ height: 160, overflow: "hidden" }}>
                <iframe
                  title="Job Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${job.lng - 0.015}%2C${job.lat - 0.010}%2C${job.lng + 0.015}%2C${job.lat + 0.010}&layer=mapnik&marker=${job.lat}%2C${job.lng}`}
                />
              </div>
              <p className="jd-map-city">{job.location}</p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${job.lat}&mlon=${job.lng}#map=15/${job.lat}/${job.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="jd-map-link"
              >
                <FiMapPin size={12} color="#1a5fd4" />
                View Full Map
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
                      <FiCheck size={9} color="#1e8449" />
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
                  <><FiCheck size={14} color="#1e8449" /> Message Sent!</>
                ) : (
                  <><FiMessageSquare size={14} color="#555" /> Send Message</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
}
