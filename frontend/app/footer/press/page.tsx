"use client";

import Footer from "@/components/Footer";

export default function PressPage() {
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: "#0f1523",
          color: "#fff",
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
            Press & Media
          </h1>

          {/* intro */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "32px",
            }}
          >
            Stay updated with the latest news, announcements,
            partnerships, and media coverage from HamroNepal Bazaar.
          </p>

          {/* press cards */}
          <div
            style={{
              display: "grid",
              gap: "24px",
            }}
          >
            {/* article 1 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  color: "#C0392B",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                March 2026
              </p>

              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "14px",
                }}
              >
                HamroNepal Bazaar Expands Delivery Across Nepal
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                HamroNepal Bazaar announced expanded nationwide
                delivery services to improve accessibility and
                customer experience in remote districts.
              </p>
            </div>

            {/* article 2 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  color: "#C0392B",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                January 2026
              </p>

              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "14px",
                }}
              >
                Partnership with Digital Payment Providers
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                The platform strengthened secure payment integration
                through partnerships with eSewa, Khalti, and connectIPS.
              </p>
            </div>

            {/* article 3 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  color: "#C0392B",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                October 2025
              </p>

              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "14px",
                }}
              >
                HamroNepal Bazaar Launches New Seller Program
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
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