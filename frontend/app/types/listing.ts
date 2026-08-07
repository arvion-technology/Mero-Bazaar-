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

export type TradesDetail = {
  id: string;
  sellerId: string;
  listingId: string;
  title: string;
  calloutCharge: string;
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  location: string;
  distanceFrom: string;
  postedDaysAgo: number;
  isVerified: boolean;
  category: "TRADES";
  breadcrumbs: string[];
  images: string[];
  description: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  serviceAreaKm: number;
  skillTags: string[];
  warrantyGiven: boolean;
  emergencyAvailable: boolean;
  avgResponseTime: string;
  city: string;
  ward: string;
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

export type AgricultureDetail = {
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
  category: "AGRICULTURE";
  breadcrumbs: string[];
  images: string[];
  description: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  listingType: string;
  district: string;
  village: string;
  unit: string;
  organicCertified: boolean;
  seasonalAvailability: string;
  animalType: string;
  breed: string;
  age: string;
  healthVaccineStatus: string;
  vetServiceType: string;
  experienceYears: string;
  mobileService: boolean;
  vaccinationAvailable: boolean;
  serviceRadiusKm: string;
  healthCertificate: boolean;
  availabilityDays: string[];
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


export type FoodDetail = {
  id: string;
  sellerId: string;
  listingId: string;
  title: string;
  price: string;
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  negotiable: boolean;
  postedDaysAgo: number;
  isVerified: boolean;
  category: "FOODS";
  breadcrumbs: string[];
  images: string[];
  description: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  foodType: string;
  priceUnit: string;
  deliveryDays: string[];
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

export type MedicalDetail = {
  id: string;
  sellerId: string;
  listingId: string;
  title: string;
  price: string; // appointment fee, formatted
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  location: string;
  distanceFrom: string;
  postedDaysAgo: number;
  isVerified: boolean;
  category: "MEDICAL";
  breadcrumbs: string[];
  images: string[];
  description: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  serviceType: string;
  servicesOffered: string[];
  doctorName: string;
  nmcLicenseNumber: string;
  homeVisitAvailable: boolean;
  onlineAppointments: boolean;
  clinicAddress: string;
  city: string;
  shortBio: string;
  languages: string[];
  experience: string;
  sameDayBooking: boolean;
  slots: { id: string; day: string; startTime: string; endTime: string; isBooked: boolean }[];
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

export type BeautyDetail = {
  id: string;
  sellerId: string;
  listingId: string;
  title: string;
  price: string;
  status: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  location: string;
  postedDaysAgo: number;
  isVerified: boolean;
  category: "BEAUTY";
  breadcrumbs: string[];
  images: string[];
  description: string;
  serviceType: string;
  shortDescription: string;
  detailedDescription: string;
  serviceLocationType: string;
  studioLocation: string;
  duration: string;
  homeVisit: boolean;
  priceStartingFrom: boolean;
  whoIsThisFor: string;
  genderPreference: string;
  experienceLevel: string;
  preparationTime: string;
  tags: string[];
  bridalAvailable: boolean;
  city: string;
  rating: number;
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