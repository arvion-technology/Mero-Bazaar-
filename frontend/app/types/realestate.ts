export const PROPERTY_TYPES = ["Apartment", "House", "Room", "Flat", "Villa", "Office Space", "Shop"];
export const LISTING_TYPES = ["Rent", "Sale"];
export const CITIES = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan"];
export const AMENITIES = ["furnished", "parking", "wifi", "water", "electricity", "pet"];

export interface RealEstateListing {
  id: string;
  title: string;
  category: "REALESTATE";
  description?: string;
  createdAt: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
  images?: string[];

  realEstate: {
    propertyType: string;
    listingType: "Rent" | "Sale";
    city: string;
    area: string;
    ward: string;
    address?: string;
    rentMin: number;
    rentMax: number;
    bedrooms: number;
    bathrooms: number;
    sqft?: number;
    availableFrom?: string;
    amenities: Record<string, boolean>;
    ownerType: "owner" | "agent";
    noBroker: boolean;
    landmarks?: string[];
    houseRules?: string[];
  };

  user?: {
    name?: string;
    isVerified?: boolean;
    vendorProfile?: {
      businessName?: string;
      rating?: number;
      website?: string;
    };
  };
}

export interface RealEstateCard {
  id: string;
  title: string;
  price: string;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  thumb: string;
  category: string;
  postedDaysAgo: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}