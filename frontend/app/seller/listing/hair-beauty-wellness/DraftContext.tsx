"use client";

import { createContext, useContext } from "react";

export type ServiceCategory = "Beauty" | "Hair" | "Wellness";

export interface ServiceData {
  serviceTitle: string;
  shortDescription: string;
  detailedDescription: string;
  price: string;
  serviceType: string;
  studioLocation: string;
  duration: string;
  mobileService: boolean;

  whoIsThisFor: string;
  genderPreference: string;
  experienceLevel: string;
  preparationTime: string;
  tags: string[];
}

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
}

export interface DraftContextType {
  category: ServiceCategory;
  setCategory: (c: ServiceCategory) => void;
  data: ServiceData;
  setData: (d: ServiceData) => void;
  setField: <K extends keyof ServiceData>(key: K, value: ServiceData[K]) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

export const emptyData: ServiceData = {
  serviceTitle: "",
  shortDescription: "",
  detailedDescription: "",
  price: "",
  serviceType: "",
  studioLocation: "",
  duration: "",
  mobileService: false,
  whoIsThisFor: "",
  genderPreference: "",
  experienceLevel: "",
  preparationTime: "",
  tags: [],
};

export const defaultsByCategory: Record<ServiceCategory, ServiceData> = {
  Beauty: { ...emptyData },
  Hair: {
    ...emptyData,
    serviceTitle: "Haircut & Styling",
    price: "1800",
    serviceType: "At Salon",
    duration: "45 Minutes",
    whoIsThisFor: "Women",
    genderPreference: "Female",
    experienceLevel: "5+ Years",
    preparationTime: "15 minutes",
  },
  Wellness: {
    ...emptyData,
    serviceTitle: "Relaxation Massage Therapy",
    price: "3500",
    serviceType: "At studio",
    duration: "120 Minutes",
    whoIsThisFor: "Women",
    genderPreference: "Female",
    experienceLevel: "5+ Years",
    preparationTime: "60 minutes",
  },
};

export const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within HairBeautyWellnessLayout");
  return ctx;
}