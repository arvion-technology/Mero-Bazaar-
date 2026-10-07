"use client";

import { deleteAccountWithReauth } from "@/lib/accountActions";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { OrderDetail as ApiOrderDetail } from "@/app/types/orders";
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
const FILTERS = ["All", "Delivered", "Shipped", "Processing", "Cancelled"];
const PER_PAGE = 8;

type OrderRow = {
  id: string;         
  rawId: string;        
  item: string;
  date: string;
  status: string;
  statusColor: string;
  amount: string;
};

const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  DELIVERED: { label: "Delivered", color: "#22c55e" },
  CONFIRMED: { label: "Confirmed", color: "#22c55e" },
  PREPARING: { label: "Processing", color: "#f59e0b" },
  OUT_FOR_DELIVERY: { label: "Shipped", color: "#6366f1" },
  PENDING: { label: "Pending", color: "#f59e0b" },
  CANCELLED: { label: "Cancelled", color: "#ef4444" },
  EXPIRED: { label: "Expired", color: "#ef4444" },
};

function adaptOrder(o: ApiOrderDetail): OrderRow {
  const disp = STATUS_DISPLAY[o.status] ?? { label: o.status, color: "#64748b" };
  return {
    id: `#${o.id.slice(-6).toUpperCase()}`,
    rawId: o.id,
    item: o.listing?.title ?? "Unknown item",
    date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: disp.label,
    statusColor: disp.color,
    amount: `NPR ${o.totalPrice.toLocaleString()}`,
  };
}

/* ── shared class strings ── */
const navItemBase =
  "relative mb-0.5 flex w-full cursor-pointer items-center gap-3 whitespace-nowrap rounded-[10px] border-0 px-3.5 py-2.5 text-left font-[inherit] text-[14px] leading-normal no-underline transition-all duration-200";
const navItemIdle = "font-medium text-[#5a6478]! hover:bg-[#f4f6fb] hover:text-slate-800!";
const navItemActive =
  "bg-[#fff5f5] font-semibold text-[#C0392B]! before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-[3px] before:bg-[#C0392B] before:content-['']";
const navItemDanger = "font-medium text-red-500/70! hover:bg-red-500/5 hover:text-red-500!";
const iconBtn =
  "relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700";
const ddItemBase =
  "flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-4 py-[11px] text-left font-[inherit] text-sm font-medium no-underline transition-all duration-150";

const statusPill =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[20px] px-3 py-[5px] text-xs font-semibold";
const pagBtn =
  "flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border font-[inherit] text-[13px] font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40";
const pagIdle =
  "border-slate-200 bg-white text-slate-500 enabled:hover:border-slate-300 enabled:hover:bg-slate-50 enabled:hover:text-slate-700";
const pagActive = "border-[#C0392B] bg-[#C0392B] text-white";
const emptyBlock = "px-5 py-[60px] text-center text-slate-400";

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
  const [securityNotifs, setSecurityNotifs] = useState<{ id: string; type: string; createdAt: string }[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const res = await fetch("/api/orders/mine", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOrders(data.map(adaptOrder));
      } catch {
        setOrdersError("Couldn't load your orders.");
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, [accessToken]);

  // Filtering + search runs against `orders` (fetched from the API)
  const filtered = orders.filter((o) => {
    const matchFilter = activeFilter === "All" || o.status === activeFilter;
    const matchSearch = search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.item.toLowerCase().includes(search.toLowerCase()) ||
      o.date.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function getImageUrl(image?: string | null) {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
  }

  // Navigate to an order's detail page (used by table rows and mobile cards)
  function goToOrder(orderId: string) {
    router.push(`/user/orders/${orderId}`);
  }

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
    { id: "contacts", icon: FiUser, label: "Contacts", href: "/user/contacts" },
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
      const res = await deleteAccountWithReauth(accessToken);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // Reset page when filter/search changes
  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1); 
  }, [activeFilter, search]);

  if (loadingOrders) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className={emptyBlock}><p className="text-sm">Loading your orders…</p></div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className={emptyBlock}><p className="text-sm text-red-500">{ordersError}</p></div>
      </div>
    );
  }

  const collapsedHide = sidebarCollapsed ? "lg:hidden" : "";
  const collapsedFade = sidebarCollapsed ? "lg:w-0 lg:overflow-hidden lg:opacity-0" : "";

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-[99] bg-[rgba(15,23,42,0.45)] backdrop-blur-[2px] lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="flex min-h-dvh bg-slate-100 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed left-0 top-0 z-[200] flex h-dvh w-[280px] shrink-0 flex-col border-r border-[#e8ecf0] bg-white shadow-[2px_0_8px_rgba(0,0,0,0.04)] transition-[width,transform] duration-300 ease-in-out lg:z-[100] ${
            sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"
          } ${sidebarOpen ? "translate-x-0 shadow-[4px_0_32px_rgba(0,0,0,0.15)]" : "-translate-x-full lg:translate-x-0"}`}
        >
          <button
            type="button"
            className={`absolute right-4 top-[18px] z-[1] h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-slate-100 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-800 ${
              sidebarOpen ? "flex lg:hidden" : "hidden"
            }`}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>

          <div className="flex min-h-[72px] items-center gap-2.5 overflow-hidden border-b border-[#f0f2f5] p-5">
            <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
              <svg className="h-9 w-9 shrink-0" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <div className={`flex flex-col overflow-hidden whitespace-nowrap leading-[1.1] transition-[opacity,width] duration-200 ${collapsedFade}`}>
                <span className="text-sm font-extrabold tracking-[-0.3px] text-[#C0392B]">HamroNepal</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#888]">Bazaar</span>
              </div>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className={`mb-2 whitespace-nowrap px-3 text-[10px] font-bold uppercase tracking-[1.2px] text-[#b0b8c4] ${collapsedHide}`}>
              Menu
            </div>
            {sidebarItems.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${navItemBase} ${item.id === "orders" ? navItemActive : navItemIdle}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="flex w-[22px] shrink-0 justify-center text-lg"><item.icon size={18} /></span>
                <span className={`transition-opacity duration-200 ${collapsedFade}`}>{item.label}</span>
              </Link>
            ))}
            <div className={`mb-2 mt-4 whitespace-nowrap px-3 text-[10px] font-bold uppercase tracking-[1.2px] text-[#b0b8c4] ${collapsedHide}`}>
              Account
            </div>
            {sidebarItems.slice(4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${navItemBase} ${navItemIdle}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="flex w-[22px] shrink-0 justify-center text-lg"><item.icon size={18} /></span>
                <span className={`transition-opacity duration-200 ${collapsedFade}`}>{item.label}</span>
              </Link>
            ))}
            <button
              type="button"
              className={`${navItemBase} ${navItemDanger}`}
              onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }}
            >
              <span className="flex w-[22px] shrink-0 justify-center text-lg"><FiTrash2 size={18} /></span>
              <span className={`transition-opacity duration-200 ${collapsedFade}`}>Delete Account</span>
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div
          className={`flex min-h-dvh w-full min-w-0 flex-1 flex-col transition-[margin-left] duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:ml-[72px] lg:w-[calc(100%-72px)]" : "lg:ml-[260px] lg:w-[calc(100%-260px)]"
          }`}
        >
          {/* Top Header */}
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white px-3 min-[481px]:px-4 md:h-16 md:px-5 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <button
                type="button"
                className="flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>
              <button
                type="button"
                className="hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 lg:flex"
                onClick={() => setSidebarCollapsed((p) => !p)}
              >
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold tracking-[-0.3px] text-slate-800 md:text-xl">
                My Orders
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {/* Notification Bell */}
              <div className="relative" ref={notifDropdownRef}>
                <button
                  type="button"
                  className={iconBtn}
                  title="Notifications"
                  onClick={() => { setShowNotifDropdown((v) => !v); setNotifSeen(true); }}
                >
                  <FiBell size={18} />
                  {notificationCount > 0 && !notifSeen && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {showNotifDropdown && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-[999] min-w-[280px] animate-[dropdownIn_0.15s_ease] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                    <div className="border-b border-slate-100 px-4 py-3 text-[13px] font-bold text-slate-800">
                      Notifications
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((msg, i) => (
                        <Link
                          key={i}
                          href="/user/settings"
                          className={`flex items-center gap-2.5 px-4 py-3 text-[13px] text-slate-600! no-underline ${
                            i < notifications.length - 1 ? "border-b border-slate-50" : ""
                          }`}
                          onClick={() => setShowNotifDropdown(false)}
                        >
                          <FiAlertCircle size={15} color="#f59e0b" className="shrink-0" />
                          {msg}
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-[13px] text-slate-400">You&apos;re all caught up ✓</div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Avatar Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-[40px] border-[1.5px] border-slate-200 bg-white py-[5px] pl-[5px] pr-2.5 font-[inherit] transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                  onClick={() => setShowProfileDropdown((p) => !p)}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#C0392B,#e74c3c)] text-xs font-bold text-white">
                    {session?.user?.image ? (
                      <img src={getImageUrl(session.user.image)} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <FiChevronDown
                    size={14}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-[999] min-w-[200px] animate-[dropdownIn_0.15s_ease] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                    <div className="border-b border-slate-100 px-4 pb-3 pt-3.5">
                      <div className="text-sm font-bold text-slate-800">{session?.user?.name || "User"}</div>
                      <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-400">
                        {session?.user?.email || ""}
                      </div>
                    </div>
                    <Link
                      href="/user/settings"
                      className={`${ddItemBase} text-slate-600! hover:bg-slate-50 hover:text-slate-800!`}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FiUser size={15} /> Profile &amp; Settings
                    </Link>
                    <div className="h-px bg-slate-100" />
                    <button
                      type="button"
                      className={`${ddItemBase} text-red-500 hover:bg-red-50 hover:text-red-600`}
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-w-0 flex-1 overflow-y-auto p-3 min-[481px]:p-4 md:px-5 md:pb-8 md:pt-5 lg:px-8 lg:py-7">
            {/* Toolbar: search + filters */}
            <div className="mb-5 flex flex-col flex-wrap items-stretch justify-between gap-4 md:flex-row md:items-center">
              <div className="relative min-w-[200px] max-w-full flex-1 md:max-w-[340px]">
                <FiSearch size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full rounded-[10px] border border-slate-200 bg-white py-[9px] pl-[38px] pr-3.5 font-[inherit] text-sm text-slate-800 outline-none transition-all duration-200 focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                  placeholder="Search by order ID, item, or date…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 min-[481px]:gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`cursor-pointer rounded-lg border-[1.5px] px-3 py-1.5 font-[inherit] text-xs font-semibold transition-all duration-200 min-[481px]:px-4 min-[481px]:py-[7px] min-[481px]:text-[13px] ${
                      activeFilter === f
                        ? "border-[#C0392B] bg-[#C0392B] text-white"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                    }`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table (desktop/tablet) */}
            <div className="mb-6 w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="hidden w-full overflow-x-auto md:block">
                <table className="w-full min-w-[560px] border-collapse">
                  <thead>
                    <tr>
                      {["Order ID", "Item", "Date", "Status", "Amount"].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap border-b border-slate-100 bg-[#fafbfc] px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.5px] text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length > 0 ? paginated.map((order) => (
                      <tr
                        key={order.rawId}
                        className="group cursor-pointer text-inherit last:[&>td]:border-b-0"
                        role="link"
                        tabIndex={0}
                        onClick={() => goToOrder(order.rawId)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            goToOrder(order.rawId);
                          }
                        }}
                      >
                        <td className="whitespace-nowrap border-b border-slate-50 px-5 py-3.5 text-sm text-slate-700 transition-colors duration-150 group-hover:bg-[#fafbfc]">
                          <span className="font-[SF_Mono,Fira_Code,monospace] text-[13px] font-semibold text-slate-800">{order.id}</span>
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-50 px-5 py-3.5 text-sm text-slate-700 transition-colors duration-150 group-hover:bg-[#fafbfc]">
                          <span className="max-w-[200px] overflow-hidden text-ellipsis text-[13px] text-slate-600">{order.item}</span>
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-50 px-5 py-3.5 text-sm text-slate-700 transition-colors duration-150 group-hover:bg-[#fafbfc]">
                          {order.date}
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-50 px-5 py-3.5 text-sm text-slate-700 transition-colors duration-150 group-hover:bg-[#fafbfc]">
                          <span className={statusPill} style={{ background: order.statusColor + "12", color: order.statusColor }}>
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: order.statusColor }} />
                            {order.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-800 transition-colors duration-150 group-hover:bg-[#fafbfc]">
                          {order.amount}
                        </td>
                      </tr>
                    )) : (
                      <tr className="last:[&>td]:border-b-0">
                        <td colSpan={5} className="whitespace-nowrap border-b border-slate-50 px-5 py-3.5 text-sm text-slate-700">
                          <div className={emptyBlock}>
                            <FiShoppingBag size={40} className="mx-auto mb-4 block opacity-40" />
                            <h3 className="mb-1.5 text-base font-semibold text-slate-500">No orders found</h3>
                            <p className="text-sm">Try adjusting your search or filter.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="flex flex-col gap-3 p-4 md:hidden">
                {paginated.length > 0 ? paginated.map((order) => (
                  <Link
                    key={order.rawId}
                    href={`/user/orders/${order.rawId}`}
                    className="block cursor-pointer rounded-[10px] border border-slate-100 bg-[#f8fafc] p-3.5 text-inherit no-underline transition-[background,border-color] duration-150 hover:border-slate-200 hover:bg-slate-100"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-[SF_Mono,Fira_Code,monospace] text-[13px] font-semibold text-slate-800">{order.id}</span>
                      <span className={statusPill} style={{ background: order.statusColor + "12", color: order.statusColor }}>
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: order.statusColor }} />
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-1.5 text-[13px] text-slate-600">{order.item}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{order.date}</span>
                      <span className="font-semibold text-slate-800">{order.amount}</span>
                    </div>
                  </Link>
                )) : (
                  <div className={emptyBlock}>
                    <FiShoppingBag size={40} className="mx-auto mb-4 block opacity-40" />
                    <h3 className="mb-1.5 text-base font-semibold text-slate-500">No orders found</h3>
                    <p className="text-sm">Try adjusting your search or filter.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filtered.length > PER_PAGE && (
                <div className="flex flex-col flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-4 md:flex-row md:justify-between">
                  <div className="text-[13px] text-slate-500">
                    Showing {Math.min((safePage - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} orders
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" className={`${pagBtn} ${pagIdle}`} disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}>
                      <FiChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - safePage) <= 2)
                      .map((p) => (
                        <button key={p} type="button" className={`${pagBtn} ${p === safePage ? pagActive : pagIdle}`} onClick={() => setPage(p)}>
                          {p}
                        </button>
                      ))}
                    <button type="button" className={`${pagBtn} ${pagIdle}`} disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)}>
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
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-5 backdrop-blur-[4px]"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] bg-red-50 text-red-500">
              <FiAlertTriangle size={26} />
            </div>
            <div className="mb-2 text-center text-lg font-bold text-slate-800">Delete Your Account?</div>
            <div className="mb-6 text-center text-sm leading-relaxed text-slate-500">
              This action is <strong className="text-red-500">permanent and irreversible</strong>. All your orders, wishlist, and personal data will be permanently deleted.
            </div>
            {deleteError && (
              <div className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-center text-[13px] text-red-500">
                {deleteError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-[10px] border-[1.5px] border-slate-200 bg-white py-[11px] font-[inherit] text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border-0 bg-red-500 py-[11px] font-[inherit] text-sm font-semibold text-white transition-all duration-200 hover:enabled:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : <><FiTrash2 size={15} /> Yes, Delete Account</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}