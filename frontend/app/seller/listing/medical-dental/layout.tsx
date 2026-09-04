"use client";

import { useState, ReactNode } from "react";
import {
  DraftContext,
  defaultMedicalData,
  MedicalData,
  MedicalImageItem,
} from "./DraftContext";

export default function MedicalListingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [medicalData, setMedicalData] =
    useState<MedicalData>(defaultMedicalData);
  const [images, setImages] = useState<MedicalImageItem[]>([]);

  return (
    <DraftContext.Provider
      value={{ medicalData, setMedicalData, images, setImages }}
    >
      {children}
    </DraftContext.Provider>
  );
}