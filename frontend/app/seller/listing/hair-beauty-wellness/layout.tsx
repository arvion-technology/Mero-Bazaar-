"use client";

import { useState, ReactNode } from "react";
import {
  DraftContext,
  defaultsByCategory,
  ServiceCategory,
  ServiceData,
  ImageItem,
} from "./DraftContext";

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