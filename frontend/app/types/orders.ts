export type OrderDetail = {
  id: string;
  type: "RESERVATION" | "DELIVERY";
  totalPrice: number;
  priceAtOrder: number;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "EXPIRED";
  reservedUntil: string | null;
  paymentMethod: string | null;
  paymentRef: string | null;
  deliveryDate: string | null;
  deliveryAddress: string | null;
  createdAt: string;
  listing: {
    title: string;
    images: string[];
    category: string;
    user: {
      name: string | null;
      phone: string | null;
      vendorKyc: { contactNumber: string; status: string } | null;
    };
  };
};

export interface CreateDeliveryOrderPayload {
  listingId: string;
  quantity: number;
  deliveryDate: string;
  deliveryAddress: string;
}

export interface OrderResponse {
  id: string;
  totalPrice: number;
  status: string;
  [key: string]: unknown;
}