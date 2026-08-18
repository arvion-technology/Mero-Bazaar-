"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import type { OrderDetail as ApiOrderDetail } from "@/app/types/orders";
import {
  FiGrid, FiShoppingBag, FiHeart, FiBell, FiHelpCircle, FiSettings,
  FiTrash2, FiAlertTriangle, FiLogOut, FiUser, FiChevronDown,
  FiMenu, FiX, FiMoreHorizontal, FiAlertCircle,
  FiPhone, FiArrowLeft, FiCheckCircle,
} from "react-icons/fi";

const PRIMARY = "#C0392B";

const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  DELIVERED: { label: "Delivered", color: "#22c55e" },
  CONFIRMED: { label: "Confirmed", color: "#22c55e" },
  PREPARING: { label: "Processing", color: "#f59e0b" },
  OUT_FOR_DELIVERY: { label: "Shipped", color: "#6366f1" },
  PENDING: { label: "Pending", color: "#f59e0b" },
  CANCELLED: { label: "Cancelled", color: "#ef4444" },
  EXPIRED: { label: "Expired", color: "#ef4444" },
};

const sidebarItems = [
  { id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/user/dashboard" },
  { id: "orders", icon: FiShoppingBag, label: "My Orders", href: "/user/orders" },
  { id: "wishlist", icon: FiHeart, label: "Wishlist", href: "/user/wishlist" },
  { id: "notification", icon: FiBell, label: "Notifications", href: "/user/notifications" },
  { id: "help", icon: FiHelpCircle, label: "Help & Support", href: "/user/help" },
  { id: "settings", icon: FiSettings, label: "Settings", href: "/user/settings" },
];

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function getImageUrl(image?: string | null) {
  if (!image) return "";
  return image.startsWith("http") ? image : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken;

  const [order, setOrder] = useState<ApiOrderDetail | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken || !orderId) return;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOrder(data);
      } catch {
        setOrderError("Couldn't load this order.");
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [accessToken, orderId]);

  const notifications: string[] = session
    ? ([
        !session.user?.phone && "Add your phone number",
        !session.user?.address && "Add your address",
      ].filter(Boolean) as string[])
    : [];
  const notificationCount = notifications.length;

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

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

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
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

  const disp = order ? (STATUS_DISPLAY[order.status] ?? { label: order.status, color: "#64748b" }) : null;
  const vendor = order?.listing?.user;
  const kycVerified = vendor?.vendorKyc?.status === "VERIFIED";
  const vendorInitials = vendor?.name
    ? vendor.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loadingOrder) {
    return (
      <div className="ud-page" style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
        <div className="orders-empty"><p>Loading order…</p></div>
        <style>{`.ud-page { display: flex; }`}</style>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="ud-page" style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
        <div className="orders-empty"><p style={{ color: "#ef4444" }}>{orderError || "Order not found."}</p></div>
        <style>{`.ud-page { display: flex; }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; max-width: 100vw; }
        .ud-page { min-height: 100vh; min-height: 100dvh; background: #f1f5f9; display: flex; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .ud-sidebar { width: 260px; background: #ffffff; border-right: 1px solid #e8ecf0; display: flex; flex-direction: column; flex-shrink: 0; transition: width 0.3s ease, transform 0.3s ease; position: fixed; height: 100vh; height: 100dvh; left: 0; top: 0; z-index: 100; box-shadow: 2px 0 8px rgba(0,0,0,0.04); }
        .ud-sidebar.collapsed { width: 72px; }
        .ud-sidebar-header { padding: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f0f2f5; min-height: 72px; overflow: hidden; }
        .ud-sidebar-logo-wrap { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .ud-sidebar-logo-icon { width: 36px; height: 36px; flex-shrink: 0; }
        .ud-sidebar-logo-text { display: flex; flex-direction: column; line-height: 1.1; opacity: 1; transition: opacity 0.2s, width 0.2s; white-space: nowrap; overflow: hidden; }
        .ud-sidebar.collapsed .ud-sidebar-logo-text { opacity: 0; width: 0; }
        .ud-logo-line1 { font-size: 14px; font-weight: 800; color: #C0392B; letter-spacing: -0.3px; }
        .ud-logo-line2 { font-size: 11px; font-weight: 600; color: #888; letter-spacing: 0.5px; text-transform: uppercase; }
        .ud-nav-section { padding: 16px 12px; flex: 1; overflow-y: auto; }
        .ud-nav-label { font-size: 10px; font-weight: 700; color: #b0b8c4; text-transform: uppercase; letter-spacing: 1.2px; padding: 0 12px; margin-bottom: 8px; white-space: nowrap; }
        .ud-sidebar.collapsed .ud-nav-label { display: none; }
        .ud-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; color: #5a6478; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; background: none; width: 100%; text-align: left; font-family: inherit; text-decoration: none; border-radius: 10px; margin-bottom: 2px; position: relative; white-space: nowrap; }
        .ud-nav-item:hover { background: #f4f6fb; color: #1e293b; }
        .ud-nav-item.active { background: #fff5f5; color: #C0392B; font-weight: 600; }
        .ud-nav-item.active::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; background: #C0392B; border-radius: 0 3px 3px 0; }
        .ud-nav-icon { font-size: 18px; width: 22px; display: flex; justify-content: center; flex-shrink: 0; }
        .ud-nav-text { opacity: 1; transition: opacity 0.2s; }
        .ud-sidebar.collapsed .ud-nav-text { opacity: 0; width: 0; overflow: hidden; }
        .ud-nav-item.danger { color: rgba(239,68,68,0.7); }
        .ud-nav-item.danger:hover { background: rgba(239,68,68,0.06); color: #ef4444; }
        .ud-main-area { flex: 1; margin-left: 260px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; transition: margin-left 0.3s ease; width: calc(100% - 260px); min-width: 0; }
        .ud-sidebar.collapsed ~ .ud-main-area { margin-left: 72px; width: calc(100% - 72px); }
        .ud-topbar { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; gap: 16px; }
        .ud-topbar-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
        .ud-toggle-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; flex-shrink: 0; }
        .ud-toggle-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-breadcrumb { font-size: 20px; font-weight: 700; color: #1e293b; letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ud-topbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .ud-icon-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; position: relative; flex-shrink: 0; }
        .ud-icon-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-badge { position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }
        .ud-profile-wrap { position: relative; }
        .ud-profile-btn { display: flex; align-items: center; gap: 8px; padding: 5px 10px 5px 5px; border-radius: 40px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .ud-profile-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
        .ud-profile-btn-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #C0392B, #e74c3c); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; overflow: hidden; flex-shrink: 0; }
        .ud-profile-chevron { color: #94a3b8; transition: transform 0.2s; flex-shrink: 0; }
        .ud-profile-chevron.open { transform: rotate(180deg); }
        .ud-profile-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); min-width: 200px; z-index: 999; overflow: hidden; animation: dropdownIn 0.15s ease; }
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .ud-dropdown-header { padding: 14px 16px 12px; border-bottom: 1px solid #f1f5f9; }
        .ud-dropdown-username { font-size: 14px; font-weight: 700; color: #1e293b; }
        .ud-dropdown-email { font-size: 12px; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ud-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 11px 16px; font-size: 14px; font-weight: 500; color: #475569; cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%; text-align: left; font-family: inherit; text-decoration: none; }
        .ud-dropdown-item:hover { background: #f8fafc; color: #1e293b; }
        .ud-dropdown-item.logout { color: #ef4444; }
        .ud-dropdown-item.logout:hover { background: #fef2f2; color: #dc2626; }
        .ud-dropdown-divider { height: 1px; background: #f1f5f9; }
        .ud-main { flex: 1; padding: 28px 32px; overflow-y: auto; min-width: 0; }
        .od-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .od-back-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; flex-shrink: 0; text-decoration: none; }
        .od-back-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .od-title { font-size: 22px; font-weight: 700; color: #1e293b; letter-spacing: -0.4px; }
        .od-subtitle { font-size: 13px; color: #64748b; margin-top: 2px; }

        /* ── Same-line card grid ── */
        .od-grid { display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch; }
        .od-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;
          flex: 1 1 280px; min-width: 260px; display: flex; flex-direction: column;
        }
        .od-seller-card { padding: 20px; }
        .od-seller-title { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 14px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
        .od-seller-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .od-seller-avatar-placeholder { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #C0392B 0%, #8e1c10 100%); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 2px 10px rgba(0,0,0,.14); }
        .od-seller-name { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .od-seller-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
        .od-seller-cta { display: flex; }
        .od-seller-call-btn { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg,#27ae60 0%,#1e8449 100%); color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; font-family: inherit; box-shadow: 0 4px 14px rgba(39,174,96,.32); transition: opacity .2s, transform .15s; }
        .od-seller-call-btn:hover { opacity: .9; transform: translateY(-1px); }

        .od-product-img { width: 100%; height: 200px; object-fit: cover; display: block; background: #e2e8f0; }
        .od-product-body { padding: 20px; }
        .od-product-name { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .od-product-cat { font-size: 12px; color: #94a3b8; }
        .od-delivery-card { padding: 20px; }
        .od-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 8px; flex-wrap: wrap; }
        .od-card-title { font-size: 15px; font-weight: 700; color: #1e293b; }
        .od-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .od-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .od-info-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; font-size: 13px; color: #64748b; gap: 12px; }
        .od-info-row:not(:last-child) { border-bottom: 1px solid #f8fafc; }
        .od-info-label { color: #94a3b8; flex-shrink: 0; }
        .od-info-value { font-weight: 600; color: #1e293b; text-align: right; }
        .od-summary-card { padding: 20px; }
        .od-summary-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
        .od-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 13px; color: #64748b; }
        .od-summary-row:not(:last-child) { border-bottom: 1px solid #f8fafc; }
        .od-summary-row.total { border-top: 2px solid #f1f5f9; border-bottom: none; padding-top: 14px; margin-top: 4px; }
        .od-summary-row.total .od-summary-val { font-size: 16px; font-weight: 700; color: #C0392B; }
        .od-summary-val { font-weight: 600; color: #1e293b; }
        .od-vendor-card { padding: 20px; }
        .od-vendor-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .od-vendor-logo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: linear-gradient(135deg, #C0392B, #e74c3c); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; font-weight: 700; }
        .od-vendor-name { font-size: 14px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 6px; }
        .od-vendor-contact { display: flex; flex-direction: column; gap: 6px; }
        .od-vendor-contact-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; }
        .od-help-card { padding: 20px; }
        .od-help-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .od-help-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 14px; flex: 1; }
        .od-contact-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; border: 1.5px solid #6366f1; background: #fff; color: #6366f1; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; width: 100%; justify-content: center; }
        .od-contact-btn:hover { background: #6366f1; color: #fff; }
        .orders-empty { padding: 60px 20px; text-align: center; color: #94a3b8; }
        .ud-backdrop { display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(2px); z-index: 99; }
        .ud-backdrop.active { display: block; }
        .ud-sidebar-close { display: none; position: absolute; top: 18px; right: 16px; width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 8px; cursor: pointer; align-items: center; justify-content: center; color: #64748b; transition: all 0.2s; z-index: 1; }
        .ud-sidebar-close:hover { background: #e2e8f0; color: #1e293b; }
        .ud-hamburger { display: none; width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; flex-shrink: 0; }
        .ud-hamburger:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-desktop-toggle { display: flex; }
        @media (max-width: 1023px) {
          .ud-sidebar { transform: translateX(-100%); width: 280px !important; z-index: 200; }
          .ud-sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.15); }
          .ud-sidebar.mobile-open .ud-sidebar-close { display: flex; }
          .ud-hamburger { display: flex; }
          .ud-desktop-toggle { display: none; }
          .ud-main-area { margin-left: 0 !important; width: 100% !important; }
          .ud-main { padding: 20px 20px 32px; }
          .ud-topbar { padding: 0 20px; }
          .od-card { flex: 1 1 45%; min-width: 240px; }
        }
        @media (max-width: 767px) {
          .ud-main { padding: 16px; }
          .ud-topbar { padding: 0 16px; height: 56px; }
          .ud-breadcrumb { font-size: 18px; }
          .od-product-img { height: 180px; }
          .od-card { flex: 1 1 100%; min-width: 0; }
        }
        @media (max-width: 480px) { .ud-main { padding: 12px; } .ud-topbar { padding: 0 12px; } }
        .ud-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
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

      <div className={`ud-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="ud-page">
        <aside className={`ud-sidebar ${sidebarOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
          <button type="button" className="ud-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><FiX size={18} /></button>
          <div className="ud-sidebar-header">
            <Link href="/" className="ud-sidebar-logo-wrap">
              <svg className="ud-sidebar-logo-icon" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
                <path d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10 M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28 M10 10 Q10 19 10 28 M28 10 Q28 19 28 28 M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="19" cy="19" r="3" fill="#fff" opacity="0.9" />
              </svg>
              <div className="ud-sidebar-logo-text"><span className="ud-logo-line1">HamroNepal</span><span className="ud-logo-line2">Bazaar</span></div>
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
        </aside>

        <div className="ud-main-area">
          <header className="ud-topbar">
            <div className="ud-topbar-left">
              <button type="button" className="ud-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><FiMenu size={20} /></button>
              <button type="button" className="ud-toggle-btn ud-desktop-toggle" onClick={() => setSidebarCollapsed((p) => !p)}><FiMoreHorizontal size={18} /></button>
              <h1 className="ud-breadcrumb">Orders</h1>
            </div>
            <div className="ud-topbar-right">
              <div style={{ position: "relative" }} ref={notifDropdownRef}>
                <button type="button" className="ud-icon-btn" title="Notifications" onClick={() => { setShowNotifDropdown((v) => !v); setNotifSeen(true); }}>
                  <FiBell size={18} />
                  {notificationCount > 0 && !notifSeen && <span className="ud-badge">{notificationCount}</span>}
                </button>
                {showNotifDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: "280px", zIndex: 999, overflow: "hidden", animation: "dropdownIn 0.15s ease" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "13px", color: "#1e293b" }}>Notifications</div>
                    {notifications.length > 0 ? notifications.map((msg, i) => (
                      <Link key={i} href="/user/settings" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", fontSize: "13px", color: "#475569", borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none", textDecoration: "none" }} onClick={() => setShowNotifDropdown(false)}>
                        <FiAlertCircle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />{msg}
                      </Link>
                    )) : (
                      <div style={{ padding: "16px", fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>You are all caught up</div>
                    )}
                  </div>
                )}
              </div>
              <div className="ud-profile-wrap" ref={profileDropdownRef}>
                <button type="button" className="ud-profile-btn" onClick={() => setShowProfileDropdown((p) => !p)}>
                  <div className="ud-profile-btn-avatar">{session?.user?.image ? <img src={getImageUrl(session.user.image)} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitials}</div>
                  <FiChevronDown size={14} className={`ud-profile-chevron ${showProfileDropdown ? "open" : ""}`} />
                </button>
                {showProfileDropdown && (
                  <div className="ud-profile-dropdown">
                    <div className="ud-dropdown-header">
                      <div className="ud-dropdown-username">{session?.user?.name || "User"}</div>
                      <div className="ud-dropdown-email">{session?.user?.email || ""}</div>
                    </div>
                    <Link href="/user/settings" className="ud-dropdown-item" onClick={() => setShowProfileDropdown(false)}><FiUser size={15} /> Profile &amp; Settings</Link>
                    <div className="ud-dropdown-divider" />
                    <button type="button" className="ud-dropdown-item logout" onClick={() => signOut({ callbackUrl: "/" })}><FiLogOut size={15} /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="ud-main">
            <div className="od-header">
              <Link href="/user/orders" className="od-back-btn" aria-label="Back to orders"><FiArrowLeft size={18} /></Link>
              <div>
                <div className="od-title">Orders</div>
                <div className="od-subtitle">Order ID: #{order.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>

            <div className="od-grid">
              <div className="od-card">
                <img
                  src={order.listing.images?.[0] ? getImageUrl(order.listing.images[0]) : "https://ui-avatars.com/api/?name=" + encodeURIComponent(order.listing.title) + "&background=e2e8f0&color=64748b&size=400"}
                  alt={order.listing.title}
                  className="od-product-img"
                />
                <div className="od-product-body">
                  <div className="od-product-name">{order.listing.title}</div>
                  <div className="od-product-cat">Category: {order.listing.category}</div>
                </div>
              </div>

              <div className="od-card od-delivery-card">
                <div className="od-card-header">
                  <div className="od-card-title">{order.type === "RESERVATION" ? "Reservation info" : "Delivery info"}</div>
                  {disp && (
                    <span className="od-status-pill" style={{ background: disp.color + "18", color: disp.color }}>
                      <span className="od-status-dot" style={{ background: disp.color }} />{disp.label}
                    </span>
                  )}
                </div>
                {order.type === "RESERVATION" ? (
                  <div className="od-info-row"><span className="od-info-label">Reserved Until</span><span className="od-info-value">{formatDate(order.reservedUntil)}</span></div>
                ) : (
                  <>
                    <div className="od-info-row"><span className="od-info-label">Delivery Date</span><span className="od-info-value">{formatDate(order.deliveryDate)}</span></div>
                    <div className="od-info-row"><span className="od-info-label">Delivery Address</span><span className="od-info-value">{order.deliveryAddress || "—"}</span></div>
                  </>
                )}
              </div>

              <div className="od-card od-summary-card">
                <div className="od-summary-title">Order Summary</div>
                <div className="od-summary-row"><span>Price per unit</span><span className="od-summary-val">NPR {order.priceAtOrder.toLocaleString()}</span></div>
                <div className="od-summary-row"><span>Quantity</span><span className="od-summary-val">{order.quantity}</span></div>
                <div className="od-summary-row total"><span>Total Amount</span><span className="od-summary-val">NPR {order.totalPrice.toLocaleString()}</span></div>
                <div className="od-summary-row" style={{ marginTop: 8, borderBottom: "none" }}>
                  <span>Status</span>
                  {disp && (
                    <span className="od-status-pill" style={{ background: disp.color + "18", color: disp.color }}>
                      <span className="od-status-dot" style={{ background: disp.color }} />{disp.label}
                    </span>
                  )}
                </div>
                <div className="od-summary-row" style={{ borderBottom: "none" }}><span>Payment Method</span><span className="od-summary-val">{order.paymentMethod || "—"}</span></div>
                {order.paymentRef && (
                  <div className="od-summary-row" style={{ borderBottom: "none" }}><span>Payment Ref</span><span className="od-summary-val">{order.paymentRef}</span></div>
                )}
              </div>

              <div className="od-card od-seller-card">
                <p className="od-seller-title">Seller Information</p>

                <div className="od-seller-top">
                  <div className="od-seller-avatar-placeholder">
                    {vendorInitials}
                  </div>
                  <div>
                    <div className="od-seller-name">
                      {vendor?.name || "Unknown seller"}
                    </div>
                    {kycVerified && (
                      <span className="od-seller-badge">
                        <MdVerified size={11} /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="od-seller-cta">
                  <button
                    type="button"
                    className="od-seller-call-btn"
                    onClick={() => {
                      if (!vendor?.phone) {
                        toast.error("Phone number not available");
                        return;
                      }
                      window.location.href = `tel:${vendor.phone}`;
                    }}
                  >
                    <FiPhone size={16} />
                    Call Seller
                  </button>
                </div>
              </div>

              <div className="od-card od-help-card">
                <div className="od-help-title">Need Help?</div>
                <div className="od-help-desc">If you have issues with your order, please contact support.</div>
                <Link href="/user/help" className="od-contact-btn"><FiHelpCircle size={15} /> Contact Support</Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showDeleteModal && (
        <div className="ud-modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal-icon"><FiAlertTriangle size={26} /></div>
            <div className="ud-modal-title">Delete Your Account?</div>
            <div className="ud-modal-body">This action is <strong>permanent and irreversible</strong>. All your orders, wishlist, and personal data will be permanently deleted.</div>
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