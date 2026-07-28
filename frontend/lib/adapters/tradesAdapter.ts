import type { TradesDetail } from "@/app/types/listing";
import type { TradesCard, TradesListing, CreateTradesPayload } from "@/app/types/trades";

export function formatCalloutCharge(charge: number): string {
  return `NPR ${charge.toLocaleString()}`;
}

function formatAvgResponse(hours?: number | null): string {
  if (hours == null) return "N/A";
  if (hours < 1) return `${Math.round(hours * 60)} Minutes`;
  if (hours < 24) return `${hours} Hour${hours !== 1 ? "s" : ""}`;
  if (hours === 24) return "Same Day";
  return "Next Day";
}

export function toTradesCard(listing: TradesListing): TradesCard {
  const trades = listing.trades;
  if (!trades) throw new Error(`Listing ${listing.id} has no trades relation`);

  return {
    id: listing.id,
    title: listing.title,
    calloutCharge: formatCalloutCharge(trades.calloutCharge),
    location: trades.ward ? `${trades.ward}, ${trades.city}` : trades.city,
    district: trades.city,
    serviceAreaKm: trades.serviceAreaKm,
    skillTags: trades.skillTags ?? [],
    thumb: listing.images?.[0] ?? "/trades1.jpg",
    emergencyAvailable: trades.emergencyAvailable,
    warrantyGiven: trades.warrantyGiven,
    postedDaysAgo: Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000),
  };
}

export function toTradesDetail(listing: TradesListing): TradesDetail {
  const trades = listing.trades;
  if (!trades) throw new Error(`Listing ${listing.id} has no trades relation`);

  return {
    id: listing.id,
    sellerId: listing.userId,
    listingId: `#TR${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    calloutCharge: formatCalloutCharge(trades.calloutCharge),
    status: "ACTIVE",
    location: trades.ward ? `${trades.ward}, ${trades.city}` : trades.city,
    distanceFrom: "",
    postedDaysAgo: Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000),
    isVerified: false,
    category: "TRADES",
    breadcrumbs: ["Trades & Home Repair", trades.city],
    images: listing.images?.length ? listing.images : ["/trades1.jpg"],
    description: listing.description ?? "No description provided.",
    googleMapsUrl:
      listing.latitude != null && listing.longitude != null
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
        : "https://www.google.com/maps",
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    serviceAreaKm: trades.serviceAreaKm,
    skillTags: trades.skillTags ?? [],
    warrantyGiven: trades.warrantyGiven,
    emergencyAvailable: trades.emergencyAvailable,
    avgResponseTime: formatAvgResponse(trades.avgResponseHours),
    city: trades.city,
    ward: trades.ward ?? "N/A",
    reviews: listing.reviews ?? [],
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
      avgResponseTime: formatAvgResponse(trades.avgResponseHours),
      phone: listing.user?.phone ?? "N/A",
    },
  };
}

type RawTradesForm = Record<string, unknown> & {
  mapPosition?: [number, number];
};

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
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

function toServiceAreaKm(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return undefined;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

export function formToCreateTradesPayload(raw: RawTradesForm): CreateTradesPayload {
  const [lat, lng] = Array.isArray(raw.mapPosition) ? raw.mapPosition : [undefined, undefined];

  return {
    title: String(raw.serviceTitle ?? ""),
    description: typeof raw.description === "string" && raw.description.trim() !== "" ? raw.description : undefined,
    city: String(raw.city ?? ""),
    ward: typeof raw.ward === "string" && raw.ward.trim() !== "" ? raw.ward : undefined,
    skillTags: toStringArray(raw.skills) ?? [],
    serviceAreaKm: toServiceAreaKm(raw.serviceArea) ?? 0,
    calloutCharge: toNumber(raw.calloutCharge) ?? 0,
    emergencyAvailable: toBool(raw.emergencyService, false),
    warrantyGiven: toBool(raw.warrantyGiven, false),
    latitude: toNumber(lat) ?? toNumber(raw.latitude) ?? 0,
    longitude: toNumber(lng) ?? toNumber(raw.longitude) ?? 0,
  };
}