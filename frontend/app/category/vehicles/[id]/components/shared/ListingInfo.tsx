"use client";

import { useState } from "react";
import {
  FiShare2, FiHeart, FiMapPin, FiClock,
  FiTruck, FiTag, FiCalendar, FiDroplet,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";
import type { ListingDetail } from "../../../../../types/listing";

type Props = Pick<
  ListingDetail,
  | "title" | "price" | "negotiable" | "driven" | "postedDaysAgo" | "isVerified" | "specs" |"latitude" | "longitude" >;

export default function ListingInfo({
  title, price, negotiable, driven, postedDaysAgo, isVerified, specs, latitude, longitude,
}: Props) {
  const [isFav, setIsFav]     = useState(false);
  const [copied, setCopied]   = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            onClick={() => setIsFav((v) => !v)}
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
            if (latitude == null || longitude == null) {
            window.open(
              `https://www.google.com/maps?q=${latitude},${longitude}`,"_blank");
                } else if (location) {
                  window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, "_blank");
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
