export type MedicalServiceType =
  | "GENERAL_MEDICINE"
  | "DENTAL"
  | "CARDIOLOGY"
  | "DERMATOLOGY"
  | "PEDIATRICS"
  | "ORTHOPEDIC"
  | "GYNECOLOGY"
  | "NEUROLOGY"
  | "ENT"
  | "OTHER";

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface MedicalSlotInput {
  day: WeekDay;
  start: string;
  end: string;
}

export interface CreateMedicalPayload {
  specialty: MedicalServiceType;
  servicesOffered?: string;
  doctorName: string;
  nmcLicenseNumber: string;
  appointmentFee: number;
  homeVisitAvailable?: boolean;
  onlineAppointments?: boolean;
  clinicAddress: string;
  city: string;
  shortBio?: string;
  languages?: string[];
  experience?: string;
  slotDurationMinutes?: number;
  bufferMinutes?: number;
  sameDayBooking?: boolean;
  availableSlots?: { day: WeekDay; startTime: string; endTime: string }[];
  latitude?: number;
  longitude?: number;
}

export interface MedicalSlot {
  id: string;
  day: WeekDay;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface MedicalListing {
  id: string;
  userId: string;
  title: string;
  category: "MEDICAL";
  description?: string | null;
  createdAt: string;
  images: string[];
  status?: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  isVerified?: boolean;
  isFeatured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  sellerRating?: number;
  sellerReviewCount?: number;
  sellerTotalListing?: number;

  medical: {
    serviceType: MedicalServiceType;
    servicesOffered?: string | null;
    doctorName: string;
    nmcLicenseNumber: string;
    verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
    appointmentFee: number;
    homeVisitAvailable: boolean;
    onlineAppointments: boolean;
    clinicAddress: string;
    city: string;
    shortBio?: string | null;
    languages: string[];
    experience?: string | null;
    slotDurationMinutes?: number | null;
    bufferMinutes?: number | null;
    sameDayBooking: boolean;
    medicalSlots?: MedicalSlot[];
  };

  user?: {
    name?: string | null;
    phone?: string | null;
    image?: string | null;
    createdAt?: string;
    isVerified?: boolean;
  };

  reviews?: {
    rating: number;
    comment?: string | null;
    reviewerName?: string | null;
    createdAt?: string;
  }[];
}

export interface MedicalCard {
  id: string;
  doctorName: string;
  serviceType: string;
  appointmentFee: string;
  thumb: string;
  city: string;
  postedDaysAgo: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}
