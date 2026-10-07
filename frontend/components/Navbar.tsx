"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { TbGridDots } from "react-icons/tb";
import { FiChevronDown, FiChevronRight, FiBell, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { activityLabel, isKnownActivity } from "@/lib/activityLabel";
import { useNotificationSocket } from "@/lib/notificationSocket";

const categories = [
  { name: "Vehicles", slug: "vehicles" },
  { name: "Jobs & Labour Hire", slug: "job" },
  { name: "Medical & Dental", slug: "medical" },
  { name: " Trades & Home Repair", slug: "trade-and-homerepair" },
  { name: "Rent & Real Estate", slug: "rent-and-real-estate" },
  { name: "Agriculture & Livestock", slug: "agriculture-and-livestock" },
  { name: "Secondhand Goods", slug: "secondhand" },
  { name: "Food & Home Delivery", slug: "food" },
  { name: "Hair, Beauty & Wellness", slug: "beauty" },
];

const navLinks = [
  { label: "Buy", href: "/buy" },
  {
    label: "Services", href: "/services"
  },
    { label: "Jobs", href: "/category/job" },
  { label: "Medical", href: "/category/medical" },
  { label: "Property", href: "/category/rent-and-real-estate" },
];

// const moreLinks = [
//   { label: "Labour Hire", href: "/category/labour-hire" },
//   { label: "Events", href: "/category/events" },
//   { label: "Home Services", href: "/category/home-services" },
//   { label: "Travel & Tourism", href: "/category/travel-tourism" },
// ];

const PRIMARY = "#C0392B";

// shared class strings
const btnBase =
  "flex items-center gap-[5px] py-[7px] px-[11px] rounded-md text-[13.5px] font-medium cursor-pointer bg-transparent border-0 whitespace-nowrap no-underline [transition:background_0.15s,color_0.15s] leading-none";
const btnIdle = "text-[#333] hover:bg-[#f5f5f5] hover:text-[#111]";
const btnActive = "text-[#C0392B] bg-[#fff5f5] hover:bg-[#fff5f5] hover:text-[#C0392B]";

const dropdownAnim = "animate-[fadeDown_0.15s_ease]";
const chevronBase = "[transition:transform_0.2s_ease] shrink-0";
const chevronOpen = "[transform:rotate(180deg)]";

const avatarImg = "w-full h-full object-cover";

const profileItemBase =
  "flex items-center gap-2.5 py-[9px] px-3 text-[13px] font-medium no-underline rounded-lg cursor-pointer [transition:background_0.15s,color_0.15s] border-0 bg-transparent w-full text-left";
const profileItemIdle = "text-[#444] hover:bg-[#fff5f5] hover:text-[#C0392B]";
const profileItemLogout = "text-[#d9534f] hover:bg-[#fdf2f2] hover:text-[#c9302c]";

const mobileLink =
  "block py-[11px] px-1 text-[14px] font-medium text-[#333] border-b border-[#f5f5f5] no-underline [transition:color_0.12s] hover:text-[#C0392B]";

type ActivityItem = { id: string; type: string; createdAt: string; read: boolean };
type UserNotif = { id: string; title: string; createdAt: string; read: boolean };

export default function Navbar() {
  const [showCategories, setShowCategories] = useState(false);
  // const [showMore, setShowMore] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCats, setShowMobileCats] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [openNotif, setOpenNotif] = useState(false);
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const router = useRouter();
  const [notifSeen, setNotifSeen] = useState(false);
  const [securityNotifs, setSecurityNotifs] = useState<ActivityItem[]>([]);
  const [userNotifs, setUserNotifs] = useState<UserNotif[]>([]);

  const catRef = useRef<HTMLDivElement>(null);
  // const moreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleAccountClick = () => {
    setShowProfileMenu(false);
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else if (session?.user?.role === "VENDOR") {
      router.push("/seller/dashboard");
    } else {
      router.push("/user/dashboard");
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCategories(false);
      // if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMore(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setOpenNotif(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //notification
  const profilePrompts = session
    ? ([
      !session.user?.phone && "Add your phone number",
      !session.user?.address && "Add your address",
    ].filter(Boolean) as string[])
    : [];

  const unreadCount =
    securityNotifs.filter((n) => !n.read).length + userNotifs.filter((n) => !n.read).length;

  const feed = [
    ...userNotifs.map((n) => ({
      key: `n-${n.id}`,
      text: n.title,
      createdAt: n.createdAt,
    })),
    ...securityNotifs.map((a) => ({
      key: `a-${a.id}`,
      text: activityLabel(a.type),
      createdAt: a.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const notificationCount = session ? profilePrompts.length + unreadCount : 0;
  const showNotificationBadge = notificationCount > 0;

  const [prevNotificationCount, setPrevNotificationCount] = useState(notificationCount);
  if (notificationCount !== prevNotificationCount) {
    setPrevNotificationCount(notificationCount);
    setNotifSeen(false);
  }

  function getImageUrl(image?: string | null) {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `${process.env.NEXT_PUBLIC_API_URL}${image}`;
  }

  //notification handler
  function loadAll() {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/user/notifications/security", { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ActivityItem[]) =>
        setSecurityNotifs((data ?? []).filter((a) => isKnownActivity(a.type)))
      )
      .catch(() => {});

    fetch("/api/user/notifications", { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: UserNotif[]) => setUserNotifs(data ?? []))
      .catch(() => {});
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useNotificationSocket(token, {
    onNotification: (n) =>
      setUserNotifs((prev) => (prev.some((x) => x.id === n.id) ? prev : [n, ...prev])),
    onSecurityEvent: (a) => {
      if (!isKnownActivity(a.type)) return;
      setSecurityNotifs((prev) => (prev.some((x) => x.id === a.id) ? prev : [a, ...prev]));
    },
    onConnect: loadAll,
  });

  function markAllRead() {
  if (!token) return;
  const headers = { Authorization: `Bearer ${token}` };

  if (securityNotifs.some((n) => !n.read)) {
    fetch("/api/user/notifications/security/mark-read", { method: "POST", headers })
      .then((res) => {
        if (!res.ok) return;
        setSecurityNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      })
      .catch(() => {});
  }

  if (userNotifs.some((n) => !n.read)) {
    fetch("/api/user/notifications/mark-all-read", { method: "POST", headers })
      .then((res) => {
        if (!res.ok) return;
        setUserNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      })
      .catch(() => {});
  }
}

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav className="w-full bg-white border-b border-[#e8e8e8] sticky top-0 z-[1000] [font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center h-[60px] gap-1.5">

          <Link href="/" className="flex items-center gap-[9px] no-underline shrink-0 mr-2">
            <svg className="w-[38px] h-[38px] shrink-0" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="leading-[1.15]">
              <span className="block text-[14px] font-extrabold text-[#C0392B] tracking-[-0.2px]">HamroNepal</span>
              <span className="block text-[14px] font-extrabold text-[#1a1a1a] tracking-[-0.2px]">Bazaar</span>
            </div>
          </Link>

          <div className="flex items-center ml-[150px] gap-0 flex-1 max-[900px]:!hidden">

            <div style={{ position: "relative" }} ref={catRef}>
              <button
                className={`${btnBase} ${showCategories ? btnActive : btnIdle}`}
                onClick={() => { setShowCategories(!showCategories); /* setShowMore(false); */ }}
              >
                <TbGridDots size={16} />
                Categories
                <FiChevronDown
                  size={13}
                  className={`${chevronBase} ${showCategories ? chevronOpen : ""}`}
                  color="#999"
                />
              </button>

              {showCategories && (
                <div className={`absolute top-[calc(100%+6px)] left-0 bg-white border border-[#ececec] rounded-xl z-[200] shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${dropdownAnim}`}>
                  <div className="grid grid-cols-2 gap-0.5 p-2.5 w-[300px]">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-[7px] py-[9px] px-2.5 rounded-lg text-[12.5px] font-medium text-[#333] no-underline cursor-pointer [transition:background_0.12s,color_0.12s] hover:bg-[#fff5f5] hover:text-[#C0392B]"
                        onClick={() => setShowCategories(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[#f0f0f0] py-[9px] px-4 text-center">
                    <Link
                      href="/categories"
                      className="text-[12px] font-semibold text-[#C0392B] no-underline inline-flex items-center gap-1 hover:underline"
                      onClick={() => setShowCategories(false)}
                    >
                      View All Categories
                      <FiChevronRight size={13} color={PRIMARY} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${btnBase} ${btnIdle}`}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ color: hoveredLink === link.href ? PRIMARY : undefined }}
              >
                {link.label}
              </Link>
            ))}

            {/* <div style={{ position: "relative" }} ref={moreRef}>
              <button
                className={`hnb-btn${showMore ? " active" : ""}`}
                onClick={() => { setShowMore(!showMore); setShowCategories(false); }}
              >
                More
                <FiChevronDown
                  size={13}
                  className={`hnb-chevron${showMore ? " open" : ""}`}
                  color="#999"
                />
              </button>

              {showMore && (
                <div className="hnb-more-dropdown">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="hnb-more-item"
                      onClick={() => setShowMore(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div> */}
          </div>

          {/* notifications */}
          <div className="flex items-center gap-3.5 ml-auto shrink-0 max-[900px]:!hidden">
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                className="relative bg-transparent border-0 cursor-pointer text-[#555] p-[5px] flex items-center rounded-full [transition:background_0.15s,color_0.15s] hover:bg-[#f5f5f5] hover:text-[#111]"
                aria-label="Notifications"
                onClick={() => {
                  if (!session) {
                    router.push("/register");
                    return;
                  }
                  setOpenNotif((v) => !v);
                  setNotifSeen(true);
                  if (!openNotif) markAllRead();
                }}
              >
                <FiBell size={20} />
                {session && showNotificationBadge && !notifSeen && (
                  <span className="absolute -top-1 -right-1 bg-[#e74c3c] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {notificationCount}
                  </span>
                )}
              </button>

              {session && openNotif && (
                <div className={`absolute top-[calc(100%+10px)] right-0 bg-white border border-[#ececec] rounded-xl z-[1000] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-[250px] p-2 ${dropdownAnim}`}>
                  <div className="pt-2 px-2.5 pb-2.5 text-[13px] font-semibold text-[#111] border-b border-[#f0f0f0] mb-1.5">
                    Notifications
                  </div>
                  {profilePrompts.length + feed.length > 0 ? (
                    <>
                      {profilePrompts.map((msg, i) => (
                        <div key={`p-${i}`} className="py-[9px] px-2.5 text-[12.5px] text-[#444] rounded-lg [transition:background_0.12s] hover:bg-[#fff5f5]">⚠️ {msg}</div>
                      ))}
                      {feed.map((item) => (
                        <div key={item.key} className="py-[9px] px-2.5 text-[12.5px] text-[#444] rounded-lg [transition:background_0.12s] hover:bg-[#fff5f5]">🔔 {item.text}</div>
                      ))}
                    </>
                  ) : (
                    <div className="py-4 px-2.5 text-[12.5px] text-[#888] text-center">You are all caught up</div>
                  )}
                </div>
              )}
            </div>

            {status === "loading" ? null : session ? (
              <div className="relative" ref={profileRef}>
                <button
                  className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#C0392B,#e74c3c)] text-white font-semibold text-[14px] flex items-center justify-center border-2 border-transparent cursor-pointer [transition:all_0.2s_ease] overflow-hidden p-0 shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:[transform:scale(1.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:border-[rgba(255,255,255,0.8)]"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="User profile menu"
                  aria-haspopup="true"
                  aria-expanded={showProfileMenu}
                >
                  {session.user?.image ? (
                    <img className={avatarImg} src={getImageUrl(session.user.image)} alt={session.user.name || "User"} />
                  ) : (
                    <span>{(session.user?.name?.[0] || "U").toUpperCase()}</span>
                  )}
                </button>

                {showProfileMenu && (
                  <div className={`absolute top-[calc(100%+10px)] right-0 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl z-[1000] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] w-[220px] p-2 ${dropdownAnim}`}>
                    <div className="pt-2.5 px-3 pb-3 border-b border-[#f0f0f0] mb-1.5">
                      <div className="text-[13.5px] font-semibold text-[#111] whitespace-nowrap overflow-hidden text-ellipsis">{session.user?.name || "User"}</div>
                      <div className="text-[11.5px] text-[#666] whitespace-nowrap overflow-hidden text-ellipsis mt-0.5">{session.user?.email || ""}</div>
                    </div>
                    <button onClick={handleAccountClick} className={`${profileItemBase} ${profileItemIdle}`}>
                      <FiUser size={15} />
                      My Account
                    </button>
                    <button
                      onClick={() => { setShowProfileMenu(false); signOut({ callbackUrl: "/" }); }}
                      className={`${profileItemBase} ${profileItemLogout}`}
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/register"
                className="bg-[#C0392B] !text-white border-0 rounded-lg py-2 px-[18px] text-[13.5px] font-semibold cursor-pointer whitespace-nowrap no-underline inline-block [transition:background_0.15s,transform_0.1s] tracking-[0.1px] hover:bg-[#a93226] hover:[transform:translateY(-1px)] active:[transform:translateY(0)]"
              >
                Signup
              </Link>
            )}
          </div>

          <button
            className="hidden ml-auto bg-transparent border-0 cursor-pointer p-2 text-[#444] rounded-md hover:bg-[#f5f5f5] max-[900px]:!flex"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="border-t border-[#f0f0f0] bg-white pt-2.5 px-4 pb-4">
            {navLinks.map((link) =>
              "dropdown" in link ? (
                <Link
                  key={link.label}
                  href="/services"
                  className={mobileLink}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={mobileLink}
                >
                  {link.label}
                </Link>
              )
            )}

            <button
              className="flex items-center justify-between w-full py-[11px] px-1 text-[14px] font-medium text-[#333] bg-transparent border-0 border-b border-[#f5f5f5] cursor-pointer"
              onClick={() => setShowMobileCats(!showMobileCats)}
            >
              All Categories
              <FiChevronDown
                size={14}
                color="#999"
                style={{ transform: showMobileCats ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </button>

            {showMobileCats && (
              <div style={{ paddingLeft: 4, paddingBottom: 4 }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block py-[7px] px-3 text-[13px] text-[#555] no-underline rounded-md [transition:background_0.12s,color_0.12s] hover:bg-[#fff5f5] hover:text-[#C0392B]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {session ? (
              <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 14, paddingTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingLeft: 4 }}>
                  <div
                    className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#C0392B,#e74c3c)] text-white font-semibold text-[14px] flex items-center justify-center border-2 border-transparent overflow-hidden p-0"
                    style={{ cursor: "default", transform: "none", boxShadow: "none" }}
                  >
                    {session.user?.image ? (
                      <img className={avatarImg} src={getImageUrl(session.user.image)} alt={session.user.name || "User"} />) : (
                      <span>
                        {(session.user?.name?.[0] || "U").toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{session.user?.name || "User"}</div>
                    <div style={{ fontSize: 11.5, color: "#666" }}>{session.user?.email || ""}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { setShowMobileMenu(false); handleAccountClick(); }}
                    className={mobileLink}
                    style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 500, color: "#333", border: "1px solid #ddd", borderRadius: 8, padding: "9px 0", textDecoration: "none", borderBottom: "1px solid #ddd" }}
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#fff", background: PRIMARY, borderRadius: 8, padding: "9px 0", border: "none", cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, paddingTop: 14 }}>
                <Link href="/register" style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#fff", background: PRIMARY, borderRadius: 8, padding: "9px 0", textDecoration: "none" }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}