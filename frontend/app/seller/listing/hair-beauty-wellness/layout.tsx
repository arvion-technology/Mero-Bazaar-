"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

interface DraftContextType {
  category: ServiceCategory;
  setCategory: (c: ServiceCategory) => void;
  data: ServiceData;
  setData: (d: ServiceData) => void;
  setField: <K extends keyof ServiceData>(key: K, value: ServiceData[K]) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

const emptyData: ServiceData = {
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

const defaultsByCategory: Record<ServiceCategory, ServiceData> = {
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

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within HairBeautyWellnessLayout");
  return ctx;
}

export default function HairBeautyWellnessLayout({ children }: { children: ReactNode }) {
  const [category, setCategoryState] = useState<ServiceCategory>("Beauty");
  const [data, setData] = useState<ServiceData>(defaultsByCategory.Beauty);
  const [images, setImages] = useState<ImageItem[]>([]);

  const setField = <K extends keyof ServiceData>(key: K, value: ServiceData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const setCategory = (c: ServiceCategory) => {
    setCategoryState(c);
    setData(defaultsByCategory[c]);
    setImages([]);
  };

  return (
    <DraftContext.Provider
      value={{ category, setCategory, data, setData, setField, images, setImages }}
    >
      {children}
    </DraftContext.Provider>
  );
}
