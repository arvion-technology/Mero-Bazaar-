"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import {
  FiMapPin,
  FiArrowLeft,
  FiPhone,
  FiShare2,
  FiCalendar,
  FiStar,
  FiClock,
  FiScissors,
  FiHome,
  FiFrown,
  FiZap,
  FiCheck,
  FiHeart,
} from "react-icons/fi";
import { FaHeart, FaSpa } from "react-icons/fa";
import { toBeautyCard, toBeautyDetail } from "@/lib/adapters/beautyAdapter";
import type { BeautyListing, BeautyCard } from "@/app/types/beauty";
import type { BeautyDetail } from "@/app/types/listing";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BeautyBookingPanel from "@/components/BeautyBookingPanel";

const RELATED_LIMIT = 3;

/* Only things Tailwind can't express inline: font import, body overflow, keyframes */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  html, body { overflow-x: hidden; }
  @keyframes bdpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;

const PANEL_SHADOW = "shadow-[0_2px_8px_rgba(0,0,0,0.05)]";
const CARD_BTN =
  "w-12 h-12 rounded-[9px] flex items-center justify-center border-[1.5px] border-[#e5e7eb] bg-[#f9fafb] text-[#374151] cursor-pointer p-0 transition-all duration-150";

async function fetchBeautyListing(id: string): Promise<BeautyListing | null> {
  const res = await fetch(`/api/beauty/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load listing (${res.status})`);
  return res.json();
}

function NotFoundView() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center font-[Inter,sans-serif] bg-[#f5f5f5] flex-col text-center py-10 px-5">
      <FiFrown size={56} color="#e11d48" />
      <h1 className="text-[22px] font-extrabold text-[#111] mt-3 mb-1.5">
        Service Not Found
      </h1>
      <p className="text-sm text-[#888] mt-0 mb-[18px]">
        The beauty service you are looking for does not exist.
      </p>
      <Link
        href="/category/beauty"
        className="inline-flex items-center gap-1.5 bg-[#e11d48] text-white font-bold text-[13px] py-2.5 px-[22px] rounded-lg no-underline"
      >
        <FiArrowLeft size={14} /> Back to Services
      </Link>
    </div>
  );
}

export default function BeautyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<BeautyDetail | null | undefined>(undefined); // undefined = loading, null = not found
  const [related, setRelated] = useState<BeautyCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
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

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    fetchBeautyListing(id)
      .then((raw) => {
        if (cancelled) return;
        if (!raw) {
          setItem(null);
          return;
        }
        setItem(toBeautyDetail(raw));
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Failed to load listing");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}/similar?limit=${RELATED_LIMIT}`,
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((raw: BeautyListing[]) => {
        if (cancelled) return;
        const relatedCards = raw
          .map((l) => {
            try {
              return toBeautyCard(l);
            } catch {
              return null;
            }
          })
          .filter((c): c is BeautyCard => c !== null);
        setRelated(relatedCards);
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const getCategoryBadgeClass = (serviceType: string) => {
    switch (serviceType) {
      case "Makeup Artist":
        return "bg-[#db2777] text-white";
      case "Salon":
        return "bg-[#7c3aed] text-white";
      case "Barber":
        return "bg-[#0f766e] text-white";
      case "Skincare":
        return "bg-[#1d4ed8] text-white";
      case "Spa":
        return "bg-[#059669] text-white";
      case "Cosmetics":
        return "bg-[#e11d48] text-white";
      case "Bridal":
        return "bg-[#f59e0b] text-white";
      default:
        return "bg-[#6b7280] text-white";
    }
  };

  const renderStars = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            fill={
              i < fullStars || (i === fullStars && hasHalf) ? "#f59e0b" : "none"
            }
            color={
              i < fullStars || (i === fullStars && hasHalf)
                ? "#f59e0b"
                : "#d1d5db"
            }
          />
        ))}
        <span className="text-[13px] font-bold text-[#111] ml-1.5">
          {rating.toFixed(1)}
        </span>
        {reviewCount > 0 && (
          <span className="text-xs text-[#9ca3af] ml-[3px]">
            ({reviewCount} Reviews)
          </span>
        )}
      </div>
    );
  };

  if (item === undefined) {
    return (
      <div>
        <div className="w-8 h-8 border-[3px] border-[#fbcfe8] border-t-[#e11d48] rounded-full animate-[spin_0.7s_linear_infinite]" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <NotFoundView />
        <Footer />
      </>
    );
  }

  if (item === null) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
        <style>{GLOBAL_CSS}</style>
        <NotFoundView />
        <Footer />
      </>
    );
  }

  const badgeClass = getCategoryBadgeClass(item.serviceType);
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
      <style>{GLOBAL_CSS}</style>

      <div className="min-h-screen bg-[#f5f5f5] font-[Inter,-apple-system,sans-serif]">
        {/* ── BREADCRUMB ── */}
        <div className="bg-white border-b border-[#e5e7eb]">
          <div className="max-w-[1200px] mx-auto py-3 px-6 flex items-center gap-1.5 text-xs text-[#9ca3af]">
            <Link
              href="/"
              className="text-[#9ca3af] no-underline transition-colors duration-150 hover:text-[#e11d48]"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/category/beauty"
              className="text-[#9ca3af] no-underline transition-colors duration-150 hover:text-[#e11d48]"
            >
              Hair, Beauty & Wellness
            </Link>
            <span>/</span>
            <span className="text-[#374151] font-semibold">{item.title}</span>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto pt-6 px-5 pb-[60px] max-[540px]:pt-4 max-[540px]:px-3.5 max-[540px]:pb-10">
          <Link
            href="/category/beauty"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6b7280] no-underline mb-[18px] transition-colors duration-150 hover:text-[#e11d48]"
          >
            <FiArrowLeft size={14} /> Back to all services
          </Link>

          <div className="grid grid-cols-[1fr_400px] gap-6 items-start max-[900px]:grid-cols-1">
            {/* ── LEFT ── */}
            <div>
              <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <div className="relative w-full h-[390px] overflow-hidden bg-[#e5e7eb]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.images[activeImg] ?? item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover block"
                  />
                  <button
                    className={`absolute top-2.5 left-2.5 w-8 h-8 min-w-[32px] border-none rounded-full flex items-center justify-center p-0 m-0 cursor-pointer z-20 shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-[transform,background-color] duration-150 ease-in-out hover:scale-[1.12] hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                      isFav ? "bg-[#fff1f2]" : "bg-white/95"
                    }`}
                    aria-label="Save to wishlist"
                    onClick={handleToggleFavorite}
                    disabled={favLoading}
                  >
                    {isFav ? (
                      <FaHeart size={15} color="#E74C3C" />
                    ) : (
                      <FiHeart size={15} color="#999" />
                    )}
                  </button>

                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold py-[3px] px-2 rounded-[5px] uppercase tracking-[0.4px] ${badgeClass}`}
                  >
                    {item.serviceType}
                  </span>

                  <span className="absolute bottom-2.5 left-2.5 bg-black/[0.58] text-white text-[10px] font-semibold rounded-md py-[3px] px-2 backdrop-blur-[4px]">
                    <FiClock size={10} className="mr-1 inline" />
                    {item.postedDaysAgo === 0
                      ? "Today"
                      : `${item.postedDaysAgo}d ago`}
                  </span>

                  {item.homeVisit && (
                    <span className="absolute bottom-2.5 right-2.5 bg-[rgba(225,29,72,0.88)] text-white text-[10px] font-bold rounded-md py-[3px] px-2 flex items-center gap-1">
                      <FiHome size={10} /> Home Visit Available
                    </span>
                  )}
                </div>
              </div>

              {item.images.length > 1 && (
                <div className="flex gap-2 mt-2.5 px-0.5">
                  {item.images.map((img, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={idx}
                      src={img}
                      alt={`${item.title} ${idx + 1}`}
                      className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 transition-[border-color,opacity,transform] duration-150 shrink-0 bg-[#e5e7eb] hover:opacity-85 hover:-translate-y-px max-[540px]:w-14 max-[540px]:h-14 ${
                        activeImg === idx
                          ? "border-[#e11d48]"
                          : "border-transparent"
                      }`}
                      onClick={() => setActiveImg(idx)}
                    />
                  ))}
                </div>
              )}

              <div className="bg-[#fdf2f8] border border-[#fbcfe8] rounded-[10px] py-3.5 px-4 mt-4">
                <p className="text-xs font-extrabold text-[#be185d] mb-2 flex items-center gap-1.5">
                  <FiZap size={14} /> Beauty Service Tips
                </p>
                {[
                  "Check provider reviews and portfolio before booking",
                  "Confirm product brands if you have allergies or preferences",
                  "For home visits, ensure a clean and well-lit space",
                  "Always patch test new products 24 hours before events",
                ].map((tip) => (
                  <div
                    key={tip}
                    className="flex items-start gap-1.5 text-[11.5px] text-[#831843] mb-[5px] leading-[1.5] last:mb-0"
                  >
                    <FiCheck size={12} className="mt-0.5 shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>

              {item.reviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-[0.5px] mb-3">
                    Reviews
                  </p>
                  {item.reviews.map((r, i) => (
                    <div key={i}>
                      <div>
                        <span>{r.reviewerName}</span>
                        <span>{r.createdAt}</span>
                      </div>
                      {renderStars(r.rating, 0)}
                      {r.comment && <p className="mt-1">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT ── */}
            <div className="flex flex-col gap-4">
              <div
                className={`bg-white rounded-xl border border-[#e5e7eb] p-5 ${PANEL_SHADOW}`}
              >
                <div>
                  <h1>{item.title}</h1>
                </div>
                <p className="text-[13px] text-[#6b7280] mt-0 mb-2.5">
                  <span className="inline-flex items-center gap-[5px]">
                    <FiScissors size={11} color="#9ca3af" />
                    {item.serviceType}
                  </span>
                </p>
                <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.5px] mt-0 mb-0.5">
                  Starting From
                </p>
                <p className="text-[26px] font-black text-[#e11d48] mt-0 mb-3">
                  {item.price}
                </p>
                <div className="w-10 h-[3px] bg-[#f43f5e] rounded-sm mb-3.5" />
                {item.detailedDescription && (
                  <p className="text-[13.5px] text-[#4b5563] leading-[1.7] mt-0 mb-4">
                    {item.detailedDescription}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold py-1 px-2.5 rounded-[5px] bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  {item.duration !== "N/A" && (
                    <DetailItem label="Duration">
                      <FiClock size={11} className="mr-1 inline" />
                      {item.duration}
                    </DetailItem>
                  )}
                  {item.studioLocation !== "N/A" && (
                    <DetailItem label="Studio Location">
                      {item.studioLocation}
                    </DetailItem>
                  )}
                  {item.experienceLevel !== "N/A" && (
                    <DetailItem label="Experience">
                      {item.experienceLevel}
                    </DetailItem>
                  )}
                  {item.genderPreference !== "N/A" && (
                    <DetailItem label="Gender Preference">
                      {item.genderPreference}
                    </DetailItem>
                  )}
                  <DetailItem label="Posted">
                    {item.postedDaysAgo === 0
                      ? "Today"
                      : `${item.postedDaysAgo} day${item.postedDaysAgo > 1 ? "s" : ""} ago`}
                  </DetailItem>
                </div>
                <div className="flex flex-wrap gap-2 mb-3.5">
                  {item.homeVisit && (
                    <span className="inline-flex items-center gap-[5px] bg-[#fce7f3] text-[#be185d] border border-[#fbcfe8] text-[11.5px] font-bold py-[5px] px-3 rounded-md">
                      <FiHome size={11} /> Home Visit Available
                    </span>
                  )}
                  {item.bridalAvailable && (
                    <span className="inline-flex items-center gap-[5px] bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[11.5px] font-bold py-[5px] px-3 rounded-md">
                      <FaSpa size={11} /> Bridal Service
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-[#fce7f3] border border-[#fbcfe8] rounded-lg py-2.5 px-3.5 text-[12.5px] font-bold text-[#be185d] mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#e11d48] shrink-0 animate-[bdpulse_1.4s_infinite]" />
                  Currently Accepting Bookings
                </div>
                <div className="flex gap-2.5">
                  {/* Scrolls to the booking panel below */}
                  <a
                    href="#booking"
                    className="flex-1 flex items-center justify-center gap-[7px] p-[13px] bg-[#e11d48] text-white text-sm font-extrabold border-none rounded-[9px] cursor-pointer font-[inherit] transition-[background-color,transform] duration-150 no-underline hover:bg-[#be123c] hover:-translate-y-px"
                  >
                    <FiCalendar size={16} />
                    Book Now
                  </a>
                  <button
                    className={`${CARD_BTN} hover:bg-[#fce7f3] hover:border-[#fbcfe8] hover:text-[#be185d]`}
                    onClick={() =>
                      window.open(`tel:${item.seller.phone}`, "_self")
                    }
                  >
                    <FiPhone size={16} />
                  </button>
                  <button
                    className={`${CARD_BTN} ease-in-out hover:bg-[#dbeafe] hover:border-[#93c5fd] hover:text-[#1d4ed8] hover:-translate-y-px active:scale-[0.96]`}
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

              <BeautyBookingPanel
                listingId={id}
                defaultName={session?.user?.name ?? ""}
              />

              <div
                className={`bg-white rounded-xl border border-[#e5e7eb] py-[18px] px-5 ${PANEL_SHADOW}`}
              >
                <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-[0.5px] mt-0 mb-3">
                  Service Provider
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[linear-gradient(135deg,#f43f5e,#e11d48)] flex items-center justify-center text-white text-lg font-extrabold shrink-0">
                      {(item.seller.name ?? "P")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#111]">
                        {item.seller.name}
                      </p>
                      <p className="text-xs text-[#6b7280] mt-0.5">
                        {item.seller.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-1.5 bg-[#e11d48] text-white text-[12.5px] font-extrabold border-none py-[9px] px-[18px] rounded-lg cursor-pointer font-[inherit] whitespace-nowrap transition-colors duration-150 hover:bg-[#be123c]"
                    onClick={() =>
                      window.open(`tel:${item.seller.phone}`, "_self")
                    }
                  >
                    <FiPhone size={13} /> Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-8">
              <p className="text-[17px] font-extrabold text-[#111] mt-0 mb-3.5">
                Similar {item.serviceType} Services
              </p>
              <div className="grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-2 max-[540px]:grid-cols-1">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/category/beauty/${r.id}`}
                    className="group block bg-white rounded-[10px] overflow-hidden border border-[#e5e7eb] no-underline text-inherit shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                  >
                    <div className="aspect-[16/11] overflow-hidden bg-[#e5e7eb]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.thumb}
                        alt={r.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="py-2.5 px-3">
                      <p className="text-[13.5px] font-bold text-[#111] mt-0 mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {r.title}
                      </p>
                      <p className="text-[13px] font-extrabold text-[#e11d48]">
                        {r.price}
                      </p>
                      {r.city && (
                        <p className="text-[11px] text-[#9ca3af] flex items-center gap-[3px] mt-[3px]">
                          <FiMapPin size={10} />
                          {r.city}
                        </p>
                      )}
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

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f9fafb] rounded-lg py-2.5 px-3 border border-[#f0f0f0]">
      <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-[0.5px] mb-[3px]">
        {label}
      </p>
      <p className="text-[13px] font-bold text-[#111]">{children}</p>
    </div>
  );
}