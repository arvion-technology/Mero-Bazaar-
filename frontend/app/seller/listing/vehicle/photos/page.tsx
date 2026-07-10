"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUploadCloud, FiX, FiImage, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT       = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const ACCENT_LIGHT = "#eff6ff";
const ACCENT_SOFT  = "#dbeafe";
const DANGER       = "#ef4444";
const SUCCESS      = "#10b981";
const BORDER       = "#e2e8f0";
const BORDER_DASHED = "#c4b5fd";
const TEXT_HEADING = "#0f172a";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED   = "#94a3b8";
const BG           = "#f8fafc";
const CARD_BG      = "#ffffff";

export default function AddPhotosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const maxPhotos = 10;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = maxPhotos - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }
    const toProcess = Array.from(files).slice(0, remaining);
    toProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [images.length]);

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };


  const handleContinue = () => {
  if (images.length === 0) {
    toast.error("Please upload at least one photo");
    return;
  }
  setIsUploading(true);
  setTimeout(() => {
    setIsUploading(false);
    toast.success("Photos saved!");
    router.push("/seller/listing/vehicle/preview");  
  }, 1200);
};

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .photos-page {
          min-height: 100vh;
          background: ${BG};
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .photos-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        .photos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .photos-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
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
          text-decoration: none;
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
          transform: translateX(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .back-btn:active {
          transform: translateX(0) scale(0.96);
        }

        .draft-saved {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .draft-saved svg {
          stroke-width: 3;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: ${TEXT_HEADING};
          letter-spacing: -0.4px;
          margin-bottom: 10px;
        }

        .section-subtitle {
          font-size: 15px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .dropzone {
          border: 2px dashed ${BORDER_DASHED};
          border-radius: 16px;
          padding: 48px 32px;
          text-align: center;
          background: linear-gradient(135deg, #fafafa, #f8f6ff);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .dropzone::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.03), rgba(139,92,246,0.03));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .dropzone:hover {
          border-color: #a78bfa;
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139,92,246,0.08);
        }

        .dropzone:hover::before {
          opacity: 1;
        }

        .dropzone.drag-over {
          border-color: ${ACCENT};
          background: linear-gradient(135deg, ${ACCENT_LIGHT}, #e0e7ff);
          transform: scale(1.01);
          box-shadow: 0 12px 32px rgba(37,99,235,0.12);
        }

        .dropzone-content {
          position: relative;
          z-index: 1;
        }

        .dropzone-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          color: ${TEXT_PRIMARY};
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .dropzone:hover .dropzone-icon {
          transform: translateY(-4px) scale(1.05);
        }

        .dropzone-text {
          font-size: 15px;
          font-weight: 500;
          color: ${TEXT_PRIMARY};
          margin-bottom: 16px;
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: ${ACCENT};
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(37,99,235,0.25);
          margin-bottom: 12px;
        }

        .upload-btn:hover {
          background: ${ACCENT_HOVER};
          box-shadow: 0 6px 24px rgba(37,99,235,0.35);
          transform: translateY(-2px);
        }

        .upload-btn:active {
          transform: translateY(0);
        }

        .dropzone-hint {
          font-size: 12px;
          color: ${TEXT_MUTED};
          font-weight: 400;
        }

        .photo-counter {
          text-align: right;
          font-size: 15px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          margin-top: 16px;
          margin-bottom: 32px;
        }

        .photo-counter .count {
          color: ${ACCENT};
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .photo-item {
          aspect-ratio: 1;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          border: 1.5px solid ${BORDER};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: grab;
        }

        .photo-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: ${ACCENT_SOFT};
        }

        .photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .photo-item:hover img {
          transform: scale(1.08);
        }

        .photo-item .main-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 4px 10px;
          background: ${ACCENT};
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .photo-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(239,68,68,0.9);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(4px);
        }

        .photo-item:hover .photo-remove {
          opacity: 1;
          transform: scale(1);
        }

        .photo-remove:hover {
          background: ${DANGER};
          transform: scale(1.1) !important;
        }

        .photo-add-more {
          aspect-ratio: 1;
          border-radius: 14px;
          border: 2px dashed ${BORDER};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, #fafafa, #f8fafc);
          color: ${TEXT_MUTED};
          font-size: 12px;
          font-weight: 500;
        }

        .photo-add-more:hover {
          border-color: ${ACCENT};
          color: ${ACCENT};
          background: linear-gradient(135deg, ${ACCENT_LIGHT}, #dbeafe);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.08);
        }

        .tips-section {
          margin-top: 8px;
        }

        .tips-title {
          font-size: 16px;
          font-weight: 700;
          color: ${TEXT_HEADING};
          margin-bottom: 14px;
          letter-spacing: -0.2px;
        }

        .tips-list {
          list-style: none;
          padding: 0;
        }

        .tips-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .tips-list li::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${ACCENT};
          margin-top: 7px;
          flex-shrink: 0;
          opacity: 0.6;
        }

        .continue-wrap {
          display: flex;
          justify-content: center;
          margin-top: 40px;
          padding-top: 8px;
        }

        .continue-btn {
          padding: 16px 64px;
          background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER});
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }

        .continue-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.6s ease;
        }

        .continue-btn:hover::before {
          left: 100%;
        }

        .continue-btn:hover {
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.4);
          transform: translateY(-3px) scale(1.02);
        }

        .continue-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .continue-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .photos-container { padding: 24px 20px 48px; }
          .photo-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .dropzone { padding: 36px 24px; }
          .section-title { font-size: 20px; }
        }

        @media (max-width: 480px) {
          .photos-container { padding: 20px 16px 40px; }
          .photo-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .dropzone { padding: 28px 20px; border-radius: 12px; }
          .continue-btn { width: 100%; justify-content: center; padding: 16px 32px; }
          .draft-saved { display: none; }
        }
      `}</style>

      <div className="photos-page">
        <div className="photos-container">
          {/* Header */}
          <div className="photos-header">
            <div className="photos-header-left">
              <button type="button" className="back-btn" onClick={() => router.back()}>
                <FiArrowLeft size={18} />
              </button>
            </div>
            <div className="draft-saved">
              Draft Saved <FiCheck size={16} />
            </div>
          </div>

          {/* Title */}
          <h1 className="section-title">Add Photos</h1>
          <p className="section-subtitle">Add up to 10 photos. First photo will be your main photo.</p>

          {/* Dropzone or Grid */}
          {images.length === 0 ? (
            <>
              <div
                className={`dropzone ${isDragging ? "drag-over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="dropzone-content">
                  <FiUploadCloud size={48} className="dropzone-icon" />
                  <p className="dropzone-text">Drag & Drop images here or</p>
                  <button type="button" className="upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    <FiImage size={16} /> Upload Images
                  </button>
                  <p className="dropzone-hint">You can upload up to 10 images (JPG, PNG)</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </>
          ) : (
            <>
              <div className="photo-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="photo-item">
                    <img src={img} alt={`Photo ${idx + 1}`} />
                    {idx === 0 && <span className="main-badge">Main</span>}
                    <button type="button" className="photo-remove" onClick={() => removeImage(idx)}>
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
                {images.length < maxPhotos && (
                  <div className="photo-add-more" onClick={() => fileInputRef.current?.click()}>
                    <FiUploadCloud size={24} />
                    <span>Add More</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </>
          )}

          {/* Counter */}
          <div className="photo-counter">
            <span className="count">{images.length}</span>/{maxPhotos} photos
          </div>

          {/* Tips */}
          <div className="tips-section">
            <h3 className="tips-title">Photo Tips</h3>
            <ul className="tips-list">
              <li>Use clear, well-lit photos</li>
              <li>Show the item from multiple angles</li>
              <li>Avoid Screenshot or stock images</li>
            </ul>
          </div>

          {/* Continue */}
          <div className="continue-wrap">
            <button type="button" className="continue-btn" onClick={handleContinue} disabled={isUploading}>
              {isUploading ? (
                <><span className="spinner" />Uploading...</>
              ) : (
                <><FiCheck size={18} />Save & Continue</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}