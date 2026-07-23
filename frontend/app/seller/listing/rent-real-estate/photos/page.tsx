"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronRight,
  FiUploadCloud,
  FiX,
  FiCheck,
  FiImage,
  FiEye,
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
  { label: "Category", icon: FiCheck, status: "done" as const },
  { label: "Details", icon: FiCheck, status: "done" as const },
  { label: "Pricing", icon: FiCheck, status: "done" as const },
  { label: "Photos", icon: FiImage, status: "active" as const },
  { label: "Preview", icon: FiEye, status: "upcoming" as const },
];

const MAX_PHOTOS = 10;

export default function RealEstatePhotosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ id: string; preview: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Load any previously saved photos from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("listingPhotos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setPhotos(parsed);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Save to sessionStorage whenever photos change
  useEffect(() => {
    sessionStorage.setItem("listingPhotos", JSON.stringify(photos));
  }, [photos]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const filesToProcess = Array.from(files).slice(0, remaining);
    if (files.length > remaining)
      toast.warning(`Only ${remaining} more photo(s) can be added.`);
    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).slice(2),
            preview: e.target?.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, [photos.length]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    toast.success("Photos saved! Preview your listing.");
    router.push("/seller/listing/rent-real-estate/preview");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .listing-page { min-height: 100vh; background: ${BG}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .listing-container { max-width: 900px; margin: 0 auto; padding: 32px 24px 64px; }
        .listing-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .back-btn { width: 40px; height: 40px; border-radius: 12px; border: 1.5px solid ${BORDER}; background: ${CARD_BG}; display: flex; align-items: center; justify-content: center; cursor: pointer; color: ${TEXT_PRIMARY}; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 2px rgba(0,0,0,0.04); flex-shrink: 0; }
        .back-btn:hover { border-color: #cbd5e1; background: #f1f5f9; transform: translateX(-2px); }
        .listing-header-text { flex: 1; min-width: 0; }
        .listing-title { font-size: 26px; font-weight: 800; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px; line-height: 1.2; }
        .listing-subtitle { font-size: 13.5px; color: ${TEXT_SECONDARY}; margin-top: 3px; }
        .draft-badge { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${SUCCESS}; flex-shrink: 0; }
        .stepper { display: flex; align-items: center; background: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 18px 22px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); overflow-x: auto; }
        .step { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .step-icon-wrap { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; transition: all 0.25s ease; }
        .step.done .step-icon-wrap { background: ${SUCCESS}; color: #fff; }
        .step.active .step-icon-wrap { background: ${ACCENT}; color: #fff; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15); }
        .step.upcoming .step-icon-wrap { background: #f1f5f9; color: ${TEXT_MUTED}; }
        .step-label { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
        .step.done .step-label { color: ${SUCCESS}; } .step.active .step-label { color: ${ACCENT}; } .step.upcoming .step-label { color: ${TEXT_MUTED}; }
        .step-connector { flex: 1; height: 2px; background: #e2e8f0; margin: 0 14px; min-width: 24px; }
        .step-connector.filled { background: ${SUCCESS}; }
        .upload-card { background: ${CARD_BG}; border-radius: 20px; padding: 40px; border: 1px solid ${BORDER}; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03); margin-bottom: 24px; }
        .upload-title { font-size: 20px; font-weight: 700; color: ${TEXT_PRIMARY}; margin-bottom: 8px; letter-spacing: -0.3px; }
        .upload-subtitle { font-size: 14px; color: ${TEXT_SECONDARY}; margin-bottom: 24px; }
        .drop-zone { border: 2px dashed #c7d2fe; border-radius: 16px; padding: 48px 24px; text-align: center; background: linear-gradient(135deg, #f8fafc, #f1f5f9); transition: all 0.3s ease; cursor: pointer; }
        .drop-zone.dragging { border-color: ${ACCENT}; background: linear-gradient(135deg, #eff6ff, #dbeafe); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
        .drop-zone:hover { border-color: #93c5fd; background: linear-gradient(135deg, #eff6ff, #e0e7ff); }
        .upload-icon { color: ${TEXT_PRIMARY}; margin-bottom: 12px; }
        .upload-text { font-size: 14px; color: ${TEXT_SECONDARY}; margin-bottom: 16px; }
        .upload-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER}); color: #fff; font-size: 14px; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: all 0.25s ease; font-family: inherit; box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25); }
        .upload-btn:hover { box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35); transform: translateY(-1px); }
        .upload-hint { font-size: 12px; color: ${TEXT_MUTED}; margin-top: 12px; }
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-top: 24px; }
        .photo-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; border: 1.5px solid ${BORDER}; background: #f1f5f9; }
        .photo-item img { width: 100%; height: 100%; object-fit: cover; }
        .photo-item.main-photo::after { content: "Main"; position: absolute; top: 8px; left: 8px; background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER}); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
        .photo-remove { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; opacity: 0; }
        .photo-item:hover .photo-remove { opacity: 1; }
        .photo-remove:hover { background: rgba(220, 38, 38, 0.8); transform: scale(1.1); }
        .tips-card { background: ${CARD_BG}; border-radius: 20px; padding: 32px; border: 1px solid ${BORDER}; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03); margin-bottom: 24px; }
        .tips-title { font-size: 18px; font-weight: 700; color: ${TEXT_PRIMARY}; margin-bottom: 16px; letter-spacing: -0.3px; }
        .tips-list { list-style: none; padding: 0; }
        .tips-list li { font-size: 14px; color: ${TEXT_SECONDARY}; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 8px; line-height: 1.5; }
        .tips-list li::before { content: "•"; color: ${ACCENT}; font-weight: 700; flex-shrink: 0; }
        .submit-wrap { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 8px; gap: 16px; }
        .back-link { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${ACCENT}; background: none; border: 1.5px solid ${BORDER}; border-radius: 12px; padding: 12px 28px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; }
        .back-link:hover { border-color: ${ACCENT}; background: #eff6ff; }
        .submit-btn { padding: 14px 40px; background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER}); color: #fff; font-size: 15px; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3); letter-spacing: 0.2px; display: flex; align-items: center; gap: 8px; }
        .submit-btn:hover { box-shadow: 0 6px 28px rgba(37, 99, 235, 0.4); transform: translateY(-2px); }
        @media (max-width: 768px) { .listing-container { padding: 20px 20px 48px; } .upload-card { padding: 24px; border-radius: 16px; } .tips-card { padding: 24px; border-radius: 16px; } .listing-title { font-size: 22px; } .stepper { padding: 14px 16px; } .step-label { display: none; } .step-connector { margin: 0 6px; min-width: 16px; } .submit-wrap { flex-direction: column-reverse; } .back-link, .submit-btn { width: 100%; justify-content: center; } .photo-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <div className="listing-page">
        <div className="listing-container">
          <div className="listing-header">
            <button type="button" className="back-btn" onClick={() => router.back()}>
              <FiArrowLeft size={18} />
            </button>
            <div className="listing-header-text">
              <h1 className="listing-title">New Listing</h1>
              <p className="listing-subtitle">Select &rsaquo; Create Listing</p>
            </div>
            <div className="draft-badge">
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

          <div className="upload-card">
            <h2 className="upload-title">Add Photos</h2>
            <p className="upload-subtitle">Add up to {MAX_PHOTOS} photos. First photo will be your main photo.</p>
            <div className={`drop-zone ${isDragging ? "dragging" : ""}`} onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
              <div className="upload-icon"><FiUploadCloud size={40} /></div>
              <p className="upload-text">Drag &amp; Drop images here or</p>
              <button type="button" className="upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Upload Images</button>
              <p className="upload-hint">You can upload up to {MAX_PHOTOS} images (JPG, PNG)</p>
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
            {photos.length > 0 && (
              <div className="photo-grid">
                {photos.map((photo, idx) => (
                  <div key={photo.id} className={`photo-item ${idx === 0 ? "main-photo" : ""}`}>
                    <img src={photo.preview} alt={`Photo ${idx + 1}`} />
                    <button type="button" className="photo-remove" onClick={() => removePhoto(photo.id)}><FiX size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tips-card">
            <h3 className="tips-title">Photo Tips</h3>
            <ul className="tips-list">
              <li>Use clear, well-lit photos</li>
              <li>Show the item from multiple angles</li>
              <li>Avoid Screenshot or stock images</li>
            </ul>
          </div>

          <div className="submit-wrap">
            <button type="button" className="back-link" onClick={() => router.back()}>
              <FiArrowLeft size={16} /> Back
            </button>
            <button type="button" className="submit-btn" onClick={handleSubmit}>
              Save &amp; Continue <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}