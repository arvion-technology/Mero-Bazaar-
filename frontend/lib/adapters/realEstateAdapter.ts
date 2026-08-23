import type { RealEstateDetail } from "@/app/types/listing";
import type { RentalCard, RentalListing, AmenityKey, CreateRentalPayload, PropertyType, ListingType, OwnerType } from "@/app/types/realestate";
import { PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS, AMENITIES } from "@/app/types/realestate";

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
    sellerId: listing.userId,
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
    reviews: [],
    seller: {
      name: listing.user?.name ?? "Unknown",
      avatar: "/placeholder-avatar.png",
      rating: listing.sellerRating ?? listing.user?.vendorProfile?.rating ?? 0,
      reviewCount: listing.sellerReviewCount ?? 0,
      isVerified: listing.user?.isVerified ?? false,
      isPro: false,
      isTrusted: false,
      memberSince: listing.user?.createdAt
        ? new Date(listing.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "N/A",
      totalListing: listing.sellerTotalListing ?? 0,
      responseRate: "N/A",
      avgResponseTime: "N/A",
      phone: listing.user?.phone ?? "N/A",
    },
  };
}

type RawRentalForm = Record<string, unknown> & {
  amenities?: Partial<Record<AmenityKey, boolean>>;
};

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function toBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return fallback;
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

type AmenityFlags = {
  furnished: boolean;
  parkingAvailable: boolean;
  wifiAvailable: boolean;
  waterIncluded: boolean;
  electricityIncluded: boolean;
  petFriendly: boolean;
};

const AMENITY_TO_DTO_FIELD: Record<AmenityKey, keyof AmenityFlags> = {
  furnished: "furnished",
  parking: "parkingAvailable",
  wifi: "wifiAvailable",
  water: "waterIncluded",
  electricity: "electricityIncluded",
  pet: "petFriendly",
};

const PROPERTY_TYPE_MAP: Record<string, PropertyType> = {
  ROOM: "ROOM",
  FLAT: "FLAT",
  APARTMENT: "APARTMENT",
  HOUSE: "HOUSE",
  HOSTEL: "HOSTEL",
  LAND: "LAND",
  SHUTTER: "SHUTTER",
  OFFICE: "OFFICE",
  "OFFICE SPACE": "OFFICE",
  VILLA: "HOUSE",
  SHOP: "SHUTTER",
};

const LISTING_TYPE_MAP: Record<string, ListingType> = {
  RENT: "RENT",
  SALE: "SALE",
};

const OWNER_TYPE_MAP: Record<string, OwnerType> = {
  OWNER: "OWNER",
  AGENT: "AGENT",
};

function normalizePropertyType(value: unknown): PropertyType {
  const key = String(value ?? "").trim().toUpperCase();
  const mapped = PROPERTY_TYPE_MAP[key];
  if (!mapped) throw new Error(`Unknown property type: "${value}"`);
  return mapped;
}

function normalizeListingType(value: unknown): ListingType {
  const key = String(value ?? "").trim().toUpperCase();
  const mapped = LISTING_TYPE_MAP[key];
  if (!mapped) throw new Error(`Unknown listing type: "${value}"`);
  return mapped;
}

function normalizeOwnerType(value: unknown): OwnerType {
  const key = String(value ?? "").trim().toUpperCase();
  const mapped = OWNER_TYPE_MAP[key];
  if (!mapped) throw new Error(`Unknown owner type: "${value}"`);
  return mapped;
}

export function formToCreateRentalPayload(raw: RawRentalForm): CreateRentalPayload {
  const initialAmenities: AmenityFlags = {
    furnished: false,
    parkingAvailable: false,
    wifiAvailable: false,
    waterIncluded: false,
    electricityIncluded: false,
    petFriendly: false,
  };

  const flatAmenities = AMENITIES.reduce(function (acc, key) {
    const dtoField = AMENITY_TO_DTO_FIELD[key];
    const nested = raw.amenities ? raw.amenities[key] : undefined;
    const flatTopLevel = raw[dtoField];
    acc[dtoField] = toBool(nested !== undefined ? nested : flatTopLevel, false);
    return acc;
  }, initialAmenities);

  const payload: CreateRentalPayload = {
    description: typeof raw.description === "string" ? raw.description : undefined,
    price: toNumber(raw.price),
    images: toStringArray(raw.images),

    propertyType: normalizePropertyType(raw.propertyType),
    listingType: normalizeListingType(raw.listingType),
    city: String(raw.city ?? ""),
    area: typeof raw.area === "string" ? raw.area : undefined,
    ward: typeof raw.ward === "string" ? raw.ward : undefined,
    address: typeof raw.address === "string" ? raw.address : undefined,
    latitude: toNumber(raw.latitude),
    longitude: toNumber(raw.longitude),

    monthlyRent: toNumber(raw.monthlyRent) ?? 0,
    depositAmount: toNumber(raw.depositAmount) ?? 0,

    bedrooms: toNumber(raw.bedrooms),
    bathrooms: toNumber(raw.bathrooms),
    squareFeet: toNumber(raw.squareFeet),

    furnished: flatAmenities.furnished,
    parkingAvailable: flatAmenities.parkingAvailable,
    wifiAvailable: flatAmenities.wifiAvailable,
    waterIncluded: flatAmenities.waterIncluded,
    electricityIncluded: flatAmenities.electricityIncluded,
    petFriendly: flatAmenities.petFriendly,

    availableFrom: typeof raw.availableFrom === "string" && raw.availableFrom.trim() !== ""
      ? raw.availableFrom
      : undefined,

    isOwnerOrAgent: normalizeOwnerType(raw.ownerType),
    noBroker: toBool(raw.noBroker, false),

    nearbyLandmarks: toStringArray(raw.nearbyLandmarks) ?? [],
    rules: toStringArray(raw.rules) ?? [],
  };

  return payload;
}