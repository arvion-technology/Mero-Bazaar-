"use client";

import Footer from "@/components/Footer";

export default function HelpPage() {
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: "white",
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
            Help Center
          </h1>

          {/* intro */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "40px",
            }}
          >
            Find answers to common questions about orders, payments,
            delivery, refunds, and account support.
          </p>

          {/* faq section */}
          <div
            style={{
              display: "grid",
              gap: "24px",
            }}
          >
            {/* FAQ 1 */}
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
                  fontSize: "22px",
                  marginBottom: "12px",
                }}
              >
                How can I place an order?
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Browse products, add items to your cart, and proceed
                to checkout using your preferred payment method.
              </p>
            </div>

            {/* FAQ 2 */}
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
                  fontSize: "22px",
                  marginBottom: "12px",
                }}
              >
                Which payment methods are supported?
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                We support eSewa, Khalti, connectIPS, and Cash on
                Delivery in selected areas.
              </p>
            </div>

            {/* FAQ 3 */}
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
                  fontSize: "22px",
                  marginBottom: "12px",
                }}
              >
                How long does delivery take?
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Delivery usually takes 1–3 business days inside
                Kathmandu Valley and 3–7 days outside the valley.
              </p>
            </div>

            {/* FAQ 4 */}
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
                  fontSize: "22px",
                  marginBottom: "12px",
                }}
              >
                How do I request a refund?
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
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