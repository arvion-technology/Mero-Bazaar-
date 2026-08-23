export type VehicleType      = "bike" | "scooter" | "car" | "ev" | "truck" | "spare_parts";
export type VehicleCondition = "new" | "used" | "refurb";
export type BluebookStatus   = "verified" | "pending" | "none";
export type FuelType         = "petrol" | "diesel" | "electric" | "hybrid";
export type VehicleDetails   = Record<string, unknown>;

export type DBListing = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  price: number | null;
  category: "VEHICLE";
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  latitude: number | null;
  longitude: number | null;
  images: string[];
  createdAt: Date;
  sellerRating: number;
  sellerReviewCount: number;
  vehicle: {
    type: VehicleType;
    brand: string;
    model: string;
    year: number;
    km_driven: number;
    condition: VehicleCondition;
    bluebook_status: BluebookStatus;
    fuel_type: FuelType | null;
    ownership_transfer_ready: boolean;
    details?: VehicleDetails;
  } | null;
  user: {
    id: string;
    name: string;
    image: string | null;
    createdAt: Date;
    phone?: string | null;
    isPro?: boolean;
    isTrusted?: boolean;
    responseRate?: string | null;
    avgResponseTime?: string | null;
    vendorProfile?: { isVerified: boolean } | null;
    _count?: { listings: number };
  };
  reviews: {
    rating: number;
    comment?: string | null;
    reviewerName?: string | null;
    createdAt?: Date;
  }[];
};

export type Vehicle = NonNullable<DBListing["vehicle"]>;