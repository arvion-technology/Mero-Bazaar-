"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

type Job = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  image: string;
  category: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  postedDaysAgo: number;
  vacancies: number;
};

const JOBS: Job[] = [
  {
    id: "software-developer-frontend",
    title: "Software Developer (Frontend)",
    company: "Aarovin Technology",
    salary: "Rs. 70,000–100,000/month",
    location: "Kathmandu, Nepal",
    type: "Full-Time",
    image: "/job1.jpg",
    category: "IT & Software",
    isVerified: true,
    isFeatured: true,
    postedDaysAgo: 2,
    vacancies: 2,
  },
  {
    id: "senior-backend-engineer",
    title: "Senior Backend Engineer",
    company: "CloudNine Solutions",
    salary: "Rs. 1,20,000–1,80,000/month",
    location: "Lalitpur, Nepal",
    type: "Full-Time",
    image: "/job2.jpg",
    category: "IT & Software",
    isVerified: true,
    isFeatured: false,
    postedDaysAgo: 1,
    vacancies: 1,
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    company: "Kreative Studio",
    salary: "Rs. 60,000–90,000/month",
    location: "Kathmandu, Nepal",
    type: "Full-Time",
    image: "/job3.jpg",
    category: "Design",
    isVerified: true,
    isFeatured: true,
    postedDaysAgo: 3,
    vacancies: 2,
  },
  {
    id: "marketing-manager",
    title: "Digital Marketing Manager",
    company: "Nexus Media",
    salary: "Rs. 80,000–1,10,000/month",
    location: "Pokhara, Nepal",
    type: "Full-Time",
    image: "/job4.jpg",
    category: "Marketing",
    isVerified: false,
    isFeatured: false,
    postedDaysAgo: 5,
    vacancies: 3,
  }
];

const CATEGORIES = ["All Jobs", "IT & Software", "Design", "Marketing", "Management", "Finance", "Education", "Others"];
const JOB_TYPES = ["Full-Time", "Part-Time", "Remote", "Contract", "Internship"];
const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal"];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [activeCat, setActiveCat] = useState("All Jobs");
  const [city, setCity] = useState("");
  const [jobType, setJobType] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((p) => ({ ...p, [id]: !p[id] }));
  };

  const displayed = JOBS.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === "All Jobs" || j.category === activeCat;
    const matchCity = !city || j.location.includes(city);
    const matchType = !jobType || j.type === jobType;
    const matchVerified = !verifiedOnly || j.isVerified;
    return matchSearch && matchCat && matchCity && matchType && matchVerified;
  }).sort((a, b) => {
    if (sort === "newest") return a.postedDaysAgo - b.postedDaysAgo;
    if (sort === "oldest") return b.postedDaysAgo - a.postedDaysAgo;
    return 0;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .jp { background: #f0f2f8; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* HERO */
        .jp-hero {
          position: relative; height: 240px; overflow: hidden;
          display: flex; align-items: center;
        }
        .jp-hero-bg {
          position: absolute; inset: 0;
          background: url('/job1.jpg') center center / cover no-repeat;
          filter: brightness(0.55);
        }
        .jp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(20,50,120,0.72) 0%, rgba(10,25,70,0.5) 100%);
        }
        .jp-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 0 28px; width: 100%;
        }
        .jp-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 4px 12px; border-radius: 20px; margin-bottom: 10px;
          backdrop-filter: blur(6px);
        }
        .jp-hero-title {
          font-size: clamp(26px, 4vw, 42px); font-weight: 900; color: #fff;
          margin: 0 0 4px; line-height: 1.15;
          text-shadow: 0 2px 14px rgba(0,0,0,0.35);
        }
        .jp-hero-sub {
          color: rgba(255,255,255,0.78); font-size: 13.5px;
          margin: 0 0 20px; font-weight: 400;
        }
        .jp-search-wrap { position: relative; max-width: 500px; }
        .jp-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: #aaa;
        }
        .jp-search {
          width: 100%; padding: 13px 14px 13px 44px;
          background: rgba(255,255,255,0.95); border: none; border-radius: 12px;
          font-size: 14px; color: #333; font-family: inherit; outline: none;
          box-shadow: 0 4px 24px rgba(0,0,0,0.2); transition: box-shadow 0.2s;
        }
        .jp-search:focus { box-shadow: 0 4px 30px rgba(0,0,0,0.3); }
        .jp-hero-watermark {
          position: absolute; bottom: -20px; left: 28px;
          font-size: clamp(50px, 10vw, 90px); font-weight: 900;
          color: rgba(255,255,255,0.06); letter-spacing: -2px;
          pointer-events: none; user-select: none; line-height: 1; z-index: 1;
        }

        /* BODY */
        .jp-body { max-width: 1200px; margin: 0 auto; padding: 28px 24px 60px; }
        .jp-layout { display: grid; grid-template-columns: 280px 1fr; gap: 22px; align-items: start; }

        /* SIDEBAR */
        .jp-sidebar {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8e8f0; overflow: hidden;
          position: sticky; top: 82px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .jsf-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px; border-bottom: 1.5px solid #f2f2f5;
        }
        .jsf-head-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .jsf-reset {
          font-size: 13px; font-weight: 700; color: #1a5fd4;
          background: none; border: none; cursor: pointer; padding: 0; transition: opacity 0.2s;
        }
        .jsf-reset:hover { opacity: 0.7; }
        .jsf-section { padding: 16px 18px; border-bottom: 1.5px solid #f2f2f5; }
        .jsf-section:last-of-type { border-bottom: none; }
        .jsf-label { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px; }

        .jsf-select {
          width: 100%; padding: 10px 32px 10px 12px;
          border: 1.5px solid #e8e8f0; border-radius: 10px;
          font-size: 13px; color: #444; font-family: inherit;
          background: #fafafa url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          transition: border-color 0.2s;
        }
        .jsf-select:focus { border-color: #1a5fd4; }

        .jsf-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .jsf-toggle-label { font-size: 13.5px; font-weight: 600; color: #333; }
        .jsf-toggle { position: relative; width: 42px; height: 24px; cursor: pointer; display: inline-block; }
        .jsf-toggle input { opacity: 0; width: 0; height: 0; }
        .jsf-toggle-track {
          position: absolute; inset: 0;
          background: #ddd; border-radius: 24px; transition: background 0.25s;
        }
        .jsf-toggle input:checked + .jsf-toggle-track { background: #1a5fd4; }
        .jsf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
        }
        .jsf-toggle input:checked ~ .jsf-toggle-thumb { transform: translateX(18px); }

        .jsf-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; }
        .jsf-chip {
          padding: 6px 14px; border-radius: 100px; font-size: 12.5px; font-weight: 600;
          border: 1.5px solid #e0e0e8; background: #fff; color: #555;
          cursor: pointer; transition: all 0.18s;
        }
        .jsf-chip:hover { border-color: #1a5fd4; color: #1a5fd4; }
        .jsf-chip.active { background: #1a5fd4; color: #fff; border-color: #1a5fd4; box-shadow: 0 2px 8px rgba(26,95,212,0.3); }

        .jsf-apply {
          display: block; width: calc(100% - 36px); margin: 4px 18px 18px;
          padding: 12px; text-align: center;
          background: linear-gradient(90deg, #1a5fd4, #0d3d9e);
          color: #fff; font-size: 14px; font-weight: 800;
          border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 16px rgba(26,95,212,0.3);
          transition: opacity 0.18s, transform 0.18s;
        }
        .jsf-apply:hover { opacity: 0.88; transform: translateY(-1px); }

        /* RESULTS BAR */
        .jp-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .jp-results-count { font-size: 14px; color: #666; font-weight: 500; }
        .jp-sort-select {
          padding: 9px 36px 9px 14px; border: 1.5px solid #e0e0e8; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #333;
          background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none; outline: none; cursor: pointer;
          font-family: inherit; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: border-color 0.2s;
        }
        .jp-sort-select:focus { border-color: #1a5fd4; }

        /* GRID */
        .jp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

        /* CARD */
        .jp-card {
          background: #fff; border-radius: 16px; border: 1.5px solid #ececec;
          overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); cursor: pointer;
        }
        .jp-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .jp-img-wrap {
          position: relative; width: 100%; aspect-ratio: 16/9;
          overflow: hidden; background: #f0f0f5;
        }
        .jp-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.32s ease; }
        .jp-card:hover .jp-img { transform: scale(1.06); }

        .jp-heart {
          position: absolute; top: 9px; right: 9px;
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(255,255,255,0.93); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 4; padding: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.14);
          transition: transform 0.18s, background 0.18s;
        }
        .jp-heart:hover { transform: scale(1.18); background: #fff; }

        .jp-badges {
          position: absolute; top: 9px; left: 9px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .jp-badge-verified {
          display: inline-flex; align-items: center; gap: 3px;
          background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .jp-badge-featured {
          display: inline-flex; align-items: center; gap: 3px;
          background: #fff8e1; color: #b7950b; border: 1px solid #f9e79f;
          font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }

        .jp-card-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 5px; }
        .jp-card-company { font-size: 11.5px; font-weight: 600; color: #1a5fd4; margin: 0; text-transform: uppercase; letter-spacing: 0.4px; }
        .jp-card-title { font-size: 15px; font-weight: 700; color: #1a1a1a; line-height: 1.35; margin: 0; }
        .jp-card-salary { font-size: 14px; font-weight: 800; color: #1a5fd4; margin: 0; }
        .jp-card-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
        .jp-card-location { font-size: 12px; color: #888; font-weight: 500; display: flex; align-items: center; gap: 3px; }
        .jp-card-type {
          font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
          background: #eef2ff; color: #3b5bdb;
        }
        .jp-card-posted { font-size: 11px; color: #bbb; margin-left: auto; }

        .jp-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 8px; padding-top: 10px; border-top: 1px solid #f5f5f5;
        }
        .jp-card-vacancies { font-size: 12px; color: #888; }
        .jp-card-apply {
          font-size: 12px; font-weight: 700; color: #1a5fd4;
          background: #eef2ff; border: none; border-radius: 8px;
          padding: 6px 14px; cursor: pointer; font-family: inherit;
          transition: background 0.18s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .jp-card-apply:hover { background: #dde6ff; }

        /* EMPTY */
        .jp-empty { grid-column: 1/-1; padding: 64px 24px; text-align: center; color: #888; }
        .jp-empty-icon { font-size: 48px; margin-bottom: 12px; }
        .jp-empty p { font-size: 15px; font-weight: 600; color: #555; margin: 0 0 4px; }
        .jp-empty span { font-size: 13px; color: #aaa; }

        /* RESPONSIVE */
        @media (max-width: 900px) { .jp-layout { grid-template-columns: 1fr; } .jp-sidebar { display: none; } }
        @media (max-width: 640px) { .jp-hero { height: 200px; } .jp-body { padding: 20px 16px 40px; } .jp-grid { grid-template-columns: 1fr; gap: 12px; } }
      `}</style>

      <div className="jp">
        {/* HERO */}
        <section className="jp-hero">
          <div className="jp-hero-bg" />
          <div className="jp-hero-overlay" />
          <div className="jp-hero-watermark">Jobs</div>
          <div className="jp-hero-inner">
            <div className="jp-hero-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#fff" strokeWidth="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#fff" strokeWidth="2"/></svg>
              Nepal's #1 Job Portal
            </div>
            <h1 className="jp-hero-title">Find Your Dream Job</h1>
            <p className="jp-hero-sub">Browse thousands of jobs across Nepal</p>
            <div className="jp-search-wrap">
              <svg className="jp-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#aaa" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="#aaa" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                className="jp-search"
                placeholder="Search jobs, companies, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="jp-body">
          <div className="jp-layout">
            {/* SIDEBAR */}
            <aside className="jp-sidebar">
              <div className="jsf-head">
                <p className="jsf-head-title">Filters</p>
                <button className="jsf-reset" onClick={() => { setCity(""); setJobType(""); setVerifiedOnly(false); setActiveCat("All Jobs"); }}>Reset</button>
              </div>

              <div className="jsf-section">
                <p className="jsf-label">Location / City</p>
                <select className="jsf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select City</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="jsf-section">
                <p className="jsf-label">Job Type</p>
                <select className="jsf-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="">All Types</option>
                  {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="jsf-section">
                <div className="jsf-toggle-row">
                  <span className="jsf-toggle-label">Verified Jobs Only</span>
                  <label className="jsf-toggle">
                    <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                    <span className="jsf-toggle-track" />
                    <span className="jsf-toggle-thumb" />
                  </label>
                </div>
              </div>

              <div className="jsf-section">
                <p className="jsf-label">Categories</p>
                <div className="jsf-chips">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} className={`jsf-chip${activeCat === cat ? " active" : ""}`} onClick={() => setActiveCat(cat)}>{cat}</button>
                  ))}
                </div>
              </div>

              <button className="jsf-apply">Apply Filters</button>
            </aside>

            {/* RIGHT COLUMN */}
            <div>
              <div className="jp-results-bar">
                <span className="jp-results-count">{displayed.length} jobs found</span>
                <select className="jp-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="jp-grid">
                {displayed.length === 0 ? (
                  <div className="jp-empty">
                    <div className="jp-empty-icon">💼</div>
                    <p>No jobs found</p>
                    <span>Try a different search or filter</span>
                  </div>
                ) : (
                  displayed.map((j) => {
                    const isFav = !!favorites[j.id];
                    return (
                      <Link key={j.id} href={`/category/job/${j.id}`} className="jp-card">
                        <div className="jp-img-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={j.image} alt={j.title} className="jp-img" />
                          <div className="jp-badges">
                            {j.isVerified && <span className="jp-badge-verified">✓ Verified</span>}
                            {j.isFeatured && <span className="jp-badge-featured">⭐ Featured</span>}
                          </div>
                          <button className="jp-heart" aria-label="Save" onClick={(e) => toggleFav(j.id, e)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "#E74C3C" : "none"}>
                              <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z" stroke={isFav ? "#E74C3C" : "#999"} strokeWidth="1.8" />
                            </svg>
                          </button>
                        </div>
                        <div className="jp-card-body">
                          <p className="jp-card-company">{j.company}</p>
                          <p className="jp-card-title">{j.title}</p>
                          <p className="jp-card-salary">{j.salary}</p>
                          <div className="jp-card-meta">
                            <span className="jp-card-location">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#bbb"/></svg>
                              {j.location}
                            </span>
                            <span className="jp-card-type">{j.type}</span>
                            <span className="jp-card-posted">{j.postedDaysAgo}d ago</span>
                          </div>
                          <div className="jp-card-footer">
                            <span className="jp-card-vacancies">🧑‍💼 {j.vacancies} opening{j.vacancies > 1 ? "s" : ""}</span>
                            <span className="jp-card-apply">Apply Now →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
