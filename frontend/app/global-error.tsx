"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
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
          <div style={{ fontSize: 56, marginBottom: 8 }}>⚠️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6b7280", lineHeight: 1.6, margin: "0 0 24px" }}>
            An unexpected error occurred. Please reload the page.
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
            Reload
          </button>
          {error?.digest && (
            <details style={{ marginTop: 20, color: "#9ca3af", fontSize: 12 }}>
              <summary style={{ cursor: "pointer" }}>Technical details</summary>
              <code>{error.digest}</code>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}
