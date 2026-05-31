"use client";

import { FiUsers, FiFileText, FiMapPin, FiHeadphones } from "react-icons/fi";
import { TbLayoutGrid } from "react-icons/tb";
import { FaGooglePlay, FaApple } from "react-icons/fa";

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
              <FiUsers className="sab-stat-icon" size={34} color="#9aa3b8" />
              <div>
                <div className="sab-stat-number">1M+</div>
                <div className="sab-stat-label">Happy Users</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 50K+ Active Listings */}
            <div className="sab-stat-item">
              <FiFileText className="sab-stat-icon" size={34} color="#9aa3b8" />
              <div>
                <div className="sab-stat-number">50K+</div>
                <div className="sab-stat-label">Active Listings</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 18 Categories */}
            <div className="sab-stat-item">
              <TbLayoutGrid className="sab-stat-icon" size={34} color="#9aa3b8" />
              <div>
                <div className="sab-stat-number">18</div>
                <div className="sab-stat-label">Categories</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 200+ Cities & Towns */}
            <div className="sab-stat-item">
              <FiMapPin className="sab-stat-icon" size={34} color="#9aa3b8" />
              <div>
                <div className="sab-stat-number">200+</div>
                <div className="sab-stat-label">Cities &amp; Towns</div>
              </div>
            </div>

            <div className="sab-stat-divider" />

            {/* 24/7 Customer Support */}
            <div className="sab-stat-item">
              <FiHeadphones className="sab-stat-icon" size={34} color="#9aa3b8" />
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
              <FaGooglePlay size={24} color="#fff" />
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
              <FaApple size={24} color="#fff" />
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
