"use client";

import { KYCStatus } from "@/lib/data";

const PENDING_COLOR = "#f59e0b";
const VERIFIED_COLOR = "#22c55e";
const REJECTED_COLOR = "#ef4444";

interface StatusBadgeProps {
  status: KYCStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Pending: { color: PENDING_COLOR, bg: "#fffbeb", dot: PENDING_COLOR },
    Verified: { color: VERIFIED_COLOR, bg: "#ecfdf5", dot: VERIFIED_COLOR },
    Rejected: { color: REJECTED_COLOR, bg: "#fef2f2", dot: REJECTED_COLOR },
  };
  const c = config[status];
  return (
    <span className="admin-status" style={{ background: c.bg, color: c.color }}>
      <span className="admin-status-dot" style={{ background: c.dot }} />
      {status}
    </span>
  );
}
