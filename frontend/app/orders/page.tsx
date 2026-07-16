"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type OrderListItem = {
  id: string;
  status: string;
  totalPrice: number;
  priceAtOrder: number;
  createdAt: string;
  listing: { title: string; images: string[]; category: string };
};

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;
    (async () => {
      try {
        const res = await fetch("/api/orders/mine", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const data = await res.json();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.accessToken]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>My Orders</h1>
      {orders.length === 0 && <p style={{ color: "#888" }}>No orders yet.</p>}
      {orders.map((o) => (
        <Link
          key={o.id}
          href={`/checkout/${o.id}`}
          style={{
            display: "block", background: "#fff", borderRadius: 12, padding: 16,
            marginBottom: 10, boxShadow: "0 1px 8px rgba(0,0,0,.06)", textDecoration: "none", color: "inherit",
          }}
        >
          <p style={{ fontWeight: 700 }}>{o.listing.title}</p>
          <p style={{ fontSize: 13, color: "#888" }}>
            {o.status} · NPR {o.totalPrice.toLocaleString()} · {new Date(o.createdAt).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}