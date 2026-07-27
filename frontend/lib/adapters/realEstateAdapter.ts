import type { RealEstateDetail } from "@/app/types/listing";
import type { RealEstateCard, RealEstateListing } from "@/app/types/realestate";

export function formatPriceRange(min: number, max: number, intent: string): string {
  const suffix = intent === "Rent" ? "/month" : "";
  if (min === max) return `NPR ${min.toLocaleString()} ${suffix}`.trim();
  return `NPR ${min.toLocaleString()}–${max.toLocaleString()} ${suffix}`.trim();
}

export function toRealEstateCard(listing: RealEstateListing): RealEstateCard {
  const re = listing.realEstate;
  if (!re) throw new Error(`Listing ${listing.id} has no realEstate relation`);
  return {
    id: listing.id,
    title: listing.title,
    price: formatPriceRange(re.rentMin, re.rentMax, re.listingType),
    location: `${re.area}, ${re.city}`,
    district: re.city,
    bedrooms: re.bedrooms,
    bathrooms: re.bathrooms,
    thumb: listing.images?.[0] ?? "/property1.jpg",
    category: re.propertyType,
    postedDaysAgo: Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000),
    isVerified: listing.isVerified ?? false,
    isFeatured: listing.isFeatured ?? false,
  };
}

export function toRealEstateDetail(listing: RealEstateListing): RealEstateDetail {
  const re = listing.realEstate;
  if (!re) throw new Error(`Listing ${listing.id} has no realEstate relation`);
  return {
    id: listing.id,
    listingId: `#RE${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    price: formatPriceRange(re.rentMin, re.rentMax, re.listingType),
    status: "ACTIVE",
    negotiable: true,
    location: `${re.area}, ${re.city}`,
    distanceFrom: "",
    postedDaysAgo: Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000),
    isVerified: listing.isVerified ?? false,
    category: re.propertyType,
    breadcrumbs: ["Real Estate", re.propertyType, re.listingType],
    images: listing.images?.length ? listing.images : ["/property1.jpg"],
    description: listing.description ?? "No description provided.",
    googleMapsUrl:
      listing.latitude != null && listing.longitude != null
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
        : "https://www.google.com/maps",
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    specs: {
      propertyType: re.propertyType,
      listingType: re.listingType,
      bedrooms: String(re.bedrooms),
      bathrooms: String(re.bathrooms),
      sqft: re.sqft != null ? String(re.sqft) : "N/A",
    },
    amenities: re.amenities,
    landmarks: re.landmarks ?? [],
    houseRules: re.houseRules ?? [],
    ownerType: re.ownerType,
    noBroker: re.noBroker,
    availableFrom: re.availableFrom ?? "N/A",
    seller: {
      name: listing.user?.name ?? "Unknown",
      avatar: "/placeholder-avatar.png",
      rating: listing.user?.vendorProfile?.rating ?? 0,
      reviewCount: 0,
      isVerified: listing.user?.isVerified ?? false,
      isPro: false,
      isTrusted: false,
      memberSince: "N/A",
      totalListing: 0,
      responseRate: "N/A",
      avgResponseTime: "N/A",
      phone: "N/A",
    },
  };
}