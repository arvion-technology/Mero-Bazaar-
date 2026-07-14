"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FiUser, FiLock, FiBell, FiCreditCard, FiGlobe, FiMonitor,
  FiShield, FiTrash2, FiChevronRight, FiCamera, FiCheckCircle,
  FiAlertCircle, FiCalendar, FiMessageSquare, FiDownload,
  FiMenu, FiX, FiChevronDown, FiHome
} from "react-icons/fi";

const SITE_PRIMARY = "#C0392B";
const PRIMARY = "#0f172a";
const ACCENT = "#3b82f6";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";
const CARD_BG = "#ffffff";

/* ─── Settings Sub-Menu Items ─── */
const settingsMenu = [
  { id: "profile", icon: FiUser, label: "Profile" },
  { id: "security", icon: FiLock, label: "Security" },
  { id: "notifications", icon: FiBell, label: "Notification" },
  { id: "payment", icon: FiCreditCard, label: "Payment Methods" },
  { id: "bank", icon: FiHome, label: "Bank account" },
  { id: "language", icon: FiGlobe, label: "Language & Region" },
];

const accountMenu = [
  { id: "appearance", icon: FiMonitor, label: "Appearance" },
  { id: "privacy", icon: FiShield, label: "Privacy" },
  { id: "delete", icon: FiTrash2, label: "Delete Account" },
];

/* ─── Account Status Data ─── */
const accountStatus = [
  { label: "Email Verified", status: "verified", color: SUCCESS },
  { label: "Phone verified", status: "verified", color: SUCCESS },
  { label: "KYC Verified", status: "pending", color: WARNING },
];

/* ─── Quick Actions ─── */
const quickActions = [
  { label: "Profile", href: "#profile", icon: FiUser },
  { label: "Security", href: "#security", icon: FiLock },
  { label: "Contact Support", href: "#", icon: FiMessageSquare },
  { label: "Download Account Date", href: "#", icon: FiDownload },
];

export default function SellerSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    fullName: "Sandhya Yadav",
    email: "s***y@gmail.com",
    phone: "+977 9845855324",
    dob: "1999-05-12",
    gender: "Female",
    location: "Kathmandu, Bagmati, Nepal",
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSave = () => {
    console.log("Saving profile:", profileData);
  };

  return (
    <>
      <style>{`
        .settings-page {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        /* ─── Left Settings Menu ─── */
        .settings-left {
          width: 200px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
        }

        .settings-menu-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          padding-left: 8px;
        }

        .settings-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          border-radius: 8px;
          margin-bottom: 1px;
          text-decoration: none;
        }

        .settings-menu-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .settings-menu-item.active {
          background: #fee2e2;
          color: ${SITE_PRIMARY};
          font-weight: 600;
        }

        .settings-menu-icon {
          font-size: 15px;
          width: 18px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .settings-menu-sep {
          height: 1px;
          background: #f1f5f9;
          margin: 14px 0;
        }

        /* ─── Right Content ─── */
        .settings-right {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ─── Profile Card ─── */
        .settings-profile-card {
          background: ${CARD_BG};
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #f1f5f9;
        }

        .settings-profile-title {
          font-size: 15px;
          font-weight: 600;
          color: ${PRIMARY};
          margin-bottom: 20px;
        }

        .settings-profile-body {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }

        /* Avatar Column */
        .settings-avatar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding-top: 4px;
        }

        .settings-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${SITE_PRIMARY}, #e74c3c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          position: relative;
          overflow: hidden;
          border: 2px solid #f1f5f9;
          cursor: pointer;
          flex-shrink: 0;
        }

        .settings-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .settings-avatar-camera {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 22px;
          height: 22px;
          background: ${SITE_PRIMARY};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 10px;
          border: 2px solid #fff;
        }

        .settings-avatar-hint {
          font-size: 9px;
          color: #94a3b8;
          text-align: center;
          line-height: 1.3;
          max-width: 80px;
        }

        /* Form Grid */
        .settings-form-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
          min-width: 0;
        }

        .settings-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .settings-field-label {
          font-size: 11px;
          font-weight: 500;
          color: #475569;
        }

        .settings-field input,
        .settings-field select {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          color: #334155;
          font-family: inherit;
          background: #fff;
          width: 100%;
          box-sizing: border-box;
          outline: none;
        }

        .settings-field input:focus,
        .settings-field select:focus {
          border-color: #cbd5e1;
        }

        .settings-save-btn {
          margin-top: 4px;
          padding: 8px 20px;
          background: ${SITE_PRIMARY};
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          grid-column: 1;
          justify-self: start;
          transition: background 0.15s;
        }

        .settings-save-btn:hover {
          background: #a93226;
        }

        /* ─── Bottom Row: Status + Quick Actions ─── */
        .settings-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Account Status Card */
        .settings-status-card {
          background: ${CARD_BG};
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #f1f5f9;
        }

        .settings-status-title {
          font-size: 15px;
          font-weight: 600;
          color: ${PRIMARY};
          margin-bottom: 14px;
        }

        .settings-status-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 0;
        }

        .settings-status-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #475569;
          font-weight: 500;
        }

        .settings-status-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
          flex-shrink: 0;
        }

        .settings-status-right {
          font-size: 12px;
          font-weight: 500;
        }

        .settings-status-right.verified {
          color: ${SUCCESS};
        }

        .settings-status-right.pending {
          color: ${WARNING};
        }

        .settings-member-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0 0;
          margin-top: 8px;
          border-top: 1px solid #f8fafc;
        }

        .settings-member-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #475569;
          font-weight: 500;
        }

        .settings-member-right {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        /* Quick Actions Card */
        .settings-quick-card {
          background: ${CARD_BG};
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #f1f5f9;
        }

        .settings-quick-title {
          font-size: 15px;
          font-weight: 600;
          color: ${PRIMARY};
          margin-bottom: 12px;
        }

        .settings-quick-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: color 0.15s;
        }

        .settings-quick-item:hover {
          color: ${SITE_PRIMARY};
        }

        .settings-quick-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #475569;
          font-weight: 500;
        }

        .settings-quick-left svg {
          color: #94a3b8;
          font-size: 15px;
        }

        .settings-quick-arrow {
          color: #94a3b8;
          font-size: 14px;
        }

        /* ─── Mobile ─── */
        .settings-mobile-toggle {
          display: none;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: ${CARD_BG};
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: ${PRIMARY};
          cursor: pointer;
          margin-bottom: 16px;
          width: 100%;
          font-family: inherit;
        }

        .settings-mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(3px);
          z-index: 90;
        }

        .settings-mobile-overlay.active {
          display: block;
        }

        .settings-mobile-drawer {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 80%;
          max-width: 280px;
          height: 100vh;
          background: ${CARD_BG};
          z-index: 100;
          padding: 16px;
          box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          transform: translateX(-100%);
          transition: transform 0.25s ease;
          overflow-y: auto;
        }

        .settings-mobile-drawer.open {
          transform: translateX(0);
        }

        .settings-mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .settings-mobile-drawer-title {
          font-size: 15px;
          font-weight: 700;
          color: ${PRIMARY};
        }

        .settings-mobile-close {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: none;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
        }

        /* ─── Responsive ─── */
        @media (max-width: 1023px) {
          .settings-page {
            flex-direction: column;
            gap: 0;
          }
          .settings-left {
            display: none;
          }
          .settings-mobile-toggle {
            display: flex;
          }
          .settings-mobile-drawer {
            display: block;
          }
          .settings-profile-body {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .settings-avatar-col {
            padding-top: 0;
          }
          .settings-form-grid {
            width: 100%;
          }
          .settings-bottom-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .settings-profile-card,
          .settings-status-card,
          .settings-quick-card {
            padding: 16px;
            border-radius: 10px;
          }
          .settings-form-grid {
            grid-template-columns: 1fr;
          }
          .settings-profile-title,
          .settings-status-title,
          .settings-quick-title {
            font-size: 14px;
          }
          .settings-field input,
          .settings-field select {
            font-size: 16px;
            padding: 10px 12px;
          }
          .settings-save-btn {
            width: 100%;
            justify-self: stretch;
          }
          .settings-avatar {
            width: 64px;
            height: 64px;
            font-size: 22px;
          }
          .settings-avatar-camera {
            width: 20px;
            height: 20px;
          }
        }

        @media (max-width: 480px) {
          .settings-profile-card,
          .settings-status-card,
          .settings-quick-card {
            padding: 14px;
          }
          .settings-status-item {
            padding: 6px 0;
          }
          .settings-quick-item {
            padding: 8px 0;
          }
        }
      `}</style>

      {/* Mobile Overlay */}
      <div
        className={`settings-mobile-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div ref={mobileMenuRef} className={`settings-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="settings-mobile-drawer-header">
          <span className="settings-mobile-drawer-title">Settings</span>
          <button className="settings-mobile-close" onClick={() => setMobileMenuOpen(false)}>
            <FiX size={16} />
          </button>
        </div>
        <div className="settings-menu-label">Menu</div>
        {settingsMenu.map((item) => (
          <button
            key={item.id}
            className={`settings-menu-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
          >
            <span className="settings-menu-icon"><item.icon size={15} /></span>
            <span>{item.label}</span>
          </button>
        ))}
        <div className="settings-menu-sep" />
        <div className="settings-menu-label">Account</div>
        {accountMenu.map((item) => (
          <button
            key={item.id}
            className={`settings-menu-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
          >
            <span className="settings-menu-icon"><item.icon size={15} /></span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-page">
        {/* ─── Left Settings Menu (Desktop) ─── */}
        <aside className="settings-left">
          <div className="settings-menu-label">Menu</div>
          {settingsMenu.map((item) => (
            <button
              key={item.id}
              className={`settings-menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="settings-menu-icon"><item.icon size={15} /></span>
              <span>{item.label}</span>
            </button>
          ))}
          <div className="settings-menu-sep" />
          <div className="settings-menu-label">Account</div>
          {accountMenu.map((item) => (
            <button
              key={item.id}
              className={`settings-menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="settings-menu-icon"><item.icon size={15} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* ─── Right Content ─── */}
        <div className="settings-right">
          {/* Mobile Toggle */}
          <button
            className="settings-mobile-toggle"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu size={16} />
            <span>Settings Menu</span>
            <FiChevronDown size={14} style={{ marginLeft: "auto" }} />
          </button>

          {/* Profile Information Card */}
          <div className="settings-profile-card">
            <h2 className="settings-profile-title">Profile Information</h2>
            <div className="settings-profile-body">
              {/* Avatar Column */}
              <div className="settings-avatar-col">
                <div className="settings-avatar" onClick={() => fileInputRef.current?.click()}>
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="avatar" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" alt="avatar" />
                  )}
                  <div className="settings-avatar-camera"><FiCamera size={10} /></div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) console.log("Upload avatar:", file.name);
                  }}
                />
              </div>

              {/* Form Fields */}
              <div className="settings-form-grid">
                <div className="settings-field">
                  <label className="settings-field-label">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label className="settings-field-label">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label className="settings-field-label">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label className="settings-field-label">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dob}
                    onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label className="settings-field-label">Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="settings-field">
                  <label className="settings-field-label">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>
                <button className="settings-save-btn" onClick={handleSave}>
                  Save Change
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Account Status + Quick Actions */}
          <div className="settings-bottom-row">
            {/* Account Status */}
            <div className="settings-status-card">
              <h3 className="settings-status-title">Account Status</h3>
              {accountStatus.map((item) => (
                <div key={item.label} className="settings-status-item">
                  <div className="settings-status-left">
                    <span className="settings-status-dot" style={{ background: item.color }}>
                      {item.status === "verified" ? <FiCheckCircle size={10} /> : <FiAlertCircle size={10} />}
                    </span>
                    {item.label}
                  </div>
                  <span className={`settings-status-right ${item.status}`}>
                    {item.status === "verified" ? "Verified" : "Pending"}
                  </span>
                </div>
              ))}
              <div className="settings-member-row">
                <div className="settings-member-left">
                  <FiCalendar size={15} color="#94a3b8" />
                  Member Since
                </div>
                <span className="settings-member-right">May 2024</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="settings-quick-card">
              <h3 className="settings-quick-title">Quick Actions</h3>
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href} className="settings-quick-item">
                  <div className="settings-quick-left">
                    <action.icon size={15} />
                    {action.label}
                  </div>
                  <FiChevronRight size={15} className="settings-quick-arrow" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}