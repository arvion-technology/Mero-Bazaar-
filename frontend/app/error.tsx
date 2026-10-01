"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console for diagnostics; never render the raw message to users.
    console.error("Page error:", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f7fb",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>😕</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#6b7280", lineHeight: 1.6, margin: "0 0 24px" }}>
          We hit an unexpected error. Please try again — if it keeps happening, contact support.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#C0392B",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
