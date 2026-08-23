type ReportSource = "USER_REPORT" | "ADMIN_FLAG";
type ReportTargetType = "LISTING" | "USER" | "REVIEW";
type ReportReason =
  | "SPAM" | "SCAM_FRAUD" | "INAPPROPRIATE_CONTENT" | "FAKE_LISTING"
  | "HARASSMENT" | "PRICE_MANIPULATION" | "COUNTERFEIT" | "DUPLICATE" | "OTHER";
type ReportStatus = "OPEN" | "UNDER_REVIEW" | "ACTIONED" | "DISMISSED";

export type ReportWithRelations = {
  id: string;
  source: ReportSource;
  targetType: ReportTargetType;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewedBy: string | null;
  reviewedAt: string | Date | null;
  resolutionNote: string | null;
  createdAt: string | Date;
  listing: { id: string; title: string } | null;
  targetUser: { id: string; name: string | null; email: string } | null;
  review: { id: string; comment: string | null; listing: { title: string } | null } | null;
  reporter: { name: string | null; email: string } | null;
};

export type ReportRow = {
  id: string;
  targetLabel: string;
  targetType: string;
  targetHref: string | null;
  reporter: string;
  reason: string;
  description: string;
  status: string;
  statusColor: string;
  createdAt: string | Date;
};

const OPEN = "#f59e0b";
const REVIEW = "#3b82f6";
const ACTIONED = "#10b981";
const DISMISSED = "#64748b";

function statusDisplay(status: ReportStatus): { label: string; color: string } {
  switch (status) {
    case "OPEN":
      return { label: "Open", color: OPEN };
    case "UNDER_REVIEW":
      return { label: "Under Review", color: REVIEW };
    case "ACTIONED":
      return { label: "Actioned", color: ACTIONED };
    case "DISMISSED":
      return { label: "Dismissed", color: DISMISSED };
    default:
      return { label: status, color: DISMISSED };
  }
}

const REASON_LABELS: Record<ReportReason, string> = {
  SPAM: "Spam",
  SCAM_FRAUD: "Scam / Fraud",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  FAKE_LISTING: "Fake Listing",
  HARASSMENT: "Harassment",
  PRICE_MANIPULATION: "Price Manipulation",
  COUNTERFEIT: "Counterfeit",
  DUPLICATE: "Duplicate",
  OTHER: "Other",
};

export function adaptReportToRow(report: ReportWithRelations): ReportRow {
  const { label: statusLabel, color: statusColor } = statusDisplay(report.status);

  let targetLabel = "Unknown";
  let targetHref: string | null = null;

  if (report.targetType === "LISTING" && report.listing) {
    targetLabel = report.listing.title;
    targetHref = `/admin/listings/${report.listing.id}`;
  } else if (report.targetType === "USER" && report.targetUser) {
    targetLabel = report.targetUser.name || report.targetUser.email;
    targetHref = `/admin/users/${report.targetUser.id}`;
  } else if (report.targetType === "REVIEW" && report.review) {
    targetLabel = report.review.listing?.title
      ? `Review on ${report.review.listing.title}`
      : "Review";
    targetHref = null; // no dedicated review detail page yet
  }

  return {
    id: report.id,
    targetLabel,
    targetType: report.targetType.charAt(0) + report.targetType.slice(1).toLowerCase(),
    targetHref,
    reporter: report.source === "ADMIN_FLAG" ? "Admin" : (report.reporter?.name || report.reporter?.email || "Unknown"),
    reason: REASON_LABELS[report.reason] || report.reason,
    description: report.description || "—",
    status: statusLabel,
    statusColor,
    createdAt: report.createdAt,
  };
}