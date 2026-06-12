"use client";

import { useState } from "react";
import { FiPhone, FiMessageSquare, FiMail } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import type { ListingDetail } from "../../../../../types/listing";

type Props = {
  seller: ListingDetail["seller"];
  reviews: ListingDetail["reviews"];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating)
          ? <FaStar    key={i} size={13} color="#F39C12" />
          : <FaRegStar key={i} size={13} color="#F39C12" />
      )}
    </span>
  );
}

export default function SellerCard({ seller, reviews }: Props) {
  const [callRevealed, setCallRevealed] = useState(false);

  return (
    <div className="ld-seller-card">
      <p className="ld-seller-card-title">Seller Information</p>

      {/* Avatar + name + rating */}
      <div className="ld-seller-top">
        <div className="ld-seller-avatar-wrap">
          {seller.avatar && seller.avatar !== "/placeholder-avatar.png" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seller.avatar} alt={seller.name} className="ld-seller-avatar" />
          ) : (
            <div className="ld-avatar-placeholder">
              {seller.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="ld-seller-online" aria-label="Online" />
        </div>

        <div>
          <p className="ld-seller-name">{seller.name}</p>
          <div className="ld-rating-row">
            <StarRating rating={seller.rating} />
            <span className="ld-rating-num">{seller.rating}</span>
            <span className="ld-reviews">({seller.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="ld-seller-badges">
        {seller.isVerified && (
          <span className="ld-sbadge ld-sbadge-verified">
            <MdVerified size={11} /> Verified
          </span>
        )}
        {seller.isPro && (
          <span className="ld-sbadge ld-sbadge-pro">⭐ Pro Seller</span>
        )}
        {seller.isTrusted && (
          <span className="ld-sbadge ld-sbadge-trusted">🛡 Trusted</span>
        )}
      </div>

      {/* Stats */}
      <div className="ld-seller-stats">
        {[
          { label: "Member Since",      val: seller.memberSince      },
          { label: "Total Listings",    val: seller.totalListing     },
          { label: "Response Rate",     val: seller.responseRate     },
          { label: "Avg. Response Time",val: seller.avgResponseTime  },
        ].map(({ label, val }) => (
          <div key={label} className="ld-stat-row">
            <span className="ld-stat-label">{label}</span>
            <span className="ld-stat-val">{val}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="ld-cta-btns">
        <button
          className="ld-btn-call" onClick={() => setCallRevealed(true)}>
          <FiPhone size={16} />
          {callRevealed ? seller.phone : "Call Seller"}
        </button>

        <button className="ld-btn-chat">
          <FiMessageSquare size={16} />
          Chat with Seller
        </button>

        <button className="ld-btn-msg">
          <FiMail size={16} />
          Send Message
        </button>
      </div>

       {reviews.length > 0 && (
          <div className="ld-reviews-section">
            <p className="ld-section-title">Reviews</p>
            {reviews.map((r, i) => (
              <div key={i} className="ld-review-row">
                <div className="ld-review-header">
                  <span className="ld-review-name">{r.reviewerName}</span>
                  <StarRating rating={r.rating} />
                  <span className="ld-review-date">{r.createdAt}</span>
                </div>
                {r.comment && <p className="ld-review-comment">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
