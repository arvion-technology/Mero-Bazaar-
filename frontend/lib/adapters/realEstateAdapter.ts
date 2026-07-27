import type { RealEstateDetail } from "@/app/types/listing";
import type { RentalCard, RentalListing, AmenityKey } from "@/app/types/realestate";
import { PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/app/types/realestate";

export function formatMonthlyRent(monthlyRent: number, listingType: RentalListing["rental"]["listingType"]): string {
  const suffix = listingType === "RENT" ? "/month" : "";
  return `NPR ${monthlyRent.toLocaleString()} ${suffix}`.trim();
}

function buildAmenities(rental: RentalListing["rental"]): Record<AmenityKey, boolean> {
  return {
    furnished: rental.furnished,
    parking: rental.parkingAvailable,
    wifi: rental.wifiAvailable,
    water: rental.waterIncluded,
    electricity: rental.electricityIncluded,
    pet: rental.petFriendly,
  };
}

export function toRentalCard(listing: RentalListing): RentalCard {
  const rental = listing.rental;
  if (!rental) throw new Error(`Listing ${listing.id} has no rental relation`);

  return {
    id: listing.id,
    title: listing.title,
    price: formatMonthlyRent(rental.monthlyRent, rental.listingType),
    location: rental.area ? `${rental.area}, ${rental.city}` : rental.city,
    district: rental.city,
    bedrooms: rental.bedrooms ?? 0,
    bathrooms: rental.bathrooms ?? 0,
    thumb: listing.images?.[0] ?? "/property1.jpg",
    category: PROPERTY_TYPE_LABELS[rental.propertyType],
    postedDaysAgo: Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000),
  };
}

export function toRentalDetail(listing: RentalListing): RealEstateDetail {
  const rental = listing.rental;
  if (!rental) throw new Error(`Listing ${listing.id} has no rental relation`);

  return {
    id: listing.id,
    listingId: `#RE${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    price: formatMonthlyRent(rental.monthlyRent, rental.listingType),
    status: "ACTIVE",
    negotiable: true,
    location: rental.area ? `${rental.area}, ${rental.city}` : rental.city,
    distanceFrom: "",
    postedDaysAgo: Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000),
    isVerified: false,
    category: PROPERTY_TYPE_LABELS[rental.propertyType],
    breadcrumbs: ["Real Estate", PROPERTY_TYPE_LABELS[rental.propertyType], LISTING_TYPE_LABELS[rental.listingType]],
    images: listing.images?.length ? listing.images : ["/property1.jpg"],
    description: listing.description ?? "No description provided.",
    googleMapsUrl:
      listing.latitude != null && listing.longitude != null
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
        : "https://www.google.com/maps",
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    specs: {
      propertyType: PROPERTY_TYPE_LABELS[rental.propertyType],
      listingType: LISTING_TYPE_LABELS[rental.listingType],
      bedrooms: rental.bedrooms != null ? String(rental.bedrooms) : "N/A",
      bathrooms: rental.bathrooms != null ? String(rental.bathrooms) : "N/A",
      sqft: rental.squareFeet != null ? String(rental.squareFeet) : "N/A",
    },
    amenities: buildAmenities(rental),
    landmarks: rental.nearbyLandmarks ?? [],
    houseRules: rental.rules ?? [],
    ownerType: rental.isOwnerOrAgent.toLowerCase() as "owner" | "agent",
    noBroker: rental.noBroker,
    availableFrom: rental.availableFrom ?? "N/A",
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