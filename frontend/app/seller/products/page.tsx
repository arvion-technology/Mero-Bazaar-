"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const PRIMARY = "#0f172a";

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
  vehicle: VehicleDetails | null;
}

export default function SellerProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState<Listing[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("/api/listings/mine", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!r.ok || !Array.isArray(d)) {
          console.error("listings/mine fetch failed:", d);
          setProducts([]);
          return;
        }
        setProducts(d);
      })
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, [session?.accessToken]);

  function getDisplayTitle(item: Listing) {
    if (item.category === "VEHICLE" && item.vehicle) {
      return `${item.vehicle.brand} ${item.vehicle.year}`;
    }
    return item.title;
  }

  return (
    <div style={{ marginBottom: 28, borderRadius: 16, border: "1px solid #f1f5f9", background: "#fff", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: PRIMARY, letterSpacing: "-0.2px" }}>
          Your Listings
        </h3>
      </div>

      {productsLoading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          Loading your listings...
        </div>
      ) : products.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          You haven't listed any products yet.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {products.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #f1f5f9",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/seller/products/${item.id}`)}
            >
              <div style={{ aspectRatio: "4/3", background: "#f8fafc" }}>
                {item.images?.[0] && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.images[0]}`}
                    alt={getDisplayTitle(item)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: PRIMARY, marginBottom: 4 }}>
                  {getDisplayTitle(item)}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  NPR {item.price?.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, textTransform: "capitalize" }}>
                  {item.category?.toLowerCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}