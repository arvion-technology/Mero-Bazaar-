"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AgricultureData {
  title: string;
  price: string;
  description: string;
  listingType: string;
  district: string;
  village: string;
  location: string;
  unit: string;
  organicCertified: boolean;
  organicVerified: boolean;
  seasonalAvailability: string;
  animalType: string;
  age: string;
  breed: string;
  healthStatus: string;
}

interface ImageItem {
  file: File;
  preview: string;
}

interface DraftContextType {
  agricultureData: AgricultureData;
  setAgricultureData: (d: AgricultureData) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

const defaultAgricultureData: AgricultureData = {
  title: "",
  price: "",
  description: "",
  listingType: "produce",
  district: "Kathmandu",
  village: "",
  location: "",
  unit: "KG",
  organicCertified: false,
  organicVerified: false,
  seasonalAvailability: "March - June",
  animalType: "",
  age: "2 Years",
  breed: "Jersey",
  healthStatus: "VACCINATED",
};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within agriculture listing layout");
  return ctx;
}

export default function AgricultureListingLayout({ children }: { children: ReactNode }) {
  const [agricultureData, setAgricultureData] = useState<AgricultureData>(defaultAgricultureData);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ agricultureData, setAgricultureData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}