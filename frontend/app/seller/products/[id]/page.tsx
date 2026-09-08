"use client";

import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiTag,
  FiEdit2,
  FiTrash2,
  FiLoader,
  FiImage,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ACCENT = "#2563eb";
const SUCCESS = "#10b981";
const DANGER = "#dc2626";
const BORDER = "#e2e8f0";
const TEXT_PRIMARY = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BG = "#f8fafc";
const CARD_BG = "#ffffff";

interface VehicleDetails {
  brand: string;
  model: string;
  year: number;
}

interface Listing {
  id: string;
  title: string;
  price: number | null;
  category: string;
  images: string[];
  description?: string;
  condition?: string;
  location?: string;
  city?: string;
  status?: string;
  negotiable?: boolean;
  vehicle: VehicleDetails | null;
}

const editRoutes: Record<string, string> = {
  VEHICLE: "/seller/listing/vehicle",
  JOB: "/seller/listing/job",
  MEDICAL: "/seller/listing/medical-dental",
  TRADES: "/seller/listing/trades-home-repair",
  RENTAL: "/seller/listing/rent-real-estate",
  AGRICULTURE: "/seller/listing/agriculture-livestock",
  SECONDHAND: "/seller/listing/secondhand-goods",
  FOODS: "/seller/listing/food-home-delivery",
  BEAUTY: "/seller/listing/hair-beauty-wellness",
};

export default function SellerProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (!session?.accessToken || !id) return;

    fetch(`/api/listings/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!r.ok || !d) throw new Error("Failed to fetch");
        setListing(d);
        const imgs = d.images || [];
        setMainImage(
          imgs[0]
            ? `${process.env.NEXT_PUBLIC_API_URL}${imgs[0]}`
            : ""
        );
      })
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id, session?.accessToken]);

  function getDisplayTitle(item: Listing) {
    if (item.category === "VEHICLE" && item.vehicle) {
      return `${item.vehicle.brand} ${item.vehicle.year}`;
    }
    return item.title || "Untitled Listing";
  }

  async function handleDelete() {
    if (!listing || !session?.accessToken) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${getDisplayTitle(listing)}"?`
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete");
      }

      toast.success("Listing deleted successfully!");
      router.push("/seller/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: TEXT_MUTED,
          fontSize: 14,
        }}
      >
        <FiLoader
          size={20}
          style={{ marginRight: 8, animation: "spin 1s linear infinite" }}
        />
        Loading listing...
      </div>
    );
  }

  if (!listing) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: TEXT_MUTED,
          fontSize: 14,
        }}
      >
        Listing not found.
      </div>
    );
  }

  const editRoute = editRoutes[listing.category];
  const imageUrls = (listing.images || []).map((img) =>
    img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`
  );

  const detailRows: { label: string; value: string }[] = [];

  if (listing.category) {
    detailRows.push({ label: "Category", value: listing.category });
  }
  if (listing.condition) {
    detailRows.push({ label: "Condition", value: listing.condition });
  }
  if (listing.vehicle) {
    detailRows.push({
      label: "Brand",
      value: `${listing.vehicle.brand || "-"}`,
    });
    detailRows.push({
      label: "Model",
      value: `${listing.vehicle.model || "-"}`,
    });
    detailRows.push({
      label: "Year",
      value: `${listing.vehicle.year || "-"}`,
    });
  }
  if (listing.city) {
    detailRows.push({ label: "City", value: listing.city });
  }
  if (listing.location) {
    detailRows.push({ label: "Location", value: listing.location });
  }
  if (listing.status) {
    detailRows.push({ label: "Status", value: listing.status });
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .detail-page {
          min-height: 100vh;
          background: ${BG};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .detail-container {
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 32px 40px;
        }

        .detail-header {
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

        .status-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: ${SUCCESS};
          background: rgba(16, 185, 129, 0.1);
          padding: 5px 12px;
          border-radius: 20px;
        }

        .status-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${SUCCESS};
        }

        .card-layout {
          display: flex;
          gap: 28px;
        }

        .image-section {
          flex: 0 0 38%;
          max-width: 420px;
          min-width: 220px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .main-image {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid ${BORDER};
          background: #f8fafc;
        }

        .thumbnail-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .thumbnail {
          position: relative;
          width: 60px;
          height: 60px;
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
          padding-right: 100px;
        }

        .listing-price {
          font-size: 18px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .negotiable-badge {
          font-size: 12px;
          font-weight: 600;
          color: #d97706;
          background: #fef3c7;
          padding: 4px 10px;
          border-radius: 20px;
          margin-left: 8px;
        }

        .listing-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: ${TEXT_SECONDARY};
          margin-bottom: 20px;
        }

        .divider {
          height: 1px;
          background: ${BORDER};
          margin: 0 0 14px 0;
        }

        .info-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
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

        .btn-delete {
          background: ${CARD_BG};
          color: ${DANGER};
          border: 1.5px solid #fecaca;
          min-width: 140px;
          justify-content: center;
        }

        .btn-delete:hover {
          background: #fef2f2;
        }

        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 1150px) and (min-width: 901px) {
          .card-layout { gap: 20px; }
          .image-section { flex: 0 0 34%; max-width: 340px; min-width: 200px; }
          .listing-title { font-size: 18px; }
          .listing-price { font-size: 16px; }
          .info-row { font-size: 13px; }
          .description-text { font-size: 13px; }
        }

        @media (max-width: 900px) {
          .detail-container { padding: 20px 20px 40px; }
          .listing-card { padding: 20px; }
          .card-layout { flex-direction: column; }
          .image-section { flex: 0 0 auto; width: 100%; }
          .main-image { aspect-ratio: 16 / 10; }
          .actions { flex-direction: column; gap: 12px; }
          .btn { width: 100%; justify-content: center; }
          .status-badge { top: 20px; right: 20px; }
          .listing-title { padding-right: 0; }
        }
      `}</style>

      <div className="detail-page">
        <div className="detail-container">
          {/* Header */}
          <div className="detail-header">
            <button
              className="back-btn"
              onClick={() => router.push("/seller/products")}
            >
              <FiArrowLeft size={16} />
              Back to Listings
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: SUCCESS,
              }}
            >
              <FiCheck size={16} />
              Active
            </div>
          </div>

          {/* Title */}
          <div className="page-header">
            <h1 className="section-title">Listing Details</h1>
            <p className="section-subtitle">
              View and manage your listing.
            </p>
          </div>

          {/* Listing Card */}
          <div className="listing-card">
            <div className="status-badge">Active</div>

            <div className="card-layout">
              {/* Image Section */}
              <div className="image-section">
                <div className="main-image">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={getDisplayTitle(listing)}
                      fill
                      sizes="(max-width: 900px) 100vw, 420px"
                      style={{ objectFit: "cover" }}
                      priority
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: TEXT_MUTED,
                        fontSize: 14,
                        gap: 8,
                      }}
                    >
                      <FiImage size={32} />
                      No Image
                    </div>
                  )}
                </div>
                {imageUrls.length > 1 && (
                  <div className="thumbnail-row">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className={`thumbnail ${url === mainImage ? "active" : ""}`}
                        onClick={() => setMainImage(url)}
                      >
                        <Image
                          src={url}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="60px"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="card-info">
                <h2 className="listing-title">{getDisplayTitle(listing)}</h2>
                <div className="listing-price">
                  NPR {listing.price?.toLocaleString("en-IN") || "0"}
                  {listing.negotiable && (
                    <span className="negotiable-badge">Negotiable</span>
                  )}
                </div>

                {(listing.location || listing.city) && (
                  <div className="listing-location">
                    <FiMapPin size={14} />
                    {listing.location || listing.city}
                  </div>
                )}

                <div className="divider" />

                <div className="info-rows">
                  {detailRows.map((row) => (
                    <div key={row.label} className="info-row">
                      <div className="info-row-left">
                        <FiTag size={16} />
                        {row.label}
                      </div>
                      <div className="info-row-right">{row.value}</div>
                    </div>
                  ))}
                </div>

                {listing.description && (
                  <>
                    <div className="divider" />
                    <div className="description-section">
                      <div className="description-title">Description</div>
                      <p className="description-text">{listing.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions">
            {editRoute && (
              <button
                className="btn btn-edit"
                onClick={() =>
                  router.push(`${editRoute}?edit=${listing.id}`)
                }
              >
                <FiEdit2 size={15} />
                Edit Listing
              </button>
            )}

            <button
              className="btn btn-delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <FiLoader
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={15} />
                  Delete Listing
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}