"use client";

import { deleteAccountWithReauth } from "@/lib/accountActions";

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
    { id: "contacts", icon: FiUser, label: "Contacts", href: "/user/contacts" },
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
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const collapsedHide = sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "";

  return (
    <>
      {/* Mobile backdrop */}
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

          <div className="p-5 flex items-center gap-2.5 border-b border-[#f0f2f5] min-h-[72px] overflow-hidden">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <svg className="w-9 h-9 shrink-0" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
                <path d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10 M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28 M10 10 Q10 19 10 28 M28 10 Q28 19 28 28 M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
              <Link key={item.id} href={item.href} className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
                <span className={navIcon}><item.icon size={18} /></span>
                <span className={`transition-opacity duration-200 ${collapsedHide}`}>{item.label}</span>
              </Link>
            ))}

            <div className={`${navLabel} mt-4 ${sidebarCollapsed ? "hidden" : ""}`}>Account</div>
            {sidebarItems.slice(4).map((item) => (
              <Link key={item.id} href={item.href} className={`${navItemBase} ${activeTab === item.id ? navItemActive : navItemIdle}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
                <span className={navIcon}><item.icon size={18} /></span>
                <span className={`transition-opacity duration-200 ${collapsedHide}`}>{item.label}</span>
              </Link>
            ))}

            <button type="button" className={`${navItemBase} ${navItemDanger}`} onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }} title="Delete Account">
              <span className={navIcon}><FiTrash2 size={18} /></span>
              <span className={`transition-opacity duration-200 ${collapsedHide}`}>Delete Account</span>
            </button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div
          className={`flex-1 flex flex-col min-h-dvh min-w-0 transition-[margin-left] duration-300 ease-in-out ml-0 w-full ${
            sidebarCollapsed ? "lg:ml-[72px] lg:w-[calc(100%-72px)]" : "lg:ml-[260px] lg:w-[calc(100%-260px)]"
          }`}
        >
          <header className="bg-white border-b border-[#e2e8f0] px-8 h-16 flex items-center justify-between sticky top-0 z-50 gap-4 max-lg:px-5 max-md:px-4 max-md:h-14 max-[480px]:px-3">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button type="button" className={`hidden max-lg:flex w-[38px] h-[38px] ${squareBtn}`} onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <FiMenu size={20} />
              </button>
              <button type="button" className={`flex max-lg:hidden w-9 h-9 ${squareBtn}`} onClick={() => setSidebarCollapsed((prev) => !prev)} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                <FiMoreHorizontal size={18} />
              </button>
              <h1 className="text-xl font-bold text-[#1e293b] tracking-[-0.3px] whitespace-nowrap overflow-hidden text-ellipsis max-md:text-lg">Help & Support</h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative" ref={notifDropdownRef}>
                <button type="button" className={iconBtn} title="Notifications" onClick={() => {
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
                  {notificationCount > 0 && !notifSeen && (
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">{notificationCount}</span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute top-[calc(100%+10px)] right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] min-w-[280px] z-[999] overflow-hidden animate-[dropdownIn_0.15s_ease]">
                    <div className="px-4 py-3 border-b border-[#f1f5f9] font-bold text-[13px] text-[#1e293b]">Notifications</div>
                    {notifications.length > 0 ? (
                      notifications.map((msg, i) => (
                        <Link
                          key={i}
                          href="/user/settings"
                          className={`flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#475569] transition-colors duration-150 ${i < notifications.length - 1 ? "border-b border-[#f8fafc]" : ""}`}
                          onClick={() => setShowNotifDropdown(false)}
                        >
                          <FiAlertCircle size={15} color="#f59e0b" className="shrink-0" />{msg}
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-[13px] text-[#94a3b8] text-center">You&apos;re all caught up</div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={profileDropdownRef}>
                <button type="button" className="flex items-center gap-2 py-[5px] pr-2.5 pl-[5px] rounded-[40px] border-[1.5px] border-[#e2e8f0] bg-white cursor-pointer transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc]" onClick={() => setShowProfileDropdown((prev) => !prev)}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0392B] to-[#e74c3c] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                    {session?.user?.image ? <img src={getImageUrl(session.user.image)} alt="avatar" className="w-full h-full object-cover" /> : userInitials}
                  </div>
                  <FiChevronDown size={14} className={`text-[#94a3b8] transition-transform duration-200 shrink-0 ${showProfileDropdown ? "rotate-180" : ""}`} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-[calc(100%+8px)] right-0 bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] min-w-[200px] z-[999] overflow-hidden animate-[dropdownIn_0.15s_ease]">
                    <div className="pt-3.5 pb-3 px-4 border-b border-[#f1f5f9]">
                      <div className="text-sm font-bold text-[#1e293b]">{session?.user?.name || "User"}</div>
                      <div className="text-xs text-[#94a3b8] mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{session?.user?.email || ""}</div>
                    </div>
                    <Link href="/user/settings" className={`${dropdownItemBase} text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b]`} onClick={() => setShowProfileDropdown(false)}>
                      <FiUser size={15} />Profile & Settings
                    </Link>
                    <div className="h-px bg-[#f1f5f9]" />
                    <button type="button" className={`${dropdownItemBase} text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]`} onClick={() => signOut({ callbackUrl: "/" })}>
                      <FiLogOut size={15} />Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 px-8 py-7 overflow-y-auto min-w-0 max-lg:px-5 max-lg:pt-5 max-lg:pb-8 max-md:p-4 max-[480px]:p-3">
            {/* Search */}
            <div className="mb-7">
              <div className="relative max-w-full">
                <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                <input
                  type="text"
                  className="w-full py-3.5 pr-4 pl-12 border border-[#e2e8f0] rounded-xl bg-white text-sm text-[#1e293b] transition-all duration-200 outline-none placeholder:text-[#94a3b8] focus:border-[#C0392B] focus:shadow-[0_0_0_3px_rgba(192,57,43,0.08)]"
                  placeholder="Search for help articles, topics or keywords...."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-[1fr_320px] gap-6 max-[1200px]:grid-cols-[1fr_280px] max-lg:grid-cols-1">
              <div>
                <h2 className="text-base font-bold text-[#1e293b] tracking-[-0.2px] mb-4">How can we help you?</h2>
                <div className="grid grid-cols-3 gap-4 mb-7 max-[1200px]:grid-cols-2 max-md:grid-cols-1">
                  {helpCategories.map((cat) => (
                    <div
                      key={cat.title}
                      className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-start gap-3.5 cursor-pointer transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-[#cbd5e1] max-md:p-4"
                    >
                      <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl shrink-0" style={{ background: cat.bg, color: cat.color }}>
                        <cat.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#1e293b] mb-1">{cat.title}</div>
                        <div className="text-xs text-[#64748b] leading-normal">{cat.desc}</div>
                      </div>
                      <FiChevronRight size={16} className="text-[#94a3b8] shrink-0 mt-1" />
                    </div>
                  ))}
                </div>

                <div className="mb-7">
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-[#1e293b] tracking-[-0.2px]">Frequently Asked Questions</h3>
                    <Link href="/user/faqs" className="text-[13px] font-semibold text-[#6366f1] flex items-center gap-1 transition-all duration-200 shrink-0 hover:text-[#4f46e5] hover:gap-1.5">
                      View all FAQs <FiChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
                    {filteredFaqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-[#f1f5f9] last:border-b-0">
                        <button
                          type="button"
                          className="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors duration-150 border-0 bg-transparent w-full text-left text-sm font-medium text-[#334155] hover:bg-[#fafbfc] max-md:px-4 max-md:py-3.5 max-md:text-[13px]"
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        >
                          <span className="flex-1 min-w-0">{faq.q}</span>
                          {openFaq === idx ? (
                            <FiChevronUp size={16} className="text-[#94a3b8] shrink-0 transition-transform duration-200 rotate-180" />
                          ) : (
                            <FiChevronDown size={16} className="text-[#94a3b8] shrink-0 transition-transform duration-200" />
                          )}
                        </button>
                        {openFaq === idx && (
                          <div className="px-5 pb-4 text-[13px] text-[#64748b] leading-[1.7] animate-[fadeIn_0.2s_ease] max-md:px-4 max-md:pb-3.5">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                      <div className="p-5 text-center text-[#94a3b8] text-sm">
                        No results found for &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 max-md:p-4">
                  <div className="text-[15px] font-bold text-[#1e293b] mb-1">Contact Us</div>
                  <div className="text-xs text-[#64748b] mb-4">Can&apos;t Find you&apos;re looking for? We&apos;re here to help!</div>

                  {contactMethods.map((method) => (
                    <Link
                      key={method.label}
                      href={method.href}
                      className="flex items-center gap-3 py-3 border-b border-[#f1f5f9] transition-colors duration-150 cursor-pointer last:border-b-0 hover:bg-[#fafbfc] hover:-mx-5 hover:px-5"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#64748b] shrink-0">
                        <method.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#1e293b]">{method.label}</div>
                        <div className="text-xs text-[#64748b] mt-0.5">{method.desc}</div>
                      </div>
                      {method.status && (
                        <span className="text-[11px] font-semibold px-2 py-[3px] rounded-[10px] shrink-0" style={{ background: method.statusColor + "15", color: method.statusColor }}>
                          {method.status}
                        </span>
                      )}
                      <FiChevronRight size={14} className="text-[#94a3b8] shrink-0" />
                    </Link>
                  ))}
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 mt-4 max-md:p-4">
                  <div className="text-sm font-bold text-[#1e293b] mb-3 flex items-center gap-2">
                    <FiClock size={16} color="#6366f1" />
                    Support Hours
                  </div>
                  <div className="text-xs text-[#64748b] mb-3">
                    We are unavailable to assist you during the following hours:
                  </div>
                  {supportHours.map((h) => (
                    <div key={h.day} className="flex justify-between py-1.5 text-xs">
                      <span className="text-[#64748b]">{h.day}</span>
                      <span className="text-[#334155] font-medium">{h.time}</span>
                    </div>
                  ))}
                  <div className="mt-3 px-3 py-2.5 bg-[#f8fafc] rounded-lg text-xs text-[#64748b] flex items-center gap-2">
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
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-[fadeIn_0.2s_ease]"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-[420px] shadow-[0_25px_50px_rgba(0,0,0,0.25)] animate-[slideUp_0.25s_ease]" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-[14px] bg-[#fef2f2] flex items-center justify-center text-[#ef4444] mx-auto mb-5">
              <FiAlertCircle size={26} />
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
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
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