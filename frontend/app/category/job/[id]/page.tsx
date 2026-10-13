"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import type {
  JobCard,
  JobListing,
  RawJobResponse,
  Review,
  SellerLike,
  SellerReview,
} from "../../../types/jobs";
import SellerCard from "@/components/SellerCard";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// shared class strings
const card = "bg-white rounded-2xl shadow-[0_2px_14px_rgba(0,0,0,0.07)]";
const bcLink =
  "text-[#1a5fd4] no-underline font-medium transition-opacity duration-200 hover:opacity-75 hover:underline";
const actionBtnBase =
  "w-[34px] h-[34px] p-0 rounded-full border-[1.5px] cursor-pointer flex items-center justify-center appearance-none [transition:background_0.2s,border-color_0.2s,transform_0.15s] hover:scale-[1.08] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";
const actionBtnIdle =
  "border-[#e0e0e0] bg-white text-[#555] hover:bg-[#f5f5f5] hover:border-[#ccc]";
const actionBtnFav = "border-[#e74c3c] bg-[#fff5f5]";
const specChip =
  "flex flex-col items-center gap-[5px] bg-[#f8f9fb] rounded-[10px] pt-3 px-1.5 pb-2.5 border border-[#eef0f3] text-center [transition:background_0.2s,border-color_0.2s] hover:bg-[#f0f2f8] hover:border-[#d9dde8]";
const specIcon =
  "w-[34px] h-[34px] flex items-center justify-center bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.07)]";
const applyBtnBase =
  "flex-none min-w-[160px] py-3 px-5 text-white text-[14px] font-bold border-0 rounded-[10px] flex items-center justify-center gap-[7px] [transition:opacity_0.2s,transform_0.15s]";
const applyBtnIdle =
  "cursor-pointer bg-[linear-gradient(135deg,#1a5fd4_0%,#0d3d9e_100%)] shadow-[0_4px_14px_rgba(26,95,212,0.32)] hover:opacity-90 hover:-translate-y-px";
const applyBtnDone =
  "cursor-default bg-[linear-gradient(135deg,#27ae60_0%,#1e8449_100%)] shadow-[0_4px_14px_rgba(39,174,96,0.32)]";

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
  const router = useRouter();

  const [seller, setSeller] = useState<SellerLike | null>(null);
  const [sellerId, setSellerId] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!session?.accessToken || !id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/check/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setIsFav(data.favorited);
      })
      .catch(() => {});
  }, [id, session?.accessToken]);

  //for already applied jobs
  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}/has-applied`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setApplied(data.applied);
      })
      .catch(() => {});
  }, [id]);

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
    let cancelled = false;

    const load = async () => {
      try {
        const raw = (await api.getJob(id)) as RawJobResponse;

        const mapped = toJobDetail(raw as JobListing);
        if (cancelled) return;
        setJob(mapped);

        const rawSeller =
          raw?.postedBy ??
          raw?.seller ??
          raw?.user ??
          raw?.data?.postedBy ??
          raw?.data?.seller ??
          raw?.data?.user ??
          {};

        setSellerId(rawSeller?._id ?? rawSeller?.id ?? "");
        setSeller({
          ...rawSeller,
          name:
            rawSeller.name ??
            rawSeller.fullName ??
            rawSeller.username ??
            rawSeller.email,
          avatar:
            rawSeller.avatar ??
            rawSeller.image ??
            rawSeller.profilePicture ??
            rawSeller.photo,
          memberSince: rawSeller.memberSince ?? rawSeller.createdAt,
          totalListing: rawSeller.totalListing ?? rawSeller.listingCount,
        } as SellerLike);
        setReviews(raw?.reviews ?? raw?.data?.reviews ?? []);

        /* similar jobs */
        const similar = await api.getSimilarListings<JobListing>(id, 5);
        if (cancelled) return;
        setSimilarJobs(similar.filter((j) => j.job != null).map(toJobCard));
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;
  if (!job)
    return <div className="p-10 text-center">Job not found</div>;

  const mapLat = job.lat ?? geoCoords?.lat ?? null;
  const mapLng = job.lng ?? geoCoords?.lng ?? null;
  const hasCoords = mapLat != null && mapLng != null;

  //share handler
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: job.title, url: window.location.href })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      toast.success("Link copied to clipboard");
    }
  };

  //favorite handler
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
          body: JSON.stringify({ listingId: id }),
        },
      );
      if (!res.ok) throw new Error("Failed to update wishlist");
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

  //job apply handler
  const handleApply = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to apply");
      router.push(
        `/login?callbackUrl=${encodeURIComponent(`/category/job/${id}`)}`,
      );
      return;
    }
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
      });

      if (res.status === 409) {
        setApplied(true);
        toast.info("You already applied to this job");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to apply");
      }
      setApplied(true);
      toast.success("Application submitted");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong, please try again",
      );
    }
  };

  // Real seller data comes from the raw API response (seller state);
  // job.postedBy is only a fallback.
  const postedBy = (job.postedBy ?? {}) as SellerLike;

  const rawReviews: unknown[] = reviews.length
    ? reviews
    : ((job as unknown as { reviews?: unknown[] }).reviews ?? []);

  const sellerReviews: SellerReview[] = rawReviews.map((r) => {
    const rv = r as Partial<SellerReview>;
    return {
      reviewerName: rv.reviewerName ?? "Anonymous",
      rating: rv.rating ?? 0,
      comment: rv.comment ?? null,
      createdAt: rv.createdAt ?? "",
    };
  });

  const avgRating = sellerReviews.length
    ? Math.round(
        (sellerReviews.reduce((sum, r) => sum + r.rating, 0) /
          sellerReviews.length) *
          10,
      ) / 10
    : 0;

  const sellerForCard = {
    ...postedBy,
    ...(seller ?? {}),
    name: seller?.name ?? postedBy.name ?? "Unknown",
    avatar: seller?.avatar ?? postedBy.avatar ?? "",
    rating: seller?.rating ?? postedBy.rating ?? avgRating,
    reviewCount:
      seller?.reviewCount ?? postedBy.reviewCount ?? sellerReviews.length,
    isVerified: seller?.isVerified ?? postedBy.isVerified ?? false,
    isPro: seller?.isPro ?? postedBy.isPro ?? false,
    isTrusted: seller?.isTrusted ?? postedBy.isTrusted ?? false,
    memberSince: seller?.memberSince ?? postedBy.memberSince ?? "N/A",
    totalListing: seller?.totalListing ?? postedBy.totalListing ?? 0,
    responseRate: seller?.responseRate ?? postedBy.responseRate ?? "N/A",
    avgResponseTime:
      seller?.avgResponseTime ?? postedBy.avgResponseTime ?? "N/A",
    phone: seller?.phone ?? postedBy.phone ?? "N/A",
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

      <div className="bg-[#f5f6f8] min-h-screen flex flex-col [font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* TOP BAR */}
        <div className="bg-white border-b border-[#ececec] py-[11px]">
          <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between flex-wrap gap-2">
            <nav className="flex items-center gap-[5px] flex-wrap text-[12.5px] text-[#888]">
              <Link href="/" className={bcLink}>
                Home
              </Link>
              <span className="text-[#ccc] text-[11px]">›</span>
              <Link href="/category/job" className={bcLink}>
                Job
              </Link>
              {job.breadcrumbs.map((bc) => (
                <span key={bc} className="flex items-center gap-[5px]">
                  <span className="text-[#ccc] text-[11px]">›</span>
                  <span className="text-[#555] font-medium">{bc}</span>
                </span>
              ))}
              <span className="text-[#ccc] text-[11px]">›</span>
              <span className="text-[#555] font-medium">{job.title}</span>
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-[#999] font-medium">
                Job ID: {job.jobId}
              </span>
              <span
                className="text-[12px] text-[#e74c3c] font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-75 hover:underline"
                onClick={() => toast.info("Report feature coming soon")}
              >
                Report This Job
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 pb-12">
          <div className="max-w-[1200px] mx-auto mt-[22px] px-6 grid grid-cols-[1fr_340px] gap-[22px] items-start max-[900px]:grid-cols-1 max-[640px]:px-3.5 max-[640px]:mt-3.5">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">
              <div className={`${card} pt-5 px-[22px] pb-[22px]`}>
                <div className="flex items-start justify-between gap-2.5 mb-1">
                  <h1 className="text-[20px] font-extrabold text-[#1a1a1a] leading-[1.3] m-0 flex-1">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    <button
                      className={`${actionBtnBase} ${actionBtnIdle}`}
                      aria-label="Share"
                      onClick={handleShare}
                    >
                      <FiShare2 size={16} />
                    </button>
                    <button
                      className={`${actionBtnBase} ${isFav ? actionBtnFav : actionBtnIdle}`}
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

                <p className="text-[22px] font-black text-[#1a1a1a] mt-1.5 mb-0.5">
                  {job.salary}
                </p>

                <div className="flex items-center gap-3 max-[640px]:flex-col max-[640px]:items-stretch">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <div className={specChip}>
                      <div className={specIcon}>
                        <FiBriefcase size={18} color="#1a5fd4" />
                      </div>
                      <span className="text-[12px] font-extrabold text-[#1a1a1a] leading-[1.2]">
                        {job.type}
                      </span>
                      <span className="text-[10px] text-[#999] font-medium">
                        Employment Type
                      </span>
                    </div>
                    <div className={specChip}>
                      <div className={specIcon}>
                        <FiCalendar size={18} color="#1a5fd4" />
                      </div>
                      <span className="text-[12px] font-extrabold text-[#1a1a1a] leading-[1.2]">
                        {job.postedDate}
                      </span>
                      <span className="text-[10px] text-[#999] font-medium">
                        Posted
                      </span>
                    </div>
                  </div>

                  <button
                    className={`${applyBtnBase} ${applied ? applyBtnDone : applyBtnIdle}`}
                    onClick={handleApply}
                    disabled={applied}
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

              <div className={`${card} py-5 px-[22px]`}>
                <h2 className="text-[16px] font-extrabold text-[#1a1a1a] m-0 mb-3">
                  Job Description
                </h2>
                <p
                  className={`text-[13.5px] text-[#444] leading-[1.8] m-0 whitespace-pre-line ${showFull ? "" : "line-clamp-6"}`}
                >
                  {job.description}
                </p>
                <button
                  className="inline-block mt-2 text-[13px] font-semibold text-[#1a5fd4] bg-transparent border-0 cursor-pointer p-0 transition-opacity duration-200 hover:opacity-70"
                  onClick={() => setShowFull(!showFull)}
                >
                  {showFull ? "See Less" : "See More"}
                </button>
              </div>

              <div className={`${card} pb-5 overflow-hidden`}>
                <div className="flex items-center justify-between pt-[18px] px-5 pb-3.5 border-b border-[#f5f5f5]">
                  <p className="text-[15px] font-extrabold text-[#1a1a1a] m-0">
                    Similar Jobs
                  </p>
                  <Link
                    href="/category/job"
                    className="text-[13px] font-semibold text-[#1a5fd4] no-underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="flex gap-3 pt-3.5 px-4 pb-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {similarJobs.map((s) => (
                    <Link
                      key={s.id}
                      href={`/category/job/${s.id}`}
                      className="shrink-0 w-40 bg-[#f8f9fb] rounded-xl overflow-hidden no-underline border-[1.5px] border-[#eee] p-2.5 [transition:transform_0.2s,box-shadow_0.2s] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                    >
                      <p className="text-[10px] font-bold text-[#1a5fd4] uppercase m-0 mb-0.5">
                        {s.company}
                      </p>
                      <p className="text-[12px] font-bold text-[#1a1a1a] m-0 mb-1 leading-[1.3]">
                        {s.title}
                      </p>
                      <span className="text-[10px] font-semibold text-[#3b5bdb] bg-[#eef2ff] py-0.5 px-1.5 rounded-[10px]">
                        {s.type}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4 sticky top-20 self-start max-[900px]:static">
              {/* MAP */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_14px_rgba(0,0,0,0.08)]">
                <p className="text-[14px] font-extrabold text-[#1a1a1a] m-0 pt-4 px-[18px] pb-3 border-b border-[#f0f0f0]">
                  Location
                </p>
                {geoLoading ? (
                  <p className="py-4 px-[18px] text-[13px] text-[#888]">
                    Loading map...
                  </p>
                ) : hasCoords ? (
                  <>
                    <div className="h-40 overflow-hidden">
                      <iframe
                        title="Job Location Map"
                        width="100%"
                        height="100%"
                        className="border-0 block"
                        loading="lazy"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLng! - 0.015}%2C${mapLat! - 0.01}%2C${mapLng! + 0.015}%2C${mapLat! + 0.01}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
                      />
                    </div>
                    <p className="text-[12px] text-[#555] pt-2.5 px-[18px] pb-1 font-medium">
                      {job.location}
                    </p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${mapLat}&mlon=${mapLng}#map=15/${mapLat}/${mapLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#1a5fd4] text-[12.5px] font-semibold no-underline pt-1 px-[18px] pb-3.5 transition-opacity duration-200 hover:opacity-75"
                    >
                      <FiMapPin size={12} color="#1a5fd4" />
                      View Full Map
                    </a>
                  </>
                ) : (
                  <>
                    <p className="py-4 px-[18px] text-[13px] text-[#888]">
                      Location not available
                    </p>
                    <p className="text-[12px] text-[#555] px-[18px] pb-4 font-medium">
                      {job.location}
                    </p>
                  </>
                )}
              </div>

              {/* SELLER CARD */}
              <SellerCard
                seller={sellerForCard}
                reviews={sellerReviews}
                listingId={job.id}
                sellerId={sellerId || postedBy.id || ""}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}