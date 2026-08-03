"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface BeautyData {
  servicetitle: string;
  shortDescription: string;
  detailedDescription: string;
  price: string;
  serviceType: string; 
  duration: string;
  mobileService: string;

  whoisthisfor: string;
  requiredgenderofProfessional: string;
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
  data: BeautyData;
  setData: (d: BeautyData) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

const defaultData: BeautyData = {
servicetitle : "Relaxation Message Therapy",
shortDescription : "",
detailedDescription : "",
price:"Rs. 3,500",
serviceType : "At Studio",
duration : "120 minutes",
mobileService: "",
whoisthisfor : "Women",
requiredgenderofProfessional:"Female(Preferred)",
genderPreference :"Female",
experienceLevel:"5+ Years",
preparationTime :"60 minutes",
tags:"", 

};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within beauty listing layout");
  return ctx;
}

export default function BeautyLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BeautyData>(defaultData);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ data, setData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}