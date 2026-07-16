"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type OrderDetail = {
  id: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  reservedUntil: string;
  listing: {
    title: string;
    images: string[];
    user: { name: string | null; phone: string | null };
  };
};

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const accessToken = session?.accessToken;

  const fetchOrder = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrder(data);
    } catch {
      toast.error("Couldn't load this order.");
    } finally {
      setLoading(false);
    }
  }, [orderId, accessToken]);

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount; fetchOrder is also reused after handlePay
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    if (!order?.reservedUntil) return;
    const tick = () => {
      const diff = Math.floor((new Date(order.reservedUntil).getTime() - Date.now()) / 1000);
      setSecondsLeft(Math.max(diff, 0));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [order?.reservedUntil]);

  const handlePay = async () => {
    if (!accessToken) return;
    setPaying(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ paymentRef: `TEST-${Date.now()}` }),
      });
      if (!res.ok) throw new Error();
      await fetchOrder();
      toast.success("Payment confirmed!");
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!order) return <div style={{ padding: 40 }}>Order not found.</div>;

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 14px rgba(0,0,0,.07)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{order.listing.title}</h1>
        <p style={{ fontSize: 24, fontWeight: 900, color: "#C0392B", margin: "8px 0" }}>
          NPR {order.totalPrice.toLocaleString()}
        </p>

        {order.status === "PENDING" && (
          <>
            <p style={{ fontSize: 13, color: secondsLeft < 60 ? "#e74c3c" : "#888", marginBottom: 16 }}>
              Reservation expires in {mins}:{secs}
            </p>
            <button
              onClick={handlePay}
              disabled={paying || secondsLeft === 0}
              style={{
                width: "100%", padding: 13, borderRadius: 10, border: "none",
                background: secondsLeft === 0 ? "#ccc" : "linear-gradient(135deg, #27ae60, #1e8449)",
                color: "#fff", fontWeight: 700, fontSize: 14.5, cursor: secondsLeft === 0 ? "not-allowed" : "pointer",
              }}
            >
              {paying ? "Processing…" : secondsLeft === 0 ? "Reservation Expired" : "Pay Now"}
            </button>
          </>
        )}

        {order.status === "CONFIRMED" && (
          <div style={{ background: "#eafaf1", border: "1px solid #a9dfbf", borderRadius: 10, padding: 16, marginTop: 12 }}>
            <p style={{ fontWeight: 700, color: "#1e8449", marginBottom: 6 }}>Payment confirmed!</p>
            <p style={{ fontSize: 13, color: "#333" }}>
              Contact {order.listing.user.name ?? "the seller"} at{" "}
              <strong>{order.listing.user.phone ?? "N/A"}</strong> to arrange handover and document transfer.
            </p>
          </div>
        )}

        {(order.status === "CANCELLED" || order.status === "EXPIRED") && (
          <div style={{ background: "#fdecea", border: "1px solid #f5b7b1", borderRadius: 10, padding: 16, marginTop: 12 }}>
            <p style={{ color: "#c0392b", fontWeight: 600 }}>
              This reservation is no longer active.
            </p>
            <button onClick={() => router.back()} style={{ marginTop: 10, background: "none", border: "none", color: "#C0392B", fontWeight: 600, cursor: "pointer" }}>
              ← Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}