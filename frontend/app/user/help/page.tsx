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
  FiChevronDown,
  FiChevronUp,
  FiMoreHorizontal,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
  FiAlertCircle,
  FiSearch,
  FiPackage,
  FiCreditCard,
  FiShield,
  FiTag,
  FiMessageCircle,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiClock,
} from "react-icons/fi";

const PRIMARY = "#C0392B";

const helpCategories = [
  {
    icon: FiPackage,
    title: "Orders & Delivery",
    desc: "Track orders, shipping, delivery status and more.",
    color: "#4f46e5",
    bg: "#eef2ff",
  },
  {
    icon: FiCreditCard,
    title: "Payments & Refunds",
    desc: "Payment methods, refunds, cancellations and more.",
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    icon: FiShield,
    title: "Account & Security",
    desc: "Manage your account, passwords, 2FA and security settings.",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    icon: FiTag,
    title: "Products & Services",
    desc: "Product information, returns, warranty and more.",
    color: "#ef4444",
    bg: "#fef2f2",
  },
  {
    icon: FiTag,
    title: "Offers & Promotions",
    desc: "Coupons, Discounts, Cashback and promotional offers.",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: FiMessageCircle,
    title: "General questions",
    desc: "General enquiries and other frequently asked questions.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
];

const faqs = [
  { q: "How can I track my order?", a: "You can track your order by visiting the My Orders section in your dashboard. Click on any order to see real-time tracking updates." },
  { q: "How do I return a product", a: "To return a product, go to My Orders, select the order, and click Return Item. Follow the instructions to schedule a pickup." },
  { q: "How can I request a refund", a: "Refunds can be requested through the My Orders page. Once your return is approved, the refund will be processed to your original payment method within 5-7 business days." },
  { q: "What is the estimated delivery time", a: "Standard delivery takes 3-5 business days. Express delivery options are available at checkout for 1-2 day delivery." },
  { q: "Which payment methods are supported?", a: "We support credit/debit cards (Visa, Mastercard), eSewa, Khalti, Fonepay, and Cash on Delivery (COD) for eligible locations." },
];

const contactMethods = [
  { icon: FiMessageSquare, label: "Live Chat", desc: "Chat with supports team", status: "Online", statusColor: "#10b981", href: "#" },
  { icon: FiMail, label: "Email Supports", desc: "support@hamronepal.com", href: "mailto:support@hamronepal.com" },
  { icon: FiPhone, label: "Call Us", desc: "+977 9845672312", href: "tel:+9779845672312" },
  { icon: FiMessageSquare, label: "WhatsApp", desc: "+977 9845672312", href: "https://wa.me/9779845672312" },
];

const supportHours = [
  { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
  { day: "Saturday", time: "10:00 AM - 6:00 PM" },
  { day: "Sunday", time: "10:00 AM - 4:00 PM" },
];

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState("help");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: session } = useSession();
  const token = session?.accessToken;
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const [securityNotifs, setSecurityNotifs] = useState<{ id: string; type: string; createdAt: string; read: boolean }[]>([]);

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

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        /* Sidebar */
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

        /* Main Area */
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

        /* Top Header */
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

        /* Profile Dropdown */
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

        /* Main Content */
        .ud-main {
          flex: 1;
          padding: 28px 32px;
          overflow-y: auto;
          min-width: 0;
        }

        /* Search */
        .hs-search-wrap {
          margin-bottom: 28px;
        }

        .hs-search-box {
          position: relative;
          max-width: 100%;
        }

        .hs-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .hs-search-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          font-size: 14px;
          color: #1e293b;
          font-family: inherit;
          transition: all 0.2s;
          outline: none;
        }

        .hs-search-input::placeholder {
          color: #94a3b8;
        }

        .hs-search-input:focus {
          border-color: ${PRIMARY};
          box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.08);
        }

        /* Section Title */
        .hs-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hs-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.2px;
        }

        .hs-section-link {
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

        .hs-section-link:hover {
          color: #4f46e5;
          gap: 6px;
        }

        /* Categories */
        .hs-categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .hs-category-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .hs-category-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transform: translateY(-2px);
          border-color: #cbd5e1;
        }

        .hs-category-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .hs-category-content {
          flex: 1;
          min-width: 0;
        }

        .hs-category-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .hs-category-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        .hs-category-arrow {
          color: #94a3b8;
          flex-shrink: 0;
          margin-top: 4px;
        }

        /* FAQ */
        .hs-faq-section {
          margin-bottom: 28px;
        }

        .hs-faq-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .hs-faq-item {
          border-bottom: 1px solid #f1f5f9;
        }

        .hs-faq-item:last-child {
          border-bottom: none;
        }

        .hs-faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
        }

        .hs-faq-question:hover {
          background: #fafbfc;
        }

        .hs-faq-question-text {
          flex: 1;
          min-width: 0;
        }

        .hs-faq-chevron {
          color: #94a3b8;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .hs-faq-chevron.open {
          transform: rotate(180deg);
        }

        .hs-faq-answer {
          padding: 0 20px 16px;
          font-size: 13px;
          color: #64748b;
          line-height: 1.7;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Contact */
        .hs-contact-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }

        .hs-contact-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .hs-contact-sub {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .hs-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          text-decoration: none;
          transition: background 0.15s;
          cursor: pointer;
        }

        .hs-contact-item:last-child {
          border-bottom: none;
        }

        .hs-contact-item:hover {
          background: #fafbfc;
          margin: 0 -20px;
          padding-left: 20px;
          padding-right: 20px;
        }

        .hs-contact-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          flex-shrink: 0;
        }

        .hs-contact-info {
          flex: 1;
          min-width: 0;
        }

        .hs-contact-label {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .hs-contact-desc {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }

        .hs-contact-status {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .hs-contact-arrow {
          color: #94a3b8;
          flex-shrink: 0;
        }

        /* Support Hours */
        .hs-hours-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-top: 16px;
        }

        .hs-hours-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hs-hours-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 12px;
        }

        .hs-hours-day {
          color: #64748b;
        }

        .hs-hours-time {
          color: #334155;
          font-weight: 500;
        }

        .hs-hours-note {
          margin-top: 12px;
          padding: 10px 12px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Layout */
        .hs-content-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        /* Backdrop */
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

        .ud-desktop-toggle {
          display: flex;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .hs-content-grid {
            grid-template-columns: 1fr 280px;
          }
          .hs-categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

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
          .hs-content-grid {
            grid-template-columns: 1fr;
          }
        }

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
          .hs-categories-grid {
            grid-template-columns: 1fr;
          }
          .hs-category-card {
            padding: 16px;
          }
          .hs-faq-question {
            padding: 14px 16px;
            font-size: 13px;
          }
          .hs-faq-answer {
            padding: 0 16px 14px;
          }
          .hs-contact-card,
          .hs-hours-card {
            padding: 16px;
          }
          .ud-profile-btn-name {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .ud-main {
            padding: 12px;
          }
          .ud-topbar {
            padding: 0 12px;
          }
        }

        /* Delete Modal */
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
        .ud-modal {
          background: #fff;
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          animation: slideUp 0.25s ease;
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

        .ud-nav-item.danger {
          color: rgba(239,68,68,0.7);
        }
        .ud-nav-item.danger:hover {
          background: rgba(239,68,68,0.06);
          color: #ef4444;
        }
      `}</style>

      <div className={`ud-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="ud-page">
        <aside className={`ud-sidebar ${sidebarOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
          <button type="button" className="ud-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <FiX size={18} />
          </button>

          <div className="ud-sidebar-header">
            <Link href="/" className="ud-sidebar-logo-wrap">
              <svg className="ud-sidebar-logo-icon" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
                <path d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10 M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28 M10 10 Q10 19 10 28 M28 10 Q28 19 28 28 M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
              <Link key={item.id} href={item.href} className={`ud-nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
                <span className="ud-nav-icon"><item.icon size={18} /></span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}

            <div className="ud-nav-label" style={{ marginTop: 16 }}>Account</div>
            {sidebarItems.slice(4).map((item) => (
              <Link key={item.id} href={item.href} className={`ud-nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
                <span className="ud-nav-icon"><item.icon size={18} /></span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}

            <button type="button" className="ud-nav-item danger" onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }} title="Delete Account">
              <span className="ud-nav-icon"><FiTrash2 size={18} /></span>
              <span className="ud-nav-text">Delete Account</span>
            </button>
          </div>
        </aside>

        <div className="ud-main-area">
          <header className="ud-topbar">
            <div className="ud-topbar-left">
              <button type="button" className="ud-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <FiMenu size={20} />
              </button>
              <button type="button" className="ud-toggle-btn ud-desktop-toggle" onClick={() => setSidebarCollapsed((prev) => !prev)} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="ud-breadcrumb">Help & Support</h1>
            </div>
            <div className="ud-topbar-right">
              <div style={{ position: "relative" }} ref={notifDropdownRef}>
                <button type="button" className="ud-icon-btn" title="Notifications" onClick={() => {
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
                }}>
                  <FiBell size={18} />
                  {notificationCount > 0 && !notifSeen && <span className="ud-badge">{notificationCount}</span>}
                </button>

                {showNotifDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: "280px", zIndex: 999, overflow: "hidden", animation: "dropdownIn 0.15s ease" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "13px", color: "#1e293b" }}>Notifications</div>
                    {notifications.length > 0 ? (
                      notifications.map((msg, i) => (
                        <Link key={i} href="/user/settings" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", fontSize: "13px", color: "#475569", borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none", textDecoration: "none", transition: "background 0.15s" }} onClick={() => setShowNotifDropdown(false)}>
                          <FiAlertCircle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />{msg}
                        </Link>
                      ))
                    ) : (
                      <div style={{ padding: "16px", fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>You&apos;re all caught up</div>
                    )}
                  </div>
                )}
              </div>

              <div className="ud-profile-wrap" ref={profileDropdownRef}>
                <button type="button" className="ud-profile-btn" onClick={() => setShowProfileDropdown((prev) => !prev)}>
                  <div className="ud-profile-btn-avatar">
                    {session?.user?.image ? <img src={getImageUrl(session.user.image)} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitials}
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
                      <FiUser size={15} />Profile & Settings
                    </Link>
                    <div className="ud-dropdown-divider" />
                    <button type="button" className="ud-dropdown-item logout" onClick={() => signOut({ callbackUrl: "/" })}>
                      <FiLogOut size={15} />Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="ud-main">
            <div className="hs-search-wrap">
              <div className="hs-search-box">
                <FiSearch size={18} className="hs-search-icon" />
                <input type="text" className="hs-search-input" placeholder="Search for help articles, topics or keywords...." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>

            <div className="hs-content-grid">
              <div>
                <h2 className="hs-section-title" style={{ marginBottom: 16 }}>How can we help you?</h2>
                <div className="hs-categories-grid">
                  {helpCategories.map((cat) => (
                    <div key={cat.title} className="hs-category-card">
                      <div className="hs-category-icon" style={{ background: cat.bg, color: cat.color }}>
                        <cat.icon size={20} />
                      </div>
                      <div className="hs-category-content">
                        <div className="hs-category-title">{cat.title}</div>
                        <div className="hs-category-desc">{cat.desc}</div>
                      </div>
                      <FiChevronRight size={16} className="hs-category-arrow" />
                    </div>
                  ))}
                </div>

                <div className="hs-faq-section">
                  <div className="hs-section-header">
                    <h3 className="hs-section-title">Frequently Asked Questions</h3>
                    <Link href="/user/faqs" className="hs-section-link">
                      View all FAQs <FiChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="hs-faq-card">
                    {filteredFaqs.map((faq, idx) => (
                      <div key={idx} className="hs-faq-item">
                        <button type="button" className="hs-faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                          <span className="hs-faq-question-text">{faq.q}</span>
                          {openFaq === idx ? (
                            <FiChevronUp size={16} className="hs-faq-chevron open" />
                          ) : (
                            <FiChevronDown size={16} className="hs-faq-chevron" />
                          )}
                        </button>
                        {openFaq === idx && (
                          <div className="hs-faq-answer">{faq.a}</div>
                        )}
                      </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                      <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                        No results found for &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="hs-contact-card">
                  <div className="hs-contact-title">Contact Us</div>
                  <div className="hs-contact-sub">Can&apos;t Find you&apos;re looking for? We&apos;re here to help!</div>

                  {contactMethods.map((method) => (
                    <Link key={method.label} href={method.href} className="hs-contact-item">
                      <div className="hs-contact-icon-wrap">
                        <method.icon size={16} />
                      </div>
                      <div className="hs-contact-info">
                        <div className="hs-contact-label">{method.label}</div>
                        <div className="hs-contact-desc">{method.desc}</div>
                      </div>
                      {method.status && (
                        <span className="hs-contact-status" style={{ background: method.statusColor + "15", color: method.statusColor }}>
                          {method.status}
                        </span>
                      )}
                      <FiChevronRight size={14} className="hs-contact-arrow" />
                    </Link>
                  ))}
                </div>

                <div className="hs-hours-card">
                  <div className="hs-hours-title">
                    <FiClock size={16} color="#6366f1" />
                    Support Hours
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                    We are unavailable to assist you during the following hours:
                  </div>
                  {supportHours.map((h) => (
                    <div key={h.day} className="hs-hours-row">
                      <span className="hs-hours-day">{h.day}</span>
                      <span className="hs-hours-time">{h.time}</span>
                    </div>
                  ))}
                  <div className="hs-hours-note">
                    <FiMessageCircle size={14} color="#6366f1" />
                    We usually respond within a few minutes during business hours
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showDeleteModal && (
        <div className="ud-modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal-icon">
              <FiAlertCircle size={26} />
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
              <button type="button" className="ud-modal-cancel" onClick={() => { setShowDeleteModal(false); setDeleteError(""); }} disabled={deleting}>
                Cancel
              </button>
              <button type="button" className="ud-modal-delete" onClick={handleDeleteAccount} disabled={deleting}>
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