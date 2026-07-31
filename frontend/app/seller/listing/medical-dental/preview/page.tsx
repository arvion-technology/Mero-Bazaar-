"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiFileText,
  FiBriefcase,
  FiInfo,
  FiClock,
  FiAward,
  FiEdit3,
  FiSend,
  FiUser,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDraft, defaultMedicalData } from "../layout";
import { draftToCreateMedicalPayload } from "@/lib/adapters/medicalAdapter";
import { api } from "@/lib/api";

const ACCENT = "#2563eb";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Details", icon: FiBriefcase, status: "done" as const },
  { label: "Availability", icon: FiClock, status: "done" as const },
  { label: "Photos", icon: FiPlus, status: "done" as const },
  { label: "Preview", icon: FiInfo, status: "active" as const },
];

export default function MedicalPreviewPage() {
  const router = useRouter();
  const { medicalData, setMedicalData, images, setImages } = useDraft();
  const [submitting, setSubmitting] = useState(false);

  const mainPhoto = images.find((p) => p.isMain) || images[0];

  const servicesList = medicalData.servicesOffered
    ? medicalData.servicesOffered.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handlePublish = async () => {
    setSubmitting(true);
    try {
      const payload = draftToCreateMedicalPayload(medicalData, medicalData);
      const listing = await api.createMedical(payload);

      if (images.length > 0) {
        await api.uploadMedicalPhotos(listing.id, images.map((img) => img.file));
      }

      toast.success("Listing published successfully!");
      setMedicalData(defaultMedicalData);
      setImages([]);
      setTimeout(() => router.push("/seller/products"), 1200);
    } catch (err: any) {
      console.error("publish error:", err);
      toast.error(err.message || "Failed to publish listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 24px 64px;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 0;
          font-family: inherit;
        }

        .draft-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
        }

        .stepper {
          display: flex;
          align-items: center;
          background: ${CARD_BG};
          border: 1px solid ${BORDER};
          border-radius: 16px;
          padding: 18px 22px;
          margin-bottom: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          overflow-x: auto;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .step-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .step.done .step-icon-wrap { background: ${SUCCESS}; color: #fff; }
        .step.active .step-icon-wrap {
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
        }
        .step.upcoming .step-icon-wrap { background: #f1f5f9; color: ${TEXT_MUTED}; }

        .step-label {
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
        }
        .step.done .step-label { color: ${SUCCESS}; }
        .step.active .step-label { color: ${ACCENT}; }
        .step.upcoming .step-label { color: ${TEXT_MUTED}; }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 14px;
          min-width: 24px;
        }
        .step-connector.filled { background: ${SUCCESS}; }

        .title-section { margin-bottom: 24px; }
        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }
        .page-subtitle { font-size: 14px; color: ${TEXT_SECONDARY}; }

        .preview-card {
          background: ${CARD_BG};
          border-radius: 16px;
          border: 1px solid ${BORDER};
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03);
          padding: 32px;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
        }

        .doctor-image-wrap {
          width: 200px;
          height: 240px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .doctor-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .doctor-image-placeholder {
          color: #fff;
          opacity: 0.9;
        }

        .preview-content { min-width: 0; }

        .name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .doctor-name {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.2px;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #dcfce7;
          color: #16a34a;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
          border: 1px solid #bbf7d0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .license-text {
          font-size: 13px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 16px;
        }

        .badges-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .info-badge {
          min-width: 110px;
          padding: 10px 16px;
          border: 1.5px solid ${BORDER};
          border-radius: 10px;
          text-align: center;
          background: ${CARD_BG};
        }

        .badge-value {
          font-size: 15px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 2px;
        }

        .badge-label {
          font-size: 11px;
          color: ${TEXT_MUTED};
          font-weight: 500;
        }

        .info-table {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .info-key {
          color: ${TEXT_SECONDARY};
          font-weight: 500;
        }

        .info-value {
          color: ${TEXT_PRIMARY};
          font-weight: 600;
          text-align: right;
        }

        .divider {
          height: 1px;
          background: ${BORDER};
          margin: 20px 0;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .about-text {
          font-size: 13px;
          color: ${TEXT_SECONDARY};
          line-height: 1.6;
        }

        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .service-tag {
          padding: 6px 14px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          color: ${TEXT_SECONDARY};
        }

        .actions-wrap {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
        }

        .edit-btn {
          padding: 12px 40px;
          background: ${CARD_BG};
          color: ${ACCENT};
          font-size: 14px;
          font-weight: 600;
          border: 1.5px solid ${BORDER};
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
          justify-content: center;
        }
        .edit-btn:hover {
          border-color: ${ACCENT};
          background: #eff6ff;
        }
        .edit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .publish-btn {
          padding: 12px 40px;
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
          justify-content: center;
        }
        .publish-btn:hover {
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }
        .publish-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
        }

        @media (max-width: 768px) {
          .container { padding: 20px 20px 48px; }
          .preview-card { padding: 24px; }
          .preview-grid { grid-template-columns: 1fr; }
          .doctor-image-wrap { width: 100%; height: 280px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
          .actions-wrap { flex-direction: column; }
          .edit-btn, .publish-btn { width: 100%; }
        }

        @media (max-width: 480px) {
          .container { padding: 16px 16px 40px; }
          .preview-card { padding: 20px; }
          .badges-row { gap: 10px; }
          .info-badge { min-width: 100px; padding: 10px 14px; }
        }
      `}</style>

      <div className="page">
        <div className="container">
          <div className="header">
            <button type="button" className="back-btn" onClick={() => router.back()} disabled={submitting}>
              <FiArrowLeft size={18} />
              Back
            </button>
            <div className="draft-badge">
              Draft Saved <FiCheck size={16} />
            </div>
          </div>

          <div className="stepper">
            {steps.map((step, idx) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", flex: idx < steps.length - 1 ? 1 : "0 0 auto" }}>
                <div className={`step ${step.status}`}>
                  <div className="step-icon-wrap">
                    {step.status === "done" ? <FiCheck size={16} /> : <step.icon size={14} />}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`step-connector ${step.status === "done" ? "filled" : ""}`} />
                )}
              </div>
            ))}
          </div>

          <div className="title-section">
            <h1 className="page-title">Preview your listing</h1>
            <p className="page-subtitle">Review your listing details before publishing.</p>
          </div>

          <div className="preview-card">
            <div className="preview-grid">
              {/* Doctor Image */}
              <div className="doctor-image-wrap">
                {mainPhoto ? (
                  <img className="doctor-image" src={mainPhoto.preview} alt="Doctor" />
                ) : (
                  <div className="doctor-image-placeholder">
                    <FiUser size={64} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="preview-content">
                <div className="name-row">
                  <h2 className="doctor-name">{medicalData.doctorName || "Doctor Name"}</h2>
                  <span className="verified-badge">
                    <FiCheck size={10} strokeWidth={3} />
                    Verified
                  </span>
                </div>

                <p className="license-text">
                  NMC License: {medicalData.licenseNumber || "N/A"}
                </p>

                <div className="badges-row">
                  <div className="info-badge">
                    <div className="badge-value">NPR {medicalData.appointmentFee || "0"}</div>
                    <div className="badge-label">Appointment fee</div>
                  </div>
                  {medicalData.homeVisit && (
                    <div className="info-badge">
                      <div className="badge-value">Home</div>
                      <div className="badge-label">Available</div>
                    </div>
                  )}
                </div>

                <div className="info-table">
                  <div className="info-row">
                    <span className="info-key">Clinic Address</span>
                    <span className="info-value">{medicalData.clinicAddress || "-"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">City</span>
                    <span className="info-value">{medicalData.city || "-"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Languages</span>
                    <span className="info-value">{(medicalData.languages || []).join(", ")}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Experience</span>
                    <span className="info-value">{medicalData.experience || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            <div style={{ marginBottom: 20 }}>
              <h3 className="section-title">
                <FiAward size={16} />
                About Doctor
              </h3>
              <p className="about-text">
                {medicalData.shortBio || "No bio provided."}
              </p>
            </div>

            <div>
              <h3 className="section-title">
                <FiBriefcase size={16} />
                Services Offered
              </h3>
              <div className="tags-row">
                {servicesList.length > 0 ? (
                  servicesList.map((service: string, idx: number) => (
                    <span key={idx} className="service-tag">{service}</span>
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: TEXT_MUTED }}>No services listed.</span>
                )}
              </div>
            </div>

            <div className="actions-wrap">
              <button type="button" className="edit-btn" onClick={() => router.back()} disabled={submitting}>
                <FiEdit3 size={16} />
                Edit Listing
              </button>
              <button type="button" className="publish-btn" onClick={handlePublish} disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Listing"}
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}