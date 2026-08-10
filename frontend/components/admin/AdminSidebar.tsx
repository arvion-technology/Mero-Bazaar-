"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FiGrid,
  FiCheckCircle,
  FiUser,
  FiXCircle,
  FiX,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiFlag,
  FiList,
} from "react-icons/fi";
import type { IconType } from "react-icons";

const SITE_PRIMARY = "#C0392B";
const SIDEBAR_BG = "#ffffff";
const SIDEBAR_BORDER = "#e8e4e4";
const SIDEBAR_HOVER = "#f4f4f4";

// Single source of truth for admin nav — add new sections here only.
export type AdminNavId =
  | "dashboard"
  | "verified"
  | "unverified"
  | "rejected"
  | "users"
  | "payments"
  | "listings"
  | "reports"
  | "flags";

type NavItem = {
  id: AdminNavId;
  icon: IconType;
  label: string;
  href: string;
};

type NavGroup = {
  label: string | null;
  items: NavItem[];
};

export const ADMIN_NAV: NavGroup[] = [
  {
    label: null,
    items: [{ id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/admin" }],
  },
  {
    label: "Seller Verification",
    items: [
      { id: "verified", icon: FiCheckCircle, label: "Verified KYC", href: "/admin/verified" },
      { id: "unverified", icon: FiUser, label: "Unverified List", href: "/admin/unverified" },
      { id: "rejected", icon: FiXCircle, label: "Rejected List", href: "/admin/rejected" },
    ],
  },
    {
    label: "Catalog",
    items: [
      { id: "listings", icon: FiList, label: "Listings", href: "/admin/listings" },
    ],
  },
  {
    label: "User Management",
    items: [
      { id: "users", icon: FiUsers, label: "Users", href: "/admin/users" },
      { id: "payments", icon: FiDollarSign, label: "Payments", href: "/admin/payments" },
    ],
  },
  {
    label: "Moderation",
    items: [
      { id: "reports", icon: FiFileText, label: "Reports", href: "/admin/reports" },
      { id: "flags", icon: FiFlag, label: "Flags", href: "/admin/flags" },
    ],
  },
];

function HamroBazarLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="38" rx="8" fill={SITE_PRIMARY} />
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
  );
}

export default function AdminSidebar({
  activeId,
  sidebarOpen,
  onClose,
}: {
  activeId: AdminNavId;
  sidebarOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <>
      <style>{`
        .admin-sidebar { width: 240px; background: ${SIDEBAR_BG}; display: flex; flex-direction: column; flex-shrink: 0; position: fixed; height: 100vh; left: 0; top: 0; z-index: 100; border-right: 1px solid ${SIDEBAR_BORDER}; }
        .admin-logo { padding: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid ${SIDEBAR_BORDER}; min-height: 72px; }
        .admin-logo-wrap { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .admin-logo-text-wrap { display: flex; flex-direction: column; line-height: 1.1; }
        .admin-logo-line1 { font-size: 16px; font-weight: 800; color: ${SITE_PRIMARY}; letter-spacing: -0.3px; }
        .admin-logo-line2 { font-size: 10px; font-weight: 700; color: #888; letter-spacing: 1.5px; text-transform: uppercase; }
        .admin-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
        .admin-nav-group { margin-bottom: 4px; }
        .admin-nav-label { padding: 16px 12px 8px; font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .admin-nav-group:first-child .admin-nav-label { padding-top: 0; }
        .admin-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: #555; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; border: none; background: none; width: 100%; text-align: left; font-family: inherit; border-radius: 8px; margin-bottom: 2px; text-decoration: none; position: relative; }
        .admin-nav-item:hover { background: ${SIDEBAR_HOVER}; color: #1e293b; }
        .admin-nav-item.active { background: #fee2e2; color: ${SITE_PRIMARY}; font-weight: 600; }
        .admin-nav-item.active::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; background: ${SITE_PRIMARY}; border-radius: 0 3px 3px 0; }
        .admin-nav-icon { font-size: 18px; width: 22px; display: flex; justify-content: center; flex-shrink: 0; }
        .admin-sidebar-footer { padding: 16px; border-top: 1px solid ${SIDEBAR_BORDER}; display: flex; align-items: center; gap: 12px; }
        .admin-sidebar-avatar { width: 40px; height: 40px; border-radius: 50%; background: ${SITE_PRIMARY}; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; flex-shrink: 0; overflow: hidden; }
        .admin-sidebar-user { flex: 1; min-width: 0; }
        .admin-sidebar-name { font-size: 14px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .admin-sidebar-role { font-size: 11px; color: #888; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .admin-sidebar-close { display: none; position: absolute; top: 18px; right: 16px; width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 8px; cursor: pointer; align-items: center; justify-content: center; color: #64748b; z-index: 1; }
        @media (max-width: 1023px) {
          .admin-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; width: 80% !important; max-width: 300px; z-index: 200; box-shadow: none; }
          .admin-sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.15); }
          .admin-sidebar.mobile-open .admin-sidebar-close { display: flex; }
        }
      `}</style>

      <aside className={`admin-sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Close sidebar">
          <FiX size={18} />
        </button>

        <div className="admin-logo">
          <Link href="/admin" className="admin-logo-wrap">
            <HamroBazarLogo size={36} />
            <div className="admin-logo-text-wrap">
              <span className="admin-logo-line1">HamroNepal</span>
              <span className="admin-logo-line2">Bazaar</span>
            </div>
          </Link>
        </div>

        <div className="admin-nav">
          {ADMIN_NAV.map((group, gi) => (
            <div className="admin-nav-group" key={gi}>
              {group.label && <div className="admin-nav-label">{group.label}</div>}
              {group.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`admin-nav-item ${isActive ? "active" : ""}`}
                    onClick={onClose}
                  >
                    <span className="admin-nav-icon"><item.icon size={18} /></span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}