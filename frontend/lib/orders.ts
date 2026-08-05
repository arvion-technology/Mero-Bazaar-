type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "EXPIRED";
type OrderType = "DELIVERY" | "RESERVATION";

export type OrderWithRelations = {
  id: string;
  totalPrice: number;
  quantity: number;
  type: OrderType;
  status: OrderStatus;
  deliveryAddress: string | null;
  createdAt: string | Date;
  listing: { title: string } | null;
  user: { name: string | null; email: string } | null;
};

export type OrderRow = {
  id: string;
  product: string;
  customer: string;
  email: string;
  location: string;
  type: string;
  amount: string;
  status: string;
  statusColor: string;
};

const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";
const DEFAULT = "#64748b";

function statusDisplay(status: OrderStatus): { label: string; color: string } {
  switch (status) {
    case "DELIVERED":
    case "CONFIRMED":
      return { label: status === "DELIVERED" ? "Completed" : "Confirmed", color: SUCCESS };
    case "PREPARING":
    case "OUT_FOR_DELIVERY":
      return { label: "Processing", color: WARNING };
    case "PENDING":
      return { label: "Pending", color: WARNING };
    case "CANCELLED":
    case "EXPIRED":
      return { label: status === "CANCELLED" ? "Cancelled" : "Expired", color: DANGER };
    default:
      return { label: status, color: DEFAULT };
  }
}

export function adaptOrderToRow(order: OrderWithRelations): OrderRow {
  const { label, color } = statusDisplay(order.status);
  return {
    id: `#${order.id.slice(-6).toUpperCase()}`,
    product: order.listing?.title || "Unknown listing",
    customer: order.user?.name || order.user?.email || "Unknown",
    email: order.user?.email || "",
    location: order.deliveryAddress || "—",
    type: order.type === "RESERVATION" ? "Reservation" : "Delivery",
    amount: `NPR ${order.totalPrice.toLocaleString()}${order.quantity > 1 ? ` (x${order.quantity})` : ""}`,
    status: label,
    statusColor: color,
  };
}