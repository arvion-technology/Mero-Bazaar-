"use client";

import Link from "next/link";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiPlus,
  FiClock,
  FiLayers,
  FiShoppingCart,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useKycStatus } from "../../../components/kycstatusContext";
import { useEffect, useState } from "react";

const ACCENT = "#3b82f6";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";

const chartData = [
  { month: "Jan", sales: 28, earnings: 22, expenses: 14 },
  { month: "Feb", sales: 42, earnings: 35, expenses: 18 },
  { month: "Mar", sales: 38, earnings: 40, expenses: 22 },
  { month: "Apr", sales: 52, earnings: 45, expenses: 20 },
  { month: "May", sales: 68, earnings: 58, expenses: 26 },
  { month: "Jun", sales: 82, earnings: 75, expenses: 30 },
];

interface MonthlySalesData {
  month: string;
  sales: number;
  loss: number;
  revenue: number;
}

export default function SellerDashboard() {
  const { kycStatus, kycRejectionReason } = useKycStatus();
  const maxVal = Math.max(...chartData.map(d => Math.max(d.sales, d.earnings)));

  const totalRevenue = chartData.reduce((sum, d) => sum + d.earnings, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const isProfit = netProfit >= 0;

  const isKycLocked = kycStatus !== "VERIFIED";
  const [chartData, setChartData] = useState<MonthlySalesData[]>([]);
  const [chartLoading, setChartLoading] = useState(true);


  const stats = [
    {
      icon: FiPlus,
      label: "Add Product",
      value: "New",
      sub: isKycLocked ? "Locked until KYC approved" : "Create a new listing",
      color: ACCENT,
      bg: "#eff6ff",
      href: isKycLocked ? null : "/seller/products/add",
      locked: isKycLocked,
    },
    { icon: FiShoppingCart, label: "Total Orders", value: "320", change: "+12.5%", changeType: "up" as const, sub: "vs last month", color: SUCCESS, bg: "#ecfdf5" },
    { icon: FiClock, label: "Pending", value: "15", change: "-3.2%", changeType: "down" as const, sub: "needs attention", color: WARNING, bg: "#fffbeb" },
    { icon: FiLayers, label: "Products", value: "58", change: "+5", changeType: "up" as const, sub: "active listings", color: "#8b5cf6", bg: "#f5f3ff" },
  ];

  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("/api/vendor-sales-overview?months=6", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((r) => r.json())
      .then((d) => setChartData(d))
      .catch(() => setChartData([]))
      .finally(() => setChartLoading(false));
  }, [session?.accessToken]);

  return (
    <>
      {kycStatus === "NOT_STARTED" && (
        <div style={{
          background: "#EFF6FF", color: "#1E40AF", padding: "14px 16px",
          borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500,
          border: "1px solid #BFDBFE", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div style={{ fontWeight: 700 }}>Complete your seller verification to start listing products.</div>
          <Link href="/kyc" style={{ background: "#1D4ED8", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
            Get Started
          </Link>
        </div>
      )}

      {kycStatus === "PENDING" && (
        <div style={{ background: "#FFF3CD", color: "#856404", padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500, border: "1px solid #ffc107" }}>
          Your KYC is under review. You will be able to create listings once approved.
        </div>
      )}

      {kycStatus === "REJECTED" && (
        <div style={{
          background: "#FEF2F2", color: "#991B1B", padding: "14px 16px",
          borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500,
          border: "1px solid #FCA5A5", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: kycRejectionReason ? 4 : 0 }}>
              Your KYC was rejected. You can't list products until this is resolved.
            </div>
            {kycRejectionReason && <div style={{ fontSize: 12.5 }}><strong>Reason:</strong> {kycRejectionReason}</div>}
          </div>
          <Link href="/kyc" style={{ background: "#B91C1C", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
            Update KYC Info
          </Link>
        </div>
      )}

      <div className="dash-stats">
        {stats.map((stat) => {
          if (stat.locked) {
            return (
              <div
                key={stat.label}
                className="dash-stat-card"
                style={{ "--stat-color": stat.color, opacity: 0.6, cursor: "not-allowed" } as React.CSSProperties}
                onClick={() => toast.error("Your KYC is pending verification. You can add products once approved.")}
              >
                <div className="dash-stat-icon-wrap" style={{ background: stat.bg, color: stat.color }}>
                  <stat.icon size={22} />
                </div>
                <div className="dash-stat-info">
                  <div className="dash-stat-label">{stat.label}</div>
                  <div className="dash-stat-value">{stat.value}</div>
                  <div className="dash-stat-footer">
                    <span className="dash-stat-sub">{stat.sub}</span>
                  </div>
                </div>
              </div>
            );
          }

          const CardInner = (
            <>
              <div className="dash-stat-icon-wrap" style={{ background: stat.bg, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <div className="dash-stat-info">
                <div className="dash-stat-label">{stat.label}</div>
                <div className="dash-stat-value">{stat.value}</div>
                <div className="dash-stat-footer">
                  {stat.change && (
                    <span className={`dash-stat-change ${stat.changeType}`}>
                      {stat.changeType === "up" ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
                      {stat.change}
                    </span>
                  )}
                  <span className="dash-stat-sub">{stat.sub}</span>
                </div>
              </div>
            </>
          );

          if (stat.href) {
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="dash-stat-card"
                style={{ "--stat-color": stat.color, textDecoration: "none" } as React.CSSProperties}
              >
                {CardInner}
              </Link>
            );
          }

          return (
            <div key={stat.label} className="dash-stat-card" style={{ "--stat-color": stat.color } as React.CSSProperties}>
              {CardInner}
            </div>
          );
        })}
      </div>

      <div className="dash-card">
        <div className="dash-chart-header">
          <h3 className="dash-chart-title">Sales Overview</h3>
          <div className="dash-chart-legend">
            <div className="dash-legend-item"><span className="dash-legend-dot" style={{ background: ACCENT }} />Sales</div>
            <div className="dash-legend-item"><span className="dash-legend-dot" style={{ background: DANGER }} />Earnings</div>
          </div>
        </div>

        {/* Revenue / Expenses / Profit-Loss summary */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}>
          <div style={{ background: "#ecfdf5", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Revenue</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: SUCCESS }}>NPR {totalRevenue}K</div>
          </div>
          <div style={{ background: "#fef2f2", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Expenses</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: DANGER }}>NPR {totalExpenses}K</div>
          </div>
          <div style={{ background: isProfit ? "#ecfdf5" : "#fef2f2", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>
              {isProfit ? "Net Profit" : "Net Loss"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: isProfit ? SUCCESS : DANGER }}>
              NPR {Math.abs(netProfit)}K
            </div>
          </div>
        </div>

        <div className="dash-chart-area">
          <svg className="dash-chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" /><stop offset="100%" stopColor={ACCENT} stopOpacity="0" /></linearGradient>
              <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={DANGER} stopOpacity="0.15" /><stop offset="100%" stopColor={DANGER} stopOpacity="0" /></linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="#f1f5f9" strokeWidth="1" />)}
            <polygon fill="url(#salesGrad)" points={`0,200 ${chartData.map((d, i) => `${i * 80},${200 - (d.sales / maxVal) * 180}`).join(" ")} 400,200`} />
            <polygon fill="url(#earnGrad)" points={`0,200 ${chartData.map((d, i) => `${i * 80},${200 - (d.earnings / maxVal) * 180}`).join(" ")} 400,200`} />
            <polyline fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={chartData.map((d, i) => `${i * 80},${200 - (d.sales / maxVal) * 180}`).join(" ")} />
            <polyline fill="none" stroke={DANGER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,4" points={chartData.map((d, i) => `${i * 80},${200 - (d.earnings / maxVal) * 180}`).join(" ")} />
            {chartData.map((d, i) => <circle key={`s-${i}`} cx={i * 80} cy={200 - (d.sales / maxVal) * 180} r="4" fill={ACCENT} stroke="#fff" strokeWidth="2.5" />)}
            {chartData.map((d, i) => <circle key={`e-${i}`} cx={i * 80} cy={200 - (d.earnings / maxVal) * 180} r="4" fill={DANGER} stroke="#fff" strokeWidth="2.5" />)}
          </svg>
        </div>
        <div className="dash-chart-months">{chartData.map((d) => <div key={d.month} className="dash-chart-month">{d.month}</div>)}</div>
      </div>
    </>
  );
}