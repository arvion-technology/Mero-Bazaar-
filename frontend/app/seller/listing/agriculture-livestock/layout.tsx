"use client";

import { useState, ReactNode } from "react";
import {
  DraftContext,
  defaultAgricultureData,
  AgricultureData,
  AgricultureImageItem,
} from "./DraftContext";

export default function AgricultureListingLayout({ children }: { children: ReactNode }) {
  const [agricultureData, setAgricultureData] = useState<AgricultureData>(defaultAgricultureData);
  const [images, setImages] = useState<AgricultureImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ agricultureData, setAgricultureData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}