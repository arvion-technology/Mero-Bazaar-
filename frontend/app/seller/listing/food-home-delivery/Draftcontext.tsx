"use client";

import { createContext, useContext } from "react";

export interface FoodDeliveryData {
  title: string;
  foodType: string;
  description: string;

  // Pricing
  price: string;
  priceUnit: string;

  // Service & Delivery
  deliveryRadius: string;
  hygieneRating: string;
  minOrderAmount: string;
  subscriptionAvailable: boolean;
  deliveryDays: string[];

  // Additional
  shortDescription: string;
  location: string;
}

export interface FoodDeliveryImageItem {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
}

export interface DraftContextType {
  foodData: FoodDeliveryData;
  setFoodData: (d: FoodDeliveryData) => void;
  images: FoodDeliveryImageItem[];
  setImages: (i: FoodDeliveryImageItem[]) => void;
}

export const defaultFoodDeliveryData: FoodDeliveryData = {
  title: "",
  foodType: "TIFFIN",
  description: "",

  price: "",
  priceUnit: "PER_MEAL",

  deliveryRadius: "",
  hygieneRating: "",
  minOrderAmount: "",
  subscriptionAvailable: false,
  deliveryDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],

  shortDescription: "",
  location: "Kathmandu, Nepal",
};

export const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within food-home-delivery listing layout");
  return ctx;
}