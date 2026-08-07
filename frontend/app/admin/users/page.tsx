"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { FiBell, FiMenu, FiLogOut, FiSearch, FiCheckCircle, FiXCircle } from "react-icons/fi";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import type { KycFilterStatus, UserRole, AdminUserRecord } from "@/app/types/admin-user";
import { getKycBadge } from "@/app/types/admin-user_mappers";

const PRIMARY = "#0f172a";
const SITE_PRIMARY = "#C0392B";
const BG = "#f8f5f5";

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [kycFilter, setKycFilter] = useState<KycFilterStatus | "">("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (kycFilter) params.set("kycStatus", kycFilter);

      const r = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await r.json();
      if (!r.ok || data?.error) throw new Error(data?.message || "Failed to load users");
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [accessToken, roleFilter, kycFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchUsers();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [fetchUsers]);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const toggleActive = async (user: AdminUserRecord) => {
    if (!session?.accessToken) return;
    setUpdatingId(user.id);
    try {
      const r = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = await r.json();
      if (!r.ok || data?.error) throw new Error(data?.message || "Failed to update status");
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: data.isActive } : u)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading Users...
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
        .admin-section { padding: 24px 32px 32px; }
        .admin-section-title { font-size: 18px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.2px; margin-bottom: 20px; }
        .admin-filters { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 20px; }
        .admin-search { position: relative; }
        .admin-search input { padding: 9px 12px 9px 34px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; width: 220px; }
        .admin-search svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .admin-select { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; background: #fff; }
        .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 400px; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e8e4e4; }
        .admin-table th { text-align: left; padding: 14px 20px; font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e8e4e4; background: #faf8f8; }
        .admin-table td { padding: 14px 20px; font-size: 14px; color: #333; border-bottom: 1px solid #f0eeee; vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tbody tr { transition: background 0.15s; }
        .admin-table tbody tr:hover { background: #faf8f8; }
        .admin-name-cell strong { display: block; font-weight: 600; color: #1e293b; }
        .admin-name-cell span { display: block; font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .admin-role-pill { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; background: #f1f5f9; color: #475569; }
        .admin-toggle-btn { display: inline-flex; align-items: center; gap: 6px; border: 1px solid; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; background: #fff; }
        .admin-toggle-active { color: #16a34a; border-color: #bbf7d0; }
        .admin-toggle-inactive { color: #dc2626; border-color: #fecaca; }
        .admin-empty, .admin-error { padding: 40px; text-align: center; color: #64748b; background: #fff; border-radius: 12px; border: 1px solid #e8e4e4; }
        .admin-error { color: #dc2626; }
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
        .admin-backdrop { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); backdrop-filter: blur(2px); z-index: 99; animation: backdropIn 0.2s ease; }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        .admin-hamburger { display: none; width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; align-items: center; justify-content: center; cursor: pointer; color: #64748b; flex-shrink: 0; }
        @media (max-width: 1023px) {
          .admin-backdrop.active { display: block; }
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
      `}</style>

      <div className={`admin-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="admin-page">
        <AdminSidebar activeId="users" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <button type="button" className="admin-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><FiMenu size={20} /></button>
              <h1 className="admin-topbar-title">Users</h1>
            </div>
            <div className="admin-topbar-right">
              <button type="button" className="admin-icon-btn"><FiBell size={20} /><span className="admin-badge">1</span></button>
              <div className="admin-avatar-wrap">
                <button type="button" className="admin-avatar-btn" onClick={() => setShowAvatarDropdown((v) => !v)}>
                  <div className="admin-avatar-circle">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
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
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">All Users ({filtered.length})</h2>

            <div className="admin-filters">
              <div className="admin-search">
                <FiSearch size={15} />
                <input placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="admin-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}>
                <option value="">All roles</option>
                <option value="USER">User</option>
                <option value="VENDOR">Vendor</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <select className="admin-select" value={kycFilter} onChange={(e) => setKycFilter(e.target.value as KycFilterStatus | "")}>
                <option value="">All KYC statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="NOT_SUBMITTED">Not submitted</option>
              </select>
            </div>

            {error ? (
              <div className="admin-error">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty">No users match these filters.</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Role</th><th>KYC</th><th>Joined</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => {
                      const badge = getKycBadge(u);
                      return (
                        <tr key={u.id}>
                          <td>
                            <Link href={`/admin/users/${u.id}`} className="admin-name-cell" style={{ textDecoration: "none" }}>
                              <strong>{u.name || "—"}</strong>
                              <span>{u.email}</span>
                            </Link>
                          </td>
                          <td><span className="admin-role-pill">{u.role}</span></td>
                          <td>
                            <span style={{ background: badge.bg, color: badge.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
                              {badge.label}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            {u.isActive ? (
                              <span style={{ color: "#16a34a", fontSize: 13, fontWeight: 600 }}>Active</span>
                            ) : (
                              <span style={{ color: "#dc2626", fontSize: 13, fontWeight: 600 }}>Deactivated</span>
                            )}
                          </td>
                          <td>
                            <button
                              className={`admin-toggle-btn ${u.isActive ? "admin-toggle-inactive" : "admin-toggle-active"}`}
                              disabled={updatingId === u.id}
                              onClick={() => toggleActive(u)}
                            >
                              {u.isActive ? <FiXCircle size={14} /> : <FiCheckCircle size={14} />}
                              {updatingId === u.id ? "…" : u.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}