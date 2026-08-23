"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { clearCheckoutQueue } from "@/lib/checkoutQueue";

function FailedContent() {
  const params = useSearchParams();
  const reason = params.get("reason") || "payment_cancelled";

  useEffect(() => {
    clearCheckoutQueue();
  }, []);

  const reasonText: Record<string, string> = {
    payment_cancelled: "Payment was cancelled.",
    verification_failed: "We couldn't verify this payment.",
  };

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
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 style={{ color: "#dc2626", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Payment Failed</h1>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>
          {reasonText[reason] ?? "Something went wrong with your payment."}
        </p>

        {reason !== "payment_cancelled" && (
          <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
            If any amount was deducted, it will be refunded within 1–2 working days.
          </p>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/cart/payment"
            style={{ flex: 1, padding: 12, borderRadius: 6, background: "#1a56db", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
          >
            Try Again
          </Link>
          <Link
            href="/cart"
            style={{ flex: 1, padding: 12, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#222", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <FailedContent />
    </Suspense>
  );
}