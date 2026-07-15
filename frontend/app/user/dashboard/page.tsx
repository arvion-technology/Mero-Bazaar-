"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiGrid,
  FiShoppingBag,
  FiHeart,
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
  FiLogOut,
  FiMapPin,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";

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

const PRIMARY = "#C0392B";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const { data: session } = useSession();
  const token =  session?.accessToken;
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const [securityNotifs, setSecurityNotifs] = useState<{ id: string; type: string; createdAt: string; read: boolean }[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number | null>(null);

  // Compute profile-completeness notifications (reused from Navbar logic)
  const notifications: string[] = session
    ? ([
        !session.user?.phone && "Add your phone number",
        !session.user?.address && "Add your address",
        ...securityNotifs.filter((n) => !n.read).map((n) => activityLabel(n.type)),
      ].filter(Boolean) as string[])
    : [];
  const notificationCount = notifications.length;

  const sidebarItems = [
    { id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/user/dashboard" },
    { id: "orders", icon: FiShoppingBag, label: "My Orders", href: "/user/orders" },
    { id: "wishlist", icon: FiHeart, label: "Wishlist", href: "/user/wishlist" },
    { id: "notification", icon: FiBell, label: "Notifications", href: "/user/notifications" },
    { id: "help", icon: FiHelpCircle, label: "Help & Support", href: "/user/help" },
    { id: "settings", icon: FiSettings, label: "Settings", href: "/user/settings" },
  ];

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setWishlistCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setWishlistCount(0));
  }, [token]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  function activityLabel(type: string) {
  switch (type) {
    case "PASSWORD_CHANGED": return "Password changed";
    case "TWO_FA_ENABLED": return "Two-factor authentication enabled";
    case "TWO_FA_DISABLED": return "Two-factor authentication disabled";
    case "PHONE_CHANGED": return "Phone number changed";
    default: return type;
  }
}

  useEffect(() => {
    if (!token) return;
    fetch("/api/user/notifications/security", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setSecurityNotifs)
      .catch(() => {});
  }, [token]); 
  
  function getImageUrl(image?: string | null) {
  if (!image) return "";
  return image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
}

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

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const stats: {
    icon: typeof FiShoppingBag;
    label: string;
    value: string;
    change: string;
    color: string;
    bg: string;
    href: string;
  }[] = [
    { icon: FiShoppingBag, label: "Total Orders", value: "320", change: "+12%", color: "#4f46e5", bg: "#eef2ff", href: "/user/orders" },
    { icon: FiDollarSign, label: "Total Spent", value: "NPR 32,890", change: "+8%", color: "#10b981", bg: "#ecfdf5", href: "/user/orders" },
    { icon: FiHeart, label: "Wishlist", value: wishlistCount === null ? "…" : String(wishlistCount), change: "", color: "#ef4444", bg: "#fef2f2", href: "/user/wishlist" },
    { icon: FiMapPin, label: "Saved Items", value: "3", change: "", color: "#f59e0b", bg: "#fffbeb", href: "/user/dashboard" },
  ];

return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          overflow-x: hidden;
          max-width: 100vw;
        }

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
          background: #ffffff;
          border-right: 1px solid #e8ecf0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.3s ease, transform 0.3s ease;
          position: fixed;
          height: 100vh;
          height: 100dvh;
          left: 0;
          top: 0;
          z-index: 100;
          box-shadow: 2px 0 8px rgba(0,0,0,0.04);
        }

        .ud-sidebar.collapsed {
          width: 72px;
        }

        .ud-sidebar-header {
          padding: 20px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #f0f2f5;
          min-height: 72px;
          overflow: hidden;
        }

        .ud-sidebar-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .ud-sidebar-logo-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }

        .ud-sidebar-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          opacity: 1;
          transition: opacity 0.2s, width 0.2s;
          white-space: nowrap;
          overflow: hidden;
        }

        .ud-sidebar.collapsed .ud-sidebar-logo-text {
          opacity: 0;
          width: 0;
        }

        .ud-logo-line1 {
          font-size: 14px;
          font-weight: 800;
          color: ${PRIMARY};
          letter-spacing: -0.3px;
        }

        .ud-logo-line2 {
          font-size: 11px;
          font-weight: 600;
          color: #888;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .ud-nav-section {
          padding: 16px 12px;
          flex: 1;
          overflow-y: auto;
        }

        .ud-nav-label {
          font-size: 10px;
          font-weight: 700;
          color: #b0b8c4;
          text-transform: uppercase;
          letter-spacing: 1.2px;
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
          color: #5a6478;
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
          border-radius: 10px;
          margin-bottom: 2px;
          position: relative;
          white-space: nowrap;
        }

        .ud-nav-item:hover {
          background: #f4f6fb;
          color: #1e293b;
        }

        .ud-nav-item.active {
          background: #fff5f5;
          color: ${PRIMARY};
          font-weight: 600;
        }

        .ud-nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: ${PRIMARY};
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
          overflow: hidden;
        }

        .ud-sidebar-footer {
          padding: 16px;
          border-top: 1px solid #f0f2f5;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ud-sidebar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${PRIMARY}, #e74c3c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
          overflow: hidden;
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
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }

        .ud-sidebar-role {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
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
          width: calc(100% - 260px);
          min-width: 0;
        }

        .ud-sidebar.collapsed ~ .ud-main-area {
          margin-left: 72px;
          width: calc(100% - 72px);
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
          gap: 16px;
        }

        .ud-topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;
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
          flex-shrink: 0;
        }

        .ud-toggle-btn:hover {
          background: #f8fafc;
          color: #334155;
          border-color: #cbd5e1;
        }

        .ud-breadcrumb {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ud-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
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
          flex-shrink: 0;
          text-decoration: none;
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

        /* ── Profile Avatar Dropdown ── */
        .ud-profile-wrap {
          position: relative;
        }

        .ud-profile-btn {
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

        .ud-profile-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .ud-profile-btn-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${PRIMARY}, #e74c3c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          overflow: hidden;
          flex-shrink: 0;
        }

        .ud-profile-btn-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ud-profile-chevron {
          color: #94a3b8;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .ud-profile-chevron.open {
          transform: rotate(180deg);
        }

        .ud-profile-dropdown {
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

        .ud-dropdown-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .ud-dropdown-username {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .ud-dropdown-email {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ud-dropdown-item {
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

        .ud-dropdown-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .ud-dropdown-item.logout {
          color: #ef4444;
        }

        .ud-dropdown-item.logout:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .ud-dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0;
        }

        /* ── Main Content ── */
        .ud-main {
          flex: 1;
          padding: 28px 32px;
          overflow-y: auto;
          min-width: 0;
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
          min-width: 0;
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
          flex-shrink: 0;
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
          flex-shrink: 0;
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
          gap: 12px;
          flex-wrap: wrap;
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
          flex-shrink: 0;
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
          width: 100%;
        }

        .ud-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
        }

        .ud-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
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
          white-space: nowrap;
        }

        .ud-table td {
          padding: 14px 20px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f8fafc;
          white-space: nowrap;
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
          white-space: nowrap;
        }

        .ud-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ud-amount {
          font-weight: 600;
          color: #1e293b;
        }

        /* Mobile Order Cards */
        .ud-mobile-orders {
          display: none;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
        }

        .ud-mobile-order-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 14px;
          border: 1px solid #f1f5f9;
        }

        .ud-mobile-order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .ud-mobile-order-id {
          font-weight: 600;
          color: #1e293b;
          font-family: "SF Mono", monospace;
          font-size: 13px;
        }

        .ud-mobile-order-date {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .ud-mobile-order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ud-mobile-order-amount {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }

        /* Contacts */
        .ud-contacts-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
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
          min-width: 0;
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
          flex-shrink: 0;
        }

        /* ── Backdrop (mobile overlay) ── */
        .ud-backdrop {
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

        /* Mobile sidebar close button */
        .ud-sidebar-close {
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
        .ud-sidebar-close:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        /* Hamburger - hidden on desktop */
        .ud-hamburger {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .ud-hamburger:hover {
          background: #f8fafc;
          color: #334155;
          border-color: #cbd5e1;
        }

        /* Desktop toggle - hidden on mobile */
        .ud-desktop-toggle {
          display: flex;
        }

        /* ── Responsive ── */

        /* Large tablets */
        @media (max-width: 1200px) {
          .ud-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Tablet + Mobile: overlay sidebar */
        @media (max-width: 1023px) {
          .ud-sidebar {
            transform: translateX(-100%);
            width: 280px !important;
            z-index: 200;
          }
          .ud-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.15);
          }
          .ud-backdrop.active {
            display: block;
          }
          .ud-sidebar.mobile-open .ud-sidebar-close {
            display: flex;
          }
          .ud-hamburger {
            display: flex;
          }
          .ud-desktop-toggle {
            display: none;
          }
          .ud-main-area {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .ud-main {
            padding: 20px 20px 32px;
          }
          .ud-topbar {
            padding: 0 20px;
          }
        }

        /* Mobile: < 768px */
        @media (max-width: 767px) {
          .ud-main {
            padding: 16px;
          }
          .ud-topbar {
            padding: 0 16px;
            height: 56px;
          }
          .ud-breadcrumb {
            font-size: 18px;
          }
          .ud-welcome-title {
            font-size: 20px;
          }
          .ud-welcome-sub {
            font-size: 13px;
          }

          /* Stats: 1 column */
          .ud-stats {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }
          .ud-stat-card {
            padding: 16px;
          }
          .ud-stat-value {
            font-size: 22px;
          }

          /* Table: hide, show cards */
          .ud-table-wrap {
            display: none;
          }
          .ud-mobile-orders {
            display: flex;
          }

          /* Contacts */
          .ud-contact-row {
            padding: 12px 16px;
            gap: 12px;
          }
          .ud-contact-avatar {
            width: 36px;
            height: 36px;
            font-size: 12px;
          }
          .ud-contact-name {
            font-size: 13px;
          }
          .ud-contact-phone {
            font-size: 11px;
          }
          .ud-contact-time {
            font-size: 11px;
          }

          /* Profile */
          .ud-profile-btn-name {
            display: none;
          }
        }

        /* Small mobile: < 480px */
        @media (max-width: 480px) {
          .ud-main {
            padding: 12px;
          }
          .ud-topbar {
            padding: 0 12px;
          }
          .ud-stats {
            gap: 10px;
          }
          .ud-stat-card {
            padding: 14px;
          }
          .ud-stat-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
          .ud-stat-value {
            font-size: 20px;
          }
          .ud-welcome-section {
            margin-bottom: 20px;
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
          background: rgba(239,68,68,0.06);
          color: #ef4444;
        }
      `}</style>

      {/* ── Mobile Backdrop ── */}
      <div
        className={`ud-backdrop ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="ud-page">
        {/* ── Sidebar ── */}
        <aside className={`ud-sidebar ${sidebarOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
          {/* Mobile close button */}
          <button
            type="button"
            className="ud-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>

          {/* Logo */}
          <div className="ud-sidebar-header">
            <Link href="/" className="ud-sidebar-logo-wrap">
              <svg className="ud-sidebar-logo-icon" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
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
              <div className="ud-sidebar-logo-text">
                <span className="ud-logo-line1">HamroNepal</span>
                <span className="ud-logo-line2">Bazaar</span>
              </div>
            </Link>
          </div>

          <div className="ud-nav-section">
            <div className="ud-nav-label">Menu</div>
            {sidebarItems.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`ud-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                <span className="ud-nav-icon">
                  <item.icon size={18} />
                </span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}

            <div className="ud-nav-label" style={{ marginTop: 16 }}>Account</div>
            {sidebarItems.slice(4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`ud-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                <span className="ud-nav-icon">
                  <item.icon size={18} />
                </span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}

            {/* Delete Account */}
            <button
              type="button"
              className="ud-nav-item danger"
              onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }}
              title="Delete Account"
            >
              <span className="ud-nav-icon">
                <FiTrash2 size={18} />
              </span>
              <span className="ud-nav-text">Delete Account</span>
            </button>
          </div>

          {/* Sidebar footer intentionally left empty */}
        </aside>

        {/* ── Main Area ── */}
        <div className="ud-main-area">
          {/* Top Header */}
          <header className="ud-topbar">
            <div className="ud-topbar-left">
              {/* Hamburger - mobile only */}
              <button
                type="button"
                className="ud-hamburger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>
              {/* Desktop toggle - desktop only */}
              <button
                type="button"
                className="ud-toggle-btn ud-desktop-toggle"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="ud-breadcrumb">Dashboard</h1>
            </div>
            <div className="ud-topbar-right">
              {/* Notifications Bell */}
              <div style={{ position: "relative" }} ref={notifDropdownRef}>
                <button
                  type="button"
                  className="ud-icon-btn"
                  title="Notifications"
                  onClick={() => {
                    setShowNotifDropdown((v) => !v);
                    setNotifSeen(true);
                    if (securityNotifs.some((n) => !n.read)) {
                      fetch("/api/profile/notifications/security/mark-read", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                      }).then(() => {
                       setSecurityNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
                      });
                    }
                  }}
                >
                  <FiBell size={18} />
                  {notificationCount > 0 && !notifSeen && (
                    <span className="ud-badge">{notificationCount}</span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    minWidth: "280px",
                    zIndex: 999,
                    overflow: "hidden",
                    animation: "dropdownIn 0.15s ease",
                  }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "13px", color: "#1e293b" }}>
                      Notifications
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((msg, i) => (
                        <Link
                          key={i}
                          href="/user/settings"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "12px 16px",
                            fontSize: "13px",
                            color: "#475569",
                            borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none",
                            textDecoration: "none",
                            transition: "background 0.15s",
                          }}
                          onClick={() => setShowNotifDropdown(false)}
                        >
                          <FiAlertCircle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                          {msg}
                        </Link>
                      ))
                    ) : (
                      <div style={{ padding: "16px", fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>
                        You&apos;re all caught up ✓
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Avatar Dropdown */}
              <div className="ud-profile-wrap" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="ud-profile-btn"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                >
                  <div className="ud-profile-btn-avatar">
                    {session?.user?.image
                      ? <img src={getImageUrl(session.user.image)} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : userInitials
                    }
                  </div>
                  <FiChevronDown size={14} className={`ud-profile-chevron ${showProfileDropdown ? "open" : ""}`} />
                </button>

                {showProfileDropdown && (
                  <div className="ud-profile-dropdown">
                    <div className="ud-dropdown-header">
                      <div className="ud-dropdown-username">{session?.user?.name || "User"}</div>
                      <div className="ud-dropdown-email">{session?.user?.email || ""}</div>
                    </div>
                    <Link
                      href="/user/settings"
                      className="ud-dropdown-item"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FiUser size={15} />
                      Profile & Settings
                    </Link>
                    <div className="ud-dropdown-divider" />
                    <button
                      type="button"
                      className="ud-dropdown-item logout"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="ud-main">
            <div className="ud-welcome-section">
              <h2 className="ud-welcome-title">Welcome back, {session?.user?.name?.split(" ")[0] || "there"}! 👋</h2>
              <p className="ud-welcome-sub">Here&apos;s what&apos;s happening with your account today.</p>
            </div>

            <div className="ud-stats">
              {stats.map((stat) => (
                <Link key={stat.label} href={stat.href} className="ud-stat-card" style={{ textDecoration: "none" }}>
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
                </Link>
              ))}
            </div>

            <div className="ud-section-header">
              <h3 className="ud-section-title">Recent Orders</h3>
              <Link href="/user/orders" className="ud-section-link">
                View All <FiChevronRight size={14} />
              </Link>
            </div>
            <div className="ud-orders-card">
              {/* Desktop/Tablet Table */}
              <div className="ud-table-wrap">
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

              {/* Mobile Order Cards */}
              <div className="ud-mobile-orders">
                {recentOrders.map((order, idx) => (
                  <div key={idx} className="ud-mobile-order-card">
                    <div className="ud-mobile-order-header">
                      <span className="ud-mobile-order-id">{order.id}</span>
                      <span
                        className="ud-status"
                        style={{ background: order.statusColor + "12", color: order.statusColor }}
                      >
                        <span className="ud-status-dot" style={{ background: order.statusColor }}></span>
                        {order.status}
                      </span>
                    </div>
                    <div className="ud-mobile-order-date">{order.date}</div>
                    <div className="ud-mobile-order-footer">
                      <span className="ud-mobile-order-amount">{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
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
              wishlist, and personal data will be permanently deleted.
            </div>
            {deleteError && (
              <div className="ud-modal-error">{deleteError}</div>
            )}
            <div className="ud-modal-actions">
              <button
                type="button"
                className="ud-modal-cancel"
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
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