"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiMapPin,
  FiPhone,
  FiMessageSquare,
  FiChevronDown,
  FiTarget,
  FiLoader,
  FiBriefcase,
  FiShare2,
  FiHeart,
  FiCheck,
} from "react-icons/fi";
import { FaHeart, FaBriefcase } from "react-icons/fa";
import { JOB_TYPES, CITIES, SKILLS, JobCard } from "../../types/jobs";
import { toContractType, toJobCard, toTypeLabel } from "@/lib/adapter";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
];

const SORT_LABEL: Record<string, string> = {
  newest: "Newest",
  "salary-high": "Salary: High to Low",
  "salary-low": "Salary: Low to High",
};

const BADGE_CLASS: Record<string, string> = {
  default: "bg-[#d1fae5] text-[#059669]",
  part: "bg-[#dbeafe] text-[#1d4ed8]",
  gig: "bg-[#fef3c7] text-[#d97706]",
  construction: "bg-[#fee2e2] text-[#dc2626]",
};

const SELECT_CLASS =
  "w-full appearance-none cursor-pointer rounded-[10px] border-[1.5px] border-[#e8e8f0] bg-[#fafafa] py-[9px] pl-[11px] pr-8 text-[13px] text-[#444] outline-none transition-colors focus:border-[#e05c3a]";

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
  const [filterNonce, setFilterNonce] = useState(0);
  const { data: session } = useSession();

  const [jobTypes, setJobTypes] = useState<string[]>(JOB_TYPES);
  const [cities, setCities] = useState<string[]>(CITIES);
  const [skills, setSkills] = useState<string[]>(SKILLS);
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  const EXTRA_SKILLS_THRESHOLD = 2;

  // Load dynamic filter options from the backend.
  useEffect(() => {
    (async () => {
      try {
        const data = await api.getJobFilters();
        if (Array.isArray(data.contractTypes) && data.contractTypes.length) {
          setJobTypes(data.contractTypes.map((t) => toTypeLabel(t)));
        }
        if (Array.isArray(data.cities) && data.cities.length) {
          setCities(data.cities);
        }
        if (Array.isArray(data.skills) && data.skills.length) {
          setSkills(data.skills);
        }
      } catch {
        // Keep the static fallbacks; the page still works offline.
      }
    })();
  }, []);

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

  // Load wishlist
  useEffect(() => {
    if (!session?.accessToken) return;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/mine`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          },
        );
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

  // Load which jobs the user already applied to
  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("/api/jobs/applied/ids")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ids) {
          setApplied(Object.fromEntries(d.ids.map((i: string) => [i, true])));
        }
      })
      .catch(() => {});
  }, [session?.accessToken]);

  const toggleFav = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.accessToken) {
      toast.error("Please log in to save listings");
      return;
    }

    const previousState = !!favorites[id];

    // Instant heart UI change
    setFavorites((prev) => ({ ...prev, [id]: !previousState }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ listingId: id }),
        },
      );

      if (!res.ok) throw new Error("Failed to update wishlist");

      const data = await res.json();

      // Use actual backend state
      setFavorites((prev) => ({ ...prev, [id]: data.favorited }));

      if (data.favorited) {
        toast.success("Added to wishlist");
      } else {
        toast.info("Removed from wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      // Rollback heart
      setFavorites((prev) => ({ ...prev, [id]: previousState }));
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Apply handler
  const handleApply = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.accessToken) {
      toast.error("Please log in to apply");
      return;
    }

    if (applied[id]) return; // already applied, no-op

    try {
      const res = await fetch(`/api/jobs/${id}/apply`, { method: "POST" });

      if (res.status === 409) {
        setApplied((prev) => ({ ...prev, [id]: true }));
        toast.info("You already applied to this job");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to apply");
      }

      setApplied((prev) => ({ ...prev, [id]: true }));
      toast.success("Application submitted");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong, please try again",
      );
    }
  };

  const shareJob = async (job: JobCard, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const jobUrl = `${window.location.origin}/category/job/${job.id}`;

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
        toast.success("Job link copied!");
        return;
      }

      // Final fallback
      window.prompt("Copy this job link:", jobUrl);
    } catch (error) {
      // User cancelled share popup
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Job share failed:", error);
    }
  };

  const toggleType = (t: string) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
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
          params.append("contractType", toContractType(t)),
        );

        const data = await api.getJobs(params);
        setJobs(data.map(toJobCard));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [debouncedSearch, city, skill, minSalary, selectedTypes, filterNonce]);

  // Parse salary string like "NPR 30,000 - 50,000/month" or "NPR 20,000/month"
  const parseSalaryNum = (salaryStr: string): number => {
    const match = salaryStr.replace(/,/g, "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sort === "salary-high")
      return parseSalaryNum(b.salary) - parseSalaryNum(a.salary);
    if (sort === "salary-low")
      return parseSalaryNum(a.salary) - parseSalaryNum(b.salary);
    return 0; // newest (default from API)
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <div className="min-h-screen bg-[#f4f5f7] font-sans">
        {/* HERO */}
        <section className="relative flex h-[220px] items-center overflow-hidden sm:h-[250px]">
          <div className="absolute inset-0 bg-[url('/job1.jpg')] bg-cover bg-center brightness-[0.52]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,30,90,0.75)] to-[rgba(5,15,50,0.5)]" />
          <div className="pointer-events-none absolute -bottom-2.5 left-7 select-none text-[clamp(60px,10vw,110px)] font-black leading-none tracking-[-3px] text-white/5">
            Jobs
          </div>
          <div className="relative z-[2] mx-auto w-full max-w-[1200px] px-6">
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-[13px] py-1 text-[11.5px] font-semibold text-white backdrop-blur-sm">
              <FaBriefcase size={11} />
              Nepal&apos;s #1 Job Portal
            </div>
            <h1 className="mb-1.5 text-[clamp(26px,4vw,44px)] font-black leading-[1.18] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
              Find Your Dream Job
            </h1>
            <p className="mb-5 text-sm text-white/75">
              Browse thousands of Jobs across Nepal
            </p>
            <div className="relative max-w-[520px]">
              <FiSearch
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]"
                size={17}
              />
              <input
                className="w-full rounded-xl border-none bg-white/95 py-[13px] pl-11 pr-4 text-sm text-[#333] shadow-[0_6px_28px_rgba(0,0,0,0.22)] outline-none transition-shadow placeholder:text-[#bbb] focus:shadow-[0_6px_36px_rgba(0,0,0,0.32)]"
                placeholder="Search job, Companies, Location............"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="mx-auto max-w-[1200px] px-3.5 pb-[60px] pt-4 sm:px-6 sm:pb-20 sm:pt-6">
          <div className="flex items-start gap-[22px]">
            {/* SIDEBAR */}
            <aside className="sticky top-14 w-[220px] shrink-0 overflow-hidden rounded-2xl border-[1.5px] border-[#e8e8f0] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.07)] max-[900px]:hidden">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#e05c3a] to-[#c0392b] px-4 py-[13px]">
                <span className="text-base font-extrabold text-white">
                  Filters
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-sm font-bold text-white">
                  ›
                </span>
              </div>

              <div className="border-b-[1.5px] border-[#f2f2f5] px-4 py-[13px]">
                <p className="mb-[9px] text-sm font-extrabold text-[#1a1a1a]">
                  Job Type
                </p>
                <div className="flex flex-col gap-[7px]">
                  {jobTypes.map((t) => {
                    const checked = selectedTypes.includes(t);
                    return (
                      <label
                        key={t}
                        className={`flex cursor-pointer select-none items-center gap-[9px] text-[13.5px] ${
                          checked
                            ? "font-semibold text-[#e05c3a]"
                            : "font-medium text-[#444]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-[15px] w-[15px] cursor-pointer accent-[#e05c3a]"
                          checked={checked}
                          onChange={() => toggleType(t)}
                        />
                        {t}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-b-[1.5px] border-[#f2f2f5] px-4 py-[13px]">
                <p className="mb-[9px] text-sm font-extrabold text-[#1a1a1a]">
                  City
                </p>
                <div className="relative">
                  <select
                    className={SELECT_CLASS}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Select city</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={12}
                    className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 text-[#888]"
                  />
                </div>
              </div>

              <div className="border-b-[1.5px] border-[#f2f2f5] px-4 py-[13px]">
                <p className="mb-[9px] text-sm font-extrabold text-[#1a1a1a]">
                  Skill / Keyword
                </p>
                <div className="relative">
                  <select
                    className={SELECT_CLASS}
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                  >
                    <option value="">Select skill</option>
                    {skills.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={12}
                    className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 text-[#888]"
                  />
                </div>
              </div>

              <div className="px-4 py-[13px]">
                <p className="mb-[9px] text-sm font-extrabold text-[#1a1a1a]">
                  Minimum Salary
                </p>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    className="min-w-0 flex-1 rounded-[10px] border-[1.5px] border-[#e8e8f0] px-[11px] py-[9px] text-[13px] text-[#444] outline-none transition-colors focus:border-[#e05c3a]"
                    placeholder="e.g. 20,000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                  />
                  <span className="shrink-0 text-[13px] text-[#888]">
                    /month
                  </span>
                </div>
              </div>

              <button
                className="mx-4 my-3 block w-[calc(100%-32px)] cursor-pointer rounded-[10px] border-none bg-gradient-to-r from-[#e05c3a] to-[#c0392b] p-[11px] text-center text-[13.5px] font-extrabold text-white shadow-[0_4px_14px_rgba(192,57,43,0.3)] transition-opacity hover:opacity-90"
                onClick={() => setFilterNonce((n) => n + 1)}
              >
                Apply Filters
              </button>
            </aside>

            {/* RIGHT */}
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
                <span className="text-sm font-medium text-[#555]">
                  <strong className="font-extrabold text-[#111]">
                    {loading ? "…" : sortedJobs.length}
                  </strong>{" "}
                  results found
                </span>

                {/* Sort dropdown */}
                <div className="relative" ref={sortRef}>
                  <button
                    className="flex cursor-pointer items-center gap-2 rounded-[10px] border-[1.5px] border-[#e0e0ec] bg-white px-3.5 py-[9px] text-[13px] font-semibold text-[#333] transition-colors hover:border-[#bbb]"
                    onClick={() => setIsSortOpen((v) => !v)}
                  >
                    {SORT_LABEL[sort]}
                    <FiChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isSortOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isSortOpen && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-[200] min-w-[190px] overflow-hidden rounded-[10px] border-[1.5px] border-[#e0e0e0] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
                      {SORT_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className={`cursor-pointer border-b border-[#f5f5f5] px-4 py-2.5 text-[13px] transition-colors last:border-b-0 ${
                            sort === opt.value
                              ? "bg-[#e05c3a] text-white"
                              : "text-[#444] hover:bg-[#fff1f2] hover:text-[#e05c3a]"
                          }`}
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
                <div className="px-5 py-[60px] text-center">
                  <div className="mb-3.5 flex justify-center text-[#bbb]">
                    <FiLoader size={52} className="animate-spin" />
                  </div>
                  <p className="mb-1.5 text-base font-bold text-[#555]">
                    Loading jobs...
                  </p>
                </div>
              ) : sortedJobs.length === 0 ? (
                <div className="px-5 py-[60px] text-center">
                  <div className="mb-3.5 flex justify-center text-[#bbb]">
                    <FiBriefcase size={52} />
                  </div>
                  <p className="mb-1.5 text-base font-bold text-[#555]">
                    No jobs found
                  </p>
                  <span className="text-[13px] text-[#888]">
                    Try adjusting your filters or search term
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {sortedJobs.map((j) => {
                    const isFav = !!favorites[j.id];
                    const isApplied = !!applied[j.id];
                    const t = j.type.toLowerCase();
                    const badge = t.includes("part")
                      ? BADGE_CLASS.part
                      : t.includes("gig")
                        ? BADGE_CLASS.gig
                        : t.includes("labour")
                          ? BADGE_CLASS.construction
                          : BADGE_CLASS.default;
                    const visibleSkills = j.skills.slice(
                      0,
                      EXTRA_SKILLS_THRESHOLD,
                    );
                    const extraCount = j.skills.length - EXTRA_SKILLS_THRESHOLD;

                    return (
                      <Link
                        key={j.id}
                        href={`/category/job/${j.id}`}
                        className="relative flex flex-col gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 text-inherit no-underline shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
                      >
                        {/* Favorite / Wishlist */}
                        <button
                          type="button"
                          className="absolute right-[9px] top-[9px] z-[3] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white/95 p-0 shadow-[0_2px_10px_rgba(0,0,0,0.16)] transition hover:scale-[1.08] hover:bg-white"
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
                          className="absolute right-[58px] top-[9px] z-[3] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white/95 p-0 text-[#64748b] shadow-[0_2px_10px_rgba(0,0,0,0.16)] transition hover:scale-[1.08] hover:bg-white hover:text-[#b91c1c]"
                          aria-label={`Share ${j.title}`}
                          title="Share job"
                          onClick={(e) => shareJob(j, e)}
                        >
                          <FiShare2 size={16} />
                        </button>

                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <p className="m-0 pr-24 text-base font-bold leading-tight text-black sm:text-[17px]">
                              {j.title}
                            </p>
                            <p className="m-0 text-[13.5px] font-normal text-[#333]">
                              {j.company}
                            </p>
                            <p className="m-0 text-[15px] font-bold text-[#ff3b30]">
                              {j.salary}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2.5">
                              <span className="flex items-center gap-1 text-[13px] text-[#777]">
                                <FiMapPin size={12} color="#777" />
                                {j.location}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}
                              >
                                {j.type}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {visibleSkills.map((sk) => (
                                <span
                                  key={sk}
                                  className="rounded-md border border-[#e2e8f0] bg-[#f1f3f5] px-[9px] py-[3px] text-xs font-medium text-[#444]"
                                >
                                  {sk}
                                </span>
                              ))}
                              {extraCount > 0 && (
                                <span className="rounded-md border border-[#e2e8f0] bg-[#f1f3f5] px-2 py-[3px] text-xs font-semibold text-[#666]">
                                  +{extraCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex gap-3">
                          {/* Apply */}
                          <span
                            role="button"
                            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-[9px] text-[12.5px] font-bold text-white transition-colors sm:px-3 sm:py-2.5 sm:text-[13.5px] ${
                              isApplied
                                ? "border-[#27ae60] bg-[#27ae60]"
                                : "border-[#ff3b30] bg-[#ff3b30] hover:border-[#e03126] hover:bg-[#e03126]"
                            }`}
                            onClick={(e) => handleApply(j.id, e)}
                          >
                            {isApplied ? (
                              <>
                                <FiCheck size={14} /> Applied
                              </>
                            ) : (
                              <>
                                <FiTarget size={14} /> Apply
                              </>
                            )}
                          </span>

                          {/* Call: span, not <a>, because the card is already a Link */}
                          <span
                            role="button"
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ff3b30] bg-white px-2 py-[9px] text-[12.5px] font-bold text-[#ff3b30] transition-colors hover:bg-[#fff0f0] sm:px-3 sm:py-2.5 sm:text-[13.5px]"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = "tel:+977-9800000000";
                            }}
                          >
                            <FiPhone size={14} /> Call
                          </span>

                          {/* Chat */}
                          <button
                            type="button"
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ff3b30] bg-white px-2 py-[9px] text-[12.5px] font-bold text-[#ff3b30] transition-colors hover:bg-[#fff0f0] sm:px-3 sm:py-2.5 sm:text-[13.5px]"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // TODO: open chat modal / drawer
                            }}
                          >
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