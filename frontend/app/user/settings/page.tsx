"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiGrid,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiBell,
  FiHelpCircle,
  FiSettings,
  FiTrash2,
  FiAlertTriangle,
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMoreHorizontal,
  FiEdit2,
  FiCheck,
  FiCamera,
} from "react-icons/fi";

export default function UserSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const sidebarItems = [
    { id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/user/dashboard" },
    { id: "orders", icon: FiShoppingBag, label: "My Orders", href: "/user/orders" },
    { id: "wishlist", icon: FiHeart, label: "Wishlist", href: "/user/wishlist" },
    { id: "address", icon: FiMapPin, label: "Addresses", href: "/user/address" },
    { id: "notification", icon: FiBell, label: "Notifications", href: "/user/notifications" },
    { id: "help", icon: FiHelpCircle, label: "Help & Support", href: "/user/help" },
    { id: "settings", icon: FiSettings, label: "Settings", href: "/user/settings" },
  ];

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/user/delete-account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to delete account");
      }
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setDeleteError(msg);
      setDeleting(false);
    }
  }

  const profileFields = [
    { icon: FiUser, label: "Full Name", value: "Siya Jaz", type: "text" },
    { icon: FiPhone, label: "Phone Number", value: "+977 9834567341", type: "tel" },
    { icon: FiMail, label: "Email Address", value: "jazsiya45@gmail.com", type: "email" },
    { icon: FiMapPin, label: "Address", value: "Kathmandu, Nepal", type: "text" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ud-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: #f1f5f9;
          display: flex;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        /* ── Sidebar ── */
        .ud-sidebar {
          width: 260px;
          background: #1e1b4b;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.3s ease;
          position: fixed;
          height: 100vh;
          height: 100dvh;
          z-index: 100;
        }

        .ud-sidebar.collapsed {
          width: 72px;
        }

        .ud-sidebar-header {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .ud-sidebar-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .ud-sidebar-brand {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .ud-sidebar.collapsed .ud-sidebar-brand {
          opacity: 0;
          width: 0;
        }

        .ud-nav-section {
          padding: 16px 12px;
          flex: 1;
          overflow-y: auto;
        }

        .ud-nav-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 12px;
          margin-bottom: 8px;
          white-space: nowrap;
        }

        .ud-sidebar.collapsed .ud-nav-label {
          display: none;
        }

        .ud-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          text-decoration: none;
          border-radius: 8px;
          margin-bottom: 2px;
          position: relative;
          white-space: nowrap;
        }

        .ud-nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.9);
        }

        .ud-nav-item.active {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
        }

        .ud-nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #818cf8;
          border-radius: 0 3px 3px 0;
        }

        .ud-nav-icon {
          font-size: 18px;
          width: 22px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .ud-nav-text {
          opacity: 1;
          transition: opacity 0.2s;
        }

        .ud-sidebar.collapsed .ud-nav-text {
          opacity: 0;
          width: 0;
        }

        .ud-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ud-sidebar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .ud-sidebar-user {
          opacity: 1;
          transition: opacity 0.2s;
          overflow: hidden;
        }

        .ud-sidebar.collapsed .ud-sidebar-user {
          opacity: 0;
          width: 0;
        }

        .ud-sidebar-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        .ud-sidebar-role {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 1px;
        }

        /* ── Main Area ── */
        .ud-main-area {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-height: 100dvh;
          transition: margin-left 0.3s ease;
        }

        .ud-sidebar.collapsed ~ .ud-main-area {
          margin-left: 72px;
        }

        /* ── Top Header ── */
        .ud-topbar {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .ud-topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ud-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .ud-toggle-btn:hover {
          background: #f8fafc;
          color: #334155;
        }

        .ud-breadcrumb {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.3px;
        }

        .ud-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ud-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          position: relative;
        }

        .ud-icon-btn:hover {
          background: #f8fafc;
          color: #334155;
          border-color: #cbd5e1;
        }

        .ud-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }

        /* ── Main Content ── */
        .ud-main {
          flex: 1;
          padding: 28px 32px;
          overflow-y: auto;
        }

        /* Profile Header */
        .ud-profile-header {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
        }

        .ud-profile-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .ud-profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 28px;
          font-weight: 700;
        }

        .ud-avatar-edit {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 28px;
          height: 28px;
          background: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .ud-avatar-edit:hover {
          border-color: #6366f1;
          color: #6366f1;
        }

        .ud-profile-info {
          flex: 1;
        }

        .ud-profile-name {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.3px;
          margin-bottom: 4px;
        }

        .ud-profile-role {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .ud-profile-actions {
          display: flex;
          gap: 10px;
        }

        .ud-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-family: inherit;
        }

        .ud-btn-primary {
          background: #4f46e5;
          color: #fff;
        }

        .ud-btn-primary:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }

        .ud-btn-ghost {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .ud-btn-ghost:hover {
          background: #e2e8f0;
        }

        /* Section Title */
        .ud-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .ud-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.2px;
        }

        /* Form Card */
        .ud-form-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .ud-form-row {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 0 24px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.2s;
        }

        .ud-form-row:hover {
          background: #fafbfc;
        }

        .ud-form-row:last-child {
          border-bottom: none;
        }

        .ud-form-label {
          flex: 0 0 180px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #475569;
          font-weight: 600;
          padding: 18px 0;
        }

        .ud-form-label svg {
          color: #94a3b8;
        }

        .ud-form-value {
          flex: 1;
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
          padding: 18px 0;
        }

        .ud-form-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
        }

        .ud-form-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        /* Password Row */
        .ud-password-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ud-password-text {
          font-family: "SF Mono", "Fira Code", monospace;
          font-size: 13px;
          color: #1e293b;
          letter-spacing: 0.5px;
        }

        .ud-toggle-pw {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 14px;
          padding: 6px;
          display: flex;
          align-items: center;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .ud-toggle-pw:hover {
          color: #6366f1;
          background: #eef2ff;
        }

        /* Security Card */
        .ud-security-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }

        .ud-security-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .ud-security-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #f8fafc;
        }

        .ud-security-row:last-child {
          border-bottom: none;
        }

        .ud-security-info h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 3px;
        }

        .ud-security-info p {
          font-size: 12px;
          color: #64748b;
        }

        /* Delete Account sidebar button */
        .ud-nav-item.danger {
          color: rgba(239,68,68,0.7);
        }
        .ud-nav-item.danger:hover {
          background: rgba(239,68,68,0.08);
          color: #ef4444;
        }

        /* ── Delete Account Modal ── */
        .ud-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ud-modal {
          background: #fff;
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .ud-modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ef4444;
          margin: 0 auto 20px;
        }
        .ud-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          margin-bottom: 8px;
        }
        .ud-modal-body {
          font-size: 14px;
          color: #64748b;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .ud-modal-body strong { color: #ef4444; }
        .ud-modal-error {
          font-size: 13px;
          color: #ef4444;
          background: #fef2f2;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 16px;
          text-align: center;
        }
        .ud-modal-actions {
          display: flex;
          gap: 12px;
        }
        .ud-modal-cancel {
          flex: 1;
          padding: 11px 0;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .ud-modal-cancel:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .ud-modal-delete {
          flex: 1;
          padding: 11px 0;
          border-radius: 10px;
          border: none;
          background: #ef4444;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ud-modal-delete:hover:not(:disabled) { background: #dc2626; }
        .ud-modal-delete:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Responsive */
        @media (max-width: 768px) {
          .ud-sidebar {
            transform: translateX(-100%);
          }
          .ud-sidebar.open {
            transform: translateX(0);
          }
          .ud-main-area {
            margin-left: 0;
          }
          .ud-sidebar.collapsed ~ .ud-main-area {
            margin-left: 0;
          }
          .ud-main {
            padding: 20px 16px;
          }
          .ud-topbar {
            padding: 0 16px;
          }
          .ud-profile-header {
            flex-direction: column;
            text-align: center;
            padding: 24px;
          }
          .ud-profile-actions {
            width: 100%;
            justify-content: center;
          }
          .ud-form-label {
            flex: 0 0 140px;
          }
        }

        @media (max-width: 640px) {
          .ud-form-row {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px 20px;
          }
          .ud-form-label {
            flex: none;
            padding: 0 0 6px 0;
          }
          .ud-form-value {
            padding: 0;
          }
          .ud-form-input {
            width: 100%;
          }
        }
      `}</style>

      <div className="ud-page">
        {/* ── Sidebar ── */}
        <aside className={`ud-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
          <div className="ud-sidebar-header">
            <div className="ud-sidebar-logo">S</div>
            <span className="ud-sidebar-brand">ShopDash</span>
          </div>

          <div className="ud-nav-section">
            <div className="ud-nav-label">Menu</div>
            {sidebarItems.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`ud-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="ud-nav-icon">
                  <item.icon size={18} />
                </span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}

            <div className="ud-nav-label" style={{ marginTop: 16 }}>Account</div>
            {sidebarItems.slice(5).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`ud-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="ud-nav-icon">
                  <item.icon size={18} />
                </span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}

            {/* Delete Account */}
            <button
              className="ud-nav-item danger"
              onClick={() => setShowDeleteModal(true)}
              title="Delete Account"
            >
              <span className="ud-nav-icon">
                <FiTrash2 size={18} />
              </span>
              <span className="ud-nav-text">Delete Account</span>
            </button>
          </div>

          <div className="ud-sidebar-footer">
            <div className="ud-sidebar-avatar">SJ</div>
            <div className="ud-sidebar-user">
              <div className="ud-sidebar-name">Siya Jaz</div>
              <div className="ud-sidebar-role">Premium Member</div>
            </div>
          </div>
        </aside>

        {/* ── Main Area ── */}
        <div className="ud-main-area">
          {/* Top Header */}
          <header className="ud-topbar">
            <div className="ud-topbar-left">
              <button
                className="ud-toggle-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="ud-breadcrumb">Settings</h1>
            </div>
            <div className="ud-topbar-right">
              <button className="ud-icon-btn">
                <FiBell size={18} />
                <span className="ud-badge">3</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="ud-main">
            {/* Profile Header */}
            <div className="ud-profile-header">
              <div className="ud-profile-avatar-wrap">
                <div className="ud-profile-avatar">SJ</div>
                <div className="ud-avatar-edit" title="Change photo">
                  <FiCamera size={12} />
                </div>
              </div>
              <div className="ud-profile-info">
                <div className="ud-profile-name">Siya Jaz</div>
                <div className="ud-profile-role">Premium Member · Kathmandu, Nepal</div>
              </div>
              <div className="ud-profile-actions">
                <button
                  className={`ud-btn ${isEditing ? "ud-btn-primary" : "ud-btn-ghost"}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <FiCheck size={14} /> Save Changes
                    </>
                  ) : (
                    <>
                      <FiEdit2 size={14} /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Account Details */}
            <div className="ud-section-header">
              <h3 className="ud-section-title">Account Information</h3>
            </div>
            <div className="ud-form-card">
              {profileFields.map((field) => (
                <div key={field.label} className="ud-form-row">
                  <div className="ud-form-label">
                    <field.icon size={16} />
                    {field.label}
                  </div>
                  {isEditing ? (
                    <input
                      type={field.type}
                      className="ud-form-input"
                      defaultValue={field.value}
                    />
                  ) : (
                    <div className="ud-form-value">{field.value}</div>
                  )}
                </div>
              ))}
              <div className="ud-form-row">
                <div className="ud-form-label">
                  <FiLock size={16} />
                  Password
                </div>
                <div className="ud-form-value">
                  <div className="ud-password-wrap">
                    <span className="ud-password-text">
                      {showPassword ? "mypassword123" : "••••••••••••"}
                    </span>
                    <button
                      className="ud-toggle-pw"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="ud-section-header">
              <h3 className="ud-section-title">Security</h3>
            </div>
            <div className="ud-security-card">
              <div className="ud-security-row">
                <div className="ud-security-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="ud-btn ud-btn-ghost">Enable</button>
              </div>
              <div className="ud-security-row">
                <div className="ud-security-info">
                  <h4>Active Sessions</h4>
                  <p>Manage devices where you're currently logged in</p>
                </div>
                <button className="ud-btn ud-btn-ghost">Manage</button>
              </div>
              <div className="ud-security-row">
                <div className="ud-security-info">
                  <h4>Login History</h4>
                  <p>View your recent login activity</p>
                </div>
                <button className="ud-btn ud-btn-ghost">View</button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ── Delete Account Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="ud-modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal-icon">
              <FiAlertTriangle size={26} />
            </div>
            <div className="ud-modal-title">Delete Your Account?</div>
            <div className="ud-modal-body">
              This action is <strong>permanent and irreversible</strong>. All your orders,
              wishlist, addresses, and personal data will be permanently deleted.
            </div>
            {deleteError && (
              <div className="ud-modal-error">{deleteError}</div>
            )}
            <div className="ud-modal-actions">
              <button
                className="ud-modal-cancel"
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="ud-modal-delete"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={15} />
                    Yes, Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}