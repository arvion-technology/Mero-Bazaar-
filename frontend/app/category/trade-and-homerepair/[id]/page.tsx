"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import {
  FiShare2,
  FiHeart,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiChevronRight,
  FiTool,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { api } from "@/lib/api";
import { toTradesDetail, toTradesCard } from "@/lib/adapters/tradesAdapter";
import type { TradesDetail } from "@/app/types/listing";
import type { TradesCard } from "@/app/types/trades";
import SellerCard from "@/components/SellerCard";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DEFAULT_LAT = 27.7172;
const DEFAULT_LNG = 85.324;

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(rating) ? (
          <FaStar key={i} size={size} color="#F5A623" />
        ) : (
          <FaRegStar key={i} size={size} color="#F5A623" />
        ),
      )}
    </span>
  );
}

export default function TradeDetailPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [listing, setListing] = useState<TradesDetail | null>(null);
  const [similar, setSimilar] = useState<TradesCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFav, setIsFav] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();
  const [favLoading, setFavLoading] = useState(false);
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
  // const [leadMessage, setLeadMessage] = useState("");
  // const [leadPhone, setLeadPhone] = useState("");
  // const [sendingLead, setSendingLead] = useState(false);
  // const [leadSent, setLeadSent] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getTrade(id)
      .then((raw) => {
        if (cancelled) return;
        const detail = toTradesDetail(raw);
        setListing(detail);

        return api
          .getTrades(new URLSearchParams({ city: detail.city }))
          .then((rawList) => {
            if (cancelled) return;
            const cards = rawList
              .filter((l) => l.id !== id)
              .map((l) => {
                try {
                  return toTradesCard(l);
                } catch {
                  return null;
                }
              })
              .filter((c): c is TradesCard => c !== null)
              .slice(0, 5);
            setSimilar(cards);
          });
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load listing",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // const handleSendLead = async () => {
  //   if (!listing || !leadMessage.trim()) return;
  //   setSendingLead(true);
  //   try {
  //     await api.createTradeLead(listing.id, { message: leadMessage, phone: leadPhone || undefined });
  //     setLeadSent(true);
  //     setLeadMessage("");
  //     setLeadPhone("");
  //   } catch {
  //     alert("Couldn't send your request. Please try again.");
  //   } finally {
  //     setSendingLead(false);
  //   }
  // };

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#888" }}>
        Loading listing…
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#888" }}>
        <p style={{ fontWeight: 600, color: "#555" }}>
          Couldn&apos;t load this listing
        </p>
        <span>{error ?? "Listing not found"}</span>
      </div>
    );
  }

  const lat = listing.latitude ?? DEFAULT_LAT;
  const lng = listing.longitude ?? DEFAULT_LNG;
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

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        .cd-page {
          background: #f5f6f8; min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex; flex-direction: column;
        }
        .cd-main { flex: 1 0 auto; }
        .cd-footer-wrap { flex-shrink: 0; margin: 0; padding: 0; }

        .cd-topbar { background: #fff; border-bottom: 1px solid #ececec; padding: 10px 0; }
        .cd-topbar-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 22px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 6px;
        }
        .cd-breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: #888; flex-wrap: wrap; }
        .cd-bc-link { color: #C0392B; text-decoration: none; font-weight: 500; }
        .cd-bc-link:hover { text-decoration: underline; }
        .cd-bc-sep { color: #ccc; font-size: 11px; margin: 0 1px; }
        .cd-bc-cur { color: #444; font-weight: 500; }
        .cd-lid { font-size: 12px; color: #999; font-weight: 500; }

        .cd-wrap {
          max-width: 1180px; margin: 18px auto 0; padding: 0 22px;
          display: grid; grid-template-columns: 1fr 310px; gap: 18px; align-items: start;
        }
        .cd-left  { display: flex; flex-direction: column; gap: 14px; }
        .cd-right { display: flex; flex-direction: column; gap: 14px; }

        .cd-info-card {
          background: #fff; border-radius: 14px; padding: 18px 20px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .cd-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .cd-title { font-size: 20px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px; }
        .cd-title-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .cd-action-btn, .cd-share-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #e0e0e0; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, border-color 0.2s, transform 0.2s; }
        .cd-action-btn:hover { background: #f5f5f5; border-color: #ccc; transform: scale(1.1); }
        .cd-action-btn.fav-active { border-color: #e74c3c; background: #fff5f5; }
       

        .cd-badge-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 8px 0 4px; }
        .cd-badge-verified {
          display: inline-flex; align-items: center; gap: 4px;
          background: #dff5e9; color: #1a7a43; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #b2e0c2;
        }
        .cd-badge-warranty {
          display: inline-flex; align-items: center; gap: 4px;
          background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #bfdbfe;
        }
        .cd-badge-emergency {
          display: inline-flex; align-items: center; gap: 4px;
          background: #fff8e1; color: #b07000; font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 5px; border: 1px solid #f5d58a;
        }

        .cd-price { font-size: 22px; font-weight: 900; color: #1a1a1a; margin: 4px 0 8px; }
        .cd-meta-row {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          font-size: 12.5px; color: #666; padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0; margin-bottom: 14px;
        }
        .cd-meta-item { display: flex; align-items: center; gap: 4px; }

        .cd-lead-card {
          background: #fff; border-radius: 14px; padding: 16px 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .cd-lead-textarea {
          width: 100%; min-height: 80px; padding: 10px 12px; border-radius: 9px;
          border: 1.5px solid #e2e8f0; font-family: inherit; font-size: 13px; resize: vertical;
        }
        .cd-lead-input {
          width: 100%; padding: 10px 12px; border-radius: 9px;
          border: 1.5px solid #e2e8f0; font-family: inherit; font-size: 13px; margin-top: 8px;
        }
        .cd-lead-submit {
          margin-top: 10px; padding: 11px 20px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer;
          font-family: inherit; width: 100%;
        }
        .cd-lead-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .cd-chips-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding-top: 2px; }
        .cd-chip {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          background: #f8f9fb; border-radius: 10px; padding: 10px 6px 9px;
          border: 1px solid #eef0f3; text-align: center;
        }
        .cd-chip-icon {
          width: 30px; height: 30px; display: flex; align-items: center;
          justify-content: center; background: #fff; border-radius: 7px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .cd-chip-val   { font-size: 11px; font-weight: 800; color: #1a1a1a; line-height: 1.2; }
        .cd-chip-label { font-size: 9.5px; color: #999; font-weight: 500; }

        .cd-desc-card {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 1px solid #e8e8e8;
        }
        .cd-sec-title  { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 10px; }
        .cd-desc-text  { font-size: 13px; color: #444; line-height: 1.85; margin: 0; }
        .cd-desc-text.clip { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .cd-see-more {
          display: inline-block; margin-top: 6px; font-size: 12.5px;
          font-weight: 600; color: #d97706; background: none; border: none;
          cursor: pointer; padding: 0; font-family: inherit;
        }

        .cd-skills-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .cd-skill-tag {
          padding: 6px 13px; border-radius: 100px; font-size: 12.5px; font-weight: 600;
          background: #fef3c7; color: #b45309; border: 1px solid #fcd34d;
        }

        .cd-company-card {
          background: #fff; border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;
        }
        .cd-company-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
        .cd-company-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cd-company-logo { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 1px solid #eee; background: #f8f8f8; flex-shrink: 0; display: block; }
        .cd-company-name { font-size: 15px; font-weight: 800; color: #1a1a1a; margin: 0 0 3px; }
        .cd-company-rating { display: flex; align-items: center; gap: 5px; }
        .cd-company-rnum { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .cd-company-rcount { font-size: 11.5px; color: #888; }
        .cd-ci-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 7px 0; border-bottom: 1px solid #f8f8f8; font-size: 12px; gap: 8px;
        }
        .cd-ci-row:last-child { border-bottom: none; }
        .cd-ci-label { color: #888; font-weight: 500; flex-shrink: 0; }
        .cd-ci-val { color: #1a1a1a; font-weight: 600; text-align: right; word-break: break-all; }

        .cd-location-card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e8e8e8; }
        .cd-location-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; margin: 0; padding: 14px 16px 10px; border-bottom: 1px solid #f0f0f0; }
        .cd-location-info { padding: 10px 16px; }
        .cd-loc-name { font-size: 13px; font-weight: 700; color: #1a1a1a; margin: 0 0 2px; }
        .cd-loc-city { font-size: 11.5px; color: #666; margin: 0 0 6px; }
        .cd-map-link {
          display: flex; align-items: center; justify-content: center; gap: 4px;
          font-size: 12.5px; font-weight: 600; color: #C0392B;
          text-decoration: none; border-top: 1px solid #f0f0f0;
          padding: 9px 16px; transition: background 0.18s;
        }
        .cd-map-link:hover { background: #fff5f5; }

        .cd-similar { max-width: 1180px; margin: 0 auto; padding: 22px 22px 0; }
        .cd-similar-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .cd-similar-title { font-size: 17px; font-weight: 800; color: #1a1a1a; margin: 0; }
        .cd-similar-all { font-size: 13px; font-weight: 600; color: #C0392B; text-decoration: none; display: flex; align-items: center; gap: 3px; }
        .cd-similar-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
        .cd-sim-card {
          flex-shrink: 0; width: 160px; background: #fff; border-radius: 11px;
          padding: 12px; border: 1.5px solid #ebebeb; text-decoration: none;
          display: flex; flex-direction: column; gap: 6px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cd-sim-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.1); }
        .cd-sim-icon {
          width: 36px; height: 36px; border-radius: 10px; background: #fef3c7;
          display: flex; align-items: center; justify-content: center;
        }
        .cd-sim-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin: 0; }
        .cd-sim-loc { font-size: 10px; color: #aaa; margin: 2px 0 0; display: flex; align-items: center; gap: 2px; }

        @media (max-width: 960px) {
          .cd-wrap { grid-template-columns: 1fr; }
          .cd-right { order: -1; }
        }
        @media (max-width: 640px) {
          .cd-wrap { padding: 0 12px; margin-top: 10px; gap: 10px; }
          .cd-similar { padding: 16px 12px 0; }
          .cd-info-card { padding: 14px; }
          .cd-title { font-size: 17px; }
          .cd-price { font-size: 18px; }
        }
      `}</style>

      <div className="cd-page">
        <div className="cd-topbar">
          <div className="cd-topbar-inner">
            <nav className="cd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="cd-bc-link">
                Home
              </Link>
              {listing.breadcrumbs.map((crumb, i) => (
                <span
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span className="cd-bc-sep">›</span>
                  {i === listing.breadcrumbs.length - 1 ? (
                    <span className="cd-bc-cur">{crumb}</span>
                  ) : (
                    <Link
                      href="/category/trade-and-homerepair"
                      className="cd-bc-link"
                    >
                      {crumb}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="cd-wrap">
          <div className="cd-left">
            <div className="cd-info-card">
              <div className="cd-title-row">
                <h1 className="cd-title">{listing.title}</h1>
                <div className="cd-title-actions">
                  <div className="cd-badge-row">
                    {listing.isVerified && (
                      <span className="cd-badge-verified">
                        <FiCheckCircle
                          size={9}
                          color="#1a7a43"
                          style={{ marginRight: 3 }}
                        />
                        Verified
                      </span>
                    )}
                    {listing.warrantyGiven && (
                      <span className="cd-badge-warranty">
                        <FiShield
                          size={9}
                          color="#1d4ed8"
                          style={{ marginRight: 3 }}
                        />
                        Warranty
                      </span>
                    )}
                    {listing.emergencyAvailable && (
                      <span className="cd-badge-emergency">
                        <FiZap
                          size={9}
                          color="#b07000"
                          style={{ marginRight: 3 }}
                        />
                        Emergency
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="cd-price">{listing.calloutCharge}</div>

              <div className="cd-meta-row">
                <span className="cd-meta-item">
                  <FiMapPin size={11} color="#888" style={{ marginRight: 3 }} />
                  {listing.location}
                </span>
                <span className="cd-meta-item">
                  <FiClock size={12} color="#bbb" style={{ marginRight: 3 }} />
                  Posted {listing.postedDaysAgo} day
                  {listing.postedDaysAgo !== 1 ? "s" : ""} ago
                </span>
                <button
                  className="cd-share-btn"
                  onClick={() => {
                    if (navigator.share)
                      navigator.share({
                        title: listing.title,
                        url: window.location.href,
                      });
                  }}
                >
                  <FiShare2 size={16} />
                </button>
                <button
                  className={`cd-action-btn${isFav ? " fav-active" : ""}`}
                  aria-label="Save to wishlist"
                  onClick={handleToggleFavorite}
                  disabled={favLoading}
                >
                  {isFav ? (
                    <FaHeart size={14} color="#e74c3c" />
                  ) : (
                    <FiHeart size={14} color="#888" />
                  )}
                </button>
              </div>

              <div className="cd-chips-row">
                <div className="cd-chip">
                  <div className="cd-chip-icon">
                    <FiTool size={14} color="#b45309" />
                  </div>
                  <span className="cd-chip-val">
                    {listing.serviceAreaKm} km
                  </span>
                  <span className="cd-chip-label">Service Area</span>
                </div>
                <div className="cd-chip">
                  <div className="cd-chip-icon">
                    <FiClock size={14} color="#b45309" />
                  </div>
                  <span className="cd-chip-val">{listing.avgResponseTime}</span>
                  <span className="cd-chip-label">Avg Response</span>
                </div>
                <div className="cd-chip">
                  <div className="cd-chip-icon">
                    <FiShield size={14} color="#b45309" />
                  </div>
                  <span className="cd-chip-val">
                    {listing.warrantyGiven ? "Yes" : "No"}
                  </span>
                  <span className="cd-chip-label">Warranty</span>
                </div>
              </div>
            </div>

            <div className="cd-desc-card">
              <h2 className="cd-sec-title">Description</h2>
              <p className={`cd-desc-text${!showFull ? " clip" : ""}`}>
                {listing.description}
              </p>
              {listing.description.length > 200 && (
                <button
                  className="cd-see-more"
                  onClick={() => setShowFull((v) => !v)}
                >
                  {showFull ? "See Less" : "See More"}
                </button>
              )}
            </div>

            {listing.skillTags.length > 0 && (
              <div className="cd-desc-card">
                <h2 className="cd-sec-title">Skills & Services</h2>
                <div className="cd-skills-row">
                  {listing.skillTags.map((tag) => (
                    <span key={tag} className="cd-skill-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cd-right">
            <div className="cd-seller-card">
              <SellerCard
                seller={listing.seller}
                reviews={listing.reviews}
                listingId={listing.id}
                sellerId={listing.sellerId}
              />
            </div>

            {/* <div className="cd-lead-card">
              <p className="cd-company-card-title" style={{ marginBottom: 10 }}>Request a Quote</p>
              {leadSent ? (
                <p style={{ fontSize: 13, color: "#0b8a6b", fontWeight: 600 }}>
                  <FiCheckCircle size={14} style={{ marginRight: 4 }} />
                  Your request has been sent.
                </p>
              ) : (
                <>
                  <textarea
                    className="cd-lead-textarea"
                    placeholder="Describe what you need help with…"
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                  />
                  <input
                    className="cd-lead-input"
                    placeholder="Your phone number (optional)"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                  />
                  <button
                    className="cd-lead-submit"
                    onClick={handleSendLead}
                    disabled={sendingLead || !leadMessage.trim()}
                  >
                    <FiMessageSquare size={13} style={{ marginRight: 6 }} />
                    {sendingLead ? "Sending…" : "Send Request"}
                  </button>
                </>
              )}
            </div> */}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="cd-similar">
            <div className="cd-similar-hdr">
              <h2 className="cd-similar-title">Similar Trades</h2>
              <Link
                href="/category/trade-and-homerepair"
                className="cd-similar-all"
              >
                View All
                <FiChevronRight size={12} color="#C0392B" />
              </Link>
            </div>
            <div className="cd-similar-row">
              {similar.map((sim) => (
                <Link
                  key={sim.id}
                  href={`/category/trade-and-homerepair/${sim.id}`}
                  className="cd-sim-card"
                >
                  <div className="cd-sim-icon">
                    <FiTool size={16} color="#b45309" />
                  </div>
                  <p className="cd-sim-title">{sim.title}</p>
                  <p className="cd-sim-loc">
                    <FiMapPin
                      size={8}
                      color="#bbb"
                      style={{ marginRight: 3 }}
                    />
                    {sim.location}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="cd-footer-wrap">
        <Footer />
      </div>
    </>
  );
}
