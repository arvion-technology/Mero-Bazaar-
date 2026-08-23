"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiUploadCloud,
  FiX,
  FiFileText,
  FiBriefcase,
  FiPlus,
  FiInfo,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDraft } from "../layout";

const ACCENT = "#2563eb";
const DANGER = "#dc2626";
const SUCCESS = "#10b981";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

const MAX_IMAGES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const steps = [
  { label: "Category", icon: FiFileText, status: "done" as const },
  { label: "Details", icon: FiBriefcase, status: "done" as const },
  { label: "Availability", icon: FiClock, status: "done" as const },
  { label: "Photos", icon: FiPlus, status: "active" as const },
  { label: "Preview", icon: FiInfo, status: "upcoming" as const },
];

export default function AddMedicalPhotosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { images, setImages } = useDraft();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a valid image (JPG, PNG only)`);
        return false;
      }
      return true;
    });
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);
    if (newFiles.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more image(s) can be added`);
    }
    const newImages = filesToAdd.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      isMain: images.length === 0 && index === 0,
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
      filtered[0].isMain = true;
    }
    setImages(filtered);
  };

  const setMainImage = (id: string) => {
    setImages(images.map((img) => ({ ...img, isMain: img.id === id })));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [images]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    toast.success("Photos saved! Proceeding to preview...");
    router.push("/seller/listing/medical-dental/preview");
  };

  const canAddMore = images.length < MAX_IMAGES;
  
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .photos-page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .photos-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        .photos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1.5px solid ${BORDER};
          background: ${CARD_BG};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${TEXT_PRIMARY};
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
          transform: translateX(-2px);
        }

        .back-btn:active { transform: translateX(0) scale(0.96); }

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
          position: relative;
        }

        .step-connector.filled { background: ${SUCCESS}; }

        .title-section { margin-bottom: 28px; }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 15px;
          color: ${TEXT_SECONDARY};
        }

        .drop-zone {
          border: 2px dashed ${isDragging ? ACCENT : "#c4b5fd"};
          border-radius: 20px;
          padding: 56px 24px;
          background: ${isDragging ? "#eff6ff" : CARD_BG};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          cursor: pointer;
          margin-bottom: 32px;
          transition: all 0.3s ease;
        }

        .drop-zone:hover {
          border-color: ${ACCENT};
          background: #f8fbff;
        }

        .drop-zone-icon { color: ${ACCENT}; opacity: 0.8; }

        .drop-zone-text {
          font-size: 15px;
          color: ${TEXT_SECONDARY};
          font-weight: 500;
        }

        .upload-btn-inline {
          padding: 10px 28px;
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .upload-btn-inline:hover {
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
          transform: translateY(-1px);
        }

        .drop-zone-hint {
          font-size: 12.5px;
          color: ${TEXT_MUTED};
        }

        .image-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }

        .image-card {
          position: relative;
          width: 160px;
          height: 160px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid ${BORDER};
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .image-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .image-card.main {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 8px;
          letter-spacing: 0.3px;
        }

        .remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          border: 1px solid ${BORDER};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${TEXT_SECONDARY};
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: #fff;
          color: ${DANGER};
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .add-more-card {
          width: 160px;
          height: 160px;
          border-radius: 16px;
          border: 2px dashed #c4b5fd;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          background: ${CARD_BG};
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .add-more-card:hover {
          border-color: ${ACCENT};
          background: #f8fbff;
          transform: translateY(-2px);
        }

        .add-more-card span {
          font-size: 14px;
          color: ${TEXT_MUTED};
          font-weight: 500;
        }

        .photo-count {
          text-align: right;
          font-size: 15px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          margin-bottom: 32px;
        }

        .photo-count span { color: ${ACCENT}; }

        .tips-section {
          margin-bottom: 40px;
          background: ${CARD_BG};
          border: 1.5px solid ${BORDER};
          border-radius: 16px;
          padding: 24px 28px;
        }

        .tips-title {
          font-size: 16px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tips-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tips-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14.5px;
          color: ${TEXT_SECONDARY};
          line-height: 1.5;
        }

        .tips-list li::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${ACCENT};
          margin-top: 7px;
          flex-shrink: 0;
        }

        .submit-wrap {
          display: flex;
          justify-content: center;
        }

        .submit-btn {
          padding: 16px 48px;
          background: linear-gradient(135deg, ${ACCENT}, #1d4ed8);
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 280px;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.25);
        }

        .submit-btn:hover {
          box-shadow: 0 6px 28px rgba(37, 99, 235, 0.35);
          transform: translateY(-2px);
        }

        .submit-btn:active { transform: translateY(0); }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .photos-container { padding: 20px 20px 48px; }
          .image-card, .add-more-card { width: 140px; height: 140px; }
          .submit-btn { min-width: 100%; }
          .tips-section { padding: 20px; }
          .page-title { font-size: 24px; }
          .stepper { padding: 14px 16px; }
          .step-label { display: none; }
          .step-connector { margin: 0 6px; min-width: 16px; }
        }

        @media (max-width: 480px) {
          .photos-container { padding: 16px 16px 40px; }
          .image-card, .add-more-card { width: calc(50% - 8px); height: 140px; }
          .drop-zone { padding: 40px 16px; }
        }
      `}</style>

      <div className="photos-page">
        <div className="photos-container">
          <div className="photos-header">
            <button type="button" className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={18} />
            </button>
            <div className="draft-badge">
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

          <div className="title-section">
            <h1 className="page-title">Add Photos</h1>
            <p className="page-subtitle">Add up to 10 photos. First photo will be your main photo.</p>
          </div>

          {images.length === 0 ? (
            <div
              className="drop-zone"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FiUploadCloud size={40} className="drop-zone-icon" />
              <span className="drop-zone-text">Drag & Drop images here or</span>
              <button
                type="button"
                className="upload-btn-inline"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Upload Images
              </button>
              <span className="drop-zone-hint">You can upload up to 10 images (JPG, PNG)</span>
            </div>
          ) : (
            <>
              <div className="image-grid">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`image-card ${img.isMain ? "main" : ""}`}
                    onClick={() => !img.isMain && setMainImage(img.id)}
                  >
                    <img src={img.preview} alt={img.file.name} />
                    {img.isMain && <div className="main-badge">MAIN</div>}
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
                {canAddMore && (
                  <div
                    className="add-more-card"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <FiUploadCloud size={28} color={ACCENT} />
                    <span>Add More</span>
                  </div>
                )}
              </div>
              <div className="photo-count">
                <span>{images.length}</span>/{MAX_IMAGES} photos
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          <div className="tips-section">
            <h3 className="tips-title">
              <FiInfo size={18} color={ACCENT} />
              Photo Tips
            </h3>
            <ul className="tips-list">
              <li>Use a clear, professional headshot for your main profile photo</li>
              <li>Include photos of your clinic or hospital environment</li>
              <li>Upload certificates or credentials to build patient trust</li>
              <li>Avoid blurry or dark images — use good lighting</li>
            </ul>
          </div>

          <div className="submit-wrap">
            <button
              type="button"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={images.length === 0}
            >
              <FiCheck size={18} /> Save & Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}