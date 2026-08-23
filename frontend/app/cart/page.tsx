"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFoodCart } from "../context/FoodCartContext";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    selectedIds,
    toggleSelect,
    selectAll,
    deselectAll,
    deleteSelected,
    updateQuantity,
    removeItem,
    selectedCount,
    itemTotal,
    deliveryFee,
    platformFee,
    totalAmount,
  } = useFoodCart();

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: "#fafafa",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 6px",
          }}
        >
          Your cart is empty
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#6b7280",
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            background: "#1e40af",
            color: "#fff",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(30, 64, 175, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1e3a8a";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(30, 64, 175, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1e40af";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 1px 3px rgba(30, 64, 175, 0.2)";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "32px 24px 64px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#111827",
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #e5e7eb",
            color: "#374151",
            textDecoration: "none",
            transition: "all 0.15s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#d1d5db";
            e.currentTarget.style.background = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.background = "#fff";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            Shopping Cart
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 14,
              color: "#6b7280",
              fontWeight: 400,
            }}
          >
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Left: Items */}
        <div style={{ flex: 1, minWidth: 340 }}>
          {/* Select All Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              padding: "12px 16px",
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? deselectAll() : selectAll())}
                style={{
                  width: 18,
                  height: 18,
                  accentColor: "#1e40af",
                  cursor: "pointer",
                }}
              />
              Select All
            </label>
            <button
              onClick={deleteSelected}
              disabled={selectedCount === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                color: selectedCount === 0 ? "#d1d5db" : "#dc2626",
                cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: 8,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedCount > 0) {
                  e.currentTarget.style.background = "#fef2f2";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Delete Selected
            </button>
          </div>

          {/* Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 16,
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 2,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#1e40af",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 10,
                      flexShrink: 0,
                      background: "#f3f4f6",
                    }}
                  />

                  {/* Content */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                          marginBottom: 4,
                        }}
                      >
                        <h3
                          style={{
                            fontWeight: 600,
                            fontSize: 15,
                            margin: 0,
                            color: "#111827",
                            lineHeight: 1.35,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.name}
                        </h3>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#111827",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          Rs. {item.price * item.quantity}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#6b7280",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                        {item.variant ? ` · ${item.variant}` : ""}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#6b7280",
                        }}
                      >
                        Rs. {item.price} each
                      </span>

                      <div
                        style={{ display: "flex", alignItems: "center", gap: 10 }}
                      >
                        {/* Quantity Stepper */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            overflow: "hidden",
                            background: "#fff",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            style={{
                              width: 30,
                              height: 30,
                              border: "none",
                              background: "#fff",
                              cursor: "pointer",
                              fontSize: 16,
                              color: "#4b5563",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background 0.15s ease",
                              fontWeight: 300,
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#f9fafb")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "#fff")
                            }
                          >
                            −
                          </button>
                          <span
                            style={{
                              width: 34,
                              textAlign: "center",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            style={{
                              width: 30,
                              height: 30,
                              border: "none",
                              background: "#fff",
                              cursor: "pointer",
                              fontSize: 16,
                              color: "#4b5563",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background 0.15s ease",
                              fontWeight: 300,
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#f9fafb")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "#fff")
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            border: "none",
                            background: "transparent",
                            color: "#9ca3af",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fef2f2";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#9ca3af";
                          }}
                          title="Remove item"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 20,
              color: "#1e40af",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              padding: "8px 2px",
              borderRadius: 6,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#1e3a8a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#1e40af";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add more items
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div
          style={{
            width: 340,
            minWidth: 300,
            position: "sticky",
            top: 24,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              padding: 24,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: "0 0 20px",
                color: "#111827",
                letterSpacing: "-0.01em",
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "#6b7280" }}>
                  Subtotal{" "}
                  <span style={{ color: "#9ca3af", fontSize: 13 }}>
                    ({selectedCount} {selectedCount === 1 ? "item" : "items"})
                  </span>
                </span>
                <span
                  style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}
                >
                  Rs. {itemTotal}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "#6b7280" }}>Delivery Fee</span>
                <span
                  style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}
                >
                  Rs. {deliveryFee}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "#6b7280" }}>Platform Fee</span>
                <span
                  style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}
                >
                  Rs. {platformFee}
                </span>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #f3f4f6",
                paddingTop: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#1e40af",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Rs. {totalAmount}
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                lineHeight: 1.6,
                margin: "0 0 20px",
              }}
            >
              By placing your order, you agree to our{" "}
              <a
                href="#"
                style={{
                  color: "#1e40af",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="#"
                style={{
                  color: "#1e40af",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Conditions of Use
              </a>
              .
            </p>

            <button
              onClick={() => router.push("/cart/checkout")}
              disabled={selectedCount === 0}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                border: "none",
                background: selectedCount === 0 ? "#f3f4f6" : "#1e40af",
                color: selectedCount === 0 ? "#9ca3af" : "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                letterSpacing: "0.2px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedCount > 0) {
                  e.currentTarget.style.background = "#1e3a8a";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(30, 64, 175, 0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCount > 0) {
                  e.currentTarget.style.background = "#1e40af";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {selectedCount === 0
                ? "Select items to checkout"
                : `Proceed to Checkout (${selectedCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}