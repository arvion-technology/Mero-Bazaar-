import type { FoodDetail } from "@/app/types/listing";
import type {
  CreateFoodsPayload,
  FoodType,
  PriceUnit,
  WeekDay,
  FoodsCard,
  FoodsListing,
} from "@/app/types/foods";
import { resolveImage, resolveImages, daysAgo } from "./shared";

interface RawFoodsForm {
  title?: string;
  foodType?: string;
  description?: string;
  price?: string | number;
  priceUnit?: string;
  deliveryDays?: string[];
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? undefined : n;
}

const FOOD_TYPE_MAP: Record<string, FoodType> = {
  TIFFIN: "TIFFIN",
  BAKERY: "BAKERY",
  DAIRY: "DAIRY",
  MEAT: "MEAT",
  ORGANIC: "ORGANIC",
  HOME_COOK: "HOME_COOK",
  WHOLESALE: "WHOLESALE",
};

const PRICE_UNIT_MAP: Record<string, PriceUnit> = {
  PER_MEAL: "PER_MEAL",
  PER_KG: "PER_KG",
  PER_LITRE: "PER_LITRE",
  PER_PIECE: "PER_PIECE",
};

const DAY_MAP: Record<string, WeekDay> = {
  MON: "MON", TUE: "TUE", WED: "WED", THU: "THU", FRI: "FRI", SAT: "SAT", SUN: "SUN",
};

export function formToCreateFoodsPayload(raw: RawFoodsForm): CreateFoodsPayload {
  return {
    title: raw.title?.trim() ?? "",
    description: raw.description?.trim() ?? "",
    foodType: FOOD_TYPE_MAP[raw.foodType ?? ""] ?? "TIFFIN",
    price: toNumber(raw.price) ?? 0,
    priceUnit: PRICE_UNIT_MAP[raw.priceUnit ?? ""] ?? "PER_MEAL",
    deliveryDays: raw.deliveryDays?.map((d) => DAY_MAP[d]).filter(Boolean) as WeekDay[] ?? [],
  };
}

export const FOOD_TYPE_LABEL: Record<FoodType, string> = {
  TIFFIN: "Tiffin",
  BAKERY: "Bakery",
  DAIRY: "Dairy",
  MEAT: "Meat",
  ORGANIC: "Organic",
  HOME_COOK: "Home Cooked",
  WHOLESALE: "Wholesale",
};

export const PRICE_UNIT_LABEL: Record<PriceUnit, string> = {
  PER_MEAL: "per meal",
  PER_KG: "per kg",
  PER_LITRE: "per litre",
  PER_PIECE: "per piece",
};

export function toFoodsCard(listing: FoodsListing): FoodsCard {
  const f = listing.foods;
  if (!f) throw new Error(`Listing ${listing.id} has no foods relation`);

  return {
    id: listing.id,
    title: listing.title,
    price: `NPR ${f.price.toLocaleString("en-IN")} / ${PRICE_UNIT_LABEL[f.priceUnit]}`,
    thumb: listing.images?.[0] ? resolveImage(listing.images[0]) : "/placeholder-item.jpg",
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    isFeatured: listing.isFeatured ?? false,
    foodType: FOOD_TYPE_LABEL[f.foodType],
    priceUnit: PRICE_UNIT_LABEL[f.priceUnit],
  };
}

export function toFoodsDetail(listing: FoodsListing): FoodDetail {
  const f = listing.foods;
  if (!f) throw new Error(`Listing ${listing.id} has no foods relation`);
  const reviews = listing.reviews ?? [];

  return {
    id: listing.id,
    sellerId: listing.userId,
    listingId: `#FD${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    price: `NPR ${f.price.toLocaleString("en-IN")} / ${PRICE_UNIT_LABEL[f.priceUnit]}`,
    status: listing.status ?? "ACTIVE",
    negotiable: false,
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: listing.isVerified ?? false,
    category: "FOODS",
    breadcrumbs: ["Food & Home Delivery", FOOD_TYPE_LABEL[f.foodType]].filter(Boolean),
    images: resolveImages(listing.images, "/placeholder-item.jpg"),
    description: listing.description ?? "No description provided.",
    googleMapsUrl:
      listing.latitude != null && listing.longitude != null
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
        : "https://www.google.com/maps",
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    foodType: FOOD_TYPE_LABEL[f.foodType],
    priceUnit: PRICE_UNIT_LABEL[f.priceUnit],
    deliveryDays: f.deliveryDays,
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