export type VehicleType    = "bike" | "scooter" | "car" | "ev" | "truck" | "spare_parts";
export type VehicleCondition = "new" | "used" | "refurb";
export type BluebookStatus = "verified" | "pending" | "none";
export type FuelType       = "petrol" | "diesel" | "electric" | "hybrid";
export type VehicleDetails = Record<string, unknown>; 

export type DBListing = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string;
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

export type ListingDetail = {
  id: string;
  sellerId: string;
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
    reviews: {
    reviewerName: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  }[];
};

export type RelatedListing = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  verified: boolean;
};

//seller public profile
export type SellerProfile = {
  id: string;
  name: string | null;
  avatar: string | null;
  isVerified: boolean;
  memberSince: string;
  business: {
    name: string;
    type: string;
    description: string | null;
    address: string | null;
    isVerified: boolean;
  } | null;
  rating: number;
  reviewCount: number;
  totalListings: number;
};

export type SellerReview = {
  id: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
  listingId: string;
  listingTitle: string;
};

export type SellerListingCard = {
  id: string;
  title: string;
  price: number | null;
  images: string[];
  category: string;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type Vehicle = NonNullable<DBListing["vehicle"]>;

//jobs category
export type Job = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  district: string;
  type: string;
  thumb: string;
  skills: string[];
  category: string;
  minSalary: number;
  postedDaysAgo: number;
};
export type JobDetail = {
  id: string;
  jobId: string;
  title: string;
  salary: string;
  location: string;
  distanceFrom: string;
  type: string;
  postedDaysAgo: number;
  views: number;
  experience: string;
  education: string;
  vacancies: number;
  postedDate: string;
  isVerified: boolean;
  isFeatured: boolean;
  breadcrumbs: string[];
  images: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  lat: number;
  lng: number;
  company: {
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
    industry: string;
    size: string;
    website: string;
    location: string;
  };
  postedBy: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
};