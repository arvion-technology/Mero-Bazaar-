import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrderStatus } from '@prisma/client';

export interface TopListingReport {
  listingId: string;
  title: string;
  category: string;
  orderCount: number;
  revenue: number;
}

export interface CategoryBreakdownReport {
  category: string;
  orderCount: number;
  revenue: number;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopListings(sellerId: string, limit = 5): Promise<TopListingReport[]> {
    const grouped = await this.prisma.order.groupBy({
      by: ['listingId'],
      where: {
        listing: { userId: sellerId },
        status: OrderStatus.DELIVERED,
      },
      _count: { _all: true },
      _sum: { totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) return [];

    const listingIds = grouped.map((g) => g.listingId);
    const listings = await this.prisma.listing.findMany({
      where: { id: { in: listingIds } },
      select: { id: true, title: true, category: true },
    });
    const listingMap = new Map(listings.map((l) => [l.id, l]));

    return grouped.map((g) => {
      const listing = listingMap.get(g.listingId);
      return {
        listingId: g.listingId,
        title: listing?.title ?? 'Unknown listing',
        category: listing?.category ?? 'UNKNOWN',
        orderCount: g._count._all,
        revenue: g._sum.totalPrice ?? 0,
      };
    });
  }

  async getCategoryBreakdown(sellerId: string): Promise<CategoryBreakdownReport[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        listing: { userId: sellerId },
        status: OrderStatus.DELIVERED,
      },
      select: {
        totalPrice: true,
        listing: { select: { category: true } },
      },
    });

    const byCategory: Record<string, CategoryBreakdownReport> = {};
    for (const order of orders) {
      const category = order.listing.category;
      if (!byCategory[category]) {
        byCategory[category] = { category, orderCount: 0, revenue: 0 };
      }
      byCategory[category].orderCount += 1;
      byCategory[category].revenue += order.totalPrice;
    }

    return Object.values(byCategory).sort((a, b) => b.revenue - a.revenue);
  }

  async getOrderStatusBreakdown(sellerId: string): Promise<OrderStatusBreakdown[]> {
    const grouped = await this.prisma.order.groupBy({
      by: ['status'],
      where: { listing: { userId: sellerId } },
      _count: { _all: true },
    });

    return grouped.map((g) => ({ status: g.status, count: g._count._all }));
  }
}