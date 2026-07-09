"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FiGrid,
  FiCheckCircle,
  FiUser,
  FiBell,
  FiMenu,
  FiX,
  FiEye,
} from "react-icons/fi";
import StatusBadge from "@/components/StatusBadge";
import type { VendorKycRecord, KYCRow } from "@/app/types/kyc";
import { mapKycRow } from "@/app/types/kyc_mappers";

const PRIMARY = "#0f172a";
const SITE_PRIMARY = "#C0392B";
const BG = "#f8f5f5";
const SIDEBAR_BG = "#ffffff";
const SIDEBAR_BORDER = "#e8e4e4";
const SIDEBAR_HOVER = "#f4f4f4";

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

const sidebarItems = [
  { id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/admin" },
  { id: "verified", icon: FiCheckCircle, label: "Verified KYC", active: true },
  { id: "unverified", icon: FiUser, label: "Unverified List", href: "/admin/unverified" },
];

export default function VerifiedKYCPage() {
  const [activeTab, setActiveTab] = useState("verified");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [kycRows, setKycRows] = useState<KYCRow[]>([]);

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("/api/vendor-kyc/admin/all?status=VERIFIED", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: VendorKycRecord[]) => {
        setKycRows(rows.map(mapKycRow));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  function handleNavClick(id: string) {
    setActiveTab(id);
    setSidebarOpen(false);
  }

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading Verified KYCs...
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-page { min-height: 100vh; background: ${BG}; display: flex; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .admin-sidebar { width: 240px; background: ${SIDEBAR_BG}; display: flex; flex-direction: column; flex-shrink: 0; position: fixed; height: 100vh; left: 0; top: 0; z-index: 100; border-right: 1px solid ${SIDEBAR_BORDER}; }
        .admin-logo { padding: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid ${SIDEBAR_BORDER}; min-height: 72px; }
        .admin-logo-wrap { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .admin-logo-text-wrap { display: flex; flex-direction: column; line-height: 1.1; }
        .admin-logo-line1 { font-size: 16px; font-weight: 800; color: ${SITE_PRIMARY}; letter-spacing: -0.3px; }
        .admin-logo-line2 { font-size: 10px; font-weight: 700; color: #888; letter-spacing: 1.5px; text-transform: uppercase; }
        .admin-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
        .admin-nav-label { padding: 0 12px 12px; font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .admin-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: #555; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; border: none; background: none; width: 100%; text-align: left; font-family: inherit; border-radius: 8px; margin-bottom: 4px; text-decoration: none; }
        .admin-nav-item:hover { background: ${SIDEBAR_HOVER}; color: #1e293b; }
        .admin-nav-item.active { background: #fee2e2; color: ${SITE_PRIMARY}; font-weight: 600; }
        .admin-nav-icon { font-size: 18px; width: 22px; display: flex; justify-content: center; flex-shrink: 0; }
        .admin-sidebar-footer { padding: 16px; border-top: 1px solid ${SIDEBAR_BORDER}; display: flex; align-items: center; gap: 12px; }
        .admin-sidebar-avatar { width: 40px; height: 40px; border-radius: 50%; background: ${SITE_PRIMARY}; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .admin-sidebar-user { flex: 1; min-width: 0; }
        .admin-sidebar-name { font-size: 14px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .admin-sidebar-role { font-size: 11px; color: #888; margin-top: 2px; }
        .admin-main { flex: 1; margin-left: 240px; padding: 0; width: 100%; max-width: calc(100% - 240px); }
        .admin-topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; background: ${BG}; border-bottom: 1px solid #e8e4e4; flex-wrap: wrap; gap: 12px; }
        .admin-topbar-left { display: flex; align-items: center; gap: 12px; }
        .admin-topbar-title { font-size: 22px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.3px; }
        .admin-topbar-right { display: flex; align-items: center; gap: 16px; }
        .admin-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; display: flex; align-items: center; justify-content: center; color: #333; cursor: pointer; transition: all 0.2s; position: relative; }
        .admin-icon-btn:hover { background: #eee; }
        .admin-badge { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; background: ${SITE_PRIMARY}; color: #fff; font-size: 9px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid ${BG}; }
        .admin-section { padding: 24px 32px 32px; }
        .admin-section-title { font-size: 18px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.2px; margin-bottom: 20px; }
        .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 400px; }
        .admin-table th { text-align: left; padding: 14px 20px; font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e8e4e4; background: #faf8f8; }
        .admin-table td { padding: 14px 20px; font-size: 14px; color: #333; border-bottom: 1px solid #f0eeee; vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tbody tr { transition: background 0.15s; }
        .admin-table tbody tr:hover { background: #faf8f8; }
        .admin-name-cell { display: flex; align-items: center; gap: 12px; }
        .admin-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .admin-view-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; background: #eef2ff; color: #818cf8; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .admin-view-btn:hover { background: #818cf8; color: #fff; }
        .admin-backdrop { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); backdrop-filter: blur(2px); z-index: 99; animation: backdropIn 0.2s ease; }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        .admin-sidebar-close { display: none; position: absolute; top: 18px; right: 16px; width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 8px; cursor: pointer; align-items: center; justify-content: center; color: #64748b; z-index: 1; }
        .admin-hamburger { display: none; width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; align-items: center; justify-content: center; cursor: pointer; color: #64748b; flex-shrink: 0; }
        @media (max-width: 1023px) {
          .admin-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; width: 80% !important; max-width: 300px; z-index: 200; box-shadow: none; }
          .admin-sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.15); }
          .admin-backdrop.active { display: block; }
          .admin-sidebar.mobile-open .admin-sidebar-close { display: flex; }
          .admin-hamburger { display: flex; }
          .admin-main { margin-left: 0 !important; max-width: 100% !important; }
          .admin-topbar { padding: 16px 20px; }
          .admin-section { padding: 20px; }
        }
        @media (max-width: 767px) {
          .admin-topbar { flex-direction: column; align-items: stretch; gap: 12px; padding: 16px; }
          .admin-topbar-left { justify-content: space-between; width: 100%; }
          .admin-topbar-right { justify-content: flex-end; width: 100%; }
          .admin-topbar-title { font-size: 18px; }
          .admin-section { padding: 16px; }
          .admin-section-title { font-size: 16px; }
          .admin-table th, .admin-table td { padding: 12px 14px; font-size: 13px; }
          .admin-table-wrap { margin: 0 -16px; padding: 0 16px; width: calc(100% + 32px); }
          .admin-table { min-width: 360px; }
        }
        @media (max-width: 480px) {
          .admin-table th, .admin-table td { padding: 10px 12px; font-size: 12px; }
          .admin-avatar { width: 28px; height: 28px; font-size: 11px; }
        }
      `}</style>

      <div className={`admin-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="admin-page">
        <aside className={`admin-sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
          <button type="button" className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><FiX size={18} /></button>
          <div className="admin-logo">
            <Link href="/" className="admin-logo-wrap">
              <HamroBazarLogo size={36} />
              <div className="admin-logo-text-wrap">
                <span className="admin-logo-line1">HamroNepal</span>
                <span className="admin-logo-line2">Bazaar</span>
              </div>
            </Link>
          </div>
          <div className="admin-nav">
            <div className="admin-nav-label">Menu</div>
            {sidebarItems.map((item) => (
              item.href ? (
                <Link key={item.id} href={item.href} className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => handleNavClick(item.id)}>
                  <span className="admin-nav-icon"><item.icon size={18} /></span>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button type="button" key={item.id} className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => handleNavClick(item.id)}>
                  <span className="admin-nav-icon"><item.icon size={18} /></span>
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </div>
          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-avatar">{session?.user?.image ? <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : userInitials}</div>
            <div className="admin-sidebar-user">
              <div className="admin-sidebar-name">{session?.user?.name || "Admin"}</div>
              <div className="admin-sidebar-role">{session?.user?.email || "admin@hamronepal.com"}</div>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <button type="button" className="admin-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><FiMenu size={20} /></button>
              <h1 className="admin-topbar-title">Verified KYC</h1>
            </div>
            <div className="admin-topbar-right">
              <button type="button" className="admin-icon-btn"><FiBell size={20} /><span className="admin-badge">1</span></button>
            </div>
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">Verified KYC Applications</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Date</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {kycRows.map((kyc) => (
                    <tr key={kyc.id}>
                      <td>
                        <div className="admin-name-cell">
                          <div className="admin-avatar" style={{ background: kyc.color }}>{kyc.initial}</div>
                          <span>{kyc.name}</span>
                        </div>
                      </td>
                      <td>{kyc.date}</td>
                      <td><StatusBadge status={kyc.status} /></td>
                      <td>
                        <Link href={`/admin/verified/${kyc.id}`} className="admin-view-btn"><FiEye size={14} /> View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
