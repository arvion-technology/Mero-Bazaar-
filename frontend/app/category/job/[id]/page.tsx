"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { api } from "@/lib/api";
import { toJobDetail, toJobCard } from "@/lib/adapter";
import type { JobDetail } from "@/app/types/listing";
import type { JobCard, JobListing } from "../../../types/jobs";
import SellerCard from "@/components/SellerCard";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobDetailPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<JobCard[]>([]);
  const [geoCoords, setGeoCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [applied, setApplied] = useState(false);
  const { data: session } = useSession();
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!session?.accessToken || !id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/check/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setIsFav(data.favorited);
        }
      })
      .catch(() => {});
  }, [id, session?.accessToken]);

  useEffect(() => {
    if (!job) return;
    if (job.lat != null && job.lng != null) return;
    if (!job.location) return;

    let cancelled = false;
    const geocode = async () => {
      setGeoLoading(true);
      try {
        const query = encodeURIComponent(job.location);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=np`,
        );
        const data = await res.json();
        if (!cancelled && data?.[0]) {
          setGeoCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      } finally {
        if (!cancelled) setGeoLoading(false);
      }
    };
    geocode();
    return () => {
      cancelled = true;
    };
  }, [job]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const raw = (await api.getJob(id)) as unknown as JobListing;
        setJob(toJobDetail(raw));

        const similarParams = new URLSearchParams({
          city: raw.job?.city ?? "",
          limit: "5",
        });

        const similar = (await api.getJobs(
          similarParams,
        )) as unknown as JobListing[];
        setSimilarJobs(
          similar
            .filter((j) => j.job != null)
            .map(toJobCard)
            .filter((j) => j.id !== id),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!job)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>Job not found</div>
    );

  const mapLat = job.lat ?? geoCoords?.lat ?? null;
  const mapLng = job.lng ?? geoCoords?.lng ?? null;
  const hasCoords = mapLat != null && mapLng != null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast.success("Link copied to clipboard");
  };

  const handleToggleFavorite = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to save jobs");
      return;
    }

    setFavLoading(true);
    const previousState = isFav;
    setIsFav(!previousState);

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
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update wishlist");
      }

      const data = await res.json();
      setIsFav(data.favorited);

      toast.success(
        data.favorited ? "Added to wishlist" : "Removed from wishlist",
      );
    } catch (error) {
      console.error(error);
      setIsFav(previousState);
      toast.error("Something went wrong, please try again");
    } finally {
      setFavLoading(false);
    }
  };

  // Build a complete seller object that SellerCard expects,
  // filling missing fields with sensible defaults.
  const sellerForCard = {
    ...(job.postedBy as any),
    isPro: (job.postedBy as any)?.isPro ?? false,
    isTrusted: (job.postedBy as any)?.isTrusted ?? false,
    memberSince: (job.postedBy as any)?.memberSince ?? "N/A",
    totalListing: (job.postedBy as any)?.totalListing ?? 0,
    responseRate: (job.postedBy as any)?.responseRate ?? "N/A",
    avgResponseTime: (job.postedBy as any)?.avgResponseTime ?? "N/A",
    phone: (job.postedBy as any)?.phone ?? "N/A",
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
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
        .jd-report { font-size: 12px; color: #e74c3c; font-weight: 600; text-decoration: none; transition: opacity 0.18s; cursor: pointer; }
        .jd-report:hover { opacity: 0.75; text-decoration: underline; }

        /* LAYOUT */
        .jd-container {
          max-width: 1200px; margin: 22px auto 0; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 330px;
          gap: 22px; align-items: start;
        }
        .jd-left { display: flex; flex-direction: column; gap: 16px; }

        /* INFO CARD */
        .jd-info-card {
          background: #fff; border-radius: 16px;
          padding: 20px 22px 22px; box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .jd-title-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 10px; margin-bottom: 4px;
        }
        .jd-title {
          font-size: 20px; font-weight: 800; color: #1a1a1a;
          line-height: 1.3; margin: 0; flex: 1;
        }
        .jd-action-btns {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .jd-action-btn {
          width: 34px;
          height: 34px;
          padding: 0;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          color: #555;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          appearance: none;
          -webkit-appearance: none;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.15s ease;
        }
        .jd-action-btn:hover {
          background: #f5f5f5;
          border-color: #ccc;
          transform: scale(1.08);
        }
        .jd-action-btn:focus { outline: none; }
        .jd-action-btn.fav-active {
          border-color: #e74c3c;
          background: #fff5f5;
        }
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
          display: grid; grid-template-columns: repeat(2, 1fr);
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
        .jd-desc-text { font-size: 13.5px; color: #444; line-height: 1.8; margin: 0; white-space: pre-line; }
        .jd-desc-text.clamped {
          display: -webkit-box; -webkit-line-clamp: 6;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .jd-see-more {
          display: inline-block; margin-top: 8px;
          font-size: 13px; font-weight: 600; color: #1a5fd4;
          background: none; border: none; cursor: pointer;
          padding: 0; font-family: inherit; transition: opacity 0.18s;
        }
        .jd-see-more:hover { opacity: 0.72; }

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
          padding: 10px;
        }
        .jd-sim-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
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

        /* MAP CARD */
        .jd-map-card {
          background: #fff; border-radius: 16px;
          overflow: hidden; box-shadow: 0 2px 14px rgba(0,0,0,0.08);
        }
        .jd-map-card-title {
          font-size: 14px; font-weight: 800; color: #1a1a1a;
          margin: 0; padding: 16px 18px 12px; border-bottom: 1px solid #f0f0f0;
        }
        .jd-map-city { font-size: 12px; color: #555; padding: 10px 18px 4px; font-weight: 500; }
        .jd-map-link {
          display: inline-flex; align-items: center; gap: 4px;
          color: #1a5fd4; font-size: 12.5px; font-weight: 600;
          text-decoration: none; padding: 4px 18px 14px;
          transition: opacity 0.18s;
        }
        .jd-map-link:hover { opacity: 0.75; }
        .jd-map-unavailable { padding: 16px 18px; font-size: 13px; color: #888; }

        /* ── SELLER / COMPANY CARD (from Trade page) ── */
        .cd-seller-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8; overflow: hidden; }
        .cd-company-card { background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8; }
        .cd-company-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
        .cd-company-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cd-company-logo { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 1px solid #eee; background: #f8f8f8; flex-shrink: 0; display: block; }
        .cd-company-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 3px; }
        .cd-company-rating { display: flex; align-items: center; gap: 5px; }
        .cd-company-rnum { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .cd-company-rcount { font-size: 11.5px; color: #888; }
        .cd-ci-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 7px 0; border-bottom: 1px solid #f8f8f8; font-size: 12px; gap: 8px;
        }
        .cd-ci-row:last-child { border-bottom: none; }
        .cd-ci-label { color: #888; font-weight: 500; flex-shrink: 0; }
        .cd-ci-val { color: #1a1a1a; font-weight: 600; text-align: right; word-break: break-all; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .jd-container { grid-template-columns: 1fr; }
          .jd-right { position: static; }
        }
        @media (max-width: 640px) {
          .jd-container { padding: 0 14px; margin-top: 14px; }
          .jd-cta-row { flex-direction: column; }
        }
      `}</style>

      <div className="jd-page">
        {/* TOP BAR */}
        <div className="jd-topbar">
          <div className="jd-topbar-inner">
            <nav className="jd-breadcrumb">
              <Link href="/" className="jd-bc-link">
                Home
              </Link>
              <span className="jd-bc-sep">›</span>
              <Link href="/category/job" className="jd-bc-link">
                Job
              </Link>
              {job.breadcrumbs.map((bc) => (
                <span
                  key={bc}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span className="jd-bc-sep">›</span>
                  <span className="jd-bc-current">{bc}</span>
                </span>
              ))}
              <span className="jd-bc-sep">›</span>
              <span className="jd-bc-current">{job.title}</span>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="jd-job-id">Job ID: {job.jobId}</span>
              <span
                className="jd-report"
                onClick={() => toast.info("Report feature coming soon")}
              >
                Report This Job
              </span>
            </div>
          </div>
        </div>

        <div className="jd-main">
          {/* MAIN LAYOUT */}
          <div className="jd-container">
            {/* LEFT */}
            <div className="jd-left">
              {/* INFO */}
              <div className="jd-info-card">
                <div className="jd-title-row">
                  <h1 className="jd-title">{job.title}</h1>
                  <div className="jd-action-btns">
                    <button
                      className="jd-action-btn"
                      onClick={() => {
                        if (navigator.share)
                          navigator.share({
                            title: job.title,
                            url: window.location.href,
                          });
                      }}
                    >
                      <FiShare2 size={16} />
                    </button>
                    <button
                      className={`jd-action-btn${isFav ? " fav-active" : ""}`}
                      aria-label="Save to wishlist"
                      onClick={handleToggleFavorite}
                      disabled={favLoading}
                    >
                      {isFav ? (
                        <FaHeart size={15} color="#E74C3C" />
                      ) : (
                        <FiHeart size={15} color="#999" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="jd-salary">{job.salary}</p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "0",
                  }}
                >
                  <div className="jd-specs-bar" style={{ flex: 1 }}>
                    <div className="jd-spec-chip">
                      <div className="jd-spec-icon">
                        <FiBriefcase size={18} color="#1a5fd4" />
                      </div>
                      <span className="jd-spec-val">{job.type}</span>
                      <span className="jd-spec-label">Employment Type</span>
                    </div>
                    <div className="jd-spec-chip">
                      <div className="jd-spec-icon">
                        <FiCalendar size={18} color="#1a5fd4" />
                      </div>
                      <span className="jd-spec-val">{job.postedDate}</span>
                      <span className="jd-spec-label">Posted</span>
                    </div>
                  </div>

                  <button
                    className={`jd-btn-apply${applied ? " applied" : ""}`}
                    onClick={() => setApplied(!applied)}
                    style={{ flex: "0 0 auto", minWidth: 160 }}
                  >
                    {applied ? (
                      <>
                        <FiCheck size={15} color="#fff" /> Applied!
                      </>
                    ) : (
                      <>
                        <FiSend size={15} color="#fff" /> Apply Now
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="jd-desc-card">
                <h2 className="jd-section-title">Job Description</h2>
                <p className={`jd-desc-text${showFull ? "" : " clamped"}`}>
                  {job.description}
                </p>
                <button
                  className="jd-see-more"
                  onClick={() => setShowFull(!showFull)}
                >
                  {showFull ? "See Less" : "See More"}
                </button>
              </div>

              {/* SIMILAR JOBS */}
              <div className="jd-similar-card">
                <div className="jd-similar-head">
                  <p className="jd-similar-title">Similar Jobs</p>
                  <Link href="/category/job" className="jd-similar-viewall">
                    View All
                  </Link>
                </div>
                <div className="jd-similar-scroll">
                  {similarJobs.map((s) => (
                    <Link
                      key={s.id}
                      href={`/category/job/${s.id}`}
                      className="jd-sim-card"
                    >
                      <p className="jd-sim-company">{s.company}</p>
                      <p className="jd-sim-title">{s.title}</p>
                      <span className="jd-sim-type">{s.type}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="jd-right">
              {/* MAP CARD */}
              <div className="jd-map-card">
                <p className="jd-map-card-title">Location</p>
                {geoLoading ? (
                  <p className="jd-map-unavailable">Loading map...</p>
                ) : hasCoords ? (
                  <>
                    <div style={{ height: 160, overflow: "hidden" }}>
                      <iframe
                        title="Job Location Map"
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: "block" }}
                        loading="lazy"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLng! - 0.015}%2C${mapLat! - 0.01}%2C${mapLng! + 0.015}%2C${mapLat! + 0.01}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
                      />
                    </div>
                    <p className="jd-map-city">{job.location}</p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${mapLat}&mlon=${mapLng}#map=15/${mapLat}/${mapLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jd-map-link"
                    >
                      <FiMapPin size={12} color="#1a5fd4" />
                      View Full Map
                    </a>
                  </>
                ) : (
                  <>
                    <p className="jd-map-unavailable">Location not available</p>
                    <p className="jd-map-city" style={{ paddingTop: 0 }}>
                      {job.location}
                    </p>
                  </>
                )}
              </div>

              {/* SELLER CARD */}
              <div className="cd-seller-card">
                <SellerCard
                  seller={sellerForCard}
                  reviews={(job as any).reviews ?? []}
                  listingId={job.id}
                  sellerId={(job.postedBy as any)?.id || job.id}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}