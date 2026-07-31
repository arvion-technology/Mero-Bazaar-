"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

export interface MedicalData {
  // Service Information
  serviceTitle: string;
  servicesOffered: string;
  doctorName: string;
  licenseNumber: string;
  appointmentFee: string;
  homeVisit: boolean;
  onlineAppointments: boolean;

  // Clinic Information
  clinicAddress: string;
  city: string;

  // Additional Information
  shortBio: string;
  languages: string[];
  experience: string;

  // Availability step
  selectedDays: string[];
  slots: Record<string, TimeSlot[]>;
  slotDuration: string;
  bufferTime: string;
  sameDayBooking: boolean;
}

export interface MedicalImageItem {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
}

interface DraftContextType {
  medicalData: MedicalData;
  setMedicalData: (d: MedicalData) => void;
  images: MedicalImageItem[];
  setImages: (i: MedicalImageItem[]) => void;
}

export const defaultMedicalData: MedicalData = {
  serviceTitle: "General Medicine",
  servicesOffered: "",
  doctorName: "",
  licenseNumber: "",
  appointmentFee: "",
  homeVisit: true,
  onlineAppointments: false,

  clinicAddress: "",
  city: "Kathmandu",

  shortBio: "",
  languages: ["English", "Nepali", "Hindi"],
  experience: "7+ Years",

  selectedDays: ["MON", "TUE", "WED", "THU", "FRI"],
  slots: {
    MON: [
      { id: "1", start: "", end: "" },
      { id: "2", start: "", end: "" },
    ],
    TUE: [{ id: "3", start: "", end: "" }],
    WED: [{ id: "4", start: "", end: "" }],
    THU: [{ id: "5", start: "", end: "" }],
    FRI: [{ id: "6", start: "", end: "" }],
  },
  slotDuration: "",
  bufferTime: "10 minutes",
  sameDayBooking: false,
};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within medical-dental listing layout");
  return ctx;
}

export default function MedicalListingLayout({ children }: { children: ReactNode }) {
  const [medicalData, setMedicalData] = useState<MedicalData>(defaultMedicalData);
  const [images, setImages] = useState<MedicalImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ medicalData, setMedicalData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}