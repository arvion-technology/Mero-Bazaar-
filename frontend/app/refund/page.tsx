import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund Policy – HamroNepal Bazaar",
};

export default function RefundPage() {
  return (
    <>
      <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "56px 24px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", color: "#1f2937" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#C0392B", marginBottom: 8 }}>Refund Policy</h1>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>Last updated: October 2026</p>

          {[
            ["Reservations & Deposits", "Vehicle and high-value item reservations may require a reservation fee. If you cancel before the reserved window expires, your reservation is released at no charge, subject to the seller's listing terms."],
            ["Delivery Orders", "If an order cannot be fulfilled, is materially not as described, or arrives damaged, you may open a dispute from the order page within the stated window. Our team reviews disputes against listing descriptions and messages between buyer and seller."],
            ["How to Request a Refund", "Go to My Orders → select the order → Raise a Dispute and describe the issue. Our support team will review and, where applicable, process a refund to your original payment method."],
            ["Processing Time", "Approved refunds are typically returned to your wallet or bank within 5–10 business days, depending on the payment provider."],
            ["Non-Refundable Items", "Digital goods, services already rendered, and items explicitly sold \"as is\" are generally non-refundable unless they violate these terms or applicable law."],
            ["Contact", "For refund questions, contact support@hamronepalbazaar.com with your order number."],
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
