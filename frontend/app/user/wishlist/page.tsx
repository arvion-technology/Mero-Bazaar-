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
  FiAlertTriangle,
  FiShoppingCart,
  FiTrash2,
  FiMoreHorizontal,
  FiSearch,
} from "react-icons/fi";

const initialWishlist = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&h=200&fit=crop",
    name: "Honda Shine",
    price: 350000,
    currency: "NPR",
    category: "Vehicles",
    addedDate: "2 days ago",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop",
    name: "Organic Tomatoes",
    price: 50,
    currency: "NPR",
    category: "Groceries",
    addedDate: "5 days ago",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=200&h=200&fit=crop",
    name: "Wooden Study Table",
    price: 650,
    currency: "NPR",
    category: "Furniture",
    addedDate: "1 week ago",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200&h=200&fit=crop",
    name: "Baby Clothes Set",
    price: 5000,
    currency: "NPR",
    category: "Fashion",
    addedDate: "2 weeks ago",
  },
];

function formatPrice(price: number, currency: string) {
  return `${currency} ${price.toLocaleString("en-IN")}`;
}

export default function UserWishlist() {
  const [activeTab, setActiveTab] = useState("wishlist");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(initialWishlist);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);
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

  const filteredItems = wishlistItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

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
          margin-bottom: 24px;
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

        /* Search Bar */
        .ud-search-wrap {
          margin-bottom: 24px;
        }

        .ud-search {
          width: 100%;
          max-width: 400px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .ud-search:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
        }

        .ud-search svg {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .ud-search input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          background: transparent;
        }

        .ud-search input::placeholder {
          color: #94a3b8;
        }

        /* Wishlist Grid */
        .ud-wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .ud-wishlist-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.25s;
          position: relative;
        }

        .ud-wishlist-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-3px);
          border-color: #cbd5e1;
        }

        .ud-wishlist-card.removing {
          opacity: 0;
          transform: scale(0.95);
          transition: all 0.3s ease;
        }

        .ud-wishlist-img-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f8fafc;
        }

        .ud-wishlist-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }

        .ud-wishlist-card:hover .ud-wishlist-img {
          transform: scale(1.05);
        }

        .ud-wishlist-category {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 5px 12px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ud-wishlist-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .ud-wishlist-remove:hover {
          background: #fef2f2;
          color: #ef4444;
          transform: scale(1.1);
        }

        .ud-wishlist-body {
          padding: 18px;
        }

        .ud-wishlist-name {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .ud-wishlist-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .ud-wishlist-price {
          font-size: 18px;
          font-weight: 700;
          color: #4f46e5;
          letter-spacing: -0.3px;
        }

        .ud-wishlist-date {
          font-size: 12px;
          color: #94a3b8;
        }

        .ud-wishlist-actions {
          display: flex;
          gap: 8px;
        }

        .ud-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
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

        /* Empty State */
        .ud-empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .ud-empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
        }

        .ud-empty h3 {
          font-size: 16px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        .ud-empty p {
          font-size: 14px;
        }

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
          .ud-wishlist-grid {
            grid-template-columns: 1fr;
          }
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

        @media (min-width: 769px) and (max-width: 1100px) {
          .ud-wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
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
              <h1 className="ud-breadcrumb">Wishlist</h1>
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
            <div className="ud-welcome-section">
              <h2 className="ud-welcome-title">My Wishlist</h2>
              <p className="ud-welcome-sub">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>

            <div className="ud-search-wrap">
              <div className="ud-search">
                <FiSearch size={18} />
                <input
                  type="text"
                  placeholder="Search wishlist items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="ud-empty">
                <div className="ud-empty-icon">
                  <FiHeart size={28} />
                </div>
                <h3>Your wishlist is empty</h3>
                <p>Start adding items you love to your wishlist.</p>
              </div>
            ) : (
              <div className="ud-wishlist-grid">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`ud-wishlist-card ${removingId === item.id ? "removing" : ""}`}
                  >
                    <div className="ud-wishlist-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="ud-wishlist-img"
                        loading="lazy"
                      />
                      <span className="ud-wishlist-category">{item.category}</span>
                      <button
                        className="ud-wishlist-remove"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from wishlist"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <div className="ud-wishlist-body">
                      <div className="ud-wishlist-name">{item.name}</div>
                      <div className="ud-wishlist-meta">
                        <span className="ud-wishlist-price">
                          {formatPrice(item.price, item.currency)}
                        </span>
                        <span className="ud-wishlist-date">{item.addedDate}</span>
                      </div>
                      <div className="ud-wishlist-actions">
                        <button className="ud-btn ud-btn-primary">
                          <FiShoppingCart size={14} />
                          Add to Cart
                        </button>
                        <button className="ud-btn ud-btn-ghost">
                          <FiShoppingBag size={14} />
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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