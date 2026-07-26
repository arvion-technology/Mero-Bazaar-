"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiArrowLeft, FiCheck, FiMapPin, FiEdit2, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useJobDraft } from "../layout";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

const PAY_PERIOD_MAP: Record<string, string> = {
  Hourly: "HOURLY",
  Daily: "DAILY",
  Weekly: "WEEKLY",
  "Bi-weekly": "BIWEEKLY",
  Monthly: "MONTHLY",
  Yearly: "YEARLY",
};

const CONTRACT_TYPE_MAP: Record<string, string> = {
  "Full Time": "FULL_TIME",
  "Part Time": "PART_TIME",
  Contract: "CONTRACT",
  Freelance: "FREELANCE",
  Internship: "INTERNSHIP",
};

function toCity(location: string) {
  return location.replace(/,\s*Nepal$/i, "").trim();
}

export default function PreviewListingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data } = useJobDraft();
  const [isPublishing, setIsPublishing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          role: data.role,
          city: toCity(data.location),
          salaryMin: Number(data.salaryMin.replace(/,/g, "")),
          salaryMax: Number(data.salaryMax.replace(/,/g, "")),
          payPeriod: PAY_PERIOD_MAP[data.payPeriod] ?? "MONTHLY",
          contractType: CONTRACT_TYPE_MAP[data.contractType] ?? "FULL_TIME",
          skillTags: data.skillTags,
          isUrgent: data.urgentHiring,
          employerPhoneVerified: data.phoneVerified,
          // NOTE: `description` intentionally left out here.
          // The Job model/DTO has no `description` field (only Listing does),
          // so sending it trips the backend's whitelist validation
          // ("property description should not exist"). If you want the
          // description persisted, save it to the Listing separately
          // (e.g. a follow-up PATCH to /api/listings/:id) once the DTO
          // supports it, rather than bundling it into the job payload.
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to publish job listing");
      }

      toast.success("Listing published successfully!");
      router.push("/seller/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong publishing");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    router.push("/seller/listing/job");
  };

  const shouldTruncate = data.description.length > 180;
  const displayedDesc =
    expanded || !shouldTruncate
      ? data.description
      : data.description.slice(0, 180) + "...";

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .preview-page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .preview-container {
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 32px 40px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px solid ${BORDER};
          background: ${CARD_BG};
          color: ${TEXT_SECONDARY};
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .draft-saved {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: ${SUCCESS};
        }

        .page-header {
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.3px;
          margin-bottom: 4px;
        }

        .section-subtitle {
          font-size: 14px;
          color: ${TEXT_SECONDARY};
        }

        .listing-card {
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .badge-urgent {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background: #dcfce7;
          border: 1.5px solid #bbf7d0;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
          margin-bottom: 12px;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 2px;
        }

        .listing-title {
          font-size: 20px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.2px;
        }

        .company-name {
          font-size: 15px;
          font-weight: 600;
          color: ${ACCENT};
          margin-bottom: 10px;
        }

        .company-logo {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border: 1.5px solid #a5b4fc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .company-logo-text {
          font-size: 10px;
          font-weight: 800;
          color: #4f46e5;
          text-align: center;
          line-height: 1.2;
          letter-spacing: 0.5px;
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 16px;
        }

        .divider {
          height: 1px;
          background: ${BORDER};
          margin: 0 0 14px 0;
        }

        .meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .meta-salary {
          font-size: 14px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          white-space: nowrap;
        }

        .meta-tag {
          font-size: 13px;
          font-weight: 500;
          color: ${TEXT_SECONDARY};
          white-space: nowrap;
        }

        .meta-posted {
          font-size: 13px;
          color: ${TEXT_MUTED};
          white-space: nowrap;
        }

        .skills-section {
          margin-bottom: 14px;
        }

        .skills-label {
          font-size: 13px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          margin-bottom: 10px;
        }

        .skills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: #f3e8ff;
          border: 1.5px solid #d8b4fe;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 500;
          color: #7c3aed;
        }

        .skill-remove {
          font-size: 12px;
          cursor: default;
        }

        .description-text {
          font-size: 14px;
          line-height: 1.7;
          color: ${TEXT_SECONDARY};
          margin-bottom: 6px;
        }

        .view-more-btn {
          font-size: 13.5px;
          font-weight: 600;
          color: ${ACCENT};
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
        }

        .view-more-btn:hover { text-decoration: underline; }

        .details-section {
          margin-top: 16px;
          padding-top: 14px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 24px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 12.5px;
          color: ${TEXT_MUTED};
          font-weight: 500;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
        }

        .actions {
          display: flex;
          gap: 50px;
          justify-content: center;
        }

        .btn {
          padding: 10px 28px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-edit {
          background: ${CARD_BG};
          color: ${ACCENT};
          border: 1.5px solid ${ACCENT};
          min-width: 140px;
          justify-content: center;
        }

        .btn-edit:hover {
          background: #eff6ff;
        }

        .btn-publish {
          background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER});
          color: #fff;
          border: none;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
          min-width: 160px;
          justify-content: center;
        }

        .btn-publish:hover {
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .btn-publish:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .preview-container { padding: 20px 20px 40px; }
          .listing-card { padding: 20px; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
          .meta-row { flex-direction: column; align-items: flex-start; gap: 6px; }
          .details-grid { grid-template-columns: 1fr; gap: 10px; }
          .card-header { flex-direction: column-reverse; }
          .company-logo { align-self: flex-start; }
        }
      `}</style>

      <div className="preview-page">
        <div className="preview-container">
          <div className="preview-header">
            <button className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={16} />
              Back
            </button>
            <div className="draft-saved">
              Draft Saved <FiCheck size={16} />
            </div>
          </div>

          <div className="page-header">
            <h1 className="section-title">Preview your listing</h1>
            <p className="section-subtitle">Review your listing details before publishing.</p>
          </div>

          <div className="listing-card">
            {data.urgentHiring && <div className="badge-urgent">Urgent Hiring</div>}

            <div className="card-header">
              <div>
                <h2 className="listing-title">{data.role}</h2>
                <div className="company-name">{data.company}</div>
              </div>
              <div className="company-logo">
                <span className="company-logo-text">
                  {data.company.slice(0, 5).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="location-row">
              <FiMapPin size={14} />
              {data.location}
            </div>

            <div className="divider" />

            <div className="meta-row">
              <span className="meta-salary">
                NRP {data.salaryMin}- {data.salaryMax}/{data.payPeriod}
              </span>
              <span className="meta-tag">{data.contractType}</span>
              <span className="meta-posted">Posted just now</span>
            </div>

            <div className="divider" />

            <div className="skills-section">
              <div className="skills-label">Skills</div>
              <div className="skills-row">
                {data.skillTags.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                    <span className="skill-remove">×</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="divider" />

            <p className="description-text">{displayedDesc}</p>
            {shouldTruncate && (
              <button type="button" className="view-more-btn" onClick={() => setExpanded(!expanded)}>
                {expanded ? "View Less" : "View More"}
              </button>
            )}

            <div className="details-section">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Pay Period</span>
                  <span className="detail-value">{data.payPeriod}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contract Type</span>
                  <span className="detail-value">{data.contractType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Employer Phone Verified</span>
                  <span className="detail-value">{data.phoneVerified ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="btn btn-edit" onClick={handleEdit}>
              <FiEdit2 size={15} />
              Edit Listing
            </button>
            <button className="btn btn-publish" onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <span className="spinner" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Listing
                  <FiSend size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
