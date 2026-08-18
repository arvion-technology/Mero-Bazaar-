type LeadType = "CALL" | "CHAT" | "APPLY";
type LeadStatus = "PENDING" | "VIEWED" | "SHORTLISTED" | "INTERVIEWED" | "REJECTED" | "HIRED" | "WITHDRAWN";

export type LeadWithRelations = {
  id: string;
  listingId: string;
  leadType: LeadType;
  status: LeadStatus;
  message: string | null;
  createdAt: string | Date;
  user: {
    name: string | null;
    email: string;
  } | null;
};

export type ClientMessage = {
  id: string;
  initials: string;
  name: string;
  msg: string;
  time: string;
  color: string;
  unread: boolean;
};

const PALETTE = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function colorForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function defaultMessageFor(leadType: LeadType) {
  switch (leadType) {
    case "CALL":
      return "Requested a call back";
    case "APPLY":
      return "Applied to your listing";
    case "CHAT":
    default:
      return "Sent an inquiry";
  }
}

function formatTime(dateStr: string | Date) {
  const date = new Date(dateStr);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function adaptLeadToClientMessage(lead: LeadWithRelations): ClientMessage {
  const name = lead.user?.name || lead.user?.email || "Unknown";
  return {
    id: lead.id,
    initials: getInitials(lead.user?.name),
    name,
    msg: lead.message?.trim() || defaultMessageFor(lead.leadType),
    time: formatTime(lead.createdAt),
    color: colorForId(lead.listingId || lead.id),
    unread: lead.status === "PENDING",
  };
}

export type LeadSent = {
  id: string;
  listingId: string;
  leadType: LeadType;
  status: LeadStatus;
  message: string | null;
  createdAt: string | Date;
  listing: {
    id: string;
    title: string;
    user: {
      name: string | null;
      phone: string | null;
      vendorKyc: { contactNumber: string; status: string } | null;
    } | null;
  };
};

export function adaptLeadSentToContact(lead: LeadSent): ClientMessage {
  const sellerName = lead.listing?.user?.name || "Unknown seller";
  return {
    id: lead.id,
    initials: getInitials(sellerName),
    name: sellerName,
    msg: lead.message?.trim() || `Re: ${lead.listing?.title ?? "listing"}`,
    time: formatTime(lead.createdAt),
    color: colorForId(lead.listingId || lead.id),
    unread: false,
  };
}