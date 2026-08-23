"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface TradesDraftData {
  serviceTitle: string;
  startingPrice: string;
  description: string;
  selectedService: string;
  city: string;
  ward: string;
  skills: string[];
  serviceArea: string;
  calloutCharge: string;
  warrantyGiven: boolean;
  emergencyService: boolean;
  avgResponseTime: string;
  address: string;
  mapPosition: [number, number];
}

interface TradesDraftContextType {
  data: TradesDraftData;
  setData: (d: TradesDraftData) => void;
}

const defaultData: TradesDraftData = {
  serviceTitle: "Professional Plumbing Service",
  startingPrice: "800",
  description: "",
  selectedService: "Plumbing",
  city: "Kathmandu",
  ward: "Ward 14",
  skills: ["Plumbing", "Leak Repair", "Bathroom Fitting"],
  serviceArea: "10KM",
  calloutCharge: "",
  warrantyGiven: true,
  emergencyService: true,
  avgResponseTime: "1 Hour",
  address: "Kalanki, Kathmandu, Nepal",
  mapPosition: [27.7172, 85.3240],
};

const TradesDraftContext = createContext<TradesDraftContextType | null>(null);

export function useTradesDraft() {
  const ctx = useContext(TradesDraftContext);
  if (!ctx) throw new Error("useTradesDraft must be used within trades listing layout");
  return ctx;
}

export default function TradesListingLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TradesDraftData>(defaultData);
  return (
    <TradesDraftContext.Provider value={{ data, setData }}>
      {children}
    </TradesDraftContext.Provider>
  );
}