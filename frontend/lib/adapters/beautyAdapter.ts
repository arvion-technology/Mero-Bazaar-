import type { BeautyDetail } from "@/app/types/listing";
import type {
  CreateBeautyPayload,
  BeautyServiceType,
  BeautyCard,
  BeautyListing,
} from "@/app/types/beauty";
import { resolveImage, resolveImages, daysAgo } from "./shared";

interface RawBeautyForm {
  serviceTitle?: string;
  beautyServiceType?: string;
  shortDescription?: string;
  detailedDescription?: string;
  price?: string | number;
  priceStartingFrom?: boolean;
  serviceLocationType?: string;
  studioLocation?: string;
  duration?: string;
  homeVisit?: boolean;
  whoisthisfor?: string;
  genderPreference?: string;
  experienceLevel?: string;
  preparationTime?: string;
  tags?: string[];
  portfolioUrls?: string[];
  bridalAvailable?: boolean;
  city?: string;
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

const VALID_SERVICE_TYPES: BeautyServiceType[] = [
  "SALON", "BARBER", "MAKEUP_ARTIST", "SKINCARE", "SPA", "COSMETICS", "BRIDAL",
];

export function formToCreateBeautyPayload(raw: RawBeautyForm): CreateBeautyPayload {
  const serviceType = VALID_SERVICE_TYPES.includes(raw.beautyServiceType as BeautyServiceType)
    ? (raw.beautyServiceType as BeautyServiceType)
    : "SALON";

  return {
    serviceTitle: String(raw.serviceTitle ?? ""),
    serviceType,
    shortDescription: raw.shortDescription || undefined,
    detailedDescription: raw.detailedDescription || undefined,
    price: toNumber(raw.price),
    priceStartingFrom: !!raw.priceStartingFrom,
    serviceLocationType: raw.serviceLocationType || undefined,
    studioLocation: raw.studioLocation || undefined,
    duration: raw.duration || undefined,
    homeVisit: !!raw.homeVisit,
    whoIsThisFor: raw.whoisthisfor || undefined,
    genderPreference: raw.genderPreference || undefined,
    experienceLevel: raw.experienceLevel || undefined,
    preparationTime: raw.preparationTime || undefined,
    tags: raw.tags?.length ? raw.tags : undefined,
    portfolioUrls: raw.portfolioUrls?.length ? raw.portfolioUrls : undefined,
    bridalAvailable: !!raw.bridalAvailable,
    city: raw.city || undefined,
  };
}

const SERVICE_TYPE_LABEL: Record<BeautyServiceType, string> = {
  SALON: "Salon",
  BARBER: "Barber",
  MAKEUP_ARTIST: "Makeup Artist",
  SKINCARE: "Skincare",
  SPA: "Spa",
  COSMETICS: "Cosmetics",
  BRIDAL: "Bridal",
};

export function toBeautyCard(listing: BeautyListing): BeautyCard {
  const b = listing.beauty;
  if (!b) throw new Error(`Listing ${listing.id} has no beauty relation`);

  return {
    id: listing.id,
    title: listing.title,
    price: `NPR ${b.price.toLocaleString("en-IN")}${b.priceStartingFrom ? "+" : ""}`,
    serviceType: b.serviceType,
    city: b.city ?? null,
    thumb: listing.images?.[0] ? resolveImage(listing.images[0]) : "/placeholder-item.jpg",
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    isFeatured: listing.isFeatured ?? false,
    bridalAvailable: b.bridalAvailable,
    homeVisit: b.homeVisit,
    rating: b.rating,
  };
}

export function toBeautyDetail(listing: BeautyListing): BeautyDetail {
  const b = listing.beauty;
  if (!b) throw new Error(`Listing ${listing.id} has no beauty relation`);
  const reviews = listing.reviews ?? [];

  return {
    id: listing.id,
    sellerId: listing.userId,
    listingId: `#BW${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    price: `NPR ${b.price.toLocaleString("en-IN")}${b.priceStartingFrom ? "+" : ""}`,
    status: listing.status ?? "ACTIVE",
    location: b.city ?? "Location not specified",
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    category: "BEAUTY",
    breadcrumbs: ["Hair, Beauty & Wellness", SERVICE_TYPE_LABEL[b.serviceType]].filter(Boolean),
    images: resolveImages(listing.images, "/placeholder-item.jpg"),
    description: listing.description ?? "No description provided.",
    serviceType: SERVICE_TYPE_LABEL[b.serviceType],
    shortDescription: b.shortDescription ?? "",
    detailedDescription: b.detailedDescription ?? "",
    serviceLocationType: b.serviceLocationType ?? "N/A",
    studioLocation: b.studioLocation ?? "N/A",
    duration: b.duration ?? "N/A",
    homeVisit: b.homeVisit,
    priceStartingFrom: b.priceStartingFrom,
    whoIsThisFor: b.whoIsThisFor ?? "N/A",
    genderPreference: b.genderPreference ?? "N/A",
    experienceLevel: b.experienceLevel ?? "N/A",
    preparationTime: b.preparationTime ?? "N/A",
    tags: b.tags ?? [],
    bridalAvailable: b.bridalAvailable,
    city: b.city ?? "N/A",
    rating: b.rating,
    seller: {
      name: listing.user?.name || "Verified Seller",
      avatar: listing.user?.image ? resolveImage(listing.user.image) : "/placeholder-avatar.png",
      rating: listing.sellerRating ?? 0,
      reviewCount: listing.sellerReviewCount ?? reviews.length,
      isVerified: listing.user?.isVerified ?? false,
      isPro: false,
      isTrusted: false,
      memberSince: listing.user?.createdAt
        ? new Date(listing.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "N/A",
      totalListing: listing.sellerTotalListing ?? 0,
      responseRate: "N/A",
      avgResponseTime: "N/A",
      phone: listing.user?.phone || "N/A",
    },
    reviews: reviews.map((r) => ({
      reviewerName: r.reviewerName ?? "Anonymous",
      rating: r.rating,
      comment: r.comment ?? null,
      createdAt: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "N/A",
    })),
  };
}