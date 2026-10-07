"use client";

import { deleteAccountWithReauth } from "@/lib/accountActions";

import { useState, useRef, useEffect,useMemo } from "react";
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
  FiMoreHorizontal,
  FiAlertTriangle,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
  FiAlertCircle,
  FiShield,
  FiTruck,
  FiTag,
  FiUserCheck,
} from "react-icons/fi";

const PRIMARY = "#C0392B";

type NotificationCategory = "all" | "orders" | "account" | "promotions" | "system";

interface NotificationItem {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  read: boolean;
}

const categoryTabs: { key: NotificationCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "orders", label: "Orders" },
  { key: "account", label: "Account" },
  { key: "promotions", label: "Promotions" },
  { key: "system", label: "System" },
];

/* ── Shared Tailwind class strings ── */
const iconBtn =
  "w-10 h-10 rounded-[10px] border border-[#e2e8f0] bg-white flex items-center justify-center cursor-pointer text-[#64748b] transition-all duration-200 relative shrink-0 hover:bg-[#f8fafc] hover:text-[#334155] hover:border-[#cbd5e1]";
const squareBtn =
  "rounded-lg border border-[#e2e8f0] bg-white items-center justify-center cursor-pointer text-[#64748b] transition-all duration-200 shrink-0 hover:bg-[#f8fafc] hover:text-[#334155] hover:border-[#cbd5e1]";
const navItemBase =
  "relative mb-0.5 flex w-full cursor-pointer items-center gap-3 whitespace-nowrap rounded-[10px] border-0 px-3.5 py-2.5 text-left font-[inherit] text-[14px] leading-normal no-underline transition-all duration-200";
const navItemIdle = "font-medium text-[#5a6478]! hover:bg-[#f4f6fb] hover:text-slate-800!";
const navItemActive =
  "bg-[#fff5f5] font-semibold text-[#C0392B]! before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-[3px] before:bg-[#C0392B] before:content-['']";
const navItemDanger = "font-medium text-red-500/70! hover:bg-red-500/5 hover:text-red-500!";
const dropdownItemBase =
  "flex items-center gap-2.5 px-4 py-[11px] text-sm font-medium cursor-pointer transition-all duration-150 border-0 bg-transparent w-full text-left";
const navLabel = "text-[10px] font-bold text-[#b0b8c4] uppercase tracking-[1.2px] px-3 mb-2 whitespace-nowrap";
const navIcon = "text-lg w-[22px] flex justify-center shrink-0";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("notification");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { data: session } = useSession();
  const token = session?.accessToken;
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const [securityNotifs, setSecurityNotifs] = useState<{ id: string; type: string; createdAt: string; read: boolean }[]>([]);

  function activityLabel(type: string) {
    switch (type) {
      case "PASSWORD_CHANGED": return "Password changed";
      case "TWO_FA_ENABLED": return "Two-factor authentication enabled";
      case "TWO_FA_DISABLED": return "Two-factor authentication disabled";
      case "PHONE_CHANGED": return "Phone number changed";
      default: return type;
    }
  }

  function getCategoryIcon(category: string) {
  switch (category) {
    case "ORDERS":
      return { icon: FiTruck, iconBg: "#dbeafe", iconColor: "#3b82f6" };
    case "PROMOTIONS":
      return { icon: FiTag, iconBg: "#fee2e2", iconColor: "#ef4444" };
    case "SYSTEM":
      return { icon: FiShield, iconBg: "#f3e8ff", iconColor: "#a855f7" };
    case "ACCOUNT":
    default:
      return { icon: FiUserCheck, iconBg: "#fef9c3", iconColor: "#eab308" };
  }
}
  const mergedNotifications = useMemo(() => {
  const mapped: NotificationItem[] = securityNotifs.map((n) => ({
    id: `activity-${n.id}`,
    icon: FiShield,
    iconBg: "#f3e8ff",
    iconColor: "#a855f7",
    title: activityLabel(n.type),
    description: "Security activity on your account",
    time: new Date(n.createdAt).toLocaleString(),
    category: "account" as NotificationCategory,
    read: n.read,
  }));
  return [...mapped, ...notifications];
}, [securityNotifs, notifications]);

const categoryCounts = {
  all: mergedNotifications.length,
  orders: mergedNotifications.filter((n) => n.category === "orders").length,
  account: mergedNotifications.filter((n) => n.category === "account").length,
  promotions: mergedNotifications.filter((n) => n.category === "promotions").length,
  system: mergedNotifications.filter((n) => n.category === "system").length,
};

  const profileNotifications: string[] = session
    ? ([
        !session.user?.phone && "Add your phone number",
        !session.user?.address && "Add your address",
      ].filter(Boolean) as string[])
    : [];
  const notificationCount = profileNotifications.length + mergedNotifications.filter((n) => !n.read).length;

  const filteredNotifications =
  selectedCategory === "all"
    ? mergedNotifications
    : mergedNotifications.filter((n) => n.category === selectedCategory);

  function getImageUrl(image?: string | null) {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
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


useEffect(() => {
    if (!token) return;
    fetch("/api/user/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(
        (
          data: {
            id: string;
            category: string;
            type: string;
            title: string;
            description: string;
            read: boolean;
            createdAt: string;
          }[]
        ) => {
          const mapped: NotificationItem[] = data.map((n) => {
            const { icon, iconBg, iconColor } = getCategoryIcon(n.category);
            return {
              id: n.id,
              icon,
              iconBg,
              iconColor,
              title: n.title,
              description: n.description,
              time: new Date(n.createdAt).toLocaleString(),
              category: n.category.toLowerCase() as NotificationCategory,
              read: n.read,
            };
          });
          setNotifications(mapped);
        }
      )
      .catch(() => {});
  }, [token]);

  const sidebarItems = [
    { id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/user/dashboard" },
    { id: "contacts", icon: FiUser, label: "Contacts", href: "/user/contacts" },
    { id: "orders", icon: FiShoppingBag, label: "My Orders", href: "/user/orders" },
    { id: "wishlist", icon: FiHeart, label: "Wishlist", href: "/user/wishlist" },
    { id: "notification", icon: FiBell, label: "Notifications", href: "/user/notifications" },
    { id: "help", icon: FiHelpCircle, label: "Help & Support", href: "/user/help" },
    { id: "settings", icon: FiSettings, label: "Settings", href: "/user/settings" },
  ];


  const unreadCount = mergedNotifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setSecurityNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!token) return;
    fetch("/api/user/notifications/mark-all-read", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    fetch("/api/user/notifications/security/mark-read", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const handleMarkRead = (id: string) => {
    if (id.startsWith("activity-")) {
      const readId = id.replace("activity-", "");
        setSecurityNotifs((prev) => prev.map((n) => (n.id === readId ? { ...n, read: true } : n)));
  } else {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (token) {
      fetch(`/api/user/notifications/${id}/mark-read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  } 
};

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await deleteAccountWithReauth(token);
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
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const collapsedHide = sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "";

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      <div
        className={`hidden fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-[2px] z-[99] animate-[backdropIn_0.2s_ease] ${
          sidebarOpen ? "max-lg:block" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="min-h-dvh bg-[#f1f5f9] flex font-[Inter,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif]">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed left-0 top-0 h-dvh z-[100] flex flex-col shrink-0 bg-white border-r border-[#e8ecf0] shadow-[2px_0_8px_rgba(0,0,0,0.04)] transition-[width,transform] duration-300 ease-in-out ${
            sidebarCollapsed ? "w-[72px]" : "w-[260px]"
          } max-lg:w-[280px] max-lg:z-[200] ${
            sidebarOpen
              ? "max-lg:translate-x-0 max-lg:shadow-[4px_0_32px_rgba(0,0,0,0.15)]"
              : "max-lg:-translate-x-full"
          }`}
        >
          {/* Mobile close button */}
          <button
            type="button"
            className={`hidden absolute top-[18px] right-4 w-8 h-8 border-0 bg-[#f1f5f9] rounded-lg cursor-pointer items-center justify-center text-[#64748b] transition-all duration-200 z-[1] hover:bg-[#e2e8f0] hover:text-[#1e293b] ${
              sidebarOpen ? "max-lg:flex" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>

          {/* Logo */}
          <div className="p-5 flex items-center gap-2.5 border-b border-[#f0f2f5] min-h-[72px] overflow-hidden">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <svg className="w-9 h-9 shrink-0" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
                <path
                  d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10
                     M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28
                     M10 10 Q10 19 10 28
                     M28 10 Q28 19 28 28
                     M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="19" cy="19" r="3" fill="#fff" opacity="0.9" />
              </svg>
              <div
                className={`flex flex-col leading-[1.1] transition-[opacity,width] duration-200 whitespace-nowrap overflow-hidden ${
                  sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                <span className="text-sm font-extrabold text-[#C0392B] tracking-[-0.3px]">HamroNepal</span>
                <span className="text-[11px] font-semibold text-[#888] tracking-[0.5px] uppercase">Bazaar</span>
              </div>
            </Link>
          </div>

          <div className="px-3 py-4 flex-1 overflow-y-auto">
            <div className={`${navLabel} ${sidebarCollapsed ? "hidden" : ""}`}>Menu</div>
            {sidebarItems.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span className={navIcon}>
                  <item.icon size={18} />
                </span>
                <span className={`transition-opacity duration-200 ${collapsedHide}`}>{item.label}</span>
              </Link>
            ))}

            <div className={`${navLabel} mt-4 ${sidebarCollapsed ? "hidden" : ""}`}>Account</div>
            {sidebarItems.slice(4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span className={navIcon}>
                  <item.icon size={18} />
                </span>
                <span className={`transition-opacity duration-200 ${collapsedHide}`}>{item.label}</span>
              </Link>
            ))}

            {/* Delete Account */}
            <button
              type="button"
              className={`${navItemBase} ${navItemDanger}`}
              onClick={() => {
                setShowDeleteModal(true);
                setSidebarOpen(false);
              }}
              title="Delete Account"
            >
              <span className={navIcon}>
                <FiTrash2 size={18} />
              </span>
              <span className={`transition-opacity duration-200 ${collapsedHide}`}>Delete Account</span>
            </button>
          </div>
        </aside>

        {/* ── Main Area ── */}
        <div
          className={`flex-1 flex flex-col min-h-dvh min-w-0 transition-[margin-left] duration-300 ease-in-out ml-0 w-full ${
            sidebarCollapsed ? "lg:ml-[72px] lg:w-[calc(100%-72px)]" : "lg:ml-[260px] lg:w-[calc(100%-260px)]"
          }`}
        >
          {/* Top Header */}
          <header className="bg-white border-b border-[#e2e8f0] px-8 h-16 flex items-center justify-between sticky top-0 z-50 gap-4 max-lg:px-5 max-md:px-4 max-md:h-14 max-[480px]:px-3">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Hamburger - mobile only */}
              <button
                type="button"
                className={`hidden max-lg:flex w-[38px] h-[38px] ${squareBtn}`}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>
              {/* Desktop toggle - desktop only */}
              <button
                type="button"
                className={`flex max-lg:hidden w-9 h-9 ${squareBtn}`}
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="text-xl font-bold text-[#1e293b] tracking-[-0.3px] whitespace-nowrap overflow-hidden text-ellipsis max-md:text-lg">Notifications</h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {/* Notifications Bell */}
              <div className="relative" ref={notifDropdownRef}>
              <button
                type="button"
                className={iconBtn}
                title="Notifications"
                onClick={() => {
                  setShowNotifDropdown((v) => !v);
                  setNotifSeen(true);
                  if (securityNotifs.some((n) => !n.read)) {
                    fetch("/api/user/notifications/security/mark-read", {
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
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute top-[calc(100%+10px)] right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] min-w-[280px] z-[999] overflow-hidden animate-[dropdownIn_0.15s_ease]">
                    <div className="px-4 py-3 border-b border-[#f1f5f9] font-bold text-[13px] text-[#1e293b]">
                      Notifications
                    </div>
                    {profileNotifications.length > 0 ? (
                      profileNotifications.map((msg, i) => (
                        <Link
                          key={i}
                          href="/user/settings"
                          className={`flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#475569] transition-colors duration-150 ${
                            i < profileNotifications.length - 1 ? "border-b border-[#f8fafc]" : ""
                          }`}
                          onClick={() => setShowNotifDropdown(false)}
                        >
                          <FiAlertCircle size={15} color="#f59e0b" className="shrink-0" />
                          {msg}
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-[13px] text-[#94a3b8] text-center">
                        You&apos;re all caught up ✓
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Avatar Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 py-[5px] pr-2.5 pl-[5px] rounded-[40px] border-[1.5px] border-[#e2e8f0] bg-white cursor-pointer transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0392B] to-[#e74c3c] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                    {session?.user?.image ? (
                      <img
                        src={getImageUrl(session.user.image)}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <FiChevronDown
                    size={14}
                    className={`text-[#94a3b8] transition-transform duration-200 shrink-0 ${showProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-[calc(100%+8px)] right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] min-w-[200px] z-[999] overflow-hidden animate-[dropdownIn_0.15s_ease]">
                    <div className="pt-3.5 pb-3 px-4 border-b border-[#f1f5f9]">
                      <div className="text-sm font-bold text-[#1e293b]">
                        {session?.user?.name || "User"}
                      </div>
                      <div className="text-xs text-[#94a3b8] mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                        {session?.user?.email || ""}
                      </div>
                    </div>
                    <Link
                      href="/user/settings"
                      className={`${dropdownItemBase} text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b]`}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FiUser size={15} />
                      Profile & Settings
                    </Link>
                    <div className="h-px bg-[#f1f5f9]" />
                    <button
                      type="button"
                      className={`${dropdownItemBase} text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]`}
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

          {/* ── Notifications Content ── */}
          <main className="flex-1 px-8 py-7 overflow-y-auto min-w-0 max-lg:px-5 max-lg:pt-5 max-lg:pb-8 max-md:p-4 max-[480px]:p-3">
            {/* Tabs + Mark All */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3 max-md:gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap max-[480px]:gap-1">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-3.5 py-[7px] rounded-[20px] text-[13px] font-medium border cursor-pointer transition-all duration-200 whitespace-nowrap max-md:px-3 max-md:py-1.5 max-md:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[480px]:text-[11px] ${
                      selectedCategory === tab.key
                        ? "bg-[#1e293b] text-white border-[#1e293b]"
                        : "text-[#64748b] bg-white border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
                    }`}
                    onClick={() => setSelectedCategory(tab.key)}
                  >
                    {tab.label}
                    <span className="ml-1 text-[11px] font-semibold text-inherit">({categoryCounts[tab.key]})</span>
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <button
                  className="text-[13px] font-semibold text-[#6366f1] bg-transparent border-0 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:text-[#4f46e5]"
                  onClick={handleMarkAllRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3.5 px-5 py-[18px] border-b border-[#f1f5f9] cursor-pointer transition-colors duration-150 relative last:border-b-0 hover:bg-[#fafbfc] max-md:px-4 max-md:py-3.5 max-md:gap-3"
                    onClick={() => handleMarkRead(notif.id)}
                  >
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-lg max-md:w-9 max-md:h-9 max-md:text-base"
                      style={{ background: notif.iconBg, color: notif.iconColor }}
                    >
                      <notif.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1e293b] mb-[3px] max-md:text-[13px]">{notif.title}</div>
                      <div className="text-[13px] text-[#64748b] leading-[1.4] max-md:text-xs">{notif.description}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      <span className="text-xs text-[#94a3b8] font-medium whitespace-nowrap max-md:text-[11px]">{notif.time}</span>
                      <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${notif.read ? "bg-transparent" : "bg-[#ef4444]"}`} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-[60px] px-5 text-[#94a3b8]">
                  <div className="w-14 h-14 rounded-[14px] bg-[#f1f5f9] flex items-center justify-center mx-auto mb-4 text-[#94a3b8] text-2xl">
                    <FiBell size={24} />
                  </div>
                  <div className="text-[15px] font-semibold text-[#475569] mb-1">No notifications</div>
                  <div className="text-[13px] text-[#94a3b8]">
                    You have no {selectedCategory !== "all" ? selectedCategory : ""}{" "}
                    notifications yet.
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ── Delete Account Confirmation Modal ── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-[fadeIn_0.2s_ease]"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-[420px] shadow-[0_25px_50px_rgba(0,0,0,0.25)] animate-[slideUp_0.25s_ease]" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-[14px] bg-[#fef2f2] flex items-center justify-center text-[#ef4444] mx-auto mb-5">
              <FiAlertTriangle size={26} />
            </div>
            <div className="text-lg font-bold text-[#1e293b] text-center mb-2">Delete Your Account?</div>
            <div className="text-sm text-[#64748b] text-center leading-[1.6] mb-6 [&_strong]:text-[#ef4444]">
              This action is <strong>permanent and irreversible</strong>. All your orders,
              wishlist, and personal data will be permanently deleted.
            </div>
            {deleteError && (
              <div className="text-[13px] text-[#ef4444] bg-[#fef2f2] rounded-lg px-3.5 py-2.5 mb-4 text-center">{deleteError}</div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-[11px] rounded-[10px] border-[1.5px] border-[#e2e8f0] bg-white text-[#475569] text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError("");
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 py-[11px] rounded-[10px] border-0 bg-[#ef4444] text-white text-sm font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 enabled:hover:bg-[#dc2626] disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
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