import Footer from "@/components/Footer";

export const metadata = {
  title: "Safety Center – HamroNepal Bazaar",
};

export default function SafetyPage() {
  const tips = [
    "Communicate through the platform's messaging so there is a record of your conversation.",
    "Meet in public, well-lit places and bring someone with you for high-value items.",
    "Never share OTPs, passwords, or payment credentials with anyone.",
    "Inspect items in person and verify documentation (e.g. vehicle blue book, receipts) before paying.",
    "Use our in-platform ordering, reservation, and payment tools for protected transactions.",
    "Avoid paying full amount in advance for items you have not received.",
    "Report suspicious listings, users, or messages using the Report button.",
  ];

  return (
    <>
      <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "56px 24px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", color: "#1f2937" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#C0392B", marginBottom: 8 }}>Safety Center</h1>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>Your safety is our priority. Follow these guidelines for a safe experience on HamroNepal Bazaar.</p>

          <div style={{ display: "grid", gap: 14 }}>
            {tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 14, background: "#fff", padding: "16px 18px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "#C0392B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{i + 1}</span>
                <p style={{ lineHeight: 1.6, color: "#4b5563", margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 28, color: "#6b7280" }}>
            If you feel unsafe or encounter a problem, contact support at <strong>support@hamronepalbazaar.com</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
