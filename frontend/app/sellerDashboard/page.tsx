"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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
  FiCalendar,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";

const PRIMARY = "#0f172a";
const ACCENT = "#3b82f6";
const ACCENT_LIGHT = "#60a5fa";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#C0392B";
const SIDEBAR_BG = "#ffffff";
const SIDEBAR_BORDER = "#e8ecf0";
const SIDEBAR_HOVER = "#f4f6fb";

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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const sidebarItems = [
    { id: "dashboard", icon: FiGrid, label: "Dashboard" },
    { id: "orders", icon: FiShoppingCart, label: "Orders", badge: "15" },
    { id: "products", icon: FiBox, label: "Products" },
    { id: "payments", icon: FiCreditCard, label: "Payments" },
    { id: "reports", icon: FiBarChart2, label: "Reports" },
    { id: "clients", icon: FiMessageSquare, label: "Clients", badge: "2" },
    { id: "settings", icon: FiSettings, label: "Settings" },
  ];

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "S";

  function handleNavClick(id: string) {
    setActiveTab(id);
    setSidebarOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

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
          border-right: 1px solid ${SIDEBAR_BORDER};
          box-shadow: 2px 0 8px rgba(0,0,0,0.04);
          transition: width 0.3s ease;
        }

        .dash-logo {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #f0f2f5;
          min-height: 72px;
          overflow: hidden;
        }

        .dash-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .dash-logo-svg {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }

        .dash-logo-text-wrap {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
        }

        .dash-logo-line1 {
          font-size: 14px;
          font-weight: 800;
          color: ${SITE_PRIMARY};
          letter-spacing: -0.3px;
        }

        .dash-logo-line2 {
          font-size: 11px;
          font-weight: 600;
          color: #888;
          letter-spacing: 0.5px;
          text-transform: uppercase;
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
          color: #b0b8c4;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          color: #5a6478;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          border-radius: 10px;
          margin-bottom: 2px;
          position: relative;
        }

        .dash-nav-item:hover {
          background: ${SIDEBAR_HOVER};
          color: #1e293b;
        }

        .dash-nav-item.active {
          background: #fff5f5;
          color: ${SITE_PRIMARY};
          font-weight: 600;
        }

        .dash-nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: ${SITE_PRIMARY};
          border-radius: 0 3px 3px 0;
        }

        .dash-nav-icon {
          font-size: 18px;
          width: 22px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
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
          border-top: 1px solid #f0f2f5;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dash-sidebar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${SITE_PRIMARY}, #e74c3c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
          overflow: hidden;
        }

        .dash-sidebar-user {
          flex: 1;
          min-width: 0;
        }

        .dash-sidebar-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }

        .dash-sidebar-role {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }

        /* ── Profile Avatar Dropdown ── */
        .dash-profile-wrap {
          position: relative;
        }

        .dash-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: 40px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .dash-profile-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .dash-profile-btn-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${SITE_PRIMARY}, #e74c3c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          overflow: hidden;
          flex-shrink: 0;
        }

        .dash-profile-btn-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dash-profile-chevron {
          color: #94a3b8;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .dash-profile-chevron.open {
          transform: rotate(180deg);
        }

        .dash-profile-dropdown {
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

        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dash-dropdown-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .dash-dropdown-username {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .dash-dropdown-role {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .dash-dropdown-item {
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
          text-decoration: none;
        }

        .dash-dropdown-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .dash-dropdown-item.logout {
          color: #ef4444;
        }

        .dash-dropdown-item.logout:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .dash-dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0;
        }

        /* ── Main Content ── */
        .dash-main {
          flex: 1;
          margin-left: 264px;
          padding: 24px 32px 32px;
          max-width: calc(100% - 264px);
          width: 100%;
        }

        /* Top Bar */
        .dash-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dash-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .dash-topbar-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
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
          flex-shrink: 0;
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
          flex-shrink: 0;
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
          flex-shrink: 0;
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
          width: 100%;
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
          flex-wrap: wrap;
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
          width: 100%;
          overflow: hidden;
        }

        .dash-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }

        .dash-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
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
          flex-shrink: 0;
        }

        .dash-card-link:hover {
          gap: 6px;
          text-decoration: underline;
        }

        /* Table */
        .dash-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
        }

        .dash-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 500px;
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
          flex-wrap: wrap;
          gap: 8px;
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
          flex-wrap: wrap;
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
          width: 100%;
        }

        .dash-chart-svg {
          width: 100%;
          height: 100%;
          display: block;
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
          width: 100%;
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

        /* ── Desktop collapsed state ── */
        .dash-sidebar.desktop-collapsed {
          width: 72px;
        }
        .dash-sidebar.desktop-collapsed .dash-logo-text-wrap,
        .dash-sidebar.desktop-collapsed .dash-nav-item span:not(.dash-nav-icon),
        .dash-sidebar.desktop-collapsed .dash-nav-badge,
        .dash-sidebar.desktop-collapsed .dash-sidebar-user,
        .dash-sidebar.desktop-collapsed .dash-nav-label {
          display: none;
        }
        .dash-sidebar.desktop-collapsed .dash-logo { justify-content: center; padding: 20px 0; }
        .dash-sidebar.desktop-collapsed .dash-logo-svg { margin: 0 auto; }
        .dash-sidebar.desktop-collapsed .dash-nav { padding: 16px 8px; }
        .dash-sidebar.desktop-collapsed .dash-nav-item { justify-content: center; padding: 14px; }
        .dash-sidebar.desktop-collapsed .dash-sidebar-footer { justify-content: center; padding: 12px; }

        .dash-main.desktop-collapsed {
          margin-left: 72px;
          max-width: calc(100% - 72px);
        }

        /* ── Backdrop (mobile/tablet overlay) ── */
        .dash-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
          z-index: 99;
          animation: backdropIn 0.2s ease;
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Mobile close button inside sidebar */
        .dash-sidebar-close {
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
          transition: all 0.2s;
          z-index: 1;
        }
        .dash-sidebar-close:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        /* ── Hamburger button in topbar ── */
        .dash-hamburger {
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
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .dash-hamburger:hover {
          background: #f8fafc;
          color: #334155;
          border-color: #cbd5e1;
        }

        /* ── Responsive ── */

        /* Large tablets — 2 col stats, 2 col quick actions */
        @media (max-width: 1200px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-quick-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Tablet: overlay sidebar, full-width main */
        @media (max-width: 1023px) {
          .dash-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            width: 80% !important;
            max-width: 320px;
            z-index: 200;
          }
          .dash-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.15);
          }
          .dash-backdrop.active {
            display: block;
          }
          .dash-sidebar.mobile-open .dash-sidebar-close {
            display: flex;
          }
          .dash-hamburger {
            display: flex;
          }
          .dash-main {
            margin-left: 0 !important;
            max-width: 100% !important;
            padding: 20px 20px 32px;
            width: 100%;
          }
          .dash-main.desktop-collapsed {
            margin-left: 0 !important;
            max-width: 100% !important;
          }
          .dash-two-col { grid-template-columns: 1fr; }
          .dash-profile-btn-name { display: none; }
          .dash-desktop-toggle { display: none; }
          .dash-search { width: 240px; }
        }

        /* Mobile: single column everything */
        @media (max-width: 767px) {
          .dash-main { padding: 16px; width: 100%; }

          /* Header: 2 rows */
          .dash-topbar {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding-bottom: 16px;
          }

          .dash-topbar-left {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 8px;
          }

          .dash-topbar-title-wrap {
            flex: 1;
            min-width: 0;
          }

          .dash-topbar-title {
            font-size: 18px;
          }

          .dash-topbar-sub {
            font-size: 12px;
          }

          .dash-topbar-right {
            width: 100%;
            justify-content: flex-end;
            gap: 8px;
          }

          /* Search: full width, second row */
          .dash-search {
            width: 100%;
            order: 3;
            flex-shrink: 1;
          }

          /* Stats: 1 column */
          .dash-stats { 
            grid-template-columns: 1fr; 
            gap: 12px;
            margin-bottom: 20px;
          }

          .dash-stat-card {
            padding: 16px;
            width: 100%;
          }

          .dash-stat-value {
            font-size: 20px;
          }

          /* Two col: stack */
          .dash-two-col { 
            grid-template-columns: 1fr; 
            gap: 16px;
            margin-bottom: 20px;
          }

          /* Cards */
          .dash-card {
            padding: 16px;
            width: 100%;
          }

          .dash-card-header {
            margin-bottom: 16px;
          }

          /* Chart */
          .dash-chart-area { 
            height: 160px; 
          }

          /* Quick actions: 1 column */
          .dash-quick-grid { 
            grid-template-columns: 1fr; 
            gap: 12px;
          }

          .dash-quick-card {
            padding: 16px;
          }

          /* Table */
          .dash-table-wrap { 
            overflow-x: auto; 
            -webkit-overflow-scrolling: touch;
            margin: 0 -16px;
            padding: 0 16px;
            width: calc(100% + 32px);
          }

          .dash-table {
            min-width: 520px;
          }

          /* Messages */
          .dash-msg-item {
            padding: 12px;
          }

          .dash-msg-text {
            font-size: 12px;
          }

          .dash-msg-time {
            font-size: 10px;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .dash-main { padding: 12px; }

          .dash-topbar-title {
            font-size: 16px;
          }

          .dash-stat-card {
            padding: 14px;
          }

          .dash-stat-icon-wrap {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .dash-stat-value {
            font-size: 18px;
          }

          .dash-card {
            padding: 14px;
            border-radius: 12px;
          }

          .dash-chart-area {
            height: 140px;
          }

          .dash-quick-card {
            padding: 14px;
            border-radius: 12px;
          }

          .dash-quick-icon {
            width: 38px;
            height: 38px;
            font-size: 18px;
          }

          .dash-msg-avatar {
            width: 36px;
            height: 36px;
            font-size: 12px;
          }

          .dash-icon-btn {
            width: 36px;
            height: 36px;
          }

          .dash-profile-btn-avatar {
            width: 28px;
            height: 28px;
            font-size: 11px;
          }
        }
      `}</style>

      {/* ── Mobile/Tablet Backdrop ── */}
      <div
        className={`dash-backdrop ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="dash-page">
        {/* ── Sidebar ── */}
        <aside className={`dash-sidebar ${sidebarOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "desktop-collapsed" : ""}`}>
          {/* Mobile close button */}
          <button
            type="button"
            className="dash-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>

          {/* Logo */}
          <div className="dash-logo">
            <Link href="/" className="dash-logo-wrap">
              <svg className="dash-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <div className="dash-logo-text-wrap">
                <span className="dash-logo-line1">HamroNepal</span>
                <span className="dash-logo-line2">Bazaar</span>
              </div>
            </Link>
          </div>

          <div className="dash-nav">
            <div className="dash-nav-label">Main Menu</div>
            {sidebarItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`dash-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
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
            <div className="dash-sidebar-avatar">
              {session?.user?.image
                ? <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                : userInitials
              }
            </div>
            <div className="dash-sidebar-user">
              <div className="dash-sidebar-name">{session?.user?.name || "Seller"}</div>
              <div className="dash-sidebar-role">{session?.user?.email || "Seller Account"}</div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className={`dash-main ${sidebarCollapsed ? "desktop-collapsed" : ""}`}>
          {/* Top Bar */}
          <div className="dash-topbar">
            <div className="dash-topbar-left">
              <button
                type="button"
                className="dash-hamburger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>
              <button
                type="button"
                className="dash-icon-btn dash-desktop-toggle"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                style={{ marginRight: 8 }}
              >
                <FiMoreHorizontal size={18} />
              </button>
              <div className="dash-topbar-title-wrap">
                <h1 className="dash-topbar-title">Dashboard</h1>
                <p className="dash-topbar-sub">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
              </div>
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
              <button type="button" className="dash-icon-btn">
                <FiBell size={18} />
                <span className="dash-badge">3</span>
              </button>

              {/* Profile Avatar Dropdown */}
              <div className="dash-profile-wrap" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="dash-profile-btn"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                >
                  <div className="dash-profile-btn-avatar">
                    {session?.user?.image
                      ? <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : userInitials
                    }
                  </div>
                  <span className="dash-profile-btn-name">{session?.user?.name || "Seller"}</span>
                  <FiChevronDown size={14} className={`dash-profile-chevron ${showProfileDropdown ? "open" : ""}`} />
                </button>

                {showProfileDropdown && (
                  <div className="dash-profile-dropdown">
                    <div className="dash-dropdown-header">
                      <div className="dash-dropdown-username">{session?.user?.name || "Seller"}</div>
                      <div className="dash-dropdown-role">Seller Account</div>
                    </div>
                    <Link
                      href="/user/settings"
                      className="dash-dropdown-item"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FiUser size={15} />
                      Profile & Settings
                    </Link>
                    <div className="dash-dropdown-divider" />
                    <button
                      type="button"
                      className="dash-dropdown-item logout"
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