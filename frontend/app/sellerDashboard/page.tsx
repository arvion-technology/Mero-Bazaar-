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
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiPlus,
  FiEye,
  FiDollarSign,
  FiPieChart,
  FiChevronRight,
} from "react-icons/fi";
import { FaShoppingBag, FaClock, FaMoneyBillWave, FaListAlt } from "react-icons/fa";

const PRIMARY = "#C0392B";
const PRIMARY_DARK = "#A93226";
const SIDEBAR_BG = "#4a4de7";
const SIDEBAR_ACTIVE = "#1a1d6e";

const stats = [
  { icon: FaShoppingBag, label: "Total Orders", value: "320", sub: "This Month: 45", color: "#4a4de7" },
  { icon: FaClock, label: "Pending Orders", value: "15", sub: "", color: "#e74c3c" },
  { icon: FaMoneyBillWave, label: "Total Earnings", value: "NPR1,25,000", sub: "This Month: NPR .00.1", color: "#27ae60" },
  { icon: FaListAlt, label: "Product List", value: "58", sub: "This Month: 45", color: "#f39c12" },
];

const recentOrders = [
  { id: "#1024", customer: "Sita Sharma", status: "NPR. 500" },
  { id: "#1023", customer: "Hari Bahadur", status: "NPR.500" },
  { id: "#1022", customer: "Anis Kumar", status: "NPR. 2,100" },
];

const quickActions = [
  { icon: FiPlus, label: "Add Product", color: "#e74c3c" },
  { icon: FiEye, label: "View orders", color: "#27ae60" },
  { icon: FiCreditCard, label: "Manage payments", color: "#3498db" },
  { icon: FiPieChart, label: "View Reports", color: "#9b59b6" },
];

const messages = [
  { initials: "RS", name: "Ramesh Store", msg: "Hello, is the product still available", time: "10:30 AM", color: "#4a4de7" },
  { initials: "PS", name: "Prakash Suppliers", msg: "When will my be shipped", time: "09:15 AM", color: "#e74c3c" },
  { initials: "SK", name: "Sneha Kadka", msg: "Thank you for the fast delivery!", time: "Yesterday", color: "#27ae60" },
];

const chartData = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 40 },
  { month: "Apr", value: 55 },
  { month: "May", value: 70 },
  { month: "Jun", value: 85 },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", icon: FiGrid, label: "Dashboard" },
    { id: "orders", icon: FiShoppingCart, label: "Orders" },
    { id: "products", icon: FiBox, label: "Products" },
    { id: "payments", icon: FiCreditCard, label: "Payments" },
    { id: "reports", icon: FiBarChart2, label: "Reports" },
    { id: "messages", icon: FiMessageSquare, label: "Messages" },
    { id: "settings", icon: FiSettings, label: "Settings" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-page {
          min-height: 100vh;
          background: ${PRIMARY};
          display: flex;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          padding: 12px;
        }

        .dash-container {
          display: flex;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }

        /* ── Sidebar ── */
        .dash-sidebar {
          width: 200px;
          background: ${SIDEBAR_BG};
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          flex-shrink: 0;
        }

        .dash-sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .dash-sidebar-item:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .dash-sidebar-item.active {
          background: ${SIDEBAR_ACTIVE};
          color: #fff;
        }

        .dash-sidebar-icon {
          font-size: 18px;
          width: 24px;
          display: flex;
          justify-content: center;
        }

        .dash-sidebar-footer {
          margin-top: auto;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .dash-sidebar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
        }

        .dash-sidebar-user {
          color: #fff;
        }

        .dash-sidebar-name {
          font-size: 13px;
          font-weight: 600;
        }

        .dash-sidebar-id {
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }

        /* ── Main Content ── */
        .dash-main {
          flex: 1;
          padding: 24px 28px;
          overflow-y: auto;
        }

        .dash-header {
          font-size: 20px;
          font-weight: 700;
          color: ${SIDEBAR_BG};
          margin-bottom: 20px;
        }

        .dash-welcome {
          font-size: 18px;
          font-weight: 600;
          color: ${SIDEBAR_BG};
          margin-bottom: 20px;
        }

        /* Stats Grid */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .dash-stat-card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .dash-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .dash-stat-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .dash-stat-label {
          font-size: 11px;
          color: #888;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .dash-stat-value {
          font-size: 22px;
          font-weight: 700;
          color: #333;
          margin-bottom: 4px;
        }

        .dash-stat-sub {
          font-size: 10px;
          color: #aaa;
        }

        /* Two Column Layout */
        .dash-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .dash-section-title {
          font-size: 16px;
          font-weight: 700;
          color: ${SIDEBAR_BG};
          margin-bottom: 14px;
        }

        /* Recent Orders */
        .dash-orders {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 16px;
        }

        .dash-orders-header {
          display: grid;
          grid-template-columns: 80px 1fr 80px;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 8px;
        }

        .dash-orders-header span {
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        .dash-order-row {
          display: grid;
          grid-template-columns: 80px 1fr 80px;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f5f5f5;
          font-size: 13px;
          color: #333;
        }

        .dash-order-row:last-child {
          border-bottom: none;
        }

        .dash-view-all {
          display: block;
          text-align: center;
          color: ${SIDEBAR_BG};
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }

        .dash-view-all:hover {
          text-decoration: underline;
        }

        /* Seller Overview / Chart */
        .dash-overview {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 16px;
        }

        .dash-overview-title {
          font-size: 16px;
          font-weight: 700;
          color: ${SIDEBAR_BG};
          margin-bottom: 4px;
        }

        .dash-overview-sub {
          font-size: 13px;
          color: #888;
          margin-bottom: 16px;
        }

        .dash-chart {
          height: 140px;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 4px;
        }

        .dash-chart-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 24px;
        }

        .dash-chart-svg {
          width: 100%;
          height: 100%;
        }

        .dash-chart-months {
          display: flex;
          justify-content: space-between;
          padding: 0 4px;
          margin-top: 8px;
        }

        .dash-chart-month {
          font-size: 11px;
          color: #888;
          text-align: center;
          flex: 1;
        }

        /* Quick Actions */
        .dash-quick {
          margin-bottom: 24px;
        }

        .dash-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .dash-quick-card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dash-quick-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .dash-quick-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          font-size: 20px;
          color: #fff;
        }

        .dash-quick-label {
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }

        /* Recent Messages */
        .dash-messages {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 16px;
        }

        .dash-msg-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .dash-msg-row:last-child {
          border-bottom: none;
        }

        .dash-msg-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .dash-msg-content {
          flex: 1;
          min-width: 0;
        }

        .dash-msg-name {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          margin-bottom: 2px;
        }

        .dash-msg-text {
          font-size: 12px;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dash-msg-time {
          font-size: 11px;
          color: #aaa;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .dash-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .dash-two-col {
            grid-template-columns: 1fr;
          }
          .dash-quick-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .dash-sidebar {
            width: 60px;
          }
          .dash-sidebar-item span {
            display: none;
          }
          .dash-sidebar-footer {
            display: none;
          }
          .dash-stats {
            grid-template-columns: 1fr 1fr;
          }
          .dash-main {
            padding: 16px;
          }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-container">
          {/* ── Sidebar ── */}
          <aside className="dash-sidebar">
            <div style={{ padding: "0 20px 16px", fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Seller DashBoard
            </div>

            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`dash-sidebar-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="dash-sidebar-icon">
                  <item.icon size={18} />
                </span>
                <span>{item.label}</span>
              </button>
            ))}

            <div className="dash-sidebar-footer">
              <div className="dash-sidebar-avatar">
                <FiUser size={16} />
              </div>
              <div className="dash-sidebar-user">
                <div className="dash-sidebar-name">Hamro Bazar</div>
                <div className="dash-sidebar-id">Seller Id: FCT1234</div>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="dash-main">
            <div className="dash-welcome">Welcome, Hamro Bazar!</div>

            {/* Stats */}
            <div className="dash-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ color: stat.color }}>
                    <stat.icon size={28} />
                  </div>
                  <div className="dash-stat-label">{stat.label}</div>
                  <div className="dash-stat-value">{stat.value}</div>
                  {stat.sub && <div className="dash-stat-sub">{stat.sub}</div>}
                </div>
              ))}
            </div>

            {/* Two Column: Orders + Overview */}
            <div className="dash-two-col">
              {/* Recent Orders */}
              <div className="dash-orders">
                <div className="dash-section-title">Recent Orders</div>
                <div className="dash-orders-header">
                  <span>Order Id</span>
                  <span>Customer</span>
                  <span>Status</span>
                </div>
                {recentOrders.map((order) => (
                  <div key={order.id} className="dash-order-row">
                    <span style={{ fontWeight: 600, color: "#333" }}>{order.id}</span>
                    <span>{order.customer}</span>
                    <span>{order.status}</span>
                  </div>
                ))}
                <Link href="/seller/orders" className="dash-view-all">
                  View All
                </Link>
              </div>

              {/* Seller Overview */}
              <div className="dash-overview">
                <div className="dash-overview-title">Seller Overview</div>
                <div className="dash-overview-sub">Sales & Earning</div>
                <div className="dash-chart">
                  <svg className="dash-chart-svg" viewBox="0 0 300 120" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#e74c3c"
                      strokeWidth="2"
                      points={chartData.map((d, i) => `${i * 60},${120 - d.value}`).join(" ")}
                    />
                    <polyline
                      fill="none"
                      stroke="#4a4de7"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      points={chartData.map((d, i) => `${i * 60},${120 - d.value - 15}`).join(" ")}
                    />
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
              <div className="dash-section-title">Quick Actions</div>
              <div className="dash-quick-grid">
                {quickActions.map((action) => (
                  <div key={action.label} className="dash-quick-card">
                    <div className="dash-quick-icon" style={{ background: action.color }}>
                      <action.icon size={20} />
                    </div>
                    <div className="dash-quick-label">{action.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="dash-messages">
              <div className="dash-section-title">Recent Message</div>
              {messages.map((msg) => (
                <div key={msg.name} className="dash-msg-row">
                  <div className="dash-msg-avatar" style={{ background: msg.color }}>
                    {msg.initials}
                  </div>
                  <div className="dash-msg-content">
                    <div className="dash-msg-name">{msg.name}</div>
                    <div className="dash-msg-text">{msg.msg}</div>
                  </div>
                  <div className="dash-msg-time">{msg.time}</div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}