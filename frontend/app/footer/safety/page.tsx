"use client";

import Footer from "@/components/Footer";
import { FiShoppingBag, FiTag, FiAlertTriangle, FiFlag } from "react-icons/fi";

const sections = [
  {
    icon: FiShoppingBag,
    title: "Tips for Buyers",
    items: [
      "Meet in a public place and bring someone with you.",
      "Inspect the item, vehicle, or property in person before paying.",
      "Never pay in advance to someone you haven't met.",
      "Be careful with prices that look too good to be true.",
      "Look for the verified seller badge, but still use your judgment.",
    ],
  },
  {
    icon: FiTag,
    title: "Tips for Sellers",
    items: [
      "Never share OTPs, passwords, or 2FA codes with anyone, even someone claiming to be from HamroNepal Bazaar.",
      "Confirm payment has actually arrived before handing over an item.",
      "Use accurate photos and descriptions to avoid disputes.",
    ],
  },
  {
    icon: FiAlertTriangle,
    title: "Common Scams",
    items: [
      "Fake payment screenshots.",
      "Requests for a 'deposit' or 'delivery fee' upfront.",
      "Links to look-alike websites asking you to log in.",
      "Job offers that ask you to pay for training or registration.",
    ],
  },
  {
    icon: FiFlag,
    title: "Report a Problem",
    items: [
      "Use the report option on a listing to flag suspicious activity.",
      "Contact our support team with the listing link and details.",
      "If you've been defrauded, also report it to the Nepal Police Cyber Bureau.",
    ],
  },
];

export default function SafetyCenterPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 py-[60px] font-sans text-black">
        <div className="mx-auto max-w-[950px]">
          <h1 className="mb-5 text-[42px] font-extrabold text-[#C0392B]">
            Safety Center
          </h1>

          <p className="mb-10 text-[17px] leading-[1.8] text-black/75">
            Simple habits that keep your deals safe. Follow these tips whether
            you're buying, selling, or hiring.
          </p>

          <div className="grid gap-6">
            {sections.map(({ icon: Icon, title, items }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl"
              >
                <h2 className="mb-3 flex items-center gap-2 text-[22px] text-black">
                  <Icon className="text-[#C0392B]" size={22} />
                  {title}
                </h2>
                <ul className="list-disc space-y-1 pl-5 leading-[1.8] text-black/70">
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}