import type { SecondhandDetail } from "@/app/types/listing";
import type { SecondhandCard, SecondhandListing } from "@/app/types/secondhand";
import { CONDITION_LABEL } from "@/app/types/secondhand";
import { resolveImage, resolveImages, daysAgo } from "./shared";

export function toSecondhandCard(listing: SecondhandListing): SecondhandCard {
  const sh = listing.secondhand;
  if (!sh) throw new Error(`Listing ${listing.id} has no secondhand relation`);

  return {
    id: listing.id,
    title: listing.title,
    price: `Rs. ${sh.price.toLocaleString("en-IN")}`,
    location: sh.city,
    condition: CONDITION_LABEL[sh.condition],
    thumb: listing.images?.[0] ? resolveImage(listing.images[0]) : "/placeholder-item.jpg",
    category: sh.category,
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    isFeatured: listing.isFeatured ?? false,
  };
}

export function toSecondhandDetail(listing: SecondhandListing): SecondhandDetail {
  const sh = listing.secondhand;
  if (!sh) throw new Error(`Listing ${listing.id} has no secondhand relation`);
  const reviews = listing.reviews ?? [];

  return {
    id: listing.id,
    sellerId: listing.userId,
    listingId: `#SH${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    price: `Rs. ${sh.price.toLocaleString("en-IN")}`,
    status: listing.status ?? "ACTIVE",
    negotiable: sh.isNegotiable,
    location: sh.city,
    distanceFrom: "Location not specified",
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    category: sh.category,
    breadcrumbs: ["Secondhand", sh.category].filter(Boolean),
    images: resolveImages(listing.images, "/placeholder-item.jpg"),
    description: sh.description ?? listing.description ?? "No description provided.",
    googleMapsUrl:
      listing.latitude != null && listing.longitude != null
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
        : "https://www.google.com/maps",
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    condition: CONDITION_LABEL[sh.condition],
    isNegotiable: sh.isNegotiable,
    city: sh.city,
    seller: {
      name: listing.user?.name || "Verified Seller",
      avatar: listing.user?.image ? resolveImage(listing.user.image) : "/placeholder-avatar.png",
      rating: 0,
      reviewCount: reviews.length,
      isVerified: listing.user?.isVerified ?? false,
      isPro: false,
      isTrusted: false,
      memberSince: listing.user?.createdAt
        ? new Date(listing.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "N/A",
      totalListing: listing.user?._count?.listings ?? 0,
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