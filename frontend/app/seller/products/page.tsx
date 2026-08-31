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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<Listing | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    fetch("/api/listings/mine", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
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

  function showToast(message: string) {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  async function handleDelete(item: Listing) {
    // const confirmed = window.confirm(
    //   `Are you sure you want to delete "${getDisplayTitle(item)}"?`,
    // );

    // if (!confirmed) return;

    if (!session?.accessToken) {
      showToast("Please login again.");
      return;
    }

    try {
      setDeletingId(item.id);

      const response = await fetch(`/api/listings/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete listing");
      }

      // Remove deleted listing from UI
      setProducts((prev) => prev.filter((product) => product.id !== item.id));

      // Success toast
      showToast("Listing deleted successfully.");
    } catch (error) {
      console.error("Delete listing failed:", error);

      showToast(
        error instanceof Error ? error.message : "Failed to delete listing",
      );
    } finally {
      setDeletingId(null);
    }
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

  return (
    <div
      style={{
        position: "relative",
        marginBottom: 28,
        borderRadius: 16,
        border: "1px solid #f1f5f9",
        background: "#fff",
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* SUCCESS / ERROR TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            background: "#16a34a",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          ✓ {toast}
        </div>
      )}
      {deleteItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => {
            if (!deletingId) setDeleteItem(null);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: PRIMARY,
              }}
            >
              Delete Listing?
            </h3>

            <p
              style={{
                margin: "10px 0 24px",
                fontSize: 14,
                lineHeight: 1.5,
                color: "#64748b",
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: PRIMARY }}>
                "{getDisplayTitle(deleteItem)}"
              </strong>
              ? This action cannot be undone.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                disabled={deletingId === deleteItem.id}
                onClick={() => setDeleteItem(null)}
                style={{
                  height: 38,
                  padding: "0 18px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#334155",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingId === deleteItem.id}
                onClick={async () => {
                  await handleDelete(deleteItem);
                  setDeleteItem(null);
                }}
                style={{
                  height: 38,
                  padding: "0 18px",
                  borderRadius: 8,
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    deletingId === deleteItem.id ? "not-allowed" : "pointer",
                  opacity: deletingId === deleteItem.id ? 0.6 : 1,
                }}
              >
                {deletingId === deleteItem.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TITLE */}
      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: PRIMARY,
            letterSpacing: "-0.2px",
          }}
        >
          Your Listings
        </h3>
      </div>

      {/* LOADING */}
      {productsLoading ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          Loading your listings...
        </div>
      ) : products.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          You haven&apos;t listed any products yet.
        </div>
      ) : (
        /* PRODUCTS */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {products.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(15, 23, 42, 0.10)";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(15, 23, 42, 0.06)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
              onClick={() => router.push(`/seller/products/${item.id}`)}
            >
              {/* IMAGE */}
              <div
                style={{
                  aspectRatio: "4/3",
                  background: "#f8fafc",
                }}
              >
                {item.images?.[0] && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.images[0]}`}
                    alt={getDisplayTitle(item)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              {/* DETAILS */}
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: PRIMARY,
                    marginBottom: 4,
                  }}
                >
                  {getDisplayTitle(item)}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  NPR {item.price?.toLocaleString("en-IN")}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    marginTop: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {item.category?.toLowerCase()}
                </div>

                {/* ACTION BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      const route = editRoutes[item.category];

                      if (route) {
                        router.push(`${route}?edit=${item.id}`);
                      } else {
                        router.push(`/seller/products/${item.id}`);
                      }
                    }}
                    style={{
                      flex: 1,
                      height: 34,
                      borderRadius: 7,
                      border: "1px solid #e2e8f0",
                      background: "#000080",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteItem(item);
                    }}
                    style={{
                      flex: 1,
                      height: 34,
                      borderRadius: 7,
                      border: "1px solid #fecaca",
                      background: "#dc2626",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor:
                        deletingId === item.id ? "not-allowed" : "pointer",
                      opacity: deletingId === item.id ? 0.6 : 1,
                    }}
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
