"use client";

import Footer from "@/components/Footer";

export default function HelpPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 py-[60px] font-sans text-black">
        <div className="mx-auto max-w-[950px]">
          {/* heading */}
          <h1 className="mb-5 text-[42px] font-extrabold text-[#C0392B]">
            Help Center
          </h1>

          {/* intro */}
          <p className="mb-10 text-[17px] leading-[1.8] text-black/75">
            Find answers to common questions about orders, payments,
            delivery, refunds, and account support.
          </p>

          {/* faq section */}
          <div className="grid gap-6">
            {/* FAQ 1 */}
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl">
              <h2 className="mb-3 text-[22px] text-black">
                How can I place an order?
              </h2>

              <p className="leading-[1.8] text-black/70">
                Browse products, add items to your cart, and proceed
                to checkout using your preferred payment method.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl">
              <h2 className="mb-3 text-[22px] text-black">
                Which payment methods are supported?
              </h2>

              <p className="leading-[1.8] text-black/70">
                We support eSewa, Khalti, connectIPS, and Cash on
                Delivery in selected areas.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl">
              <h2 className="mb-3 text-[22px] text-black">
                How long does delivery take?
              </h2>

              <p className="leading-[1.8] text-black/70">
                Delivery usually takes 1–3 business days inside
                Kathmandu Valley and 3–7 days outside the valley.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.04] hover:shadow-xl">
              <h2 className="mb-3 text-[22px] text-black">
                How do I request a refund?
              </h2>

              <p className="leading-[1.8] text-black/70">
                Contact our support team within 7 days of delivery
                with your order details and issue description.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}