"use client";

import { createContext, useContext } from "react";

export interface SecondHandData {
  listingType: string;
  itemName: string;
  condition: string;
  price: string;
  negotiable: boolean;
  description: string;
  // baby-specific
  brand: string;
  quantity: string;
  gender: string;
  availability: string;
  location: string;
  color: string;
  material: string;
  weight: string;
  deliveryOption: string;
  deliveryCharge: string;
  // non-baby
  city: string;
  expiresAt: string;
  status: string;
}

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
}

export interface DraftContextType {
  data: SecondHandData;
  setData: (d: SecondHandData) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

export const defaultData: SecondHandData = {
  listingType: "Furniture",
  itemName: "",
  condition: "",
  price: "",
  negotiable: true,
  description: "",
  brand: "",
  quantity: "1",
  gender: "Unisex",
  availability: "In Stock",
  location: "Balkumari, Lalitpur",
  color: "",
  material: "",
  weight: "",
  deliveryOption: "Buyer Pickup",
  deliveryCharge: "0",
  city: "Lalitpur",
  expiresAt: "15/07/2026",
  status: "Active",
};

export const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within secondhand-goods listing layout");
  return ctx;
}