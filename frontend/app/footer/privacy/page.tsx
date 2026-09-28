"use client";

import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Information We Collect",
    items: [
      "Account data: name, email, phone number, password (stored hashed), profile photo.",
      "Social login data: basic profile details if you sign in with Google or Facebook.",
      "Verification data: identity or business documents and photos submitted for KYC.",
      "Listing data: photos, descriptions, prices, and the location you choose to publish.",
      "Technical data: IP address, device and browser information, and session activity.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    items: [
      "To create and secure your account, including sending OTP and 2FA codes.",
      "To verify sellers and prevent fraud.",
      "To display listings and let buyers contact sellers.",
      "To process payments and send security notifications.",
      "To improve the platform and meet legal obligations.",
    ],
  },
  {
    title: "3. Sharing",
    text: "We do not sell your personal data. We share it only with service providers we rely on (such as SMS, email, payment, and hosting providers) or when required by law. Contact details you put in a listing are visible to other users.",
  },
  {
    title: "4. KYC Documents",
    text: "Verification documents are used only for review and are never shown publicly. Access is limited to authorised administrators.",
  },
  {
    title: "5. Cookies & Sessions",
    text: "We use cookies and similar technologies to keep you signed in and protect your account. You can view and revoke your active sessions from your account settings.",
  },
  {
    title: "6. Data Retention",
    text: "We keep your data while your account is active and as long as needed for legal, security, and dispute purposes. Deleted accounts are removed or anonymised within a reasonable period.",
  },
  {
    title: "7. Your Rights",
    items: [
      "Access and correct your personal information.",
      "Request deletion of your account and data.",
      "Opt out of optional communications.",
    ],
  },
  {
    title: "8. Security",
    text: "We use encryption in transit, hashed passwords, and access controls. No system is perfectly secure, so please use a strong password and enable 2FA.",
  },
  {
    title: "9. Contact",
    text: "For privacy requests, email support@merobazaar.com.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 pt-8 pb-[60px] font-sans text-black">
        <div className="mx-auto max-w-[950px]">
          <h1 className="mb-2 text-[42px] font-extrabold text-[#C0392B]">
            Privacy Policy
          </h1>
          <p className="mb-2 text-sm text-black/50">Last updated: September 28, 2026</p>
          <p className="mb-8 text-[17px] leading-relaxed text-black/75">
            This policy explains what personal data HamroNepal Bazaar collects, why we collect it, and how we protect it.
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