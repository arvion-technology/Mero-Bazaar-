"use client";

import { useState, ReactNode } from "react";
import { DraftContext, defaultData, SecondHandData, ImageItem } from "./DraftContext";

export default function SecondHandGoodsLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SecondHandData>(defaultData);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ data, setData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}