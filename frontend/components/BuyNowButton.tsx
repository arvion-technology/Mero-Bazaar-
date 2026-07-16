"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type Props = {
  listingId: string;
  price: number;
  status?: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
};

export default function BuyNowButton({ listingId, price, status = "ACTIVE" }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!session?.accessToken) {
      toast.info("Please log in to continue.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ listingId }),
      });

      if (res.status === 409) {
        toast.error("This vehicle was just reserved by someone else.");
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error("Failed to reserve");

      const order = await res.json();
      router.push(`/checkout/${order.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "SOLD") {
    return (
      <button disabled className="bn-btn bn-btn-disabled">
        Sold
      </button>
    );
  }

  if (status === "RESERVED") {
    return (
      <button disabled className="bn-btn bn-btn-disabled">
        Reserved — Unavailable
      </button>
    );
  }

  return (
    <>
      <style>{`
        .bn-btn {
          width: 100%; padding: 13px; border-radius: 10px; border: none;
          font-size: 14.5px; font-weight: 700; cursor: pointer; font-family: inherit;
          background: linear-gradient(135deg, #C0392B 0%, #8e1c10 100%);
          color: #fff; box-shadow: 0 4px 14px rgba(192,57,43,.3);
          transition: opacity .2s, transform .15s;
        }
        .bn-btn:hover { opacity: .9; transform: translateY(-1px); }
        .bn-btn-disabled { background: #ccc; box-shadow: none; cursor: not-allowed; }
      `}</style>
      <button className="bn-btn" onClick={handleBuyNow} disabled={loading}>
        {loading ? "Reserving…" : `Buy Now — NPR ${price.toLocaleString()}`}
      </button>
    </>
  );
}