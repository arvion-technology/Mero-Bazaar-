"use client";

import { useEffect, useState } from "react";
import { adaptOrderToRow, OrderRow, OrderWithRelations } from "@/lib/orders";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
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
                <th>Type</th>
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
                  <td>{order.type}</td>
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
  );
}