"use client";

import Link from "next/link";
import { FiHeart, FiMapPin, FiCheckCircle } from "react-icons/fi";
import type { FeaturedCard as FeaturedCardType } from "@/app/types/featured";
import { resolveCardMeta } from "../lib/featuredCard";

const categoryRoute: Record<string, string> = {
  VEHICLE: "/category/vehicles",
  RENTAL: "/category/rent-and-real-estate",
  JOB: "/category/job",
  MEDICAL: "/category/medical",
  TRADES: "/category/trade-and-homerepair",
  BEAUTY: "/category/beauty",
  SECONDHAND: "/category/secondhand",
  FOODS: "/category/foods",
  AGRICULTURE: "/category/agriculture",
};

export function FeaturedCard({ card }: { card: FeaturedCardType }) {
  const { listing, isPromoted, tier } = card;
  const meta = resolveCardMeta(listing);
  const href = `/listing/${listing.id}`;

  return (
    <Link href={href} className="fc-card">
      <div className="fc-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={listing.images[0] ?? "/placeholder.png"} alt={listing.title} className="fc-img" />

        {listing.user.isVerified && (
          <span className="fc-badge fc-verified">
            <FiCheckCircle size={10} /> VERIFIED
          </span>
        )}
        {isPromoted && (
          <span className={`fc-badge fc-promoted ${listing.user.isVerified ? "fc-shift" : ""} fc-tier-${(tier ?? "standard").toLowerCase()}`}>
            {tier === "PLATINUM" ? "PLATINUM" : tier === "GOLD" ? "FEATURED" : "PROMOTED"}
          </span>
        )}

        <button className="fc-fav" aria-label="Save" onClick={(e) => e.preventDefault()}>
          <FiHeart size={13} color="#999" />
        </button>
      </div>

      <div className="fc-body">
        <h3 className="fc-title">{listing.title}</h3>
        {meta.city && (
          <p className="fc-loc">
            <FiMapPin size={11} /> {meta.city}
          </p>
        )}

        <p className={`fc-price ${meta.muted ? "fc-price-muted" : ""}`}>
          {meta.priceLabel && <span className="fc-price-label">{meta.priceLabel}</span>}
          {meta.priceText}
        </p>

        {meta.subtitle && <p className="fc-subtitle">{meta.subtitle}</p>}
      </div>
    </Link>
  );
}