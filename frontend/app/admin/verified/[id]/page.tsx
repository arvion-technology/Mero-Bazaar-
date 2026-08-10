"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiBell, FiChevronRight, FiMenu } from "react-icons/fi";
import AdminSidebar from "@/components/admin/AdminSidebar";
import KYCDetailsContent from "@/components/KYCDetailsContent";
import type { VendorKycDetail, MappedKycDetail } from "@/app/types/kyc";
import { mapKycDetail } from "@/app/types/kyc_mappers";

const SITE_PRIMARY = "#C0392B";
const BG = "#f8f5f5";
const PRIMARY = "#0f172a";

export default function VerifiedKYCDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [kyc, setKyc] = useState<MappedKycDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.accessToken || !id) return;
    fetch(`/api/vendor-kyc/admin/${id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: VendorKycDetail | null) => setKyc(data ? mapKycDetail(data) : null))
      .catch(() => setKyc(null))
      .finally(() => setLoading(false));
  }, [session?.accessToken, id]);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const sharedStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .admin-page { min-height: 100vh; background: ${BG}; display: flex; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .admin-main { flex: 1; margin-left: 240px; padding: 0; width: 100%; max-width: calc(100% - 240px); }
    .admin-topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; background: ${BG}; border-bottom: 1px solid #e8e4e4; flex-wrap: wrap; gap: 12px; }
    .admin-topbar-left { display: flex; align-items: center; gap: 12px; }
    .admin-topbar-title { font-size: 22px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.3px; }
    .admin-topbar-right { display: flex; align-items: center; gap: 16px; }
    .admin-back-link { display: flex; align-items: center; gap: 6px; color: #666; font-size: 14px; text-decoration: none; padding: 6px 12px; border-radius: 8px; transition: all 0.2s; }
    .admin-back-link:hover { background: #eee; color: ${SITE_PRIMARY}; }
    .admin-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; display: flex; align-items: center; justify-content: center; color: #333; cursor: pointer; transition: all 0.2s; position: relative; }
    .admin-icon-btn:hover { background: #eee; }
    .admin-badge { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; background: ${SITE_PRIMARY}; color: #fff; font-size: 9px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid ${BG}; }
    .admin-backdrop { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); backdrop-filter: blur(2px); z-index: 99; }
    .admin-backdrop.active { display: block; }
    .admin-hamburger { display: none; width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; align-items: center; justify-content: center; cursor: pointer; color: #64748b; flex-shrink: 0; }
    @media (max-width: 1023px) { .admin-backdrop.active { display: block; } .admin-hamburger { display: flex; } .admin-main { margin-left: 0 !important; max-width: 100% !important; } }
  `;

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading KYC Details...
      </div>
    );
  }

  if (!kyc) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className={`admin-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        <div className="admin-page">
          <AdminSidebar activeId="verified" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="admin-main">
            <div className="admin-topbar">
              <div className="admin-topbar-left">
                <button type="button" className="admin-hamburger" onClick={() => setSidebarOpen(true)}><FiMenu size={20} /></button>
                <h1 className="admin-topbar-title">KYC Not Found</h1>
              </div>
              <div className="admin-topbar-right">
                <button type="button" className="admin-icon-btn"><FiBell size={20} /><span className="admin-badge">1</span></button>
              </div>
            </div>
            <div style={{ padding: "32px" }}><h2>KYC record not found</h2></div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{sharedStyles}</style>
      <div className={`admin-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="admin-page">
        <AdminSidebar activeId="verified" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <button type="button" className="admin-hamburger" onClick={() => setSidebarOpen(true)}><FiMenu size={20} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link href="/admin/verified" className="admin-back-link">
                  <FiChevronRight size={16} style={{ transform: "rotate(180deg)" }} /> Back
                </Link>
                <h1 className="admin-topbar-title">KYC Details</h1>
              </div>
            </div>
            <div className="admin-topbar-right">
              <button type="button" className="admin-icon-btn"><FiBell size={20} /><span className="admin-badge">1</span></button>
            </div>
          </div>

          <KYCDetailsContent kyc={kyc} pageType="verified" />
        </main>
      </div>
    </>
  );
}