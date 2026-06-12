export type VehicleType    = "bike" | "scooter" | "car" | "ev" | "truck" | "spare_parts";
export type VehicleCondition = "new" | "used" | "refurb";
export type BluebookStatus = "verified" | "pending" | "none";
export type FuelType       = "petrol" | "diesel" | "electric" | "hybrid";
export type VehicleDetails = Record<string, unknown>; 

export type DBListing = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  createdAt: Date;
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
    _count?: { listings: number };
  };
  reviews: { rating: number }[];
};

export type ListingDetail = {
  id: string;
  listingId: string;
  title: string;
  price: string;
  negotiable: boolean;
  location: string;
  distanceFrom: string;
  postedDaysAgo: number;
  driven: string;
  isVerified: boolean;
  category: string;
  breadcrumbs: string[];
  images: string[];
  description: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
 
  specs: {
    make: string;
    model: string;
    year: string;
    fuel: string;
    transmission: string;
    driven: string;
  };
  details: VehicleDetails;
  vehicleType: VehicleType | null;
  
  seller: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    isPro: boolean;
    isTrusted: boolean;
    memberSince: string;
    totalListing: number;
    responseRate: string;
    avgResponseTime: string;
    phone: string;
  };
};

export type RelatedListing = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  verified: boolean;
};

export type Vehicle = NonNullable<DBListing["vehicle"]>;