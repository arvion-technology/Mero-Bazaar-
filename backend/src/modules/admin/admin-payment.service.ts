import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrderStatus, PaymentMethod, DisputeStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminPaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

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
        disputeStatus: true,
        disputeReason: true,
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

  async setDisputeStatus(
    orderId: string,
    status: DisputeStatus,
    adminId: string,
    resolutionNote?: string,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found.');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        disputeStatus: status,
        ...((status === 'RESOLVED' || status === 'REJECTED') && {
          disputeResolvedAt: new Date(),
          disputeResolvedBy: adminId,
        }),
        ...(resolutionNote && { disputeReason: resolutionNote }),
      },
    });

    if (status === 'RESOLVED' || status === 'REJECTED') {
      await this.notificationsService.notifyAllAdmins({
        category: 'SYSTEM',
        type: 'PAYMENT_DISPUTE_RESOLVED',
        title: `Payment dispute ${status.toLowerCase()}`,
        description: `Dispute on order ${orderId} was ${status.toLowerCase()}.`,
      });
    }

    return updated;
  }
}