export interface TopListing {
  listingId: string;
  title: string;
  category: string;
  orderCount: number;
  revenue: number;
}

export interface CategoryBreakdown {
  category: string;
  orderCount: number;
  revenue: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}