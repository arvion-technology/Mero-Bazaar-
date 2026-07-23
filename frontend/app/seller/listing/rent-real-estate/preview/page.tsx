"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiEdit2,
  FiSend,
  FiUser,
  FiCalendar,
  FiDroplet,
  FiMaximize,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

import { LuBed } from "react-icons/lu";
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

const defaultListingData = {
  title: "2 BHK Apartment for Rent in Kalanki",
  location: "Kathmandu, Nepal, Ward 14",
  rentMin: "25,000",
  rentMax: "55,000",
  payPeriod: "Month",
  isOwner: true,
  noBroker: true,
  availableFrom: "15 Jul 2026",
  bedrooms: "2",
  bathrooms: "2",
  sqft: "900",
  amenities: [
    { label: "Furnished", icon: FiCheckCircle },
    { label: "Parking", icon: FiCheckCircle },
    { label: "Wifi", icon: FiCheckCircle },
    { label: "Water included", icon: FiCheckCircle },
    { label: "Electricity Includes", icon: FiCheckCircle },
    { label: "Pet Friendly", icon: FiCheckCircle },
  ],
};

export default function PreviewListingPage() {
  const router = useRouter();

  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Load photos from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("listingPhotos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImages(parsed.map((p: { preview: string }) => p.preview));
        } else {
          setImages([
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&h=90&fit=crop",
            "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=120&h=90&fit=crop",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=120&h=90&fit=crop",
            "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=120&h=90&fit=crop",
          ]);
        }
      } catch {
        setImages([
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&h=90&fit=crop",
          "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=120&h=90&fit=crop",
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=120&h=90&fit=crop",
          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=120&h=90&fit=crop",
        ]);
      }
    } else {
      setImages([
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&h=90&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=120&h=90&fit=crop",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=120&h=90&fit=crop",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=120&h=90&fit=crop",
      ]);
    }
  }, []);

  const handlePublish = () => {
    toast.success("Listing published successfully!");
    sessionStorage.removeItem("listingPhotos");
    router.push("/seller/products");
  };

  const handleEdit = () => {
    router.push("/seller/listing/rent-real-estate/photos");
  };

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentMain = images[mainImageIndex] || images[0];
  const remaining = Math.max(images.length - 4, 0);

  // Get thumbnails excluding the main image
  const thumbImages = images.filter((_, i) => i !== mainImageIndex).slice(0, 3);

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
          flex-wrap: wrap;
          gap: 12px;
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

        /* Listing Card */
        .listing-card {
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          gap: 24px;
        }

        /* Image Gallery */
        .gallery {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
          width: 280px;
        }

        .main-image {
          width: 280px;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
          position: relative;
          cursor: pointer;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .main-image:hover img {
          transform: scale(1.03);
        }

        .main-image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .main-image:hover .main-image-overlay {
          background: rgba(0,0,0,0.08);
        }

        .thumbnail-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .thumbnail {
          width: 52px;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .thumbnail:hover {
          border-color: ${ACCENT};
          transform: scale(1.05);
        }

        .thumbnail.active {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail.more {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          font-size: 12px;
          font-weight: 600;
          color: ${TEXT_SECONDARY};
          cursor: pointer;
        }

        /* Listing Info */
        .listing-info {
          flex: 1;
          min-width: 0;
        }

        .listing-title {
          font-size: 20px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.2px;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .listing-price {
          font-size: 18px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 10px;
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 14px;
          word-break: break-word;
        }

        .divider {
          height: 1px;
          background: ${BORDER};
          margin: 12px 0;
        }

        /* Meta Row */
        .meta-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: ${TEXT_SECONDARY};
          font-weight: 500;
        }

        /* Specs Row */
        .specs-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: ${TEXT_PRIMARY};
          font-weight: 600;
        }

        /* Amenities */
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px 16px;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: ${TEXT_SECONDARY};
          font-weight: 500;
        }

        .amenity-item svg {
          color: ${SUCCESS};
          flex-shrink: 0;
        }

        /* Actions */
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

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-content img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 12px;
          object-fit: contain;
        }

        .lightbox-close {
          position: absolute;
          top: -48px;
          right: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .lightbox-close:hover {
          background: rgba(255,255,255,0.3);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .lightbox-nav:hover {
          background: rgba(255,255,255,0.3);
        }

        .lightbox-nav.prev { left: -60px; }
        .lightbox-nav.next { right: -60px; }

        .lightbox-counter {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          font-weight: 500;
        }

        /* ===== RESPONSIVE ===== */

        /* Tablet */
        @media (max-width: 768px) {
          .preview-container { padding: 16px 16px 32px; }
          .listing-card { flex-direction: column; padding: 16px; gap: 16px; }
          .gallery { width: 100%; }
          .main-image { width: 100%; height: 220px; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
          .meta-row { flex-direction: column; align-items: flex-start; gap: 6px; }
          .specs-row { flex-direction: column; align-items: flex-start; gap: 6px; }
          .amenities-grid { grid-template-columns: repeat(2, 1fr); }
          .listing-title { font-size: 18px; }
          .listing-price { font-size: 16px; }
          .lightbox-nav.prev { left: 12px; }
          .lightbox-nav.next { right: 12px; }
          .lightbox-close { top: 12px; right: 12px; background: rgba(0,0,0,0.5); }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .preview-container { padding: 12px 12px 24px; }
          .listing-card { padding: 12px; border-radius: 16px; }
          .main-image { height: 180px; }
          .amenities-grid { grid-template-columns: 1fr; }
          .thumbnail { width: 48px; height: 36px; }
          .section-title { font-size: 18px; }
          .btn { padding: 10px 20px; font-size: 13px; }
        }

        /* Medium tablet / small desktop */
        @media (min-width: 769px) and (max-width: 900px) {
          .preview-container { padding: 20px 20px 32px; }
          .listing-card { gap: 20px; }
          .gallery { width: 240px; }
          .main-image { width: 240px; height: 170px; }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .preview-container { max-width: 1000px; padding: 32px 40px 48px; }
          .gallery { width: 320px; }
          .main-image { width: 320px; height: 240px; }
          .thumbnail { width: 60px; height: 44px; }
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
            {/* Image Gallery - Read Only */}
            <div className="gallery">
              <div className="main-image" onClick={() => openLightbox(mainImageIndex)}>
                <img src={currentMain} alt="Main" />
                <div className="main-image-overlay" />
              </div>
              <div className="thumbnail-row">
                {thumbImages.map((img, idx) => {
                  const actualIdx = images.indexOf(img);
                  return (
                    <div
                      key={actualIdx}
                      className="thumbnail"
                      onClick={() => setMainImageIndex(actualIdx)}
                    >
                      <img src={img} alt={`Thumbnail ${actualIdx + 1}`} />
                    </div>
                  );
                })}
                {remaining > 0 && (
                  <div className="thumbnail more" onClick={() => openLightbox(3)}>
                    +{remaining}
                  </div>
                )}
              </div>
            </div>

            {/* Listing Info */}
            <div className="listing-info">
              <h2 className="listing-title">{defaultListingData.title}</h2>
              <div className="listing-price">
                NPR {defaultListingData.rentMin} - {defaultListingData.rentMax} / {defaultListingData.payPeriod}
              </div>
              <div className="location-row">
                <FiMapPin size={14} />
                {defaultListingData.location}
              </div>

              <div className="divider" />

              <div className="meta-row">
                <div className="meta-item">
                  <FiUser size={14} />
                  {defaultListingData.isOwner ? "Owner" : "Agent"}
                </div>
                <div className="meta-item">
                  <FiCheck size={14} />
                  {defaultListingData.noBroker ? "No Broker" : "Broker Allowed"}
                </div>
                <div className="meta-item">
                  <FiCalendar size={14} />
                  Available from {defaultListingData.availableFrom}
                </div>
              </div>

              <div className="divider" />

              <div className="specs-row">
                <div className="spec-item">
                  <LuBed size={14} />
                  {defaultListingData.bedrooms} beds
                </div>
                <div className="spec-item">
                  <FiDroplet size={14} />
                  {defaultListingData.bathrooms} Baths
                </div>
                <div className="spec-item">
                  <FiMaximize size={14} />
                  {defaultListingData.sqft} sq.ft
                </div>
              </div>

              <div className="divider" />

              <div className="amenities-grid">
                {defaultListingData.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-item">
                    <amenity.icon size={14} />
                    {amenity.label}
                  </div>
                ))}
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <FiX size={20} />
            </button>
            <button className="lightbox-nav prev" onClick={lightboxPrev}>
              <FiChevronLeft size={24} />
            </button>
            <img src={images[lightboxIndex]} alt={`Image ${lightboxIndex + 1}`} />
            <button className="lightbox-nav next" onClick={lightboxNext}>
              <FiChevronRight size={24} />
            </button>
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}