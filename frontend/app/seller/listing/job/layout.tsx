"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface JobDraftData {
  role: string;
  company: string;
  salaryMin: string;
  salaryMax: string;
  payPeriod: string;
  location: string;
  contractType: string;
  description: string;
  skillTags: string[];
  urgentHiring: boolean;
  phoneVerified: boolean;
}

interface JobDraftContextType {
  data: JobDraftData;
  setData: (d: JobDraftData) => void;
}

const defaultData: JobDraftData = {
  role: "Frontend Developer",
  company: "Hamro Tech Pvt. Ltd",
  salaryMin: "35,000",
  salaryMax: "55,000",
  payPeriod: "Monthly",
  location: "Kathmandu, Nepal",
  contractType: "Full Time",
  description: "",
  skillTags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  urgentHiring: true,
  phoneVerified: true,
};

const JobDraftContext = createContext<JobDraftContextType | null>(null);

export function useJobDraft() {
  const ctx = useContext(JobDraftContext);
  if (!ctx) throw new Error("useJobDraft must be used within job listing layout");
  return ctx;
}

export default function JobListingLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<JobDraftData>(defaultData);
  return (
    <JobDraftContext.Provider value={{ data, setData }}>
      {children}
    </JobDraftContext.Provider>
  );
}