"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTradesDraft } from "../DraftContext";
import { FiUploadCloud, FiX, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const MAX_IMAGES = 8;

export default function TradesPhotosPage() {
  const router = useRouter();
  const { data, setData } = useTradesDraft();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = data.images ?? [];

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const selected = Array.from(files).slice(0, remaining);
    if (selected.length === 0) return;

    selected.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setData({
          ...data,
          images: [...(data.images ?? []), dataUrl],
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setData({
      ...data,
      images: images.filter((_, i) => i !== index),
    });
  };

  const next = () => {
    router.push("/seller/listing/trades-home-repair/preview");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .tp-wrap { min-height: 100vh; background: #f6f7fb; font-family: 'Inter', sans-serif; }
        .tp-inner { max-width: 760px; margin: 0 auto; padding: 32px 20px 80px; }
        .tp-title { font-size: 22px; font-weight: 800; color: #1a1a1a; margin: 0 0 6px; }
        .tp-sub { color: #6b7280; font-size: 14px; margin: 0 0 24px; }
        .tp-drop {
          border: 2px dashed #d1d5db; border-radius: 14px; padding: 34px 20px;
          text-align: center; cursor: pointer; background: #fff; transition: border-color .2s, background .2s;
        }
        .tp-drop:hover { border-color: #C0392B; background: #fff7f7; }
        .tp-drop-icon { color: #9ca3af; margin-bottom: 8px; }
        .tp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-top: 20px; }
        .tp-thumb { position: relative; aspect-ratio: 1; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; background: #fff; }
        .tp-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .tp-remove { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: rgba(0,0,0,.6); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .tp-actions { display: flex; gap: 12px; margin-top: 28px; }
        .tp-btn { flex: 1; height: 44px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .tp-back { background: #fff; color: #333; border: 1px solid #e5e7eb; }
        .tp-next { background: #C0392B; color: #fff; border: none; }
        .tp-next:disabled { background: #ccc; cursor: not-allowed; }
        .tp-err { color: #dc2626; font-size: 13px; margin-top: 10px; }
      `}</style>

      <div className="tp-wrap">
        <div className="tp-inner">
          <h1 className="tp-title">Add Photos</h1>
          <p className="tp-sub">Add up to {MAX_IMAGES} photos of your work or business.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />

          {images.length < MAX_IMAGES && (
            <div className="tp-drop" onClick={() => fileInputRef.current?.click()}>
              <FiUploadCloud size={40} className="tp-drop-icon" />
              <div style={{ fontWeight: 600, color: "#333" }}>Click to upload photos</div>
              <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>JPG / PNG, up to {MAX_IMAGES} images</div>
            </div>
          )}

          {error && <div className="tp-err">{error}</div>}

          {images.length > 0 && (
            <div className="tp-grid">
              {images.map((src, i) => (
                <div key={i} className="tp-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${i + 1}`} />
                  <button type="button" className="tp-remove" aria-label="Remove" onClick={() => removeImage(i)}>
                    <FiX size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="tp-actions">
            <button type="button" className="tp-btn tp-back" onClick={() => router.back()}>
              <FiArrowLeft size={16} /> Back
            </button>
            <button type="button" className="tp-btn tp-next" onClick={next}>
              Continue <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
