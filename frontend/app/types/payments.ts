export interface EarningsSummary {
  totalEarned: number;
  pendingAmount: number;
  thisMonthEarned: number;
  lastMonthEarned: number;
}

export interface PaymentTransaction {
  orderId: string;
  listingTitle: string;
  buyerName: string | null;
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentRef: string | null;
  createdAt: string;
}