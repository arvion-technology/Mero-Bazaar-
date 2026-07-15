"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FiPhone, FiMessageSquare, FiMail } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import type { ListingDetail } from "../../../../../types/listing";

type Props = {
  seller: ListingDetail["seller"];
  reviews: ListingDetail["reviews"];
  listingId: string;
  sellerId: string;
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

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          {i <= (hover || value)
            ? <FaStar size={20} color="#F39C12" />
            : <FaRegStar size={20} color="#F39C12" />}
        </button>
      ))}
    </span>
  );
}

export default function SellerCard({ seller, reviews: initialReviews, listingId, sellerId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [callRevealed, setCallRevealed] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOwnListing = session?.user?.id === sellerId;

  const handleSubmitReview = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to leave a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ listingId, rating, comment: comment.trim() || undefined }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to submit review");
      }    
      setRating(0);
      setComment("");
      toast.success("Review submitted!");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ld-seller-card">
      <p className="ld-seller-card-title">Seller Information</p>

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
          <Link href={`/sellers/${sellerId}`} className="ld-seller-name" style={{ textDecoration: "none" }}>
            {seller.name}
          </Link>
            <div className="ld-rating-row">
            <StarRating rating={seller.rating} />
            <span className="ld-rating-num">{seller.rating}</span>
            <span className="ld-reviews">({seller.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="ld-seller-badges">
        {seller.isVerified && (
          <span className="ld-sbadge ld-sbadge-verified">
            <MdVerified size={11} /> Verified
          </span>
        )}
      </div>

      <div className="ld-seller-stats">
        {[
          { label: "Member Since",   val: seller.memberSince   },
          { label: "Total Listings", val: seller.totalListing  },
        ].map(({ label, val }) => (
          <div key={label} className="ld-stat-row">
            <span className="ld-stat-label">{label}</span>
            <span className="ld-stat-val">{val}</span>
          </div>
        ))}
      </div>
      <div className="ld-cta-btns">
        <button
          className="ld-btn-call"
          onClick={() => {
            if (!seller.phone || seller.phone === "N/A") {
              toast.error("Phone number not available");
              return;
            }
            window.location.href = `tel:${seller.phone}`;
          }}
        >
          <FiPhone size={16} />
          Call Seller
        </button>

      {/* holding this feature for now */}
        {/* <button className="ld-btn-chat">
          <FiMessageSquare size={16} />
          Chat with Seller
        </button> */}

      </div>

      {!isOwnListing && (
        <div className="ld-review-form" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <p className="ld-section-title" style={{ fontSize: 13, marginBottom: 8 }}>Leave a Review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this seller (optional)"
            style={{
              width: "100%",
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
              minHeight: 60,
            }}
          />
          <button
            onClick={handleSubmitReview}
            disabled={submitting}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: "#C0392B",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
      <Link
        href={`/sellers/${sellerId}`}
        style={{
          display: "block",
          textAlign: "center",
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid #f0f0f0",
          fontSize: 13,
          fontWeight: 600,
          color: "black",
          textDecoration: "none",
        }}
      >
        View full profile & all reviews →
      </Link>
    </div>
  );
}