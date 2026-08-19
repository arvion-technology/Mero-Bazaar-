"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toFoodsCard, toFoodsDetail } from "@/lib/adapters/foodsAdapter";
import type { FoodsListing, FoodsCard } from "@/app/types/foods";
import type { FoodDetail } from "@/app/types/listing";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import {
  FiMapPin,
  FiMessageSquare,
  FiArrowLeft,
  FiPhone,
  FiShare2,
  FiCheckCircle,
  FiStar,
  FiClock,
  FiHeart,
} from "react-icons/fi";
import { FaHeart, FaUtensils } from "react-icons/fa";
import SellerCard from "@/components/SellerCard";
import { useFoodCart } from "../../../context/FoodCartContext";

const RELATED_LIMIT = 3;

const FOOD_TYPE_BADGE_STYLE: Record<
  string,
  { background: string; color: string }
> = {
  Tiffin: { background: "#e11d48", color: "#fff" },
  Bakery: { background: "#b45309", color: "#fff" },
  Dairy: { background: "#f59e0b", color: "#fff" },
  Meat: { background: "#dc2626", color: "#fff" },
  Organic: { background: "#16a34a", color: "#fff" },
  "Home Cooked": { background: "#be185d", color: "#fff" },
  Wholesale: { background: "#1d4ed8", color: "#fff" },
};

const STATUS_LABEL: Record<FoodDetail["status"], string> = {
  ACTIVE: "Currently Accepting Orders",
  RESERVED: "Temporarily Reserved",
  SOLD: "No Longer Available",
  EXPIRED: "Listing Expired",
};

export default function FoodDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addItem } = useFoodCart();

  const [rawItem, setRawItem] = useState<FoodsListing | null>(null);
  const [item, setItem] = useState<FoodDetail | null>(null);
  const [related, setRelated] = useState<FoodsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { data: session } = useSession();
  const [favLoading, setFavLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session?.accessToken || !id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/check/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setIsFav(data.favorited);
        }
      })
      .catch(() => {});
  }, [id, session?.accessToken]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const raw = await api.getFood(id);
        if (cancelled) return;
        setRawItem(raw);
        setItem(toFoodsDetail(raw));

        // Related: same food type, excluding this listing
        const all = await api.getFoods();
        if (cancelled) return;
        const rel = all
          .filter(
            (l) => l.id !== raw.id && l.foods?.foodType === raw.foods?.foodType,
          )
          .slice(0, RELATED_LIMIT)
          .map(toFoodsCard);
        setRelated(rel);
      } catch (err) {
        console.error("Failed to load food listing:", err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const renderStars = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            fill={
              i < fullStars
                ? "#f59e0b"
                : i === fullStars && hasHalf
                  ? "#f59e0b"
                  : "none"
            }
            color={
              i < fullStars || (i === fullStars && hasHalf)
                ? "#f59e0b"
                : "#d1d5db"
            }
          />
        ))}
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#111",
            marginLeft: 6,
          }}
        >
          {rating.toFixed(1)}
        </span>
        <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 3 }}>
          ({reviewCount} Reviews)
        </span>
      </div>
    );
  };

  const handleOrderNow = () => {
    if (!item) return;

    // Safely parse price whether it's a number or formatted string (e.g. "Rs. 280")
    const numericPrice =
      typeof item.price === "number"
        ? item.price
        : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;

    addItem({
      id: item.id,
      listingId: item.id,
      name: item.title,
      description: item.description || item.foodType || "",
      variant: item.priceUnit || "",
      price: numericPrice,
      quantity: 1,
      image: item.images[0] || "",
    });

    router.push("/cart");
  };

  if (loading) {
    return (
      <>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            color: "#6b7280",
          }}
        >
          Loading restaurant details…
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !item || !rawItem) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          .fd-404 {
            min-height: 80vh; display: flex; align-items: center; justify-content: center;
            font-family: 'Inter', sans-serif; background: #f5f5f5; flex-direction: column;
            text-align: center; padding: 40px 20px;
          }
          .fd-404 h1 { font-size: 22px; font-weight: 800; color: #111; margin: 12px 0 6px; }
          .fd-404 p { font-size: 14px; color: #888; margin: 0 0 18px; }
          .fd-back-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: #16a34a; color: #fff; font-weight: 700; font-size: 13px;
            padding: 10px 22px; border-radius: 8px; text-decoration: none;
          }
        `}</style>
        <div className="fd-404">
          <div style={{ fontSize: 56, color: "#16a34a" }}>
            <FaUtensils />
          </div>
          <h1>Restaurant Not Found</h1>
          <p>The restaurant you are looking for does not exist.</p>
          <Link href="/category/food" className="fd-back-btn">
            <FiArrowLeft size={14} /> Back to Restaurants
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const badgeStyle = FOOD_TYPE_BADGE_STYLE[item.foodType] ?? {
    background: "#6b7280",
    color: "#fff",
  };
  const handleToggleFavorite = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to save listings");
      return;
    }

    setFavLoading(true);

    const previousState = isFav;
    setIsFav(!previousState);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            listingId: id,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update wishlist");
      }

      const data = await res.json();

      setIsFav(data.favorited);

      toast.success(
        data.favorited ? "Added to wishlist" : "Removed from wishlist",
      );
    } catch (error) {
      console.error(error);
      setIsFav(previousState);
      toast.error("Something went wrong, please try again");
    } finally {
      setFavLoading(false);
    }
  };
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .fd-wrap {
          min-height: 100vh; background: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .fd-breadcrumb-bar { background: #fff; border-bottom: 1px solid #e5e7eb; }
        .fd-breadcrumb-inner {
          max-width: 1200px; margin: 0 auto; padding: 12px 24px;
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
          font-size: 12px; color: #9ca3af;
        }
        .fd-breadcrumb-inner a { color: #9ca3af; text-decoration: none; transition: color 0.15s; }
        .fd-breadcrumb-inner a:hover { color: #16a34a; }
        .fd-breadcrumb-inner span.active { color: #374151; font-weight: 600; }

        .fd-body { max-width: 1200px; margin: 0 auto; padding: 24px 20px 60px; }

        .fd-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          text-decoration: none; margin-bottom: 18px; transition: color 0.15s;
        }
        .fd-back:hover { color: #16a34a; }

        .fd-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; align-items: start; }

        .fd-img-section {
          background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
          overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .fd-main-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #e5e7eb; }
        .fd-main-img { width: 100%; height: 100%; object-fit: cover; }
        .fd-img-cat-badge {
          position: absolute; top: 12px; right: 12px;
          font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 5px;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .fd-img-fav-btn {
          position: absolute; top: 12px; left: 12px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.15s; padding: 0;
        }
        .fd-img-fav-btn:hover { transform: scale(1.12); }
        .fd-posted-tag {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(0,0,0,0.58); color: #fff;
          font-size: 10.5px; font-weight: 600; border-radius: 6px;
          padding: 3px 9px; backdrop-filter: blur(4px);
        }

        .fd-thumb-strip { display: flex; gap: 8px; padding: 12px; overflow-x: auto; }
        .fd-thumb {
          width: 72px; height: 72px; border-radius: 8px; object-fit: cover;
          cursor: pointer; border: 2px solid transparent;
          transition: border-color 0.15s, opacity 0.15s; flex-shrink: 0;
        }
        .fd-thumb:hover { opacity: 0.85; transform: translateY(-1px); }
        .fd-thumb.active { border-color: #16a34a; }

        .fd-right { display: flex; flex-direction: column; gap: 16px; }
        .fd-panel {
          background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
          padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .fd-name { font-size: 22px; font-weight: 900; color: #111; margin: 0 0 6px; }
        .fd-cuisine { font-size: 13px; color: #6b7280; margin: 0 0 10px; }
        .fd-price { font-size: 26px; font-weight: 900; color: #16a34a; margin: 0 0 12px; }
        .fd-price-divider { width: 40px; height: 3px; background: #4ade80; border-radius: 2px; margin-bottom: 14px; }

        .fd-desc { font-size: 13.5px; color: #4b5563; line-height: 1.7; margin-bottom: 16px; }

        .fd-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        .fd-detail-item { background: #f9fafb; border-radius: 8px; padding: 10px 12px; border: 1px solid #f0f0f0; }
        .fd-detail-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .fd-detail-val { font-size: 13px; font-weight: 700; color: #111; }

        .fd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .fd-badge-hygienic {
          display: inline-flex; align-items: center; gap: 5px;
          background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .fd-badge-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }
        .fd-badge-day {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fdf4ff; color: #86198f; border: 1px solid #f5d0fe;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 6px;
        }

        .fd-avail {
          display: flex; align-items: center; gap: 8px;
          border-radius: 8px; padding: 10px 14px; font-size: 12.5px; font-weight: 700;
          margin-bottom: 14px;
        }
        .fd-avail.active { background: #fef9c3; border: 1px solid #fde68a; color: #92400e; }
        .fd-avail.inactive { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; }
        .fd-avail-dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; animation: fdpulse 1.4s infinite; }
        @keyframes fdpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .fd-actions { display: flex; gap: 10px; }
        .fd-btn-order {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 13px; background: #16a34a; color: #fff;
          font-size: 14px; font-weight: 800; border: none; border-radius: 9px;
          cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.15s;
          text-decoration: none;
        }
        .fd-btn-order:hover { background: #15803d; transform: translateY(-1px); }
        .fd-btn-order:disabled { background: #d1d5db; cursor: not-allowed; transform: none; }
        .fd-btn-phone, .fd-btn-share {
          width: 48px; height: 48px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e5e7eb; background: #f9fafb;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .fd-btn-phone:hover { background: #d1fae5; border-color: #4ade80; color: #15803d; }
        .fd-btn-share:hover { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }

        .fd-seller-panel {
          background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
          padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .fd-seller-title { font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .fd-seller-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .fd-seller-avatar {
          width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
          background: linear-gradient(135deg, #4ade80, #16a34a);
        }
        .fd-seller-name { font-size: 14px; font-weight: 800; color: #111; display: flex; align-items: center; gap: 5px; }
        .fd-seller-phone { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .fd-seller-chat-btn {
          display: flex; align-items: center; gap: 6px;
          background: #16a34a; color: #fff; font-size: 12.5px; font-weight: 800;
          border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer;
          font-family: inherit; white-space: nowrap; transition: background 0.15s;
        }
        .fd-seller-chat-btn:disabled { background: #d1d5db; cursor: not-allowed; }
        .fd-seller-meta { display: flex; gap: 14px; margin-top: 12px; flex-wrap: wrap; font-size: 11.5px; color: #6b7280; }

        .fd-reviews { margin-top: 4px; }
        .fd-review-item { padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
        .fd-review-item:last-child { border-bottom: none; }
        .fd-review-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .fd-review-name { font-size: 12.5px; font-weight: 700; color: #111; }
        .fd-review-date { font-size: 11px; color: #9ca3af; }
        .fd-review-comment { font-size: 12.5px; color: #4b5563; line-height: 1.5; }
        .fd-no-reviews { font-size: 12.5px; color: #9ca3af; text-align: center; padding: 12px 0; }

        .fd-related { margin-top: 32px; }
        .fd-related-title { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 14px; }
        .fd-related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .fd-rel-card {
          background: #fff; border-radius: 10px; overflow: hidden;
          border: 1px solid #e5e7eb; text-decoration: none; color: inherit;
          display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .fd-rel-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .fd-rel-img-wrap { aspect-ratio: 16/11; overflow: hidden; background: #e5e7eb; }
        .fd-rel-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .fd-rel-card:hover .fd-rel-img { transform: scale(1.05); }
        .fd-rel-body { padding: 10px 12px; }
        .fd-rel-name { font-size: 13.5px; font-weight: 700; color: #111; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fd-rel-price { font-size: 13px; font-weight: 800; color: #16a34a; }
        .fd-rel-posted { font-size: 11px; color: #9ca3af; margin-top: 3px; }

        @media (max-width: 900px) {
          .fd-grid { grid-template-columns: 1fr; }
          .fd-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .fd-body { padding: 16px 14px 40px; }
          .fd-related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="fd-wrap">
        <div className="fd-breadcrumb-bar">
          <div className="fd-breadcrumb-inner">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/category/food">Food & Home Delivery</Link>
            <span>/</span>
            <span className="active">{item.title}</span>
          </div>
        </div>

        <div className="fd-body">
          <Link href="/category/food" className="fd-back">
            <FiArrowLeft size={14} /> Back to all restaurants
          </Link>

          <div className="fd-grid">
            {/* ── LEFT: IMAGE ── */}
            <div>
              <div className="fd-img-section">
                <div className="fd-main-img-wrap">
                  <img
                    src={item.images[activeImg]}
                    alt={item.title}
                    className="fd-main-img"
                  />
                  <button
                        type="button"
                        className="fd-img-fav-btn"
                        aria-label={
                          isFav ? "Remove from wishlist" : "Save to wishlist"
                        }
                        title={
                          isFav ? "Remove from wishlist" : "Save to wishlist"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFavorite();
                        }}
                        disabled={favLoading}
                      >
                        {isFav ? (
                          <FaHeart size={17} color="#E74C3C" />
                        ) : (
                          <FiHeart size={17} color="#666" />
                        )}
                      </button>

                  <span className="fd-img-cat-badge" style={badgeStyle}>
                    {item.foodType}
                  </span>

                  <span className="fd-posted-tag">
                    <FiClock size={10} style={{ marginRight: 4 }} />
                    {item.postedDaysAgo === 0
                      ? "Today"
                      : `${item.postedDaysAgo}d ago`}
                  </span>
                </div>

                {item.images.length > 1 && (
                  <div className="fd-thumb-strip">
                    {item.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${item.title} ${idx + 1}`}
                        className={`fd-thumb${activeImg === idx ? " active" : ""}`}
                        onClick={() => setActiveImg(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: DETAILS ── */}
            <div className="fd-right">
              <div className="fd-panel">
                <div className="jd-title-row">
                  <h1 className="jd-title">{item.title}</h1>
                </div>
                <p className="fd-cuisine">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <FaUtensils size={11} color="#9ca3af" />
                    {item.foodType} · {item.priceUnit}
                  </span>
                </p>
                <p className="fd-price">{item.price}</p>
                <div className="fd-price-divider" />
                {item.description && (
                  <p className="fd-desc">{item.description}</p>
                )}
                <div className="fd-details-grid">
                  <div className="fd-detail-item">
                    <p className="fd-detail-label">Negotiable</p>
                    <p className="fd-detail-val">
                      {item.negotiable ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="fd-detail-item">
                    <p className="fd-detail-label">Price Unit</p>
                    <p className="fd-detail-val">{item.priceUnit}</p>
                  </div>
                  <div className="fd-detail-item">
                    <p className="fd-detail-label">Posted</p>
                    <p className="fd-detail-val">
                      {item.postedDaysAgo === 0
                        ? "Today"
                        : `${item.postedDaysAgo} day${item.postedDaysAgo > 1 ? "s" : ""} ago`}
                    </p>
                  </div>
                </div>
                <div
                  className={`fd-avail ${item.status === "ACTIVE" ? "active" : "inactive"}`}
                >
                  {item.status === "ACTIVE" && (
                    <span className="fd-avail-dot" />
                  )}
                  {STATUS_LABEL[item.status]}
                </div>
                {/* ── ORDER NOW → ADD TO CART & GO ── */}
                <div className="fd-actions">
                  <button className="fd-btn-order" onClick={handleOrderNow}>
                    <FiMessageSquare size={16} /> Order Now
                  </button>
                  <button
                    className="fd-btn-share"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: item.title,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <FiShare2 size={16} />
                  </button>
                </div>
              </div>

              {/* Seller Panel */}
              <SellerCard
                seller={item.seller}
                reviews={item.reviews}
                listingId={item.id}
                sellerId={item.sellerId}
              />

              {item.latitude != null && item.longitude != null && (
                <Link
                  href={item.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12.5,
                    color: "#16a34a",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <FiMapPin size={14} /> View on Google Maps
                </Link>
              )}
            </div>
          </div>

          {/* ── RELATED LISTINGS ── */}
          {related.length > 0 && (
            <div className="fd-related">
              <p className="fd-related-title">
                Similar {item.foodType} Listings
              </p>
              <div className="fd-related-grid">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/category/food/${r.id}`}
                    className="fd-rel-card"
                  >
                    <div className="fd-rel-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.thumb} alt={r.title} className="fd-rel-img" />
                                          </div>
                    <div className="fd-rel-body">
                      <p className="fd-rel-name">{r.title}</p>
                      <p className="fd-rel-price">{r.price}</p>
                      <p className="fd-rel-posted">
                        {r.postedDaysAgo === 0
                          ? "Today"
                          : `${r.postedDaysAgo}d ago`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
