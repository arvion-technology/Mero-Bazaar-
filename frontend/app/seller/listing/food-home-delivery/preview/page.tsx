"use client";

import { useState } from "react";
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
import { useDraft, defaultFoodDeliveryData } from "../layout";
import { useSession } from "next-auth/react";
import { formToCreateFoodsPayload } from "@/lib/adapters/foodsAdapter";

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

const formatFoodType = (type: string) => type.replace(/_/g, " ").toLowerCase();

export default function PreviewFoodDeliveryPage() {
  const router = useRouter();
  const { foodData, images, setFoodData, setImages } = useDraft();
  const [isPublishing, setIsPublishing] = useState(false);
  const { data: session } = useSession();

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

  const formatUnit = (unit: string) => unit.replace(/_/g, " ").toLowerCase();

  const mainImage = images.find((img) => img.isMain)?.preview || images[0]?.preview || "";

  const handlePublish = async () => {
    if (isPublishing) return;

    if (images.length === 0) {
      toast.error("Please add at least one photo before publishing");
      return;
    }

    setIsPublishing(true);
    try {
      const payload = formToCreateFoodsPayload(foodData);

      const listingRes = await fetch("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!listingRes.ok) {
        const err = await listingRes.json().catch(() => null);
        throw new Error(err?.message || "Failed to create listing");
      }

      const listing = await listingRes.json();

      const photoFormData = new FormData();
      images.forEach(({ file }) => photoFormData.append("images", file));
      const mainIndex = images.findIndex((i) => i.isMain);
      photoFormData.append("mainImageIndex", String(mainIndex >= 0 ? mainIndex : 0));

      const photosRes = await fetch(`/api/foods/${listing.id}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.accessToken}` },
        body: photoFormData,
      });

      if (!photosRes.ok) {
        const err = await photosRes.json().catch(() => null);
        throw new Error(err?.message || "Listing created but photo upload failed");
      }

      toast.success("Listing published successfully!");

      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setFoodData(defaultFoodDeliveryData);

      router.push("/seller/products");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong publishing");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    router.push("/seller/listing/food-home-delivery");
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .listing-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          color: ${TEXT_MUTED};
          font-size: 14px;
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

        .food-type-badge {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 4px 12px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: ${ACCENT};
          text-transform: capitalize;
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
          margin-bottom: 20px;
        }

        .description-section {
          margin-bottom: 20px;
        }

        .description-title {
          font-size: 13px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 6px;
        }

        .description-text {
          font-size: 14px;
          line-height: 1.6;
          color: ${TEXT_SECONDARY};
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
              {mainImage ? (
                <img src={mainImage} alt={foodData.title} />
              ) : (
                <span className="no-image">📷 No Image</span>
              )}
            </div>

            <div className="listing-content">
              <h2 className="listing-title">{foodData.title || "Untitled Listing"}</h2>

              <div className="food-type-badge">{formatFoodType(foodData.foodType)}</div>

              <div className="listing-price">
                NPR {formatPrice(foodData.price)} / {formatUnit(foodData.priceUnit)}
              </div>

              <div className="location-row">
                <FiMapPin size={14} color={TEXT_MUTED} />
                {foodData.location || "Location not specified"}
              </div>

              <div className="description-section">
                <div className="description-title">Description</div>
                <p className="description-text">{foodData.description || "No description provided."}</p>
              </div>

              <div className="details-section">
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Delivery Days</span>
                    <span className="detail-value">{formatDeliveryDays(foodData.deliveryDays)}</span>
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