"use client";

import Footer from "@/components/Footer";
import { FiShoppingCart, FiHome, FiBriefcase, FiLock } from "react-icons/fi";

export default function AboutUsPage() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 pt-12 pb-16 font-sans text-[#1a1a1a]">
        <div className="mx-auto max-w-[950px]">
          {/* heading */}
          <div className="mt-6">
            <h1
              className="mb-[18px] rounded-2xl bg-cover bg-center px-5 py-[120px] text-center text-[42px] font-extrabold text-[#C0392B]"
              style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            >
              About Us
            </h1>
          </div>

          {/* intro */}
          <p className="mb-5 text-[17px] leading-[1.8] text-[#333]">
            HamroNepal Bazaar is a modern multi-service digital marketplace
            where people can <b>buy, sell, and explore opportunities</b> all in
            one platform.
          </p>

          <p className="mb-5 text-[17px] leading-[1.8] text-[#333]">
            We are more than just an e-commerce website — we connect users with
            products, real estate properties, job opportunities, and various
            services across Nepal.
          </p>

          <p className="mb-[30px] text-[17px] leading-[1.8] text-[#333]">
            Our goal is to make digital life simple, accessible, and reliable
            for everyone by bringing multiple essential services under one
            trusted platform.
          </p>

          {/* features */}
          <div className="mt-[30px] space-y-5">
            {/* card 1 */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#f7f7f7] p-[22px]">
              <h2 className="mb-2.5 flex items-center gap-2 text-[22px] text-[#1a1a1a]">
                <FiShoppingCart className="text-[#C0392B]" size={22} />
                Buy & Sell Marketplace
              </h2>
              <p className="leading-[1.7] text-[#444]">
                Discover products from local sellers or list your own items to
                reach customers across Nepal.
              </p>
            </div>

            {/* card 2 */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#f7f7f7] p-[22px]">
              <h2 className="mb-2.5 flex items-center gap-2 text-[22px] text-[#1a1a1a]">
                <FiHome className="text-[#C0392B]" size={22} />
                Property Listings
              </h2>
              <p className="leading-[1.7] text-[#444]">
                Find houses, rooms, land, and rentals easily in your preferred
                location.
              </p>
            </div>

            {/* card 3 */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#f7f7f7] p-[22px]">
              <h2 className="mb-2.5 flex items-center gap-2 text-[22px] text-[#1a1a1a]">
                <FiBriefcase className="text-[#C0392B]" size={22} />
                Job Opportunities
              </h2>
              <p className="leading-[1.7] text-[#444]">
                Explore job listings from companies and connect with employers
                easily.
              </p>
            </div>

            {/* card 4 */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#f7f7f7] p-[22px]">
              <h2 className="mb-2.5 flex items-center gap-2 text-[22px] text-[#1a1a1a]">
                <FiLock className="text-[#C0392B]" size={22} />
                Safe & Trusted Platform
              </h2>
              <p className="leading-[1.7] text-[#444]">
                We ensure secure payments, verified listings, and a smooth user
                experience.
              </p>
            </div>
          </div>

          {/* closing */}
          <p className="mt-10 text-base leading-[1.8] text-[#555]">
            HamroNepal Bazaar is built to empower people, businesses, and
            communities by connecting everything in one place.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}