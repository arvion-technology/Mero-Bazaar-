"use client";

import { useState, ReactNode } from "react";
import { TradesDraftContext, defaultData, TradesDraftData } from "./DraftContext";

export default function TradesListingLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TradesDraftData>(defaultData);
  return (
    <TradesDraftContext.Provider value={{ data, setData }}>
      {children}
    </TradesDraftContext.Provider>
  );
}