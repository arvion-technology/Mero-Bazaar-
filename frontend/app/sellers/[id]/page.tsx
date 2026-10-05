import Link from "next/link";
import { notFound } from "next/navigation";
import { MdVerified } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import BackButton from "@/components/BackButton";
import type { SellerProfile, SellerReview, SellerListingCard, PaginatedResponse } from "@/app/types/listing";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
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

const CARD = "rounded-2xl bg-white px-[22px] py-5 shadow-[0_2px_14px_rgba(0,0,0,0.07)]";
const SECTION_TITLE = "mb-3 text-base font-extrabold text-[#1a1a1a]";
const BADGE =
  "inline-flex items-center gap-1 rounded-full border border-[#a9dfbf] bg-[#eafaf1] px-2.5 py-[3px] text-[11px] font-semibold text-[#1e8449]";

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
    <div className="mx-auto mt-6 flex max-w-[1000px] flex-col gap-[18px] px-6 pb-6 max-[600px]:px-3">
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-lg font-extrabold text-[#1a1a1a]">Seller Profile</h1>
    </div>

    {/* Header + Business info */}
    <div className="rounded-2xl bg-white px-7 py-[26px] shadow-[0_2px_14px_rgba(0,0,0,0.07)] max-[600px]:px-4 max-[600px]:py-[18px]">
      <div className="flex flex-wrap items-start gap-5">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={profile.name ?? "Seller"}
            className="h-[84px] w-[84px] shrink-0 rounded-full border-[3px] border-white object-cover shadow-[0_2px_10px_rgba(0,0,0,0.14)]"
          />
        ) : (
          <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C0392B_0%,#8e1c10_100%)] text-[32px] font-extrabold text-white shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
            {(profile.name ?? "S").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-[220px] flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            <p className="text-2xl font-extrabold text-[#1a1a1a]">{profile.name ?? "Unnamed Seller"}</p>
            {profile.business && (
              <span className="rounded-[5px] bg-[#f5f5f5] px-2 py-0.5 text-[11px] font-semibold capitalize text-[#888]">
                {profile.business.type.toLowerCase()}
              </span>
            )}
          </div>

          <div className="mb-2.5 flex items-center gap-1.5">
            <StarRating rating={profile.rating} />
            <span className="text-sm font-bold text-[#1a1a1a]">{profile.rating.toFixed(1)}</span>
            <span className="text-[12.5px] text-[#888]">({profile.reviewCount} reviews)</span>
          </div>

          <div className="mb-2 flex flex-wrap gap-1.5">
            {profile.isVerified && (
              <span className={BADGE}><MdVerified size={12} /> Verified</span>
            )}
            {profile.business?.isVerified && (
              <span className={BADGE}><MdVerified size={12} /> Business Verified</span>
            )}
          </div>

          <p className="text-[12.5px] text-[#999]">Member since {memberSince}</p>
        </div>
      </div>

      {profile.business &&
        (profile.business.name !== profile.name ||
          profile.business.description ||
          profile.business.address) && (
          <div className="mt-5 border-t border-[#f0f0f0] pt-4">
            {profile.business.name !== profile.name && (
              <p className="mb-1 text-[15px] font-bold text-[#1a1a1a]">{profile.business.name}</p>
            )}
            {profile.business.description && (
              <p className="mb-2 text-[13.5px] leading-[1.7] text-[#444]">{profile.business.description}</p>
            )}
            {profile.business.address && (
              <p className="flex items-center gap-[5px] text-[12.5px] text-[#888]">
                <FiMapPin size={12} /> {profile.business.address}
              </p>
            )}
          </div>
        )}
    </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 max-[600px]:gap-2">
        {[
          { val: profile.rating.toFixed(1), label: "Avg Rating" },
          { val: profile.reviewCount,       label: "Reviews"    },
          { val: profile.totalListings,     label: "Listings"   },
        ].map(({ val, label }) => (
          <div
            key={label}
            className="rounded-[14px] bg-white p-4 text-center shadow-[0_2px_14px_rgba(0,0,0,0.07)]"
          >
            <div className="text-xl font-extrabold text-[#C0392B]">{val}</div>
            <div className="mt-[3px] text-[11.5px] text-[#888]">{label}</div>
          </div>
        ))}
      </div>

      {/* Listings */}
      <div className={CARD}>
        <p className={SECTION_TITLE}>Active Listings</p>
        {listings.data.length === 0 ? (
          <p className="py-5 text-center text-[13px] text-[#999]">No active listings yet.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5 max-[600px]:grid-cols-[repeat(auto-fill,minmax(130px,1fr))]">
            {listings.data.map((l) => (
              <Link
                key={l.id}
                href={`/category/vehicles/${l.id}`}
                className="flex flex-col overflow-hidden rounded-xl border-[1.5px] border-[#ebebeb] no-underline transition hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.09)]"
              >
                <div className="h-[100px] w-full overflow-hidden bg-[#eee]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.images?.[0] ? `${IMG_BASE}${l.images[0]}` : "/placeholder.png"}
                    alt={l.title}
                    className="block h-full w-full object-cover"
                  />
                </div>
                <div className="px-2.5 pb-2.5 pt-2">
                  <p className="mb-[3px] line-clamp-2 text-xs font-bold text-[#1a1a1a]">{l.title}</p>
                  <p className="text-[12.5px] font-extrabold text-[#C0392B]">
                    {l.price != null ? `Rs. ${l.price.toLocaleString("en-IN")}` : "Price on request"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className={CARD}>
        <p className={SECTION_TITLE}>Reviews ({reviews.total})</p>
        {reviews.data.length === 0 ? (
          <p className="py-5 text-center text-[13px] text-[#999]">No reviews yet.</p>
        ) : (
          <>
            {reviews.data.map((r) => (
              <div key={r.id} className="border-b border-[#f5f5f5] py-3.5 last:border-b-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-[13.5px] font-bold text-[#1a1a1a]">{r.reviewerName}</span>
                  <StarRating rating={r.rating} />
                  <span className="ml-auto text-[11.5px] text-[#aaa]">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="mb-1 text-[11.5px] text-[#2980b9]">on {r.listingTitle}</p>
                {r.comment && <p className="mt-1 text-[13px] leading-[1.6] text-[#555]">{r.comment}</p>}
              </div>
            ))}

            {totalReviewPages > 1 && (
              <div className="mt-3.5 flex justify-center gap-2">
                {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/sellers/${id}?reviewPage=${p}`}
                    className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold no-underline ${
                      p === page
                        ? "border-[#C0392B] bg-[#C0392B] text-white"
                        : "border-[#e0e0e0] text-[#555]"
                    }`}
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