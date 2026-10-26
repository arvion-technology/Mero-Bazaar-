"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adaptOrderToRow, OrderRow, OrderWithRelations } from "@/lib/orders";
import {
  adaptBookingToRow,
  BOOKING_ACTIONS,
  BookingRow,
  BookingStatus,
  fetchSellerBookings,
  updateBookingStatus,
} from "@/lib/bookings";

const btn = (danger?: boolean): React.CSSProperties => ({
  padding: "5px 10px",
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 6,
  cursor: "pointer",
  border: `1px solid ${danger ? "#fecaca" : "#bfdbfe"}`,
  background: danger ? "#fef2f2" : "#eff6ff",
  color: danger ? "#b91c1c" : "#1d4ed8",
});

export default function SellerOrdersPage() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders/seller/mine");
        if (!res.ok) throw new Error("Failed to load orders");
        const data: OrderWithRelations[] = await res.json();
        if (!cancelled) setOrders(data.map(adaptOrderToRow));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetchSellerBookings(token)
      .then((data) => {
        if (cancelled) return;
        setBookings(data.map(adaptBookingToRow));
        setBookingsError(null);
      })
      .catch((err) => {
        if (!cancelled)
          setBookingsError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setBookingsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const changeStatus = useCallback(
    async (id: string, status: BookingStatus) => {
      if (!token) return;
      setBusyId(id);
      setActionError(null);
      try {
        const next = await updateBookingStatus(token, id, status);
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: next } : b)));
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "Update failed");
      } finally {
        setBusyId(null);
      }
    },
    [token],
  );

  return (
    <>
      <div className="dash-card">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Orders</h3>
        </div>

        {loading && <div className="dash-msg-empty">Loading orders...</div>}
        {!loading && error && <div className="dash-msg-empty">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="dash-msg-empty">No orders yet.</div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="dash-order-id">{order.id}</span></td>
                    <td>{order.product}</td>
                    <td>
                      <div className="dash-customer-name">{order.customer}</div>
                      <div className="dash-customer-email">{order.email}</div>
                    </td>
                    <td>{order.location}</td>
                    <td><span className="dash-amount">{order.amount}</span></td>
                    <td>
                      <span className="dash-status" style={{ background: order.statusColor + "12", color: order.statusColor }}>
                        <span className="dash-status-dot" style={{ background: order.statusColor }} />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dash-card" style={{ marginTop: 20 }}>
        <div className="dash-card-header">
          <h3 className="dash-card-title">Beauty Bookings</h3>
        </div>

        {actionError && (
          <div className="dash-msg-empty" style={{ color: "#b91c1c" }}>
            {actionError}
          </div>
        )}
        {bookingsLoading && <div className="dash-msg-empty">Loading bookings...</div>}
        {!bookingsLoading && bookingsError && (
          <div className="dash-msg-empty">{bookingsError}</div>
        )}
        {!bookingsLoading && !bookingsError && bookings.length === 0 && (
          <div className="dash-msg-empty">No bookings yet.</div>
        )}

        {!bookingsLoading && !bookingsError && bookings.length > 0 && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const actions = BOOKING_ACTIONS[b.status];
                  return (
                    <tr key={b.id}>
                      <td>{b.service}</td>
                      <td>
                        <div className="dash-customer-name">{b.customer}</div>
                        {b.phone && (
                          <div className="dash-customer-email">
                            <a href={`tel:${b.phone}`}>{b.phone}</a>
                          </div>
                        )}
                      </td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td>{b.notes}</td>
                      <td>
                        <span className="dash-status" style={{ background: b.statusColor + "12", color: b.statusColor }}>
                          <span className="dash-status-dot" style={{ background: b.statusColor }} />
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {actions.map((a) => (
                            <button
                              key={a.status}
                              type="button"
                              style={{ ...btn(a.danger), opacity: busyId === b.id ? 0.5 : 1 }}
                              disabled={busyId === b.id}
                              onClick={() => changeStatus(b.id, a.status)}
                            >
                              {a.label}
                            </button>
                          ))}
                          {actions.length === 0 && "—"}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}