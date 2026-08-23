export type BeautyServiceType =
  | "SALON" | "BARBER" | "MAKEUP_ARTIST" | "SKINCARE" | "SPA" | "COSMETICS" | "BRIDAL";

export interface CreateBeautyPayload {
  serviceTitle: string;
  serviceType: BeautyServiceType;
  shortDescription?: string;
  detailedDescription?: string;
  price: number;
  priceStartingFrom?: boolean;
  serviceLocationType?: string;
  studioLocation?: string;
  duration?: string;
  homeVisit?: boolean;
  whoIsThisFor?: string;
  genderPreference?: string;
  experienceLevel?: string;
  preparationTime?: string;
  tags?: string[];
  portfolioUrls?: string[];
  bridalAvailable?: boolean;
  city?: string;
}

export interface BeautyListing {
  id: string;
  userId: string;
  title: string;
  category: "BEAUTY";
  description?: string | null;
  price?: number | null;
  createdAt: string;
  images: string[];
  status?: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  isVerified?: boolean;
  isFeatured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  sellerRating?: number;
  sellerReviewCount?: number;
  sellerTotalListing?: number;

  beauty: {
    serviceType: BeautyServiceType;
    price: number;
    priceStartingFrom: boolean;
    homeVisit: boolean;
    portfolioUrls: string[];
    bridalAvailable: boolean;
    rating: number;
    city?: string | null;
    shortDescription?: string | null;
    detailedDescription?: string | null;
    serviceLocationType?: string | null;
    studioLocation?: string | null;
    duration?: string | null;
    whoIsThisFor?: string | null;
    genderPreference?: string | null;
    experienceLevel?: string | null;
    preparationTime?: string | null;
    tags: string[];
  };

  user?: {
    name?: string | null;
    phone?: string | null;
    image?: string | null;
    createdAt?: string;
    isVerified?: boolean;
    _count?: { listings: number };
  };

  reviews?: {
    rating: number;
    comment?: string | null;
    reviewerName?: string | null;
    createdAt?: string;
  }[];
}

export interface BeautyCard {
  id: string;
  title: string;
  price: string;
  serviceType: BeautyServiceType;
  city: string | null;
  thumb: string;
  postedDaysAgo: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  bridalAvailable?: boolean;
  homeVisit?: boolean;
  rating?: number;
}