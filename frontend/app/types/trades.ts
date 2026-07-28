export const SERVICES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Masonry",
  "HVAC",
  "Roofing",
  "Tiling",
];

export const CITIES = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Bharatpur"];

export const SERVICE_AREAS_KM = [5, 10, 15, 20, 25, 30, 50];

export const RESPONSE_TIME_LABELS: Record<number, string> = {
  0.5: "30 Minutes",
  1: "1 Hour",
  2: "2 Hours",
  3: "3 Hours",
  4: "4 Hours",
  24: "Same Day",
  48: "Next Day",
};

export interface TradesListing {
  id: string;
  userId: string;
  title: string;
  category: "TRADES";
  description?: string | null;
  price?: number | null;
  createdAt: string;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];

  sellerTotalListing?: number;
  sellerRating?: number;
  sellerReviewCount?: number;

  trades: {
    city: string;
    ward?: string | null;
    skillTags: string[];
    serviceAreaKm: number;
    calloutCharge: number;
    warrantyGiven: boolean;
    emergencyAvailable: boolean;
    avgResponseHours?: number | null;
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

export interface CreateTradesPayload {
  title: string;
  description?: string;
  city: string;
  ward?: string;
  skillTags: string[];
  serviceAreaKm: number;
  calloutCharge: number;
  emergencyAvailable: boolean;
  warrantyGiven: boolean;
  latitude: number;
  longitude: number;
}

export interface TradesCard {
  id: string;
  title: string;
  calloutCharge: string;
  location: string;
  district: string;
  serviceAreaKm: number;
  skillTags: string[];
  thumb: string;
  emergencyAvailable: boolean;
  warrantyGiven: boolean;
  postedDaysAgo: number;
}