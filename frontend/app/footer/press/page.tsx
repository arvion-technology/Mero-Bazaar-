"use client";

import Footer from "@/components/Footer";

export default function PressPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 py-[60px] font-sans text-black">
        <div className="mx-auto max-w-[950px]">
          {/* heading */}
          <h1 className="mb-5 text-[42px] font-extrabold text-[#C0392B]">
            Press & Media
          </h1>

          {/* intro */}
          <p className="mb-8 text-[17px] leading-[1.8] text-black/75">
            Stay updated with the latest news, announcements,
            partnerships, and media coverage from HamroNepal Bazaar.
          </p>

          {/* press cards */}
          <div className="grid gap-6">
            {/* article 1 */}
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl">
              <p className="mb-2.5 font-bold text-[#C0392B]">March 2026</p>

              <h2 className="mb-3.5 text-2xl text-black">
                HamroNepal Bazaar Expands Delivery Across Nepal
              </h2>

              <p className="leading-[1.8] text-black/70">
                HamroNepal Bazaar announced expanded nationwide
                delivery services to improve accessibility and
                customer experience in remote districts.
              </p>
            </div>

            {/* article 2 */}
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl">
              <p className="mb-2.5 font-bold text-[#C0392B]">January 2026</p>

              <h2 className="mb-3.5 text-2xl text-black">
                Partnership with Digital Payment Providers
              </h2>

              <p className="leading-[1.8] text-black/70">
                The platform strengthened secure payment integration
                through partnerships with eSewa, Khalti, and connectIPS.
              </p>
            </div>

            {/* article 3 */}
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl">
              <p className="mb-2.5 font-bold text-[#C0392B]">October 2025</p>

              <h2 className="mb-3.5 text-2xl text-black">
                HamroNepal Bazaar Launches New Seller Program
              </h2>

              <p className="leading-[1.8] text-black/70">
                A new seller initiative was launched to help local
                Nepali businesses grow through online commerce.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}