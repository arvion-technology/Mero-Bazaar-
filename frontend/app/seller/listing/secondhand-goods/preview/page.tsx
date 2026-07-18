"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiTag,
  FiAward,
  FiDollarSign,
  FiCalendar,
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

//demo data for preview
const listingData = {
  title: "Fresh Organic Vegetable",
  price: "120",
  priceUnit: "/ KG",
  location: "Lalitpur",
  category: "Furniture",
  condition: "Good",
  negotiable: true,
  expiresAt: "15 Jul 2026",
  description:
    "Well maintained wooden study table. Few minor scratches but in good condition.",
  status: "Active",
  image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D",
};

export default function PreviewSecondHandPage() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Listing published successfully!");
    setIsPublishing(false);
    router.push("/seller/products");
  };

  const handleEdit = () => {
    router.push("/seller/listing/secondhand-goods");
  };

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

        /* ── Listing Card ── */
        .listing-card {
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          position: relative;
        }

        .status-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: ${SUCCESS};
          background: rgba(16, 185, 129, 0.1);
          padding: 5px 12px;
          border-radius: 20px;
        }

        .status-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${SUCCESS};
        }

        /* ── Card Layout ── */
        .card-layout {
          display: flex;
          gap: 28px;
        }

        .card-image {
          flex: 0 0 320px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
          aspect-ratio: 4 / 3;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-info {
          flex: 1;
          min-width: 0;
          padding-top: 4px;
        }

        .listing-title {
          font-size: 20px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.2px;
          margin-bottom: 8px;
        }

        .listing-price {
          font-size: 18px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .listing-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 20px;
        }

        .listing-location svg { color: ${TEXT_SECONDARY}; }

        .divider {
          height: 1px;
          background: ${BORDER};
          margin: 0 0 14px 0;
        }

        /* ── Info Rows ── */
        .info-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }

        .info-row-left {
          display: flex;
          align-items: center;
          gap: 10px;
          color: ${TEXT_SECONDARY};
        }

        .info-row-left svg {
          color: ${TEXT_SECONDARY};
          width: 16px;
          height: 16px;
        }

        .info-row-right {
          font-weight: 500;
          color: ${TEXT_PRIMARY};
        }

        /* ── Description ── */
        .description-section {
          margin-top: 4px;
          padding-top: 14px;
        }

        .description-title {
          font-size: 14px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 8px;
        }

        .description-text {
          font-size: 14px;
          line-height: 1.7;
          color: ${TEXT_SECONDARY};
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

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .preview-container { padding: 20px 20px 40px; }
          .listing-card { padding: 20px; }
          .card-layout { flex-direction: column; }
          .card-image { flex: 0 0 auto; width: 100%; aspect-ratio: 16 / 10; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
          .status-badge { top: 20px; right: 20px; }
        }
      `}</style>

      <div className="preview-page">
        <div className="preview-container">
          {/* Header */}
          <div className="preview-header">
            <button className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={16} />
              Back
            </button>
            <div className="draft-saved">
              Draft Saved <FiCheck size={16} />
            </div>
          </div>

          {/* Title */}
          <div className="page-header">
            <h1 className="section-title">Preview your listing</h1>
            <p className="section-subtitle">Review your listing details before publishing.</p>
          </div>

          {/* Listing Card */}
          <div className="listing-card">
            <div className="status-badge">{listingData.status}</div>

            <div className="card-layout">
              {/* Image */}
              <div className="card-image">
                <img src={listingData.image} alt={listingData.title} />
              </div>

              {/* Details */}
              <div className="card-info">
                <h2 className="listing-title">{listingData.title}</h2>
                <div className="listing-price">
                  NPR {listingData.price}
                  <span style={{ fontWeight: 500, opacity: 0.8 }}>
                    {" "}{listingData.priceUnit}
                  </span>
                </div>

                <div className="listing-location">
                  <FiMapPin size={14} />
                  {listingData.location}
                </div>

                <div className="divider" />

                <div className="info-rows">
                  <div className="info-row">
                    <div className="info-row-left">
                      <FiTag size={16} />
                      Category
                    </div>
                    <div className="info-row-right">{listingData.category}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-row-left">
                      <FiAward size={16} />
                      Condition
                    </div>
                    <div className="info-row-right">{listingData.condition}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-row-left">
                      <FiDollarSign size={16} />
                      Negotiable
                    </div>
                    <div className="info-row-right">
                      {listingData.negotiable ? "Yes" : "No"}
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-row-left">
                      <FiCalendar size={16} />
                      Expires At
                    </div>
                    <div className="info-row-right">{listingData.expiresAt}</div>
                  </div>
                </div>

                <div className="divider" />

                <div className="description-section">
                  <div className="description-title">Description</div>
                  <p className="description-text">{listingData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn btn-edit" onClick={handleEdit}>
              <FiEdit2 size={15} />
              Edit Listing
            </button>
            <button
              className="btn btn-publish"
              onClick={handlePublish}
              disabled={isPublishing}
            >
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