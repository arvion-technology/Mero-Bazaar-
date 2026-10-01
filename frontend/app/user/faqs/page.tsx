import Footer from "@/components/Footer";

export const metadata = {
  title: "FAQs – HamroNepal Bazaar",
};

export default function FaqsPage() {
  const faqs = [
    ["How do I list an item?", "Go to Seller Dashboard → \"Add Listing\" and choose a category. Complete the required details and photos, then submit. Your listing goes live after review (and after KYC verification for your first listing)."],
    ["Why do I need KYC?", "Identity verification keeps the marketplace safe for buyers and sellers. Upload your ID and a selfie from the KYC section; approval is usually completed quickly by our team."],
    ["How do orders and payments work?", "Buyers can place orders or reservations directly on a listing. Payment is handled securely through our partners (eSewa, Khalti, ConnectIPS). Track everything from My Orders."],
    ["How do I track my order or delivery?", "Open My Orders and select the order. You'll see its current status (pending, confirmed, shipped, delivered) and any delivery tracking information the seller added."],
    ["How do I get a refund?", "Open the order and choose \"Raise a Dispute\". Our support team reviews the issue against the listing and messages, and processes approved refunds to your payment method."],
    ["How do I report a suspicious listing or user?", "Use the Report button on the listing or profile. Reports are reviewed by our moderation team, who may remove listings or suspend accounts."],
    ["Can I buy without an account?", "You can browse and view the cart as a guest, but you'll need to sign in to place an order or reservation at checkout."],
  ];

  return (
    <>
      <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "56px 24px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", color: "#1f2937" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#C0392B", marginBottom: 8 }}>Frequently Asked Questions</h1>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>Quick answers to the most common questions.</p>

          <div style={{ display: "grid", gap: 14 }}>
            {faqs.map(([q, a]) => (
              <details key={q} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
                <summary style={{ fontWeight: 700, cursor: "pointer", color: "#111827" }}>{q}</summary>
                <p style={{ lineHeight: 1.7, color: "#4b5563", marginTop: 10, marginBottom: 0 }}>{a}</p>
              </details>
            ))}
          </div>

          <p style={{ marginTop: 28, color: "#6b7280" }}>
            Still stuck? Contact us at <strong>support@hamronepalbazaar.com</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
