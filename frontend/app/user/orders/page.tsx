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
  FiAlertTriangle,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
  FiMoreHorizontal,
  FiSearch,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const PRIMARY = "#C0392B";

// ── Mock order data ──
const ALL_ORDERS = [
  { id: "#1024", item: "Laptop Stand", date: "Jun 22, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 850" },
  { id: "#1023", item: "Wireless Keyboard", date: "Jun 19, 2025", status: "Shipped", statusColor: "#6366f1", amount: "NPR 1,200" },
  { id: "#1022", item: "USB Hub 7-Port", date: "Jun 15, 2025", status: "Processing", statusColor: "#f59e0b", amount: "NPR 650" },
  { id: "#1021", item: "Monitor Light Bar", date: "Jun 10, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 1,450" },
  { id: "#1020", item: "Mechanical Keyboard", date: "Jun 5, 2025", status: "Cancelled", statusColor: "#ef4444", amount: "NPR 2,800" },
  { id: "#1019", item: "Webcam HD 1080p", date: "May 30, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 3,200" },
  { id: "#1018", item: "Desk Mat XL", date: "May 24, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 550" },
  { id: "#1017", item: "GPU RTX 3060", date: "May 18, 2025", status: "Shipped", statusColor: "#6366f1", amount: "NPR 45,000" },
  { id: "#1016", item: "LED Desk Lamp", date: "May 12, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 720" },
  { id: "#1015", item: "Headset Wireless", date: "May 5, 2025", status: "Processing", statusColor: "#f59e0b", amount: "NPR 4,500" },
  { id: "#1014", item: "Mouse Pad Gaming", date: "Apr 28, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 380" },
  { id: "#1013", item: "External SSD 1TB", date: "Apr 20, 2025", status: "Cancelled", statusColor: "#ef4444", amount: "NPR 6,800" },
  { id: "#1012", item: "Router Dual Band", date: "Apr 14, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 3,200" },
  { id: "#1011", item: "Power Bank 20000mAh", date: "Apr 7, 2025", status: "Delivered", statusColor: "#22c55e", amount: "NPR 1,800" },
  { id: "#1010", item: "Microphone Studio", date: "Mar 31, 2025", status: "Shipped", statusColor: "#6366f1", amount: "NPR 5,500" },
];

const FILTERS = ["All", "Delivered", "Shipped", "Processing", "Cancelled"];
const PER_PAGE = 8;

export default function UserOrders() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: session } = useSession();
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Notification logic (same as Navbar)
  const notifications: string[] = session
    ? ([
        !session.user?.phone && "Add your phone number",
        !session.user?.address && "Add your address",
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

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

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

  // Prevent body scroll when mobile sidebar open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

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

  // Filtering + search
  const filtered = ALL_ORDERS.filter((o) => {
    const matchFilter = activeFilter === "All" || o.status === activeFilter;
    const matchSearch = search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.item.toLowerCase().includes(search.toLowerCase()) ||
      o.date.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // Reset page when filter/search changes
  useEffect(() => { setPage(1); }, [activeFilter, search]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; max-width: 100vw; }

        .ud-page {
          min-height: 100vh; min-height: 100dvh;
          background: #f1f5f9; display: flex;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── Sidebar ── */
        .ud-sidebar {
          width: 260px; background: #ffffff; border-right: 1px solid #e8ecf0;
          display: flex; flex-direction: column; flex-shrink: 0;
          transition: width 0.3s ease, transform 0.3s ease;
          position: fixed; height: 100vh; height: 100dvh; left: 0; top: 0; z-index: 100;
          box-shadow: 2px 0 8px rgba(0,0,0,0.04);
        }
        .ud-sidebar.collapsed { width: 72px; }
        .ud-sidebar-header {
          padding: 20px; display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid #f0f2f5; min-height: 72px; overflow: hidden;
        }
        .ud-sidebar-logo-wrap { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .ud-sidebar-logo-icon { width: 36px; height: 36px; flex-shrink: 0; }
        .ud-sidebar-logo-text {
          display: flex; flex-direction: column; line-height: 1.1;
          opacity: 1; transition: opacity 0.2s, width 0.2s; white-space: nowrap; overflow: hidden;
        }
        .ud-sidebar.collapsed .ud-sidebar-logo-text { opacity: 0; width: 0; }
        .ud-logo-line1 { font-size: 14px; font-weight: 800; color: ${PRIMARY}; letter-spacing: -0.3px; }
        .ud-logo-line2 { font-size: 11px; font-weight: 600; color: #888; letter-spacing: 0.5px; text-transform: uppercase; }
        .ud-nav-section { padding: 16px 12px; flex: 1; overflow-y: auto; }
        .ud-nav-label {
          font-size: 10px; font-weight: 700; color: #b0b8c4; text-transform: uppercase;
          letter-spacing: 1.2px; padding: 0 12px; margin-bottom: 8px; white-space: nowrap;
        }
        .ud-sidebar.collapsed .ud-nav-label { display: none; }
        .ud-nav-item {
          display: flex; align-items: center; gap: 12px; padding: 10px 14px;
          color: #5a6478; font-size: 14px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; border: none; background: none; width: 100%;
          text-align: left; font-family: inherit; text-decoration: none;
          border-radius: 10px; margin-bottom: 2px; position: relative; white-space: nowrap;
        }
        .ud-nav-item:hover { background: #f4f6fb; color: #1e293b; }
        .ud-nav-item.active { background: #fff5f5; color: ${PRIMARY}; font-weight: 600; }
        .ud-nav-item.active::before {
          content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 20px; background: ${PRIMARY}; border-radius: 0 3px 3px 0;
        }
        .ud-nav-icon { font-size: 18px; width: 22px; display: flex; justify-content: center; flex-shrink: 0; }
        .ud-nav-text { opacity: 1; transition: opacity 0.2s; }
        .ud-sidebar.collapsed .ud-nav-text { opacity: 0; width: 0; overflow: hidden; }
        .ud-nav-item.danger { color: rgba(239,68,68,0.7); }
        .ud-nav-item.danger:hover { background: rgba(239,68,68,0.06); color: #ef4444; }

        /* ── Main Area ── */
        .ud-main-area {
          flex: 1; margin-left: 260px; display: flex; flex-direction: column;
          min-height: 100vh; min-height: 100dvh; transition: margin-left 0.3s ease;
          width: calc(100% - 260px); min-width: 0;
        }
        .ud-sidebar.collapsed ~ .ud-main-area { margin-left: 72px; width: calc(100% - 72px); }

        /* ── Top Header ── */
        .ud-topbar {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 0 32px; height: 64px; display: flex; align-items: center;
          justify-content: space-between; position: sticky; top: 0; z-index: 50; gap: 16px;
        }
        .ud-topbar-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
        .ud-toggle-btn {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: all 0.2s; flex-shrink: 0;
        }
        .ud-toggle-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-breadcrumb { font-size: 20px; font-weight: 700; color: #1e293b; letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ud-topbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .ud-icon-btn {
          width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e2e8f0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: all 0.2s; position: relative; flex-shrink: 0;
        }
        .ud-icon-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-badge {
          position: absolute; top: -2px; right: -2px; width: 18px; height: 18px;
          background: #ef4444; color: #fff; font-size: 10px; font-weight: 700;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff;
        }

        /* ── Profile Dropdown ── */
        .ud-profile-wrap { position: relative; }
        .ud-profile-btn {
          display: flex; align-items: center; gap: 8px; padding: 5px 10px 5px 5px;
          border-radius: 40px; border: 1.5px solid #e2e8f0; background: #fff;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .ud-profile-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
        .ud-profile-btn-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, ${PRIMARY}, #e74c3c);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 12px; font-weight: 700; overflow: hidden; flex-shrink: 0;
        }
        .ud-profile-chevron { color: #94a3b8; transition: transform 0.2s; flex-shrink: 0; }
        .ud-profile-chevron.open { transform: rotate(180deg); }
        .ud-profile-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0; background: #fff;
          border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          min-width: 200px; z-index: 999; overflow: hidden; animation: dropdownIn 0.15s ease;
        }
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .ud-dropdown-header { padding: 14px 16px 12px; border-bottom: 1px solid #f1f5f9; }
        .ud-dropdown-username { font-size: 14px; font-weight: 700; color: #1e293b; }
        .ud-dropdown-email { font-size: 12px; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ud-dropdown-item {
          display: flex; align-items: center; gap: 10px; padding: 11px 16px;
          font-size: 14px; font-weight: 500; color: #475569; cursor: pointer;
          transition: all 0.15s; border: none; background: none; width: 100%;
          text-align: left; font-family: inherit; text-decoration: none;
        }
        .ud-dropdown-item:hover { background: #f8fafc; color: #1e293b; }
        .ud-dropdown-item.logout { color: #ef4444; }
        .ud-dropdown-item.logout:hover { background: #fef2f2; color: #dc2626; }
        .ud-dropdown-divider { height: 1px; background: #f1f5f9; }

        /* ── Main Content ── */
        .ud-main { flex: 1; padding: 28px 32px; overflow-y: auto; min-width: 0; }

        /* ── Orders Page Specific ── */
        .orders-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .orders-search-wrap {
          position: relative; flex: 1; min-width: 200px; max-width: 340px;
        }
        .orders-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; pointer-events: none;
        }
        .orders-search {
          width: 100%; padding: 9px 14px 9px 38px;
          border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px;
          font-family: inherit; color: #1e293b; outline: none;
          transition: all 0.2s; background: #fff;
        }
        .orders-search:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .orders-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .orders-filter-btn {
          padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; border: 1.5px solid #e2e8f0;
          background: #fff; color: #64748b; font-family: inherit;
        }
        .orders-filter-btn:hover { border-color: #cbd5e1; color: #1e293b; }
        .orders-filter-btn.active { background: ${PRIMARY}; color: #fff; border-color: ${PRIMARY}; }

        .orders-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
          overflow: hidden; margin-bottom: 24px; width: 100%;
        }
        .orders-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .orders-table { width: 100%; border-collapse: collapse; min-width: 560px; }
        .orders-table th {
          text-align: left; padding: 14px 20px; font-size: 12px; font-weight: 600;
          color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 1px solid #f1f5f9; background: #fafbfc; white-space: nowrap;
        }
        .orders-table td {
          padding: 14px 20px; font-size: 14px; color: #334155;
          border-bottom: 1px solid #f8fafc; white-space: nowrap;
        }
        .orders-table tr:last-child td { border-bottom: none; }
        .orders-table tr:hover td { background: #fafbfc; }
        .order-id { font-weight: 600; color: #1e293b; font-family: "SF Mono", "Fira Code", monospace; font-size: 13px; }
        .order-item { color: #475569; font-size: 13px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
        .ud-status {
          display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px;
          border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap;
        }
        .ud-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .order-amount { font-weight: 600; color: #1e293b; }

        /* Empty state */
        .orders-empty {
          padding: 60px 20px; text-align: center; color: #94a3b8;
        }
        .orders-empty svg { margin-bottom: 16px; opacity: 0.4; }
        .orders-empty h3 { font-size: 16px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
        .orders-empty p { font-size: 14px; }

        /* ── Pagination ── */
        .orders-pagination {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-top: 1px solid #f1f5f9; gap: 12px; flex-wrap: wrap;
        }
        .pagination-info { font-size: 13px; color: #64748b; }
        .pagination-btns { display: flex; gap: 6px; align-items: center; }
        .pag-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; font-size: 13px; font-weight: 600;
          transition: all 0.15s; font-family: inherit;
        }
        .pag-btn:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; color: #334155; }
        .pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pag-btn.active { background: ${PRIMARY}; color: #fff; border-color: ${PRIMARY}; }

        /* Mobile order cards */
        .orders-mobile { display: none; flex-direction: column; gap: 12px; padding: 16px; }
        .orders-mobile-card {
          background: #f8fafc; border-radius: 10px; padding: 14px;
          border: 1px solid #f1f5f9;
        }
        .orders-mobile-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .orders-mobile-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .orders-mobile-item { font-size: 13px; color: #475569; margin-bottom: 6px; }
        .orders-mobile-date { font-size: 12px; color: #94a3b8; }

        /* ── Backdrop ── */
        .ud-backdrop { display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(2px); z-index: 99; }
        .ud-backdrop.active { display: block; }
        .ud-sidebar-close {
          display: none; position: absolute; top: 18px; right: 16px;
          width: 32px; height: 32px; border: none; background: #f1f5f9;
          border-radius: 8px; cursor: pointer; align-items: center; justify-content: center;
          color: #64748b; transition: all 0.2s; z-index: 1;
        }
        .ud-sidebar-close:hover { background: #e2e8f0; color: #1e293b; }
        .ud-hamburger {
          display: none; width: 38px; height: 38px; border-radius: 8px;
          border: 1px solid #e2e8f0; background: #fff; align-items: center;
          justify-content: center; cursor: pointer; color: #64748b;
          transition: all 0.2s; flex-shrink: 0;
        }
        .ud-hamburger:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-desktop-toggle { display: flex; }

        /* ── Responsive ── */
        @media (max-width: 1023px) {
          .ud-sidebar { transform: translateX(-100%); width: 280px !important; z-index: 200; }
          .ud-sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.15); }
          .ud-sidebar.mobile-open .ud-sidebar-close { display: flex; }
          .ud-hamburger { display: flex; }
          .ud-desktop-toggle { display: none; }
          .ud-main-area { margin-left: 0 !important; width: 100% !important; }
          .ud-main { padding: 20px 20px 32px; }
          .ud-topbar { padding: 0 20px; }
        }
        @media (max-width: 767px) {
          .ud-main { padding: 16px; }
          .ud-topbar { padding: 0 16px; height: 56px; }
          .ud-breadcrumb { font-size: 18px; }
          .orders-toolbar { flex-direction: column; align-items: stretch; }
          .orders-search-wrap { max-width: 100%; }
          .orders-table-wrap { display: none; }
          .orders-mobile { display: flex; }
          .orders-pagination { flex-direction: column; align-items: center; }
        }
        @media (max-width: 480px) {
          .ud-main { padding: 12px; }
          .ud-topbar { padding: 0 12px; }
          .orders-filters { gap: 6px; }
          .orders-filter-btn { padding: 6px 12px; font-size: 12px; }
        }

        /* ── Delete Modal ── */
        .ud-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
          z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .ud-modal { background: #fff; border-radius: 16px; padding: 32px; width: 100%; max-width: 420px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); }
        .ud-modal-icon { width: 56px; height: 56px; border-radius: 14px; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; margin: 0 auto 20px; }
        .ud-modal-title { font-size: 18px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 8px; }
        .ud-modal-body { font-size: 14px; color: #64748b; text-align: center; line-height: 1.6; margin-bottom: 24px; }
        .ud-modal-body strong { color: #ef4444; }
        .ud-modal-error { font-size: 13px; color: #ef4444; background: #fef2f2; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; text-align: center; }
        .ud-modal-actions { display: flex; gap: 12px; }
        .ud-modal-cancel { flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .ud-modal-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
        .ud-modal-delete { flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #ef4444; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .ud-modal-delete:hover:not(:disabled) { background: #dc2626; }
        .ud-modal-delete:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      {/* Mobile Backdrop */}
      <div className={`ud-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="ud-page">
        {/* ── Sidebar ── */}
        <aside className={`ud-sidebar ${sidebarOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
          <button type="button" className="ud-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <FiX size={18} />
          </button>

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
              <Link key={item.id} href={item.href} className={`ud-nav-item ${item.id === "orders" ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                <span className="ud-nav-icon"><item.icon size={18} /></span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}
            <div className="ud-nav-label" style={{ marginTop: 16 }}>Account</div>
            {sidebarItems.slice(4).map((item) => (
              <Link key={item.id} href={item.href} className="ud-nav-item" onClick={() => setSidebarOpen(false)}>
                <span className="ud-nav-icon"><item.icon size={18} /></span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}
            <button type="button" className="ud-nav-item danger" onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }}>
              <span className="ud-nav-icon"><FiTrash2 size={18} /></span>
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
              <button type="button" className="ud-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <FiMenu size={20} />
              </button>
              <button type="button" className="ud-toggle-btn ud-desktop-toggle" onClick={() => setSidebarCollapsed((p) => !p)}>
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="ud-breadcrumb">My Orders</h1>
            </div>
            <div className="ud-topbar-right">
              {/* Notification Bell */}
              <div style={{ position: "relative" }} ref={notifDropdownRef}>
                <button type="button" className="ud-icon-btn" title="Notifications"
                  onClick={() => { setShowNotifDropdown((v) => !v); setNotifSeen(true); }}>
                  <FiBell size={18} />
                  {notificationCount > 0 && !notifSeen && <span className="ud-badge">{notificationCount}</span>}
                </button>
                {showNotifDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: "280px", zIndex: 999, overflow: "hidden", animation: "dropdownIn 0.15s ease" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "13px", color: "#1e293b" }}>Notifications</div>
                    {notifications.length > 0 ? notifications.map((msg, i) => (
                      <Link key={i} href="/user/settings" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", fontSize: "13px", color: "#475569", borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none", textDecoration: "none" }} onClick={() => setShowNotifDropdown(false)}>
                        <FiAlertCircle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                        {msg}
                      </Link>
                    )) : (
                      <div style={{ padding: "16px", fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>You&apos;re all caught up ✓</div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Avatar Dropdown */}
              <div className="ud-profile-wrap" ref={profileDropdownRef}>
                <button type="button" className="ud-profile-btn" onClick={() => setShowProfileDropdown((p) => !p)}>
                  <div className="ud-profile-btn-avatar">
                    {session?.user?.image ? <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitials}
                  </div>
                  <FiChevronDown size={14} className={`ud-profile-chevron ${showProfileDropdown ? "open" : ""}`} />
                </button>
                {showProfileDropdown && (
                  <div className="ud-profile-dropdown">
                    <div className="ud-dropdown-header">
                      <div className="ud-dropdown-username">{session?.user?.name || "User"}</div>
                      <div className="ud-dropdown-email">{session?.user?.email || ""}</div>
                    </div>
                    <Link href="/user/settings" className="ud-dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                      <FiUser size={15} /> Profile &amp; Settings
                    </Link>
                    <div className="ud-dropdown-divider" />
                    <button type="button" className="ud-dropdown-item logout" onClick={() => signOut({ callbackUrl: "/" })}>
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="ud-main">
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", letterSpacing: "-0.4px", marginBottom: "4px" }}>
                Order History
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                View and track all your past and current orders.
              </p>
            </div>

            {/* Toolbar: search + filters */}
            <div className="orders-toolbar">
              <div className="orders-search-wrap">
                <FiSearch size={15} className="orders-search-icon" />
                <input
                  type="text"
                  className="orders-search"
                  placeholder="Search by order ID, item, or date…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="orders-filters">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`orders-filter-btn ${activeFilter === f ? "active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table (desktop/tablet) */}
            <div className="orders-card">
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Item</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length > 0 ? paginated.map((order, idx) => (
                      <tr key={idx}>
                        <td><span className="order-id">{order.id}</span></td>
                        <td><span className="order-item">{order.item}</span></td>
                        <td>{order.date}</td>
                        <td>
                          <span className="ud-status" style={{ background: order.statusColor + "12", color: order.statusColor }}>
                            <span className="ud-status-dot" style={{ background: order.statusColor }} />
                            {order.status}
                          </span>
                        </td>
                        <td className="order-amount">{order.amount}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="orders-empty">
                            <FiShoppingBag size={40} />
                            <h3>No orders found</h3>
                            <p>Try adjusting your search or filter.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="orders-mobile">
                {paginated.length > 0 ? paginated.map((order, idx) => (
                  <div key={idx} className="orders-mobile-card">
                    <div className="orders-mobile-row">
                      <span className="order-id">{order.id}</span>
                      <span className="ud-status" style={{ background: order.statusColor + "12", color: order.statusColor }}>
                        <span className="ud-status-dot" style={{ background: order.statusColor }} />
                        {order.status}
                      </span>
                    </div>
                    <div className="orders-mobile-item">{order.item}</div>
                    <div className="orders-mobile-footer">
                      <span className="orders-mobile-date">{order.date}</span>
                      <span className="order-amount">{order.amount}</span>
                    </div>
                  </div>
                )) : (
                  <div className="orders-empty">
                    <FiShoppingBag size={40} />
                    <h3>No orders found</h3>
                    <p>Try adjusting your search or filter.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filtered.length > PER_PAGE && (
                <div className="orders-pagination">
                  <div className="pagination-info">
                    Showing {Math.min((safePage - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} orders
                  </div>
                  <div className="pagination-btns">
                    <button type="button" className="pag-btn" disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}>
                      <FiChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - safePage) <= 2)
                      .map((p) => (
                        <button key={p} type="button" className={`pag-btn ${p === safePage ? "active" : ""}`} onClick={() => setPage(p)}>
                          {p}
                        </button>
                      ))}
                    <button type="button" className="pag-btn" disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)}>
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="ud-modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal-icon"><FiAlertTriangle size={26} /></div>
            <div className="ud-modal-title">Delete Your Account?</div>
            <div className="ud-modal-body">
              This action is <strong>permanent and irreversible</strong>. All your orders, wishlist, and personal data will be permanently deleted.
            </div>
            {deleteError && <div className="ud-modal-error">{deleteError}</div>}
            <div className="ud-modal-actions">
              <button type="button" className="ud-modal-cancel" onClick={() => { setShowDeleteModal(false); setDeleteError(""); }} disabled={deleting}>Cancel</button>
              <button type="button" className="ud-modal-delete" onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? "Deleting..." : <><FiTrash2 size={15} /> Yes, Delete Account</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
