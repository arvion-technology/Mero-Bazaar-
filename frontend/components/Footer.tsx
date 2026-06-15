import Link from "next/link";
import Image from "next/image";

const PRIMARY = "#C0392B";
const BG = "#0f1523"; // dark background color

// footer links organized by section
const footerLinks = {
  Company: [
{ label: "About Us", href: "/footer/about-us" },
{ label: "Careers", href: "/footer/careers"},
    { label: "Press", href: "/footer/press" },
  ],
  Support: [
    { label: "Help Center", href: "/footer/help-center" },
    { label: "Safety Center", href: "/safety" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

export default function Footer() {
  return (
    <>
      {/* all footer styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .hnb-footer {
          background: ${BG};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .hnb-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 24px 28px;
          display: flex;
          align-items: flex-start;
          gap: 48px;
          flex-wrap: wrap;
        }

        /* brand / logo section on the left */
        .hnb-footer-brand {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 180px;
          flex: 1.2;
        }
        .hnb-footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .hnb-footer-logo-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
        }
        .hnb-footer-logo-text { line-height: 1.15; }
        .hnb-footer-logo-line1 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: ${PRIMARY};
          letter-spacing: -0.2px;
        }
        .hnb-footer-logo-line2 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.2px;
        }
        .hnb-footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin-top: 4px;
          line-height: 1.5;
        }

        /* the 3 link columns - company, support, legal */
        .hnb-footer-cols {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
          flex: 2;
        }
        .hnb-footer-col { min-width: 110px; }
        .hnb-footer-col-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 14px;
          letter-spacing: 0.1px;
        }
        .hnb-footer-link {
          display: block;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          margin-bottom: 9px;
          transition: color 0.15s;
          line-height: 1.4;
        }
        .hnb-footer-link:hover { color: #ffffff; }

        /* payment methods section */
        .hnb-footer-payments {
          min-width: 180px;
          flex: 1;
        }
        .hnb-footer-payments-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 14px;
          letter-spacing: 0.1px;
        }
        .hnb-footer-payment-badges {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: nowrap;
        }

        /* esewa and other payment logos */
        .hnb-pay-img {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          transition: opacity 0.15s, transform 0.15s;
          cursor: default;
        }
        .hnb-pay-img:hover {
          opacity: 0.8;
          transform: translateY(-2px);
        }

        /* khalti needs a white background pill */
        .hnb-khalti-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          background: #ffffff;
          border-radius: 7px;
          padding: 0 10px;
          transition: opacity 0.15s, transform 0.15s;
          cursor: default;
        }
        .hnb-khalti-pill:hover { opacity: 0.85; transform: translateY(-2px); }

        /* connectIPS is just styled text - no image available */
        .hnb-cips {
          display: inline-flex;
          align-items: center;
          height: 36px;
          font-style: italic;
          font-size: 17px;
          letter-spacing: -0.3px;
          transition: opacity 0.15s, transform 0.15s;
          cursor: default;
        }
        .hnb-cips:hover { opacity: 0.8; transform: translateY(-2px); }
        .hnb-cips-connect {
          font-weight: 400;
          color: #ffffff;
        }
        .hnb-cips-ips {
          font-weight: 800;
          color: #e8392a;
        }

        /* copyright bar at the very bottom */
        .hnb-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 14px 24px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hnb-footer-bottom-text {
          font-size: 11.5px;
          color: rgba(255,255,255,0.3);
          text-align: center;
        }

        /* responsive - tablet */
        @media (max-width: 900px) {
          .hnb-footer-inner {
            gap: 32px;
            padding: 32px 20px 24px;
          }
          .hnb-footer-cols { gap: 28px; }
        }

        /* responsive - mobile */
        @media (max-width: 600px) {
          .hnb-footer-inner {
            flex-direction: column;
            gap: 28px;
          }
          .hnb-footer-brand { flex: unset; }
          .hnb-footer-payments { flex: unset; }
        }
      `}</style>

      <footer className="hnb-footer">
        <div className="hnb-footer-inner">

          {/* logo and copyright */}
          <div className="hnb-footer-brand">
            <Link href="/" className="hnb-footer-logo">
              {/* same logo svg as the navbar */}
              <svg className="hnb-footer-logo-icon" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
                <path
                  d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10
                     M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28
                     M10 10 Q10 19 10 28
                     M28 10 Q28 19 28 28
                     M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
                <circle cx="19" cy="19" r="3" fill="#fff" opacity="0.9" />
              </svg>
              <div className="hnb-footer-logo-text">
                <span className="hnb-footer-logo-line1">HamroNepal</span>
                <span className="hnb-footer-logo-line2">Bazaar</span>
              </div>
            </Link>
            <p className="hnb-footer-copy">
              © 2026 HamroNepal Bazaar. All rights reserved.
            </p>
          </div>

          {/* link columns - loop through footerLinks object */}
          <div className="hnb-footer-cols">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section} className="hnb-footer-col">
                <p className="hnb-footer-col-title">{section}</p>
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="hnb-footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* payment methods */}
          <div className="hnb-footer-payments">
            <p className="hnb-footer-payments-title">We Accept</p>
            <div className="hnb-footer-payment-badges">

              {/* esewa logo */}
              <span className="hnb-pay-img">
                <Image
                  src="/esewa_logo.png"
                  alt="eSewa"
                  width={90}
                  height={36}
                  style={{ objectFit: "contain", height: 36, width: "auto" }}
                />
              </span>

              {/* khalti needs white pill background */}
              <span className="hnb-khalti-pill">
                <Image
                  src="/Khalti.png"
                  alt="Khalti"
                  width={80}
                  height={28}
                  style={{ objectFit: "contain", height: 28, width: "auto" }}
                />
              </span>

              {/* connectIPS - styled as text since no logo */}
              <span className="hnb-cips">
                <span className="hnb-cips-connect">connect</span>
                <span className="hnb-cips-ips">IPS</span>
              </span>

            </div>
          </div>

        </div>
      </footer>
    </>
  );
}