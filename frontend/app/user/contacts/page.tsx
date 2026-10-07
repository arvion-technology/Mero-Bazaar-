"use client";

import { deleteAccountWithReauth } from "@/lib/accountActions";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { adaptLeadSentToContact, ClientMessage, LeadSent } from "@/lib/leads";
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
  FiClock,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";

const PRIMARY = "#C0392B";

type ContactRow = ClientMessage & { phone: string; today: boolean };

function adaptLeadSentToContactRow(lead: LeadSent): ContactRow {
  const base = adaptLeadSentToContact(lead);
  const phone =
    lead.listing?.user?.vendorKyc?.contactNumber ||
    lead.listing?.user?.phone ||
    "";
  const today = new Date(lead.createdAt).toDateString() === new Date().toDateString();
  return { ...base, phone, today };
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

const groupLabel = "mb-2.5 px-0.5 text-xs font-bold uppercase tracking-[1px] text-slate-400";
const card = "mb-6 w-full overflow-hidden rounded-xl border border-slate-200 bg-white";

export default function UserContacts() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const [search, setSearch] = useState("");

  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState(false);

  const { data: session } = useSession();
  const token = session?.accessToken;
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

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

  //profile avatar helper
  function getImageUrl(image?: string | null) {
  if (!image) return "";
  return image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
}

  // Recent Contacts
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch("/api/leads/mine/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data: LeadSent[] = await res.json();
        const rows = data.map(adaptLeadSentToContactRow);
        rows.sort(
          (a, b) =>
            new Date((data.find((d) => d.id === b.id)?.createdAt) ?? 0).getTime() -
            new Date((data.find((d) => d.id === a.id)?.createdAt) ?? 0).getTime()
        );
        setContacts(rows);
      } catch {
        setContacts([]);
        setContactsError(true);
      } finally {
        setContactsLoading(false);
      }
    })();
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

  // Prevent body scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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

  // Filtered contacts
  const filtered = contacts.filter((c) =>
    search === "" ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.msg.toLowerCase().includes(search.toLowerCase())
  );

  const todayContacts = filtered.filter((c) => c.today);
  const olderContacts = filtered.filter((c) => !c.today);

  const collapsedHide = sidebarCollapsed ? "lg:hidden" : "";
  const collapsedFade = sidebarCollapsed ? "lg:w-0 lg:overflow-hidden lg:opacity-0" : "";

  function renderRow(contact: ContactRow) {
    return (
      <div
        key={contact.id}
        className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-[#fafbfc] md:gap-3.5 md:px-5 md:py-3.5"
      >
        <div
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white md:h-11 md:w-11 md:text-sm"
          style={{ background: contact.color }}
        >
          {contact.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-[3px] flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            {contact.name}
            {contact.unread && <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-indigo-500" />}
          </div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-slate-500">
            {contact.msg}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-[3px] text-[11px] font-medium text-slate-400">
            <FiClock size={11} />
            {contact.time}
          </div>
          {contact.phone && (
            <div className="hidden items-center gap-1 text-xs text-slate-400 md:flex">
              <FiPhone size={11} />
              {contact.phone}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        html, body { overflow-x: hidden; max-width: 100vw; }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-[99] bg-[rgba(15,23,42,0.45)] backdrop-blur-[2px] ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="flex min-h-dvh bg-slate-100 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
        {/* Sidebar */}
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
                className={`${navItemBase} ${item.id === "contacts" ? navItemActive : navItemIdle}`}
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
                Recent Contacts
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
                          className={`flex items-center gap-2.5 px-4 py-3 text-[13px] text-slate-600 no-underline ${
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
                      <img src={getImageUrl(session.user.image)} alt="avatar" className="h-full w-full object-cover" />                    ) : (
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
                      className={`${ddItemBase} text-slate-600 hover:bg-slate-50 hover:text-slate-800`}
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
            {/* Search */}
            <div className="relative mb-6 max-w-full md:max-w-[400px]">
              <FiSearch size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full rounded-[10px] border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 font-[inherit] text-sm text-slate-800 outline-none transition-all duration-200 focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                placeholder="Search contacts by name, phone, or messages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {contactsLoading ? (
              <div className={card}>
                <div className="px-5 py-[60px] text-center text-slate-400">
                  <p className="text-sm">Loading contacts…</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className={card}>
                <div className="px-5 py-[60px] text-center text-slate-400">
                  <FiMessageSquare size={40} className="mx-auto mb-4 block opacity-40" />
                  <h3 className="mb-1.5 text-base font-semibold text-slate-500">
                    {contactsError ? "Couldn't load contacts" : "No contacts found"}
                  </h3>
                  <p className="text-sm">
                    {contactsError
                      ? "Something went wrong. Please try again later."
                      : search
                      ? "Try a different search term."
                      : "You haven't contacted any sellers yet."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {todayContacts.length > 0 && (
                  <>
                    <div className={groupLabel}>Today</div>
                    <div className={`${card} !mb-5`}>{todayContacts.map(renderRow)}</div>
                  </>
                )}
                {olderContacts.length > 0 && (
                  <>
                    <div className={groupLabel}>Earlier</div>
                    <div className={card}>{olderContacts.map(renderRow)}</div>
                  </>
                )}
              </>
            )}
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