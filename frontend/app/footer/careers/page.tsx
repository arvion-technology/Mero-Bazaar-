"use client";

import Footer from "@/components/Footer";

export default function CareersPage() {
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
        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto",
          }}
        >
          {/* heading */}
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "800",
              marginBottom: "20px",
              color: "#C0392B",
            }}
          >
            Careers at HamroNepal Bazaar
          </h1>

          {/* intro */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "24px",
            }}
          >
            Join our growing team and help build the future of Nepali
            e-commerce. We are passionate about technology, innovation,
            and creating the best shopping experience for customers
            across Nepal.
          </p>

          {/* open positions */}
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gap: "24px",
            }}
          >
            {/* job card 1 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "10px",
                }}
              >
                Frontend Developer
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: "1.7",
                  marginBottom: "18px",
                }}
              >
                Build beautiful and responsive interfaces using React
                and Next.js.
              </p>

              <button
                style={{
                  background: "#C0392B",
                  border: "none",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Apply Now
              </button>
            </div>

            {/* job card 2 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "10px",
                }}
              >
                Customer Support Executive
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: "1.7",
                  marginBottom: "18px",
                }}
              >
                Help customers with orders, payments, and platform
                support.
              </p>

              <button
                style={{
                  background: "#C0392B",
                  border: "none",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
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