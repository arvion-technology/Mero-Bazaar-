"use client";

import Footer from "@/components/Footer";

export default function CareersPage() {
  return (
    <>
      <main className="min-h-screen bg-[#fff] px-6 py-[60px] font-sans">
        <div className="mx-auto max-w-[950px]">
          {/* heading */}
          <h1 className="mb-5 text-[42px] font-extrabold text-black">
            Careers at HamroNepal Bazaar
          </h1>

          {/* intro */}
          <p className="mb-6 text-[17px] leading-[1.8] text-black">
            Join our growing team and help build the future of Nepali
            e-commerce. We are passionate about technology, innovation,
            and creating the best shopping experience for customers
            across Nepal.
          </p>

          {/* open positions */}
          <div className="mt-10 grid gap-6">
            {/* job card 1 */}
            <div className="rounded-2xl border border-black/10 bg-white/40 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-2xl">
              <h2 className="mb-2.5 text-2xl text-black">Frontend Developer</h2>

              <p className="mb-[18px] leading-[1.7] text-black/70">
                Build beautiful and responsive interfaces using React
                and Next.js.
              </p>

              <button className="rounded-lg bg-[#C0392B] px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#a93226]">
                Apply Now
              </button>
            </div>

            {/* job card 2 */}
            <div className="rounded-2xl border border-black/10 bg-white/40 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-2xl">
              <h2 className="mb-2.5 text-2xl text-black">Customer Support Executive</h2>

              <p className="mb-[18px] leading-[1.7] text-black/70">
                Help customers with orders, payments, and platform
                support.
              </p>

              <button className="rounded-lg bg-[#C0392B] px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#a93226]">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}