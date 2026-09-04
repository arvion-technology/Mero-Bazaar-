"use client";

import { useState, ReactNode } from "react";
import { JobDraftContext, defaultData, JobDraftData } from "./DraftContext";

export default function JobListingLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<JobDraftData>(defaultData);
  return (
    <JobDraftContext.Provider value={{ data, setData }}>
      {children}
    </JobDraftContext.Provider>
  );
}