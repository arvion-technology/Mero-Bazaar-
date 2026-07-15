"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiEdit2,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

const listingData = {
  title: "Frontend developer",
  company: "Hamro Tech Pvt. Ltd",
  companyLogo: null,
  location: "Kathmandu, Nepal",
  salaryMin: "28,000",
  salaryMax: "40,000",
  payPeriod: "month",
  contractType: "Full Time",
  postedAt: "Posted just now",
  urgentHiring: true,
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  description:
    "We are looking for a skilled Frontend Developer to build modern, responsive and user-friendly web applications using React, Next.js and TypeScript. You will collaborate with designers and backend developers to deliver high-quality products.",
  experience: "Not specified",
  jobCategory: "IT & software",
};

export default function PreviewListingPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handlePublish = () => {
    toast.success("Listing published successfully!");
     router.push("/seller/products");
  };

  const handleEdit = () => {
    router.push("/seller/listing/job");
  };

  const descriptionPreview = listingData.description;
  const shouldTruncate = descriptionPreview.length > 180;
  const displayedDesc =
    expanded || !shouldTruncate
      ? descriptionPreview
      : descriptionPreview.slice(0, 180) + "...";

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

        /* ── Badge ── */
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

        /* ── Header Row ── */
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

        /* ── Location ── */
        .location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 16px;
        }

        /* ── Divider ── */
        .divider {
          height: 1px;
          background: ${BORDER};
          margin: 0 0 14px 0;
        }

        /* ── Meta Row ── */
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

        /* ── Skills ── */
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

        /* ── Description ── */
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

        /* ── Details Grid ── */
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

        /* ── Actions ── */
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

        /* ── Responsive: exactly like vehicle page ── */
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
            {/* Badge */}
            {listingData.urgentHiring && (
              <div className="badge-urgent">Urgent Hiring</div>
            )}

            {/* Title + Logo */}
            <div className="card-header">
              <div>
                <h2 className="listing-title">{listingData.title}</h2>
                <div className="company-name">{listingData.company}</div>
              </div>
              <div className="company-logo">
                {listingData.companyLogo ? (
                  <img
                    src={listingData.companyLogo}
                    alt={listingData.company}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="company-logo-text">
                    HAMRO
                    <br />
                    TECH
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="location-row">
              <FiMapPin size={14} />
              {listingData.location}
            </div>

            <div className="divider" />

            {/* Meta */}
            <div className="meta-row">
              <span className="meta-salary">
                NRP {listingData.salaryMin}- {listingData.salaryMax}/{listingData.payPeriod}
              </span>
              <span className="meta-tag">{listingData.contractType}</span>
              <span className="meta-posted">{listingData.postedAt}</span>
            </div>

            <div className="divider" />

            {/* Skills */}
            <div className="skills-section">
              <div className="skills-label">Skills</div>
              <div className="skills-row">
                {listingData.skills.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                    <span className="skill-remove">×</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* Description */}
            <p className="description-text">{displayedDesc}</p>
            {shouldTruncate && (
              <button
                type="button"
                className="view-more-btn"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "View Less" : "View More"}
              </button>
            )}

            {/* Details */}
            <div className="details-section">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Pay Period</span>
                  <span className="detail-value">
                    {listingData.payPeriod.charAt(0).toUpperCase() +
                      listingData.payPeriod.slice(1)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact Type</span>
                  <span className="detail-value">{listingData.contractType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{listingData.experience}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Job Category</span>
                  <span className="detail-value">{listingData.jobCategory}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="btn btn-edit" onClick={handleEdit}>
              <FiEdit2 size={15} />
              Edit Listing
            </button>
            <button className="btn btn-publish" onClick={handlePublish}>
              Publish Listing
              <FiSend size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}