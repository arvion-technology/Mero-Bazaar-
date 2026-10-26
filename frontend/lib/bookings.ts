const API = process.env.NEXT_PUBLIC_API_URL;

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type BookingWithRelations = {
  id: string;
  date: string | null;
  status: BookingStatus;
  customerName: string;
  notes: string | null;
  slot: { startTime: string; endTime: string } | null;
  user: { id: string; name: string | null; phone: string | null } | null;
  beauty: { listing: { id: string; title: string } | null } | null;
};

export type BookingRow = {
  id: string;
  service: string;
  customer: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  status: BookingStatus;
  statusColor: string;
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#2563eb",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
};

// Mirrors backend allowedTransitions
export const BOOKING_ACTIONS: Record<
  BookingStatus,
  { label: string; status: BookingStatus; danger?: boolean }[]
> = {
  PENDING: [
    { label: "Confirm", status: "CONFIRMED" },
    { label: "Decline", status: "CANCELLED", danger: true },
  ],
  CONFIRMED: [
    { label: "Complete", status: "COMPLETED" },
    { label: "Cancel", status: "CANCELLED", danger: true },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

export function adaptBookingToRow(b: BookingWithRelations): BookingRow {
  return {
    id: b.id,
    service: b.beauty?.listing?.title ?? "—",
    customer: b.customerName || b.user?.name || "Customer",
    phone: b.user?.phone ?? "",
    date: b.date ? b.date.slice(0, 10) : "—",
    time: b.slot ? `${b.slot.startTime} - ${b.slot.endTime}` : "—",
    notes: b.notes || "—",
    status: b.status,
    statusColor: STATUS_COLOR[b.status],
  };
}

const errMsg = (data: unknown, fallback: string) => {
  const m = (data as { message?: string | string[] })?.message;
  return Array.isArray(m) ? m.join(", ") : (m ?? fallback);
};

export async function fetchSellerBookings(
  token: string,
): Promise<BookingWithRelations[]> {
  const res = await fetch(`${API}/api/beauty/appointments/seller/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json();
}

export async function updateBookingStatus(
  token: string,
  id: string,
  status: BookingStatus,
): Promise<BookingStatus> {
  const res = await fetch(`${API}/api/beauty/appointments/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(errMsg(data, "Update failed"));
  return (data.status ?? status) as BookingStatus;
}