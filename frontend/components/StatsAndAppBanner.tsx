"use client";

export default function StatsAndAppBanner() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Stats Bar ── */
        .sab-stats {
          margin-left:30px;
          margin-right: 30px;
          border-radius: 20px;
          background: #1a1f2e;
          padding: 22px 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .sab-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .sab-stats-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .sab-stat-item {
          display: flex;
          align-items: center;
          gap: 13px;
          flex: 1;
          min-width: 140px;
        }
        .sab-stat-icon {
          flex-shrink: 0;
          opacity: 0.85;
        }
        .sab-stat-number {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.4px;
        }
        .sab-stat-label {
          font-size: 12.5px;
          font-weight: 400;
          color: #9aa3b8;
          margin-top: 2px;
        }
        .sab-stat-divider {
          width: 1px;
          height: 38px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        /* ── App Banner ── */
        .sab-app-banner {
          background: #f8f8f8;
          border-top: 1px solid #ececec;
          padding: 36px 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .sab-app-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }
        .sab-phone-wrap {
          flex-shrink: 0;
          width: 110px;
          position: relative;
          margin-bottom: -36px;
        }
        .sab-phone-img {
          width: 110px;
          object-fit: contain;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
        }
        .sab-app-text h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 4px;
          line-height: 1.25;
        }
        .sab-app-text p {
          font-size: 13.5px;
          color: #666;
          margin: 0;
          font-weight: 400;
        }
        .sab-store-btns {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .sab-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #111;
          color: #fff;
          border-radius: 10px;
          padding: 9px 18px;
          text-decoration: none;
          transition: background 0.2s, transform 0.18s;
          border: 1.5px solid #333;
        }
        .sab-store-btn:hover {
          background: #222;
          transform: translateY(-2px);
        }
        .sab-store-btn-label {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .sab-store-btn-sub {
          font-size: 10px;
          font-weight: 400;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sab-store-btn-name {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .sab-stats-grid { justify-content: center; gap: 12px; }
          .sab-stat-divider { display: none; }
          .sab-stat-item { min-width: 120px; }
        }
        @media (max-width: 680px) {
          .sab-app-inner { flex-direction: column; text-align: center; gap: 24px; }
          .sab-phone-wrap { margin-bottom: 0; }
          .sab-store-btns { justify-content: center; }
          .sab-app-text h3 { font-size: 17px; }
        }
        @media (max-width: 480px) {
          .sab-stats-grid { gap: 8px; }
          .sab-stat-number { font-size: 18px; }
          .sab-stat-item { min-width: 100px; }
        }
      `}</style>

      {/* ── Stats Bar ── */}
      <section className="sab-stats" aria-label="Platform statistics">
        <div className="sab-inner">
          <div className="sab-stats-grid">

            {/* 1M+ Happy Users */}
            <div className="sab-stat-item">
              <svg className="sab-stat-icon" width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="12" cy="12" r="5.5" stroke="#9aa3b8" strokeWidth="2" />
                <path d="M3 27c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="#9aa3b8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="11" r="4" stroke="#9aa3b8" strokeWidth="1.8" />
                <path d="M28 24c0-3.87-1.79-7-4-8.5" stroke="#9aa3b8" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <div>
                <div className="sab-stat-number">1M+</div>
                <div className="sab-stat-label">Happy Users</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 50K+ Active Listings */}
            <div className="sab-stat-item">
              <svg className="sab-stat-icon" width="34" height="34" viewBox="0 0 34 34" fill="none">
                <rect x="4" y="7" width="20" height="22" rx="3" stroke="#9aa3b8" strokeWidth="2" />
                <path d="M9 14h10M9 18h10M9 22h6" stroke="#9aa3b8" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="26" cy="26" r="5" fill="#27AE60" stroke="#1a1f2e" strokeWidth="1.5" />
                <path d="M23.5 26l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="sab-stat-number">50K+</div>
                <div className="sab-stat-label">Active Listings</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 18 Categories */}
            <div className="sab-stat-item">
              <svg className="sab-stat-icon" width="34" height="34" viewBox="0 0 34 34" fill="none">
                <rect x="3" y="3" width="12" height="12" rx="2.5" stroke="#9aa3b8" strokeWidth="2" />
                <rect x="19" y="3" width="12" height="12" rx="2.5" stroke="#9aa3b8" strokeWidth="2" />
                <rect x="3" y="19" width="12" height="12" rx="2.5" stroke="#9aa3b8" strokeWidth="2" />
                <rect x="19" y="19" width="12" height="12" rx="2.5" stroke="#9aa3b8" strokeWidth="2" />
              </svg>
              <div>
                <div className="sab-stat-number">18</div>
                <div className="sab-stat-label">Categories</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 200+ Cities & Towns */}
            <div className="sab-stat-item">
              <svg className="sab-stat-icon" width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="15" r="10" stroke="#9aa3b8" strokeWidth="2" />
                <path d="M17 5C17 5 12 11 12 15a5 5 0 0010 0c0-4-5-10-5-10z" stroke="#9aa3b8" strokeWidth="1.8" />
                <circle cx="17" cy="15" r="2.5" fill="#9aa3b8" />
                <path d="M4 28c3-3 13-3 13-3s10 0 13 3" stroke="#9aa3b8" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <div>
                <div className="sab-stat-number">200+</div>
                <div className="sab-stat-label">Cities &amp; Towns</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 24/7 Customer Support */}
            <div className="sab-stat-item">
              <svg className="sab-stat-icon" width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="17" r="13" stroke="#9aa3b8" strokeWidth="2" />
                <path d="M9 17c0-4.42 3.58-8 8-8" stroke="#9aa3b8" strokeWidth="2" strokeLinecap="round" />
                <path d="M25 17c0 4.42-3.58 8-8 8" stroke="#9aa3b8" strokeWidth="2" strokeLinecap="round" />
                <rect x="6" y="14" width="5" height="8" rx="2.5" stroke="#9aa3b8" strokeWidth="1.8" />
                <rect x="23" y="14" width="5" height="8" rx="2.5" stroke="#9aa3b8" strokeWidth="1.8" />
              </svg>
              <div>
                <div className="sab-stat-number">24/7</div>
                <div className="sab-stat-label">Customer Support</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── App Download Banner ── */}
      <section className="sab-app-banner" aria-label="Download app">
        <div className="sab-app-inner">
          {/* Phone mockup */}
          <div className="sab-phone-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/download.png"
              alt="HamroNepal Bazaar App on phone"
              className="sab-phone-img"
            />
          </div>

          {/* Text */}
          <div className="sab-app-text">
            <h3>Download HamroNepal Bazaar App</h3>
            <p>Buy, sell, book and connect — anywhere, anytime.</p>
          </div>

          {/* Store buttons */}
          <div className="sab-store-btns">
            {/* Google Play */}
            <a
              href="#"
              className="sab-store-btn"
              id="google-play-btn"
              aria-label="Get it on Google Play"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 1.35L13.9 12 3.18 22.65A2 2 0 012 21V3a2 2 0 011.18-1.65z" fill="#EA4335" />
                <path d="M20.5 10.27L17.5 8.6l-3.6 3.4 3.6 3.4 3.04-1.68A2 2 0 0020.5 10.27z" fill="#FBBC04" />
                <path d="M3.18 1.35L13.9 12 17.5 8.6 6.38.64A2 2 0 003.18 1.35z" fill="#4285F4" />
                <path d="M3.18 22.65A2 2 0 006.38 23.36l11.12-7.96L13.9 12 3.18 22.65z" fill="#34A853" />
              </svg>
              <div className="sab-store-btn-label">
                <span className="sab-store-btn-sub">GET IT ON</span>
                <span className="sab-store-btn-name">Google Play</span>
              </div>
            </a>

            {/* App Store */}
            <a
              href="#"
              className="sab-store-btn"
              id="app-store-btn"
              aria-label="Download on the App Store"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="sab-store-btn-label">
                <span className="sab-store-btn-sub">Download on the</span>
                <span className="sab-store-btn-name">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
