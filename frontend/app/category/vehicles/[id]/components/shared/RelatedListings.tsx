"use client";

import { useState } from "react";
import Link from "next/link";
import { FiHeart, FiMapPin, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import type { RelatedListing } from "../../../../../types/listing";

type Props = {
  listings: RelatedListing[];
};

export default function RelatedListings({ listings }: Props) {
  const [favRelated, setFavRelated] = useState<Record<string, boolean>>({});

  if (listings.length === 0) return null;

  return (
    <div className="ld-related-section">
      <div className="ld-related-header">
        <h2 className="ld-related-title">Related Listings</h2>
        <Link href="/category/vehicles" className="ld-related-viewall">
          View All
          <FiChevronRight size={13} color="#C0392B" />
        </Link>
      </div>

      <div className="ld-related-scroll">
        {listings.map((rel) => {
          const isFavRel = !!favRelated[rel.id];
          return (
            <Link key={rel.id} href={`/category/vehicles/${rel.id}`} className="ld-rel-card">
              <div className="ld-rel-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={rel.image} alt={rel.title} className="ld-rel-img" />

                <button
                  className="ld-rel-heart"
                  aria-label="Save"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFavRelated((p) => ({ ...p, [rel.id]: !p[rel.id] }));
                  }}
                >
                  {isFavRel
                    ? <FaHeart  size={12} color="#E74C3C" />
                    : <FiHeart  size={12} color="#999"    />}
                </button>

                {rel.verified && (
                  <span className="ld-rel-badge">
                    <FiCheckCircle size={7} color="#fff" />
                    VERIFIED
                  </span>
                )}
              </div>

              <div className="ld-rel-body">
                <p className="ld-rel-name">{rel.title}</p>
                <p className="ld-rel-price">{rel.price}</p>
                <p className="ld-rel-loc">
                  <FiMapPin size={10} color="#bbb" />
                  {rel.location}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
