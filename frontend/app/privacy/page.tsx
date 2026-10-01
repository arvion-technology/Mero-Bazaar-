import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy – HamroNepal Bazaar",
};

export default function PrivacyPage() {
  return (
    <>
      <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "56px 24px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", color: "#1f2937" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#C0392B", marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>Last updated: October 2026</p>

          {[
            ["Information We Collect", "We collect the information you provide when you register, list an item, complete KYC, place an order, or contact support — such as your name, email, phone number, address, and verification documents. We also collect basic usage data (browser type, device, IP address) to keep the platform secure."],
            ["How We Use It", "Your information is used to operate the marketplace: to verify sellers (KYC), connect buyers and sellers, process orders and payments, send important notifications, and prevent fraud and abuse. We never sell your personal data."],
            ["KYC & Verification Documents", "Government-issued documents (PAN, photo, selfie) are stored outside the public website and are only accessible through authenticated, authorized endpoints. They are used solely to verify seller identity and are reviewed only by administrators."],
            ["Payments", "We do not store your card or wallet credentials. Payments are processed by our partners (eSewa, Khalti, ConnectIPS) through their secure gateways."],
            ["Data Retention & Your Rights", "You may request a copy, correction, or deletion of your personal data at any time by contacting support. We retain data only as long as necessary to provide the service and meet legal obligations."],
            ["Contact", "For privacy questions or requests, email support@hamronepalbazaar.com."],
          ].map(([h, b]) => (
            <section key={h} style={{ marginBottom: 26 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{h}</h2>
              <p style={{ lineHeight: 1.7, color: "#4b5563" }}>{b}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
