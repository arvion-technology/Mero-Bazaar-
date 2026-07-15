import Link from "next/link";
import { notFound } from "next/navigation";
import { MdVerified } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import type { SellerProfile, SellerReview, SellerListingCard, PaginatedResponse } from "@/app/types/listing";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating)
          ? <FaStar key={i} size={14} color="#F39C12" />
          : <FaRegStar key={i} size={14} color="#F39C12" />
      )}
    </span>
  );
}

async function fetchSellerProfile(id: string): Promise<SellerProfile | null> {
  const res = await fetch(`${IMG_BASE}/api/sellers/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function fetchSellerReviews(id: string, page: number): Promise<PaginatedResponse<SellerReview>> {
  const res = await fetch(`${IMG_BASE}/api/sellers/${id}/reviews?page=${page}&take=10`, { cache: "no-store" });
  if (!res.ok) return { data: [], total: 0, page: 1, pageSize: 10 };
  return res.json();
}

async function fetchSellerListings(id: string): Promise<PaginatedResponse<SellerListingCard>> {
  const res = await fetch(`${IMG_BASE}/api/sellers/${id}/listings?page=1&take=12`, { cache: "no-store" });
  if (!res.ok) return { data: [], total: 0, page: 1, pageSize: 12 };
  return res.json();
}

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reviewPage?: string }>;
};

export default async function SellerProfilePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { reviewPage } = await searchParams;
  const page = Number(reviewPage) || 1;

  const [profile, reviews, listings] = await Promise.all([
    fetchSellerProfile(id),
    fetchSellerReviews(id, page),
    fetchSellerListings(id),
  ]);

  if (!profile) notFound();

  const avatarUrl = profile.avatar
    ? profile.avatar.startsWith("http") ? profile.avatar : `${IMG_BASE}${profile.avatar}`
    : null;

  const memberSince = new Date(profile.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const totalReviewPages = Math.ceil(reviews.total / reviews.pageSize);

  return (
    <div className="sp-container">
      {/* Header */}
      <div className="sp-header-card">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={profile.name ?? "Seller"} className="sp-avatar" />
        ) : (
          <div className="sp-avatar-placeholder">
            {(profile.name ?? "S").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="sp-header-info">
          <p className="sp-name">{profile.name ?? "Unnamed Seller"}</p>

          <div className="sp-rating-row">
            <StarRating rating={profile.rating} />
            <span className="sp-rating-num">{profile.rating.toFixed(1)}</span>
            <span className="sp-reviews">({profile.reviewCount} reviews)</span>
          </div>

          <div className="sp-badges">
            {profile.isVerified && (
              <span className="sp-badge sp-badge-verified"><MdVerified size={12} /> Verified</span>
            )}
            {profile.business?.isVerified && (
              <span className="sp-badge sp-badge-verified"><MdVerified size={12} /> Business Verified</span>
            )}
          </div>

          <p className="sp-member-since">Member since {memberSince}</p>
        </div>
      </div>

      {/* Business info, only if VendorProfile exists */}
      {profile.business && (
        <div className="sp-business-card">
          <p className="sp-section-title">Business Information</p>
          <p className="sp-business-name">{profile.business.name}</p>
          <span className="sp-business-type">{profile.business.type.toLowerCase()}</span>
          {profile.business.description && (
            <p className="sp-business-desc">{profile.business.description}</p>
          )}
          {profile.business.address && (
            <p className="sp-business-addr"><FiMapPin size={12} /> {profile.business.address}</p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="sp-stats-row">
        <div className="sp-stat-chip">
          <div className="sp-stat-val">{profile.rating.toFixed(1)}</div>
          <div className="sp-stat-label">Avg Rating</div>
        </div>
        <div className="sp-stat-chip">
          <div className="sp-stat-val">{profile.reviewCount}</div>
          <div className="sp-stat-label">Reviews</div>
        </div>
        <div className="sp-stat-chip">
          <div className="sp-stat-val">{profile.totalListings}</div>
          <div className="sp-stat-label">Listings</div>
        </div>
      </div>

      {/* Listings */}
      <div className="sp-section-card">
        <p className="sp-section-title">Active Listings</p>
        {listings.data.length === 0 ? (
          <p className="sp-empty">No active listings yet.</p>
        ) : (
          <div className="sp-listings-grid">
            {listings.data.map((l) => (
              <Link key={l.id} href={`/category/vehicles/${l.id}`} className="sp-listing-card">
                <div className="sp-listing-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.images?.[0] ? `${IMG_BASE}${l.images[0]}` : "/placeholder.png"}
                    alt={l.title}
                    className="sp-listing-img"
                  />
                </div>
                <div className="sp-listing-body">
                  <p className="sp-listing-title">{l.title}</p>
                  <p className="sp-listing-price">
                    {l.price != null ? `Rs. ${l.price.toLocaleString("en-IN")}` : "Price on request"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="sp-section-card">
        <p className="sp-section-title">Reviews ({reviews.total})</p>
        {reviews.data.length === 0 ? (
          <p className="sp-empty">No reviews yet.</p>
        ) : (
          <>
            {reviews.data.map((r) => (
              <div key={r.id} className="sp-review-row">
                <div className="sp-review-header">
                  <span className="sp-review-name">{r.reviewerName}</span>
                  <StarRating rating={r.rating} />
                  <span className="sp-review-date">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="sp-review-listing">on {r.listingTitle}</p>
                {r.comment && <p className="sp-review-comment">{r.comment}</p>}
              </div>
            ))}

            {totalReviewPages > 1 && (
              <div className="sp-pagination">
                {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/sellers/${id}?reviewPage=${p}`}
                    className={`sp-page-link${p === page ? " active" : ""}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}