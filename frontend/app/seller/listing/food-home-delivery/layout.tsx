"use client";

import { useState, ReactNode } from "react";
import {
  DraftContext,
  defaultFoodDeliveryData,
  FoodDeliveryData,
  FoodDeliveryImageItem,
} from "./Draftcontext";

export default function FoodDeliveryListingLayout({ children }: { children: ReactNode }) {
  const [foodData, setFoodData] = useState<FoodDeliveryData>(defaultFoodDeliveryData);
  const [images, setImages] = useState<FoodDeliveryImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ foodData, setFoodData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}