"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FiPackage, FiTag, FiClock } from "react-icons/fi";

const PRIMARY = "#0f172a";
const ACCENT = "#3b82f6";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";
const CARD_BG = "#ffffff";

const CATEGORY_COLORS = [ACCENT, SUCCESS, WARNING, DANGER, "#8b5cf6", "#06b6d4", "#f97316", "#ec4899", "#84cc16"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: WARNING,
  CONFIRMED: ACCENT,
  DELIVERED: SUCCESS,
  CANCELLED: DANGER,
  EXPIRED: "#94a3b8",
};

interface TopListing {
  listingId: string;
  title: string;
  category: string;
  orderCount: number;
  revenue: number;
}

interface CategoryBreakdown {
  category: string;
  orderCount: number;
  revenue: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
}

function formatNPR(value: number) {
  const abs = Math.abs(value);
  if (abs >= 100000) return `NPR ${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `NPR ${(abs / 1000).toFixed(1)}K`;
  return `NPR ${abs.toLocaleString("en-IN")}`;
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
      {label}
    </div>
  );
}

export default function SellerReportsPage() {
  const { data: session } = useSession();
  const [topListings, setTopListings] = useState<TopListing[] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[] | null>(null);
  const [statusData, setStatusData] = useState<StatusBreakdown[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${session.accessToken}` };
        const [topRes, catRes, statusRes] = await Promise.all([
          fetch("/api/reports/top-listings", { headers }),
          fetch("/api/reports/category-breakdown", { headers }),
          fetch("/api/reports/order-status-breakdown", { headers }),
        ]);

        if (!topRes.ok || !catRes.ok || !statusRes.ok) {
          throw new Error("Failed to load one or more reports");
        }

        const [top, cat, status] = await Promise.all([
          topRes.json(),
          catRes.json(),
          statusRes.json(),
        ]);

        if (!cancelled) {
          setTopListings(Array.isArray(top) ? top : []);
          setCategoryData(Array.isArray(cat) ? cat : []);
          setStatusData(Array.isArray(status) ? status : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setTopListings([]);
          setCategoryData([]);
          setStatusData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [session?.accessToken]);

  const totalOrders = (statusData ?? []).reduce((sum, s) => sum + s.count, 0);

  return (
    <div>
      <style>{`
        .rep-header { margin-bottom: 24px; }
        .rep-title { font-size: 22px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.3px; margin-bottom: 4px; }
        .rep-subtitle { font-size: 13px; color: #64748b; }

        .rep-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; margin-bottom: 20px; }

        .rep-card {
          background: ${CARD_BG};
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          width: 100%;
        }

        .rep-card-title { font-size: 14px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 16px; letter-spacing: -0.2px; }

        .rep-listing-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f8fafc;
        }
        .rep-listing-row:last-child { border-bottom: none; }
        .rep-listing-title { font-size: 13px; font-weight: 600; color: ${PRIMARY}; margin-bottom: 2px; }
        .rep-listing-meta { font-size: 11px; color: #94a3b8; text-transform: capitalize; }
        .rep-listing-revenue { font-size: 13px; font-weight: 700; color: ${SUCCESS}; }

        .rep-status-pills { display: flex; flex-direction: column; gap: 10px; }
        .rep-status-pill { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; background: #f8fafc; }
        .rep-status-label { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; color: #475569; }
        .rep-status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .rep-status-count { font-size: 13px; font-weight: 700; color: ${PRIMARY}; }

        @media (max-width: 1023px) {
          .rep-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rep-header">
        <div className="rep-title">Reports</div>
        <div className="rep-subtitle">Insights into your top listings and category performance</div>
      </div>

      <div className="rep-grid">
        {/* Top Listings */}
        <div className="rep-card">
          <div className="rep-card-title">
            <FiPackage style={{ marginRight: 6, verticalAlign: -2 }} size={15} />
            Top Selling Listings
          </div>
          {loading ? (
            <EmptyState label="Loading top listings..." />
          ) : error ? (
            <EmptyState label={error} />
          ) : !topListings || topListings.length === 0 ? (
            <EmptyState label="No delivered orders yet." />
          ) : (
            <div>
              {topListings.map((item) => (
                <div key={item.listingId} className="rep-listing-row">
                  <div>
                    <div className="rep-listing-title">{item.title}</div>
                    <div className="rep-listing-meta">
                      {item.category.toLowerCase()} · {item.orderCount} order{item.orderCount === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="rep-listing-revenue">{formatNPR(item.revenue)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="rep-card">
          <div className="rep-card-title">
            <FiClock style={{ marginRight: 6, verticalAlign: -2 }} size={15} />
            Order Status
          </div>
          {loading ? (
            <EmptyState label="Loading..." />
          ) : error ? (
            <EmptyState label={error} />
          ) : !statusData || statusData.length === 0 ? (
            <EmptyState label="No orders yet." />
          ) : (
            <div className="rep-status-pills">
              {statusData.map((s) => (
                <div key={s.status} className="rep-status-pill">
                  <div className="rep-status-label">
                    <span
                      className="rep-status-dot"
                      style={{ background: STATUS_COLORS[s.status] ?? "#94a3b8" }}
                    />
                    {s.status.charAt(0) + s.status.slice(1).toLowerCase()}
                  </div>
                  <div className="rep-status-count">
                    {s.count}
                    {totalOrders > 0 && (
                      <span style={{ color: "#94a3b8", fontWeight: 500, marginLeft: 6, fontSize: 11 }}>
                        ({Math.round((s.count / totalOrders) * 100)}%)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="rep-card">
        <div className="rep-card-title">
          <FiTag style={{ marginRight: 6, verticalAlign: -2 }} size={15} />
          Revenue by Category
        </div>
        {loading ? (
          <EmptyState label="Loading category breakdown..." />
        ) : error ? (
          <EmptyState label={error} />
        ) : !categoryData || categoryData.length === 0 ? (
          <EmptyState label="No delivered orders yet." />
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#f1f5f9" }}
                  tickLine={false}
                  tickFormatter={(v) => formatNPR(v).replace("NPR ", "")}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                  tickFormatter={(v: string) => v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, " ")}
                />
                <Tooltip
                  formatter={(value: number) => formatNPR(value)}
                  labelFormatter={(label: string) => label.charAt(0) + label.slice(1).toLowerCase().replace(/_/g, " ")}
                  contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}