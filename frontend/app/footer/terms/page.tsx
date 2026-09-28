"use client";

import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. About HamroNepal Bazaar",
    text: "HamroNepal Bazaar is an online marketplace that connects buyers and sellers across Nepal. We do not own, sell, or inspect the items or services listed, and we are not a party to transactions between users.",
  },
  {
    title: "2. Eligibility & Accounts",
    items: [
      "You must be at least 18 years old to create an account or post listings.",
      "You are responsible for keeping your password and 2FA codes secure.",
      "You must provide accurate information. Accounts with false details may be suspended.",
    ],
  },
  {
    title: "3. Seller Verification (KYC)",
    text: "Sellers may be asked to submit identity or business documents such as PAN or professional certificates. Verified sellers receive a badge. We may reject, suspend, or revoke verification if documents are false or invalid.",
  },
  {
    title: "4. Listing Rules",
    items: [
      "Listings must be accurate, lawful, and include genuine photos and prices.",
      "Some categories require specific fields, such as a salary range for jobs or at least one photo for secondhand goods.",
      "We may remove or reject any listing that breaks these rules without prior notice.",
    ],
  },
  {
    title: "5. Prohibited Items & Conduct",
    items: [
      "Illegal goods, stolen property, counterfeit items, weapons, and controlled substances.",
      "Fraud, misleading listings, spam, harassment, or abuse of other users.",
      "Scraping, hacking, or trying to bypass platform security.",
    ],
  },
  {
    title: "6. Fees & Payments",
    text: "Posting is free unless stated otherwise. Paid services such as featured listings are processed through eSewa, Khalti, or connectIPS. See our Refund Policy for details.",
  },
  {
    title: "7. Transactions Between Users",
    text: "Deals, payments, and deliveries between buyers and sellers are their own responsibility. We strongly recommend following the tips in our Safety Center.",
  },
  {
    title: "8. Limitation of Liability",
    text: "To the extent permitted by law, HamroNepal Bazaar is not liable for losses arising from user transactions, listing content, or service interruptions.",
  },
  {
    title: "9. Suspension & Termination",
    text: "We may suspend or terminate accounts that violate these terms. You can request deletion of your account at any time by contacting support.",
  },
  {
    title: "10. Governing Law",
    text: "These terms are governed by the laws of Nepal, and disputes fall under the jurisdiction of the courts of Nepal.",
  },
  {
    title: "11. Contact",
    text: "Questions about these terms? Email support@merobazaar.com.",
  },
];

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 pt-8 pb-[60px] font-sans text-black">
        <div className="mx-auto max-w-[950px]">
          <h1 className="mb-2 text-[42px] font-extrabold text-[#C0392B]">
            Terms of Use
          </h1>
          <p className="mb-2 text-sm text-black/50">Last updated: September 28, 2026</p>
          <p className="mb-8 text-[17px] leading-relaxed text-black/75">
            By using HamroNepal Bazaar you agree to these terms. Please read them carefully.
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