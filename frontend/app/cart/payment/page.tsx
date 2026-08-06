"use client";

import { useRouter } from "next/navigation";
import { useFoodCart } from "../../context/FoodCartContext";
import { useEffect, useState } from "react";

const methods = [
  { id: "esewa" as const, name: "eSewa", logo: "/esewa_logo.png" },
  { id: "khalti" as const, name: "Khalti", logo: "/Khalti.png" },
  { id: "connectips" as const, name: "ConnectIPS", logo: "/logo_connectIPS.png" },
];

export default function CartPaymentPage() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, totalAmount, deliveryInfo } = useFoodCart();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePay = () => {
    if (!paymentMethod) return;
    const success = Math.random() > 0.2;
    const orderId = "ORD-2024-1256";
    const txn = `EPAY${Date.now()}`;
    if (success) {
      router.push(`/cart/payment/success?orderId=${orderId}&txn=${txn}&method=${paymentMethod}&amount=${totalAmount}`);
    } else {
      router.push(`/cart/payment/failed?reason=payment_cancelled&orderId=${orderId}&method=${paymentMethod}&amount=${totalAmount}`);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: isDesktop ? 20 : 16 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "#222", padding: 4 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Checkout</h1>
        </div>

        {/* Main layout */}
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: isDesktop ? 24 : 16,
            alignItems: "flex-start",
          }}
        >
          {/* Left column */}
          <div
            style={{
              flex: 1,
              minWidth: isDesktop ? 320 : "auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: isDesktop ? 20 : 16,
            }}
          >
            {/* Delivery summary */}
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: isDesktop ? 24 : 20,
                background: "#fff",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>Delivery Information</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                  gap: "8px 16px",
                  fontSize: 14,
                  color: "#555",
                }}
              >
                <div><strong>First Name:</strong> {deliveryInfo.firstName || "—"}</div>
                <div><strong>Region:</strong> {deliveryInfo.region || "—"}</div>
                <div><strong>Phone:</strong> {deliveryInfo.phone || "—"}</div>
                <div><strong>City:</strong> {deliveryInfo.city || "—"}</div>
                <div style={{ gridColumn: "1 / -1" }}><strong>Address:</strong> {deliveryInfo.address || "—"}</div>
              </div>
            </div>

            {/* Payment selection */}
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: isDesktop ? 24 : 20,
                background: "#fff",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>Select Payment</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {methods.map((m) => (
                  <label
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: paymentMethod === m.id ? "2px solid #1a56db" : "1px solid #e5e7eb",
                      cursor: "pointer",
                      background: paymentMethod === m.id ? "#f0f5ff" : "#fff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Bigger logo container with no border-radius clipping */}
                    <img
                      src={m.logo}
                      alt={m.name}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{m.name}</span>
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      style={{ width: 20, height: 20, accentColor: "#1a56db", cursor: "pointer", flexShrink: 0 }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div
            style={{
              width: isDesktop ? 320 : "100%",
              minWidth: isDesktop ? 280 : "auto",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
              boxSizing: "border-box",
              position: isDesktop ? "sticky" : "static",
              top: isDesktop ? 20 : "auto",
              alignSelf: isDesktop ? "flex-start" : "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Invoice and Contact Info</h2>
              <button
                onClick={() => router.push("/cart/checkout")}
                style={{ background: "none", border: "none", color: "#1a56db", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
              >
                Edit
              </button>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px" }}>Order details</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "#444" }}>
              <span>Item Total (3 items)</span>
              <span>Rs. 580</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 14, color: "#444" }}>
              <span>Delivery Fee</span>
              <span>Rs. 40</span>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800 }}>
                <span>Total Amount</span>
                <span style={{ color: "#1a56db" }}>Rs. {totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!paymentMethod}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 6,
                border: "none",
                background: !paymentMethod ? "#ccc" : "#1a56db",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: !paymentMethod ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Pay Now <span style={{ fontWeight: 800 }}>Rs {totalAmount}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </button>

            <p style={{ fontSize: 11, color: "#888", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
              By placing the order, you agree to our{" "}
              <a href="#" style={{ color: "#1a56db", textDecoration: "underline" }}>Terms & Conditions</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}