export type ListingDetail = {
  id: string;
  sellerId: string;
  listingId: string;
  title: string;
  price: string;
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  negotiable: boolean;
  location: string;
  distanceFrom: string;
  postedDaysAgo: number;
  driven: string;
  isVerified: boolean;
  category: "VEHICLE";
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
  details: import("./vehicle").VehicleDetails;
  vehicleType: import("./vehicle").VehicleType | null;
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

export type JobDetail = {
  id: string;
  jobId: string;
  title: string;
  salary: string;
  location: string;
  distanceFrom: string;
  type: string;
  postedDaysAgo: number;
  postedDate: string;
  breadcrumbs: string[];
  images: string[];
  description: string;
  lat: number | null;
  lng: number | null;
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

export type RealEstateDetail = {
  id: string;
  sellerId: string;
  listingId: string;
  title: string;
  price: string;
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  negotiable: boolean;
  location: string;
  distanceFrom: string;
  postedDaysAgo: number;
  isVerified: boolean;
  category: string;
  breadcrumbs: string[];
  images: string[];
  description: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  specs: {
    propertyType: string;
    listingType: string;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
  };
  amenities: Record<string, boolean>;
  landmarks: string[];
  houseRules: string[];
  ownerType: string;
  noBroker: boolean;
  availableFrom: string;
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

export type SecondhandDetail = {
  id: string;
  sellerId: string;
  listingId: string;
  title: string;
  price: string;
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  negotiable: boolean;
  location: string;
  distanceFrom: string;
  postedDaysAgo: number;
  isVerified: boolean;
  category: "SECONDHAND";
  breadcrumbs: string[];
  images: string[];
  description: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  condition: string;
  isNegotiable: boolean;
  city: string;
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