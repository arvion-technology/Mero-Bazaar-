import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class AdminPaymentService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForAdmin(filters: { paymentMethod?: PaymentMethod; status?: OrderStatus }) {
    return this.prisma.order.findMany({
      where: {
        paymentMethod: { not: null },
        ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
        ...(filters.status && { status: filters.status }),
      },
      select: {
        id: true,
        totalPrice: true,
        quantity: true,
        type: true,
        status: true,
        deliveryAddress: true,
        createdAt: true,
        paymentMethod: true,
        paymentRef: true,
        listing: {
          select: {
            title: true,
            user: { select: { name: true } },
          },
        },
        user: { select: { name: true, email: true } }, 
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}