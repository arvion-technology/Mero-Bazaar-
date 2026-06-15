import type { DBListing, Vehicle, Job, JobDetail } from "../app/types/listing";
import type { RegisterPayload, LoginPayload, AuthResponse } from "@/app/types/auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function get<T>(path: string, params?: URLSearchParams): Promise<T> {
  const url = params ? `${BASE}${path}?${params}` : `${BASE}${path}`;
  const token = getToken();
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error(`Api error ${res.status}: ${path}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {  // ← no /api prefix
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Api error ${res.status}`);  // ← fixed
  return data;
}

export const api = {
  register:    (payload: RegisterPayload) => post<AuthResponse>('/auth/register', payload),
  login:       (payload: LoginPayload) => post<AuthResponse>('/auth/login', payload),

  getListings: () => get<DBListing[]>('/listings'),
  getVehicles: () => get<Vehicle[]>('/vehicles'),
  getJobs:     (params?: URLSearchParams) => get<Job[]>('/jobs', params),
  getJob:      (id: string) => get<JobDetail>(`/jobs/${id}`),
};