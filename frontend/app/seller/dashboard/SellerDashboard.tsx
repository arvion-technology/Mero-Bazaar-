"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiPlus,
  FiClock,
  FiLayers,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiTruck,
  FiHeart,
  FiHome,
  FiShoppingBag,
  FiScissors,
  FiBriefcase,
  FiTool,
  FiSun,
  FiCoffee,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useKycStatus } from "../../../components/kycstatusContext";
import { useEffect, useRef, useState } from "react";

const PRIMARY = "#0f172a";
const ACCENT = "#3b82f6";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";
const CARD_BG = "#ffffff";
const SITE_PRIMARY = "#C0392B";

interface MonthlySalesData {
  month: string;
  sales: number;
  loss: number;
  revenue: number;
}

type MetricView = "all" | "revenue" | "loss" | "profit";

const categories = [
  { name: "Vehicles", slug: "vehicle", icon: FiTruck },
  { name: "Medical & Dental", slug: "medical-dental", icon: FiHeart },
  { name: "Rent & Real Estate", slug: "rent-real-estate", icon: FiHome },
  { name: "Secondhand Goods", slug: "secondhand-goods", icon: FiShoppingBag },
  { name: "Hair, Beauty & Wellness", slug: "hair-beauty-wellness", icon: FiScissors },
  { name: "Jobs & Labour Hire", slug: "jobs-labour-hire", icon: FiBriefcase },
  { name: "Trades & Home Repair", slug: "trades-home-repair", icon: FiTool },
  { name: "Agriculture & Livestock", slug: "agriculture-livestock", icon: FiSun },
  { name: "Food & Home Delivery", slug: "food-home-delivery", icon: FiCoffee },
];

export default function SellerDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const { kycStatus, kycRejectionReason } = useKycStatus();
  const isKycLocked = kycStatus !== "VERIFIED";

  const [chartData, setChartData] = useState<MonthlySalesData[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<MetricView>("all");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [statsData, setStatsData] = useState<{
    totalProducts: number;
    productsThisMonth: number;
    productsLastMonth: number;
  } | null>(null);

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

  // lock page scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = showCategoryModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showCategoryModal]);

  const dataWithProfit = chartData.map((d) => ({
    ...d,
    profit: d.revenue - d.loss,
  }));

  const maxVal = (() => {
    if (dataWithProfit.length === 0) return 1;
    if (activeMetric === "revenue") return Math.max(...dataWithProfit.map((d) => d.revenue), 1);
    if (activeMetric === "loss") return Math.max(...dataWithProfit.map((d) => d.loss), 1);
    if (activeMetric === "profit") return Math.max(...dataWithProfit.map((d) => Math.abs(d.profit)), 1);
    return Math.max(...dataWithProfit.map((d) => Math.max(d.revenue, d.loss)), 1);
  })();

  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.loss, 0);
  const netProfit = totalRevenue - totalExpenses;
  const isProfit = netProfit >= 0;

  const productsDelta = statsData ? statsData.productsThisMonth - statsData.productsLastMonth : 0;
  const stats = [
    {
      icon: FiPlus,
      label: "Add Product",
      value: "New",
      sub: isKycLocked ? "Locked until KYC approved" : "Create a new listing",
      color: ACCENT,
      bg: "#eff6ff",
      locked: isKycLocked,
      action: "open-category-modal" as const,
    },
    { icon: FiShoppingCart, label: "Total Orders", value: "-",  sub: "coming soon", color: SUCCESS, bg: "#ecfdf5" },
    { icon: FiClock, label: "Pending", value: "-", sub: "coming soon", color: WARNING, bg: "#fffbeb" },
    { icon: FiLayers, label: "Products", 
      value: statsData ? String(statsData.totalProducts) : "-",
      change: statsData ? `${productsDelta >= 0 ? "+" : ""}${productsDelta}` : undefined,
      changeType: productsDelta >= 0 ? ("up" as const) : ("down" as const),
      sub: "active listings",
      color: "#8b5cf6", 
      bg: "#f5f3ff" },
  ];

  const linePoints = (key: "revenue" | "loss" | "profit") =>
    dataWithProfit
      .map((d, i) => {
        const val = key === "profit" ? d.profit : d[key];
        const y = 100 - (val / maxVal) * 90;
        return `${i * 80},${y}`;
      })
      .join(" ");

  const areaPoints = (key: "revenue" | "loss" | "profit") =>
    `0,200 ${linePoints(key)} 400,200`;

  function handleCategorySelect(categoryName: string) {
    setSelectedCategory(categoryName);
  }

  function handleContinueToListing() {
    const cat = categories.find((c) => c.name === selectedCategory);
    if (cat) {
      setShowCategoryModal(false);
      router.push(`/seller/listing/${cat.slug}`);
    }
  }

  function scrollSlider(direction: "left" | "right") {
    if (!sliderRef.current) return;
    const amount = 240;
    sliderRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("/api/listings/mine/stats", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
    .then((r) => {
      if (!r.ok) throw new Error(`Stats fetch failed: ${r.status}`);
      return r.json();
    })
    .then((d) => setStatsData(d))
    .catch((err) => {
      console.error(err);
      setStatsData(null);
  });
  }, [session?.accessToken]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .dash-stat-card {
          background: ${CARD_BG};
          border-radius: 16px;
          padding: 22px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          width: 100%;
          text-decoration: none;
          cursor: pointer;
        }

        .dash-stat-card::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--stat-color), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .dash-stat-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          transform: translateY(-3px);
          border-color: #e2e8f0;
        }

        .dash-stat-card:hover::after { opacity: 1; }

        .dash-stat-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          transition: transform 0.25s;
        }

        .dash-stat-card:hover .dash-stat-icon-wrap { transform: scale(1.08); }

        .dash-stat-info { flex: 1; min-width: 0; }
        .dash-stat-label { font-size: 12px; color: #94a3b8; font-weight: 500; margin-bottom: 6px; letter-spacing: 0.2px; }
        .dash-stat-value { font-size: 24px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 8px; letter-spacing: -0.5px; }
        .dash-stat-footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .dash-stat-change { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; display: flex; align-items: center; gap: 3px; }
        .dash-stat-change.up { background: #ecfdf5; color: ${SUCCESS}; }
        .dash-stat-change.down { background: #fef2f2; color: ${DANGER}; }
        .dash-stat-sub { font-size: 11px; color: #94a3b8; font-weight: 400; }

        .dash-two-col { display: grid; grid-template-columns: 1fr 1.4fr; gap: 24px; margin-bottom: 28px; }

        .dash-card {
          background: ${CARD_BG};
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          transition: box-shadow 0.25s;
          width: 100%;
          overflow: hidden;
        }

        .dash-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .dash-chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
        .dash-chart-title { font-size: 15px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.2px; }
        .dash-chart-legend { display: flex; gap: 16px; flex-wrap: wrap; }
        .dash-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; font-weight: 500; }
        .dash-legend-dot { width: 8px; height: 8px; border-radius: 50%; }
        .dash-chart-area { height: 200px; position: relative; width: 100%; }
        .dash-chart-svg { width: 100%; height: 100%; display: block; }
        .dash-chart-months { display: flex; justify-content: space-between; margin-top: 10px; padding: 0 4px; }
        .dash-chart-month { font-size: 11px; color: #94a3b8; text-align: center; flex: 1; font-weight: 500; }

        /* ---- Category Modal (glassmorphism) ---- */
        .cat-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: catFadeIn 0.2s ease;
        }

        @keyframes catFadeIn { from { opacity: 0; } to { opacity: 1; } }

        @keyframes catSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cat-modal-card {
          width: 100%;
          max-width: 620px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 24px 64px rgba(15, 23, 42, 0.25);
          animation: catSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cat-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .cat-modal-title { font-size: 19px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.3px; margin-bottom: 4px; }
        .cat-modal-subtitle { font-size: 13px; color: #64748b; }

        .cat-modal-close {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #475569;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .cat-modal-close:hover { background: #fff; color: #1e293b; }

        .cat-slider-wrap { position: relative; margin-bottom: 22px; }

        .cat-slider-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 4px 2px 12px;
          scrollbar-width: none;
        }

        .cat-slider-track::-webkit-scrollbar { display: none; }

        .cat-slide-card {
          flex: 0 0 140px;
          background: rgba(255, 255, 255, 0.55);
          border: 1.5px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
        }

        .cat-slide-card:hover {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .cat-slide-card.selected {
          background: linear-gradient(135deg, ${SITE_PRIMARY}, #e0574a);
          border-color: ${SITE_PRIMARY};
          box-shadow: 0 8px 24px rgba(192, 57, 43, 0.3);
        }

        .cat-slide-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(59, 130, 246, 0.12);
          color: ${ACCENT};
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }

        .cat-slide-card.selected .cat-slide-icon {
          background: rgba(255, 255, 255, 0.25);
          color: #fff;
        }

        .cat-slide-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          line-height: 1.3;
        }

        .cat-slide-card.selected .cat-slide-name { color: #fff; }

        .cat-slider-arrow {
          position: absolute;
          top: 42%;
          transform: translateY(-50%);
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #475569;
          transition: all 0.2s;
          z-index: 2;
        }

        .cat-slider-arrow:hover { background: #fff; color: ${SITE_PRIMARY}; }
        .cat-slider-arrow.left { left: -4px; }
        .cat-slider-arrow.right { right: -4px; }

        .cat-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

        .cat-modal-cancel {
          padding: 11px 20px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: rgba(255,255,255,0.6);
          color: #475569;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-modal-cancel:hover { background: #fff; }

        .cat-modal-continue {
          padding: 11px 26px;
          border-radius: 10px;
          border: none;
          background: ${SITE_PRIMARY};
          color: #fff;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(192, 57, 43, 0.3);
          transition: all 0.2s;
        }

        .cat-modal-continue:hover:not(:disabled) { background: #a5311f; transform: translateY(-1px); }
        .cat-modal-continue:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }

        @media (max-width: 1200px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 1023px) {
          .dash-two-col { grid-template-columns: 1fr; }
        }

        @media (max-width: 767px) {
          .dash-stats { grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px; }
          .dash-stat-card { padding: 16px; }
          .dash-stat-value { font-size: 20px; }
          .dash-two-col { gap: 16px; margin-bottom: 20px; }
          .dash-card { padding: 16px; }
          .dash-chart-area { height: 160px; }
          .cat-modal-card { padding: 20px; border-radius: 18px; }
          .cat-slide-card { flex-basis: 120px; padding: 14px 10px; }
        }

        @media (max-width: 480px) {
          .dash-stat-card { padding: 14px; }
          .dash-stat-icon-wrap { width: 40px; height: 40px; font-size: 18px; }
          .dash-stat-value { font-size: 18px; }
          .dash-card { padding: 14px; border-radius: 12px; }
          .dash-chart-area { height: 140px; }
          .cat-slider-arrow { display: none; }
        }
      `}</style>

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
                  {"change" in stat && stat.change && (
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

          // "Add Product" opens the modal instead of navigating
          if (stat.action === "open-category-modal") {
            return (
              <div
                key={stat.label}
                className="dash-stat-card"
                style={{ "--stat-color": stat.color } as React.CSSProperties}
                onClick={() => setShowCategoryModal(true)}
              >
                {CardInner}
              </div>
            );
          }

          return (
            <div key={stat.label} className="dash-stat-card" style={{ "--stat-color": stat.color } as React.CSSProperties}>
              {CardInner}
            </div>
          );
        })}
      </div>

      <div className="dash-two-col" style={{ gridTemplateColumns: "1fr" }}>
        {/* ---- Sales Overview card ---- */}
        <div className="dash-card">
          <div className="dash-chart-header">
            <h3 className="dash-chart-title">Sales Overview</h3>
            <div className="dash-chart-legend">
              <div className="dash-legend-item"><span className="dash-legend-dot" style={{ background: ACCENT }} />Revenue</div>
              <div className="dash-legend-item"><span className="dash-legend-dot" style={{ background: DANGER }} />Loss</div>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 20,
          }}>
            <div
              onClick={() => setActiveMetric(activeMetric === "revenue" ? "all" : "revenue")}
              style={{
                background: "#ecfdf5", borderRadius: 10, padding: "12px 14px",
                cursor: "pointer",
                border: activeMetric === "revenue" ? `2px solid ${SUCCESS}` : "2px solid transparent",
                transition: "border-color 0.15s ease",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Revenue</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: SUCCESS }}>NPR {totalRevenue}K</div>
            </div>

            <div
              onClick={() => setActiveMetric(activeMetric === "loss" ? "all" : "loss")}
              style={{
                background: "#fef2f2", borderRadius: 10, padding: "12px 14px",
                cursor: "pointer",
                border: activeMetric === "loss" ? `2px solid ${DANGER}` : "2px solid transparent",
                transition: "border-color 0.15s ease",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Expenses</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: DANGER }}>NPR {totalExpenses}K</div>
            </div>

            <div
              onClick={() => setActiveMetric(activeMetric === "profit" ? "all" : "profit")}
              style={{
                background: isProfit ? "#ecfdf5" : "#fef2f2", borderRadius: 10, padding: "12px 14px",
                cursor: "pointer",
                border: activeMetric === "profit" ? `2px solid ${isProfit ? SUCCESS : DANGER}` : "2px solid transparent",
                transition: "border-color 0.15s ease",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>
                {isProfit ? "Net Profit" : "Net Loss"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: isProfit ? SUCCESS : DANGER }}>
                NPR {Math.abs(netProfit)}K
              </div>
            </div>
          </div>

          {chartLoading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
              Loading chart...
            </div>
          ) : chartData.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
              No sales data yet.
            </div>
          ) : (
            <>
              <div className="dash-chart-area">
                <svg className="dash-chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" /><stop offset="100%" stopColor={ACCENT} stopOpacity="0" /></linearGradient>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={DANGER} stopOpacity="0.15" /><stop offset="100%" stopColor={DANGER} stopOpacity="0" /></linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SUCCESS} stopOpacity="0.2" /><stop offset="100%" stopColor={SUCCESS} stopOpacity="0" /></linearGradient>
                  </defs>
                  {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="#f1f5f9" strokeWidth="1" />)}

                  {(activeMetric === "all" || activeMetric === "revenue") && (
                    <>
                      <polygon fill="url(#revGrad)" points={areaPoints("revenue")} />
                      <polyline fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={linePoints("revenue")} />
                      {dataWithProfit.map((d, i) => (
                        <circle key={`r-${i}`} cx={i * 80} cy={100 - (d.revenue / maxVal) * 90} r="4" fill={ACCENT} stroke="#fff" strokeWidth="2.5" />
                      ))}
                    </>
                  )}

                  {(activeMetric === "all" || activeMetric === "loss") && (
                    <>
                      <polygon fill="url(#lossGrad)" points={areaPoints("loss")} />
                      <polyline fill="none" stroke={DANGER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,4" points={linePoints("loss")} />
                      {dataWithProfit.map((d, i) => (
                        <circle key={`l-${i}`} cx={i * 80} cy={100 - (d.loss / maxVal) * 90} r="4" fill={DANGER} stroke="#fff" strokeWidth="2.5" />
                      ))}
                    </>
                  )}

                  {activeMetric === "profit" && (
                    <>
                      <polygon fill="url(#profitGrad)" points={areaPoints("profit")} />
                      <polyline fill="none" stroke={SUCCESS} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={linePoints("profit")} />
                      {dataWithProfit.map((d, i) => (
                        <circle key={`p-${i}`} cx={i * 80} cy={100 - (d.profit / maxVal) * 90} r="4" fill={SUCCESS} stroke="#fff" strokeWidth="2.5" />
                      ))}
                    </>
                  )}
                </svg>
              </div>
              <div className="dash-chart-months">
                {chartData.map((d) => <div key={d.month} className="dash-chart-month">{d.month}</div>)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---- Category Selection Modal (glassmorphism + slider) ---- */}
      {showCategoryModal && (
        <div
          className="cat-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCategoryModal(false);
          }}
        >
          <div className="cat-modal-card">
            <div className="cat-modal-header">
              <div>
                <div className="cat-modal-title">Choose a category</div>
                <div className="cat-modal-subtitle">Slide to browse — pick where your listing belongs</div>
              </div>
              <button
                type="button"
                className="cat-modal-close"
                onClick={() => setShowCategoryModal(false)}
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="cat-slider-wrap">
              <button type="button" className="cat-slider-arrow left" onClick={() => scrollSlider("left")} aria-label="Scroll left">
                <FiChevronLeft size={18} />
              </button>

              <div className="cat-slider-track" ref={sliderRef}>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div
                      key={cat.name}
                      className={`cat-slide-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      <div className="cat-slide-icon">
                        <Icon size={20} />
                      </div>
                      <div className="cat-slide-name">{cat.name}</div>
                    </div>
                  );
                })}
              </div>

              <button type="button" className="cat-slider-arrow right" onClick={() => scrollSlider("right")} aria-label="Scroll right">
                <FiChevronRight size={18} />
              </button>
            </div>

            <div className="cat-modal-actions">
              <button type="button" className="cat-modal-cancel" onClick={() => setShowCategoryModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="cat-modal-continue"
                disabled={!selectedCategory}
                onClick={handleContinueToListing}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}