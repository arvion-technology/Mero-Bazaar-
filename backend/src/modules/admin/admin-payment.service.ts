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
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: { select: { title: true, userId: true } } },
    });
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

      const outcomeText =
        status === 'RESOLVED'
          ? `Your dispute on "${order.listing.title}" was resolved.`
          : `Your dispute on "${order.listing.title}" was rejected.`;

      // Notify the buyer who raised the dispute
      await this.notificationsService.create(order.userId, {
        category: 'DISPUTES',
        type: `DISPUTE_${status}`,
        title: `Dispute ${status.toLowerCase()}`,
        description: resolutionNote ? `${outcomeText} ${resolutionNote}` : outcomeText,
      });

      // Notify the seller whose listing/order is affected
      await this.notificationsService.create(order.listing.userId, {
        category: 'DISPUTES',
        type: `DISPUTE_${status}`,
        title: `Dispute ${status.toLowerCase()} on your order`,
        description: `A dispute on an order for "${order.listing.title}" was ${status.toLowerCase()} by an admin.`,
      });
    }

    return updated;
  }
}