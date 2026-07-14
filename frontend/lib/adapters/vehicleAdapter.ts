import type { DBListing, FuelType, VehicleType, ListingDetail } from "@/app/types/listing";

//Label maps
export const FUEL_LABEL: Record<FuelType, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
};

export const TYPE_LABEL: Record<VehicleType, string> = {
  bike: "Bikes",
  scooter: "Scooters",
  car: "Cars",
  ev: "EVs",
  truck: "Trucks",
  spare_parts: "Spare Parts",
};

//Helpers
export function formatPrice(p: number | null): string {
  if (p == null) return "Price on request";
  return `Rs. ${p.toLocaleString("en-IN")}`;
}

//Main adapter
export function adaptListing(db: DBListing): ListingDetail {
  const v = db.vehicle ?? null;

  // SAFE FALLBACKS
  const reviews = db.reviews ?? [];
  const user = db.user ?? {
    name: "Unknown",
    image: "/placeholder-avatar.png",
    createdAt: new Date(0),
    _count: { listings: 0 },
  };

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

  const postedDaysAgo = Math.floor(
    (Date.now() - new Date(db.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const memberSince = new Date(user.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );

  const googleMapsUrl =
    db.latitude && db.longitude
      ? `https://www.google.com/maps?q=${db.latitude},${db.longitude}`
      : "https://www.google.com/maps";

  const categoryLabel = v ? TYPE_LABEL[v.type] : "Vehicles";
  const IMG_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  return {
    id: db.id,
    listingId: `#VH${db.id.slice(-6).toUpperCase()}`,
    title: db.title,
    price: formatPrice(db.price),

    negotiable: true,
    location: "Nepal",

    distanceFrom:
      db.latitude && db.longitude
        ? `${db.latitude.toFixed(4)}°N, ${db.longitude.toFixed(4)}°E`
        : "Location not specified",

    postedDaysAgo,

    driven: v ? `${v.km_driven.toLocaleString()} km` : "N/A",
    isVerified: v?.bluebook_status === "verified",
    category: db.category ?? null,

    breadcrumbs: ["Vehicles", categoryLabel, v?.brand ?? ""].filter(Boolean),

    images: db.images?.length
      ? db.images.map((img) => `${IMG_BASE}${img}`)
      : ["/placeholder.png"],

    description: db.description ?? "No description provided.",
    googleMapsUrl,
    latitude: db.latitude,
    longitude: db.longitude,

    specs: {
      make: v?.brand ?? "N/A",
      model: v?.model ?? "N/A",
      year: v?.year?.toString() ?? "N/A",
      fuel: v?.fuel_type ? FUEL_LABEL[v.fuel_type] : "N/A",
      transmission: "N/A",
      driven: v ? `${v.km_driven.toLocaleString()} km` : "N/A",
    },

    details: v?.details ?? {},
    vehicleType: v?.type ?? null,

    seller: {
      name: user.name,
      avatar: user.image
        ? user.image.startsWith("http")
          ? user.image
          : `${IMG_BASE}${user.image}`
        : "/placeholder-avatar.png",
      rating: avgRating,
      reviewCount: reviews.length,
      isVerified: true,
      isPro: db.user?.isPro ?? false,
      isTrusted: db.user?.isTrusted ?? false,
      memberSince,
      totalListing: user._count?.listings ?? 0,
      responseRate: db.user?.responseRate ?? "N/A",
      avgResponseTime: db.user?.avgResponseTime ?? "N/A",
      phone: db.user?.phone ?? "N/A",
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

