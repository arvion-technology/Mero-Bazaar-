"use client";

import { createContext, useContext } from "react";

export interface JobDraftData {
  role: string;
  company: string;
  salaryMin: string;
  salaryMax: string;
  payPeriod: string;
  location: string;
  mapPosition: [number, number];
  contractType: string;
  description: string;
  skillTags: string[];
  urgentHiring: boolean;
  phoneVerified: boolean;
}

export interface JobDraftContextType {
  data: JobDraftData;
  setData: (d: JobDraftData) => void;
}

export const DEFAULT_MAP_POSITION: [number, number] = [27.7172, 85.324];

export const defaultData: JobDraftData = {
  role: "Frontend Developer",
  company: "Hamro Tech Pvt. Ltd",
  salaryMin: "35,000",
  salaryMax: "55,000",
  payPeriod: "Monthly",
  location: "Kathmandu, Nepal",
  mapPosition: DEFAULT_MAP_POSITION,
  contractType: "Full Time",
  description: "",
  skillTags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  urgentHiring: true,
  phoneVerified: true,
};

export const JobDraftContext = createContext<JobDraftContextType | null>(null);

export function useJobDraft() {
  const ctx = useContext(JobDraftContext);
  if (!ctx) throw new Error("useJobDraft must be used within job listing layout");
  return ctx;
}