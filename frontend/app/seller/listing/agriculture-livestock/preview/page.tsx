"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiArrowLeft, FiCheck, FiSend, FiMapPin, FiTag, FiLayers, FiAward, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDraft } from "../layout";

const ACCENT       = "#2563eb";
const ACCENT_HOVER = "#1d4ed8";
const SUCCESS      = "#10b981";
const BORDER       = "#e2e8f0";
const TEXT_HEADING = "#0f172a";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";
const BG           = "#f8fafc";
const CARD_BG      = "#ffffff";
const SITE_PRIMARY = "#C0392B";

export default function PreviewListingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { agricultureData, images } = useDraft();
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const listing = {
    category: "Agriculture And Livestock",
    title: agricultureData.title || "Fresh Organic Vegetable",
    price: agricultureData.price ? `NPR ${Number(agricultureData.price).toLocaleString("en-IN")} / ${agricultureData.unit}` : "NPR 120 / KG",
    location: agricultureData.location || "Budhanilkanta Kathmandu, Nepal",
    listingType: agricultureData.listingType || "Produce",
    unit: agricultureData.unit || "KG",
    organicCertified: agricultureData.organicCertified,
    seasonalAvailability: agricultureData.seasonalAvailability || "March - June",
    district: agricultureData.district || "Kathmandu",
    village: agricultureData.village || "Budhanilkhantha",
    images: images.length ? images.map((img) => img.preview) : ["/placeholder.png"],
    description: agricultureData.description || "All our products are grown organically without the use of harmful chemicals or pesticides. We take pride in providing fresh and healthy produce to our customers.",
  };

  const handlePublish = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one photo before publishing");
      router.push("/seller/listing/agriculture-livestock/photos");
      return;
    }

    setIsPublishing(true);
    try {
      // TODO: Replace with your actual agriculture API endpoint
      const res = await fetch("/api/agriculture-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          title: agricultureData.title,
          price: agricultureData.price,
          description: agricultureData.description,
          listingType: agricultureData.listingType,
          district: agricultureData.district,
          village: agricultureData.village,
          location: agricultureData.location,
          unit: agricultureData.unit,
          organicCertified: agricultureData.organicCertified,
          organicVerified: agricultureData.organicVerified,
          seasonalAvailability: agricultureData.seasonalAvailability,
          animalType: agricultureData.animalType,
          age: agricultureData.age,
          breed: agricultureData.breed,
          healthStatus: agricultureData.healthStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to create listing");
      }

      toast.success("Listing published successfully!");
      router.push("/seller/products");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong publishing");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  function getStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .preview-page { min-height: 100vh; background: ${BG}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
    .preview-container { max-width: 1300px; width: 100%; margin: 0 auto; padding: 24px 32px 40px; }

    /* Header */
    .preview-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .back-btn { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; border: 1.5px solid ${BORDER}; background: ${CARD_BG}; color: ${TEXT_SECONDARY}; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
    .back-btn:hover { border-color: #cbd5e1; background: #f1f5f9; }
    .draft-saved { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${SUCCESS}; }
    .draft-saved svg { stroke-width: 3; }

    /* Page Header */
    .page-header { margin-bottom: 20px; }
    .section-title { font-size: 22px; font-weight: 700; color: ${TEXT_HEADING}; letter-spacing: -0.3px; margin-bottom: 4px; }
    .section-subtitle { font-size: 14px; color: ${TEXT_SECONDARY}; }

    /* Listing Card */
    .listing-card { background: ${CARD_BG}; border: 1.5px solid ${BORDER}; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    .card-layout { display: flex; gap: 24px; margin-bottom: 20px; }

    /* Images */
    .card-images { flex: 0 0 380px; }
    .main-image { width: 100%; aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; border: 1.5px solid ${BORDER}; position: relative; }
    .main-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .organic-badge { position: absolute; top: 8px; left: 8px; display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: ${SUCCESS}; color: #fff; font-size: 11px; font-weight: 600; border-radius: 6px; z-index: 2; }

    /* Info */
    .card-info { flex: 1; min-width: 0; }
    .listing-title { font-size: 20px; font-weight: 700; color: ${TEXT_HEADING}; margin-bottom: 8px; letter-spacing: -0.3px; }
    .listing-price { font-size: 18px; font-weight: 700; color: ${ACCENT}; margin-bottom: 12px; }
    .location-row { display: flex; align-items: center; gap: 6px; font-size: 14px; color: ${TEXT_SECONDARY}; margin-bottom: 16px; }

    /* Details Table */
    .details-table { margin-bottom: 20px; }
    .details-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; font-size: 14px; border-bottom: 1px solid ${BORDER}; }
    .details-row:last-child { border-bottom: none; }
    .details-label { display: flex; align-items: center; gap: 8px; color: ${TEXT_SECONDARY}; }
    .details-value { color: ${TEXT_PRIMARY}; font-weight: 500; }

    /* Description */
    .description-section { padding-top: 8px; }
    .description-title { font-size: 14px; font-weight: 700; color: ${TEXT_HEADING}; margin-bottom: 6px; }
    .description-text { font-size: 14px; color: ${TEXT_SECONDARY}; line-height: 1.6; }

    /* Location Footer */
    .location-footer { display: flex; gap: 40px; padding: 16px 0 0; border-top: 1px solid ${BORDER}; }
    .location-item { display: flex; align-items: flex-start; gap: 10px; }
    .location-label { font-size: 12px; color: ${TEXT_SECONDARY}; margin-bottom: 2px; }
    .location-value { font-size: 14px; color: ${TEXT_PRIMARY}; font-weight: 500; }

    /* Actions */
    .actions { display: flex; gap: 50px; justify-content: center; }
    .btn { padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s ease; font-family: inherit; display: flex; align-items: center; gap: 8px; min-width: 180px; justify-content: center; }
    .btn-edit { background: ${CARD_BG}; color: ${ACCENT}; border: 1.5px solid ${ACCENT}; }
    .btn-edit:hover { background: #eff6ff; }
    .btn-publish { background: linear-gradient(135deg, ${SITE_PRIMARY}, #e0574a); color: #fff; border: none; box-shadow: 0 4px 14px rgba(192, 57, 43, 0.25); }
    .btn-publish:hover { box-shadow: 0 6px 20px rgba(192, 57, 43, 0.35); transform: translateY(-1px); }
    .btn-publish:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 900px) {
      .preview-container { padding: 20px 20px 40px; }
      .card-layout { flex-direction: column; }
      .card-images { flex: 0 0 auto; width: 100%; }
      .main-image { aspect-ratio: 4/3; }
      .actions { flex-direction: column; gap: 12px; }
      .btn { width: 100%; }
      .location-footer { flex-direction: column; gap: 16px; }
    }
  `;
}

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style dangerouslySetInnerHTML={{ __html: getStyles() }} />

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

          {/* Page Title */}
          <div className="page-header">
            <h1 className="section-title">Preview your listing</h1>
            <p className="section-subtitle">Review your listing details before publishing.</p>
          </div>

          {/* Listing Card */}
          <div className="listing-card">
            <div className="card-layout">
              {/* Left: Images */}
              <div className="card-images">
                <div className="main-image">
                  {listing.organicCertified && (
                    <div className="organic-badge">
                      <FiCheck size={12} /> Organic certified
                    </div>
                  )}
                  <img src={listing.images[selectedImage]} alt={listing.title} />
                </div>
              </div>

              {/* Right: Info */}
              <div className="card-info">
                <h2 className="listing-title">{listing.title}</h2>
                <div className="listing-price">{listing.price}</div>

                <div className="location-row">
                  <FiMapPin size={14} color={TEXT_SECONDARY} />
                  <span>{listing.location}</span>
                </div>

                <div className="details-table">
                  <div className="details-row">
                    <span className="details-label"><FiTag size={14} /> Listing Type</span>
                    <span className="details-value">{listing.listingType}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label"><FiLayers size={14} /> Unit</span>
                    <span className="details-value">{listing.unit}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label"><FiAward size={14} /> Organic Certified</span>
                    <span className="details-value">{listing.organicCertified ? "Yes" : "No"}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label"><FiCalendar size={14} /> Season</span>
                    <span className="details-value">{listing.seasonalAvailability}</span>
                  </div>
                </div>

                <div className="description-section">
                  <div className="description-title">Description</div>
                  <p className="description-text">{listing.description}</p>
                </div>
              </div>
            </div>

            {/* Location Info Footer */}
            <div className="location-footer">
              <div className="location-item">
                <FiMapPin size={16} color={ACCENT} />
                <div>
                  <div className="location-label">District</div>
                  <div className="location-value">{listing.district}</div>
                </div>
              </div>
              <div className="location-item">
                <FiMapPin size={16} color={ACCENT} />
                <div>
                  <div className="location-label">Location</div>
                  <div className="location-value">{listing.village}, {listing.district}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn btn-edit" onClick={() => router.push("/seller/listing/agriculture-livestock/photos")}>
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
