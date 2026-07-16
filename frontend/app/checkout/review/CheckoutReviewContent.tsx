"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type ListingPreview = {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  vehicle?: { reservationFee: number | null } | null;
};

type OrderResult = {
  id: string;
  totalPrice: number;
  priceAtOrder: number;
  status: "PENDING";
  reservedUntil: string;
};

export default function CheckoutReviewContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const { data: session } = useSession();
  const router = useRouter();

  const [listing, setListing] = useState<ListingPreview | null>(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [reserving, setReserving] = useState(false);

  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!listingId || !accessToken) return;
    (async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setListing(data);
      } catch {
        toast.error("Couldn't load this listing.");
      } finally {
        setLoadingListing(false);
      }
    })();
  }, [listingId, accessToken]);

  const handleReserve = async () => {
    if (!accessToken || !listingId) return;
    setReserving(true);
    try {
      const res = await fetch("/api/orders/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ listingId }),
      });

      if (res.status === 409) {
        const err = await res.json();
        toast.error(err.message || "This item is no longer available.");
        return;
      }
      if (!res.ok) throw new Error();

      const order: OrderResult = await res.json();
      router.push(`/checkout/${order.id}?fresh=1`);
    } catch {
      toast.error("Couldn't reserve this item. Please try again.");
    } finally {
      setReserving(false);
    }
  };

  if (!listingId) return <div style={{ padding: 40 }}>No listing selected.</div>;
  if (loadingListing) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!listing) return <div style={{ padding: 40 }}>Listing not found.</div>;

  const isVehicle = listing.category === "VEHICLE";
  const fee = listing.vehicle?.reservationFee;

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 14px rgba(0,0,0,.07)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Review your reservation</h1>

        {listing.images?.[0] && (
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12, marginBottom: 16 }}
          />
        )}

        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{listing.title}</p>

        {isVehicle ? (
          <>
            <p style={{ fontSize: 13, color: "#888", margin: "8px 0 2px" }}>
              Vehicle price: NPR {listing.price.toLocaleString()}
            </p>
            {fee ? (
              <p style={{ fontSize: 22, fontWeight: 900, color: "#C0392B", margin: "0 0 12px" }}>
                Reservation fee: NPR {fee.toLocaleString()}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: "#e74c3c", margin: "0 0 12px" }}>
                This vehicle has no reservation fee set by the seller yet.
              </p>
            )}
            <p style={{ fontSize: 12.5, color: "#777", marginBottom: 16 }}>
              You&apos;re paying a reservation fee now to hold this vehicle for 15 minutes.
              The remaining balance and document transfer happen directly with the seller.
            </p>
          </>
        ) : (
          <p style={{ fontSize: 22, fontWeight: 900, color: "#C0392B", margin: "8px 0 16px" }}>
            NPR {listing.price.toLocaleString()}
          </p>
        )}

        <button
          onClick={handleReserve}
          disabled={reserving || (isVehicle && !fee)}
          style={{
            width: "100%", padding: 13, borderRadius: 10, border: "none",
            background: reserving || (isVehicle && !fee) ? "#ccc" : "linear-gradient(135deg, #C0392B 0%, #8e1c10 100%)",
            color: "#fff", fontWeight: 700, fontSize: 14.5,
            cursor: reserving ? "not-allowed" : "pointer",
          }}
        >
          {reserving ? "Reserving…" : "Confirm & Reserve"}
        </button>
      </div>
    </div>
  );
}