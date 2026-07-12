"use client";

import Link from "next/link";
import { useState } from "react";
import { FiChevronRight, FiEdit3 } from "react-icons/fi";
import KycDocumentImage from "./KycDocumentImage";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

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

interface KYCDetailsContentPendingProps {
  kyc: KYCRecord | undefined;
}

export default function KYCDetailsContentPending({ kyc }: KYCDetailsContentPendingProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(kyc?.status || "Pending");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!kyc) {
    return (
      <div style={{ padding: "32px" }}>
        <h2 style={{ color: "#333", fontSize: "18px" }}>KYC record not found</h2>
      </div>
    );
  }

  const DocumentPlaceholder = ({ label, filename }: { label: string; filename?: string | null }) => {
    if (!filename) {
      return (
        <div style={{ textAlign: "center" as const }}>
          <div
            style={{
              width: "100%",
              height: "120px",
              background: "#c4b5b5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#fff", fontSize: "12px", opacity: 0.7 }}>No Image</span>
          </div>
        </div>
      );
    }

  const handleViewFullSize = async () => {
    if (!session?.accessToken) return;
    const newTab = window.open("", "_blank"); // open synchronously, before await
    try {
      const res = await fetch(`/api/vendor-kyc/admin/document/${filename}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (!res.ok || !newTab) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      newTab.location.href = url;
    } catch (err) {
      newTab?.close();
      console.error("Failed to open document:", err);
    }
  };

    return (
      <div style={{ textAlign: "center" as const }}>
        <KycDocumentImage filename={filename} alt={label} />
        <button
          type="button"
          onClick={handleViewFullSize}
          style={{
            background: "none",
            border: "none",
            color: "#6366f1",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-block",
            marginTop: "4px",
          }}
        >
          View Full Size
        </button>
      </div>
    );
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
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
      </div>
    </div>
  );

  const showRejectionField = selectedStatus === "Rejected";

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Verified":
        return { background: "#dcfce7", color: "#16a34a", dot: "#16a34a" };
      case "Rejected":
        return { background: "#fef3c7", color: "#d97706", dot: "#d97706" };
      case "Pending":
      default:
        return { background: "#fef3c7", color: "#d97706", dot: "#fbbf24" };
    }
  };

  const currentStatusStyle = getStatusBadgeStyle(kyc.status);


  const handleSubmitStatus = async () => {
    if (selectedStatus === "Rejected" && !rejectionReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    if (!session?.accessToken) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/vendor-kyc/admin/review/${kyc.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          status: selectedStatus.toUpperCase(),
          rejectionReason: selectedStatus === "Rejected" ? rejectionReason : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .kyc-section { padding: 24px 32px 32px; }
        .kyc-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #666; margin-bottom: 24px; }
        .kyc-breadcrumb a { color: #666; text-decoration: none; }
        .kyc-breadcrumb a:hover { color: ${SITE_PRIMARY}; }
        .kyc-breadcrumb-current { color: #6366f1; font-weight: 500; }
        .kyc-breadcrumb-separator { color: #999; }
        
        .kyc-profile-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .kyc-profile-left { display: flex; align-items: center; gap: 12px; }
        .kyc-avatar-wrap { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .kyc-profile-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; display: block; }
        .kyc-profile-avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; font-weight: 700; }
        
        .kyc-applied-info { display: flex; flex-direction: column; gap: 2px; }
        .kyc-applied-name { font-size: 16px; font-weight: 700; color: ${PRIMARY}; }
        .kyc-applied-date { font-size: 12px; color: #888; }
        
        .kyc-current-status { text-align: right; }
        .kyc-current-status-label { font-size: 12px; color: #888; margin-bottom: 4px; }
        .kyc-status-badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 4px; 
          padding: 4px 12px; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: 600; 
        }
        .kyc-status-badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; }
        
        .kyc-main-layout { display: flex; gap: 24px; align-items: flex-start; }
        .kyc-left-col { flex: 1; min-width: 0; }
        .kyc-right-col { width: 320px; flex-shrink: 0; }
        
        .kyc-card { background: #fff; border-radius: 12px; border: 1px solid #e8e4e4; padding: 24px; margin-bottom: 20px; }
        .kyc-card-title { font-size: 16px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 20px; }
        .kyc-info-grid { display: grid; grid-template-columns: 180px 1fr; gap: 0; border: 1px solid #e8e4e4; border-radius: 8px; overflow: hidden; }
        
        .kyc-documents-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; }
        .kyc-doc-label { font-size: 13px; color: #888; margin-bottom: 10px; font-weight: 500; }
        
        .kyc-edit-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 8px; background: #2563eb; color: #fff; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .kyc-edit-btn:hover { background: #1d4ed8; }
        .kyc-edit-wrap { display: flex; justify-content: center; padding-top: 16px; border-top: 1px solid #f0eeee; margin-top: 16px; }
        
        /* Status Panel */
        .kyc-status-panel { background: #fff; border-radius: 12px; border: 1px solid #e8e4e4; padding: 24px; }
        .kyc-status-panel-title { font-size: 16px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 16px; }
        .kyc-status-select { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid #c7c7c7; font-size: 15px; color: #333; background: #fff; cursor: pointer; margin-bottom: 16px; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }
        .kyc-status-select:focus { outline: none; border-color: #818cf8; }
        .kyc-rejection-label { font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px; display: block; }
        .kyc-rejection-label span { color: #888; font-weight: 400; }
        .kyc-rejection-textarea { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e8e4e4; font-size: 13px; color: #333; resize: vertical; min-height: 80px; font-family: inherit; background: #f5f5f5; }
        .kyc-rejection-textarea:focus { outline: none; border-color: #818cf8; }
        .kyc-rejection-hint { font-size: 11px; color: #888; margin-top: 6px; }
        .kyc-submit-btn { width: 100%; padding: 14px; border-radius: 10px; background: #4f46e5; color: #fff; border: none; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 16px; }
        .kyc-submit-btn:hover { background: #4338ca; }
        
        @media (max-width: 1023px) {
          .kyc-main-layout { flex-direction: column; }
          .kyc-right-col { width: 100%; }
        }
        @media (max-width: 767px) {
          .kyc-section { padding: 16px; }
          .kyc-info-grid { grid-template-columns: 1fr; }
          .kyc-documents-grid { grid-template-columns: 1fr; }
          .kyc-profile-header { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
        @media (max-width: 480px) {
          .kyc-info-grid > div:nth-child(odd) { padding: 10px 14px 4px; background: transparent; border-bottom: none; }
          .kyc-info-grid > div:nth-child(even) { padding: 4px 14px 10px; }
        }
      `}</style>

      <div className="kyc-section">
        {/* Breadcrumb */}
        <nav className="kyc-breadcrumb">
          <Link href="/admin/unverified">KYC Applications</Link>
          <FiChevronRight size={14} className="kyc-breadcrumb-separator" />
          <span className="kyc-breadcrumb-current">KYCDetails</span>
        </nav>

        {/* Profile Header with Current Status */}
        <div className="kyc-profile-header">
          <div className="kyc-profile-left">
            <div className="kyc-avatar-wrap">
              {kyc.photoUrl ? (
                <img src={kyc.photoUrl} alt={kyc.name} className="kyc-profile-avatar" />
              ) : (
                <div className="kyc-profile-avatar-placeholder" style={{ background: kyc.color }}>
                  {kyc.initial}
                </div>
              )}
            </div>
            <div className="kyc-applied-info">
              <div className="kyc-applied-name">{kyc.name}</div>
              <div className="kyc-applied-date">Applied on: {kyc.appliedOn}</div>
            </div>
          </div>
          <div className="kyc-current-status">
            <div className="kyc-current-status-label">Current Status</div>
            <span
              className="kyc-status-badge"
              style={{
                background: currentStatusStyle.background,
                color: currentStatusStyle.color,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: currentStatusStyle.dot,
                  display: "inline-block",
                }}
              />
              {kyc.status}
            </span>
          </div>
        </div>

        {/* Two column layout */}
        <div className="kyc-main-layout">
          {/* Left Column */}
          <div className="kyc-left-col">
            {/* Personal & Identity Information */}
            <div className="kyc-card">
              <h2 className="kyc-card-title">Personal & Identity Information</h2>
              <div className="kyc-info-grid">
                <InfoRow label="Full Name" value={kyc.name} />
                <InfoRow label="Birthdate" value={kyc.birthdate} />
                <InfoRow label="Pan Card Number" value={kyc.panNumber} />
                <InfoRow label="Phone Number" value={kyc.phone} />
                <InfoRow label="Address" value={kyc.address} />
              </div>

              <div className="kyc-documents-grid">
                <div>
                  <div className="kyc-doc-label">PAN Card Image</div>
                  <DocumentPlaceholder label="PAN Card" filename={kyc.panCardUrl} />
                </div>
                <div>
                  <div className="kyc-doc-label">Passport Size Photo</div>
                  <DocumentPlaceholder label="Passport" filename={kyc.photoUrl} />
                </div>
                <div>
                  <div className="kyc-doc-label">Selfie With Pan Card</div>
                  <DocumentPlaceholder label="Selfie" filename={kyc.selfieWithPanUrl} />
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

          {/* Right Column — Status Panel */}
          <div className="kyc-right-col">
            <div className="kyc-status-panel">
              <h2 className="kyc-status-panel-title">Application Status</h2>

              <select
                className="kyc-status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Verified">Approve</option>
                <option value="Rejected">Rejected</option>
              </select>

              {showRejectionField && (
                <>
                  <label className="kyc-rejection-label">
                    Rejected Reason<span>(Required for rejection)</span>
                  </label>
                  <textarea
                    className="kyc-rejection-textarea"
                    placeholder="Enter reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div className="kyc-rejection-hint">This reason will be visible to the applicant</div>
                </>
              )}

              <button type="button" className="kyc-submit-btn" onClick={handleSubmitStatus} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Status"}
              </button>
              {submitError && (
                <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "8px" }}>{submitError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}