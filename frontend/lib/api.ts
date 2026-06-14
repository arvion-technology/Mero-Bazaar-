import type { DBListing, Vehicle } from "../app/types/listing";
import type { RegisterPayload, LoginPayload, AuthResponse } from "@/app/types/auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Api error ${res.status}: ${path}`);
  return res.json();
}

async function post<T>(path: string, body:unknown): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Api error $ {res.status}');
  return data;
}

export const api = {
  register:      (payload: RegisterPayload) => post<AuthResponse>('/auth/register', payload),
  login:         (payload: LoginPayload) => post<AuthResponse>('/auth/login', payload),

  getListings:   () => get<DBListing[]>('/listings'),
  getVehicles:   () => get<Vehicle[]>('/vehicles'), 
};