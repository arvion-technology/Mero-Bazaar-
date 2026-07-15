"use client";

import { useState, useEffect } from "react";
import {
  FiShare2, FiHeart, FiMapPin, FiClock,
  FiTruck, FiTag, FiCalendar, FiDroplet,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";
import type { ListingDetail } from "../../../../../types/listing";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type Props = Pick<
  ListingDetail,
  | "title" | "price" | "negotiable" | "driven" | "postedDaysAgo" | "isVerified" | "specs" |"latitude" | "longitude" > & { listingId: string };

export default function ListingInfo({
  title, price, negotiable, driven, postedDaysAgo, isVerified, specs, latitude, longitude, listingId,
}: Props) {
  const { data: session } = useSession();
  const [isFav, setIsFav]     = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/check/${listingId}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) setIsFav(data.favorited);
    })
    .catch(() => {});
}, [listingId, session?.accessToken]);


  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to save listings");
      return;
    }
    setFavLoading(true);
    const prevState = isFav;
    setIsFav(!prevState);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ listingId }),
      });
      if (!res.ok) throw new Error("Failed to update wishlist");

      const data = await res.json();
      setIsFav(data.favorited);
      toast.success(data.favorited ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      setIsFav(prevState);
      toast.error("Something went wrong, please try again");
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="ld-info-card">
      {/* Verified badge */}
      {isVerified && (
        <div className="ld-verified-badge">
          <MdVerified size={12} color="#1e8449" />
          Verified Car
        </div>
      )}

      {/* Title + action buttons */}
      <div className="ld-title-row">
        <h1 className="ld-title">{title}</h1>
        <div className="ld-action-btns">
          <button className="ld-action-btn" aria-label="Share listing" onClick={handleShare}>
            <span className="ld-tooltip">{copied ? "Copied!" : "Share"}</span>
            <FiShare2 size={15} color="#555" />
          </button>
          <button
            className={`ld-action-btn${isFav ? " fav-active" : ""}`}
            aria-label="Save to wishlist"
            onClick={handleToggleFavorite}
            disabled={favLoading}
          >
            <span className="ld-tooltip">{isFav ? "Saved" : "Save"}</span>
            {isFav ? <FaHeart size={15} color="#e74c3c" /> : <FiHeart size={15} color="#888" />}
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="ld-price">{price}</div>
      {negotiable && <span className="ld-negotiable">Negotiable</span>}

      {/* Meta row */}
      <div className="ld-meta-row">
        <span className="ld-driven-meta">
          <FiClock size={13} color="#bbb" />
          {driven}
        </span>
        <span className="ld-posted">
          Posted {postedDaysAgo} day{postedDaysAgo !== 1 ? "s" : ""} ago
        </span>
        <span style={{ cursor: "pointer", color: "#2563eb" }}
          onClick={(e) => { e.preventDefault();
            if (latitude != null && longitude != null) {
            window.open(`https://www.google.com/maps?q=${latitude},${longitude}`,"_blank");
            } 
          }}
        >
          <FiMapPin size={11} /> View on map
        </span> 
      </div>

      {/* Specs bar */}
      <div className="ld-specs-bar">
        <div className="ld-spec-chip">
          <div className="ld-spec-icon"><FiTruck size={20} color="#C0392B" /></div>
          <span className="ld-spec-val">{specs.make}</span>
          <span className="ld-spec-label">Make</span>
        </div>
        <div className="ld-spec-chip">
          <div className="ld-spec-icon"><FiTag size={20} color="#2471A3" /></div>
          <span className="ld-spec-val" style={{ fontSize: 10 }}>{specs.model}</span>
          <span className="ld-spec-label">Model</span>
        </div>
        <div className="ld-spec-chip">
          <div className="ld-spec-icon"><FiCalendar size={20} color="#27AE60" /></div>
          <span className="ld-spec-val">{specs.year}</span>
          <span className="ld-spec-label">Year</span>
        </div>
        <div className="ld-spec-chip">
          <div className="ld-spec-icon"><FiDroplet size={20} color="#F39C12" /></div>
          <span className="ld-spec-val">{specs.fuel}</span>
          <span className="ld-spec-label">Fuel</span>
        </div>
        <div className="ld-spec-chip">
          <div className="ld-spec-icon"><TbManualGearbox size={20} color="#8E44AD" /></div>
          <span className="ld-spec-val" style={{ fontSize: 9.5 }}>{specs.transmission}</span>
          <span className="ld-spec-label">Transmission</span>
        </div>
        <div className="ld-spec-chip">
          <div className="ld-spec-icon"><FiClock size={20} color="#16A085" /></div>
          <span className="ld-spec-val" style={{ fontSize: 10 }}>{specs.driven}</span>
          <span className="ld-spec-label">Driven</span>
        </div>
      </div>
    </div>
  );
}
