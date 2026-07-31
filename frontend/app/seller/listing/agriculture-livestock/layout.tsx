"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface AgricultureData {
  listingType: string;
  itemName: string;
  description: string;

  // Location (common)
  district: string;
  village: string;
  location: string;

  // Pricing (common)
  price: string;
  unit: string;
  servicePrice: string;
  priceUnit: string;

  // Produce-specific
  organicCertified: boolean;
  organicVerified: boolean;
  seasonalAvailability: string;

  // LiveStock-specific
  animalType: string;
  age: string;
  breed: string;
  healthVaccineStatus: string;

  // Vet Service-specific
  serviceType: string;
  experience: string;
  mobileService: boolean;
  serviceArea: string;
  serviceRadius: string;
  healthCertificate: boolean;
  vaccinationAvailable: boolean;
  availabilityDays: string[];
}

export interface AgricultureImageItem {
  file: File;
  preview: string;
  isMain: boolean;
}

interface DraftContextType {
  agricultureData: AgricultureData;
  setAgricultureData: (d: AgricultureData) => void;
  images: AgricultureImageItem[];
  setImages: (i: AgricultureImageItem[]) => void;
}

export const defaultAgricultureData: AgricultureData = {
  listingType: "Produce",
  itemName: "",
  description: "",

  district: "",
  village: "",
  location: "",

  price: "",
  unit: "KG",
  servicePrice: "",
  priceUnit: "Per Visit",

  organicCertified: false,
  organicVerified: false,
  seasonalAvailability: "March - June",

  animalType: "",
  age: "3 Years",
  breed: "Jersey",
  healthVaccineStatus: "VACCINATED",

  serviceType: "General Health Checkup",
  experience: "",
  mobileService: true,
  serviceArea: "",
  serviceRadius: "10",
  healthCertificate: true,
  vaccinationAvailable: true,
  availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within agriculture-livestock listing layout");
  return ctx;
}

export default function AgricultureListingLayout({ children }: { children: ReactNode }) {
  const [agricultureData, setAgricultureData] = useState<AgricultureData>(defaultAgricultureData);
  const [images, setImages] = useState<AgricultureImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ agricultureData, setAgricultureData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}