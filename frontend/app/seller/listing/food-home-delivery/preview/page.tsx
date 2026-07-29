"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiEdit2,
  FiSend,
  FiFileText,
  FiBriefcase,
  FiPlus,
  FiInfo,
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

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Details", icon: FiBriefcase, status: "done" as const },
  { label: "Photos", icon: FiPlus, status: "done" as const },
  { label: "Preview", icon: FiInfo, status: "active" as const },
];

interface ListingData {
  title: string;
  foodType: string;
  description: string;
  price: string;
  priceUnit: string;
  deliveryRadius: string;
  hygieneRating: string;
  minOrderAmount: string;
  subscriptionAvailable: boolean;
  deliveryDays: string[];
  shortDescription: string;
  location: string;
}

interface ListingImage {
  preview: string;
  isMain: boolean;
}

const defaultData: ListingData = {
  title: "Healthy Home Tiffin Service",
  foodType: "TIFFIN",
  description:
    "Nutritious and delicious homemade meals, freshly prepared daily with hygiene and love.",
  price: "120",
  priceUnit: "PER_MEAL",
  deliveryRadius: "5",
  hygieneRating: "4.7",
  minOrderAmount: "150",
  subscriptionAvailable: true,
  deliveryDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  shortDescription: "Fresh, Homemade and Hygenic food delivery to your doorstep",
  location: "Kathmandu, Nepal",
};

const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop";

export default function PreviewFoodDeliveryPage() {
  const router = useRouter();
  const [listingData, setListingData] = useState<ListingData>(defaultData);
  const [listingImages, setListingImages] = useState<ListingImage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("foodDeliveryListing");
    if (saved) {
      try {
        setListingData({ ...defaultData, ...JSON.parse(saved) });
      } catch {
        // keep default
      }
    }
    const savedImages = localStorage.getItem("foodDeliveryListingImages");
    if (savedImages) {
      try {
        setListingImages(JSON.parse(savedImages));
      } catch {
        // keep empty
      }
    }
  }, []);

  const handlePublish = () => {
    toast.success("Listing published successfully!");
    localStorage.removeItem("foodDeliveryListing");
    localStorage.removeItem("foodDeliveryListingImages");
    router.push("/seller/products");
  };

  const handleEdit = () => {
    router.push("/seller/listing/food-home-delivery");
  };

  const formatPrice = (val: string) => {
    const num = Number(val.replace(/,/g, ""));
    if (isNaN(num)) return val;
    return num.toLocaleString("en-IN");
  };

  const formatDeliveryDays = (days: string[]) => {
    if (days.length === 7) return "Mon - Sun";
    if (days.length === 5 && days.includes("MON") && days.includes("FRI")) return "Mon - Fri";
    if (days.length === 0) return "Not specified";
    return days.map((d) => d.charAt(0) + d.slice(1).toLowerCase()).join(", ");
  };

  const formatUnit = (unit: string) => {
    return unit.replace(/_/g, " ").toLowerCase();
  };

  const mainImage = listingImages.find((img) => img.isMain)?.preview || fallbackImage;

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
          max-width: 1200px;
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

        /* ── Stepper ── */
        .stepper {
          display: flex;
          align-items: center;
          background: ${CARD_BG};
          border: 1px solid ${BORDER};
          border-radius: 16px;
          padding: 18px 22px;
          margin-bottom: 24px;
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

        .step.done .step-icon-wrap {
          background: ${SUCCESS};
          color: #fff;
        }

        .step.active .step-icon-wrap {
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
        }

        .step.upcoming .step-icon-wrap {
          background: #f1f5f9;
          color: ${TEXT_MUTED};
        }

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
          position: relative;
        }

        .step-connector.filled {
          background: ${SUCCESS};
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
          padding: 32px 40px;
          margin-bottom: 24px;
          display: flex;
          gap: 48px;
          align-items: flex-start;
        }

        .listing-image-wrap {
          flex-shrink: 0;
          width: 280px;
          height: 280px;
          border-radius: 14px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
          background: #f1f5f9;
        }

        .listing-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .listing-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 280px;
        }

        .listing-title {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.2px;
          margin-bottom: 10px;
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

        .location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 28px;
        }

        .details-section {
          margin-top: 4px;
          width: 100%;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 80px;
          width: 100%;
        }

        .detail-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 6px 0;
        }

        .detail-label {
          font-size: 14px;
          color: ${TEXT_SECONDARY};
          font-weight: 500;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          text-align: right;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 8px;
        }

        .btn {
          padding: 12px 32px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 160px;
          justify-content: center;
        }

        .btn-edit {
          background: ${CARD_BG};
          color: ${ACCENT};
          border: 1.5px solid ${ACCENT};
        }

        .btn-edit:hover {
          background: #eff6ff;
          transform: translateY(-1px);
        }

        .btn-publish {
          background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER});
          color: #fff;
          border: none;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
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

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .preview-container { padding: 20px 20px 40px; }
          .listing-card { flex-direction: column; padding: 24px; gap: 24px; }
          .listing-image-wrap { width: 100%; height: 260px; }
          .listing-content { min-height: auto; }
          .details-grid { grid-template-columns: 1fr; gap: 14px; }
          .actions { flex-direction: column; }
          .btn { width: 100%; }
          .draft-saved { display: none; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
        }

        @media (max-width: 480px) {
          .preview-container { padding: 16px 16px 40px; }
          .listing-card { padding: 20px; }
          .listing-image-wrap { height: 200px; }
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

          {/* Stepper */}
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

          <div className="page-header">
            <h1 className="section-title">Preview your listing</h1>
            <p className="section-subtitle">Review your listing details before publishing.</p>
          </div>

          <div className="listing-card">
            <div className="listing-image-wrap">
              <img
                src={mainImage}
                alt={listingData.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
            </div>

            <div className="listing-content">
              <h2 className="listing-title">{listingData.title}</h2>
              <div className="listing-price">
                NPR {formatPrice(listingData.price)} / {formatUnit(listingData.priceUnit)}
              </div>

              <div className="location-row">
                <FiMapPin size={14} color={TEXT_MUTED} />
                {listingData.location}
              </div>

              <div className="details-section">
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Delivery Radius</span>
                    <span className="detail-value">{listingData.deliveryRadius}Km</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Min. Order Amount</span>
                    <span className="detail-value">NPR {formatPrice(listingData.minOrderAmount)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hygiene Rating</span>
                    <span className="detail-value">{listingData.hygieneRating} / 5</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subscription</span>
                    <span className="detail-value">
                      {listingData.subscriptionAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Delivery Days</span>
                    <span className="detail-value">{formatDeliveryDays(listingData.deliveryDays)}</span>
                  </div>
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