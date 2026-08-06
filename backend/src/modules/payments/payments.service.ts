import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrderStatus } from '@prisma/client';

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
  createdAt: Date;
}

@Injectable()
export class SellerPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEarningsSummary(sellerId: string): Promise<EarningsSummary> {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [delivered, confirmed, thisMonth, lastMonth] = await this.prisma.$transaction([
      this.prisma.order.aggregate({
        where: { listing: { userId: sellerId }, status: OrderStatus.DELIVERED },
        _sum: { totalPrice: true },
      }),
      this.prisma.order.aggregate({
        where: { listing: { userId: sellerId }, status: OrderStatus.CONFIRMED },
        _sum: { totalPrice: true },
      }),
      this.prisma.order.aggregate({
        where: {
          listing: { userId: sellerId },
          status: OrderStatus.DELIVERED,
          createdAt: { gte: startOfThisMonth },
        },
        _sum: { totalPrice: true },
      }),
      this.prisma.order.aggregate({
        where: {
          listing: { userId: sellerId },
          status: OrderStatus.DELIVERED,
          createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      totalEarned: delivered._sum.totalPrice ?? 0,
      pendingAmount: confirmed._sum.totalPrice ?? 0,
      thisMonthEarned: thisMonth._sum.totalPrice ?? 0,
      lastMonthEarned: lastMonth._sum.totalPrice ?? 0,
    };
  }

  async getTransactionHistory(sellerId: string): Promise<PaymentTransaction[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        listing: { userId: sellerId },
        status: { in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED, OrderStatus.CANCELLED] },
      },
      include: {
        listing: { select: { title: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return orders.map((o) => ({
      orderId: o.id,
      listingTitle: o.listing.title,
      buyerName: o.user?.name ?? null,
      amount: o.totalPrice,
      status: o.status,
      paymentMethod: o.paymentMethod ?? null,
      paymentRef: o.paymentRef ?? null,
      createdAt: o.createdAt,
    }));
  }
}