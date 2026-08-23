"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiArrowLeft, FiTrash2, FiSave } from "react-icons/fi";
import Link from "next/link";
import type { AdminListingDetail, ListingStatus, ListingCategory, JsonValue } from "@/app/types/admin-listing";
import { getListingStatusBadge, formatCategory } from "@/app/types/admin-listing_mappers";
import { resolveImages } from "@/lib/adapters/shared";

const PRIMARY = "#0f172a";
const SITE_PRIMARY = "#C0392B";
const BG = "#f8f5f5";

const CATEGORY_KEY_MAP: Record<ListingCategory, keyof AdminListingDetail> = {
  VEHICLE: "vehicle",
  JOB: "job",
  MEDICAL: "medical",
  TRADES: "trades",
  RENTAL: "rental",
  AGRICULTURE: "agriculture",
  SECONDHAND: "secondhand",
  FOODS: "foods",
  BEAUTY: "beauty",
};

function isStringArray(value: JsonValue): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function DynamicField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: JsonValue;
  onChange: (key: string, next: JsonValue) => void;
}) {
  const label = fieldKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

  if (typeof value === "boolean") {
    return (
      <label className="admin-field admin-field-checkbox">
        <span>{label}</span>
        <input type="checkbox" checked={value} onChange={(e) => onChange(fieldKey, e.target.checked)} />
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="admin-field">
        <span>{label}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value === "" ? null : Number(e.target.value))}
        />
      </label>
    );
  }

  if (isStringArray(value)) {
    return (
      <label className="admin-field">
        <span>{label} (comma-separated)</span>
        <input
          type="text"
          value={value.join(", ")}
          onChange={(e) =>
            onChange(
              fieldKey,
              e.target.value
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v.length > 0)
            )
          }
        />
      </label>
    );
  }

  if (value !== null && typeof value === "object") {
    return (
      <label className="admin-field admin-field-json">
        <span>{label} (JSON)</span>
        <textarea
          rows={4}
          defaultValue={JSON.stringify(value, null, 2)}
          onBlur={(e) => {
            try {
              onChange(fieldKey, JSON.parse(e.target.value) as JsonValue);
            } catch {
              // leave prior value in place if the JSON is invalid
            }
          }}
        />
      </label>
    );
  }

  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(fieldKey, e.target.value)}
      />
    </label>
  );
}

export default function AdminListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<AdminListingDetail | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [status, setStatus] = useState<ListingStatus>("ACTIVE");
  const [categoryData, setCategoryData] = useState<Record<string, JsonValue>>({});

  const fetchListing = useCallback(async () => {
    if (!accessToken || !id) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/listings/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = (await r.json()) as AdminListingDetail & { error?: string; message?: string };
      if (!r.ok || data?.error) throw new Error(data?.message || "Failed to load listing");

      setListing(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setPrice(data.price ?? "");
      setStatus(data.status);

      const catKey = CATEGORY_KEY_MAP[data.category];
      setCategoryData((data[catKey] as Record<string, JsonValue> | null) ?? {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load listing");
    } finally {
      setLoading(false);
    }
  }, [accessToken, id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleFieldChange = (key: string, next: JsonValue) => {
    setCategoryData((prev) => ({ ...prev, [key]: next }));
  };

  const handleSave = async () => {
    if (!accessToken || !listing) return;
    setSaving(true);
    setError(null);
    try {
      const catKey = CATEGORY_KEY_MAP[listing.category];
      const body = {
        title,
        description,
        price: price === "" ? null : Number(price),
        status,
        [catKey]: categoryData,
      };

      const r = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = (await r.json()) as AdminListingDetail & { error?: string; message?: string };
      if (!r.ok || data?.error) throw new Error(data?.message || "Failed to save changes");
      setListing(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken) return;
    if (!confirm("Delete this listing permanently? This can't be undone.")) return;
    setDeleting(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!r.ok && r.status !== 204) {
        const data = (await r.json().catch(() => ({}))) as { message?: string };
        throw new Error(data?.message || "Failed to delete listing");
      }
      router.push("/admin/listings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete listing");
      setDeleting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading listing...</div>;
  }

  if (error && !listing) {
    return (
      <div style={{ padding: 40 }}>
        <div className="admin-error-box">{error}</div>
      </div>
    );
  }

  if (!listing) return null;

  const badge = getListingStatusBadge(listing.status);
  const thumbs = resolveImages(listing.images, "/placeholder-listing.png");

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .detail-page { min-height: 100vh; background: ${BG}; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .detail-topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #e8e4e4; flex-wrap: wrap; gap: 12px; }
        .detail-back { display: inline-flex; align-items: center; gap: 8px; color: #64748b; text-decoration: none; font-size: 14px; font-weight: 600; }
        .detail-back:hover { color: ${PRIMARY}; }
        .detail-title-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
        .detail-title { font-size: 22px; font-weight: 700; color: ${PRIMARY}; }
        .detail-actions { display: flex; gap: 10px; }
        .detail-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
        .detail-btn-save { background: ${SITE_PRIMARY}; color: #fff; }
        .detail-btn-save:hover { opacity: 0.9; }
        .detail-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .detail-btn-delete { background: #fef2f2; color: #dc2626; }
        .detail-btn-delete:hover { background: #fee2e2; }
        .detail-btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }
        .detail-body { padding: 24px 32px 48px; display: grid; grid-template-columns: 260px 1fr; gap: 24px; max-width: 1100px; }
        .detail-thumbs { display: flex; flex-direction: column; gap: 10px; }
        .detail-thumb { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 10px; border: 1px solid #e8e4e4; background: #f1f5f9; }
        .detail-card { background: #fff; border: 1px solid #e8e4e4; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
        .detail-card h3 { font-size: 15px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 16px; }
        .admin-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; font-size: 13px; }
        .admin-field span { font-weight: 600; color: #475569; }
        .admin-field input[type="text"], .admin-field input[type="number"], .admin-field textarea, .admin-field select {
          padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; width: 100%;
        }
        .admin-field textarea { resize: vertical; font-family: "SFMono-Regular", Consolas, monospace; font-size: 12px; }
        .admin-field-checkbox { flex-direction: row; align-items: center; justify-content: space-between; }
        .admin-field-checkbox input { width: 18px; height: 18px; }
        .detail-meta-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        .detail-meta-row:last-child { border-bottom: none; }
        .detail-meta-label { color: #94a3b8; }
        .detail-meta-value { color: #334155; font-weight: 600; }
        .admin-error-box { background: #fef2f2; color: #dc2626; padding: 14px 18px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; }
        @media (max-width: 767px) {
          .detail-body { grid-template-columns: 1fr; padding: 16px; }
          .detail-topbar { padding: 16px; }
        }
      `}</style>

      <div className="detail-page">
        <div className="detail-topbar">
          <div>
            <Link href="/admin/listings" className="detail-back"><FiArrowLeft size={16} /> Back to Listings</Link>
            <div className="detail-title-row">
              <h1 className="detail-title">{listing.title}</h1>
              <span style={{ background: badge.bg, color: badge.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                {badge.label}
              </span>
            </div>
          </div>
          <div className="detail-actions">
            <button type="button" className="detail-btn detail-btn-delete" onClick={handleDelete} disabled={deleting}>
              <FiTrash2 size={15} /> {deleting ? "Deleting..." : "Delete"}
            </button>
            <button type="button" className="detail-btn detail-btn-save" onClick={handleSave} disabled={saving}>
              <FiSave size={15} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="detail-body">
          <div>
            <div className="detail-thumbs">
              {thumbs.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${listing.title} photo ${i + 1}`}
                  className="detail-thumb"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              ))}
            </div>

            <div className="detail-card" style={{ marginTop: 20 }}>
              <h3>Info</h3>
              <div className="detail-meta-row"><span className="detail-meta-label">Category</span><span className="detail-meta-value">{formatCategory(listing.category)}</span></div>
              <div className="detail-meta-row"><span className="detail-meta-label">Seller</span><span className="detail-meta-value">{listing.user.name || listing.user.email}</span></div>
              <div className="detail-meta-row"><span className="detail-meta-label">Phone</span><span className="detail-meta-value">{listing.user.phone || "—"}</span></div>
              <div className="detail-meta-row"><span className="detail-meta-label">Posted</span><span className="detail-meta-value">{new Date(listing.createdAt).toLocaleDateString()}</span></div>
              <div className="detail-meta-row"><span className="detail-meta-label">Updated</span><span className="detail-meta-value">{new Date(listing.updatedAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          <div>
            {error && <div className="admin-error-box">{error}</div>}

            <div className="detail-card">
              <h3>Core Details</h3>
              <label className="admin-field">
                <span>Title</span>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="admin-field">
                <span>Description</span>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{ fontFamily: "inherit", fontSize: 14 }} />
              </label>
              <label className="admin-field">
                <span>Price (NPR)</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
              <label className="admin-field">
                <span>Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as ListingStatus)}>
                  <option value="ACTIVE">Active</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="SOLD">Sold</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </label>
            </div>

            <div className="detail-card">
              <h3>{formatCategory(listing.category)} Details</h3>
              {Object.keys(categoryData).length === 0 ? (
                <p style={{ fontSize: 13, color: "#94a3b8" }}>No category-specific fields on this listing.</p>
              ) : (
                Object.entries(categoryData).map(([key, value]) => (
                  <DynamicField key={key} fieldKey={key} value={value} onChange={handleFieldChange} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}