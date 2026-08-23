import type { BuyProduct, BuyCard, BuySeller, BuyReview } from "@/app/types/buy";
import { resolveImage, resolveImages, daysAgo } from "./adapters/shared";

type ListingCategory =
  | "VEHICLE" | "JOB" | "MEDICAL" | "TRADES" | "RENTAL"
  | "AGRICULTURE" | "SECONDHAND" | "FOODS" | "BEAUTY";

export const CATEGORY_LABEL: Record<ListingCategory, string> = {
  VEHICLE: "Vehicles",
  JOB: "Jobs",
  MEDICAL: "Medical & Dental",
  TRADES: "Trades & Home Repair",
  RENTAL: "Real Estate & Rental",
  AGRICULTURE: "Agriculture & Livestock",
  SECONDHAND: "Secondhand Goods",
  FOODS: "Food & Home Delivery",
  BEAUTY: "Hair, Beauty & Wellness",
};

const BADGE_COLOR: Partial<Record<ListingCategory, string>> = {
  VEHICLE: "#e11d48",
  JOB: "#2563eb",
  MEDICAL: "#059669",
  TRADES: "#d97706",
  RENTAL: "#7c3aed",
  AGRICULTURE: "#65a30d",
  SECONDHAND: "#0891b2",
  FOODS: "#ea580c",
  BEAUTY: "#db2777",
};

function formatNPR(n: number | null | undefined): string {
  if (n == null) return "Price on request";
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

export interface RawListing {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  price?: number | null;
  category: ListingCategory;
  images: string[];
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
  createdAt: string;

  vehicle?: { type: string; brand: string; model: string; year: number; km_driven: number; condition: string; bluebook_status: string } | null;
  job?: { role: string; salaryMin: number; salaryMax: number; payPeriod: string; city: string; contractType: string } | null;
  medical?: { serviceType: string; appointmentFee: number; city: string; verificationStatus: string; doctorName: string } | null;
  trades?: { skillTags: string[]; calloutCharge: number; city: string; warrantyGiven: boolean; emergencyAvailable: boolean } | null;
  rental?: { propertyType: string; listingType: string; monthlyRent: number; city: string; bedrooms?: number | null; furnished: boolean } | null;
  agriculture?: { listingType: string; pricePerUnit: number; unit: string; district: string; organicCertified: boolean } | null;
  secondhand?: { itemName: string; price: number; condition: string; isNegotiable: boolean; city: string } | null;
  foods?: { foodType: string; price: number; priceUnit: string; deliveryDays: string[] } | null;
  beauty?: { serviceType: string; price: number; homeVisit: boolean; city: string; rating: number } | null;

  user?: { name?: string | null; phone?: string | null; image?: string | null; createdAt?: string; isVerified?: boolean } | null;
  sellerRating?: number;
  sellerReviewCount?: number;
  sellerTotalListing?: number;

  reviews?: { rating: number; comment?: string | null; reviewerName?: string | null; createdAt?: string }[];
}

function extractCategoryFields(l: RawListing) {
  switch (l.category) {
    case "VEHICLE": {
      const v = l.vehicle!;
      return {
        price: l.price ?? 0,
        priceDisplay: formatNPR(l.price),
        condition: v.condition === "used" || v.condition === "refurb" ? "used" as const : "new" as const,
        negotiable: true,
        deliveryAvailable: false,
        warrantyAvailable: false,
        badge: v.bluebook_status === "verified" ? "Verified" : null,
        details: [
          { label: "Brand", value: v.brand },
          { label: "Model", value: v.model },
          { label: "Year", value: String(v.year) },
          { label: "Driven", value: `${v.km_driven.toLocaleString()} km` },
        ],
      };
    }
    case "JOB": {
      const j = l.job!;
      return {
        price: j.salaryMax,
        priceDisplay: `Rs. ${j.salaryMin.toLocaleString()} - ${j.salaryMax.toLocaleString()} / ${j.payPeriod.toLowerCase()}`,
        condition: "new" as const,
        negotiable: false,
        deliveryAvailable: false,
        warrantyAvailable: false,
        badge: j.contractType,
        details: [
          { label: "Role", value: j.role },
          { label: "City", value: j.city },
          { label: "Type", value: j.contractType },
        ],
      };
    }
    case "MEDICAL": {
      const m = l.medical!;
      return {
        price: m.appointmentFee,
        priceDisplay: `${formatNPR(m.appointmentFee)} / visit`,
        condition: "new" as const,
        negotiable: false,
        deliveryAvailable: false,
        warrantyAvailable: false,
        badge: m.verificationStatus === "VERIFIED" ? "Verified" : null,
        details: [
          { label: "Doctor", value: m.doctorName },
          { label: "Service", value: m.serviceType },
          { label: "City", value: m.city },
        ],
      };
    }
    case "TRADES": {
      const t = l.trades!;
      return {
        price: t.calloutCharge,
        priceDisplay: `${formatNPR(t.calloutCharge)} callout`,
        condition: "new" as const,
        negotiable: false,
        deliveryAvailable: false,
        warrantyAvailable: t.warrantyGiven,
        badge: t.emergencyAvailable ? "Emergency Available" : null,
        details: [
          { label: "City", value: t.city },
          { label: "Skills", value: t.skillTags.join(", ") },
        ],
      };
    }
    case "RENTAL": {
      const r = l.rental!;
      return {
        price: r.monthlyRent,
        priceDisplay: `${formatNPR(r.monthlyRent)} / month`,
        condition: "new" as const,
        negotiable: false,
        deliveryAvailable: false,
        warrantyAvailable: false,
        badge: r.listingType,
        details: [
          { label: "Type", value: r.propertyType },
          { label: "City", value: r.city },
          ...(r.bedrooms != null ? [{ label: "Bedrooms", value: String(r.bedrooms) }] : []),
        ],
      };
    }
    case "AGRICULTURE": {
      const a = l.agriculture!;
      return {
        price: a.pricePerUnit,
        priceDisplay: `${formatNPR(a.pricePerUnit)} / ${a.unit.toLowerCase()}`,
        condition: "new" as const,
        negotiable: false,
        deliveryAvailable: false,
        warrantyAvailable: false,
        badge: a.organicCertified ? "Organic Certified" : null,
        details: [
          { label: "District", value: a.district },
          { label: "Type", value: a.listingType },
        ],
      };
    }
    case "SECONDHAND": {
      const s = l.secondhand!;
      return {
        price: s.price,
        priceDisplay: formatNPR(s.price),
        condition: s.condition === "LIKE_NEW" ? "new" as const : "used" as const,
        negotiable: s.isNegotiable,
        deliveryAvailable: false,
        warrantyAvailable: false,
        badge: s.condition === "LIKE_NEW" ? "Like New" : null,
        details: [
          { label: "Item", value: s.itemName },
          { label: "Condition", value: s.condition },
          { label: "City", value: s.city },
        ],
      };
    }
    case "FOODS": {
      const f = l.foods!;
      return {
        price: f.price,
        priceDisplay: `${formatNPR(f.price)} / ${f.priceUnit.replace("PER_", "").toLowerCase()}`,
        condition: "new" as const,
        negotiable: false,
        deliveryAvailable: f.deliveryDays.length > 0,
        warrantyAvailable: false,
        badge: f.foodType,
        details: [
          { label: "Type", value: f.foodType },
          { label: "Delivery Days", value: f.deliveryDays.join(", ") },
        ],
      };
    }
    case "BEAUTY": {
      const b = l.beauty!;
      return {
        price: b.price,
        priceDisplay: formatNPR(b.price),
        condition: "new" as const,
        negotiable: false,
        deliveryAvailable: false,
        warrantyAvailable: false,
        badge: b.homeVisit ? "Home Visit Available" : null,
        details: [
          { label: "Service", value: b.serviceType },
          { label: "City", value: b.city },
        ],
      };
    }
  }
}

export function toBuyCard(l: RawListing): BuyCard {
  const fields = extractCategoryFields(l);
  return {
    id: l.id,
    title: l.title,
    thumb: l.images?.[0] ? resolveImage(l.images[0]) : "/placeholder-item.jpg",
    price: fields.price,
    priceDisplay: fields.priceDisplay,
    location: l.medical?.city ?? l.trades?.city ?? l.rental?.city ?? l.agriculture?.district ?? l.secondhand?.city ?? l.job?.city ?? l.beauty?.city ?? "Nepal",
    timeAgo: `${daysAgo(l.createdAt)}d ago`,
    badge: fields.badge,
    badgeColor: BADGE_COLOR[l.category] ?? "#6b7280",
    category: l.category,
    condition: fields.condition,
    seller: {
      id: l.userId,
      name: l.user?.name ?? "Unknown Seller",
      rating: l.sellerRating ?? 0,
    },
  };
}

export function toBuyDetail(l: RawListing): BuyProduct {
  const fields = extractCategoryFields(l);
  const reviews = l.reviews ?? [];

  const seller: BuySeller = {
    id: l.userId,
    name: l.user?.name ?? "Unknown Seller",
    avatar: l.user?.image ? resolveImage(l.user.image) : null,
    phone: l.user?.phone ?? "N/A",
    memberSince: l.user?.createdAt
      ? new Date(l.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "N/A",
    rating: l.sellerRating ?? 0,
    reviewCount: l.sellerReviewCount ?? reviews.length,
    isVerified: l.user?.isVerified ?? false,
    totalListing: l.sellerTotalListing ?? 0,
  };

  const mappedReviews: BuyReview[] = reviews.map((r) => ({
    reviewerName: r.reviewerName ?? "Anonymous",
    rating: r.rating,
    comment: r.comment ?? "",
    createdAt: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "N/A",
  }));

  return {
    id: l.id,
    title: l.title,
    thumb: l.images?.[0] ? resolveImage(l.images[0]) : "/placeholder-item.jpg",
    images: resolveImages(l.images, "/placeholder-item.jpg"),
    category: l.category,
    condition: fields.condition,
    price: fields.price,
    priceDisplay: fields.priceDisplay,
    location: l.medical?.city ?? l.trades?.city ?? l.rental?.city ?? l.agriculture?.district ?? l.secondhand?.city ?? l.job?.city ?? l.beauty?.city ?? "Nepal",
    timeAgo: `${daysAgo(l.createdAt)}d ago`,
    postedDaysAgo: daysAgo(l.createdAt),
    badge: fields.badge,
    badgeColor: BADGE_COLOR[l.category] ?? "#6b7280",
    description: l.description ?? "No description provided.",
    detailedDescription: l.description ?? undefined,
    seller,
    tags: [CATEGORY_LABEL[l.category]],
    details: fields.details,
    negotiable: fields.negotiable,
    deliveryAvailable: fields.deliveryAvailable,
    warrantyAvailable: fields.warrantyAvailable,
    reviews: mappedReviews,
  };
}