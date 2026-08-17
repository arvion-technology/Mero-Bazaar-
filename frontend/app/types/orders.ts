export type OrderDetail = {
  id: string;
  type: "RESERVATION" | "DELIVERY";
  totalPrice: number;
  priceAtOrder: number;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  reservedUntil: string | null;
  paymentMethod: string | null;
  paymentRef: string | null;
  deliveryDate: string | null;
  deliveryAddress: string | null;
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

