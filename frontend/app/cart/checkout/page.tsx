"use client";

import { useRouter } from "next/navigation";
import { useFoodCart } from "../../context/FoodCartContext";
import { useEffect, useState } from "react";

export default function CartCheckoutPage() {
  const router = useRouter();
  const { deliveryInfo, setDeliveryInfo, itemTotal, deliveryFee, totalAmount } = useFoodCart();
  const [isDesktop, setIsDesktop] = useState(false);
  
 
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!deliveryInfo.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!deliveryInfo.region?.trim()) {
      newErrors.region = "Region is required";
    }
    if (!deliveryInfo.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(deliveryInfo.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (10 digits)";
    }
    if (!deliveryInfo.city?.trim()) {
      newErrors.city = "City is required";
    }
    if (!deliveryInfo.address?.trim()) {
      newErrors.address = "Address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      router.push("/cart/payment");
    }
  };

  // Only allow digits in phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // strip all non-digits
    setDeliveryInfo({ phone: value });
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  // Prevent typing letters in phone field
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace", "Delete", "Tab", "Escape", "Enter",
      "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"
    ];
    if (allowedKeys.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Clear error when user types in other fields
  const handleChange = (field: string, value: string) => {
    setDeliveryInfo({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: `1px solid ${errors[fieldName] ? "#ef4444" : "#ddd"}`,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: errors[fieldName] ? "#fef2f2" : "#fff",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
    display: "block",
  };

  const errorStyle: React.CSSProperties = {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    display: "block",
    minHeight: 16,
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: isDesktop ? 20 : 16 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              color: "#222",
              padding: 4,
            }}
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
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            id="checkout-form"
            style={{
              flex: 1,
              minWidth: isDesktop ? 320 : "auto",
              width: "100%",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: isDesktop ? 24 : 20,
              background: "#fff",
              boxSizing: "border-box",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 20px" }}>Delivery Information</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  required
                  placeholder="Enter your first and last name"
                  style={inputStyle("firstName")}
                  value={deliveryInfo.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
                {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
              </div>
              <div>
                <label style={labelStyle}>Region</label>
                <input
                  required
                  placeholder="Please choose your region"
                  style={inputStyle("region")}
                  value={deliveryInfo.region || ""}
                  onChange={(e) => handleChange("region", e.target.value)}
                />
                {errors.region && <span style={errorStyle}>{errors.region}</span>}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  placeholder="Enter your phone number"
                  style={inputStyle("phone")}
                  value={deliveryInfo.phone || ""}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                />
                {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  required
                  placeholder="Please choose city"
                  style={inputStyle("city")}
                  value={deliveryInfo.city || ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {errors.city && <span style={errorStyle}>{errors.city}</span>}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Address</label>
              <input
                required
                placeholder="For Example"
                style={inputStyle("address")}
                value={deliveryInfo.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {errors.address && <span style={errorStyle}>{errors.address}</span>}
            </div>
          </form>

          {/* Summary */}
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
                onClick={() => router.push("/cart")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1a56db",
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Edit
              </button>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px" }}>Order details</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "#444" }}>
              <span>Item Total (3 items)</span>
              <span>Rs. {itemTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 14, color: "#444" }}>
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee}</span>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800 }}>
                <span>Total Amount</span>
                <span style={{ color: "#1a56db" }}>Rs. {totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 6,
                border: "none",
                background: "#1a56db",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}