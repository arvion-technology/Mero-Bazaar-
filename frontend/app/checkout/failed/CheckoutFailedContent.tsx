"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutFailedContent() {
  const reason = useSearchParams().get("reason");

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 14px rgba(0,0,0,.07)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: "#C0392B" }}>Payment failed</h1>
        <p style={{ fontSize: 13.5, color: "#666", marginBottom: 20 }}>
          {reason === "payment_cancelled"
            ? "The payment was cancelled or not completed."
            : "We couldn't verify this payment. If you were charged, contact support."}
        </p>
        <Link href="/" style={{ color: "#C0392B", fontWeight: 600 }}>← Back to home</Link>
      </div>
    </div>
  );
}