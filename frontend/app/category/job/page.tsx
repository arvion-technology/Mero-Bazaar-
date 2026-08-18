"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiSearch, FiMapPin, FiPhone, FiMessageSquare, FiChevronDown, FiTarget, FiLoader, FiBriefcase, FiShare2, FiHeart } from "react-icons/fi";
import { FaHeart, FaBriefcase } from "react-icons/fa";
import { JOB_TYPES, CITIES, SKILLS, JobCard } from "../../types/jobs";
import { toContractType, toJobCard } from "@/lib/adapter";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [city, setCity] = useState("");
  const [skill, setSkill] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const EXTRA_SKILLS_THRESHOLD = 2;

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!session?.accessToken) return;

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/mine`, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        const favMap: Record<string, boolean> = {};
        data.forEach((item: { listingId: string }) => {
          favMap[item.listingId] = true;
        });
        setFavorites(favMap);
      } catch {
        // silently ignore
      }
    })();
  }, [session?.accessToken]);

  const toggleFav = async (id: string, e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!session?.accessToken) {
    toast.error("Please log in to save listings");
    return;
  }

  const previousState = !!favorites[id];

  // Instant UI update
  setFavorites((p) => ({
    ...p,
    [id]: !previousState,
  }));

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/toggle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          listingId: id,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update wishlist");
    }

    const data = await res.json();

    setFavorites((p) => ({
      ...p,
      [id]: data.favorited,
    }));

    toast.success(
      data.favorited
        ? "Added to wishlist"
        : "Removed from wishlist"
    );
  } catch (error) {
    console.error("Wishlist error:", error);

    // Rollback UI if API fails
    setFavorites((p) => ({
      ...p,
      [id]: previousState,
    }));

    toast.error("Something went wrong. Please try again.");
  }
};

  const shareJob = async (
    job: JobCard,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const jobUrl =
      `${window.location.origin}/category/job/${job.id}`;

    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company}`,
      url: jobUrl,
    };

    try {
      // Mobile / supported browsers
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      // Desktop fallback
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(jobUrl);
        alert("Job link copied!");
        return;
      }

      // Final fallback
      window.prompt("Copy this job link:", jobUrl);
    } catch (error) {
      // User cancelled share popup
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Job share failed:", error);
    }
  };

  const toggleType = (t: string) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("query", debouncedSearch);
        if (city) params.set("city", city);
        if (skill) params.set("skill", skill);
        if (minSalary) params.set("minSalary", minSalary);
        selectedTypes.forEach((t) =>
          params.append("contractType", toContractType(t))
        );

        console.log("Sending params:", params.toString());
        const data = await api.getJobs(params);
        const mapped = data.map(toJobCard);
        console.log("Job IDs:", mapped.map(j => j.id));
        setJobs(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [debouncedSearch, city, skill, minSalary, selectedTypes]);

  // Parse salary string like "NPR 30,000 - 50,000/month" or "NPR 20,000/month"
  const parseSalaryNum = (salaryStr: string): number => {
    const match = salaryStr.replace(/,/g, "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sort === "salary-high") return parseSalaryNum(b.salary) - parseSalaryNum(a.salary);
    if (sort === "salary-low") return parseSalaryNum(a.salary) - parseSalaryNum(b.salary);
    return 0; // newest (default from API)
  });

  const sortLabel: Record<string, string> = {
    newest: "Newest",
    "salary-high": "Salary: High to Low",
    "salary-low": "Salary: Low to High",
  };

  return (
    <>
      <style>{`
        .jp-wrap { background: #f4f5f7; min-height: 100vh; font-family: 'Inter', -apple-system, sans-serif; }
        .jp-hero { position: relative; height: 250px; overflow: hidden; display: flex; align-items: center; }
        .jp-hero-bg { position: absolute; inset: 0; background: url('/job1.jpg') center / cover no-repeat; filter: brightness(0.52); }
        .jp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(10,30,90,0.75) 0%, rgba(5,15,50,0.5) 100%); }
        .jp-hero-wm { position: absolute; bottom: -10px; left: 28px; font-size: clamp(60px,10vw,110px); font-weight: 900; color: rgba(255,255,255,0.05); line-height: 1; pointer-events: none; user-select: none; letter-spacing: -3px; }
        .jp-hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 0 24px; width: 100%; }
        .jp-hero-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.25); color: #fff; font-size: 11.5px; font-weight: 600; padding: 4px 13px; border-radius: 20px; margin-bottom: 10px; backdrop-filter: blur(6px); }
        .jp-hero h1 { font-size: clamp(26px,4vw,44px); font-weight: 900; color: #fff; margin: 0 0 6px; line-height: 1.18; text-shadow: 0 2px 16px rgba(0,0,0,0.4); }
        .jp-hero-sub { color: rgba(255,255,255,0.75); font-size: 14px; margin: 0 0 20px; }
        .jp-search-wrap { position: relative; max-width: 520px; }
        .jp-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
        .jp-search { width: 100%; padding: 13px 16px 13px 44px; background: rgba(255,255,255,0.97); border: none; border-radius: 12px; font-size: 14px; color: #333; font-family: inherit; outline: none; box-shadow: 0 6px 28px rgba(0,0,0,0.22); transition: box-shadow 0.2s; }
        .jp-search:focus { box-shadow: 0 6px 36px rgba(0,0,0,0.32); }
        .jp-search::placeholder { color: #bbb; }
        .jp-body { max-width: 1200px; margin: 0 auto; padding: 24px 24px 80px; }
        .jp-layout { display: flex; gap: 22px; align-items: flex-start; }
        .jp-sidebar { width: 220px; flex-shrink: 0; background: #fff; border-radius: 16px; border: 1.5px solid #e8e8f0; overflow: hidden; position: sticky; top: 56px; box-shadow: 0 2px 14px rgba(0,0,0,0.07); }
        .jsb-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; background: linear-gradient(90deg, #e05c3a, #c0392b); cursor: pointer; }
        .jsb-head-title { font-size: 16px; font-weight: 800; color: #fff; }
        .jsb-head-arrow { width: 28px; height: 28px; background: rgba(255,255,255,0.2); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; }
        .jsb-section { padding: 13px 16px; border-bottom: 1.5px solid #f2f2f5; }
        .jsb-section:last-of-type { border-bottom: none; }
        .jsb-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin: 0 0 9px; }
        .jsb-rows { display: flex; flex-direction: column; gap: 7px; }
        .jsb-row { display: flex; align-items: center; gap: 9px; cursor: pointer; font-size: 13.5px; color: #444; font-weight: 500; user-select: none; }
        .jsb-row input[type=checkbox] { accent-color: #e05c3a; width: 15px; height: 15px; cursor: pointer; }
        .jsb-row.checked { color: #e05c3a; font-weight: 600; }
        .jsb-select { width: 100%; padding: 9px 32px 9px 11px; border: 1.5px solid #e8e8f0; border-radius: 10px; font-size: 13px; color: #444; font-family: inherit; background: #fafafa; appearance: none; outline: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 11px center; transition: border-color 0.2s; }
        .jsb-select:focus { border-color: #e05c3a; }
        .jsb-salary-row { display: flex; align-items: center; gap: 6px; }
        .jsb-salary-input { flex: 1; padding: 9px 11px; border: 1.5px solid #e8e8f0; border-radius: 10px; font-size: 13px; color: #444; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .jsb-salary-input:focus { border-color: #e05c3a; }
        .jsb-salary-wrap { position: relative; flex: 1; }
        .jsb-salary-chevron { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #999; pointer-events: none; }
        .jsb-apply { display: block; width: calc(100% - 32px); margin: 12px 16px; padding: 11px; text-align: center; background: linear-gradient(90deg, #e05c3a, #c0392b); color: #fff; font-size: 13.5px; font-weight: 800; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; box-shadow: 0 4px 14px rgba(192,57,43,0.3); transition: opacity 0.18s; }
        .jsb-apply:hover { opacity: 0.88; }
        .jp-right { flex: 1; min-width: 0; }
        .jp-results-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .jp-count { font-size: 14px; color: #555; font-weight: 500; }
        .jp-count strong { color: #111; font-weight: 800; }

        /* ── CUSTOM SORT DROPDOWN (No overflow issues) ── */
        .jp-sort-dropdown { position: relative; }
        .jp-sort-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          background: #fff; border: 1.5px solid #e0e0ec;
          border-radius: 10px; font-size: 13px; font-weight: 600;
          color: #333; cursor: pointer; font-family: inherit;
          transition: border-color 0.2s;
        }
        .jp-sort-btn:hover { border-color: #bbb; }
        .jp-sort-menu {
          position: absolute; top: calc(100% + 6px); right: 0;
          min-width: 190px;
          background: #fff; border: 1.5px solid #e0e0e0; border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 200;
          overflow: hidden;
          animation: sortFade 0.15s ease;
        }
        @keyframes sortFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .jp-sort-option {
          padding: 10px 16px; font-size: 13px; color: #444;
          cursor: pointer; transition: all 0.15s;
          border-bottom: 1px solid #f5f5f5;
        }
        .jp-sort-option:last-child { border-bottom: none; }
        .jp-sort-option:hover { background: #fff1f2; color: #e05c3a; }
        .jp-sort-option.active { background: #e05c3a; color: #fff; }

        .jp-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .jp-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: transform 0.2s ease, box-shadow 0.2s ease; display: flex; flex-direction: column; gap: 16px; }
        .jp-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .jp-card-save,.jp-card-share {width: 34px; height: 34px; border: 1px solid #e2e8f0; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0;
          transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);}
        .jp-card-save:hover,
        .jp-card-share:hover { transform: scale(1.12); background: #fff5f4; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);}
        .jp-card-share { color: #555;}
        .jp-card-share:hover { color: #e05c3a;}        
        .jp-card-body-row { display: flex; align-items: flex-start; gap: 16px; }
        .jp-thumb { width: 72px; height: 72px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid #e2e8f0; background: #f7fafc; }
        .jp-card-main-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .jp-card-title { font-size: 17px; font-weight: 700; color: #000; margin: 0; line-height: 1.25; }
        .jp-card-company { font-size: 13.5px; color: #333; margin: 0; font-weight: 400; }
        .jp-card-salary { font-size: 15px; font-weight: 700; color: #ff3b30; margin: 0; }
        .jp-card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 2px; }
        .jp-card-location { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #777; }
        .jp-type-badge { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 20px; background: #d1fae5; color: #059669; }
        .jp-type-badge.part { background: #dbeafe; color: #1d4ed8; }
        .jp-type-badge.gig { background: #fef3c7; color: #d97706; }
        .jp-type-badge.construction { background: #fee2e2; color: #dc2626; }
        .jp-skills { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 4px; }
        .jp-skill { font-size: 12px; font-weight: 500; color: #444; background: #f1f3f5; border: 1px solid #e2e8f0; padding: 3px 9px; border-radius: 6px; }
        .jp-skill-more { font-size: 12px; font-weight: 600; color: #666; background: #f1f3f5; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 6px; }
        .jp-card-actions { display: flex; gap: 12px; margin-top: auto; }
        .jp-btn { flex: 1; padding: 10px 12px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13.5px; font-weight: 700; border-radius: 8px; cursor: pointer; font-family: inherit; transition: background 0.15s, color 0.15s, border-color 0.15s; text-decoration: none; }
        .jp-btn-apply { background: #ff3b30; color: #fff; border: 1px solid #ff3b30; }
        .jp-btn-apply:hover { background: #e03126; border-color: #e03126; }
        .jp-btn-call { background: #fff; color: #ff3b30; border: 1px solid #ff3b30; }
        .jp-btn-call:hover { background: #fff0f0; }
        .jp-btn-chat { background: #fff; color: #ff3b30; border: 1px solid #ff3b30; }
        .jp-btn-chat:hover { background: #fff0f0; }

        /* ── EMPTY / LOADING ── */
        .jp-empty { text-align: center; padding: 60px 20px; color: #aaa; }
        .jp-empty-icon { margin-bottom: 14px; color: #bbb; }
        .jp-empty p { font-size: 16px; font-weight: 700; color: #555; margin: 0 0 6px; }
        .jp-empty span { font-size: 13px; color: #888; }

        @media (max-width: 900px) { .jp-sidebar { display: none; } }
        @media (max-width: 768px) { .jp-list { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .jp-body { padding: 16px 14px 60px; } .jp-hero { height: 220px; } .jp-card-body-row { gap: 12px; } .jp-thumb { width: 64px; height: 64px; } .jp-card-title { font-size: 16px; } .jp-btn { padding: 9px 8px; font-size: 12.5px; } }
      `}</style>

      <div className="jp-wrap">

        {/* HERO */}
        <section className="jp-hero">
          <div className="jp-hero-bg" />
          <div className="jp-hero-overlay" />
          <div className="jp-hero-wm">Jobs</div>
          <div className="jp-hero-inner">
            <div className="jp-hero-tag">
              <FaBriefcase size={11} />
              Nepal&apos;s #1 Job Portal
            </div>
            <h1>Find Your Dream Job</h1>
            <p className="jp-hero-sub">Browse thousands of Jobs across Nepal</p>
            <div className="jp-search-wrap">
              <FiSearch className="jp-search-icon" size={17} />
              <input
                className="jp-search"
                placeholder="Search job, Companies, Location............"
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
              <div className="jsb-head">
                <span className="jsb-head-title">Filters</span>
                <span className="jsb-head-arrow">›</span>
              </div>
              <div className="jsb-section">
                <p className="jsb-title">Job Type</p>
                <div className="jsb-rows">
                  {JOB_TYPES.map((t) => (
                    <label key={t} className={`jsb-row${selectedTypes.includes(t) ? " checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(t)}
                        onChange={() => toggleType(t)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="jsb-section">
                <p className="jsb-title">City</p>
                <select className="jsb-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="jsb-section">
                <p className="jsb-title">Skill / Keyword</p>
                <select className="jsb-select" value={skill} onChange={(e) => setSkill(e.target.value)}>
                  <option value="">Select skill</option>
                  {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="jsb-section">
                <p className="jsb-title">Minimum Salary</p>
                <div className="jsb-salary-row">
                  <input
                    type="number"
                    className="jsb-salary-input"
                    placeholder="e.g. 20,000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                  />
                  <div className="jsb-salary-wrap" style={{ flex: "0 0 auto" }}>
                    <select className="jsb-select" style={{ width: "auto", paddingRight: 28, paddingLeft: 8 }}>
                      <option>/month</option>
                    </select>
                    <FiChevronDown size={11} className="jsb-salary-chevron" />
                  </div>
                </div>
              </div>
              <button className="jsb-apply">Apply Filters</button>
            </aside>

            {/* RIGHT */}
            <div className="jp-right">
              <div className="jp-results-bar">
                <span className="jp-count">
                  <strong>{loading ? "…" : sortedJobs.length}</strong> results found
                </span>

                {/* ── CUSTOM SORT DROPDOWN (fixes overflow) ── */}
                <div className="jp-sort-dropdown" ref={sortRef}>
                  <button className="jp-sort-btn" onClick={() => setIsSortOpen((v) => !v)}>
                    {sortLabel[sort]}
                    <FiChevronDown
                      size={14}
                      style={{ transform: isSortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    />
                  </button>
                  {isSortOpen && (
                    <div className="jp-sort-menu">
                      {SORT_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className={`jp-sort-option${sort === opt.value ? " active" : ""}`}
                          onClick={() => {
                            setSort(opt.value);
                            setIsSortOpen(false);
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="jp-empty">
                  <div className="jp-empty-icon">
                    <FiLoader size={52} />
                  </div>
                  <p>Loading jobs...</p>
                </div>
              ) : sortedJobs.length === 0 ? (
                <div className="jp-empty">
                  <div className="jp-empty-icon">
                    <FiBriefcase size={52} />
                  </div>
                  <p>No jobs found</p>
                  <span>Try adjusting your filters or search term</span>
                </div>
              ) : (
                <div className="jp-list">
                  {sortedJobs.map((j) => {
                    const isFav = !!favorites[j.id];
                    const typeClass =
                      j.type.toLowerCase().includes("part") ? "part"
                        : j.type.toLowerCase().includes("gig") ? "gig"
                          : j.type.toLowerCase().includes("labour") ? "construction"
                            : "";
                    const visibleSkills = j.skills.slice(0, EXTRA_SKILLS_THRESHOLD);
                    const extraCount = j.skills.length - EXTRA_SKILLS_THRESHOLD;

                    return (
                      <Link key={j.id} href={`/category/job/${j.id}`} className="jp-card" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Favorite / Wishlist */}
                        <button
                          type="button"
                          className="jp-card-save"
                          aria-label="Save job"
                          title="Save job"
                          onClick={(e) => toggleFav(j.id, e)}
                        >
                          {isFav ? (
                            <FaHeart size={16} color="#ff3b30" />
                          ) : (
                            <FiHeart size={16} color="#000" />
                          )}
                        </button>

                        {/* Share */}
                        <button
                          type="button"
                          className="jp-card-share"
                          aria-label={`Share ${j.title}`}
                          title="Share job"
                          onClick={(e) => shareJob(j, e)}
                        >
                          <FiShare2 size={16} />
                        </button>


                        <div className="jp-card-body-row">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={j.thumb} alt={j.company} className="jp-thumb" />
                          <div className="jp-card-main-content">
                            <p className="jp-card-title">{j.title}</p>
                            <p className="jp-card-company">{j.company}</p>
                            <p className="jp-card-salary">{j.salary}</p>
                            <div className="jp-card-meta">
                              <span className="jp-card-location">
                                <FiMapPin size={12} color="#777" />
                                {j.location}
                              </span>
                              <span className={`jp-type-badge ${typeClass}`}>{j.type}</span>
                            </div>
                            <div className="jp-skills">
                              {visibleSkills.map((sk) => (
                                <span key={sk} className="jp-skill">{sk}</span>
                              ))}
                              {extraCount > 0 && (
                                <span className="jp-skill-more">+{extraCount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="jp-card-actions">
                          <Link href={`/category/job/${j.id}`} className="jp-btn jp-btn-apply">
                            <FiTarget size={14} /> Apply
                          </Link>
                          <a href="tel:+977-9800000000" className="jp-btn jp-btn-call">
                            <FiPhone size={14} /> Call
                          </a>
                          <button className="jp-btn jp-btn-chat">
                            <FiMessageSquare size={14} /> Chat
                          </button>
                        </div>
                      </Link>
                    );
                  })}
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