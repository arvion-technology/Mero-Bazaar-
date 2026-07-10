"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT       = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS      = "#10b981";
const BORDER       = "#e2e8f0";
const TEXT_HEADING = "#0f172a";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";
const BG           = "#f8fafc";
const CARD_BG      = "#ffffff";

export default function PreviewListingPage() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const listing = {
    category: "Vehicle",
    title: "Toyota Fortuner 2021",
    price: "NPR 38,50,000",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    ],
    details: [
      { label: "Vehicle Type", value: "Car" },
      { label: "Condition", value: "Like New" },
      { label: "Brand", value: "Toyota" },
      { label: "Model", value: "Fortuner" },
      { label: "Model Year", value: "2021" },
      { label: "KM Driven", value: "45,000 km" },
      { label: "Location", value: "Lalitpur, Nepal" },
    ],
    description:
      "Toyota Fortuner 2021 model in excellent condition. Well maintained, all documents are valid.",
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast.success("Listing published successfully!");
      router.push("/seller/dashboard/products");
    }, 1500);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .preview-page {
          height: 100vh;
          background: ${BG};
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .preview-container {
          flex: 1;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-shrink: 0;
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

        .draft-saved svg {
          stroke-width: 3;
        }

        .page-header {
          flex-shrink: 0;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_HEADING};
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
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          margin-bottom: 20px;
        }

        .card-layout {
          display: flex;
          gap: 28px;
          flex: 1;
          min-height: 0;
        }

        .card-images {
          flex: 0 0 360px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 0;
        }

        .main-image {
          flex: 1;
          min-height: 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
          position: relative;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          flex-shrink: 0;
        }

        .gallery-thumb {
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0.7;
        }

        .gallery-thumb:hover {
          opacity: 0.9;
        }

        .gallery-thumb.active {
          border-color: ${ACCENT};
          opacity: 1;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-info {
          flex: 1;
          min-width: 0;
          padding-top: 2px;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow-y: auto;
        }

        .card-info::-webkit-scrollbar {
          width: 4px;
        }

        .card-info::-webkit-scrollbar-track {
          background: transparent;
        }

        .card-info::-webkit-scrollbar-thumb {
          background: ${BORDER};
          border-radius: 4px;
        }

        .category-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #eff6ff;
          color: ${ACCENT};
          font-size: 12px;
          font-weight: 600;
          border-radius: 8px;
          text-transform: capitalize;
          margin-bottom: 12px;
          align-self: flex-start;
        }

        .listing-title {
          font-size: 20px;
          font-weight: 700;
          color: ${TEXT_HEADING};
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .listing-price {
          font-size: 20px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 20px;
        }

        .details-table {
          margin-bottom: 20px;
        }

        .details-row {
          display: flex;
          align-items: center;
          padding: 7px 0;
          font-size: 13px;
        }

        .details-row + .details-row {
          border-top: 1px solid ${BORDER};
        }

        .details-label {
          color: ${TEXT_SECONDARY};
          width: 100px;
          flex-shrink: 0;
        }

        .details-value {
          color: ${TEXT_PRIMARY};
          font-weight: 500;
          flex: 1;
          text-align: right;
        }

        .description-section {
          margin-top: auto;
          padding-top: 16px;
        }

        .description-title {
          font-size: 13px;
          font-weight: 700;
          color: ${TEXT_HEADING};
          margin-bottom: 6px;
        }

        .description-text {
          font-size: 13px;
          color: ${TEXT_SECONDARY};
          line-height: 1.6;
        }

        .actions {
          display: flex;
          gap: 50px;
          justify-content: center;
          flex-shrink: 0;
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
          .preview-page { height: auto; overflow: auto; }
          .preview-container { padding: 20px 20px 40px; }
          .card-layout { flex-direction: column; }
          .card-images { flex: 0 0 auto; width: 100%; }
          .main-image { aspect-ratio: 4/3; flex: none; min-height: 200px; }
          .actions { flex-direction: column; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
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
            <div className="card-layout">
              <div className="card-images">
                <div className="main-image">
                  <img src={listing.images[selectedImage]} alt={listing.title} />
                </div>
                <div className="gallery">
                  {listing.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`gallery-thumb ${selectedImage === idx ? "active" : ""}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <img src={img} alt={`Photo ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-info">
                <span className="category-badge">{listing.category}</span>
                <h2 className="listing-title">{listing.title}</h2>
                <div className="listing-price">{listing.price}</div>

                <div className="details-table">
                  {listing.details.map((detail, idx) => (
                    <div key={idx} className="details-row">
                      <span className="details-label">{detail.label}</span>
                      <span className="details-value">{detail.value}</span>
                    </div>
                  ))}
                </div>

                <div className="description-section">
                  <div className="description-title">Description</div>
                  <p className="description-text">{listing.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button
              className="btn btn-edit"
              onClick={() => router.push("/seller/listing/vehicle/photos")}
            >
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