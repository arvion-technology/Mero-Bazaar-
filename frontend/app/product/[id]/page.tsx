"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiShare2,
  FiHeart,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiPhone,
  FiMessageSquare,
  FiShoppingCart,
  FiBox,
  FiShield,
  FiTag,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/* ── Category Detection Map ──
   Maps common keywords → actual URL route slug
   (must match your listing page hrefs exactly) */
const CATEGORY_ROUTE_MAP: Record<string, string> = {
  /* ─ Vehicles ─ */
  vehicles: "vehicles",
  vehicle: "vehicles",
  car: "vehicles",
  bike: "vehicles",
  motorcycle: "vehicles",
  scooter: "vehicles",
  bicycle: "vehicles",
  van: "vehicles",
  truck: "vehicles",
  bus: "vehicles",

  /* ─ Jobs ─ */
  job: "job",
  jobs: "job",
  career: "job",
  employment: "job",
  hiring: "job",
  labour: "job",
  labor: "job",
  work: "job",

  /* ─ Medical & Dental ─ */
  medical: "medical",
  dental: "medical",
  doctor: "medical",
  health: "medical",
  clinic: "medical",
  hospital: "medical",
  pharmacy: "medical",
  medicine: "medical",

  /* ─ Trades & Home Repair ─ */
  "trade-and-homerepair": "trade-and-homerepair",
  trade: "trade-and-homerepair",
  homerepair: "trade-and-homerepair",
  "home repair": "trade-and-homerepair",
  repair: "trade-and-homerepair",
  plumber: "trade-and-homerepair",
  electrician: "trade-and-homerepair",
  carpenter: "trade-and-homerepair",
  "ac repair": "trade-and-homerepair",
  painter: "trade-and-homerepair",
  builder: "trade-and-homerepair",
  construction: "trade-and-homerepair",
  maintenance: "trade-and-homerepair",

  /* ─ Rent & Real Estate ─ */
  "rent-and-real-estate": "rent-and-real-estate",
  property: "rent-and-real-estate",
  rent: "rent-and-real-estate",
  "real estate": "rent-and-real-estate",
  "real-estate": "rent-and-real-estate",
  house: "rent-and-real-estate",
  apartment: "rent-and-real-estate",
  flat: "rent-and-real-estate",
  land: "rent-and-real-estate",
  room: "rent-and-real-estate",
  hostel: "rent-and-real-estate",
  shutter: "rent-and-real-estate",
  office: "rent-and-real-estate",

  /* ─ Agriculture & Livestock ─ */
  "agriculture-and-livestock": "agriculture-and-livestock",
  agriculture: "agriculture-and-livestock",
  livestock: "agriculture-and-livestock",
  farm: "agriculture-and-livestock",
  farming: "agriculture-and-livestock",
  crop: "agriculture-and-livestock",
  dairy: "agriculture-and-livestock",
  animal: "agriculture-and-livestock",
  poultry: "agriculture-and-livestock",
  agri: "agriculture-and-livestock",

  /* ─ Secondhand Goods ─ */
  secondhand: "secondhand",
  "secondhand-goods": "secondhand",
  used: "secondhand",
  old: "secondhand",
  "pre-owned": "secondhand",
  "pre owned": "secondhand",
  thrift: "secondhand",
  resale: "secondhand",

  /* ─ Food & Home Delivery ─ */
  food: "food",
  delivery: "food",
  restaurant: "food",
  kitchen: "food",
  catering: "food",
  grocery: "food",
  tiffin: "food",
  meal: "food",

  /* ─ Hair, Beauty & Wellness ─ */
  beauty: "beauty",
  salon: "beauty",
  spa: "beauty",
  nail: "beauty",
  hair: "beauty",
  makeup: "beauty",
  wellness: "beauty",
  cosmetic: "beauty",
};

function detectCategoryRoute(category?: string): string | null {
  if (!category) return null;
  const cat = category.toLowerCase();
  for (const [key, route] of Object.entries(CATEGORY_ROUTE_MAP)) {
    if (cat.includes(key)) return route;
  }
  return null;
}

/* Human-readable labels that match your listing page */
function getCategoryLabel(route: string | null): string {
  if (!route) return "Products";
  const labels: Record<string, string> = {
    vehicles: "Vehicles",
    job: "Jobs & Labour Hire",
    medical: "Medical & Dental",
    "trade-and-homerepair": "Trades & Home Repair",
    "rent-and-real-estate": "Rent & Real Estate",
    "agriculture-and-livestock": "Agriculture & Livestock",
    secondhand: "Secondhand Goods",
    food: "Food & Home Delivery",
    beauty: "Hair, Beauty & Wellness",
  };
  return labels[route] ?? "Products";
}

/* ── Helpers ── */
function prefixImage(path: string | undefined | null): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function formatPrice(price: number | undefined, currency?: string): string {
  if (price == null) return "Price on call";
  return `${currency ?? "NPR"} ${price.toLocaleString("en-IN")}`;
}

function timeAgo(days?: number | null): string {
  if (days == null) return "";
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  return `Posted ${days} days ago`;
}

/* ── Types ── */
interface Seller {
  id?: string;
  name?: string;
  image?: string | null;
  phone?: string;
  email?: string;
  isVerified?: boolean;
}

interface ProductDetail {
  id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  category?: string;
  condition?: string;
  location?: string;
  city?: string;
  area?: string;
  postedDaysAgo?: number;
  negotiable?: boolean;
  isFavorited?: boolean;
  seller?: Seller;
  specs?: Record<string, string | number | boolean>;
  features?: string[];
  tags?: string[];
  [key: string]: any;
}

interface RelatedItem {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  category?: string;
}

/* ── Main Router Component ── */
export default function ProductDetailRouter() {
  const params = useParams();
  const router = useRouter();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/listings/${id}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Product not found" : `Failed to load (${res.status})`
          );
        }
        const data: ProductDetail = await res.json();
        if (cancelled) return;

        /* ── Category Detect + Redirect ── */
        const categoryRoute = detectCategoryRoute(data.category);
        if (categoryRoute) {
          setRedirecting(true);
          router.replace(`/category/${categoryRoute}/${id}`);
          return;
        }

        setProduct(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  /* ── Redirecting State ── */
  if (redirecting) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          color: "#64748b",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #e2e8f0",
            borderTopColor: "#C0392B",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ fontSize: 14 }}>Redirecting to category page…</p>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          color: "#64748b",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid #e2e8f0",
              borderTopColor: "#C0392B",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: 12, fontSize: 14 }}>Loading product…</p>
        </div>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !product) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          gap: 8,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            marginBottom: 8,
          }}
        >
          <FiBox size={28} />
        </div>
        <p style={{ fontWeight: 700, color: "#1e293b", fontSize: 16 }}>
          Couldn&apos;t load this product
        </p>
        <span style={{ color: "#94a3b8", fontSize: 14 }}>
          {error ?? "Not found"}
        </span>
        <Link
          href="/"
          style={{
            color: "#C0392B",
            fontWeight: 600,
            marginTop: 12,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return <GenericProductDetail product={product} id={id} />;
}

function GenericProductDetail({ product, id }: { product: ProductDetail; id: string }) {
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(product.isFavorited ?? false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [related, setRelated] = useState<RelatedItem[]>([]);
  const { data: session } = useSession();

  const images = (product.images ?? []).map(prefixImage);
  const thumbs = images.slice(0, 5);
  const extra = images.length - 5;
  const locationText =
    product.location ??
    (product.area && product.city ? `${product.area}, ${product.city}` : product.city ?? "");

  const categoryRoute = detectCategoryRoute(product.category);
  const categoryLabel = getCategoryLabel(categoryRoute);

  /* Dynamic specs */
  const dynamicSpecs: Record<string, string> = {};
  const specFields = [
    "brand", "model", "year", "mileage", "color", "warranty", "delivery",
    "fuelType", "transmission", "engine", "ram", "storage", "screenSize",
    "material", "size", "weight", "dimensions", "propertyType", "bedrooms",
    "bathrooms", "squareFeet", "furnished", "listingType", "jobType",
    "experience", "qualification", "salary", "employmentType",
  ];
  specFields.forEach((key) => {
    if (product[key] != null && product[key] !== "") {
      dynamicSpecs[key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())] = String(product[key]);
    }
  });
  if (product.specs) {
    Object.entries(product.specs).forEach(([k, v]) => {
      dynamicSpecs[k] = String(v);
    });
  }
  const specEntries = Object.entries(dynamicSpecs);

  /* Related products */
  useEffect(() => {
    if (!product.category) return;
    fetch(`${API_BASE}/api/listings?category=${encodeURIComponent(product.category)}&limit=8`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((json) => {
        const list = Array.isArray(json) ? json : json.listings ?? json.data ?? [];
        const cards: RelatedItem[] = list
          .filter((r: any) => r.id !== product.id)
          .slice(0, 8)
          .map((r: any) => ({
            id: r.id,
            title: r.title ?? "Untitled",
            price: formatPrice(r.price, r.currency),
            location: r.location ?? r.city ?? r.area ?? "",
            image: prefixImage(r.images?.[0] ?? r.image),
            category: r.category,
          }));
        setRelated(cards);
      })
      .catch(() => {});
  }, [product.category, product.id]);

  /* Wishlist check */
  useEffect(() => {
    if (!session?.accessToken || !id) return;
    fetch(`${API_BASE}/api/wishlist/check/${id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setIsFav(data.favorited); })
      .catch(() => {});
  }, [id, session?.accessToken]);

  const toggleFavorite = async () => {
    if (!session?.accessToken) { toast.error("Please log in to save items"); return; }
    setFavLoading(true);
    const prev = isFav;
    setIsFav(!prev);
    try {
      const res = await fetch(`${API_BASE}/api/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ listingId: id }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setIsFav(data.favorited);
      toast.success(data.favorited ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      setIsFav(prev);
      toast.error("Something went wrong");
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: product.title, url: window.location.href }); return; }
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    } catch { toast.error("Could not share"); }
  };

  const handleContact = (type: "chat" | "call") => {
    if (type === "call" && product.seller?.phone) {
      window.location.href = `tel:${product.seller.phone}`;
    } else {
      toast.success("Opening chat…");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} newestOnTop closeOnClick pauseOnHover />
      <style>{`
        .pd-page { background: #f1f5f9; min-height: 100vh; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding-bottom: 60px; }
        .pd-container { max-width: 1200px; margin: 0 auto; padding: 24px; display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .pd-left { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
        .pd-breadcrumb { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 12px 0; }
        .pd-bc-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: #94a3b8; }
        .pd-bc-link { color: #64748b; text-decoration: none; font-weight: 500; transition: color 0.18s; }
        .pd-bc-link:hover { color: #C0392B; }
        .pd-bc-sep { color: #cbd5e1; font-size: 12px; }
        .pd-bc-current { color: #1e293b; font-weight: 600; }
        .pd-img-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .pd-main-img-wrap { position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; background: #f8fafc; }
        .pd-main-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .pd-main-img-wrap:hover .pd-main-img { transform: scale(1.04); }
        .pd-thumbs { display: flex; gap: 8px; padding: 12px; overflow-x: auto; }
        .pd-thumb { position: relative; flex-shrink: 0; width: 88px; height: 60px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2.5px solid transparent; transition: all 0.2s; background: #f1f5f9; }
        .pd-thumb:hover { transform: translateY(-2px); }
        .pd-thumb.active { border-color: #C0392B; }
        .pd-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .pd-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; }
        .pd-info-card { background: #fff; border-radius: 16px; padding: 22px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .pd-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
        .pd-title { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3; margin: 0; word-break: break-word; }
        .pd-actions { display: flex; gap: 10px; flex-shrink: 0; margin-top: 2px; }
        .pd-action-btn { width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; transition: all 0.2s; }
        .pd-action-btn:hover { background: #f8fafc; border-color: #cbd5e1; transform: scale(1.1); color: #334155; }
        .pd-action-btn.fav { border-color: #fecaca; background: #fef2f2; color: #ef4444; }
        .pd-price { font-size: 28px; font-weight: 900; color: #C0392B; margin: 8px 0 14px; letter-spacing: -0.5px; }
        .pd-price-neg { font-size: 13px; color: #16a34a; font-weight: 600; margin-left: 8px; }
        .pd-meta-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; margin-bottom: 16px; }
        .pd-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; }
        .pd-badge-cat { background: #f3e8ff; color: #7c3aed; }
        .pd-badge-cond { background: #dbeafe; color: #1d4ed8; }
        .pd-badge-loc { background: #f1f5f9; color: #475569; font-weight: 500; text-transform: none; }
        .pd-badge-time { background: #fff7ed; color: #c2410c; font-weight: 500; text-transform: none; }
        .pd-sidebar-card { background: #fff; border-radius: 16px; padding: 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; position: sticky; top: 20px; }
        .pd-seller-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .pd-seller-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); background: #e2e8f0; }
        .pd-seller-name { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 2px; }
        .pd-seller-role { font-size: 12.5px; color: #64748b; }
        .pd-seller-badges { display: flex; gap: 6px; margin-bottom: 18px; flex-wrap: wrap; }
        .pd-sb { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
        .pd-sb-verified { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .pd-cta { display: flex; flex-direction: column; gap: 10px; }
        .pd-btn { width: 100%; padding: 12px; border-radius: 10px; border: none; font-size: 14.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; font-family: inherit; }
        .pd-btn-cart { background: linear-gradient(135deg, #C0392B 0%, #a93226 100%); color: #fff; box-shadow: 0 4px 14px rgba(192,57,43,0.3); }
        .pd-btn-cart:hover { opacity: 0.93; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(192,57,43,0.35); }
        .pd-btn-buy { background: #fff; color: #C0392B; border: 2px solid #C0392B; }
        .pd-btn-buy:hover { background: #fef2f2; }
        .pd-btn-chat { background: linear-gradient(135deg, #8e44ad 0%, #6c3483 100%); color: #fff; box-shadow: 0 4px 14px rgba(142,68,173,0.3); }
        .pd-btn-chat:hover { opacity: 0.93; transform: translateY(-1px); }
        .pd-btn-call { background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); color: #fff; box-shadow: 0 4px 14px rgba(39,174,96,0.3); text-decoration: none; }
        .pd-btn-call:hover { opacity: 0.93; transform: translateY(-1px); }
        .pd-desc-card { background: #fff; border-radius: 16px; padding: 22px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .pd-sec-title { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 12px; }
        .pd-desc-text { font-size: 14px; color: #475569; line-height: 1.75; margin: 0; }
        .pd-desc-text.clamped { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .pd-see-more { display: inline-block; margin-top: 10px; font-size: 13.5px; font-weight: 700; color: #C0392B; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
        .pd-see-more:hover { opacity: 0.75; }
        .pd-details-card { background: #fff; border-radius: 16px; padding: 22px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; border-top: 3px solid #4B6BFB; }
        .pd-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .pd-d-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; gap: 12px; }
        .pd-d-row:last-child { border-bottom: none; }
        .pd-d-left { border-right: 1px solid #f1f5f9; padding-right: 28px; }
        .pd-d-right { padding-left: 28px; }
        .pd-d-label { color: #64748b; font-weight: 400; }
        .pd-d-val { color: #0f172a; font-weight: 700; text-align: right; }
        .pd-tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
        .pd-tag { display: inline-flex; align-items: center; padding: 5px 12px; background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 20px; font-size: 12px; font-weight: 500; color: #475569; }
        .pd-related { max-width: 1200px; margin: 0 auto; padding: 28px 24px 0; }
        .pd-rel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .pd-rel-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
        .pd-rel-view { font-size: 13.5px; font-weight: 700; color: #C0392B; text-decoration: none; }
        .pd-rel-view:hover { opacity: 0.75; }
        .pd-rel-scroll { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        .pd-rel-scroll::-webkit-scrollbar { height: 5px; }
        .pd-rel-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .pd-rel-card { flex-shrink: 0; width: 180px; background: #fff; border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e8f0; text-decoration: none; display: flex; flex-direction: column; transition: all 0.22s; }
        .pd-rel-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-color: #cbd5e1; }
        .pd-rel-img-wrap { width: 100%; height: 120px; overflow: hidden; background: #f8fafc; }
        .pd-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .pd-rel-card:hover .pd-rel-img { transform: scale(1.07); }
        .pd-rel-body { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 3px; }
        .pd-rel-name { font-size: 12.5px; font-weight: 700; color: #0f172a; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; }
        .pd-rel-price { font-size: 13px; font-weight: 800; color: #C0392B; margin: 2px 0 0; }
        .pd-rel-loc { font-size: 11px; color: #94a3b8; margin: 0; }
        @media (max-width: 900px) {
          .pd-container { grid-template-columns: 1fr; }
          .pd-sidebar-card { position: static; }
          .pd-details-grid { grid-template-columns: 1fr; }
          .pd-d-left { border-right: none; padding-right: 0; }
          .pd-d-right { padding-left: 0; }
        }
        @media (max-width: 640px) {
          .pd-container { padding: 16px; }
          .pd-title { font-size: 18px; }
          .pd-price { font-size: 24px; }
          .pd-main-img-wrap { aspect-ratio: 4/3; }
          .pd-thumb { width: 68px; height: 48px; }
          .pd-info-card, .pd-desc-card, .pd-details-card, .pd-sidebar-card { padding: 16px 18px; }
          .pd-related { padding: 20px 16px 0; }
        }
      `}</style>

      <div className="pd-page">
        {/* ── Breadcrumb ── */}
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <div className="pd-bc-inner">
            <Link href="/" className="pd-bc-link">Home</Link>
            <span className="pd-bc-sep">›</span>
            {categoryRoute ? (
              <>
                <Link href={`/category/${categoryRoute}`} className="pd-bc-link">{categoryLabel}</Link>
                <span className="pd-bc-sep">›</span>
              </>
            ) : null}
            <span className="pd-bc-current">{product.title}</span>
          </div>
        </nav>

        <div className="pd-container">
          <div className="pd-left">
            {/* ── Images ── */}
            <div className="pd-img-card">
              <div className="pd-main-img-wrap">
                <img src={images[activeImg] ?? "/placeholder.png"} alt={product.title} className="pd-main-img" />
              </div>
              {thumbs.length > 1 && (
                <div className="pd-thumbs">
                  {thumbs.map((src, i) => (
                    <div key={i} className={`pd-thumb${activeImg === i ? " active" : ""}`} onClick={() => setActiveImg(i)}>
                      <img src={src} alt={`View ${i + 1}`} />
                      {i === 4 && extra > 0 && <div className="pd-thumb-overlay">+{extra}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="pd-info-card">
              <div className="pd-title-row">
                <h1 className="pd-title">{product.title}</h1>
                <div className="pd-actions">
                  <button className="pd-action-btn" onClick={handleShare} title="Share"><FiShare2 size={16} /></button>
                  <button className={`pd-action-btn${isFav ? " fav" : ""}`} onClick={toggleFavorite} disabled={favLoading} title="Save">
                    {isFav ? <FaHeart size={16} /> : <FiHeart size={16} />}
                  </button>
                </div>
              </div>
              <div className="pd-price">
                {formatPrice(product.price, product.currency)}
                {product.negotiable && <span className="pd-price-neg">(Negotiable)</span>}
              </div>
              <div className="pd-meta-row">
                {product.category && <span className="pd-badge pd-badge-cat"><FiTag size={11} /> {product.category}</span>}
                {product.condition && <span className="pd-badge pd-badge-cond"><FiShield size={11} /> {product.condition}</span>}
                {locationText && <span className="pd-badge pd-badge-loc"><FiMapPin size={11} /> {locationText}</span>}
                {product.postedDaysAgo != null && <span className="pd-badge pd-badge-time"><FiClock size={11} /> {timeAgo(product.postedDaysAgo)}</span>}
              </div>
            </div>

            {/* ── Description ── */}
            {product.description && (
              <div className="pd-desc-card">
                <h2 className="pd-sec-title">Description</h2>
                <p className={`pd-desc-text${showFullDesc ? "" : " clamped"}`}>{product.description}</p>
                {product.description.length > 200 && (
                  <button className="pd-see-more" onClick={() => setShowFullDesc((v) => !v)}>{showFullDesc ? "See Less ▲" : "See More ▼"}</button>
                )}
              </div>
            )}

            {/* ── Details ── */}
            {specEntries.length > 0 && (
              <div className="pd-details-card">
                <h2 className="pd-sec-title">Details</h2>
                <div className="pd-details-grid">
                  <div className="pd-d-left">
                    {specEntries.slice(0, Math.ceil(specEntries.length / 2)).map(([k, v]) => (
                      <div className="pd-d-row" key={k}><span className="pd-d-label">{k}</span><span className="pd-d-val">{v}</span></div>
                    ))}
                  </div>
                  <div className="pd-d-right">
                    {specEntries.slice(Math.ceil(specEntries.length / 2)).map(([k, v]) => (
                      <div className="pd-d-row" key={k}><span className="pd-d-label">{k}</span><span className="pd-d-val">{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Features / Tags ── */}
            {(product.features?.length || product.tags?.length) ? (
              <div className="pd-desc-card">
                <h2 className="pd-sec-title">Features</h2>
                <div className="pd-tags-wrap">
                  {(product.features ?? product.tags ?? []).map((f) => <span key={f} className="pd-tag">{f}</span>)}
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Sidebar ── */}
          <div className="pd-sidebar-card">
            <div className="pd-seller-top">
              <img src={prefixImage(product.seller?.image)} alt={product.seller?.name} className="pd-seller-avatar" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }} />
              <div>
                <div className="pd-seller-name">{product.seller?.name ?? "Seller"}</div>
                <div className="pd-seller-role">{product.seller?.isVerified ? "Verified Seller" : "Individual Seller"}</div>
              </div>
            </div>
            <div className="pd-seller-badges">
              {product.seller?.isVerified && <span className="pd-sb pd-sb-verified"><FiCheckCircle size={12} /> Verified</span>}
            </div>
            <div className="pd-cta">
              <button className="pd-btn pd-btn-cart" onClick={() => toast.success("Added to cart")}><FiShoppingCart size={16} /> Add to Cart</button>
              <button className="pd-btn pd-btn-buy" onClick={() => toast.success("Redirecting to checkout…")}><FiBox size={16} /> Buy Now</button>
              <button className="pd-btn pd-btn-chat" onClick={() => handleContact("chat")}><FiMessageSquare size={16} /> Chat with Seller</button>
              {product.seller?.phone && <button className="pd-btn pd-btn-call" onClick={() => handleContact("call")}><FiPhone size={16} /> Call Seller</button>}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="pd-related">
            <div className="pd-rel-header">
              <h2 className="pd-rel-title">Related Products</h2>
              {categoryRoute && (
                <Link href={`/category/${categoryRoute}`} className="pd-rel-view">View All →</Link>
              )}
            </div>
            <div className="pd-rel-scroll">
              {related.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="pd-rel-card">
                  <div className="pd-rel-img-wrap"><img src={item.image} alt={item.title} className="pd-rel-img" /></div>
                  <div className="pd-rel-body">
                    <p className="pd-rel-name">{item.title}</p>
                    <p className="pd-rel-price">{item.price}</p>
                    <p className="pd-rel-loc">{item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}