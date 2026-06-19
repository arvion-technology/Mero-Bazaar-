"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiShoppingCart,
  FiBox,
  FiCreditCard,
  FiBarChart2,
  FiMessageSquare,
  FiSettings,
  FiSearch,
  FiBell,
  FiChevronRight,
  FiTrendingUp,
  FiTrendingDown,
  FiPlus,
  FiEye,
  FiDollarSign,
  FiPieChart,
  FiPackage,
  FiClock,
  FiLayers,
  FiMoreHorizontal,
  FiArrowUpRight,
  FiCalendar,
} from "react-icons/fi";

const PRIMARY = "#0f172a";
const ACCENT = "#3b82f6";
const ACCENT_LIGHT = "#60a5fa";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SIDEBAR_BG = "#0f172a";
const SIDEBAR_HOVER = "#1e293b";

const stats = [
  { icon: FiShoppingCart, label: "Total Orders", value: "320", change: "+12.5%", changeType: "up" as const, sub: "vs last month", color: ACCENT, bg: "#eff6ff" },
  { icon: FiClock, label: "Pending", value: "15", change: "-3.2%", changeType: "down" as const, sub: "needs attention", color: WARNING, bg: "#fffbeb" },
  { icon: FiDollarSign, label: "Revenue", value: "NPR 125K", change: "+8.4%", changeType: "up" as const, sub: "vs last month", color: SUCCESS, bg: "#ecfdf5" },
  { icon: FiLayers, label: "Products", value: "58", change: "+5", changeType: "up" as const, sub: "active listings", color: "#8b5cf6", bg: "#f5f3ff" },
];

const recentOrders = [
  { id: "#1024", customer: "Sita Sharma", email: "sita@email.com", amount: "NPR 500", status: "Completed", statusColor: SUCCESS },
  { id: "#1023", customer: "Hari Bahadur", email: "hari@email.com", amount: "NPR 500", status: "Processing", statusColor: WARNING },
  { id: "#1022", customer: "Anis Kumar", email: "anis@email.com", amount: "NPR 2,100", status: "Completed", statusColor: SUCCESS },
  { id: "#1021", customer: "Ramesh Thapa", email: "ramesh@email.com", amount: "NPR 850", status: "Pending", statusColor: DANGER },
  { id: "#1020", customer: "Priya Sharma", email: "priya@email.com", amount: "NPR 1,200", status: "Completed", statusColor: SUCCESS },
];

const quickActions = [
  { icon: FiPlus, label: "Add Product", desc: "Create new listing", color: ACCENT, bg: "#eff6ff", href: "/seller/products/add" },
  { icon: FiEye, label: "View Orders", desc: "Manage all orders", color: SUCCESS, bg: "#ecfdf5", href: "/seller/orders" },
  { icon: FiCreditCard, label: "Payments", desc: "View transactions", color: WARNING, bg: "#fffbeb", href: "/seller/payments" },
  { icon: FiPieChart, label: "Analytics", desc: "Detailed reports", color: "#8b5cf6", bg: "#f5f3ff", href: "/seller/reports" },
];

const messages = [
  { initials: "RS", name: "Ramesh Store", msg: "Hello, is the product still available?", time: "10:30 AM", color: ACCENT, unread: true },
  { initials: "PS", name: "Prakash Suppliers", msg: "When will my order be shipped?", time: "09:15 AM", color: DANGER, unread: true },
  { initials: "SK", name: "Sneha Kadka", msg: "Thank you for the fast delivery!", time: "Yesterday", color: SUCCESS, unread: false },
  { initials: "AK", name: "Amit Khadka", msg: "Can you provide a discount?", time: "Yesterday", color: WARNING, unread: false },
];

const chartData = [
  { month: "Jan", sales: 28, earnings: 22 },
  { month: "Feb", sales: 42, earnings: 35 },
  { month: "Mar", sales: 38, earnings: 40 },
  { month: "Apr", sales: 52, earnings: 45 },
  { month: "May", sales: 68, earnings: 58 },
  { month: "Jun", sales: 82, earnings: 75 },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchFocused, setSearchFocused] = useState(false);

  const sidebarItems = [
    { id: "dashboard", icon: FiGrid, label: "Dashboard" },
    { id: "orders", icon: FiShoppingCart, label: "Orders", badge: "15" },
    { id: "products", icon: FiBox, label: "Products" },
    { id: "payments", icon: FiCreditCard, label: "Payments" },
    { id: "reports", icon: FiBarChart2, label: "Reports" },
    { id: "messages", icon: FiMessageSquare, label: "Messages", badge: "2" },
    { id: "settings", icon: FiSettings, label: "Settings" },
  ];

  const maxVal = Math.max(...chartData.map(d => Math.max(d.sales, d.earnings)));

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-page {
          min-height: 100vh;
          background: ${BG};
          display: flex;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── Sidebar ── */
        .dash-sidebar {
          width: 264px;
          background: ${SIDEBAR_BG};
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 100;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .dash-logo {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .dash-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT});
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }

        .dash-logo-text {
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .dash-logo-sub {
          color: rgba(255,255,255,0.45);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .dash-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .dash-nav-label {
          padding: 0 12px 10px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          color: rgba(255,255,255,0.55);
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          border-radius: 8px;
          margin-bottom: 2px;
          position: relative;
        }

        .dash-nav-item:hover {
          background: ${SIDEBAR_HOVER};
          color: rgba(255,255,255,0.9);
        }

        .dash-nav-item.active {
          background: linear-gradient(90deg, rgba(59,130,246,0.15), transparent);
          color: #fff;
        }

        .dash-nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: ${ACCENT};
          border-radius: 0 3px 3px 0;
        }

        .dash-nav-icon {
          font-size: 18px;
          width: 22px;
          display: flex;
          justify-content: center;
          opacity: 0.8;
        }

        .dash-nav-item.active .dash-nav-icon {
          opacity: 1;
          color: ${ACCENT_LIGHT};
        }

        .dash-nav-badge {
          margin-left: auto;
          padding: 2px 8px;
          background: ${DANGER};
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }

        .dash-sidebar-footer {
          padding: 16px;
          margin: 0 12px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 12px;
          background: ${SIDEBAR_HOVER};
          border: 1px solid rgba(255,255,255,0.05);
        }

        .dash-sidebar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT});
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .dash-sidebar-user {
          color: #fff;
          flex: 1;
          min-width: 0;
        }

        .dash-sidebar-name {
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dash-sidebar-id {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
        }

        /* ── Main Content ── */
        .dash-main {
          flex: 1;
          margin-left: 264px;
          padding: 24px 32px 32px;
          max-width: calc(100% - 264px);
        }

        /* Top Bar */
        .dash-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .dash-topbar-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dash-topbar-title {
          font-size: 22px;
          font-weight: 700;
          color: ${PRIMARY};
          letter-spacing: -0.4px;
        }

        .dash-topbar-sub {
          font-size: 13px;
          color: #64748b;
          font-weight: 400;
        }

        .dash-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dash-search {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: ${CARD_BG};
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          color: #94a3b8;
          font-size: 13px;
          width: 280px;
          transition: all 0.2s;
        }

        .dash-search.focused {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .dash-search input {
          border: none;
          outline: none;
          background: none;
          font-size: 13px;
          color: #334155;
          width: 100%;
          font-family: inherit;
        }

        .dash-search input::placeholder {
          color: #94a3b8;
        }

        .dash-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${CARD_BG};
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .dash-icon-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #334155;
        }

        .dash-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 18px;
          height: 18px;
          background: ${DANGER};
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }

        /* Stats Grid */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .dash-stat-card {
          background: ${CARD_BG};
          border-radius: 16px;
          padding: 22px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .dash-stat-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--stat-color), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .dash-stat-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          transform: translateY(-3px);
          border-color: #e2e8f0;
        }

        .dash-stat-card:hover::after {
          opacity: 1;
        }

        .dash-stat-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          transition: transform 0.25s;
        }

        .dash-stat-card:hover .dash-stat-icon-wrap {
          transform: scale(1.08);
        }

        .dash-stat-info {
          flex: 1;
          min-width: 0;
        }

        .dash-stat-label {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 6px;
          letter-spacing: 0.2px;
        }

        .dash-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: ${PRIMARY};
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .dash-stat-footer {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dash-stat-change {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .dash-stat-change.up {
          background: #ecfdf5;
          color: ${SUCCESS};
        }

        .dash-stat-change.down {
          background: #fef2f2;
          color: ${DANGER};
        }

        .dash-stat-sub {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 400;
        }

        /* Two Column Layout */
        .dash-two-col {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }

        .dash-card {
          background: ${CARD_BG};
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          transition: box-shadow 0.25s;
        }

        .dash-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }

        .dash-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .dash-card-title {
          font-size: 15px;
          font-weight: 700;
          color: ${PRIMARY};
          letter-spacing: -0.2px;
        }

        .dash-card-link {
          font-size: 12px;
          font-weight: 600;
          color: ${ACCENT};
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s;
        }

        .dash-card-link:hover {
          gap: 6px;
          text-decoration: underline;
        }

        /* Table */
        .dash-table-wrap {
          overflow-x: auto;
        }

        .dash-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .dash-table th {
          text-align: left;
          padding: 10px 14px;
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 1.5px solid #f1f5f9;
          white-space: nowrap;
        }

        .dash-table td {
          padding: 14px;
          font-size: 13px;
          color: #334155;
          border-bottom: 1px solid #f8fafc;
          white-space: nowrap;
        }

        .dash-table tr:last-child td {
          border-bottom: none;
        }

        .dash-table tr {
          transition: background 0.15s;
        }

        .dash-table tbody tr:hover {
          background: #f8fafc;
        }

        .dash-order-id {
          font-weight: 600;
          color: ${ACCENT};
          font-size: 12px;
        }

        .dash-customer-name {
          font-weight: 500;
          color: ${PRIMARY};
        }

        .dash-customer-email {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .dash-amount {
          font-weight: 600;
          color: ${PRIMARY};
          font-size: 13px;
        }

        .dash-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .dash-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* Chart */
        .dash-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .dash-chart-title {
          font-size: 15px;
          font-weight: 700;
          color: ${PRIMARY};
          letter-spacing: -0.2px;
        }

        .dash-chart-legend {
          display: flex;
          gap: 16px;
        }

        .dash-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .dash-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dash-chart-area {
          height: 200px;
          position: relative;
        }

        .dash-chart-svg {
          width: 100%;
          height: 100%;
        }

        .dash-chart-months {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 4px;
        }

        .dash-chart-month {
          font-size: 11px;
          color: #94a3b8;
          text-align: center;
          flex: 1;
          font-weight: 500;
        }

        /* Quick Actions */
        .dash-quick {
          margin-bottom: 28px;
        }

        .dash-quick-title {
          font-size: 15px;
          font-weight: 700;
          color: ${PRIMARY};
          margin-bottom: 16px;
          letter-spacing: -0.2px;
        }

        .dash-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .dash-quick-card {
          background: ${CARD_BG};
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }

        .dash-quick-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          transform: translateY(-3px);
          border-color: #e2e8f0;
        }

        .dash-quick-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          transition: transform 0.25s;
        }

        .dash-quick-card:hover .dash-quick-icon {
          transform: scale(1.1);
        }

        .dash-quick-info {
          flex: 1;
          min-width: 0;
        }

        .dash-quick-label {
          font-size: 14px;
          font-weight: 600;
          color: ${PRIMARY};
          margin-bottom: 3px;
        }

        .dash-quick-desc {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 400;
        }

        /* Messages */
        .dash-msg-list {
          display: flex;
          flex-direction: column;
        }

        .dash-msg-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 12px;
          transition: all 0.2s;
          cursor: pointer;
          border-bottom: 1px solid #f8fafc;
        }

        .dash-msg-item:last-child {
          border-bottom: none;
        }

        .dash-msg-item:hover {
          background: #f8fafc;
        }

        .dash-msg-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .dash-msg-unread {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: ${DANGER};
          border-radius: 50%;
          border: 2.5px solid #fff;
        }

        .dash-msg-content {
          flex: 1;
          min-width: 0;
        }

        .dash-msg-name {
          font-size: 14px;
          font-weight: 600;
          color: ${PRIMARY};
          margin-bottom: 3px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dash-msg-text {
          font-size: 13px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 400;
        }

        .dash-msg-time {
          font-size: 11px;
          color: #94a3b8;
          flex-shrink: 0;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-quick-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .dash-sidebar {
            width: 72px;
          }
          .dash-logo-text, .dash-logo-sub, .dash-nav-item span, .dash-nav-badge, .dash-sidebar-user {
            display: none;
          }
          .dash-logo { justify-content: center; padding: 20px 0; }
          .dash-logo-icon { margin: 0 auto; }
          .dash-nav { padding: 16px 8px; }
          .dash-nav-item { justify-content: center; padding: 14px; }
          .dash-nav-label { display: none; }
          .dash-sidebar-footer { justify-content: center; padding: 12px; margin: 0 8px 8px; }
          .dash-main { margin-left: 72px; max-width: calc(100% - 72px); padding: 20px; }
          .dash-two-col { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .dash-stats { grid-template-columns: 1fr; }
          .dash-quick-grid { grid-template-columns: 1fr; }
          .dash-topbar { flex-direction: column; gap: 12px; align-items: flex-start; }
          .dash-search { width: 100%; }
          .dash-table-wrap { margin: 0 -24px; padding: 0 24px; }
        }
      `}</style>

      <div className="dash-page">
        {/* ── Sidebar ── */}
        <aside className="dash-sidebar">
          <div className="dash-logo">
            {/* <div className="dash-logo-icon">
              <FiPackage size={20} />
            </div>
            <div>
              <div className="dash-logo-text">Hamro Bazar</div>
              <div className="dash-logo-sub">Seller Portal</div>
            </div> */}
          </div>

          <div className="dash-nav">
            <div className="dash-nav-label">Main Menu</div>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`dash-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="dash-nav-icon">
                  <item.icon size={18} />
                </span>
                <span>{item.label}</span>
                {item.badge && <span className="dash-nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>

          <div className="dash-sidebar-footer">
            <div className="dash-sidebar-avatar">HB</div>
            <div className="dash-sidebar-user">
              <div className="dash-sidebar-name">Hamro Bazar</div>
              <div className="dash-sidebar-id">Seller ID: FCT1234</div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="dash-main">
          {/* Top Bar */}
          <div className="dash-topbar">
            <div className="dash-topbar-left">
              <h1 className="dash-topbar-title">Dashboard</h1>
              <p className="dash-topbar-sub">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
            </div>
            <div className="dash-topbar-right">
              <div className={`dash-search ${searchFocused ? "focused" : ""}`}>
                <FiSearch size={16} />
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
              <button className="dash-icon-btn">
                <FiBell size={18} />
                <span className="dash-badge">3</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="dash-stats">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="dash-stat-card"
                style={{ "--stat-color": stat.color } as React.CSSProperties}
              >
                <div className="dash-stat-icon-wrap" style={{ background: stat.bg, color: stat.color }}>
                  <stat.icon size={22} />
                </div>
                <div className="dash-stat-info">
                  <div className="dash-stat-label">{stat.label}</div>
                  <div className="dash-stat-value">{stat.value}</div>
                  <div className="dash-stat-footer">
                    <span className={`dash-stat-change ${stat.changeType}`}>
                      {stat.changeType === "up" ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
                      {stat.change}
                    </span>
                    <span className="dash-stat-sub">{stat.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column: Orders + Chart */}
          <div className="dash-two-col">
            {/* Recent Orders */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h3 className="dash-card-title">Recent Orders</h3>
                <Link href="/seller/orders" className="dash-card-link">
                  View All <FiChevronRight size={14} />
                </Link>
              </div>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="dash-order-id">{order.id}</span>
                        </td>
                        <td>
                          <div className="dash-customer-name">{order.customer}</div>
                          <div className="dash-customer-email">{order.email}</div>
                        </td>
                        <td>
                          <span className="dash-amount">{order.amount}</span>
                        </td>
                        <td>
                          <span
                            className="dash-status"
                            style={{ background: order.statusColor + "12", color: order.statusColor }}
                          >
                            <span className="dash-status-dot" style={{ background: order.statusColor }} />
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="dash-card">
              <div className="dash-chart-header">
                <h3 className="dash-chart-title">Sales Overview</h3>
                <div className="dash-chart-legend">
                  <div className="dash-legend-item">
                    <span className="dash-legend-dot" style={{ background: ACCENT }} />
                    Sales
                  </div>
                  <div className="dash-legend-item">
                    <span className="dash-legend-dot" style={{ background: DANGER }} />
                    Earnings
                  </div>
                </div>
              </div>
              <div className="dash-chart-area">
                <svg className="dash-chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={DANGER} stopOpacity="0.15" />
                      <stop offset="100%" stopColor={DANGER} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="#f1f5f9" strokeWidth="1" />
                  ))}
                  {/* Sales area */}
                  <polygon
                    fill="url(#salesGrad)"
                    points={`0,200 ${chartData.map((d, i) => `${i * 80},${200 - (d.sales / maxVal) * 180}`).join(" ")} 400,200`}
                  />
                  {/* Earnings area */}
                  <polygon
                    fill="url(#earnGrad)"
                    points={`0,200 ${chartData.map((d, i) => `${i * 80},${200 - (d.earnings / maxVal) * 180}`).join(" ")} 400,200`}
                  />
                  {/* Sales line */}
                  <polyline
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.map((d, i) => `${i * 80},${200 - (d.sales / maxVal) * 180}`).join(" ")}
                  />
                  {/* Earnings line */}
                  <polyline
                    fill="none"
                    stroke={DANGER}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6,4"
                    points={chartData.map((d, i) => `${i * 80},${200 - (d.earnings / maxVal) * 180}`).join(" ")}
                  />
                  {/* Data points */}
                  {chartData.map((d, i) => (
                    <circle key={`s-${i}`} cx={i * 80} cy={200 - (d.sales / maxVal) * 180} r="4" fill={ACCENT} stroke="#fff" strokeWidth="2.5" />
                  ))}
                  {chartData.map((d, i) => (
                    <circle key={`e-${i}`} cx={i * 80} cy={200 - (d.earnings / maxVal) * 180} r="4" fill={DANGER} stroke="#fff" strokeWidth="2.5" />
                  ))}
                </svg>
              </div>
              <div className="dash-chart-months">
                {chartData.map((d) => (
                  <div key={d.month} className="dash-chart-month">{d.month}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-quick">
            <h3 className="dash-quick-title">Quick Actions</h3>
            <div className="dash-quick-grid">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href} className="dash-quick-card">
                  <div className="dash-quick-icon" style={{ background: action.bg, color: action.color }}>
                    <action.icon size={20} />
                  </div>
                  <div className="dash-quick-info">
                    <div className="dash-quick-label">{action.label}</div>
                    <div className="dash-quick-desc">{action.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Recent Messages</h3>
              <Link href="/seller/messages" className="dash-card-link">
                View All <FiChevronRight size={14} />
              </Link>
            </div>
            <div className="dash-msg-list">
              {messages.map((msg) => (
                <div key={msg.name} className="dash-msg-item">
                  <div className="dash-msg-avatar" style={{ background: msg.color }}>
                    {msg.initials}
                    {msg.unread && <span className="dash-msg-unread" />}
                  </div>
                  <div className="dash-msg-content">
                    <div className="dash-msg-name">
                      {msg.name}
                      {msg.unread && (
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: DANGER, display: "inline-block", flexShrink: 0 }} />
                      )}
                    </div>
                    <div className="dash-msg-text">{msg.msg}</div>
                  </div>
                  <div className="dash-msg-time">{msg.time}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}