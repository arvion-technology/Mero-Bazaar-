"use client";

import Footer from "@/components/Footer";

const faqs = [
  {
    q: "How do I post a listing?",
    a: "Log in, choose a category, fill in the details, add photos, preview, and publish. Some categories require specific fields or at least one photo.",
  },
  {
    q: "How do I become a verified seller?",
    a: "Submit your KYC documents (such as PAN) from the seller dashboard. Once an admin approves them, your verified badge is applied automatically.",
  },
  {
    q: "My KYC was rejected. What now?",
    a: "You can resubmit anytime. Your previous details are pre-filled, so just fix the issue mentioned and submit again. Use clear photos where all text is readable.",
  },
  {
    q: "I didn't receive my OTP.",
    a: "Check that your phone number is correct, wait a minute, then request a new code. If it still doesn't arrive, contact support.",
  },
  {
    q: "I forgot my password.",
    a: "Use 'Forgot password' on the login page and follow the link sent to your email.",
  },
  {
    q: "How do I log out of other devices?",
    a: "Go to Account → Active Sessions to see where you're signed in and revoke any session you don't recognise.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Paid services like featured listings can be paid through eSewa and Khalti.",
  },
  {
    q: "I paid but my listing isn't featured.",
    a: "Contact support with your transaction ID and registered phone or email. See our Refund Policy for details.",
  },
];

export default function HelpPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 py-[60px] font-sans text-black">
        <div className="mx-auto max-w-[950px]">
          <h1 className="mb-5 text-[42px] font-extrabold text-[#C0392B]">
            Help Center
          </h1>

          <p className="mb-10 text-[17px] leading-[1.8] text-black/75">
            Find answers to common questions about your account, listings,
            seller verification, and payments.
          </p>

          <div className="grid gap-6">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl"
              >
                <h2 className="mb-3 text-[22px] text-black">{f.q}</h2>
                <p className="leading-[1.8] text-black/70">{f.a}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-base leading-[1.8] text-black/60">
            Can't find your answer?{" "}
            <a href="/footer/contact" className="font-semibold text-[#C0392B] hover:underline">
              Contact us
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}