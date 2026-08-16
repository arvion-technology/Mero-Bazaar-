import { JobListing } from "@/app/types/jobs";
import type { DBListing, Vehicle } from "../app/types/vehicle";
import type { RegisterPayload, LoginPayload, AuthResponse } from "../app/types/auth";
import type { SecondhandListing } from "../app/types/secondhand";
import type { RentalListing } from "../app/types/realestate";
import type { TradesListing, CreateTradesPayload } from "../app/types/trades";
import type { AgricultureListing } from "../app/types/agriculture";
import type { FoodsListing } from "../app/types/foods";
import type { MedicalListing } from "@/app/types/medical";
import type { BeautyListing } from "@/app/types/beauty";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface CreateDeliveryOrderPayload {
  listingId: string;
  quantity: number;
  deliveryDate: string;
  deliveryAddress: string;
}

export interface OrderResponse {
  id: string;
  totalPrice: number;
  status: string;
  [key: string]: unknown;
}

export interface EsewaInitiateResponse {
  gatewayUrl: string;
  fields: Record<string, string>;
}

export interface KhaltiInitiateResponse {
  paymentUrl: string;
}

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
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Api error ${res.status}`);
  return data;
}

async function postLocal<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Api error ${res.status}`);
  return data;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Api error ${res.status}`);
  return data;
}

async function del<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Api error ${res.status}`);
  return data as T;
}

export const api = {
  register:    (payload: RegisterPayload) => post<AuthResponse>('/api/auth/register', payload),
  login:       (payload: LoginPayload) => post<AuthResponse>('/api/auth/login', payload),

  getListings: () => get<DBListing[]>('/listings'),
  getVehicles: () => get<Vehicle[]>('/vehicles'),

  getJobs:     (params?: URLSearchParams) => get<JobListing[]>('/api/jobs', params),
  getJob:      (id: string) => get<JobListing>(`/api/jobs/${id}`),

  getSecondhandListings: (params?: URLSearchParams) =>
    get<SecondhandListing[]>('/api/secondhand-goods', params),
  getSecondhandListing: (id: string) =>
    get<SecondhandListing>(`/api/secondhand-goods/${id}`),

  getRentals: (params?: URLSearchParams) =>
    get<RentalListing[]>('/api/rental', params),
  getRental:  (id: string) =>
    get<RentalListing>(`/api/rental/${id}`),

  getTrades: (params?: URLSearchParams) =>
    get<TradesListing[]>('/api/trades', params),
  getTrade: (id: string) =>
    get<TradesListing>(`/api/trades/${id}`),
  getEmergencyTrades: (city?: string) =>
    get<TradesListing[]>('/api/trades/emergency', city ? new URLSearchParams({ city }) : undefined),
  getNearbyTrades: (latitude: number, longitude: number, km: number) =>
    get<TradesListing[]>('/api/trades/nearby', new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      km: String(km),
    })),
  createTrade: (payload: CreateTradesPayload) =>
    post<TradesListing>('/api/trades', payload),
  updateTrade: (id: string, payload: Partial<CreateTradesPayload>) =>
    patch<TradesListing>(`/api/trades/${id}`, payload),
  removeTrade: (id: string) =>
    del<{ success: boolean }>(`/api/trades/${id}`),

  getAgricultureListings: (params?: URLSearchParams) =>
   get<AgricultureListing[]>('/api/agriculture', params),
  getAgricultureListing: (id: string) =>
    get<AgricultureListing>(`/api/agriculture/${id}`),

  getFoods: (params?: URLSearchParams) =>
    get<FoodsListing[]>('/api/foods', params),
  getFood: (id: string) =>
    get<FoodsListing>(`/api/foods/${id}`),

  getMedicalListings: (params?: URLSearchParams) =>
    get<MedicalListing[]>('/api/medical', params),
  getMedicalListing: (id: string) =>
    get<MedicalListing>(`/api/medical/${id}`),

  getBeautyListings: (params?: URLSearchParams) =>
    get<BeautyListing[]>('/api/beauty', params),
  getBeautyListing: (id: string) =>
    get<BeautyListing>(`/api/beauty/${id}`),

  createDeliveryOrder: (payload: CreateDeliveryOrderPayload) =>
    postLocal<OrderResponse>('/api/orders/delivery', payload),
  initiateEsewa: (orderIds: string[]) =>
    postLocal<EsewaInitiateResponse>('/api/payments/esewa/initiate', { orderIds }),
  initiateKhalti: (orderIds: string[]) =>
    postLocal<KhaltiInitiateResponse>('/api/payments/khalti/initiate', { orderIds }),
};