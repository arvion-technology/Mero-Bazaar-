const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Api error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  getListings:   () => get<Listing[]>('/listings'),
  getVehicles:   () => get<any[]>('/vehicles'),
  getJobs:       () => get<any[]>('/jobs'),
  getRentals:    () => get<any[]>('/rental'),
  getFoods:      () => get<any[]>('/foods'),
  getSecondhand: () => get<any[]>('/secondhand'),
  search:        (q: string) => get<any[]>(`/search?q=${q}`), 
};