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
  FiGlobe,
  FiShield,
  FiHeart,
  FiTruck,
  FiClock,
  FiCheckCircle,
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

interface ListingData {
  listingType: string;
  itemName: string;
  price: string;
  unit: string;
  location: string;
  district: string;
  village: string;
  description: string;
  // Produce
  organicCertified?: boolean;
  organicVerified?: boolean;
  seasonalAvailability?: string;
  // LiveStock
  animalType?: string;
  age?: string;
  breed?: string;
  healthVaccineStatus?: string;
  // Vet Service
  serviceType?: string;
  experience?: string;
  mobileService?: boolean;
  serviceArea?: string;
  serviceRadius?: string;
  healthCertificate?: boolean;
  vaccinationAvailable?: boolean;
  availabilityDays?: string[];
}

interface ListingImage {
  preview: string;
  isMain: boolean;
}

export default function PreviewPage() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [data, setData] = useState<ListingData | null>(null);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const savedData = localStorage.getItem("agricultureListingData");
    const savedImages = localStorage.getItem("agricultureListingImages");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setData(parsed);
      // Set default itemName if empty
      if (!parsed.itemName) {
        parsed.itemName = parsed.listingType === "Vet Service" ? "General Health Checkup at Home" : "Fresh Organic Vegetable";
      }
    }
    if (savedImages) {
      const parsedImages: ListingImage[] = JSON.parse(savedImages);
      setImages(parsedImages);
      const main = parsedImages.find((img) => img.isMain);
      setMainImage(main ? main.preview : parsedImages[0]?.preview || "");
    }
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Listing published successfully!");
    setIsPublishing(false);
    localStorage.removeItem("agricultureListingData");
    localStorage.removeItem("agricultureListingImages");
    router.push("/seller/products");
  };

  const handleEdit = () => {
    router.push("/seller/listing/agriculture-livestock");
  };

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG }}>
        <p style={{ color: TEXT_MUTED }}>Loading listing data...</p>
      </div>
    );
  }

  const isProduce = data.listingType === "Produce";
  const isLiveStock = data.listingType === "LiveStock";
  const isVetService = data.listingType === "Vet Service";

  // Build detail rows based on listing type
  const detailRows = isProduce
    ? [
        { label: "Listing Type", value: data.listingType, icon: <FiTag size={16} /> },
        { label: "Unit", value: data.unit, icon: <FiAward size={16} /> },
        { label: "Organic Certified", value: data.organicCertified ? "Yes" : "No", icon: <FiCheckCircle size={16} /> },
        { label: "Season", value: data.seasonalAvailability || "-", icon: <FiCalendar size={16} /> },
      ]
    : isLiveStock
    ? [
        { label: "Location / Area", value: data.location, icon: <FiMapPin size={16} /> },
        { label: "Breed", value: data.breed || "-", icon: <FiAward size={16} /> },
        { label: "Age", value: data.age || "-", icon: <FiCalendar size={16} /> },
        { label: "Unit", value: data.unit, icon: <FiAward size={16} /> },
        { label: "Organic Certified", value: data.organicCertified ? "Yes" : "No", icon: <FiCheckCircle size={16} /> },
        { label: "Health / Vaccine Status", value: data.healthVaccineStatus || "-", icon: <FiShield size={16} /> },
      ]
    : [
        { label: "Service Type", value: data.serviceType || "-", icon: <FiTag size={16} /> },
        { label: "Animal Type", value: data.animalType || "-", icon: <FiHeart size={16} /> },
        { label: "Experience", value: data.experience || "-", icon: <FiAward size={16} /> },
        { label: "Mobile Vet", value: data.mobileService ? "Yes" : "No", icon: <FiTruck size={16} /> },
        { label: "Vaccination", value: data.vaccinationAvailable ? "Yes" : "No", icon: <FiShield size={16} /> },
        { label: "Service Radius", value: data.serviceRadius ? `${data.serviceRadius} KM` : "-", icon: <FiGlobe size={16} /> },
        { label: "Health Certified", value: data.healthCertificate ? "Yes" : "No", icon: <FiCheckCircle size={16} /> },
        { label: "Availability", value: data.availabilityDays?.join("-") || "-", icon: <FiClock size={16} /> },
      ];

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
          position: relative;
        }

        .card-layout {
          display: flex;
          gap: 28px;
        }

        .image-section {
          flex: 0 0 320px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .main-image {
          width: 100%;
          aspect-ratio: 1;
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

        .certified-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.95);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: ${SUCCESS};
        }

        .certified-badge::before {
          content: '';
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${SUCCESS};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumbnail-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .thumbnail {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid ${BORDER};
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }

        .thumbnail:hover {
          border-color: ${ACCENT};
        }

        .thumbnail.active {
          border-color: ${ACCENT};
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .price-unit {
          font-weight: 500;
          opacity: 0.8;
        }

        .listing-location {
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

        .info-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding: 6px 0;
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

        .location-bar {
          display: flex;
          gap: 24px;
          margin-top: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid ${BORDER};
        }

        .location-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: ${TEXT_SECONDARY};
        }

        .location-item svg {
          color: ${TEXT_MUTED};
        }

        .location-label {
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          display: block;
          margin-bottom: 2px;
        }

        .actions {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin-top: 24px;
        }

        .btn {
          padding: 12px 32px;
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
          min-width: 180px;
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
          .card-layout { flex-direction: column; }
          .image-section { flex: 0 0 auto; width: 100%; }
          .main-image { max-width: 320px; margin: 0 auto; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
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
            <div className="card-layout">
              {/* Image Section */}
              <div className="image-section">
                <div className="main-image">
                  {mainImage ? (
                    <>
                      <img src={mainImage} alt={data.itemName} />
                      {(isProduce || isLiveStock) && data.organicCertified && (
                        <div className="certified-badge">
                          <FiCheckCircle size={12} />
                          {isVetService ? "Verified" : "Organic certified"}
                        </div>
                      )}
                      {isVetService && (
                        <div className="certified-badge">
                          <FiCheckCircle size={12} />
                          Verified
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_MUTED }}>
                      📷 No Image
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="thumbnail-row">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`thumbnail ${img.preview === mainImage ? "active" : ""}`}
                        onClick={() => setMainImage(img.preview)}
                      >
                        <img src={img.preview} alt={`Thumbnail ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="card-info">
                <h2 className="listing-title">{data.itemName}</h2>
                <div className="listing-price">
                  NPR {data.price}
                  <span className="price-unit">/ {data.unit}</span>
                </div>

                <div className="listing-location">
                  <FiMapPin size={14} />
                  {data.location}
                </div>

                <div className="divider" />

                <div className="info-rows">
                  {detailRows.map((row) => (
                    <div key={row.label} className="info-row">
                      <div className="info-row-left">
                        {row.icon}
                        {row.label}
                      </div>
                      <div className="info-row-right">{row.value}</div>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <div className="description-section">
                  <div className="description-title">Description</div>
                  <p className="description-text">{data.description}</p>
                </div>

                {/* Location Bar */}
                <div className="location-bar">
                  <div className="location-item">
                    <FiMapPin size={16} />
                    <div>
                      <span className="location-label">District</span>
                      <span>{data.district}</span>
                    </div>
                  </div>
                  <div className="location-item">
                    <FiMapPin size={16} />
                    <div>
                      <span className="location-label">{isVetService ? "Service Radius" : "Location"}</span>
                      <span>{isVetService ? `${data.serviceRadius} KM` : data.location}</span>
                    </div>
                  </div>
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