"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiUploadCloud,
  FiX,
  FiCheck as FiCheckIcon,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const ACCENT_LIGHT = "#eff6ff";
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

export default function AddPhotosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<
    { id: string; file: File; preview: string; isMain: boolean }[]
  >([]);
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
      toast.warning(`Only ${remainingSlots} more image(s) can be added (max ${MAX_IMAGES})`);
    }

    const newImages = filesToAdd.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      isMain: images.length === 0 && index === 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [images.length]
  );

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

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === id,
      }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    toast.success("Photos saved! Proceeding to preview...");
    router.push("/seller/listing/secondhand-goods/preview");
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
          -moz-osx-font-smoothing: grayscale;
        }

        .photos-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        /* ── Header ── */
        .photos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
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
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .back-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .draft-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: ${SUCCESS};
        }

        /* ── Title Section ── */
        .title-section { margin-bottom: 24px; }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 15px;
          color: ${TEXT_SECONDARY};
        }

        /* ── Image Grid ── */
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
          transition: all 0.2s ease;
          cursor: pointer;
          flex-shrink: 0;
        }

        .image-card:hover {
          border-color: ${ACCENT};
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .image-card.main {
          border-color: ${ACCENT};
        }

        .image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: ${ACCENT};
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${TEXT_SECONDARY};
          transition: all 0.15s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .remove-btn:hover {
          background: #fff;
          color: ${DANGER};
          transform: scale(1.1);
        }

        /* ── Add More Button ── */
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
          transition: all 0.25s ease;
          background: ${CARD_BG};
          flex-shrink: 0;
        }

        .add-more-card:hover {
          border-color: ${ACCENT};
          background: ${ACCENT_LIGHT};
        }

        .add-more-icon {
          color: ${TEXT_MUTED};
        }

        .add-more-text {
          font-size: 14px;
          font-weight: 500;
          color: ${TEXT_MUTED};
        }

        /* ── Photo Count ── */
        .photo-count {
          text-align: right;
          font-size: 15px;
          font-weight: 600;
          color: ${TEXT_PRIMARY};
          margin-bottom: 32px;
        }

        .photo-count span {
          color: ${ACCENT};
        }

        /* ── Photo Tips ── */
        .tips-section { margin-bottom: 40px; }

        .tips-title {
          font-size: 18px;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 16px;
          letter-spacing: -0.2px;
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
          font-size: 15px;
          color: ${TEXT_SECONDARY};
          line-height: 1.4;
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

        /* ── Submit Button ── */
        .submit-wrap {
          display: flex;
          justify-content: center;
          padding-top: 8px;
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
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
          letter-spacing: 0.2px;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 280px;
          justify-content: center;
        }

        .submit-btn:hover {
          box-shadow: 0 6px 28px rgba(37, 99, 235, 0.4);
          transform: translateY(-2px);
        }

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.2);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* ── Drop Zone (shown when no images) ── */
        .drop-zone {
          border: 2px dashed ${isDragging ? ACCENT : "#c4b5fd"};
          border-radius: 16px;
          padding: 48px 24px;
          background: ${isDragging ? ACCENT_LIGHT : CARD_BG};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          transition: all 0.25s ease;
          cursor: pointer;
          margin-bottom: 32px;
        }

        .drop-zone:hover {
          border-color: ${ACCENT};
          background: ${ACCENT_LIGHT};
        }

        .upload-icon {
          color: ${TEXT_PRIMARY};
          margin-bottom: 4px;
        }

        .drop-text {
          font-size: 15px;
          font-weight: 500;
          color: ${TEXT_PRIMARY};
        }

        .upload-btn-inline {
          padding: 10px 24px;
          background: ${ACCENT};
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
        }

        .upload-btn-inline:hover {
          background: ${ACCENT_HOVER};
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .upload-hint {
          font-size: 12.5px;
          color: ${TEXT_MUTED};
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .photos-container { padding: 20px 20px 48px; }
          .page-title { font-size: 24px; }
          .image-card, .add-more-card { width: 140px; height: 140px; }
          .submit-btn { min-width: 100%; }
          .back-btn { width: 40px; height: 40px; }
        }
      `}</style>

      <div className="photos-page">
        <div className="photos-container">
          {/* Header */}
          <div className="photos-header">
            <button type="button" className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={18} />
            </button>
            <div className="draft-badge">
              Draft Saved <FiCheck size={16} />
            </div>
          </div>

          {/* Title */}
          <div className="title-section">
            <h1 className="page-title">Add Photos</h1>
            <p className="page-subtitle">
              Add up to 10 photos. First photo will be your main photo.
            </p>
          </div>

          {/* Images or Drop Zone */}
          {images.length === 0 ? (
            <div
              className="drop-zone"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FiUploadCloud size={36} className="upload-icon" />
              <span className="drop-text">Drag & Drop images here or</span>
              <button
                type="button"
                className="upload-btn-inline"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Upload Images
              </button>
              <span className="upload-hint">You can upload up to 10 images (JPG, PNG)</span>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id);
                      }}
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
                    <FiUploadCloud size={28} className="add-more-icon" />
                    <span className="add-more-text">Add More</span>
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

          {/* Photo Tips */}
          <div className="tips-section">
            <h3 className="tips-title">Photo Tips</h3>
            <ul className="tips-list">
              <li>Use clear, well-lit photos</li>
              <li>Show the item from multiple angles</li>
              <li>Avoid Screenshot or stock images</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="submit-wrap">
            <button
              type="button"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={images.length === 0}
            >
              <FiCheckIcon size={18} />
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}