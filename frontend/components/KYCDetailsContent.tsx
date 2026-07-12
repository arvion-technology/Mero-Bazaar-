"use client";

import Link from "next/link";
import { FiChevronRight, FiEdit3 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const SITE_PRIMARY = "#C0392B";
const PRIMARY = "#0f172a";

interface KYCRecord {
  id: string;
  name: string;
  initial: string;
  color: string;
  date: string;
  status: "Pending" | "Verified" | "Rejected";
  appliedOn: string;
  birthdate: string;
  panNumber: string;
  phone: string;
  address: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  avatar?: string;
  rejectionReason?: string;
  panCardUrl?: string | null;
  photoUrl?: string | null;
  selfieWithPanUrl?: string | null;
}

interface KYCDetailsContentProps {
  kyc: KYCRecord | undefined;
  pageType: "verified" | "pending" | "rejected";
}

export default function KYCDetailsContent({ kyc, pageType }: KYCDetailsContentProps) {
  const { data: session } = useSession();
  const [docPreviews, setDocPreviews] = useState<{panCardUrl?: string; photoUrl?: string; selfieWithPanUrl?: string;}>({});

  useEffect(() => {
    const token = session?.accessToken;
    if (!token || !kyc) return;

    let revoke: string[] = [];

    const loadDoc = async (filename: string | null | undefined, key: "panCardUrl" | "photoUrl" | " selfieWithPanUrl") => {
      if (!filename) return;
      try {
        const res = await fetch(`/api/vendor-kyc/admin/document/${filename}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Admin doc fetch failed", filename, res.status);
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        revoke.push(url);
        setDocPreviews((prev) => ({ ...prev, [key]: url }));
      } catch (e) {
        console.error("Admin doct fetch threw", filename, e);
      }
    };
    loadDoc(kyc.panCardUrl, "panCardUrl");
    loadDoc(kyc.photoUrl, "photoUrl");
    loadDoc(kyc.selfieWithPanUrl, "selfieWithPanUrl");

    return () => {
      revoke.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [session?.accessToken, kyc]);
  

  if (!kyc) {
    return (
      <div style={{ padding: "32px" }}>
        <h2 style={{ color: "#333", fontSize: "18px" }}>KYC record not found</h2>
      </div>
    );
  }

  const DocumentPlaceholder = ({ label, src }: { label: string; src?: string }) => (
    <div style={{ textAlign: "center" as const }}>
      <div
        style={{
          width: "100%",
          height: "200px",
          background: "#c4b5b5",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
          overflow: "hidden",
        }}
      >
        {src ? ( <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ color: "#fff", fontSize: "12px", opacity: 0.7 }}>No Image</span>
        )}

      </div>
      <button
        type="button" disabled={!src} onClick={() => src && window.open(src, "_blank")}
        style={{
          background: "none",
          border: "none",
          color: "#6366f1",
          fontSize: "13px",
          cursor: src ? "pointer" : "default",
          fontWeight: 500,
          opacity: src ? 1 : 0.5,
        }}
      >
        View Full Size
      </button>
    </div>
  );

  const InfoRow = ({ label, value, badge }: { label: string; value: string; badge?: React.ReactNode }) => (
    <div style={{ display: "contents" }}>
      <div
        style={{
          padding: "14px 20px",
          fontSize: "13px",
          color: "#888",
          fontWeight: 500,
          background: "#faf8f8",
          borderBottom: "1px solid #f0eeee",
          display: "flex",
          alignItems: "center",
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: "14px 20px",
          fontSize: "14px",
          color: "#333",
          fontWeight: 500,
          borderBottom: "1px solid #f0eeee",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {value}
        {badge}
      </div>
    </div>
  );

  const PhoneVerifiedBadge = () => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 600,
        background: "#dcfce7",
        color: "#16a34a",
      }}
    >
      Verified
    </span>
  );

  return (
    <>
      <style>{`
        .kyc-section { padding: 24px 32px 32px; max-width: 900px; }
        .kyc-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #666; margin-bottom: 24px; }
        .kyc-breadcrumb a { color: #666; text-decoration: none; }
        .kyc-breadcrumb a:hover { color: ${SITE_PRIMARY}; }
        .kyc-breadcrumb-current { color: #6366f1; font-weight: 500; }
        .kyc-breadcrumb-separator { color: #999; }
        
        .kyc-profile-header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .kyc-avatar-wrap { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .kyc-profile-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; display: block; }
        .kyc-profile-avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; font-weight: 700; }
        .kyc-verified-badge { 
          position: absolute; 
          bottom: -2px; 
          right: -6px; 
          display: inline-flex; 
          align-items: center; 
          gap: 4px; 
          padding: 3px 10px; 
          border-radius: 20px; 
          font-size: 11px; 
          font-weight: 600; 
          background: #dcfce7; 
          color: #16a34a; 
          white-space: nowrap;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .kyc-card { background: #fff; border-radius: 12px; border: 1px solid #e8e4e4; padding: 24px; margin-bottom: 20px; }
        .kyc-card-title { font-size: 16px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 20px; }
        .kyc-info-grid { display: grid; grid-template-columns: 180px 1fr; gap: 0; border: 1px solid #e8e4e4; border-radius: 8px; overflow: hidden; }
        
        .kyc-documents-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; }
        .kyc-doc-label { font-size: 13px; color: #888; margin-bottom: 10px; font-weight: 500; }
        
        .kyc-edit-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 8px; background: #2563eb; color: #fff; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .kyc-edit-btn:hover { background: #1d4ed8; }
        .kyc-edit-wrap { display: flex; justify-content: center; padding-top: 16px; border-top: 1px solid #f0eeee; margin-top: 16px; }
        
        @media (max-width: 767px) {
          .kyc-section { padding: 16px; max-width: 100%; }
          .kyc-info-grid { grid-template-columns: 1fr; }
          .kyc-documents-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .kyc-info-grid > div:nth-child(odd) { padding: 10px 14px 4px; background: transparent; border-bottom: none; }
          .kyc-info-grid > div:nth-child(even) { padding: 4px 14px 10px; }
        }
      `}</style>

      <div className="kyc-section">
        {/* Breadcrumb */}
        <nav className="kyc-breadcrumb">
          <Link href="/admin/verified">KYC Applications</Link>
          <FiChevronRight size={14} className="kyc-breadcrumb-separator" />
          <span className="kyc-breadcrumb-current">KYCDetails</span>
        </nav>

        {/* Profile Header */}
        <div className="kyc-profile-header">
          <div className="kyc-avatar-wrap">
            {docPreviews.photoUrl ? (
              <img src={docPreviews.photoUrl} alt={kyc.name} className="kyc-profile-avatar" />
            ) : (
              <div className="kyc-profile-avatar-placeholder" style={{ background: kyc.color }}>
                {kyc.initial}
              </div>
            )}
            <span className="kyc-verified-badge">Verified</span>
          </div>
        </div>

        {/* Personal & Identity Information */}
        <div className="kyc-card">
          <h2 className="kyc-card-title">Personal & Identity Information</h2>
          <div className="kyc-info-grid">
            <InfoRow label="Full Name" value={kyc.name} />
            <InfoRow label="Birthdate" value={kyc.birthdate} />
            <InfoRow label="Pan Card Number" value={kyc.panNumber} />
            <InfoRow label="Phone Number" value={kyc.phone} badge={<PhoneVerifiedBadge />} />
            <InfoRow label="Address" value={kyc.address} />
          </div>

          <div className="kyc-documents-grid">
            <div>
              <div className="kyc-doc-label">PAN Card Image</div>
              <DocumentPlaceholder label="PAN Card" src={docPreviews.panCardUrl} />
            </div>
            <div>
              <div className="kyc-doc-label">Passport Size Photo</div>
              <DocumentPlaceholder label="Passport" src={docPreviews.photoUrl} />
            </div>
            <div>
              <div className="kyc-doc-label">Selfie With Pan Card</div>
              <DocumentPlaceholder label="Selfie"  src={docPreviews.selfieWithPanUrl} />
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="kyc-card">
          <h2 className="kyc-card-title">Bank Information</h2>
          <div className="kyc-info-grid">
            <InfoRow label="Bank Name" value={kyc.bankName} />
            <InfoRow label="Bank Account Number" value={kyc.bankAccount} />
            <InfoRow label="Account Holder Name" value={kyc.accountHolder} />
          </div>
        </div>
      </div>
    </>
  );
}