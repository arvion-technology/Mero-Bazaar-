"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { api, OrderDetail } from "@/lib/api";
import { useFoodCart } from "../../../context/FoodCartContext";
import { popNextOrder, hasMoreInQueue, clearCheckoutQueue } from "@/lib/checkoutQueue";

function CheckoutStatusContent() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const { clearCart } = useFoodCart();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [chaining, setChaining] = useState(false);

  const paymentParam = search.get("payment"); 

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const fetched = await api.getOrder(params.id);
        if (cancelled) return;
        setOrder(fetched);

        if (paymentParam === "success") {
          if (hasMoreInQueue()) {
            setChaining(true);
            const next = popNextOrder();
            if (next) {
              if (next.paymentMethod === "esewa") {
                const { gatewayUrl, fields } = await api.initiateEsewa(next.orderId);
                const form = document.createElement("form");
                form.method = "POST";
                form.action = gatewayUrl;
                Object.entries(fields).forEach(([key, value]) => {
                  const input = document.createElement("input");
                  input.type = "hidden";
                  input.name = key;
                  input.value = value;
                  form.appendChild(input);
                });
                document.body.appendChild(form);
                form.submit();
              } else {
                const { paymentUrl } = await api.initiateKhalti(next.orderId);
                window.location.href = paymentUrl;
              }
              return;
            }
          } else {
            clearCheckoutQueue();
            clearCart();
          }
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Couldn't load this order.");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, paymentParam]);

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: 14,
    borderBottom: "1px solid #f0f0f0",
    gap: 12,
  };

  if (chaining) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        Taking you to the next payment…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderRadius: 16,
          padding: "24px 28px",
          boxShadow: "0 2px 14px rgba(0,0,0,.07)",
          border: "1px solid #f0f0f0",
        }}
      >
        {loadError ? (
          <>
            <h1 style={{ color: "#dc2626", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
              Couldn&apos;t load order
            </h1>
            <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>{loadError}</p>
          </>
        ) : !order ? (
          <p style={{ color: "#666", fontSize: 14 }}>Loading order…</p>
        ) : (
          <>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: order.status === "CONFIRMED" || order.status === "DELIVERED" ? "#166534" : "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                {order.status === "CONFIRMED" || order.status === "DELIVERED" ? (
                  <polyline points="20 6 9 17 4 12" />
                ) : (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                )}
              </svg>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
              {order.status === "CONFIRMED" || order.status === "DELIVERED" ? "Payment Successful" : `Order ${order.status.toLowerCase()}`}
            </h1>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 16px" }}>
              {order.listing?.title ?? "Your order"}
            </p>

            <div style={{ textAlign: "left", border: "1px solid #eee", borderRadius: 10, padding: "4px 20px", marginBottom: 16 }}>
              <div style={rowStyle}>
                <span style={{ color: "#555" }}>Order ID</span>
                <span style={{ fontWeight: 600 }}>#{order.id}</span>
              </div>
              <div style={rowStyle}>
                <span style={{ color: "#555" }}>Payment Method</span>
                <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{order.paymentMethod ?? "—"}</span>
              </div>
              <div style={{ ...rowStyle, borderBottom: "none" }}>
                <span style={{ color: "#555" }}>Amount</span>
                <span style={{ fontWeight: 600 }}>Rs. {order.totalPrice}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Link
                href="/cart"
                style={{ flex: 1, padding: 12, borderRadius: 6, background: "#1a56db", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
              >
                View Orders
              </Link>
              <Link
                href="/"
                style={{ flex: 1, padding: 12, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#222", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <CheckoutStatusContent />
    </Suspense>
  );
}