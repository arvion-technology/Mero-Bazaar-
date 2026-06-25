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
  FiChevronRight,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiMoreHorizontal,
  FiAlertTriangle,
} from "react-icons/fi";

const stats = [
  { icon: FiShoppingBag, label: "Total Orders", value: "320", change: "+12%", color: "#4f46e5", bg: "#eef2ff" },
  { icon: FiDollarSign, label: "Total Spent", value: "NPR 32,890", change: "+8%", color: "#10b981", bg: "#ecfdf5" },
  { icon: FiHeart, label: "Wishlist", value: "12", change: "+3", color: "#ef4444", bg: "#fef2f2" },
  { icon: FiMapPin, label: "Addresses", value: "3", change: "", color: "#f59e0b", bg: "#fffbeb" },
];

const recentOrders = [
  { id: "#1024", date: "May 23, 2024", status: "Delivered", statusColor: "#22c55e", amount: "NPR 500" },
  { id: "#1023", date: "May 21, 2024", status: "Shipped", statusColor: "#6366f1", amount: "NPR 500" },
  { id: "#1022", date: "May 27, 2024", status: "Processing", statusColor: "#f59e0b", amount: "NPR 500" },
  { id: "#1021", date: "May 20, 2024", status: "Delivered", statusColor: "#8b5cf6", amount: "NPR 500" },
];

const contacts = [
  { initials: "RS", name: "Ramesh Store", phone: "+977 9867892321", time: "10:30 AM", color: "#4f46e5" },
  { initials: "PS", name: "Prakash Suppliers", phone: "+977 9856743215", time: "09:15 AM", color: "#10b981" },
  { initials: "SK", name: "Sneha Kadka", phone: "+977 9856743215", time: "Yesterday", color: "#f59e0b" },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

        .ud-welcome-section {
          margin-bottom: 28px;
        }

        .ud-welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .ud-welcome-sub {
          font-size: 14px;
          color: #64748b;
        }

        /* Stats */
        .ud-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .ud-stat-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.25s;
          cursor: pointer;
        }

        .ud-stat-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transform: translateY(-2px);
          border-color: #cbd5e1;
        }

        .ud-stat-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .ud-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .ud-stat-trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          background: #ecfdf5;
          color: #10b981;
        }

        .ud-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .ud-stat-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
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

        .ud-section-link {
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .ud-section-link:hover {
          color: #4f46e5;
          gap: 6px;
        }

        /* Orders Table */
        .ud-orders-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 28px;
        }

        .ud-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ud-table th {
          text-align: left;
          padding: 14px 20px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbfc;
        }

        .ud-table td {
          padding: 14px 20px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f8fafc;
        }

        .ud-table tr:last-child td {
          border-bottom: none;
        }

        .ud-table tr:hover td {
          background: #fafbfc;
        }

        .ud-order-id {
          font-weight: 600;
          color: #1e293b;
          font-family: "SF Mono", "Fira Code", monospace;
          font-size: 13px;
        }

        .ud-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .ud-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .ud-amount {
          font-weight: 600;
          color: #1e293b;
        }

        /* Contacts */
        .ud-contacts-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .ud-contact-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.2s;
        }

        .ud-contact-row:hover {
          background: #fafbfc;
        }

        .ud-contact-row:last-child {
          border-bottom: none;
        }

        .ud-contact-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .ud-contact-info {
          flex: 1;
        }

        .ud-contact-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .ud-contact-phone {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }

        .ud-contact-time {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .ud-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

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
          .ud-stats {
            grid-template-columns: 1fr;
          }
          .ud-main {
            padding: 20px 16px;
          }
          .ud-topbar {
            padding: 0 16px;
          }
          .ud-table th, .ud-table td {
            padding: 12px 14px;
          }
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

        /* Delete Account sidebar button */
        .ud-nav-item.danger {
          color: rgba(239,68,68,0.7);
        }
        .ud-nav-item.danger:hover {
          background: rgba(239,68,68,0.08);
          color: #ef4444;
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

            {/* Delete Account — always shown, never collapsed away */}
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
            <div className="ud-sidebar-avatar">
              {session?.user?.image
                ? <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                : (session?.user?.name?.[0] || "U").toUpperCase()
              }
            </div>
            <div className="ud-sidebar-user">
              <div className="ud-sidebar-name">{session?.user?.name || "User"}</div>
              <div className="ud-sidebar-role">{session?.user?.email || "Member"}</div>
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
              <h1 className="ud-breadcrumb">Dashboard</h1>
            </div>
            <div className="ud-topbar-right">
              <button className="ud-icon-btn">
                <FiBell size={18} />
                <span className="ud-badge">3</span>
              </button>
              <button className="ud-icon-btn">
                <FiSettings size={18} />
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="ud-main">
            <div className="ud-welcome-section">
              <h2 className="ud-welcome-title">Welcome back, Siya! 👋</h2>
              <p className="ud-welcome-sub">Here's what's happening with your account today.</p>
            </div>

            <div className="ud-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="ud-stat-card">
                  <div className="ud-stat-header">
                    <div className="ud-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                      <stat.icon size={20} />
                    </div>
                    {stat.change && (
                      <div className="ud-stat-trend">
                        <FiTrendingUp size={12} />
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="ud-stat-value">{stat.value}</div>
                  <div className="ud-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="ud-section-header">
              <h3 className="ud-section-title">Recent Orders</h3>
              <Link href="/user/orders" className="ud-section-link">
                View All <FiChevronRight size={14} />
              </Link>
            </div>
            <div className="ud-orders-card">
              <table className="ud-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={idx}>
                      <td><span className="ud-order-id">{order.id}</span></td>
                      <td>{order.date}</td>
                      <td>
                        <span
                          className="ud-status"
                          style={{ background: order.statusColor + "12", color: order.statusColor }}
                        >
                          <span className="ud-status-dot" style={{ background: order.statusColor }}></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="ud-amount">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ud-section-header">
              <h3 className="ud-section-title">Recent Contacts</h3>
              <Link href="/user/contacts" className="ud-section-link">
                View All <FiChevronRight size={14} />
              </Link>
            </div>
            <div className="ud-contacts-card">
              {contacts.map((contact) => (
                <div key={contact.name} className="ud-contact-row">
                  <div className="ud-contact-avatar" style={{ background: contact.color }}>
                    {contact.initials}
                  </div>
                  <div className="ud-contact-info">
                    <div className="ud-contact-name">{contact.name}</div>
                    <div className="ud-contact-phone">{contact.phone}</div>
                  </div>
                  <div className="ud-contact-time">
                    <FiClock size={12} />
                    {contact.time}
                  </div>
                </div>
              ))}
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