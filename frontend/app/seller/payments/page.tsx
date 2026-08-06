"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiDollarSign, FiClock, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const PRIMARY = "#0f172a";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";
const CARD_BG = "#ffffff";

interface EarningsSummary {
  totalEarned: number;
  pendingAmount: number;
  thisMonthEarned: number;
  lastMonthEarned: number;
}

interface PaymentTransaction {
  orderId: string;
  listingTitle: string;
  buyerName: string | null;
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentRef: string | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DELIVERED: { bg: "#ecfdf5", text: SUCCESS },
  CONFIRMED: { bg: "#eff6ff", text: "#3b82f6" },
  CANCELLED: { bg: "#fef2f2", text: DANGER },
};

function formatNPR(value: number) {
  return `NPR ${value.toLocaleString("en-IN")}`;
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
      {label}
    </div>
  );
}

export default function SellerPaymentsPage() {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[] | null>(null);
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
        const [summaryRes, txRes] = await Promise.all([
          fetch("/api/payments/summary", { headers }),
          fetch("/api/payments/transactions", { headers }),
        ]);

        if (!summaryRes.ok || !txRes.ok) {
          throw new Error("Failed to load payments data");
        }

        const [summaryData, txData] = await Promise.all([summaryRes.json(), txRes.json()]);

        if (!cancelled) {
          setSummary(summaryData);
          setTransactions(Array.isArray(txData) ? txData : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setSummary(null);
          setTransactions([]);
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

  const monthDelta = summary ? summary.thisMonthEarned - summary.lastMonthEarned : 0;
  const monthUp = monthDelta >= 0;

  return (
    <div>
      <style>{`
        .pay-header { margin-bottom: 24px; }
        .pay-title { font-size: 22px; font-weight: 700; color: ${PRIMARY}; letter-spacing: -0.3px; margin-bottom: 4px; }
        .pay-subtitle { font-size: 13px; color: #64748b; }

        .pay-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }

        .pay-stat-card {
          background: ${CARD_BG};
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
        }

        .pay-stat-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }

        .pay-stat-label { font-size: 11px; color: #94a3b8; font-weight: 500; margin-bottom: 3px; }
        .pay-stat-value { font-size: 19px; font-weight: 700; color: ${PRIMARY}; }
        .pay-stat-change { font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 3px; margin-top: 3px; }

        .pay-card {
          background: ${CARD_BG};
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
        }

        .pay-card-title { font-size: 14px; font-weight: 700; color: ${PRIMARY}; margin-bottom: 16px; letter-spacing: -0.2px; }

        .pay-table { width: 100%; border-collapse: collapse; }
        .pay-table th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 0 10px 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .pay-table td {
          padding: 12px 10px;
          font-size: 13px;
          color: ${PRIMARY};
          border-bottom: 1px solid #f8fafc;
        }
        .pay-table tr:last-child td { border-bottom: none; }
        .pay-tx-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
        .pay-status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        @media (max-width: 767px) {
          .pay-stats { grid-template-columns: 1fr; }
          .pay-table { display: block; overflow-x: auto; }
        }
      `}</style>

      <div className="pay-header">
        <div className="pay-title">Payments</div>
        <div className="pay-subtitle">Your earnings and transaction history</div>
      </div>

      <div className="pay-stats">
        <div className="pay-stat-card">
          <div className="pay-stat-icon" style={{ background: "#ecfdf5", color: SUCCESS }}>
            <FiDollarSign size={18} />
          </div>
          <div>
            <div className="pay-stat-label">Total Earned</div>
            <div className="pay-stat-value">{summary ? formatNPR(summary.totalEarned) : "-"}</div>
          </div>
        </div>

        <div className="pay-stat-card">
          <div className="pay-stat-icon" style={{ background: "#fffbeb", color: WARNING }}>
            <FiClock size={18} />
          </div>
          <div>
            <div className="pay-stat-label">Pending</div>
            <div className="pay-stat-value">{summary ? formatNPR(summary.pendingAmount) : "-"}</div>
          </div>
        </div>

        <div className="pay-stat-card">
          <div className="pay-stat-icon" style={{ background: "#eff6ff", color: "#3b82f6" }}>
            <FiTrendingUp size={18} />
          </div>
          <div>
            <div className="pay-stat-label">This Month</div>
            <div className="pay-stat-value">{summary ? formatNPR(summary.thisMonthEarned) : "-"}</div>
            {summary && (
              <div className="pay-stat-change" style={{ color: monthUp ? SUCCESS : DANGER }}>
                {monthUp ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
                {formatNPR(Math.abs(monthDelta))} vs last month
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pay-card">
        <div className="pay-card-title">Recent Transactions</div>
        {loading ? (
          <EmptyState label="Loading transactions..." />
        ) : error ? (
          <EmptyState label={error} />
        ) : !transactions || transactions.length === 0 ? (
          <EmptyState label="No transactions yet." />
        ) : (
          <table className="pay-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const badge = STATUS_COLORS[tx.status] ?? { bg: "#f1f5f9", text: "#64748b" };
                return (
                  <tr key={tx.orderId}>
                    <td>{tx.listingTitle}</td>
                    <td>{tx.buyerName ?? "—"}</td>
                    <td>
                      {formatNPR(tx.amount)}
                      {tx.paymentMethod && <div className="pay-tx-meta">{tx.paymentMethod}</div>}
                    </td>
                    <td>
                      <span
                        className="pay-status-badge"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td>{new Date(tx.createdAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}