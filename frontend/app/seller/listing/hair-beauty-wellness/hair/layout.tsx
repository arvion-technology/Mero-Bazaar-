"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface HairData {
  servicetitle: string;
  shortDescription: string;
  detailedDescription: string;
  price: string;
  serviceType: string;
  duration: string;
  mobileService: string;
  whoisthisfor: string;
  genderPreference: string;
  experienceLevel: string;
  preparationTime: string;
  tags: string;
}

export interface ImageItem {
  id: string; 
  file: File;
  preview: string;
  isMain: boolean;
}

interface DraftContextType {
  data: HairData;
  setData: (d: HairData) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

const defaultData: HairData = {
servicetitle : "Haircut & Styling",
shortDescription : "",
detailedDescription : "",
price:"Rs.1800",
serviceType : "At Salon",
duration : "45 minutes",
mobileService: "",
whoisthisfor : "Women",
genderPreference :"Female",
experienceLevel:"5+ Years",
preparationTime :"15 minutes",
tags:"", 

};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within hair listing layout");
  return ctx;
}

export default function HairLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HairData>(defaultData);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ data, setData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}