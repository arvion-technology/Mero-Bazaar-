"use client";

import { useState, ReactNode } from "react";
import { DraftContext, defaultVehicleData, VehicleData, ImageItem } from "./DraftContext";

export default function VehicleListingLayout({ children }: { children: ReactNode }) {
  const [vehicleData, setVehicleData] = useState<VehicleData>(defaultVehicleData);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <DraftContext.Provider value={{ vehicleData, setVehicleData, images, setImages }}>
      {children}
    </DraftContext.Provider>
  );
}