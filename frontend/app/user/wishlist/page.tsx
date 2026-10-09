"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFoodCart } from "../../context/FoodCartContext";
import { deleteAccountWithReauth } from "@/lib/accountActions";
import {
  FiGrid,
  FiShoppingBag,
  FiHeart,
  FiBell,
  FiHelpCircle,
  FiSettings,
  FiAlertTriangle,
  FiShoppingCart,
  FiTrash2,
  FiMoreHorizontal,
  FiSearch,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";

const PRIMARY = "#C0392B";

type WishlistApiItem = {
  id: string;
  listingId: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    price: number | null;
    images: string[];
    category: string;
  };
};

type WishlistDisplayItem = {
  id: string;
  listingId: string;
  image: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  addedDate: string;
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
} 

function formatPrice(price: number, currency: string) {
  return `${currency} ${price.toLocaleString("en-IN")}`;
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

const cardBtn =
  "inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-[10px] px-2.5 py-2 font-[inherit] text-[11px] font-semibold transition-all duration-200 min-[481px]:gap-1.5 min-[481px]:px-3 min-[481px]:text-xs md:px-3.5 md:py-2.5 md:text-[13px]";
const cardBtnPrimary =
  "border-0 bg-[#C0392B] text-white hover:bg-[#a93226] hover:shadow-[0_4px_12px_rgba(192,57,43,0.25)]";
const cardBtnGhost = "border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200";

export default function UserWishlist() {
  const [activeTab, setActiveTab] = useState("wishlist");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistDisplayItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [securityNotifs, setSecurityNotifs] = useState<{ id: string; type: string; createdAt: string; read: boolean }[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const token = session?.accessToken;
  const { addItem } = useFoodCart();

  function activityLabel(type: string) {
    switch (type) {
      case "PASSWORD_CHANGED": return "Password changed";
      case "TWO_FA_ENABLED": return "Two-factor authentication enabled";
      case "TWO_FA_DISABLED": return "Two-factor authentication disabled";
      case "PHONE_CHANGED": return "Phone number changed";
      default: return type;
    }
  }

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
    { id: "contacts", icon: FiUser, label: "Contacts", href: "/user/contacts" },
    { id: "orders", icon: FiShoppingBag, label: "My Orders", href: "/user/orders" },
    { id: "wishlist", icon: FiHeart, label: "Wishlist", href: "/user/wishlist" },
    { id: "notification", icon: FiBell, label: "Notifications", href: "/user/notifications" },
    { id: "help", icon: FiHelpCircle, label: "Help & Support", href: "/user/help" },
    { id: "settings", icon: FiSettings, label: "Settings", href: "/user/settings" },
  ];

  useEffect(() => {
    if (!token) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingWishlist(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: WishlistApiItem[]) => {
        const mapped: WishlistDisplayItem[] = data.map((item) => ({
          id: item.id,
          listingId: item.listingId,
          image: item.listing.images?.[0] ? getImageUrl(item.listing.images[0]) : "/placeholder.png",
          name: item.listing.title,
          price: item.listing.price ?? 0,
          currency: "NPR",
          category: item.listing.category,
          addedDate: timeAgo(item.createdAt),
        }));
        setWishlistItems(mapped);
      })
      .catch(() => {})
      .finally(() => setLoadingWishlist(false));
  }, [token]);

  function getImageUrl(image?: string | null) {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
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

  useEffect(() => {
    if (!token) return;
    fetch("/api/user/notifications/security", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setSecurityNotifs)
      .catch(() => {});
  }, [token]);

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await deleteAccountWithReauth(token);
      if (res.status === 499) return; // user cancelled the confirmation
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

  const handleRemove = async (wishlistId: string, listingId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(wishlistId);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId }),
      });
    } catch {
      // silently ignore
    } finally {
      setTimeout(() => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId));
        setRemovingId(null);
      }, 300);
    }
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const collapsedHide = sidebarCollapsed ? "lg:hidden" : "";
  const collapsedFade = sidebarCollapsed ? "lg:w-0 lg:overflow-hidden lg:opacity-0" : "";

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-[99] animate-[backdropIn_0.2s_ease] bg-[rgba(15,23,42,0.45)] backdrop-blur-[2px] lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="flex min-h-dvh bg-slate-100 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif]">
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
                className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
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
                className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                <span className="flex w-[22px] shrink-0 justify-center text-lg"><item.icon size={18} /></span>
                <span className={`transition-opacity duration-200 ${collapsedFade}`}>{item.label}</span>
              </Link>
            ))}
            <button
              type="button"
              className={`${navItemBase} ${navItemDanger}`}
              onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }}
              title="Delete Account"
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
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold tracking-[-0.3px] text-slate-800 md:text-xl">
                Wishlist
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-3">
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
                        <div
                          key={i}
                          className={`flex items-center gap-2.5 px-4 py-3 text-[13px] text-slate-600 ${
                            i < notifications.length - 1 ? "border-b border-slate-50" : ""
                          }`}
                        >
                          <FiAlertCircle size={15} color="#f59e0b" className="shrink-0" />
                          {msg}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-[13px] text-slate-400">You&apos;re all caught up ✓</div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-[40px] border-[1.5px] border-slate-200 bg-white py-[5px] pl-[5px] pr-2.5 font-[inherit] transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
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
                      <FiUser size={15} />
                      Profile &amp; Settings
                    </Link>
                    <div className="h-px bg-slate-100" />
                    <button
                      type="button"
                      className={`${ddItemBase} text-red-500 hover:bg-red-50 hover:text-red-600`}
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
          <main className="min-w-0 flex-1 overflow-y-auto p-3 min-[481px]:p-4 md:px-5 md:pb-8 md:pt-5 lg:px-8 lg:py-7">
            <div className="mb-4 min-[481px]:mb-6">
              <p className="text-[13px] text-slate-500 md:text-sm">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>

            <div className="mb-4 min-[481px]:mb-6">
              <div className="flex w-full max-w-full items-center gap-2.5 rounded-[10px] border border-slate-200 bg-white px-4 py-3 transition-all duration-200 focus-within:border-[#C0392B] focus-within:shadow-[0_0_0_3px_rgba(192,57,43,0.08)] md:max-w-[400px]">
                <FiSearch size={18} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  className="min-w-0 flex-1 border-0 bg-transparent font-[inherit] text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Search wishlist items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loadingWishlist ? (
              <div className="px-5 py-[60px] text-center text-slate-400">
                <p className="text-sm">Loading your wishlist...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="px-5 py-[60px] text-center text-slate-400">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff5f5] text-[#C0392B]">
                  <FiHeart size={28} />
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-slate-600">Your wishlist is empty</h3>
                <p className="text-sm">Start adding items you love to your wishlist.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 min-[481px]:gap-4 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative min-w-0 overflow-hidden rounded-[14px] border border-slate-200 bg-white ${
                      removingId === item.id
                        ? "scale-95 opacity-0 transition-all duration-300 ease-in-out"
                        : "transition-all duration-[250ms] hover:-translate-y-[3px] hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    {/* ── Clickable Image ── */}
                    <div className="relative h-40 w-full overflow-hidden bg-[#f8fafc] min-[481px]:h-[180px] md:h-[200px]">
                      <Link href={`/user/wishlist/${item.listingId}`} className="block h-full w-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="block h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>
                      <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-[20px] bg-black/60 px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.5px] text-white backdrop-blur-[8px]">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        className="absolute right-3 top-3 z-[3] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-white/95 text-slate-500 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500"
                        onClick={(e) => handleRemove(item.id, item.listingId, e)}
                        title="Remove from wishlist"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="p-3 min-[481px]:p-3.5 md:p-[18px]">
                      {/* ── Clickable Title ── */}
                      <Link href={`/user/wishlist/${item.listingId}`} className="text-inherit no-underline">
                        <div className="mb-1 block text-sm font-semibold leading-[1.4] text-slate-800 hover:text-[#C0392B] md:text-[15px]">
                          {item.name}
                        </div>
                      </Link>

                      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-base font-bold tracking-[-0.3px] text-[#C0392B] md:text-lg">
                          {formatPrice(item.price, item.currency)}
                        </span>
                        <span className="text-xs text-slate-400">{item.addedDate}</span>
                      </div>

                      <div className="flex gap-1.5 min-[481px]:gap-2">
                        <button
                          type="button"
                          className={`${cardBtn} ${cardBtnPrimary}`}
                          onClick={() => {
                            addItem({
                              id: item.listingId,
                              listingId: item.listingId,
                              name: item.name,
                              description: item.category,
                              variant: "",
                              price: item.price,
                              quantity: 1,
                              image: item.image,
                            });
                            router.push("/cart");
                          }}
                        >
                          <FiShoppingCart size={14} />
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          className={`${cardBtn} ${cardBtnGhost}`}
                          onClick={() => {
                            addItem({
                              id: item.listingId,
                              listingId: item.listingId,
                              name: item.name,
                              description: item.category,
                              variant: "",
                              price: item.price,
                              quantity: 1,
                              image: item.image,
                            });
                            router.push("/cart");
                          }}
                        >
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

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[9999] flex animate-[fadeIn_0.2s_ease] items-center justify-center bg-black/50 p-5 backdrop-blur-[4px]"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-[420px] animate-[slideUp_0.25s_ease] rounded-2xl bg-white p-8 shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] bg-red-50 text-red-500">
              <FiAlertTriangle size={26} />
            </div>
            <div className="mb-2 text-center text-lg font-bold text-slate-800">Delete Your Account?</div>
            <div className="mb-6 text-center text-sm leading-relaxed text-slate-500">
              This action is <strong className="text-red-500">permanent and irreversible</strong>. All your orders,
              wishlist, and personal data will be permanently deleted.
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