"use client";

import { useState, useEffect } from "react";
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
  FiStar,
  FiShield,
  FiClock,
  FiZap,
  FiNavigation,
  FiTool,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#C0392B";

const MapWithNoSSR = dynamic(
  () => import("../detail/MapComponent"),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#e5e7eb",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <span style={{ color: "#94a3b8", fontSize: "13px" }}>Loading map...</span>
    </div>
  );
}

interface ListingData {
  serviceTitle: string;
  startingPrice: string;
  description: string;
  selectedService: string;
  city: string;
  ward: string;
  skills: string[];
  serviceArea: string;
  calloutCharge: string;
  warrantyGiven: boolean;
  emergencyService: boolean;
  avgResponseTime: string;
  address: string;
  mapPosition: [number, number];
  image: string;
}

const defaultData: ListingData = {
  serviceTitle: "Plumbing Service",
  startingPrice: "800",
  description: "Expert plumbing services for residential and commercial properties. We handle leak repairs, pipe installations, bathroom fittings, and emergency plumbing needs.",
  selectedService: "Plumbing",
  city: "Kathmandu",
  ward: "Ward 14",
  skills: ["Plumbing", "Leak Repair", "Bathroom Fitting"],
  serviceArea: "10KM",
  calloutCharge: "500",
  warrantyGiven: true,
  emergencyService: true,
  avgResponseTime: "1Hour",
  address: "Kalanki, kathmandu, Nepal",
  mapPosition: [27.7172, 85.3240],
  image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=60",
};

export default function PreviewTradesHomeRepairPage() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [listingData, setListingData] = useState<ListingData>(defaultData);

  useEffect(() => {
    const basicData = localStorage.getItem("tradesBasic");
    const detailData = localStorage.getItem("tradesDetail");
    
    if (basicData || detailData) {
      const parsedBasic = basicData ? JSON.parse(basicData) : {};
      const parsedDetail = detailData ? JSON.parse(detailData) : {};
      
      setListingData((prev) => ({
        ...prev,
        ...parsedBasic,
        ...parsedDetail,
      }));
    }
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Listing published successfully!");
    setIsPublishing(false);
    localStorage.removeItem("tradesBasic");
    localStorage.removeItem("tradesDetail");
    router.push("/seller/products");
  };

  const handleEdit = (step: string) => {
    if (step === "basic") router.push("/seller/listing/trades-home-repair");
    if (step === "detail") router.push("/seller/listing/trades-home-repair/detail");
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
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 32px 40px;
        }

        /* ── Header ── */
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
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
        }

        /* ── Page Title ── */
        .page-header {
          margin-bottom: 20px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.3px;
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 14px;
          color: ${TEXT_SECONDARY};
        }

        /* ── Listing Card ── */
        .listing-card {
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        /* ── Card Layout ── */
        .card-layout {
          display: flex;
          gap: 28px;
        }

        /* ── Left: Image ── */
        .card-left {
          flex: 0 0 280px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-image-wrap {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
          aspect-ratio: 1 / 1;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .verified-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: ${SUCCESS};
          background: rgba(255,255,255,0.95);
          padding: 4px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .verified-badge svg {
          color: ${SUCCESS};
        }

        .map-small {
          width: 100%;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
        }

        /* ── Right: Info ── */
        .card-right {
          flex: 1;
          min-width: 0;
          padding-top: 4px;
        }

        .service-title {
          font-size: 20px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.2px;
          margin-bottom: 6px;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .rating-stars {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #f59e0b;
        }

        .rating-text {
          font-size: 13px;
          color: ${TEXT_SECONDARY};
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 20px;
        }

        .location-row svg {
          color: ${TEXT_MUTED};
        }

        /* ── Info Grid ── */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-top: 1px solid ${BORDER};
        }

        .info-cell {
          padding: 14px 16px;
          border-bottom: 1px solid ${BORDER};
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-cell:nth-child(odd) {
          border-right: 1px solid ${BORDER};
        }

        .info-cell-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: ${TEXT_SECONDARY};
          font-weight: 500;
        }

        .info-cell-label svg {
          color: ${TEXT_MUTED};
          width: 14px;
          height: 14px;
        }

        .info-cell-value {
          font-size: 14px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          padding-left: 20px;
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
        @media (max-width: 768px) {
          .preview-container { padding: 16px 16px 32px; }
          .listing-card { padding: 16px; }
          .card-layout { flex-direction: column; }
          .card-left { flex: 0 0 auto; width: 100%; }
          .card-image-wrap { aspect-ratio: 16 / 10; }
          .info-grid { grid-template-columns: 1fr; }
          .info-cell:nth-child(odd) { border-right: none; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
          .map-small { height: 140px; }
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
            <h1 className="page-title">Preview your listing</h1>
            <p className="page-subtitle">Review your listing details before publishing.</p>
          </div>

          {/* Listing Card */}
          <div className="listing-card">
            <div className="card-layout">
              {/* Left: Image + Map */}
              <div className="card-left">
                <div className="card-image-wrap">
                  <img src={listingData.image} alt={listingData.serviceTitle} />
                  <div className="verified-badge">
                    <FiCheck size={12} strokeWidth={3} />
                    Verified
                  </div>
                </div>
                <div className="map-small">
                  <MapWithNoSSR
                    position={listingData.mapPosition}
                    onMapClick={() => {}}
                  />
                </div>
              </div>

              {/* Right: Details */}
              <div className="card-right">
                <h2 className="service-title">{listingData.serviceTitle}</h2>

                <div className="rating-row">
                  <div className="rating-stars">
                    <FiStar size={14} fill="#f59e0b" stroke="#f59e0b" />
                    <FiStar size={14} fill="#f59e0b" stroke="#f59e0b" />
                    <FiStar size={14} fill="#f59e0b" stroke="#f59e0b" />
                    <FiStar size={14} fill="#f59e0b" stroke="#f59e0b" />
                    <FiStar size={14} fill="#f59e0b" stroke="#f59e0b" opacity={0.5} />
                  </div>
                  <span className="rating-text">4.5 (12 reviews)</span>
                </div>

                <div className="location-row">
                  <FiMapPin size={14} />
                  {listingData.city}, Nepal
                </div>

                {/* Info Grid */}
                <div className="info-grid">
                  <div className="info-cell">
                    <div className="info-cell-label">
                      <FiNavigation size={14} />
                      Service Area
                    </div>
                    <div className="info-cell-value">{listingData.serviceArea}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-cell-label">
                      <FiDollarSign size={14} />
                      Callout Charge
                    </div>
                    <div className="info-cell-value">NPR {Number(listingData.calloutCharge).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-cell-label">
                      <FiShield size={14} />
                      Warranty
                    </div>
                    <div className="info-cell-value">{listingData.warrantyGiven ? "Yes" : "No"}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-cell-label">
                      <FiZap size={14} />
                      Emergency
                    </div>
                    <div className="info-cell-value">{listingData.emergencyService ? "Available" : "Not Available"}</div>
                  </div>
                  <div className="info-cell" style={{ gridColumn: "span 2", borderRight: "none" }}>
                    <div className="info-cell-label">
                      <FiClock size={14} />
                      Avg Response
                    </div>
                    <div className="info-cell-value">{listingData.avgResponseTime}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn btn-edit" onClick={() => handleEdit("detail")}>
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