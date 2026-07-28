export type PropertyType =
  | "ROOM"
  | "FLAT"
  | "APARTMENT"
  | "HOUSE"
  | "HOSTEL"
  | "LAND"
  | "SHUTTER"
  | "OFFICE";

export type ListingType = "RENT" | "SALE";

export type OwnerType = "OWNER" | "AGENT";

export const PROPERTY_TYPES: PropertyType[] = [
  "ROOM",
  "FLAT",
  "APARTMENT",
  "HOUSE",
  "HOSTEL",
  "LAND",
  "SHUTTER",
  "OFFICE",
];

export const LISTING_TYPES: ListingType[] = ["RENT", "SALE"];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  ROOM: "Room",
  FLAT: "Flat",
  APARTMENT: "Apartment",
  HOUSE: "House",
  HOSTEL: "Hostel",
  LAND: "Land",
  SHUTTER: "Shutter",
  OFFICE: "Office Space",
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  RENT: "Rent",
  SALE: "Sale",
};

export const CITIES = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan"];

export const AMENITIES = ["furnished", "parking", "wifi", "water", "electricity", "pet"] as const;
export type AmenityKey = (typeof AMENITIES)[number];

export interface RentalListing {
  id: string;
  userId: string;
  title: string;
  category: "RENTAL";
  description?: string | null;
  price?: number | null;
  createdAt: string;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  sellerTotalListing?: number;
  sellerRating?: number;
  sellerReviewCount?: number;

  rental: {
    propertyType: PropertyType;
    listingType: ListingType;
    city: string;
    area?: string | null;
    ward?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;

    monthlyRent: number;
    depositAmount: number;

    bedrooms?: number | null;
    bathrooms?: number | null;
    squareFeet?: number | null;

    furnished: boolean;
    parkingAvailable: boolean;
    wifiAvailable: boolean;
    waterIncluded: boolean;
    electricityIncluded: boolean;
    petFriendly: boolean;

    availableFrom?: string | null;

    isOwnerOrAgent: OwnerType;
    noBroker: boolean;

    nearbyLandmarks: string[];
    rules: string[];
  };

  user?: {
  name?: string | null;
  isVerified?: boolean;
  phone?: string | null;
  createdAt?: string;
  vendorProfile?: {
    businessName?: string;
    rating?: number;
    website?: string;
  };
};
}

export interface CreateRentalPayload {
  description?: string;
  price?: number;
  images?: string[];

  propertyType: PropertyType;
  listingType: ListingType;
  city: string;
  area?: string;
  ward?: string;
  address?: string;
  latitude?: number;
  longitude?: number;

  monthlyRent: number;
  depositAmount: number;

  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;

  furnished?: boolean;
  parkingAvailable?: boolean;
  wifiAvailable?: boolean;
  waterIncluded?: boolean;
  electricityIncluded?: boolean;
  petFriendly?: boolean;

  availableFrom?: string;

  isOwnerOrAgent: OwnerType;
  noBroker?: boolean;

  nearbyLandmarks?: string[];
  rules?: string[];
}

export interface RentalCard {
  id: string;
  title: string;
  price: string;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  thumb: string;
  category: string;
  postedDaysAgo: number;
}