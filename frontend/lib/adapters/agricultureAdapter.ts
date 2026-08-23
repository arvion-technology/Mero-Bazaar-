import type { AgricultureDetail } from "@/app/types/listing";
import type {
  CreateAgriculturePayload,
  AgricultureListingType,
  UnitType,
  HealthVaccineStatus,
  VetServiceType,
  WeekDay,
  AgricultureCard,
  AgricultureListing,
} from "@/app/types/agriculture";
import { resolveImage, resolveImages, daysAgo } from "./shared";

interface RawAgricultureForm {
  listingType?: string;
  district?: string;
  village?: string;
  location?: string;
  price?: string | number;
  unit?: string;
  organicCertified?: boolean;
  seasonalAvailability?: string;
  animalType?: string;
  breed?: string;
  age?: string | number;
  healthVaccineStatus?: string;
  serviceType?: string;
  experience?: string;
  mobileService?: boolean;
  vaccinationAvailable?: boolean;
  serviceRadius?: string | number;
  healthCertificate?: boolean;
  availabilityDays?: string[];
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? undefined : n;
}

const FORM_LISTING_TYPE_MAP: Record<string, AgricultureListingType> = {
  "Produce": "PRODUCE",
  "LiveStock": "LIVESTOCK",
  "Vet Service": "VET_SERVICE",
};

const SERVICE_TYPE_MAP: Record<string, VetServiceType> = {
  "General Checkup": "GENERAL_CHECKUP",
  "Vaccination": "VACCINATION",
  "Surgery": "SURGERY",
  "Deworming": "DEWORMING",
  "Breeding Consultation": "BREEDING_CONSULTATION",
  "Emergency": "EMERGENCY",
};

const DAY_MAP: Record<string, WeekDay> = {
  Mon: "MON", Tue: "TUE", Wed: "WED", Thu: "THU", Fri: "FRI", Sat: "SAT", Sun: "SUN",
};

export function formToCreateAgriculturePayload(raw: RawAgricultureForm): CreateAgriculturePayload {
  const listingType = FORM_LISTING_TYPE_MAP[raw.listingType ?? ""] ?? "PRODUCE";

  return {
    listingType,
    district: String(raw.district ?? ""),
    village: raw.village || undefined,
    location: String(raw.location ?? ""),
    pricePerUnit: toNumber(raw.price) ?? 0,
    unit: (raw.unit?.toUpperCase() as UnitType) ?? "KG",
    organicCertified: !!raw.organicCertified,
    organicVerified: false,
    seasonalAvailability: raw.seasonalAvailability || undefined,
    animalType: raw.animalType || undefined,
    breed: raw.breed || undefined,
    age: toNumber(raw.age),
    healthVaccineStatus: raw.healthVaccineStatus
      ? (raw.healthVaccineStatus.toUpperCase().replace(" ", "_") as HealthVaccineStatus)
      : undefined,
    vetServiceType: raw.serviceType ? (SERVICE_TYPE_MAP[raw.serviceType] ?? "OTHER") : undefined,
    experienceYears: toNumber(raw.experience),
    mobileService: !!raw.mobileService,
    vaccinationAvailable: !!raw.vaccinationAvailable,
    serviceRadiusKm: toNumber(raw.serviceRadius),
    healthCertificate: !!raw.healthCertificate,
    availabilityDays: raw.availabilityDays?.map((d) => DAY_MAP[d]).filter(Boolean) as WeekDay[] | undefined,
  };
}

const LISTING_TYPE_LABEL: Record<AgricultureListingType, string> = {
  PRODUCE: "Produce",
  LIVESTOCK: "Livestock",
  TOOL: "Tool",
  SEED: "Seed",
  FERTILIZER: "Fertilizer",
  VET_SERVICE: "Vet Service",
  FARM_LABOUR: "Farm Labour",
};

export function toAgricultureCard(listing: AgricultureListing): AgricultureCard {
  const ag = listing.agriculture;
  if (!ag) throw new Error(`Listing ${listing.id} has no agriculture relation`);

  return {
    id: listing.id,
    title: listing.title,
    price: `NPR ${ag.pricePerUnit.toLocaleString("en-IN")}`,
    location: ag.village ? `${ag.village}, ${ag.district}` : ag.district,
    district: ag.district,
    listingType: LISTING_TYPE_LABEL[ag.listingType],
    thumb: listing.images?.[0] ? resolveImage(listing.images[0]) : "/placeholder-item.jpg",
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    isFeatured: listing.isFeatured ?? false,
    organicCertified: ag.organicCertified,
    seasonalAvailability: ag.seasonalAvailability,
    breed: ag.breed,
    age: ag.age,
    healthVaccineStatus: ag.healthVaccineStatus,
  };
}

export function toAgricultureDetail(listing: AgricultureListing): AgricultureDetail {
  const ag = listing.agriculture;
  if (!ag) throw new Error(`Listing ${listing.id} has no agriculture relation`);
  const reviews = listing.reviews ?? [];

  return {
    id: listing.id,
    sellerId: listing.userId,
    listingId: `#AG${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    price: `NPR ${ag.pricePerUnit.toLocaleString("en-IN")} / ${ag.unit}`,
    status: listing.status ?? "ACTIVE",
    negotiable: false,
    location: ag.village ? `${ag.village}, ${ag.district}` : ag.district,
    distanceFrom: "Location not specified",
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    category: "AGRICULTURE",
    breadcrumbs: ["Agriculture & Livestock", LISTING_TYPE_LABEL[ag.listingType], ag.district].filter(Boolean),
    images: resolveImages(listing.images, "/placeholder-item.jpg"),
    description: listing.description ?? "No description provided.",
    googleMapsUrl:
      listing.latitude != null && listing.longitude != null
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
        : "https://www.google.com/maps",
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    listingType: LISTING_TYPE_LABEL[ag.listingType],
    district: ag.district,
    village: ag.village ?? "N/A",
    unit: ag.unit,
    organicCertified: ag.organicCertified,
    seasonalAvailability: ag.seasonalAvailability ?? "N/A",
    animalType: ag.animalType ?? "N/A",
    breed: ag.breed ?? "N/A",
    age: ag.age != null ? String(ag.age) : "N/A",
    healthVaccineStatus: ag.healthVaccineStatus ?? "N/A",
    vetServiceType: ag.vetServiceType ?? "N/A",
    experienceYears: ag.experienceYears != null ? String(ag.experienceYears) : "N/A",
    mobileService: ag.mobileService ?? false,
    vaccinationAvailable: ag.vaccinationAvailable ?? false,
    serviceRadiusKm: ag.serviceRadiusKm != null ? String(ag.serviceRadiusKm) : "N/A",
    healthCertificate: ag.healthCertificate ?? false,
    availabilityDays: ag.availabilityDays ?? [],
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