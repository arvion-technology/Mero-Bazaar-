"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiCamera, FiCheckCircle, FiEdit3
} from "react-icons/fi";
import type { VendorKycDetail, MappedKycDetail } from "@/app/types/kyc";
import { mapKycDetail } from "@/app/types/kyc_mappers";

const PRIMARY = "#0f172a";
const CARD_BG = "#ffffff";

type DocKey = "panCardUrl" | "photoUrl" | "selfieWithPanUrl";

export default function SellerSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeDocKey = useRef<DocKey | null>(null);

  const [profile, setProfile] = useState<MappedKycDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<DocKey | null>(null);
  const [docBlobs, setDocBlobs] = useState<Record<string, string>>({});

  // Load KYC profile
  useEffect(() => {
    if (!session?.accessToken) return;
    fetch(`/api/vendor-kyc/me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: VendorKycDetail | null) => setProfile(data ? mapKycDetail(data) : null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  // Fetch each document image as an authenticated blob (plain <img> can't send Bearer headers)
  useEffect(() => {
    if (!profile || !session?.accessToken) return;

    const keys: DocKey[] = ["panCardUrl", "photoUrl", "selfieWithPanUrl"];
    const controllers: AbortController[] = [];

    keys.forEach((key) => {
      const filename = profile[key];
      if (!filename) return;

      const controller = new AbortController();
      controllers.push(controller);

      fetch(`/api/vendor-kyc/document/${encodeURIComponent(filename)}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        signal: controller.signal,
      })
        .then((r) => (r.ok ? r.blob() : null))
        .then((blob) => {
          if (blob) {
            setDocBlobs((prev) => ({ ...prev, [key]: URL.createObjectURL(blob) }));
          }
        })
        .catch(() => {});
    });

    return () => {
      controllers.forEach((c) => c.abort());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.panCardUrl, profile?.photoUrl, profile?.selfieWithPanUrl, session?.accessToken]);

  // Revoke blob URLs on unmount to avoid leaking memory
  useEffect(() => {
    return () => {
      Object.values(docBlobs).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openFilePicker(key: DocKey) {
    activeDocKey.current = key;
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const key = activeDocKey.current;
    if (!file || !key || !session?.accessToken) return;

    setUploading(key);
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("docType", key);

      const res = await fetch(`/api/vendor-kyc/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: formData,
      });

      if (res.ok) {
        const updated: VendorKycDetail = await res.json();
        setProfile(mapKycDetail(updated));
      }
    } catch (err) {
      console.error("Document upload failed:", err);
    } finally {
      setUploading(null);
      activeDocKey.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Unable to load profile. Please try again.
      </div>
    );
  }

  const infoRows = [
    { label: "Full Name", value: profile.name },
    { label: "Birthdate", value: profile.birthdate },
    { label: "Pan Card Number", value: profile.panNumber },
    { label: "Phone Number", value: profile.phone },
    { label: "Address", value: profile.address },
  ];

  const bankRows = [
    { label: "Bank Name", value: profile.bankName },
    { label: "Bank Account Number", value: profile.bankAccount },
    { label: "Account Holder Name", value: profile.accountHolder },
  ];

  const docs: { key: DocKey; label: string }[] = [
    { key: "panCardUrl", label: "PAN Card Image" },
    { key: "photoUrl", label: "Passport Size Photo" },
    { key: "selfieWithPanUrl", label: "Selfie With Pan Card" },
  ];

  return (
    <>
      <style>{`
        .settings-content { padding: 24px; max-width: 900px; margin: 0 auto; }
        .settings-profile-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .settings-avatar-lg { width: 52px; height: 52px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #64748b; }
        .settings-avatar-lg img { width: 100%; height: 100%; object-fit: cover; }
        .settings-verified-badge { display: inline-flex; align-items: center; gap: 3px; background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
        .settings-unverified-badge { display: inline-flex; align-items: center; gap: 3px; background: #fef3c7; color: #b45309; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
        .settings-rejected-badge { display: inline-flex; align-items: center; gap: 3px; background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
        .settings-section-title { font-size: 15px; font-weight: 600; color: ${PRIMARY}; margin-bottom: 10px; }
        .settings-info-card { background: ${CARD_BG}; border-radius: 10px; border: 1px solid #e8e4e4; margin-bottom: 16px; overflow: hidden; }
        .settings-info-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; }
        .settings-info-row:last-child { border-bottom: none; }
        .settings-info-label { font-size: 13px; color: #64748b; font-weight: 500; flex: 1; }
        .settings-info-value { font-size: 13px; color: ${PRIMARY}; font-weight: 500; flex: 1; text-align: right; }
        .settings-doc-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 14px 18px 18px; }
        .settings-doc-item { display: flex; flex-direction: column; gap: 6px; }
        .settings-doc-label { font-size: 12px; color: #64748b; font-weight: 500; }
        .settings-doc-box { width: 100%; aspect-ratio: 16/10; border: 1.5px dashed #e2e8f0; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #fafafa; cursor: pointer; transition: all 0.2s; overflow: hidden; position: relative; }
        .settings-doc-box:hover { border-color: #cbd5e1; background: #f8fafc; }
        .settings-doc-box img { width: 100%; height: 100%; object-fit: cover; }
        .settings-doc-uploading { position: absolute; inset: 0; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; font-size: 11px; color: #64748b; }
        .settings-doc-view { font-size: 12px; color: #6366f1; font-weight: 500; text-decoration: none; cursor: pointer; text-align: center; }
        .settings-doc-view:hover { text-decoration: underline; }
        .settings-edit-btn { display: flex; align-items: center; gap: 6px; margin: 0 auto 24px; padding: 8px 24px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .settings-edit-btn:hover { background: #1d4ed8; }
        .settings-rejection-note { padding: 12px 18px; background: #fef2f2; color: #b91c1c; font-size: 12px; border-top: 1px solid #fee2e2; }

        @media (max-width: 640px) {
          .settings-content { padding: 16px; }
          .settings-doc-row { grid-template-columns: 1fr; }
          .settings-info-row { flex-direction: column; align-items: flex-start; gap: 4px; }
          .settings-info-value { text-align: left; }
        }
      `}</style>

      <div className="settings-content">
        <div className="settings-profile-header">
          <div className="settings-avatar-lg">
            {docBlobs.photoUrl ? (
              <img src={docBlobs.photoUrl} alt={profile.name} />
            ) : (
              profile.initial
            )}
          </div>
          <div>
            {profile.status === "Verified" && (
              <div className="settings-verified-badge"><FiCheckCircle size={10} /> Verified</div>
            )}
            {profile.status === "Pending" && (
              <div className="settings-unverified-badge">Pending Review</div>
            )}
            {profile.status === "Rejected" && (
              <div className="settings-rejected-badge">Rejected</div>
            )}
          </div>
        </div>

        <h2 className="settings-section-title">Personal &amp; Identity Information</h2>
        <div className="settings-info-card">
          {infoRows.map((row) => (
            <div key={row.label} className="settings-info-row">
              <span className="settings-info-label">{row.label}</span>
              <span className="settings-info-value">{row.value || "—"}</span>
            </div>
          ))}

          <div className="settings-doc-row">
            {docs.map((doc) => (
              <div key={doc.key} className="settings-doc-item">
                <span className="settings-doc-label">{doc.label}</span>
                <div className="settings-doc-box" onClick={() => openFilePicker(doc.key)}>
                  {docBlobs[doc.key] ? (
                    <img src={docBlobs[doc.key]} alt={doc.label} />
                  ) : (
                    <FiCamera size={20} color="#cbd5e1" />
                  )}
                  {uploading === doc.key && <div className="settings-doc-uploading">Uploading...</div>}
                </div>
                {docBlobs[doc.key] && (
                  <a
                    className="settings-doc-view"
                    href={docBlobs[doc.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Full Size
                  </a>
                )}
              </div>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {profile.status === "Rejected" && profile.rejectionReason && (
            <div className="settings-rejection-note">
              Rejection reason: {profile.rejectionReason}
            </div>
          )}
        </div>

        <h2 className="settings-section-title">Bank Information</h2>
        <div className="settings-info-card">
          {bankRows.map((row) => (
            <div key={row.label} className="settings-info-row">
              <span className="settings-info-label">{row.label}</span>
              <span className="settings-info-value">{row.value || "—"}</span>
            </div>
          ))}
        </div>

        <button
          className="settings-edit-btn"
          onClick={() => router.push("/kyc?edit=1")}
        >
          <FiEdit3 size={14} /> Edit
        </button>
      </div>
    </>
  );
}
