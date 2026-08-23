"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiBell, FiChevronRight, FiMenu, FiLogOut } from "react-icons/fi";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { VendorKycRecord } from "../types/kyc";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

const PRIMARY = "#0f172a";
const SITE_PRIMARY = "#C0392B";
const BG = "#f8f5f5";
const CARD_BG = "#ffffff";
const PENDING_COLOR = "#f59e0b";

function StatIcon({ type, color }: { type: string; color: string }) {
  if (type === "check") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke={color} strokeWidth="2" fill="none" />
        <path d="M7 12l3 3 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (type === "x") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke={color} strokeWidth="2" fill="none" />
        <path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const { data: session } = useSession();

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const [recentKYCs, setRecentKYCs] = useState
    <{ id: string; name: string; initial: string; date: string; status: string; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;
    const headers = { Authorization: `Bearer ${session.accessToken}` };

    Promise.all([
      fetch("/api/vendor-kyc/admin/stats", { headers }).then((r) => (r.ok ? r.json() : null)) as Promise<typeof stats | null>,
      fetch("/api/vendor-kyc/admin/all?status=PENDING", { headers }).then((r) => (r.ok ? r.json() : [])) as Promise<VendorKycRecord[]>,
    ])
      .then(([statsData, kycRows]) => {
        if (statsData) setStats(statsData);
        setRecentKYCs(
          (kycRows ?? []).slice(0, 7).map((k: VendorKycRecord) => ({
            id: k.id,
            name: k.fullName || "Unknown",
            initial: (k.fullName?.[0] ?? "?").toUpperCase(),
            date: new Date(k.submittedAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            status: k.status,
            color: "#818cf8",
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-page { min-height: 100vh; background: ${BG}; display: flex; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .admin-main { flex: 1; margin-left: 240px; padding: 0; width: 100%; max-width: calc(100% - 240px); }
        .admin-topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; background: ${BG}; border-bottom: 1px solid #e8e4e4; flex-wrap: wrap; gap: 12px; }
        .admin-topbar-left { display: flex; align-items: center; gap: 12px; }
        .admin-topbar-title { font-size: 22px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.3px; }
        .admin-topbar-right { display: flex; align-items: center; gap: 16px; }
        .admin-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; display: flex; align-items: center; justify-content: center; color: #333; cursor: pointer; transition: all 0.2s; position: relative; }
        .admin-icon-btn:hover { background: #eee; }
        .admin-badge { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; background: ${SITE_PRIMARY}; color: #fff; font-size: 9px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid ${BG}; }

        .admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 24px 32px; }
        .admin-stat-card { background: ${CARD_BG}; border-radius: 12px; padding: 24px 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid #eee; transition: all 0.25s ease; width: 100%; text-decoration: none; cursor: pointer; }
        .admin-stat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .admin-stat-icon-wrap { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .admin-stat-value { font-size: 26px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.5px; }
        .admin-stat-label { font-size: 13px; color: #888; font-weight: 500; }

        .admin-section { padding: 0 32px 32px; }
        .admin-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
        .admin-section-title { font-size: 18px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.2px; }
        .admin-see-more { font-size: 13px; font-weight: 600; color: ${SITE_PRIMARY}; text-decoration: none; display: flex; align-items: center; gap: 4px; transition: gap 0.2s; flex-shrink: 0; padding: 6px 12px; border-radius: 8px; background: transparent; }
        .admin-see-more:hover { gap: 6px; background: #fee2e2; }

        .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 400px; }
        .admin-table th { text-align: left; padding: 14px 20px; font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e8e4e4; background: #faf8f8; }
        .admin-table td { padding: 14px 20px; font-size: 14px; color: #333; border-bottom: 1px solid #f0eeee; vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tbody tr { transition: background 0.15s; }
        .admin-table tbody tr:hover { background: #faf8f8; }
        .admin-name-cell { display: flex; align-items: center; gap: 12px; }
        .admin-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .admin-status { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #fffbeb; color: ${PENDING_COLOR}; }
        .admin-status-dot { width: 6px; height: 6px; border-radius: 50%; background: ${PENDING_COLOR}; }

        .admin-backdrop { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); backdrop-filter: blur(2px); z-index: 99; animation: backdropIn 0.2s ease; }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        .admin-hamburger { display: none; width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; align-items: center; justify-content: center; cursor: pointer; color: #64748b; flex-shrink: 0; }

        .admin-avatar-wrap { position: relative; }
        .admin-avatar-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: none; cursor: pointer; padding: 0; transition: all 0.2s; }
        .admin-avatar-btn:hover { transform: scale(1.05); }
        .admin-avatar-circle { width: 40px; height: 40px; border-radius: 50%; background: ${SITE_PRIMARY}; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; overflow: hidden; }
        .admin-avatar-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); min-width: 200px; z-index: 999; overflow: hidden; animation: dropdownIn 0.15s ease; }
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .admin-avatar-dropdown-header { padding: 14px 16px 12px; border-bottom: 1px solid #f1f5f9; }
        .admin-avatar-dropdown-name { font-size: 14px; font-weight: 700; color: #1e293b; }
        .admin-avatar-dropdown-email { font-size: 12px; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .admin-avatar-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 11px 16px; font-size: 14px; font-weight: 500; color: #475569; cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%; text-align: left; font-family: inherit; }
        .admin-avatar-dropdown-item:hover { background: #f8fafc; color: #1e293b; }
        .admin-avatar-dropdown-item.logout { color: #ef4444; }
        .admin-avatar-dropdown-item.logout:hover { background: #fef2f2; color: #dc2626; }

        @media (max-width: 1200px) {
          .admin-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 1023px) {
          .admin-backdrop.active { display: block; }
          .admin-hamburger { display: flex; }
          .admin-main { margin-left: 0 !important; max-width: 100% !important; }
          .admin-topbar { padding: 16px 20px; }
          .admin-stats { padding: 20px; }
          .admin-section { padding: 0 20px 24px; }
        }
        @media (max-width: 767px) {
          .admin-topbar { flex-direction: column; align-items: stretch; gap: 12px; padding: 16px; }
          .admin-topbar-left { justify-content: space-between; width: 100%; }
          .admin-topbar-right { justify-content: flex-end; width: 100%; }
          .admin-topbar-title { font-size: 18px; }
          .admin-stats { grid-template-columns: 1fr; gap: 12px; padding: 16px; }
          .admin-stat-card { padding: 18px 16px; flex-direction: row; align-items: center; gap: 16px; }
          .admin-stat-value { font-size: 22px; }
          .admin-section { padding: 0 16px 24px; }
          .admin-section-title { font-size: 16px; }
          .admin-table th, .admin-table td { padding: 12px 14px; font-size: 13px; }
          .admin-table-wrap { margin: 0 -16px; padding: 0 16px; width: calc(100% + 32px); }
          .admin-table { min-width: 360px; }
        }
        @media (max-width: 480px) {
          .admin-stat-card { padding: 14px; }
          .admin-stat-icon-wrap { width: 40px; height: 40px; }
          .admin-stat-value { font-size: 20px; }
          .admin-table th, .admin-table td { padding: 10px 12px; font-size: 12px; }
          .admin-avatar { width: 28px; height: 28px; font-size: 11px; }
          .admin-status { padding: 4px 10px; font-size: 11px; }
        }
      `}</style>

      <div
        className={`admin-backdrop ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="admin-page">
        <AdminSidebar activeId="dashboard" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <button type="button" className="admin-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <FiMenu size={20} />
              </button>
              <h1 className="admin-topbar-title">Admin Dashboard</h1>
            </div>
            <div className="admin-topbar-right">
              <AdminNotificationBell bg={BG} />
              <div className="admin-avatar-wrap">
                <button type="button" className="admin-avatar-btn" onClick={() => setShowAvatarDropdown((v) => !v)}>
                  <div className="admin-avatar-circle">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="avatar"
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                </button>
                {showAvatarDropdown && (
                  <div className="admin-avatar-dropdown">
                    <div className="admin-avatar-dropdown-header">
                      <div className="admin-avatar-dropdown-name">{session?.user?.name || "Admin"}</div>
                      <div className="admin-avatar-dropdown-email">{session?.user?.email || "admin@hamronepal.com"}</div>
                    </div>
                    <button type="button" className="admin-avatar-dropdown-item logout" onClick={() => signOut({ callbackUrl: "/" })}>
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="admin-stats">
            {[
              { label: "Total KYC", value: stats.total, icon: "user", color: "#818cf8", bg: "#eef2ff", href: "/admin" },
              { label: "Verified KYC", value: stats.verified, icon: "check", color: "#34d399", bg: "#ecfdf5", href: "/admin/verified" },
              { label: "Unverified KYC", value: stats.pending, icon: "user", color: "#fbbf24", bg: "#fffbeb", href: "/admin/unverified" },
              { label: "Rejected KYC", value: stats.rejected, icon: "x", color: "#f87171", bg: "#fef2f2", href: "/admin/rejected" },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} className="admin-stat-card">
                <div className="admin-stat-icon-wrap" style={{ background: stat.bg }}>
                  <StatIcon type={stat.icon} color={stat.color} />
                </div>
                <div>
                  <div className="admin-stat-value">{stat.value}</div>
                  <div className="admin-stat-label">{stat.label}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Recently Applied KYCs</h2>
              <Link href="/admin/unverified" className="admin-see-more">
                See More <FiChevronRight size={14} />
              </Link>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentKYCs.map((kyc) => (
                    <tr key={kyc.id}>
                      <td>
                        <div className="admin-name-cell">
                          <div className="admin-avatar" style={{ background: kyc.color }}>
                            {kyc.initial}
                          </div>
                          <span>{kyc.name}</span>
                        </div>
                      </td>
                      <td>{kyc.date}</td>
                      <td>
                        <span className="admin-status">
                          <span className="admin-status-dot" />
                          {kyc.status}
                        </span>
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