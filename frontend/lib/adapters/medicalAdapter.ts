import type { MedicalDetail } from "@/app/types/listing";
import type {
  CreateMedicalPayload,
  MedicalServiceType,
  WeekDay,
  MedicalCard,
  MedicalListing,
} from "@/app/types/medical";
import { resolveImage, resolveImages, daysAgo } from "./shared";

interface RawMedicalDetailsForm {
  serviceTitle?: string;
  servicesOffered?: string;
  doctorName?: string;
  licenseNumber?: string;
  appointmentFee?: string | number;
  homeVisit?: boolean;
  onlineAppointments?: boolean;
  clinicAddress?: string;
  city?: string;
  shortBio?: string;
  languages?: string[];
  experience?: string;
}

interface RawMedicalAvailabilityForm {
  selectedDays?: string[];
  slots?: Record<string, { start: string; end: string }[]>;
  slotDuration?: string;
  bufferTime?: string;
  sameDayBooking?: boolean;
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? undefined : n;
}

const SERVICE_TYPE_MAP: Record<string, MedicalServiceType> = {
  "General Medicine": "GENERAL_MEDICINE",
  "Dental Care": "DENTAL",
  "Cardiology": "CARDIOLOGY",
  "Dermatology": "DERMATOLOGY",
  "Pediatrics": "PEDIATRICS",
  "Orthopedics": "ORTHOPEDIC",
  "Gynecology": "GYNECOLOGY",
  "Neurology": "NEUROLOGY",
  "ENT": "ENT",
  "Other": "OTHER",
};

export const SERVICE_TYPE_LABEL: Record<MedicalServiceType, string> = {
  GENERAL_MEDICINE: "General Medicine",
  DENTAL: "Dental Care",
  CARDIOLOGY: "Cardiology",
  DERMATOLOGY: "Dermatology",
  PEDIATRICS: "Pediatrics",
  ORTHOPEDIC: "Orthopedics",
  GYNECOLOGY: "Gynecology",
  NEUROLOGY: "Neurology",
  ENT: "ENT",
  OTHER: "Other",
};

function to24Hour(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return time; // already 24h or unparseable — pass through
  let [, h, m, period] = match;
  let hour = parseInt(h, 10);
  if (period) {
    period = period.toUpperCase();
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
  }
  return `${String(hour).padStart(2, "0")}:${m}`;
}

const DAY_MAP: Record<string, WeekDay> = {
  MON: "MON", TUE: "TUE", WED: "WED", THU: "THU", FRI: "FRI", SAT: "SAT", SUN: "SUN",
};

export function draftToCreateMedicalPayload(
  details: RawMedicalDetailsForm,
  availability: RawMedicalAvailabilityForm
): CreateMedicalPayload {
  const availableSlots: CreateMedicalPayload["availableSlots"] = [];
  const selectedDays = availability.selectedDays ?? [];
  const slotsByDay = availability.slots ?? {};

  for (const day of selectedDays) {
    const mappedDay = DAY_MAP[day];
    if (!mappedDay) continue;
    for (const slot of slotsByDay[day] ?? []) {
      if (!slot.start || !slot.end) continue;
      availableSlots.push({
        day: mappedDay,
        startTime: to24Hour(slot.start),
        endTime: to24Hour(slot.end),
      });
    }
  }

  return {
    specialty: SERVICE_TYPE_MAP[details.serviceTitle ?? ""] ?? "GENERAL_MEDICINE",
    servicesOffered: details.servicesOffered?.trim(),
    doctorName: details.doctorName?.trim() ?? "",
    nmcLicenseNumber: details.licenseNumber?.trim() ?? "",
    appointmentFee: toNumber(details.appointmentFee) ?? 0,
    homeVisitAvailable: details.homeVisit ?? false,
    onlineAppointments: details.onlineAppointments ?? false,
    clinicAddress: details.clinicAddress?.trim() ?? "",
    city: details.city?.trim() ?? "",
    shortBio: details.shortBio?.trim(),
    languages: details.languages ?? [],
    experience: details.experience,
    slotDurationMinutes: toNumber(availability.slotDuration),
    bufferMinutes:
      availability.bufferTime === "No buffer"
        ? 0
        : toNumber(availability.bufferTime?.replace(/\D/g, "")),
    sameDayBooking: availability.sameDayBooking ?? false,
    availableSlots,
  };
}

export function toMedicalCard(listing: MedicalListing): MedicalCard {
  const m = listing.medical;
  if (!m) throw new Error(`Listing ${listing.id} has no medical relation`);

  return {
    id: listing.id,
    doctorName: m.doctorName,
    serviceType: SERVICE_TYPE_LABEL[m.serviceType],
    appointmentFee: `NPR ${m.appointmentFee.toLocaleString("en-IN")}`,
    thumb: listing.images?.[0] ? resolveImage(listing.images[0]) : "/placeholder-item.jpg",
    city: m.city,
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: m.verificationStatus === "VERIFIED",
    isFeatured: listing.isFeatured ?? false,
  };
}

export function toMedicalDetail(listing: MedicalListing): MedicalDetail {
  const m = listing.medical;
  if (!m) throw new Error(`Listing ${listing.id} has no medical relation`);
  const reviews = listing.reviews ?? [];

  return {
    id: listing.id,
    sellerId: listing.userId,
    listingId: `#MD${listing.id.slice(-6).toUpperCase()}`,
    title: listing.title,
    price: `NPR ${m.appointmentFee.toLocaleString("en-IN")}`,
    status: listing.status ?? "ACTIVE",
    location: m.city,
    distanceFrom: "N/A",
    postedDaysAgo: daysAgo(listing.createdAt),
    isVerified: m.verificationStatus === "VERIFIED",
    category: "MEDICAL",
    breadcrumbs: ["Medical & Dental", SERVICE_TYPE_LABEL[m.serviceType]].filter(Boolean),
    images: resolveImages(listing.images, "/placeholder-item.jpg"),
    description: listing.description ?? "No description provided.",
    googleMapsUrl:
      listing.latitude != null && listing.longitude != null
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
        : "https://www.google.com/maps",
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    serviceType: SERVICE_TYPE_LABEL[m.serviceType],
    servicesOffered: m.servicesOffered
      ? m.servicesOffered.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    doctorName: m.doctorName,
    nmcLicenseNumber: m.nmcLicenseNumber,
    homeVisitAvailable: m.homeVisitAvailable,
    onlineAppointments: m.onlineAppointments,
    clinicAddress: m.clinicAddress,
    city: m.city,
    shortBio: m.shortBio ?? "",
    languages: m.languages,
    experience: m.experience ?? "",
    sameDayBooking: m.sameDayBooking,
    slots: (m.medicalSlots ?? []).map((s) => ({
      id: s.id,
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
      isBooked: s.isBooked,
    })),
    seller: {
      name: listing.user?.name || "Verified Doctor",
      avatar: listing.user?.image ? resolveImage(listing.user.image) : "/placeholder-avatar.png",
      rating: listing.sellerRating ?? 0,
      reviewCount: listing.sellerReviewCount ?? reviews.length,
      isVerified: listing.user?.isVerified ?? false,
      isPro: false,
      isTrusted: false,
      memberSince: listing.user?.createdAt
        ? new Date(listing.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "N/A",
      totalListing: listing.sellerTotalListing ?? 0,
      responseRate: "N/A",
      avgResponseTime: "N/A",
      phone: listing.user?.phone || "N/A",
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
