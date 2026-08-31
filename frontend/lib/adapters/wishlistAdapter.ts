import type {
  WishlistProduct,
  WishlistCard,
  WishlistSeller,
} from "@/app/types/wishlist";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type RawRecord = Record<string, unknown>;

function asRecord(value: unknown): RawRecord {
  return value && typeof value === "object" ? (value as RawRecord) : {};
}

export function prefixImage(path: string | undefined | null): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export function formatPrice(
  price: number | undefined,
  currency?: string
): string {
  if (price == null) return "Price on call";
  return `${currency ?? "NPR"} ${price.toLocaleString("en-IN")}`;
}

export function timeAgo(days?: number | null): string {
  if (days == null) return "";
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  return `Posted ${days} days ago`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* Category routing */
export const CATEGORY_ROUTE_MAP: Record<string, string> = {
  vehicles: "vehicles",
  vehicle: "vehicles",
  car: "vehicles",
  bike: "vehicles",
  motorcycle: "vehicles",
  scooter: "vehicles",
  bicycle: "vehicles",
  van: "vehicles",
  truck: "vehicles",
  bus: "vehicles",
  job: "job",
  jobs: "job",
  career: "job",
  employment: "job",
  hiring: "job",
  labour: "job",
  labor: "job",
  work: "job",
  medical: "medical",
  dental: "medical",
  doctor: "medical",
  health: "medical",
  clinic: "medical",
  hospital: "medical",
  pharmacy: "medical",
  medicine: "medical",
  "trade-and-homerepair": "trade-and-homerepair",
  trade: "trade-and-homerepair",
  homerepair: "trade-and-homerepair",
  "home repair": "trade-and-homerepair",
  repair: "trade-and-homerepair",
  plumber: "trade-and-homerepair",
  electrician: "trade-and-homerepair",
  carpenter: "trade-and-homerepair",
  "ac repair": "trade-and-homerepair",
  painter: "trade-and-homerepair",
  builder: "trade-and-homerepair",
  construction: "trade-and-homerepair",
  maintenance: "trade-and-homerepair",
  "rent-and-real-estate": "rent-and-real-estate",
  property: "rent-and-real-estate",
  rent: "rent-and-real-estate",
  "real estate": "rent-and-real-estate",
  "real-estate": "rent-and-real-estate",
  house: "rent-and-real-estate",
  apartment: "rent-and-real-estate",
  flat: "rent-and-real-estate",
  land: "rent-and-real-estate",
  room: "rent-and-real-estate",
  hostel: "rent-and-real-estate",
  shutter: "rent-and-real-estate",
  office: "rent-and-real-estate",
  "agriculture-and-livestock": "agriculture-and-livestock",
  agriculture: "agriculture-and-livestock",
  livestock: "agriculture-and-livestock",
  farm: "agriculture-and-livestock",
  farming: "agriculture-and-livestock",
  crop: "agriculture-and-livestock",
  dairy: "agriculture-and-livestock",
  animal: "agriculture-and-livestock",
  poultry: "agriculture-and-livestock",
  agri: "agriculture-and-livestock",
  secondhand: "secondhand",
  "secondhand-goods": "secondhand",
  used: "secondhand",
  old: "secondhand",
  "pre-owned": "secondhand",
  "pre owned": "secondhand",
  thrift: "secondhand",
  resale: "secondhand",
  food: "food",
  delivery: "food",
  restaurant: "food",
  kitchen: "food",
  catering: "food",
  grocery: "food",
  tiffin: "food",
  meal: "food",
  beauty: "beauty",
  salon: "beauty",
  spa: "beauty",
  nail: "beauty",
  hair: "beauty",
  makeup: "beauty",
  wellness: "beauty",
  cosmetic: "beauty",
};

export function detectCategoryRoute(category?: string): string | null {
  if (!category) return null;
  const cat = category.toLowerCase();
  for (const [key, route] of Object.entries(CATEGORY_ROUTE_MAP)) {
    if (cat.includes(key)) return route;
  }
  return null;
}

export function getCategoryLabel(route: string | null): string {
  if (!route) return "Products";
  const labels: Record<string, string> = {
    vehicles: "Vehicles",
    job: "Jobs & Labour Hire",
    medical: "Medical & Dental",
    "trade-and-homerepair": "Trades & Home Repair",
    "rent-and-real-estate": "Rent & Real Estate",
    "agriculture-and-livestock": "Agriculture & Livestock",
    secondhand: "Secondhand Goods",
    food: "Food & Home Delivery",
    beauty: "Hair, Beauty & Wellness",
  };
  return labels[route] ?? "Products";
}

export const SPEC_ICON_CONFIG: Record<
  string,
  { key: string; label: string }[]
> = {
  vehicles: [
    { key: "make", label: "Make" },
    { key: "model", label: "Model" },
    { key: "year", label: "Year" },
    { key: "fuelType", label: "Fuel" },
  ],
  "rent-and-real-estate": [
    { key: "bedrooms", label: "Beds" },
    { key: "bathrooms", label: "Baths" },
    { key: "squareFeet", label: "Sq.Ft" },
    { key: "furnished", label: "Furnished" },
  ],
  job: [
    { key: "jobType", label: "Job Type" },
    { key: "experience", label: "Experience" },
    { key: "qualification", label: "Qualification" },
    { key: "salary", label: "Salary" },
  ],
  default: [
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "condition", label: "Condition" },
    { key: "location", label: "Location" },
  ],
};

export function getSpecIcons(
  product: WishlistProduct,
  categoryRoute: string | null
) {
  const config =
    SPEC_ICON_CONFIG[categoryRoute ?? ""] ?? SPEC_ICON_CONFIG.default;
  return config
    .map((c) => {
      let val = product[c.key] ?? product.specs?.[c.key] ?? "";
      if (c.key === "postedDaysAgo" && val != null) val = `${val} days`;
      if (!val && c.key === "location") val = product.location ?? "";
      if (!val && c.key === "category") val = product.category ?? "";
      return { label: c.label, value: String(val) };
    })
    .filter(
      (s) =>
        s.value &&
        s.value !== "undefined" &&
        s.value !== "null" &&
        s.value !== "0 days"
    );
}

/* ─────────────── Normalization ─────────────── */

/**
 * Flatten a seller source that may have nested `user` or `seller` objects.
 * e.g. { user: { _id: "123", name: "John" } } → { _id: "123", name: "John" }
 */
function flattenSellerSource(src: unknown): RawRecord {
  const obj = asRecord(src);
  const nestedRaw = obj.user ?? obj.seller;
  if (nestedRaw && typeof nestedRaw === "object" && !Array.isArray(nestedRaw)) {
    return { ...obj, ...(nestedRaw as RawRecord) };
  }
  return obj;
}

function normalizeSeller(
  sellerSrc: unknown,
  fallbackIds?: RawRecord
): WishlistSeller | undefined {
  if (!sellerSrc || typeof sellerSrc !== "object") return undefined;

  const s = flattenSellerSource(sellerSrc);

  /* robust name extraction */
  const first = (s.firstName ?? s.first_name ?? "") as string;
  const last = (s.lastName ?? s.last_name ?? "") as string;
  const fullNameFromParts = first || last ? `${first} ${last}`.trim() : null;

  const name =
    fullNameFromParts ??
    (s.name as string | undefined) ??
    (s.fullName as string | undefined) ??
    (s.username as string | undefined) ??
    (s.displayName as string | undefined) ??
    (s.shopName as string | undefined) ??
    (s.businessName as string | undefined) ??
    "Seller";

  /* robust id extraction — includes fallbackIds from the parent listing */
  const sellerId =
    s.id ??
    s._id ??
    s.userId ??
    s.user_id ??
    s.sellerId ??
    s.seller_id ??
    s.ownerId ??
    s.owner_id ??
    fallbackIds?.userId ??
    fallbackIds?.user_id ??
    fallbackIds?.sellerId ??
    fallbackIds?.seller_id ??
    fallbackIds?.ownerId ??
    fallbackIds?.owner_id ??
    "";

  /* robust avatar extraction */
  const avatar = (s.avatar ??
    s.image ??
    s.profileImage ??
    s.profile_image ??
    s.photo ??
    s.picture ??
    null) as string | null;

  return {
    id: String(sellerId),
    name: String(name),
    image: avatar,
    avatar,
    phone: String(
      s.phone ?? s.phoneNumber ?? s.mobile ?? s.contactNumber ?? s.contact ?? ""
    ),
    email: String(s.email ?? ""),
    isVerified: Boolean(s.isVerified ?? s.verified ?? s.isKycVerified ?? false),
    isPro: Boolean(s.isPro ?? s.is_pro ?? false),
    isTrusted: Boolean(s.isTrusted ?? s.is_trusted ?? false),
    rating: Number(s.rating ?? s.avgRating ?? s.stars ?? 0),
    reviewCount: Number(
      s.reviewCount ?? s.reviews ?? s.totalReviews ?? s.review_count ?? 0
    ),
    memberSince: String(
      s.memberSince ?? s.createdAt ?? s.joinedAt ?? s.member_since ?? ""
    ),
    totalListings: Number(
      s.totalListings ?? s.listingsCount ?? s.listingCount ?? s.total_listings ?? 0
    ),
    responseRate: (s.responseRate ?? s.response_rate ?? "N/A") as string,
    avgResponseTime: (s.avgResponseTime ?? s.avg_response_time ?? "N/A") as string,
  };
}

export function toWishlistDetail(raw: unknown): WishlistProduct {
  if (!raw || typeof raw !== "object") return raw as WishlistProduct;
  const n: RawRecord = { ...(raw as RawRecord) };

  /* ── Seller normalization ── */
  const sellerSrc = n.seller ?? n.user ?? n.owner ?? n.postedBy ?? n.vendor ?? null;

  if (sellerSrc) {
    // Pass top-level ID fallbacks so normalizeSeller can use them if the nested object lacks an ID
    const fallbackIds: RawRecord = {
      userId: n.userId,
      user_id: n.user_id,
      sellerId: n.sellerId,
      seller_id: n.seller_id,
      ownerId: n.ownerId,
      owner_id: n.owner_id,
    };

    n.seller = normalizeSeller(sellerSrc, fallbackIds);

    // Final safety net: never let seller.id be empty
    const seller = n.seller as WishlistSeller | undefined;
    if (!seller?.id || seller.id === "undefined" || seller.id === "null") {
      // Try one more time with raw top-level fields
      const emergencyId =
        n.userId ??
        n.user_id ??
        n.sellerId ??
        n.seller_id ??
        n.ownerId ??
        n.owner_id ??
        "";
      if (seller) seller.id = String(emergencyId);
    }

    n.sellerId = (n.seller as WishlistSeller | undefined)?.id ?? "";
  }

  /* Location */
  if (!n.location && (n.city || n.area)) {
    n.location = [n.area, n.city].filter(Boolean).join(", ");
  }

  /* Specs / features / tags */
  if (!n.specs && n.details) n.specs = n.details;
  if (!n.specs && n.attributes) n.specs = n.attributes;
  if (!n.features && n.highlights) n.features = n.highlights;
  if (!n.tags && n.keywords) n.tags = n.keywords;
  if (!n.condition && n.itemCondition) n.condition = n.itemCondition;
  if (n.negotiable == null && n.isNegotiable != null)
    n.negotiable = n.isNegotiable;
  if (n.postedDaysAgo == null && n.createdAt) {
    n.postedDaysAgo = Math.floor(
      (Date.now() - new Date(n.createdAt as string).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }

  /* Images */
  if (n.images && Array.isArray(n.images)) {
    n.images = (n.images as unknown[]).map((img) => prefixImage(img as string));
  } else {
    n.images = [prefixImage(n.image as string | undefined)];
  }

  /* ── Reviews normalization ── */
  if (n.reviews && Array.isArray(n.reviews)) {
    n.reviews = (n.reviews as unknown[]).map((rawReview) => {
      const r = asRecord(rawReview);
      const reviewUser = asRecord(r.user);
      return {
        reviewerName:
          (r.reviewerName as string | undefined) ??
          (r.reviewer_name as string | undefined) ??
          (reviewUser.name as string | undefined) ??
          (reviewUser.username as string | undefined) ??
          "Anonymous",
        rating: Number(r.rating ?? r.stars ?? 0),
        comment: (r.comment ?? r.text ?? r.message ?? "") as string,
        createdAt: (r.createdAt ?? r.date ?? "") as string,
      };
    });
  } else {
    n.reviews = [];
  }

  /* ── Build flat details array ── */
  const detailFields = [
    "bodyType",
    "driveType",
    "transmission",
    "seatingCapacity",
    "engineCapacity",
    "exteriorColor",
    "interiorColor",
    "registrationNumber",
    "brand",
    "model",
    "year",
    "mileage",
    "color",
    "warranty",
    "delivery",
    "fuelType",
    "engine",
    "ram",
    "storage",
    "screenSize",
    "material",
    "size",
    "weight",
    "dimensions",
    "propertyType",
    "bedrooms",
    "bathrooms",
    "squareFeet",
    "furnished",
    "listingType",
    "jobType",
    "experience",
    "qualification",
    "salary",
    "employmentType",
    "kmDriven",
    "owner",
    "registrationYear",
    "insurance",
    "seats",
    "transmissionType",
  ];
  const details: { label: string; value: string }[] = [];
  detailFields.forEach((key) => {
    if (n[key] != null && n[key] !== "") {
      details.push({
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase()),
        value: String(n[key]),
      });
    }
  });
  if (n.specs && typeof n.specs === "object") {
    Object.entries(n.specs as RawRecord).forEach(([k, v]) => {
      if (v != null && v !== "" && !detailFields.includes(k)) {
        details.push({
          label: k
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase()),
          value: String(v),
        });
      }
    });
  }
  n.details = details;

  return n as unknown as WishlistProduct;
}

export function toWishlistCard(raw: unknown): WishlistCard {
  const r = asRecord(raw);
  return {
    id: r.id as string,
    title: (r.title as string | undefined) ?? "Untitled",
    price: formatPrice(
      r.price as number | undefined,
      r.currency as string | undefined
    ),
    location: (r.location ?? r.city ?? r.area ?? "") as string,
    image: prefixImage(
      (r.images as string[] | undefined)?.[0] ?? (r.image as string | undefined)
    ),
    category: r.category as string | undefined,
    condition: r.condition as string | undefined,
  };
}
