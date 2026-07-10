"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { TbGridDots } from "react-icons/tb";
import { FiChevronDown, FiChevronRight, FiBell, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

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
  { label: "Services", href: "/services" },
  { label: "Jobs", href: "/category/job" },
  { label: "Medical", href: "/category/medical" },
  { label: "Property", href: "/category/rent-and-real-estate" },
];

const moreLinks = [
  { label: "Labour Hire", href: "/category/labour-hire" },
  { label: "Events", href: "/category/events" },
  { label: "Home Services", href: "/category/home-services" },
  { label: "Travel & Tourism", href: "/category/travel-tourism" },
];

const PRIMARY = "#C0392B";

export default function Navbar() {
  const [showCategories, setShowCategories] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCats, setShowMobileCats] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [openNotif, setOpenNotif] = useState(false);
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const router = useRouter();
  const [notifSeen, setNotifSeen] = useState(false);
  const [securityNotifs, setSecurityNotifs] = useState<{ id: string; type: string; createdAt: string; read: boolean }[]>([]);

  const catRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
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
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMore(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setOpenNotif(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //notification
  const notifications = session
    ? ([
        !session.user?.phone && "Add your phone number",
        !session.user?.address && "Add your address",
        ...securityNotifs.filter((n) => !n.read).map((n) => activityLabel(n.type)),
      ].filter(Boolean) as string[])
    : [];

  const notificationCount = notifications.length;
  const showNotificationBadge = notificationCount > 0;

  const [prevNotificationCount, setPrevNotificationCount] = useState(notificationCount);
  if (notificationCount !== prevNotificationCount) {
    setPrevNotificationCount(notificationCount);
    setNotifSeen(false);
  }

  function activityLabel(type: string) {
    switch (type) {
      case "PASSWORD_CHANGED": return "Password chnaged";
      case "TWO_FA_ENABLED": return "Two-factor authentication enabled";
      case "TWO_FA_DISABLED": return "Two-factor authentication disabled";
      case "PHONE_CHANGED": return "Phone number changed";
      default: return type;
    }
  }

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

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .hnb-nav {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e8e8e8;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .hnb-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          height: 60px;
          gap: 6px;
        }
        .hnb-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 8px;
        }
        .hnb-logo-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
        }
        .hnb-logo-text { line-height: 1.15; }
        .hnb-logo-line1 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: ${PRIMARY};
          letter-spacing: -0.2px;
        }
        .hnb-logo-line2 {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.2px;
        }
        .hnb-links {
          display: flex;
          align-items: center;
          margin-left: 150px;
          gap: 0;
          flex: 1;
        }
        .hnb-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 11px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          background: none;
          border: none;
          white-space: nowrap;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          line-height: 1;
        }
        .hnb-btn:hover { background: #f5f5f5; color: #111; }
        .hnb-btn.active { color: ${PRIMARY}; background: #fff5f5; }
        .hnb-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 12px;
          z-index: 200;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          animation: fadeDown 0.15s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hnb-cat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          padding: 10px;
          width: 300px;
        }
        .hnb-cat-item {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .hnb-cat-item:hover { background: #fff5f5; color: ${PRIMARY}; }
        .hnb-view-all {
          border-top: 1px solid #f0f0f0;
          padding: 9px 16px;
          text-align: center;
        }
        .hnb-view-all-link {
          font-size: 12px;
          font-weight: 600;
          color: ${PRIMARY};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .hnb-view-all-link:hover { text-decoration: underline; }
        .hnb-more-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 12px;
          z-index: 200;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          padding: 6px;
          width: 175px;
          animation: fadeDown 0.15s ease;
        }
        .hnb-more-item {
          display: block;
          padding: 9px 12px;
          font-size: 13px;
          color: #444;
          text-decoration: none;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .hnb-more-item:hover { background: #fff5f5; color: ${PRIMARY}; }
        .hnb-right {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .hnb-seller {
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .hnb-seller:hover { color: ${PRIMARY}; }
        .hnb-bell {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: #555;
          padding: 5px;
          display: flex;
          align-items: center;
          border-radius: 50%;
          transition: background 0.15s, color 0.15s;
        }
        .hnb-bell:hover { background: #f5f5f5; color: #111; }
        .hnb-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #e74c3c;
          color: #fff;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .hnb-notif-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 12px;
          z-index: 1000;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          width: 250px;
          padding: 8px;
          animation: fadeDown 0.15s ease;
        }
        .hnb-notif-header {
          padding: 8px 10px 10px;
          font-size: 13px;
          font-weight: 600;
          color: #111;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 6px;
        }
        .hnb-notif-item {
          padding: 9px 10px;
          font-size: 12.5px;
          color: #444;
          border-radius: 8px;
          transition: background 0.12s;
        }
        .hnb-notif-item:hover { background: #fff5f5; }
        .hnb-notif-empty {
          padding: 16px 10px;
          font-size: 12.5px;
          color: #888;
          text-align: center;
        }
        .hnb-login {
          background: ${PRIMARY};
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.1px;
        }
        .hnb-login:hover { background: #a93226; transform: translateY(-1px); }
        .hnb-login:active { transform: translateY(0); }
        .hnb-chevron {
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .hnb-chevron.open { transform: rotate(180deg); }
        .hnb-hamburger {
          display: none;
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #444;
          border-radius: 6px;
        }
        .hnb-hamburger:hover { background: #f5f5f5; }
        .hnb-mobile-menu {
          border-top: 1px solid #f0f0f0;
          background: #fff;
          padding: 10px 16px 16px;
        }
        .hnb-mobile-link {
          display: block;
          padding: 11px 4px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          border-bottom: 1px solid #f5f5f5;
          text-decoration: none;
          transition: color 0.12s;
        }
        .hnb-mobile-link:hover { color: ${PRIMARY}; }
        .hnb-mobile-cats-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 11px 4px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          background: none;
          border: none;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
        }
        .hnb-mobile-sub-link {
          display: block;
          padding: 7px 12px;
          font-size: 13px;
          color: #555;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.12s, color 0.12s;
        }
        .hnb-mobile-sub-link:hover { background: #fff5f5; color: ${PRIMARY}; }

        /* Profile Dropdown & Avatar Styles */
        .hnb-profile-container {
          position: relative;
        }
        .hnb-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${PRIMARY}, #e74c3c);
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
          padding: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .hnb-avatar-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          border-color: rgba(255,255,255,0.8);
        }
        .hnb-avatar-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hnb-profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          z-index: 1000;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          width: 220px;
          padding: 8px;
          animation: fadeDown 0.15s ease;
        }
        .hnb-profile-header {
          padding: 10px 12px 12px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 6px;
        }
        .hnb-profile-header-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #111;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hnb-profile-header-email {
          font-size: 11.5px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }
        .hnb-profile-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 500;
          color: #444;
          text-decoration: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .hnb-profile-item:hover {
          background: #fff5f5;
          color: ${PRIMARY};
        }
        .hnb-profile-item.logout {
          color: #d9534f;
        }
        .hnb-profile-item.logout:hover {
          background: #fdf2f2;
          color: #c9302c;
        }

        @media (max-width: 900px) {
          .hnb-links { display: none !important; }
          .hnb-right  { display: none !important; }
          .hnb-hamburger { display: flex !important; }
        }
      `}</style>

      <nav className="hnb-nav">
        <div className="hnb-inner">

          <Link href="/" className="hnb-logo">
            <svg className="hnb-logo-icon" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="hnb-logo-text">
              <span className="hnb-logo-line1">HamroNepal</span>
              <span className="hnb-logo-line2">Bazaar</span>
            </div>
          </Link>

          <div className="hnb-links">

            <div style={{ position: "relative" }} ref={catRef}>
              <button
                className={`hnb-btn${showCategories ? " active" : ""}`}
                onClick={() => { setShowCategories(!showCategories); setShowMore(false); }}
              >
                <TbGridDots size={16} />
                Categories
                <FiChevronDown
                  size={13}
                  className={`hnb-chevron${showCategories ? " open" : ""}`}
                  color="#999"
                />
              </button>

              {showCategories && (
                <div className="hnb-dropdown">
                  <div className="hnb-cat-grid">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="hnb-cat-item"
                        onClick={() => setShowCategories(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="hnb-view-all">
                    <Link href="/categories" className="hnb-view-all-link" onClick={() => setShowCategories(false)}>
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
                className="hnb-btn"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ color: hoveredLink === link.href ? PRIMARY : undefined }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ position: "relative" }} ref={moreRef}>
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
            </div>
          </div>

          {/* notifications */}
          <div className="hnb-right">
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                className="hnb-bell"
                aria-label="Notifications"
                onClick={() => {
                  if (!session) {
                    router.push("/register");
                    return;
                  }
                  setOpenNotif((v) => !v);
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
                <FiBell size={20} />
                {session && showNotificationBadge && !notifSeen && (
                  <span className="hnb-badge">{notificationCount}</span>
                )}
              </button>

              {session && openNotif && (
                <div className="hnb-notif-dropdown">
                  <div className="hnb-notif-header">Notifications</div>
                  {notifications.length > 0 ? (
                    notifications.map((msg, i) => (
                      <div key={i} className="hnb-notif-item">⚠️ {msg}</div>
                    ))
                  ) : (
                    <div className="hnb-notif-empty">You are all caught up</div>
                  )}
                </div>
              )}
            </div>

            {status === "loading" ? null : session ? (
              <div className="hnb-profile-container" ref={profileRef}>
                <button 
                  className="hnb-avatar-btn" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="User profile menu"
                  aria-haspopup="true"
                  aria-expanded={showProfileMenu}
                >
                  {session.user?.image ? (
                    <img src={getImageUrl(session.user.image)} alt={session.user.name || "User"} />
                  ) : (
                    <span>{(session.user?.name?.[0] || "U").toUpperCase()}</span>
                  )}
                </button>

                {showProfileMenu && (
                  <div className="hnb-profile-dropdown">
                    <div className="hnb-profile-header">
                      <div className="hnb-profile-header-name">{session.user?.name || "User"}</div>
                      <div className="hnb-profile-header-email">{session.user?.email || ""}</div>
                    </div>
                    <button onClick={handleAccountClick} className="hnb-profile-item">
                      <FiUser size={15} />
                      My Account
                    </button>
                    <button 
                      onClick={() => { setShowProfileMenu(false); signOut({ callbackUrl: "/" }); }}
                      className="hnb-profile-item logout"
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/register" className="hnb-login">Signup</Link>
            )}
          </div>

          <button
            className="hnb-hamburger"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="hnb-mobile-menu">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hnb-mobile-link">
                {link.label}
              </Link>
            ))}

            <button className="hnb-mobile-cats-btn" onClick={() => setShowMobileCats(!showMobileCats)}>
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
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="hnb-mobile-sub-link">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {session ? (
              <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 14, paddingTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingLeft: 4 }}>
                  <div className="hnb-avatar-btn" style={{ cursor: "default", transform: "none", boxShadow: "none" }}>
                    {session.user?.image ? (
                      <img src={getImageUrl(session.user.image)} alt={session.user.name || "User"} />                    ) : (
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
                    className="hnb-mobile-link"
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
