"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VehicleData {
  title: string;
  price: string;
  description: string;
  vehicleType: string;
  brand: string;
  modelYear: string;
  kmDriven: string;
  condition: string;
  bluebookStatus: string;
  fuelType: string;
  ownershipTransfer: boolean;
  address: string;
}

interface ImageItem {
  file: File;
  preview: string;
}

interface DraftContextType {
  vehicleData: VehicleData;
  setVehicleData: (d: VehicleData) => void;
  images: ImageItem[];
  setImages: (i: ImageItem[]) => void;
}

const defaultVehicleData: VehicleData = {
  title: "",
  price: "",
  description: "",
  vehicleType: "car",
  brand: "Toyota",
  modelYear: "2021",
  kmDriven: "",
  condition: "used",
  bluebookStatus: "verified",
  fuelType: "petrol",
  ownershipTransfer: true,
  address: "",
};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within vehicle listing layout");
  return ctx;
}

export default function VehicleListingLayout({ children }: { children: ReactNode }) {
  const [vehicleData, setVehicleData] = useState<VehicleData>(defaultVehicleData);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ vehicleData, setVehicleData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}