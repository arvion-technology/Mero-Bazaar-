import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact Us – HamroNepal Bazaar",
};

export default function ContactPage() {
  const channels = [
    { icon: "✉️", label: "Email Support", value: "support@hamronepalbazaar.com", note: "We reply within 1–2 business days." },
    { icon: "📞", label: "Phone / WhatsApp", value: "+977 98XXXXXXXX", note: "Available 9 AM – 6 PM (Nepal Time)." },
    { icon: "🏢", label: "Office", value: "Kathmandu, Nepal", note: "Visit by appointment only." },
  ];

  return (
    <>
      <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "56px 24px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", color: "#1f2937" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#C0392B", marginBottom: 8 }}>Contact Us</h1>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>
            Have a question about an order, a listing, or your account? We&apos;re here to help.
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            {channels.map((c) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", padding: "18px 20px", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: 26 }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.label}</div>
                  <div style={{ color: "#111827" }}>{c.value}</div>
                  <div style={{ color: "#9ca3af", fontSize: 13 }}>{c.note}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 28, color: "#6b7280" }}>
            For the fastest help with a specific order, open that order and use <strong>Raise a Dispute</strong> so our team has the full context.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
