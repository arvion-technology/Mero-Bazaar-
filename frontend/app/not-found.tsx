import Link from "next/link";
import { FiHome, FiSearch } from "react-icons/fi";

export default function NotFound() {
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
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(95deg, #ff6b6b 0%, #C0392B 60%, #ff8c42 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 12,
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>
          Page not found
        </h1>
        <p style={{ color: "#6b7280", lineHeight: 1.6, margin: "0 0 24px" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#C0392B",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            <FiHome size={16} /> Back to home
          </Link>
          <Link
            href="/search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              color: "#1a1a1a",
              padding: "12px 20px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              border: "1px solid #e5e7eb",
            }}
          >
            <FiSearch size={16} /> Search
          </Link>
        </div>
      </div>
    </main>
  );
}
