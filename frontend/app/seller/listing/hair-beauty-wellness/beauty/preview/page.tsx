"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiArrowLeft, FiCheck, FiEdit2, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDraft, ServiceCategory } from "../layout";
import { formToCreateBeautyPayload } from "@/lib/adapters/beautyAdapter";

const ACCENT = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS = "#10b981";
const ACCENT_LIGHT = "#eff6ff";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

const categoryConfig: Record<ServiceCategory, { endpoint: string }> = {
  Beauty: { endpoint: "/api/beauty" },
  Hair: { endpoint: "/api/hair" },
  Wellness: { endpoint: "/api/wellness" },
};

export default function PreviewServicePage() {
  const router = useRouter();
  const { category, setCategory, data, images, setImages } = useDraft();
  const { data: session } = useSession();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one photo before publishing");
      return;
    }

    setIsPublishing(true);
    try {
      const { endpoint } = categoryConfig[category];

      const payload = formToCreateBeautyPayload({
        ...data,
        beautyServiceType: data.serviceType,
        homeVisit: data.mobileService,
      });

      const listingRes = await fetch(endpoint, {
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
      images.forEach(({ file }) => photoFormData.append("photos", file));

      const photosRes = await fetch(`${endpoint}/${listing.id}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.accessToken}` },
        body: photoFormData,
      });

      if (!photosRes.ok) {
        const err = await photosRes.json().catch(() => null);
        throw new Error(err?.message || "Listing created but photo upload failed");
      }

      toast.success("Listing published successfully!");
      setCategory(category);
      router.push("/seller/products");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong publishing");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    router.push("/seller/listing/hair-beauty-wellness");
  };

  const mainImage = images.find((i) => i.isMain) ?? images[0];
  const sideImages = images.filter((i) => i.id !== mainImage?.id).slice(0, 3);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .preview-page { min-height: 100vh; background: ${BG}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .preview-container { max-width: 900px; width: 100%; margin: 0 auto; padding: 24px 32px 40px; }
        .preview-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .back-btn { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; border: 1.5px solid ${BORDER}; background: ${CARD_BG}; color: ${TEXT_SECONDARY}; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
        .back-btn:hover { border-color: #cbd5e1; background: #f1f5f9; }
        .draft-saved { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${SUCCESS}; }
        .page-header { margin-bottom: 20px; }
        .page-title { font-size: 22px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.3px; margin-bottom: 4px; }
        .page-subtitle { font-size: 14px; color: ${TEXT_SECONDARY}; }
        .listing-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 20px; }
        .card-layout { display: grid; grid-template-columns: 400px 1fr; gap: 20px; align-items: flex-start; }
        .gallery-section { display: flex; gap: 10px; flex-direction: column; }
        .main-image { width: 400px; height: 420px; border-radius: 16px; overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
        .main-image img { width: 100%; height: 100%; object-fit: cover; }
        .side-images { width: 400px; display: flex; gap: 12px; }
        .thumb { flex: 1; height: 110px; border-radius: 12px; overflow: hidden; background: #f1f5f9; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .service-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .service-title { font-size: 32px; font-weight: 700; }
        .verified-badge { background: #dff7d9; color: #1f8b3a; padding: 6px 14px; border-radius: 10px; font-size: 16px; font-weight: 600; }
        .top-cards { display: flex; gap: 18px; margin-bottom: 24px; flex-wrap: wrap; }
        .info-card { width: 170px; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; }
        .info-card h3 { color: #3b4fe4; font-size: 18px; font-weight: 700; margin-bottom: 6px; word-break: break-word; }
        .info-card span { color: #666; font-size: 14px; }
        .details-list { display: flex; flex-direction: column; gap: 18px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; }
        .detail-row span { color: #444; font-size: 16px; }
        .detail-row strong { font-size: 16px; font-weight: 600; }
        .service-left { margin-top: 28px; width: 100%; }
        .about-section h2, .tags-section h2 { font-size: 24px; margin-bottom: 12px; color: #3b4fe4; }
        .about-section p { color: #555; line-height: 1.6; font-size: 15px; }
        .tags-section { margin-top: 24px; }
        .tags { display: flex; flex-wrap: wrap; gap: 12px; }
        .tags span { background: #e9e4ff; color: #5146e5; padding: 8px 14px; border-radius: 10px; font-size: 14px; }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, ${BORDER}, transparent); margin: 24px 0; }
        .actions { display: flex; gap: 50px; justify-content: center; }
        .btn { padding: 10px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s ease; font-family: inherit; display: flex; align-items: center; gap: 8px; }
        .btn-edit { background: ${CARD_BG}; color: ${ACCENT}; border: 1.5px solid ${ACCENT}; min-width: 140px; justify-content: center; }
        .btn-edit:hover { background: #eff6ff; }
        .btn-publish { background: linear-gradient(135deg, ${ACCENT}, ${ACCENT_HOVER}); color: #fff; border: none; box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25); min-width: 160px; justify-content: center; }
        .btn-publish:hover { box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35); transform: translateY(-1px); }
        .btn-publish:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .preview-container { padding: 16px 16px 32px; }
          .listing-card { padding: 16px; }
          .card-layout { grid-template-columns: 1fr; }
          .main-image, .side-images { width: 100%; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .draft-saved { display: none; }
        }
        @media (max-width: 480px) {
          .preview-container { padding: 12px; }
          .listing-card { padding: 14px; }
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
            <h1 className="page-title">Preview your listing</h1>
            <p className="page-subtitle">Review your listing details before publishing.</p>
          </div>

          <div className="listing-card">
            <div className="card-layout">
              <div className="card-left">
                <div className="gallery-section">
                  <div className="main-image">
                    {mainImage ? (
                      <img src={mainImage.preview} alt={data.serviceTitle || "Listing"} />
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>No photo added</span>
                    )}
                  </div>
                  {sideImages.length > 0 && (
                    <div className="side-images">
                      {sideImages.map((img) => (
                        <div className="thumb" key={img.id}>
                          <img src={img.preview} alt="" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="card-right">
                <div className="service-details">
                  <div className="service-header">
                    <div><h2 className="service-title">{data.serviceTitle || "Untitled Service"}</h2></div>
                    <span className="verified-badge">Verified</span>
                  </div>

                  <div className="top-cards">
                    <div className="info-card">
                      <h3>NPR {data.price || "-"}</h3>
                      <span>Starting price</span>
                    </div>
                    <div className="info-card">
                      <h3>{data.serviceType || "-"}</h3>
                      <span>Service Location Type</span>
                    </div>
                  </div>

                  <div className="details-list">
                    <div className="detail-row">
                      <span>Duration</span>
                      <strong>{data.duration || "-"}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Gender Preference</span>
                      <strong>{data.genderPreference || "-"}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Experience</span>
                      <strong>{data.experienceLevel || "-"}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Studio Location</span>
                      <strong>{data.studioLocation || "-"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-left">
              <div className="about-section">
                <h2>About</h2>
                <p>{data.detailedDescription || data.shortDescription || "No description provided."}</p>
              </div>

              {data.tags.length > 0 && (
                <div className="tags-section">
                  <h2>Tags</h2>
                  <div className="tags">
                    {data.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="divider" />

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
      </div>
    </>
  );
}
