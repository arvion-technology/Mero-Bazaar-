"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useFoodCart } from "../../context/FoodCartContext";
import { popNextOrder, hasMoreInQueue, clearCheckoutQueue } from "@/lib/checkoutQueue";
import type { OrderDetail } from "@/app/types/orders";

export default function CheckoutPage() {
  const { id: orderId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { clearCart } = useFoodCart();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payingKhalti, setPayingKhalti] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [chaining, setChaining] = useState(false);

  const accessToken = session?.accessToken;
  const paymentParam = searchParams.get("payment");

  const receiptLabelStyle: React.CSSProperties = { padding: "8px 0", color: "#666", verticalAlign: "top" };
  const receiptValueStyle: React.CSSProperties = { padding: "8px 0", textAlign: "right", fontWeight: 600 };

  const fetchOrder = useCallback(async () => {
    if (!accessToken) return null;
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
      const data: OrderDetail = await res.json();
      setOrder(data);
      return data;
    } catch {
      toast.error("Couldn't load this order.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [orderId, accessToken]);

  // Initial load + delivery-order payment-queue chaining (multiple food items paid one after another)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const fetched = await fetchOrder();
      if (cancelled || !fetched) return;

      if (paymentParam === "success" && fetched.type === "DELIVERY") {
        if (hasMoreInQueue()) {
          setChaining(true);
          const next = popNextOrder();
          if (next) {
            if (next.paymentMethod === "esewa") {
              const res = await fetch(`/api/payments/esewa/initiate`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ orderId: next.orderId }),
              });
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
            } else {
              const res = await fetch(`/api/payments/khalti/initiate`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ orderId: next.orderId }),
              });
              const { paymentUrl } = await res.json();
              window.location.href = paymentUrl;
            }
            return;
          }
        } else {
          clearCheckoutQueue();
          clearCart();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, paymentParam, accessToken]);

  useEffect(() => {
    if (!order?.reservedUntil) return;
    const tick = () => {
      const diff = Math.floor((new Date(order.reservedUntil!).getTime() - Date.now()) / 1000);
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
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

  const handlePayKhalti = async () => {
    if (!accessToken) return;
    setPayingKhalti(true);
    try {
      const res = await fetch(`/api/payments/khalti/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
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
      toast.info("Order cancelled.");
    } catch {
      toast.error("Couldn't cancel. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (chaining) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        Taking you to the next payment…
      </div>
    );
  }

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!order) return <div style={{ padding: 40 }}>Order not found.</div>;

  const isReservation = order.type === "RESERVATION";
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

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
            {isReservation && (
              <p style={{ fontSize: 13, color: secondsLeft < 60 ? "#e74c3c" : "#888", marginBottom: 16 }}>
                Reservation expires in {mins}:{secs}
              </p>
            )}

            <button
              onClick={handlePay}
              disabled={paying || (isReservation && secondsLeft === 0)}
              style={{
                width: "100%", padding: 13, borderRadius: 10,
                border: "1.5px solid #e0e0e0",
                background: isReservation && secondsLeft === 0 ? "#f5f5f5" : "#fff",
                color: isReservation && secondsLeft === 0 ? "#aaa" : "#222",
                fontWeight: 700, fontSize: 14.5,
                cursor: isReservation && secondsLeft === 0 ? "not-allowed" : "pointer", marginBottom: 8,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {paying ? "Processing…" : isReservation && secondsLeft === 0 ? "Reservation Expired" : (
                <>
                  <img src="/esewa_logo.png" alt="eSewa" style={{ height: 18 }} />
                  Pay with eSewa
                </>
              )}
            </button>

            <button
              onClick={handlePayKhalti}
              disabled={payingKhalti || (isReservation && secondsLeft === 0)}
              style={{
                width: "100%", padding: 13, borderRadius: 10,
                border: "1.5px solid #e0e0e0",
                background: isReservation && secondsLeft === 0 ? "#f5f5f5" : "#fff",
                color: isReservation && secondsLeft === 0 ? "#aaa" : "#222",
                fontWeight: 700, fontSize: 14.5,
                cursor: isReservation && secondsLeft === 0 ? "not-allowed" : "pointer", marginBottom: 8,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {payingKhalti ? "Processing…" : isReservation && secondsLeft === 0 ? "Reservation Expired" : (
                <>
                  <img src="/Khalti.png" alt="Khalti" style={{ height: 18 }} />
                  Pay with Khalti
                </>
              )}
            </button>

            {isReservation && (
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
            )}
          </>
        )}

        {order.status === "CONFIRMED" && (
          <div style={{ background: "#eafaf1", border: "1px solid #a9dfbf", borderRadius: 10, padding: 16, marginTop: 12 }}>
            <p style={{ fontWeight: 700, color: "#1e8449", marginBottom: 6 }}>
              {isReservation ? "Reservation fee paid!" : "Payment confirmed!"}
            </p>
            <p style={{ fontSize: 13, color: "#333" }}>
              {isReservation ? (
                <>
                  This vehicle is reserved for you. The remaining balance and document transfer happen directly with the seller.{" "}
                  Contact {order.listing.user.name ?? "the seller"} at{" "}
                  <strong>
                    {order.listing.user.vendorKyc?.status === "VERIFIED"
                      ? order.listing.user.vendorKyc.contactNumber
                      : order.listing.user.phone ?? "N/A"}
                  </strong>{" "}
                  to arrange payment and handover.
                </>
              ) : (
                <>Your order for &quot;{order.listing.title}&quot; is confirmed. You&apos;ll be notified when it&apos;s out for delivery.</>
              )}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1, padding: 11, borderRadius: 8, border: "1.5px solid #a9dfbf",
                  background: "#fff", color: "#1e8449", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                }}
              >
                View / Print Receipt
              </button>
              <button
                onClick={() => router.push("/")}
                style={{
                  flex: 1, padding: 11, borderRadius: 8, border: "none",
                  background: "#1e8449", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {(order.status === "CANCELLED" || order.status === "EXPIRED") && (
          <div style={{ background: "#fdecea", border: "1px solid #f5b7b1", borderRadius: 10, padding: 16, marginTop: 12 }}>
            <p style={{ color: "#c0392b", fontWeight: 600 }}>This order is no longer active.</p>
            <button onClick={() => router.back()} style={{ marginTop: 10, background: "none", border: "none", color: "#C0392B", fontWeight: 600, cursor: "pointer" }}>
              ← Go back
            </button>
          </div>
        )}
      </div>

      {/* Printable receipt — hidden on screen, shown only via window.print() */}
      {order.status === "CONFIRMED" && (
        <div className="receipt-print-only">
          <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Mero Bazaar — Receipt</h2>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
              Issued {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </p>

             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                <tr><td style={receiptLabelStyle}>Order ID</td><td style={receiptValueStyle}>{order.id}</td></tr>
                <tr><td style={receiptLabelStyle}>Item</td><td style={receiptValueStyle}>{order.listing.title}</td></tr>
                <tr><td style={receiptLabelStyle}>Type</td><td style={receiptValueStyle}>{isReservation ? "Reservation" : "Delivery Order"}</td></tr>

                {!isReservation && (
                  <tr><td style={receiptLabelStyle}>Quantity</td><td style={receiptValueStyle}>{order.quantity}</td></tr>
                )}

                <tr><td style={receiptLabelStyle}>Customer Name</td><td style={receiptValueStyle}>{session?.user?.name ?? "—"}</td></tr>
                <tr><td style={receiptLabelStyle}>Phone</td><td style={receiptValueStyle}>{session?.user?.phone ?? "—"}</td></tr>

                {!isReservation && order.deliveryAddress && (
                  <tr><td style={receiptLabelStyle}>Delivery Address</td><td style={receiptValueStyle}>{order.deliveryAddress}</td></tr>
                )}

                {!isReservation && order.deliveryDate && (
                  <tr>
                    <td style={receiptLabelStyle}>Delivery Date</td>
                    <td style={receiptValueStyle}>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                  </tr>
                )}

                <tr><td style={receiptLabelStyle}>Payment Method</td><td style={receiptValueStyle}>{order.paymentMethod ?? "—"}</td></tr>
                <tr><td style={receiptLabelStyle}>Payment Reference</td><td style={receiptValueStyle}>{order.paymentRef ?? "—"}</td></tr>
                <tr><td style={receiptLabelStyle}>Status</td><td style={receiptValueStyle}>{order.status}</td></tr>

                <tr>
                  <td style={receiptLabelStyle}>Item Price (each)</td>
                  <td style={receiptValueStyle}>NPR {order.priceAtOrder.toLocaleString()}</td>
                </tr>
                {!isReservation && order.quantity > 1 && (
                  <tr>
                    <td style={receiptLabelStyle}>Subtotal ({order.quantity} × NPR {order.priceAtOrder.toLocaleString()})</td>
                    <td style={receiptValueStyle}>NPR {(order.priceAtOrder * order.quantity).toLocaleString()}</td>
                  </tr>
                )}
                {!isReservation && order.totalPrice > order.priceAtOrder * order.quantity && (
                  <tr>
                    <td style={receiptLabelStyle}>Delivery / Platform Fee</td>
                    <td style={receiptValueStyle}>
                      NPR {(order.totalPrice - order.priceAtOrder * order.quantity).toLocaleString()}
                    </td>
                  </tr>
                )}

                <tr>
                  <td style={{ ...receiptLabelStyle, fontWeight: 800, fontSize: 15, borderTop: "1px solid #ccc", paddingTop: 12 }}>Amount Paid</td>
                  <td style={{ ...receiptValueStyle, fontWeight: 800, fontSize: 15, borderTop: "1px solid #ccc", paddingTop: 12 }}>
                    NPR {order.totalPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {isReservation ? (
              <p style={{ fontSize: 11, color: "#666", marginTop: 20 }}>
                This receipt confirms your reservation fee only. Remaining balance is paid directly to the seller.
              </p>
            ) : (
              <p style={{ fontSize: 11, color: "#666", marginTop: 20 }}>
                Thank you for your order. You will be notified when it is out for delivery.
              </p>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .receipt-print-only { display: none; }
        @media print {
          body * { visibility: hidden; }
          .receipt-print-only, .receipt-print-only * { visibility: visible; }
          .receipt-print-only { display: block; position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}