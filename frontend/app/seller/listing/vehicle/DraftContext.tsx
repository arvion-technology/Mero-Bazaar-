"use client";

import { createContext, useContext } from "react";

export interface VehicleData {
  title: string;
  price: string;
  description: string;
  vehicleType: string;
  brand: string;
  model: string;
  modelYear: string;
  kmDriven: string;
  condition: string;
  bluebookStatus: string;
  fuelType: string;
  ownershipTransfer: boolean;
  address: string;
  details: Record<string, string>;
}

export interface ImageItem {
  file: File;
  preview: string;
}

export interface DraftContextType {
  vehicleData: VehicleData;
  setVehicleData: (d: VehicleData) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

export const defaultVehicleData: VehicleData = {
  title: "",
  price: "",
  description: "",
  vehicleType: "car",
  brand: "Toyota",
  model: "",
  modelYear: "2021",
  kmDriven: "",
  condition: "used",
  bluebookStatus: "verified",
  fuelType: "petrol",
  ownershipTransfer: true,
  address: "",
  details: {},
};

export const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within vehicle listing layout");
  return ctx;
}