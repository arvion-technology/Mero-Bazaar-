"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type OrderDetail = {
  id: string;
  totalPrice: number;
  priceAtOrder: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  reservedUntil: string;
  listing: {
    title: string;
    images: string[];
    category: string;
    user: {
      name: string | null;
      phone: string | null;
      vendorKyc: { contactNumber: string; status: string } | null;
    };
  };
};

export default function CheckoutPage() {
  const { id: orderId } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [payingKhalti, setPayingKhalti] = useState(false);

  const accessToken = session?.accessToken;

  const fetchOrder = useCallback(async () => {
    if (!accessToken) return;
    try {
      let res = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 404) {
        await new Promise((r) => setTimeout(r, 400));
        res = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
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
    const res = await fetch(`/api/payments/esewa/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error();
      const { gatewayUrl, fields } = await res.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = gatewayUrl;

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    } catch {
      toast.error("Couldn't start payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };
  
    const handleCancel = async () => {
    if (!accessToken) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error();
      await fetchOrder();
      toast.info("Reservation cancelled.");
    } catch {
      toast.error("Couldn't cancel. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!order) return <div style={{ padding: 40 }}>Order not found.</div>;

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  //handler for khalti payment
  const handlePayKhalti = async () => {
    if (!accessToken) return;
    setPayingKhalti(true);
    try {
      const res =  await fetch(`/api/payments/khalti/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error();
      const { paymentUrl } = await res.json();
      window.location.href = paymentUrl;
    } catch {
      toast.error("Couldn't start payment. Please try again.");
      setPayingKhalti(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 14px rgba(0,0,0,.07)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{order.listing.title}</h1>
            {order.listing.category === "VEHICLE" ? (
            <>
            <p style={{ fontSize: 13, color: "#888", margin: "8px 0 2px" }}>
            Vehicle price: NPR {order.priceAtOrder.toLocaleString()}
            </p>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#C0392B", margin: "0 0 8px" }}>
            Reservation fee: NPR {order.totalPrice.toLocaleString()}
            </p>
            </>
            ) : (
            <p style={{ fontSize: 24, fontWeight: 900, color: "#C0392B", margin: "8px 0" }}>
                NPR {order.totalPrice.toLocaleString()}
            </p>
            )} 

        {order.status === "PENDING" && (
          <>
            <p style={{ fontSize: 13, color: secondsLeft < 60 ? "#e74c3c" : "#888", marginBottom: 16 }}>
              Reservation expires in {mins}:{secs}
            </p>
            <button
              onClick={handlePay}
              disabled={paying || secondsLeft === 0}
              style={{
                width: "100%", padding: 13, borderRadius: 10,
                border: "1.5px solid #e0e0e0",
                background: secondsLeft === 0 ? "#f5f5f5" : "#fff",
                color: secondsLeft === 0 ? "#aaa" : "#222",
                fontWeight: 700, fontSize: 14.5,
                cursor: secondsLeft === 0 ? "not-allowed" : "pointer", marginBottom: 8,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {paying ? (
                "Processing…"
              ) : secondsLeft === 0 ? (
                "Reservation Expired"
              ) : (
                <>
                  <img src="/esewa_logo.png" alt="eSewa" style={{ height: 18 }} />
                  Pay with eSewa
                </>
              )}
            </button>

            <button
            onClick={handlePayKhalti}
            disabled={payingKhalti || secondsLeft === 0}
              style={{
                width: "100%", padding: 13, borderRadius: 10,
                border: "1.5px solid #e0e0e0",
                background: secondsLeft === 0 ? "#f5f5f5" : "#fff",
                color: secondsLeft === 0 ? "#aaa" : "#222",
                fontWeight: 700, fontSize: 14.5,
                cursor: secondsLeft === 0 ? "not-allowed" : "pointer", marginBottom: 8,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {payingKhalti ? (
                "Processing..." 
              ): secondsLeft === 0 ? ( 
                  "REservation Expired"
                ) : (
                  <>                         
                    <img src="/Khalti.png" alt="Khalti" style={{ height: 18 }} />
                    Pay with Khalti
                  </>
                )}
            </button>

            <button
              style={{
                width: "100%", padding: 13, borderRadius: 10,
                border: "1.5px solid #e0e0e0",
                background: secondsLeft === 0 ? "#f5f5f5" : "#fff",
                color: secondsLeft === 0 ? "#aaa" : "#222",
                fontWeight: 700, fontSize: 14.5,
                cursor: secondsLeft === 0 ? "not-allowed" : "pointer", marginBottom: 8,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <img src="/logo_connectIPS.png" alt="Connect IPS" style={{ height: 18 }} />
              Pay with Connect IPS
            </button>


            <button
              onClick={handleCancel}
              disabled={paying || cancelling}
              style={{
                width: "100%", padding: 12, borderRadius: 10,
                border: "1.5px solid #e0e0e0", background: "#fff",
                color: "#555", fontWeight: 600, fontSize: 14,
                cursor: cancelling ? "not-allowed" : "pointer",
              }}
            >
              {cancelling ? "Cancelling…" : "Cancel Reservation"}
            </button>
          </>
        )}

        {order.status === "CONFIRMED" && (
        <div style={{ background: "#eafaf1", border: "1px solid #a9dfbf", borderRadius: 10, padding: 16, marginTop: 12 }}>
            <p style={{ fontWeight: 700, color: "#1e8449", marginBottom: 6 }}>
            {order.listing.category === "VEHICLE" ? "Reservation fee paid!" : "Payment confirmed!"}
            </p>
            <p style={{ fontSize: 13, color: "#333" }}>
            {order.listing.category === "VEHICLE" &&
                "This vehicle is reserved for you. The remaining balance and document transfer happen directly with the seller. "}
              Contact {order.listing.user.name ?? "the seller"} at{" "}
              <strong>
                {order.listing.user.vendorKyc?.status === "VERIFIED"
                  ? order.listing.user.vendorKyc.contactNumber
                  : order.listing.user.phone ?? "N/A"}
              </strong>            
              {order.listing.category === "VEHICLE" ? " to arrange payment and handover." : " to arrange handover and document transfer."}
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