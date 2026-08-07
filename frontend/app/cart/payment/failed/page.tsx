"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function FailedContent() {
  const params = useSearchParams();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const reason = params.get("reason") || "payment_cancelled";
  const orderId = params.get("orderId") || "ORD-2024-1256";
  const method = params.get("method") || "eSewa";
  const amount = params.get("amount") || "630";

  const date = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: 14,
    borderBottom: "1px solid #f0f0f0",
    gap: 12,
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)", // subtract navbar height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isDesktop ? "20px" : "16px",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderRadius: 16,
          padding: isDesktop ? "28px 32px" : "20px 20px",
          boxShadow: "0 2px 14px rgba(0,0,0,.07)",
          border: "1px solid #f0f0f0",
          boxSizing: "border-box",
        }}
      >
        {/* Failed icon */}
        <div
          style={{
            width: isDesktop ? 52 : 44,
            height: isDesktop ? 52 : 44,
            borderRadius: "50%",
            background: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
          }}
        >
          <svg
            width={isDesktop ? 26 : 22}
            height={isDesktop ? 26 : 22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1
          style={{
            color: "#dc2626",
            fontSize: isDesktop ? 20 : 18,
            fontWeight: 700,
            margin: "0 0 4px",
          }}
        >
          Payment Failed!
        </h1>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 2px" }}>
          We couldn&apos;t complete your payment.
        </p>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 16px" }}>
          Please try again
        </p>

        {/* Order details */}
        <div
          style={{
            textAlign: "left",
            border: "1px solid #eee",
            borderRadius: 10,
            padding: isDesktop ? "4px 20px" : "4px 16px",
            marginBottom: 16,
          }}
        >
          <div style={rowStyle}>
            <span style={{ color: "#555", flexShrink: 0 }}>Reason</span>
            <span style={{ fontWeight: 600, textAlign: "right" }}>
              {reason === "payment_cancelled"
                ? "Payment cancelled by user"
                : "Transaction declined"}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: "#555", flexShrink: 0 }}>Order ID</span>
            <span
              style={{
                fontWeight: 600,
                textAlign: "right",
                wordBreak: "break-all",
              }}
            >
              #{orderId}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: "#555", flexShrink: 0 }}>Payment Method</span>
            <span style={{ fontWeight: 600, textTransform: "capitalize" }}>
              {method}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={{ color: "#555", flexShrink: 0 }}>Paid Amount</span>
            <span style={{ fontWeight: 600 }}>Rs. {amount}</span>
          </div>
          <div style={{ ...rowStyle, borderBottom: "none" }}>
            <span style={{ color: "#555", flexShrink: 0 }}>Date & Time</span>
            <span style={{ fontWeight: 600, textAlign: "right" }}>{date}</span>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Link
            href="/cart/payment"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              background: "#1a56db",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            Try Again
          </Link>
          <Link
            href="/cart/checkout"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "#fff",
              color: "#222",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            Back to Checkout
          </Link>
        </div>

        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, margin: 0 }}>
          If the amount is deducted, it will be refunded within 1-2 working days.
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Loading…
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}