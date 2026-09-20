export type FeaturedCard = {
  listing: {
    id: string;
    title: string;
    price: number | null;
    category:
      | 'VEHICLE' | 'JOB' | 'MEDICAL' | 'TRADES' | 'RENTAL'
      | 'AGRICULTURE' | 'SECONDHAND' | 'FOODS' | 'BEAUTY';
    location: string | null;
    images: string[];
    createdAt: string;
    user: { id: string; name: string | null; isVerified: boolean };
    vehicle: { year: number; km_driven: number; condition: string } | null;
    job: { salaryMin: number; salaryMax: number; payPeriod: string; contractType: string; city: string } | null;
    rental: { monthlyRent: number; bedrooms: number | null; bathrooms: number | null; listingType: string; city: string } | null;
    medical: { appointmentFee: number; serviceType: string; city: string } | null;
    trades: { calloutCharge: number; city: string; emergencyAvailable: boolean } | null;
    beauty: { price: number; priceStartingFrom: boolean; serviceType: string; city: string } | null;
    foods: { price: number; priceUnit: string; foodType: string } | null;
    agriculture: { pricePerUnit: number; unit: string; district: string } | null;
    secondhand: { price: number; condition: string; city: string; isNegotiable: boolean } | null;
  };
  isPromoted: boolean;
  tier: 'PLATINUM' | 'GOLD' | 'STANDARD' | null;
  placementId: string | null;
};