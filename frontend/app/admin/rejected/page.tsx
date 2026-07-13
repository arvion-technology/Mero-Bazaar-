"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FiGrid,
  FiCheckCircle,
  FiUser,
  FiBell,
  FiChevronRight,
  FiMenu,
  FiX,
  FiXCircle,
  FiLogOut,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiCheckSquare,
  FiUpload,
  FiHelpCircle,
  FiArrowLeft,
  FiShieldOff,
} from "react-icons/fi";
import { useParams } from "next/navigation";

const PRIMARY = "#0f172a";
const SITE_PRIMARY = "#C0392B";
const BG = "#f8f5f5";
const CARD_BG = "#ffffff";
const SIDEBAR_BG = "#ffffff";
const SIDEBAR_BORDER = "#e8e4e4";
const SIDEBAR_HOVER = "#f4f4f4";
const REJECTED_COLOR = "#ef4444";

const sidebarItems = [
  { id: "dashboard", icon: FiGrid, label: "Dashboard", active: false, href: "/admin" },
  { id: "verified", icon: FiCheckCircle, label: "Verified KYC", active: false, href: "/admin/verified" },
  { id: "unverified", icon: FiUser, label: "Unverified List", active: false, href: "/admin/unverified" },
  { id: "rejected", icon: FiXCircle, label: "Rejected List", active: true, href: "/admin/rejected" },
];

function HamroBazarLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="38" rx="8" fill={SITE_PRIMARY} />
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
  );
}

export default function RejectedKYCDetail() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("rejected");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  // Mock data matching the screenshot
  const kycData = {
    id: "KYC-2024-1256",
    applicantName: "Ramesh Adhikari",
    appliedOn: "May 23, 2024 • 10:30 AM",
    status: "Rejected",
    rejectionReason: "Document is unclear and some information is not readable.",
    reviewedOn: "May 24, 2024 • 02:15 PM",
    reviewedBy: "HamroNepal Verification Team",
    submittedDocuments: [
      { name: "Citizenship (Front)", file: "citizenship_front.jpg", status: "Rejected" },
      { name: "Citizenship (Back)", file: "citizenship_back.jpg", status: "Rejected" },
      { name: "Selfie with Document", file: "selfie_with_doc.jpg", status: "Rejected" },
    ],
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  function handleNavClick(id: string) {
    setActiveTab(id);
    setSidebarOpen(false);
  }

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading Rejected KYC Details...
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-page {
          min-height: 100vh;
          background: ${BG};
          display: flex;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .admin-sidebar {
          width: 240px;
          background: ${SIDEBAR_BG};
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 100;
          border-right: 1px solid ${SIDEBAR_BORDER};
        }

        .admin-logo {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid ${SIDEBAR_BORDER};
          min-height: 72px;
        }

        .admin-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .admin-logo-text-wrap {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .admin-logo-line1 {
          font-size: 16px;
          font-weight: 800;
          color: ${SITE_PRIMARY};
          letter-spacing: -0.3px;
        }

        .admin-logo-line2 {
          font-size: 10px;
          font-weight: 700;
          color: #888;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .admin-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .admin-nav-label {
          padding: 0 12px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          color: #555;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          border-radius: 8px;
          margin-bottom: 4px;
          text-decoration: none;
        }

        .admin-nav-item:hover {
          background: ${SIDEBAR_HOVER};
          color: #1e293b;
        }

        .admin-nav-item.active {
          background: #fee2e2;
          color: ${SITE_PRIMARY};
          font-weight: 600;
        }

        .admin-nav-icon {
          font-size: 18px;
          width: 22px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin-main {
          flex: 1;
          margin-left: 240px;
          padding: 0;
          width: 100%;
          max-width: calc(100% - 240px);
        }

        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          background: ${BG};
          border-bottom: 1px solid #e8e4e4;
          flex-wrap: wrap;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .admin-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-topbar-title {
          font-size: 22px;
          font-weight: 700;
          color: ${PRIMARY};
          letter-spacing: -0.3px;
        }

        .admin-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .admin-icon-btn:hover {
          background: #eee;
        }

        .admin-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          background: ${SITE_PRIMARY};
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid ${BG};
        }

        .admin-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
          z-index: 99;
          animation: backdropIn 0.2s ease;
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .admin-sidebar-close {
          display: none;
          position: absolute;
          top: 18px;
          right: 16px;
          width: 32px;
          height: 32px;
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: #64748b;
          z-index: 1;
        }

        .admin-hamburger {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          flex-shrink: 0;
        }

        .admin-avatar-wrap {
          position: relative;
        }

        .admin-avatar-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
        }

        .admin-avatar-btn:hover {
          transform: scale(1.05);
        }

        .admin-avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${SITE_PRIMARY};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          overflow: hidden;
        }

        .admin-avatar-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          min-width: 200px;
          z-index: 999;
          overflow: hidden;
          animation: dropdownIn 0.15s ease;
        }

        .admin-avatar-dropdown-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .admin-avatar-dropdown-name {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .admin-avatar-dropdown-email {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-avatar-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .admin-avatar-dropdown-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .admin-avatar-dropdown-item.logout {
          color: #ef4444;
        }

        .admin-avatar-dropdown-item.logout:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        /* Rejected KYC Page Specific Styles */
        .kyc-content {
          padding: 24px 32px;
          max-width: 1200px;
        }

        .kyc-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          margin-bottom: 20px;
          transition: color 0.2s;
        }

        .kyc-back-link:hover {
          color: ${PRIMARY};
        }

        .kyc-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .kyc-alert-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${REJECTED_COLOR};
          flex-shrink: 0;
        }

        .kyc-alert-content h3 {
          font-size: 16px;
          font-weight: 700;
          color: ${PRIMARY};
          margin-bottom: 4px;
        }

        .kyc-alert-content p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
        }

        .kyc-card {
          background: ${CARD_BG};
          border-radius: 12px;
          border: 1px solid #eee;
          padding: 24px;
          margin-bottom: 20px;
        }

        .kyc-applicant-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .kyc-applicant-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .kyc-applicant-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }

        .kyc-applicant-name {
          font-size: 16px;
          font-weight: 700;
          color: ${PRIMARY};
        }

        .kyc-applicant-meta {
          font-size: 13px;
          color: #888;
          margin-top: 2px;
        }

        .kyc-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          background: #fef2f2;
          color: ${REJECTED_COLOR};
        }

        .kyc-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${REJECTED_COLOR};
        }

        .kyc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .kyc-section-title {
          font-size: 14px;
          font-weight: 700;
          color: ${PRIMARY};
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .kyc-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .kyc-detail-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f8f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          flex-shrink: 0;
        }

        .kyc-detail-content {
          flex: 1;
        }

        .kyc-detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .kyc-detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .kyc-doc-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .kyc-doc-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #faf8f8;
          border-radius: 10px;
          border: 1px solid #f0eeee;
        }

        .kyc-doc-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .kyc-doc-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          border: 1px solid #e8e4e4;
        }

        .kyc-doc-name {
          font-size: 14px;
          font-weight: 600;
          color: ${PRIMARY};
        }

        .kyc-doc-file {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }

        .kyc-doc-status {
          font-size: 12px;
          font-weight: 600;
          color: ${REJECTED_COLOR};
          background: #fef2f2;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .kyc-action-card {
          background: ${CARD_BG};
          border-radius: 12px;
          border: 1px solid #eee;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .kyc-action-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .kyc-action-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${REJECTED_COLOR};
          flex-shrink: 0;
        }

        .kyc-action-text h4 {
          font-size: 14px;
          font-weight: 700;
          color: ${PRIMARY};
          margin-bottom: 2px;
        }

        .kyc-action-text p {
          font-size: 13px;
          color: #888;
        }

        .kyc-resubmit-btn {
          background: ${SITE_PRIMARY};
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .kyc-resubmit-btn:hover {
          background: #a93226;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192, 57, 43, 0.25);
        }

        .kyc-guidelines {
          background: ${CARD_BG};
          border-radius: 12px;
          border: 1px solid #eee;
          padding: 24px;
        }

        .kyc-guidelines-title {
          font-size: 14px;
          font-weight: 700;
          color: ${PRIMARY};
          margin-bottom: 16px;
        }

        .kyc-guideline-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 13px;
          color: #555;
          line-height: 1.5;
        }

        .kyc-guideline-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ecfdf5;
          color: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .kyc-guidelines-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0eeee;
        }

        .kyc-view-guidelines {
          display: block;
          width: 100%;
          text-align: center;
          padding: 10px;
          border: 1px solid #e8e4e4;
          border-radius: 8px;
          color: ${SITE_PRIMARY};
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          background: #fff;
        }

        .kyc-view-guidelines:hover {
          background: #fee2e2;
          border-color: #fecaca;
        }

        .kyc-action-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .kyc-action-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #faf8f8;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .kyc-action-item:hover {
          background: #f4f4f4;
          border-color: #e8e4e4;
        }

        .kyc-action-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .kyc-action-item-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          border: 1px solid #e8e4e4;
          flex-shrink: 0;
        }

        .kyc-action-item-text h4 {
          font-size: 14px;
          font-weight: 600;
          color: ${PRIMARY};
        }

        .kyc-action-item-text p {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }

        @media (max-width: 1023px) {
          .admin-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            width: 80% !important;
            max-width: 300px;
            z-index: 200;
            box-shadow: none;
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.15);
          }
          .admin-backdrop.active {
            display: block;
          }
          .admin-sidebar.mobile-open .admin-sidebar-close {
            display: flex;
          }
          .admin-hamburger {
            display: flex;
          }
          .admin-main {
            margin-left: 0 !important;
            max-width: 100% !important;
          }
          .admin-topbar {
            padding: 16px 20px;
          }
          .kyc-content {
            padding: 20px;
          }
          .kyc-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .admin-topbar {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 16px;
          }
          .admin-topbar-left {
            justify-content: space-between;
            width: 100%;
          }
          .admin-topbar-right {
            justify-content: flex-end;
            width: 100%;
          }
          .admin-topbar-title {
            font-size: 18px;
          }
          .kyc-content {
            padding: 16px;
          }
          .kyc-applicant-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .kyc-action-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .kyc-resubmit-btn {
            width: 100%;
          }
        }
      `}</style>

      <div
        className={`admin-backdrop ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="admin-page">
        {/* SIDEBAR - Same as admin dashboard */}
        <aside className={`admin-sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>

          <div className="admin-logo">
            <Link href="/" className="admin-logo-wrap">
              <HamroBazarLogo size={36} />
              <div className="admin-logo-text-wrap">
                <span className="admin-logo-line1">HamroNepal</span>
                <span className="admin-logo-line2">Bazaar</span>
              </div>
            </Link>
          </div>

          <div className="admin-nav">
            <div className="admin-nav-label">Menu</div>
            {sidebarItems.map((item) => (
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="admin-nav-icon">
                    <item.icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  key={item.id}
                  className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="admin-nav-icon">
                    <item.icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="admin-main">
          {/* TOPBAR - Same as admin dashboard */}
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <button
                type="button"
                className="admin-hamburger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="admin-topbar-title">Rejected KYC</h1>
            </div>
            <div className="admin-topbar-right">
              <button type="button" className="admin-icon-btn">
                <FiBell size={20} />
                <span className="admin-badge">1</span>
              </button>
              <div className="admin-avatar-wrap">
                <button
                  type="button"
                  className="admin-avatar-btn"
                  onClick={() => setShowAvatarDropdown((v) => !v)}
                >
                  <div className="admin-avatar-circle">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="avatar"
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                </button>
                {showAvatarDropdown && (
                  <div className="admin-avatar-dropdown">
                    <div className="admin-avatar-dropdown-header">
                      <div className="admin-avatar-dropdown-name">{session?.user?.name || "Admin"}</div>
                      <div className="admin-avatar-dropdown-email">{session?.user?.email || "admin@hamronepal.com"}</div>
                    </div>
                    <button
                      type="button"
                      className="admin-avatar-dropdown-item logout"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* REJECTED KYC CONTENT */}
          <div className="kyc-content">
            {/* Back Link */}
            <Link href="/admin/rejected" className="kyc-back-link">
              <FiArrowLeft size={16} />
              Back to Rejected List
            </Link>

            {/* Alert Banner */}
            <div className="kyc-alert">
              <div className="kyc-alert-icon">
                <FiShieldOff size={20} />
              </div>
              <div className="kyc-alert-content">
                <h3>Your KYC Application has been rejected</h3>
                <p>We were unable to verify your identity. Please review the reason below and resubmit your documents.</p>
              </div>
            </div>

            {/* Applicant Info Card */}
            <div className="kyc-card">
              <div className="kyc-applicant-header">
                <div className="kyc-applicant-info">
                  <div className="kyc-applicant-avatar">R</div>
                  <div>
                    <div className="kyc-applicant-name">{kycData.applicantName}</div>
                    <div className="kyc-applicant-meta">Applied on {kycData.appliedOn} • ID {kycData.id}</div>
                  </div>
                </div>
                <div className="kyc-status-badge">
                  <span className="kyc-status-dot" />
                  {kycData.status}
                </div>
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="kyc-grid">
              {/* Left Column */}
              <div>
                {/* Rejected Details */}
                <div className="kyc-card">
                  <div className="kyc-section-title">
                    <FiXCircle size={16} />
                    Rejected Details
                  </div>
                  <div className="kyc-detail-row">
                    <div className="kyc-detail-icon">
                      <FiFileText size={16} />
                    </div>
                    <div className="kyc-detail-content">
                      <div className="kyc-detail-label">Rejection Reason</div>
                      <div className="kyc-detail-value">{kycData.rejectionReason}</div>
                    </div>
                  </div>
                  <div className="kyc-detail-row">
                    <div className="kyc-detail-icon">
                      <FiCalendar size={16} />
                    </div>
                    <div className="kyc-detail-content">
                      <div className="kyc-detail-label">Reviewed On</div>
                      <div className="kyc-detail-value">{kycData.reviewedOn}</div>
                    </div>
                  </div>
                  <div className="kyc-detail-row">
                    <div className="kyc-detail-icon">
                      <FiUsers size={16} />
                    </div>
                    <div className="kyc-detail-content">
                      <div className="kyc-detail-label">Reviewed By</div>
                      <div className="kyc-detail-value">{kycData.reviewedBy}</div>
                    </div>
                  </div>
                </div>

                {/* Submitted Documents */}
                <div className="kyc-card">
                  <div className="kyc-section-title">
                    <FiFileText size={16} />
                    Submitted Documents
                  </div>
                  <div className="kyc-doc-list">
                    {kycData.submittedDocuments.map((doc, idx) => (
                      <div key={idx} className="kyc-doc-item">
                        <div className="kyc-doc-left">
                          <div className="kyc-doc-icon">
                            <FiFileText size={16} />
                          </div>
                          <div>
                            <div className="kyc-doc-name">{doc.name}</div>
                            <div className="kyc-doc-file">{doc.file}</div>
                          </div>
                        </div>
                        <span className="kyc-doc-status">{doc.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resubmit CTA */}
                <div className="kyc-action-card">
                  <div className="kyc-action-left">
                    <div className="kyc-action-icon">
                      <FiUpload size={20} />
                    </div>
                    <div className="kyc-action-text">
                      <h4>Resubmit KYC</h4>
                      <p>You can resubmit your documents after correcting the issues. After resubmission, it may take up to 24 hours for verification.</p>
                    </div>
                  </div>
                  <button className="kyc-resubmit-btn">Resubmit Your KYC</button>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* What You Can Do */}
                <div className="kyc-card">
                  <div className="kyc-section-title">
                    <FiCheckSquare size={16} />
                    What You Can Do
                  </div>
                  <div className="kyc-action-list">
                    <Link href="#" className="kyc-action-item">
                      <div className="kyc-action-item-left">
                        <div className="kyc-action-item-icon">
                          <FiCheckSquare size={16} />
                        </div>
                        <div className="kyc-action-item-text">
                          <h4>Check Requirements</h4>
                          <p>Make sure your documents meet all the requirements.</p>
                        </div>
                      </div>
                      <FiChevronRight size={16} color="#888" />
                    </Link>
                    <Link href="#" className="kyc-action-item">
                      <div className="kyc-action-item-left">
                        <div className="kyc-action-item-icon">
                          <FiUpload size={16} />
                        </div>
                        <div className="kyc-action-item-text">
                          <h4>Resubmit KYC</h4>
                          <p>Upload clear and valid documents for review.</p>
                        </div>
                      </div>
                      <FiChevronRight size={16} color="#888" />
                    </Link>
                    <Link href="#" className="kyc-action-item">
                      <div className="kyc-action-item-left">
                        <div className="kyc-action-item-icon">
                          <FiHelpCircle size={16} />
                        </div>
                        <div className="kyc-action-item-text">
                          <h4>Need Help?</h4>
                          <p>Contact our support team if you need assistance.</p>
                        </div>
                      </div>
                      <FiChevronRight size={16} color="#888" />
                    </Link>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="kyc-guidelines">
                  <div className="kyc-guidelines-title">Guidelines for Acceptable Documents</div>
                  <div className="kyc-guideline-item">
                    <span className="kyc-guideline-check">✓</span>
                    Clear and high-resolution images
                  </div>
                  <div className="kyc-guideline-item">
                    <span className="kyc-guideline-check">✓</span>
                    All corners of the document must be visible
                  </div>
                  <div className="kyc-guideline-item">
                    <span className="kyc-guideline-check">✓</span>
                    Information must be readable and not blurred
                  </div>
                  <div className="kyc-guideline-item">
                    <span className="kyc-guideline-check">✓</span>
                    Document must be valid and not expired
                  </div>
                  <div className="kyc-guideline-item">
                    <span className="kyc-guideline-check">✓</span>
                    Selfie must be clear with your face and document
                  </div>
                  <div className="kyc-guidelines-footer">
                    <Link href="#" className="kyc-view-guidelines">View Full Guidelines</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}