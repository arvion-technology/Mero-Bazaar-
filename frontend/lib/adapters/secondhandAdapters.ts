import type { DBListing, ListingDetail } from "@/app/types/listing";

const CONDITION_LABEL: Record<string, string> = {
  LIKE_NEW: "Like New", GOOD: "Good", FAIR: "Fair", FOR_PARTS: "For parts",
};

type SecondhandExtras = {
  secondhand: {
    category: string;
    condition: string;
    price: number;
    isNegotiable: boolean;
    city: string;
    description: string | null;
  } | null;
  user: {
    name: string | null;
    phone: string | null;
    image?: string | null;
    createdAt?: string;
    isVerified?: boolean;
    _count?: { listings: number };
  };
  reviews?: { rating: number; comment?: string | null; reviewerName?: string | null; createdAt?: string }[];
};

export function adaptSecondhandListing(dbInput: DBListing): ListingDetail {
  const db = dbInput as DBListing & SecondhandExtras;
  const sh = db.secondhand;
  const reviews = db.reviews ?? [];
  const IMG_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  return {
    id: db.id,
    sellerId: db.userId,
    listingId: `#SH${db.id.slice(-6).toUpperCase()}`,
    title: db.title,
    price: sh?.price != null ? `Rs. ${sh.price.toLocaleString("en-IN")}` : "Price on request",
    status: db.status,
    negotiable: sh?.isNegotiable ?? false,
    location: sh?.city ?? "Nepal",
    distanceFrom: "Location not specified",
    postedDaysAgo: Math.floor((Date.now() - new Date(db.createdAt).getTime()) / 86400000),
    driven: "N/A",
    isVerified: false,
    category: db.category,
    breadcrumbs: ["Secondhand", sh?.category ?? ""].filter(Boolean),
    images: db.images?.length ? db.images.map((i) => `${IMG_BASE}${i}`) : ["/placeholder-item.jpg"],
    description: sh?.description ?? db.description ?? "No description provided.",
    googleMapsUrl: "https://www.google.com/maps",
    latitude: db.latitude,
    longitude: db.longitude,
    specs: { make: "N/A", model: "N/A", year: "N/A", fuel: "N/A", transmission: "N/A", driven: "N/A" },
    details: {
      condition: sh ? CONDITION_LABEL[sh.condition] : "N/A",
      city: sh?.city ?? "N/A",
      isNegotiable: sh?.isNegotiable ? "Yes" : "No",
    },
    vehicleType: null,
    seller: {
      name: db.user?.name || "Verified Seller",
      avatar: db.user?.image
        ? db.user.image.startsWith("http") ? db.user.image : `${IMG_BASE}${db.user.image}`
        : "/placeholder-avatar.png",
      rating: 0,
      reviewCount: reviews.length,
      isVerified: db.user?.isVerified ?? false,
      isPro: false,
      isTrusted: false,
      memberSince: db.user?.createdAt
        ? new Date(db.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "N/A",
      totalListing: db.user?._count?.listings ?? 0,
      responseRate: "N/A",
      avgResponseTime: "N/A",
      phone: db.user?.phone || "N/A",
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