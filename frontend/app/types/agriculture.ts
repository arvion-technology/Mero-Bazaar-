export type VetServiceType =
  | "GENERAL_CHECKUP" | "VACCINATION" | "SURGERY" | "DEWORMING"
  | "BREEDING_CONSULTATION" | "EMERGENCY" | "OTHER";
export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type UnitType = "KG" | "LITRE" | "PIECE" | "HEAD" | "BIGHA";
export type HealthVaccineStatus = "VACCINATED" | "NOT_VACCINATED" | "UNKNOWN";
export type AgricultureListingType =
  | "PRODUCE" | "LIVESTOCK" | "TOOL" | "SEED" | "FERTILIZER" | "VET_SERVICE" | "FARM_LABOUR";

export interface CreateAgriculturePayload {
  listingType: AgricultureListingType;
  district: string;
  village?: string;
  location: string;
  pricePerUnit: number;
  unit: UnitType;
  organicCertified?: boolean;
  organicVerified?: boolean;
  seasonalAvailability?: string;
  animalType?: string;
  breed?: string;
  age?: number;
  healthVaccineStatus?: HealthVaccineStatus;
  vetServiceType?: VetServiceType;
  experienceYears?: number;
  mobileService?: boolean;
  vaccinationAvailable?: boolean;
  serviceRadiusKm?: number;
  healthCertificate?: boolean;
  availabilityDays?: WeekDay[];
}
export interface AgricultureListing {
  id: string;
  userId: string;
  title: string;
  category: "AGRICULTURE";
  description?: string | null;
  price?: number | null;
  createdAt: string;
  images: string[];
  status?: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  isVerified?: boolean;
  isFeatured?: boolean;
  latitude?: number | null;
  longitude?: number | null;

  agriculture: {
    listingType: AgricultureListingType;
    district: string;
    village?: string | null;
    location: string;
    pricePerUnit: number;
    unit: UnitType;
    organicCertified: boolean;
    organicVerified: boolean;
    seasonalAvailability?: string | null;
    animalType?: string | null;
    breed?: string | null;
    age?: number | null;
    healthVaccineStatus?: HealthVaccineStatus | null;
    vetServiceType?: VetServiceType;
    experienceYears?: number;
    mobileService?: boolean;
    vaccinationAvailable?: boolean;
    serviceRadiusKm?: number;
    healthCertificate?: boolean;
    availabilityDays?: WeekDay[];
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

export interface AgricultureCard {
  id: string;
  title: string;
  price: string;
  location: string;
  listingType: string;
  thumb: string;
  postedDaysAgo: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}