"use client";

import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. What This Covers",
    items: [
      "Featured listing fees.",
      "Any other paid promotion or badge service we offer.",
    ],
  },
  {
    title: "2. What It Does Not Cover",
    text: "HamroNepal Bazaar does not handle payments between buyers and sellers. Those deals are outside our control, so please resolve them with the seller and follow the tips in our Safety Center.",
  },
  {
    title: "3. Eligible for a Refund",
    items: [
      "Payment was deducted but the service was not activated.",
      "Duplicate payment for the same service.",
      "We removed your listing for reasons not caused by you before the promotion started.",
    ],
  },
  {
    title: "4. Not Eligible",
    items: [
      "Listings removed for violating our Terms of Use.",
      "Change of mind after a promotion has started.",
      "Promotions that already ran for their paid period.",
    ],
  },
  {
    title: "5. How to Request a Refund",
    text: "Email support@merobazaar.com within 7 days with your registered phone or email, transaction ID, date, and amount. We aim to respond within 3 working days.",
  },
  {
    title: "6. How Refunds Are Paid",
    text: "Approved refunds are returned through the original payment method (eSewa, Khalti, or connectIPS). Timing depends on the payment provider.",
  },
];

export default function RefundPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 pt-8 pb-[60px] font-sans text-black">
        <div className="mx-auto max-w-[950px]">
          <h1 className="mb-2 text-[42px] font-extrabold text-[#C0392B]">
            Refund Policy
          </h1>
          <p className="mb-2 text-sm text-black/50">Last updated: September 28, 2026</p>
          <p className="mb-8 text-[17px] leading-relaxed text-black/75">
            This policy covers fees paid to HamroNepal Bazaar for paid services.
          </p>

          <div className="grid gap-4">
            {sections.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-black/10 bg-black/[0.02] p-5"
              >
                <h2 className="mb-2 text-[20px] text-black">{s.title}</h2>
                {s.text && <p className="leading-relaxed text-black/70">{s.text}</p>}
                {s.items && (
                  <ul className="list-disc space-y-1 pl-5 leading-relaxed text-black/70">
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}