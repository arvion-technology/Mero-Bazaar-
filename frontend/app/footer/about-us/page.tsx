"use client";

import Footer from "@/components/Footer";

export default function AboutUsPage() {
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: "#6c8dd7",
          // color: "#fff",
          padding: "60px 24px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
          {/* heading */}
          <div >
            <h1
            style={{
              fontSize: "42px",
              fontWeight: "800",
              
              textAlign:"center",
              marginBottom: "18px",
              color: "#C0392B",
              backgroundImage:"url('/hero-bg.jpg')",
              
              backgroundSize:"cover",
              backgroundPosition:"center",
                  padding: "120px 20px",
                      borderRadius: "16px",



        
          
            }}
          >
            About Us
          </h1>
          </div>

          {/* intro */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "20px",
            }}
          >
            HamroNepal Bazaar is a modern multi-service digital marketplace
            where people can <b>buy, sell, and explore opportunities</b> all in
            one platform.
          </p>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "20px",
            }}
          >
            We are more than just an e-commerce website — we connect users with
            products, real estate properties, job opportunities, and various
            services across Nepal.
          </p>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "30px",
            }}
          >
            Our goal is to make digital life simple, accessible, and reliable
            for everyone by bringing multiple essential services under one
            trusted platform.
          </p>

          {/* features */}
          <div
            style={{
              display: "grid",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {/* card 1 */}
            <div
              style={{
                padding: "22px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
                🛒 Buy & Sell Marketplace
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                Discover products from local sellers or list your own items to
                reach customers across Nepal.
              </p>
            </div>

            {/* card 2 */}
            <div
              style={{
                padding: "22px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
                🏠 Property Listings
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                Find houses, rooms, land, and rentals easily in your preferred
                location.
              </p>
            </div>

            {/* card 3 */}
            <div
              style={{
                padding: "22px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
                💼 Job Opportunities
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                Explore job listings from companies and connect with employers
                easily.
              </p>
            </div>

            {/* card 4 */}
            <div
              style={{
                padding: "22px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
                🔒 Safe & Trusted Platform
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                We ensure secure payments, verified listings, and a smooth user
                experience.
              </p>
            </div>
          </div>

          {/* closing */}
          <p
            style={{
              marginTop: "40px",
              fontSize: "16px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.8",
            }}
          >
            HamroNepal Bazaar is built to empower people, businesses, and
            communities by connecting everything in one place.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
} 