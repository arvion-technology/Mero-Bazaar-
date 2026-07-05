import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async getStats(sellerId: string) {
    const [totalOrders, pendingOrders, revenueAgg, productsCount] = await Promise.all([
      this.prisma.order.count({ where: { listing: { userId: sellerId } } }),
      this.prisma.order.count({ where: { listing: { userId: sellerId }, status: 'PENDING' } }),
      this.prisma.order.aggregate({
        where: { listing: { userId: sellerId }, status: 'DELIVERED' },
        _sum: { totalPrice: true },
      }),
      this.prisma.listing.count({ where: { userId: sellerId } }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      revenue: revenueAgg._sum.totalPrice ?? 0,
      productsCount,
    };
  }

  async getRecentOrders(sellerId: string, take = 5) {
    const orders = await this.prisma.order.findMany({
      where: { listing: { userId: sellerId } },
      orderBy: { createdAt: 'desc' },
      take,
      include: { user: { select: { name: true, email: true } } },
    });

    return orders.map((o) => ({
      id: o.id,
      customer: o.user.name ?? 'Unknown',
      email: o.user.email,
      amount: o.totalPrice,
      status: o.status,
    }));
  }
}