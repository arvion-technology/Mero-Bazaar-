"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FiBell, FiMenu, FiLogOut, FiArrowLeft, FiCheckCircle, FiXCircle, FiExternalLink,
} from "react-icons/fi";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { VendorKycFull as VendorKyc, AdminUserDetail } from "@/app/types/admin-user";
import { getStatusPill } from "@/app/types/admin-user_mappers";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

const PRIMARY = "#0f172a";
const SITE_PRIMARY = "#C0392B";
const BG = "#f8f5f5";

function kycRoute(status: VendorKyc["status"]) {
  if (status === "VERIFIED") return "verified";
  if (status === "REJECTED") return "rejected";
  return "unverified";
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const fetchUser = useCallback(async () => {
    if (!accessToken || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await r.json();
      if (!r.ok || data?.error) throw new Error(data?.message || "Failed to load user");
      setUser(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [accessToken, userId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchUser();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [fetchUser]);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const toggleActive = async () => {
    if (!session?.accessToken || !user) return;
    setUpdating(true);
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
      setUser((prev) => (prev ? { ...prev, isActive: data.isActive } : prev));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading user...
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
        .admin-section { padding: 24px 32px 32px; max-width: 760px; }
        .admin-back { display: inline-flex; align-items: center; gap: 6px; color: #64748b; font-size: 13px; font-weight: 600; background: none; border: none; cursor: pointer; margin-bottom: 16px; padding: 0; }
        .admin-back:hover { color: ${PRIMARY}; }
        .admin-card { background: #fff; border: 1px solid #e8e4e4; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
        .admin-card-title { font-size: 15px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 16px; }
        .admin-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .admin-row:last-child { border-bottom: none; }
        .admin-row-label { color: #94a3b8; }
        .admin-row-value { color: #1e293b; font-weight: 600; text-align: right; }
        .admin-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 4px; }
        .admin-user-name { font-size: 20px; font-weight: 700; color: ${PRIMARY}; }
        .admin-user-email { font-size: 13px; color: #94a3b8; margin-top: 2px; }
        .admin-toggle-btn { display: inline-flex; align-items: center; gap: 6px; border: 1px solid; border-radius: 8px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; background: #fff; white-space: nowrap; }
        .admin-toggle-active { color: #16a34a; border-color: #bbf7d0; }
        .admin-toggle-inactive { color: #dc2626; border-color: #fecaca; }
        .admin-kyc-link { display: inline-flex; align-items: center; gap: 6px; color: #818cf8; font-size: 13px; font-weight: 600; text-decoration: none; }
        .admin-kyc-link:hover { text-decoration: underline; }
        .admin-error { padding: 40px; text-align: center; color: #dc2626; background: #fff; border-radius: 12px; border: 1px solid #e8e4e4; }
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
          .admin-header-row { flex-direction: column; }
        }
      `}</style>

      <div className={`admin-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="admin-page">
        <AdminSidebar activeId="users" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <button type="button" className="admin-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><FiMenu size={20} /></button>
              <h1 className="admin-topbar-title">User Detail</h1>
            </div>
            <div className="admin-topbar-right">
              <AdminNotificationBell bg={BG} />
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
            <button className="admin-back" onClick={() => router.push("/admin/users")}>
              <FiArrowLeft size={14} /> Back to Users
            </button>

            {error ? (
              <div className="admin-error">{error}</div>
            ) : !user ? (
              <div className="admin-error">User not found.</div>
            ) : (
              <>
                <div className="admin-card">
                  <div className="admin-header-row">
                    <div>
                      <div className="admin-user-name">{user.name || "—"}</div>
                      <div className="admin-user-email">{user.email}</div>
                    </div>
                    <button
                      className={`admin-toggle-btn ${user.isActive ? "admin-toggle-inactive" : "admin-toggle-active"}`}
                      disabled={updating}
                      onClick={toggleActive}
                    >
                      {user.isActive ? <FiXCircle size={14} /> : <FiCheckCircle size={14} />}
                      {updating ? "…" : user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-title">Account Info</div>
                  <div className="admin-row"><span className="admin-row-label">Role</span><span className="admin-row-value">{user.role}</span></div>
                  <div className="admin-row"><span className="admin-row-label">Phone</span><span className="admin-row-value">{user.phone || user.vendorKyc?.contactNumber || "—"}</span></div>
                  <div className="admin-row"><span className="admin-row-label">Verified (email/phone)</span><span className="admin-row-value">{user.isVerified ? "Yes" : "No"}</span></div>
                  <div className="admin-row"><span className="admin-row-label">Joined</span><span className="admin-row-value">{new Date(user.createdAt).toLocaleDateString()}</span></div>
                  <div className="admin-row"><span className="admin-row-label">Status</span><span className="admin-row-value">{user.isActive ? "Active" : "Deactivated"}</span></div>
                </div>

                {user.vendorKyc && (
                  <div className="admin-card">
                    <div className="admin-card-title">Vendor KYC</div>
                    <div className="admin-row">
                      <span className="admin-row-label">Status</span>
                        <span className="admin-row-value">
                        {(() => { const s = getStatusPill(user.vendorKyc.status); return (
                            <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                            {user.vendorKyc.status}
                            </span>
                        ); })()}
                        </span>                    
                    </div>
                    <div className="admin-row"><span className="admin-row-label">Submitted</span><span className="admin-row-value">{new Date(user.vendorKyc.submittedAt).toLocaleDateString()}</span></div>
                    {user.vendorKyc.reviewedAt && (
                      <div className="admin-row"><span className="admin-row-label">Reviewed</span><span className="admin-row-value">{new Date(user.vendorKyc.reviewedAt).toLocaleDateString()}</span></div>
                    )}
                    {user.vendorKyc.rejectionReason && (
                      <div className="admin-row"><span className="admin-row-label">Rejection reason</span><span className="admin-row-value">{user.vendorKyc.rejectionReason}</span></div>
                    )}
                    <div style={{ marginTop: 14 }}>
                      <Link href={`/admin/${kycRoute(user.vendorKyc.status)}/${user.vendorKyc.id}`} className="admin-kyc-link">
                        View submitted documents <FiExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                )}

                {user.vendorProfile && (
                  <div className="admin-card">
                    <div className="admin-card-title">Vendor Profile</div>
                    <div className="admin-row"><span className="admin-row-label">Business name</span><span className="admin-row-value">{user.vendorProfile.businessName}</span></div>
                    <div className="admin-row"><span className="admin-row-label">Type</span><span className="admin-row-value">{user.vendorProfile.businessType}</span></div>
                    <div className="admin-row"><span className="admin-row-label">Rating</span><span className="admin-row-value">{(user.vendorProfile.rating ?? 0).toFixed(1)}</span></div>
                    <div className="admin-row"><span className="admin-row-label">Probation</span><span className="admin-row-value">{user.vendorProfile.isOnProbation ? "Yes" : "No"}</span></div>
                  </div>
                )}

                {user.doctorProfile && (
                  <div className="admin-card">
                    <div className="admin-card-title">Doctor Profile</div>
                    <div className="admin-row"><span className="admin-row-label">Name</span><span className="admin-row-value">{user.doctorProfile.doctorName}</span></div>
                    <div className="admin-row"><span className="admin-row-label">NMC License</span><span className="admin-row-value">{user.doctorProfile.nmcLicenseNumber}</span></div>
                    <div className="admin-row"><span className="admin-row-label">Specialization</span><span className="admin-row-value">{user.doctorProfile.specialization}</span></div>
                    <div className="admin-row">
                      <span className="admin-row-label">Verification</span>
                        <span className="admin-row-value">
                        {(() => { const s = getStatusPill(user.doctorProfile.verificationStatus); return (
                            <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                            {user.doctorProfile.verificationStatus}
                            </span>
                        ); })()}
                        </span>
                      </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}