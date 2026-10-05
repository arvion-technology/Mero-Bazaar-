"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FiPhone, FiMessageSquare, FiMail } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import type { ListingDetail } from "../app/types/listing";

type Props = {
  seller: ListingDetail["seller"];
  reviews: ListingDetail["reviews"];
  listingId: string;
  sellerId: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
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
    <span className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer border-none bg-transparent p-0.5"
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
    <div className="mx-auto w-full max-w-[380px] rounded-2xl bg-white px-[18px] py-5 shadow-[0_2px_14px_rgba(0,0,0,0.08)]">
      <p className="mb-3.5 border-b border-[#f0f0f0] pb-3 text-sm font-extrabold text-[#1a1a1a]">
        Seller Information
      </p>

      <div className="mb-3 flex items-center gap-3">
        <div className="relative shrink-0">
          {seller.avatar && seller.avatar !== "/placeholder-avatar.png" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={seller.avatar}
              alt={seller.name}
              className="block h-[58px] w-[58px] rounded-full border-[2.5px] border-white object-cover shadow-[0_2px_10px_rgba(0,0,0,0.14)]"
            />
          ) : (
            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C0392B_0%,#8e1c10_100%)] text-[22px] font-extrabold text-white shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
              {seller.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#27ae60]"
            aria-label="Online"
          />
        </div>

        <div>
          <Link
            href={`/sellers/${sellerId}`}
            className="mb-1 block text-base font-extrabold text-[#1a1a1a] no-underline"
          >
            {seller.name}
          </Link>
          <div className="flex items-center gap-[5px]">
            <StarRating rating={seller.rating} />
            <span className="text-[13.5px] font-bold text-[#1a1a1a]">{seller.rating}</span>
            <span className="text-[11.5px] text-[#888]">({seller.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-[5px]">
        {seller.isVerified && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#a9dfbf] bg-[#eafaf1] px-[9px] py-[3px] text-[11px] font-semibold text-[#1e8449]">
            <MdVerified size={11} /> Verified
          </span>
        )}
      </div>

      <div className="mb-3.5 border-y border-[#f0f0f0]">
        {[
          { label: "Member Since",   val: seller.memberSince  },
          { label: "Total Listings", val: seller.totalListing },
        ].map(({ label, val }) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-[#f8f8f8] py-2 text-[12.5px] last:border-b-0"
          >
            <span className="text-[#777]">{label}</span>
            <span className="font-bold text-[#1a1a1a]">{val}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-none bg-[linear-gradient(135deg,#27ae60_0%,#1e8449_100%)] p-3 font-[inherit] text-sm font-bold text-white shadow-[0_4px_14px_rgba(39,174,96,0.32)] transition hover:-translate-y-px hover:opacity-90"
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
        {/* <button className="...">
          <FiMessageSquare size={16} />
          Chat with Seller
        </button> */}
      </div>

      {!isOwnListing && (
        <div className="mt-4 border-t border-[#f0f0f0] pt-4">
          <p className="mb-2 text-[13px] font-extrabold text-[#1a1a1a]">Leave a Review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this seller (optional)"
            className="mt-2.5 min-h-[60px] w-full resize-y rounded-lg border border-[#e2e8f0] p-2.5 font-[inherit] text-[13px]"
          />
          <button
            onClick={handleSubmitReview}
            disabled={submitting}
            className="mt-2 w-full rounded-lg border-none bg-[#C0392B] p-2.5 text-[13px] font-semibold text-white enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      <Link
        href={`/sellers/${sellerId}`}
        className="mt-4 block border-t border-[#f0f0f0] pt-3.5 text-center text-[13px] font-semibold text-black no-underline"
      >
        View full profile & all reviews →
      </Link>
    </div>
  );
}