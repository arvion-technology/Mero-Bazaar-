"use client";

import Footer from "@/components/Footer";
import { FiMail, FiPhone, FiClock, FiMapPin } from "react-icons/fi";

const contacts = [
  {
    icon: FiMail,
    title: "Email",
    text: "support@merobazaar.com",
    href: "mailto:support@merobazaar.com",
  },
  {
    icon: FiPhone,
    title: "Phone / WhatsApp",
    text: "+977-XXXXXXXXXX",
    href: "tel:+977XXXXXXXXXX",
  },
  {
    icon: FiClock,
    title: "Support Hours",
    text: "Sunday – Friday, 10:00 AM – 5:00 PM (NPT)",
  },
  {
    icon: FiMapPin,
    title: "Office",
    text: "Kathmandu, Nepal",
  },
];

export default function ContactPage() {
  return (
    <>
        <main className="min-h-screen bg-white px-8 pt-8 pb-[60px] font-sans text-black">        <div className="mx-auto max-w-[950px]">
          <h1 className="mb-5 text-[42px] font-extrabold text-[#C0392B]">
            Contact Us
          </h1>

          <p className="mb-8 text-[17px] leading-relaxed text-black/75">
            We&apos;re here to help. Reach us through any of the options below.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map(({ icon: Icon, title, text, href }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl"
              >
                <h2 className="mb-2 flex items-center gap-2 text-[20px] text-black">
                  <Icon className="text-[#C0392B]" size={20} />
                  {title}
                </h2>
                {href ? (
                  <a href={href} className="leading-relaxed text-black/70 hover:text-[#C0392B]">
                    {text}
                  </a>
                ) : (
                  <p className="leading-relaxed text-black/70">{text}</p>
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