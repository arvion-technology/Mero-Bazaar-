import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Use – HamroNepal Bazaar",
};

export default function TermsPage() {
  return (
    <>
      <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "56px 24px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", color: "#1f2937" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#C0392B", marginBottom: 8 }}>Terms of Use</h1>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>Last updated: October 2026</p>

          {[
            ["Acceptance", "By accessing or using HamroNepal Bazaar, you agree to these Terms of Use. If you do not agree, please do not use the platform."],
            ["Accounts & Eligibility", "You must be at least 18 years old to open an account. You are responsible for keeping your credentials secure and for all activity under your account. Provide accurate information and keep it up to date."],
            ["Buying & Selling", "Sellers must complete identity verification (KYC) before publishing listings, and are responsible for the accuracy, legality, and quality of their listings. Buyers are responsible for reviewing listings and communicating safely before transacting."],
            ["Prohibited Conduct", "You may not post false, fraudulent, illegal, or infringing content; attempt to defraud other users; scrape or abuse the platform; or interfere with its security or operation. We may suspend or terminate accounts that violate these terms."],
            ["Payments & Disputes", "Payments are processed by third-party providers and are subject to their terms. Use our in-platform ordering, reservation, and dispute tools for protected transactions."],
            ["Liability", "The platform is provided on an \"as is\" basis. We facilitate connections between buyers and sellers but are not a party to transactions between them, except where we provide buyer/seller protection features."],
            ["Changes", "We may update these Terms from time to time. Continued use after changes constitutes acceptance. Contact support@hamronepalbazaar.com with questions."],
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
