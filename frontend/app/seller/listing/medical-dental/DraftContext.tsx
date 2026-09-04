"use client";

import { createContext, useContext } from "react";

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

export interface DraftContextType {
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
  homeVisit: false,
  onlineAppointments: false,

  clinicAddress: "",
  city: " ",

  shortBio: "",
  languages: [],

  experience: " ",
  selectedDays: [],
  slots: {
    MON: [
      { id: "1", start: "", end: "" },
    ],
    TUE: [{ id: "2", start: "", end: "" }],
    WED: [{ id: "3", start: "", end: "" }],
    THU: [{ id: "4", start: "", end: "" }],
    FRI: [{ id: "5", start: "", end: "" }],
  },
  slotDuration: " ",
  bufferTime: " ",
  sameDayBooking: false,
};

export const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx)
    throw new Error(
      "useDraft must be used within medical-dental listing layout",
    );
  return ctx;
}