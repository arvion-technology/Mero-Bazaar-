"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface WellnessData {
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
  data: WellnessData;
  setData: (d: WellnessData) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

const defaultData: WellnessData = {
servicetitle : "Relaxation Message Therapy",
shortDescription : "",
detailedDescription : "",
price:"Rs. 3,500",
serviceType : "At Studio",
duration : "120 minutes",
mobileService: "",
whoisthisfor : "Women",
genderPreference :"Female",
experienceLevel:"5+ Years",
preparationTime :"60 minutes",
tags:"", 

};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within Wellness listing layout");
  return ctx;
}

export default function WellnessLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WellnessData>(defaultData);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ data, setData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}