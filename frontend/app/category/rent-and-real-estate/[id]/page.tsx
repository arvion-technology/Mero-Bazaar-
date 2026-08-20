"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiShare2,
  FiHeart,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiPhone,
  FiMessageSquare,
  FiMaximize,
  FiDroplet,
} from "react-icons/fi";
import { FaStar, FaRegStar, FaHeart, FaBed, FaCar } from "react-icons/fa";
import type { RentalListing } from "@/app/types/realestate";
import type { RealEstateDetail } from "@/app/types/listing";
import { toRentalDetail } from "@/lib/adapters/realEstateAdapter";
import SellerCard from "@/components/SellerCard";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function prefixImage(path: string): string {
  if (!path) return "/Apartment.jpg";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function formatAvailableFrom(value: string): string {
  if (!value || value === "N/A") return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type RelatedCard = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [detail, setDetail] = useState<RealEstateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [related, setRelated] = useState<RelatedCard[]>([]);

  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [callClicked, setCallClicked] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const { data: session } = useSession();
  const [favLoading, setFavLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/api/rental/${id}`);
        if (!res.ok)
          throw new Error(
            res.status === 404
              ? "Listing not found"
              : `Failed to load listing (${res.status})`,
          );
        const listing: RentalListing = await res.json();
        if (cancelled) return;
        const mapped = toRentalDetail(listing);
        setDetail(mapped);

        try {
          const relRes = await fetch(
            `${API_BASE}/api/rental?city=${encodeURIComponent(listing.rental.city)}`,
          );
          if (relRes.ok) {
            const relData: RentalListing[] = await relRes.json();
            const cards: RelatedCard[] = relData
              .filter((r) => r.id !== listing.id && r.rental)
              .slice(0, 8)
              .map((r) => ({
                id: r.id,
                title: r.title,
                price:
                  r.rental.listingType === "RENT"
                    ? `Rs. ${r.rental.monthlyRent.toLocaleString()}/month`
                    : `Rs. ${r.rental.monthlyRent.toLocaleString()}`,
                location: r.rental.area
                  ? `${r.rental.area}, ${r.rental.city}`
                  : r.rental.city,
                image: prefixImage(r.images?.[0]),
              }));
            if (!cancelled) setRelated(cards);
          }
        } catch {
          // related listings are non-critical; ignore failures silently
        }
      } catch (err) {
        if (!cancelled)
          setLoadError(
            err instanceof Error ? err.message : "Failed to load listing",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          color: "#666",
        }}
      >
        Loading listing…
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          gap: "8px",
        }}
      >
        <p style={{ fontWeight: 700, color: "#1a1a1a" }}>
          Couldn't load this listing
        </p>
        <span style={{ color: "#888", fontSize: "14px" }}>
          {loadError ?? "Listing not found"}
        </span>
        <Link
          href="/category/rent-and-real-estate"
          style={{ color: "#C0392B", fontWeight: 600, marginTop: "8px" }}
        >
          Back to listings
        </Link>
      </div>
    );
  }

  const images = detail.images.map(prefixImage);
  const visibleThumbs = images.slice(0, 5);
  const extraCount = images.length - 5;

  const handleToggleFavorite = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to save listings");
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
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
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
        .pd-page { background: #f5f6f8; min-height: 100vh; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding-bottom: 60px; }
        .pd-breadcrumb { background: #fff; border-bottom: 1px solid #ececec; padding: 12px 0; }
        .pd-breadcrumb-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: #888; }
        .pd-bc-link { color: #555; text-decoration: none; font-weight: 500; transition: color 0.18s; }
        .pd-bc-link:hover { color: #C0392B; }
        .pd-bc-sep { color: #bbb; font-size: 12px; }
        .pd-bc-current { color: #1a1a1a; font-weight: 600; }
        .pd-container { max-width: 1200px; margin: 28px auto 0; padding: 0 24px; display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .pd-left { display: flex; flex-direction: column; gap: 18px; }
        .pd-img-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .pd-main-img-wrap { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; background: #1a1a2e; }
        .pd-main-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .pd-main-img-wrap:hover .pd-main-img { transform: scale(1.03); }
        .pd-thumbs { display: flex; gap: 8px; padding: 12px; background: #fff; overflow-x: auto; }
        .pd-thumb-wrap { position: relative; flex-shrink: 0; width: 90px; height: 62px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2.5px solid transparent; transition: border-color 0.2s, transform 0.2s; }
        .pd-thumb-wrap:hover { transform: translateY(-2px); }
        .pd-thumb-wrap.active { border-color: #C0392B; }
        .pd-thumb-img { width: 100%; height: 100%; object-fit: cover; }
        .pd-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.52); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; font-weight: 700; }
        .pd-info-card { background: #fff; border-radius: 16px; padding: 22px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .pd-verified-badge { display: inline-flex; align-items: center; gap: 5px; background: #eafaf1; color: #1e8449; font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 5px; margin-bottom: 10px; letter-spacing: 0.3px; }
        .pd-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
        .pd-title { font-size: 22px; font-weight: 800; color: #1a1a1a; line-height: 1.3; margin: 0; }
        .pd-action-btns { display: flex; gap: 10px; flex-shrink: 0; margin-top: 2px; }
        .pd-action-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #e0e0e0; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, border-color 0.2s, transform 0.2s; }
        .pd-action-btn:hover { background: #f5f5f5; border-color: #ccc; transform: scale(1.1); }
        .pd-action-btn.fav-active { border-color: #e74c3c; background: #fff5f5; }
        .pd-price { font-size: 26px; font-weight: 900; color: #1a1a1a; margin: 4px 0 12px; }
        .pd-price span { font-size: 15px; font-weight: 500; color: #888; }
        .pd-loc-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; margin-bottom: 16px; }
        .pd-location { display: flex; align-items: center; gap: 5px; font-size: 13.5px; color: #555; font-weight: 500; }
        .pd-dist { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #777; }
        .pd-map-link { color: #C0392B; font-size: 13px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px; margin-left: auto; transition: opacity 0.2s; }
        .pd-map-link:hover { opacity: 0.75; }
        .pd-features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .pd-feat { display: flex; flex-direction: column; align-items: center; gap: 6px; background: #f8f9fb; border-radius: 10px; padding: 12px 6px 10px; border: 1px solid #eef0f3; transition: background 0.2s, border-color 0.2s; }
        .pd-feat:hover { background: #f0f2f8; border-color: #d9dde8; }
        .pd-feat-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .pd-feat-val { font-size: 14px; font-weight: 800; color: #1a1a1a; }
        .pd-feat-label { font-size: 10.5px; color: #888; font-weight: 500; text-align: center; line-height: 1.3; }
        .pd-seller-card { background: #fff; border-radius: 16px; padding: 22px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); position: sticky; top: 80px; }
        .pd-seller-top { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .pd-seller-avatar-wrap { position: relative; flex-shrink: 0; }
        .pd-seller-avatar { width: 66px; height: 66px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.12); }
        .pd-seller-online { position: absolute; bottom: 3px; right: 3px; width: 13px; height: 13px; border-radius: 50%; background: #27ae60; border: 2px solid #fff; }
        .pd-seller-info { flex: 1; }
        .pd-seller-name { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px; }
        .pd-rating-row { display: flex; align-items: center; gap: 6px; }
        .pd-rating-num { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .pd-stars { display: flex; gap: 2px; }
        .pd-reviews { font-size: 12px; color: #888; }
        .pd-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .pd-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; letter-spacing: 0.2px; }
        .pd-badge-verified { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
        .pd-badge-pro { background: #fef9e7; color: #d4ac0d; border: 1px solid #f9e79f; }
        .pd-badge-trusted { background: #f4ecf7; color: #7d3c98; border: 1px solid #d7bde2; }
        .pd-stats { display: flex; flex-direction: column; gap: 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin-bottom: 16px; }
        .pd-stat-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f7f7f7; font-size: 13px; }
        .pd-stat-row:last-child { border-bottom: none; }
        .pd-stat-label { color: #666; font-weight: 400; }
        .pd-stat-val { color: #1a1a1a; font-weight: 700; }
        .pd-cta-btns { display: flex; flex-direction: column; gap: 10px; }
        .pd-btn-call { width: 100%; padding: 13px; border-radius: 10px; border: none; background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 14px rgba(39,174,96,0.35); font-family: inherit; }
        .pd-btn-call:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(39,174,96,0.4); }
        .pd-btn-call:active { transform: translateY(0); }
        .pd-btn-call.revealed { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); }
        .pd-btn-chat { width: 100%; padding: 13px; border-radius: 10px; border: 2px solid #8e44ad; background: linear-gradient(135deg, #8e44ad 0%, #6c3483 100%); color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 14px rgba(142,68,173,0.3); font-family: inherit; }
        .pd-btn-chat:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(142,68,173,0.38); }
        .pd-btn-chat:active { transform: translateY(0); }
        .pd-desc-card { background: #fff; border-radius: 16px; padding: 22px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .pd-section-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; }
        .pd-desc-text { font-size: 14px; color: #444; line-height: 1.75; margin: 0; overflow: hidden; transition: max-height 0.35s ease; }
        .pd-desc-text.clamped { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .pd-see-more { display: inline-block; margin-top: 8px; font-size: 13.5px; font-weight: 600; color: #2980b9; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; transition: opacity 0.2s; }
        .pd-see-more:hover { opacity: 0.75; }
        .pd-details-card { background: #fff; border-radius: 16px; padding: 22px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); border-top: 3px solid #4B6BFB; }
        .pd-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .pd-detail-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f3f4f6; font-size: 13.5px; gap: 12px; }
        .pd-detail-row:last-child { border-bottom: none; }
        .pd-details-col-left { border-right: 1px solid #f0f0f0; padding-right: 28px; }
        .pd-details-col-right { padding-left: 28px; }
        .pd-detail-label { color: #666; font-weight: 400; }
        .pd-detail-val { color: #1a1a1a; font-weight: 700; }
        .pd-tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .pd-tag { display: inline-flex; align-items: center; padding: 5px 12px; background: #f3e8ff; border: 1.5px solid #d8b4fe; border-radius: 20px; font-size: 12.5px; font-weight: 500; color: #7c3aed; }
        .pd-related-section { max-width: 1200px; margin: 0 auto; padding: 28px 24px 0; }
        .pd-related-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .pd-related-title { font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .pd-related-viewall { font-size: 13.5px; font-weight: 600; color: #C0392B; text-decoration: none; display: flex; align-items: center; gap: 4px; transition: opacity 0.2s; }
        .pd-related-viewall:hover { opacity: 0.75; }
        .pd-related-scroll { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: thin; scrollbar-color: #ddd transparent; }
        .pd-related-scroll::-webkit-scrollbar { height: 5px; }
        .pd-related-scroll::-webkit-scrollbar-track { background: transparent; }
        .pd-related-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        .pd-rel-card { flex-shrink: 0; width: 178px; background: #fff; border-radius: 12px; overflow: hidden; border: 1.5px solid #ebebeb; text-decoration: none; display: flex; flex-direction: column; transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s; cursor: pointer; }
        .pd-rel-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-color: #ddd; }
        .pd-rel-img-wrap { width: 100%; height: 120px; overflow: hidden; position: relative; }
        .pd-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .pd-rel-card:hover .pd-rel-img { transform: scale(1.07); }
        .pd-rel-body { padding: 9px 10px 11px; display: flex; flex-direction: column; gap: 3px; }
        .pd-rel-name { font-size: 12px; font-weight: 700; color: #1a1a1a; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; }
        .pd-rel-price { font-size: 12.5px; font-weight: 800; color: #C0392B; margin: 2px 0 0; }
        .pd-rel-loc { font-size: 10.5px; color: #999; margin: 0; }
        @media (max-width: 900px) {
          .pd-container { grid-template-columns: 1fr; }
          .pd-seller-card { position: static; }
          .pd-features { grid-template-columns: repeat(2, 1fr); }
          .pd-details-grid { grid-template-columns: 1fr; }
          .pd-details-col-left { border-right: none; padding-right: 0; }
          .pd-details-col-right { padding-left: 0; }
        }
        @media (max-width: 600px) {
          .pd-title { font-size: 18px; }
          .pd-price { font-size: 22px; }
          .pd-container { padding: 0 14px; margin-top: 18px; }
          .pd-related-section { padding: 20px 14px 0; }
          .pd-main-img-wrap { height: 260px; }
          .pd-thumbs { gap: 6px; padding: 10px; }
          .pd-thumb-wrap { width: 72px; height: 52px; }
          .pd-breadcrumb-inner { padding: 0 14px; font-size: 12px; }
          .pd-info-card { padding: 16px 18px; }
          .pd-desc-card { padding: 16px 18px; }
          .pd-details-card { padding: 16px 18px; }
          .pd-loc-row { gap: 10px; }
          .pd-map-link { margin-left: 0; }
          .pd-action-btns { gap: 8px; }
          .pd-action-btn { width: 34px; height: 34px; }
        }
      `}</style>

      <div className="pd-page">
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <div className="pd-breadcrumb-inner">
            <Link href="/" className="pd-bc-link">
              Home
            </Link>
            <span className="pd-bc-sep">›</span>
            <Link href="/category/rent-and-real-estate" className="pd-bc-link">
              Property
            </Link>
            <span className="pd-bc-sep">›</span>
            <span className="pd-bc-current">{detail.title}</span>
          </div>
        </nav>

        <div className="pd-container">
          <div className="pd-left">
            <div className="pd-img-card">
              <div className="pd-main-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg] ?? images[0]}
                  alt={detail.title}
                  className="pd-main-img"
                />
              </div>
              <div className="pd-thumbs">
                {visibleThumbs.map((src, i) => (
                  <div
                    key={i}
                    className={`pd-thumb-wrap${activeImg === i ? " active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`View ${i + 1}`}
                      className="pd-thumb-img"
                    />
                    {i === 4 && extraCount > 0 && (
                      <div className="pd-thumb-overlay">+{extraCount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pd-info-card">
              {detail.isVerified && (
                <div className="pd-verified-badge">
                  <FiCheckCircle size={13} color="#1e8449" />
                  Verified
                </div>
              )}

              <div className="pd-title-row">
                <h1 className="pd-title">{detail.title}</h1>
                <div className="pd-action-btns">
                  <button
                    className="pd-action-btn"
                    onClick={() => {
                      if (navigator.share)
                        navigator.share({
                          title: detail.title,
                          url: window.location.href,
                        });
                    }}
                  >
                    <FiShare2 size={16} />
                  </button>
                  <button
                    className={`pd-action-btn${isFav ? " fav-active" : ""}`}
                    aria-label="Save to wishlist"
                    onClick={handleToggleFavorite}
                    disabled={favLoading}
                  >
                    {isFav ? (
                      <FaHeart size={16} color="#e74c3c" />
                    ) : (
                      <FiHeart size={16} color="#888" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pd-price">{detail.price}</div>

              <div className="pd-loc-row">
                <span className="pd-location">
                  <FiMapPin size={13} color="#888" />
                  {detail.location}
                </span>
                {detail.postedDaysAgo != null && (
                  <span className="pd-dist">
                    <FiClock size={13} color="#aaa" />
                    Posted{" "}
                    {detail.postedDaysAgo === 0
                      ? "today"
                      : `${detail.postedDaysAgo} day(s) ago`}
                  </span>
                )}
                <a
                  href={detail.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-map-link"
                >
                  <FiMapPin size={13} color="#C0392B" />
                  View on Map
                </a>
              </div>

              <div className="pd-features">
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FaBed size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val">{detail.specs.bedrooms}</span>
                  <span className="pd-feat-label">Bedrooms</span>
                </div>
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FiDroplet size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val">{detail.specs.bathrooms}</span>
                  <span className="pd-feat-label">Bathrooms</span>
                </div>
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FiMaximize size={22} color="#4B6BFB" />
                  </div>
                  <span className="pd-feat-val" style={{ fontSize: "12px" }}>
                    {detail.specs.sqft}
                  </span>
                  <span className="pd-feat-label">Sq. ft</span>
                </div>
                <div className="pd-feat">
                  <div className="pd-feat-icon">
                    <FaCar size={22} color="#4B6BFB" />
                  </div>
                  <span
                    className="pd-feat-val"
                    style={{ fontSize: "10px", lineHeight: "1.2" }}
                  >
                    {detail.amenities.parking ? "Avail." : "None"}
                  </span>
                  <span className="pd-feat-label">Parking</span>
                </div>
              </div>
            </div>

            <div className="pd-desc-card">
              <h2 className="pd-section-title">Description</h2>
              <p className={`pd-desc-text${showFull ? "" : " clamped"}`}>
                {detail.description}
              </p>
              <button
                className="pd-see-more"
                onClick={() => setShowFull((v) => !v)}
              >
                {showFull ? "See Less ▲" : "See More ▼"}
              </button>
            </div>

            <div className="pd-details-card">
              <h2 className="pd-section-title">Details</h2>
              <div className="pd-details-grid">
                <div className="pd-details-col-left">
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Property type</span>
                    <span className="pd-detail-val">
                      {detail.specs.propertyType}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Listing type</span>
                    <span className="pd-detail-val">
                      {detail.specs.listingType}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Furnished</span>
                    <span className="pd-detail-val">
                      {detail.amenities.furnished ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Owner type</span>
                    <span
                      className="pd-detail-val"
                      style={{ textTransform: "capitalize" }}
                    >
                      {detail.ownerType}
                    </span>
                  </div>
                </div>
                <div className="pd-details-col-right">
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">No broker</span>
                    <span className="pd-detail-val">
                      {detail.noBroker ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Available from</span>
                    <span className="pd-detail-val">
                      {formatAvailableFrom(detail.availableFrom)}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Wifi</span>
                    <span className="pd-detail-val">
                      {detail.amenities.wifi ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Water / Electricity</span>
                    <span className="pd-detail-val">
                      {detail.amenities.water ? "Water" : ""}
                      {detail.amenities.water && detail.amenities.electricity
                        ? " / "
                        : ""}
                      {detail.amenities.electricity ? "Electricity" : ""}
                      {!detail.amenities.water && !detail.amenities.electricity
                        ? "None"
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              {detail.landmarks.length > 0 && (
                <>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      margin: "20px 0 4px",
                    }}
                  >
                    Nearby Landmarks
                  </h3>
                  <div className="pd-tags-wrap">
                    {detail.landmarks.map((l) => (
                      <span key={l} className="pd-tag">
                        {l}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {detail.houseRules.length > 0 && (
                <>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      margin: "20px 0 4px",
                    }}
                  >
                    House Rules
                  </h3>
                  <div className="pd-tags-wrap">
                    {detail.houseRules.map((r) => (
                      <span key={r} className="pd-tag">
                        {r}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <SellerCard
            seller={detail.seller}
            reviews={detail.reviews}
            listingId={detail.id}
            sellerId={detail.sellerId}
          />
        </div>

        {related.length > 0 && (
          <div className="pd-related-section">
            <div className="pd-related-header">
              <h2 className="pd-related-title">Related Listings</h2>
              <Link
                href="/category/rent-and-real-estate"
                className="pd-related-viewall"
              >
                View All →
              </Link>
            </div>
            <div className="pd-related-scroll">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/category/rent-and-real-estate/${item.id}`}
                  className="pd-rel-card"
                >
                  <div className="pd-rel-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="pd-rel-img"
                    />
                  </div>
                  <div className="pd-rel-body">
                    <p className="pd-rel-name">{item.title}</p>
                    <p className="pd-rel-price">{item.price}</p>
                    <p className="pd-rel-loc">{item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
