import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

export interface MonthlySalesData {
  month: string;
  sales: number;
  loss: number;
  revenue: number;
}

@Injectable()
export class VendorSalesOverviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthlySalesOverview(
    vendorId: string,
    monthCount = 6,
  ): Promise<MonthlySalesData[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (monthCount - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const orders = await this.prisma.order.findMany({
      where: {
        listing: { userId: vendorId },
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        totalPrice: true,
        status: true,
      },
    });

    // build ordered month buckets
    const buckets: Record<string, MonthlySalesData> = {};
    for (let i = 0; i < monthCount; i++) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i);
      const key = d.toLocaleString('en-US', { month: 'short' });
      buckets[key] = { month: key, sales: 0, loss: 0, revenue: 0 };
    }

    for (const order of orders) {
      const key = order.createdAt.toLocaleString('en-US', { month: 'short' });
      const bucket = buckets[key];
      if (!bucket) continue;

      if (order.status === 'CANCELLED') {
        bucket.loss += order.totalPrice;
      } else if (order.status === 'DELIVERED') {
        bucket.sales += order.totalPrice;
      }
    }

    // revenue = sales minus loss, per month
    Object.values(buckets).forEach((b) => {
      b.revenue = b.sales - b.loss;
    });

    return Object.values(buckets);
  }
}