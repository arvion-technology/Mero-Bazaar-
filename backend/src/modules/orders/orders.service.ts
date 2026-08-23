<<<<<<< HEAD
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  OrderType,
  OrderStatus,
  ListingStatus,
  PaymentMethod,
  DisputeStatus,
} from '@prisma/client';
=======
import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderType, OrderStatus, ListingStatus, PaymentMethod, DisputeStatus } from '@prisma/client';
>>>>>>> origin/aashika
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentVerificationService } from '../payments/payment-verification.service'; // adjust path to match your structure

const RESERVATION_MINUTES = 15;
<<<<<<< HEAD
const MAX_ACTIVE_RESERVATIONS_PER_USER = 5;
=======
>>>>>>> origin/aashika

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private paymentVerification: PaymentVerificationService,
  ) {}

  // Vehicle / SecondHand / Rental deposit / Livestock
<<<<<<< HEAD
  async reserveListing(listingId: string, buyerId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { vehicle: true },
    });
    if (!listing) throw new NotFoundException('Listing not found.');
    if (!listing.price)
      throw new ConflictException('This listing has no price set.');

    // A seller must not reserve their own inventory.
    if (listing.userId === buyerId) {
      throw new ConflictException('You cannot reserve your own listing.');
    }

    // Per-account reservation quota prevents inventory hoarding.
    const activeReservations = await this.prisma.order.count({
      where: {
        userId: buyerId,
        type: OrderType.RESERVATION,
        status: OrderStatus.PENDING,
        reservedUntil: { gt: new Date() },
      },
    });
    if (activeReservations >= MAX_ACTIVE_RESERVATIONS_PER_USER) {
      throw new ConflictException(
        `You already have ${MAX_ACTIVE_RESERVATIONS_PER_USER} active reservations. Complete or cancel them first.`,
      );
    }

    const price = listing.price;
=======
    async reserveListing(listingId: string, buyerId: string) {
    const listing = await this.prisma.listing.findUnique({
        where: { id: listingId },
        include: { vehicle: true },
    });
    if (!listing) throw new NotFoundException('Listing not found.');
    if (!listing.price) throw new ConflictException('This listing has no price set.');

    const price = listing.price; 
>>>>>>> origin/aashika

    let chargeNow = price;

    if (listing.category === 'VEHICLE') {
<<<<<<< HEAD
      if (!listing.vehicle?.reservationFee) {
        throw new ConflictException(
          'This vehicle has no reservation fee set by the seller.',
        );
      }
      chargeNow = listing.vehicle.reservationFee;
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const lock = await tx.listing.updateMany({
        where: { id: listingId, status: ListingStatus.ACTIVE },
        data: { status: ListingStatus.RESERVED },
      });

      if (lock.count === 0) {
        throw new ConflictException('This item is no longer available.');
      }

      return tx.order.create({
        data: {
          listingId,
          userId: buyerId,
          type: OrderType.RESERVATION,
          quantity: 1,
          totalPrice: chargeNow,
          priceAtOrder: price,
          status: OrderStatus.PENDING,
          reservedUntil: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000),
        },
      });
=======
        if (!listing.vehicle?.reservationFee) {
        throw new ConflictException('This vehicle has no reservation fee set by the seller.');
        }
        chargeNow = listing.vehicle.reservationFee;
    }

    const order = await this.prisma.$transaction(async (tx) => {
        const lock = await tx.listing.updateMany({
        where: { id: listingId, status: ListingStatus.ACTIVE },
        data: { status: ListingStatus.RESERVED },
        });

        if (lock.count === 0) {
        throw new ConflictException('This item is no longer available.');
        }

        return tx.order.create({
        data: {
            listingId,
            userId: buyerId,
            type: OrderType.RESERVATION,
            quantity: 1,
            totalPrice: chargeNow,
            priceAtOrder: price, 
            status: OrderStatus.PENDING,
            reservedUntil: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000),
        },
        });
>>>>>>> origin/aashika
    });

    await this.notificationsService.create(listing.userId, {
      category: 'ORDERS',
      type: 'NEW_RESERVATION',
      title: 'New reservation',
      description: `Someone reserved "${listing.title}"`,
    });

    return order;
<<<<<<< HEAD
  }
=======
    }
>>>>>>> origin/aashika

  async createDeliveryOrder(
    listingId: string,
    buyerId: string,
    quantity: number,
    deliveryDate: string,
    deliveryAddress: string,
  ) {
<<<<<<< HEAD
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listing) throw new NotFoundException('Listing not found.');
    if (!listing.price)
      throw new ConflictException('This listing has no price set.');
    if (listing.userId === buyerId) {
      throw new ConflictException('You cannot order your own listing.');
    }
=======
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found.');
    if (!listing.price) throw new ConflictException('This listing has no price set.');
>>>>>>> origin/aashika

    const price = listing.price;
    const totalPrice = price * quantity;

    const order = await this.prisma.order.create({
      data: {
        listingId,
        userId: buyerId,
        type: OrderType.DELIVERY,
        quantity,
        totalPrice,
        priceAtOrder: price,
        deliveryDate: new Date(deliveryDate),
        deliveryAddress,
        status: OrderStatus.PENDING,
      },
    });

    await this.notificationsService.create(listing.userId, {
      category: 'ORDERS',
      type: 'NEW_ORDER',
      title: 'New order received',
      description: `New order for "${listing.title}" (x${quantity})`,
    });

    return order;
  }

<<<<<<< HEAD
  async confirmPayment(
=======
   async confirmPayment(
>>>>>>> origin/aashika
    orderId: string,
    providerTransactionId: string,
    buyerId: string,
    paymentMethod: PaymentMethod,
  ) {
<<<<<<< HEAD
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: true },
    });
    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId)
      throw new ForbiddenException('Not your order.');
=======
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { listing: true } });
    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
>>>>>>> origin/aashika

    // Idempotent retry
    if (order.status === OrderStatus.CONFIRMED) {
      return order;
    }
    if (order.status !== OrderStatus.PENDING) {
<<<<<<< HEAD
      throw new ConflictException(
        `Order is already ${order.status.toLowerCase()}.`,
      );
=======
      throw new ConflictException(`Order is already ${order.status.toLowerCase()}.`);
>>>>>>> origin/aashika
    }

    // Verify against the provider
    const verification =
      paymentMethod === PaymentMethod.ESEWA
        ? await this.paymentVerification.verifyEsewa(orderId, order.totalPrice)
<<<<<<< HEAD
        : await this.paymentVerification.verifyKhalti(
            providerTransactionId,
            order.totalPrice,
          );

    if (!verification.verified) {
      throw new ConflictException(
        'Payment could not be verified with the provider.',
      );
=======
        : await this.paymentVerification.verifyKhalti(providerTransactionId, order.totalPrice);

    if (!verification.verified) {
      throw new ConflictException('Payment could not be verified with the provider.');
>>>>>>> origin/aashika
    }

    try {
      const updated = await this.prisma.$transaction(async (tx) => {
        const result = await tx.order.updateMany({
          where: { id: orderId, status: OrderStatus.PENDING },
          data: {
            status: OrderStatus.CONFIRMED,
            paymentRef: verification.providerRef,
            paymentMethod,
          },
        });
        if (result.count === 0) {
          throw new ConflictException('Order was already processed.');
        }

<<<<<<< HEAD
        if (
          order.type === OrderType.RESERVATION &&
          order.listing.category !== 'VEHICLE'
        ) {
=======
        if (order.type === OrderType.RESERVATION && order.listing.category !== 'VEHICLE') {
>>>>>>> origin/aashika
          const listingResult = await tx.listing.updateMany({
            where: { id: order.listingId, status: ListingStatus.RESERVED },
            data: { status: ListingStatus.SOLD },
          });
          if (listingResult.count === 0) {
            throw new ConflictException('Listing state changed unexpectedly.');
          }
        }

        return tx.order.findUniqueOrThrow({ where: { id: orderId } });
      });

      await this.notificationsService.create(order.listing.userId, {
        category: 'ORDERS',
        type: 'ORDER_PAID',
        title: 'Payment received',
        description: `Payment confirmed for "${order.listing.title}"`,
      });

      return updated;
    } catch (err) {
      if (err.code === 'P2002') {
<<<<<<< HEAD
        throw new ConflictException(
          'This payment has already been used for another order.',
        );
=======
        throw new ConflictException('This payment has already been used for another order.');
>>>>>>> origin/aashika
      }
      throw err;
    }
  }

  async cancelReservation(orderId: string, buyerId: string) {
<<<<<<< HEAD
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: true },
    });
    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId)
      throw new ForbiddenException('Not your order.');
    if (order.status !== 'PENDING') {
      throw new ConflictException(
        `Cannot cancel an order that is already ${order.status.toLowerCase()}.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // Conditional update: only cancel if still PENDING (no race with payment confirmation).
      const result = await tx.order.updateMany({
        where: { id: orderId, userId: buyerId, status: OrderStatus.PENDING },
        data: {
          status: OrderStatus.CANCELLED,
          cancelReason: 'buyer_cancelled',
        },
      });
      if (result.count === 0) {
        throw new ConflictException('Order was already processed.');
      }
      if (order.type === OrderType.RESERVATION) {
        await tx.listing.updateMany({
          where: { id: order.listingId, status: ListingStatus.RESERVED },
          data: { status: ListingStatus.ACTIVE },
        });
      }
    });

    await this.notificationsService.create(order.listing.userId, {
      category: 'ORDERS',
      type: 'ORDER_CANCELLED',
      title: 'Order cancelled',
      description: `Buyer cancelled their reservation for "${order.listing.title}"`,
    });
  }

=======
  const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { listing: true } });
  if (!order) throw new NotFoundException('Order not found.');
  if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
  if (order.status !== 'PENDING') {
    throw new ConflictException(`Cannot cancel an order that is already ${order.status.toLowerCase()}.`);
  }

  await this.prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', cancelReason: 'buyer_cancelled' },
    });
    if (order.type === OrderType.RESERVATION) {
      await tx.listing.update({
        where: { id: order.listingId },
        data: { status: 'ACTIVE' },
      });
    }
  });

  await this.notificationsService.create(order.listing.userId, {
    category: 'ORDERS',
    type: 'ORDER_CANCELLED',
    title: 'Order cancelled',
    description: `Buyer cancelled their reservation for "${order.listing.title}"`,
  });
}

>>>>>>> origin/aashika
  async raiseDispute(orderId: string, userId: string, reason: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: { select: { title: true } } },
    });
    if (!order) throw new NotFoundException('Order not found.');
<<<<<<< HEAD
    if (order.userId !== userId)
      throw new ForbiddenException('Not your order.');

    if (order.disputeStatus !== 'NONE') {
      throw new ConflictException(
        `Dispute already ${order.disputeStatus.toLowerCase()} for this order.`,
      );
=======
    if (order.userId !== userId) throw new ForbiddenException('Not your order.');

    if (order.disputeStatus !== 'NONE') {
      throw new ConflictException(`Dispute already ${order.disputeStatus.toLowerCase()} for this order.`);
>>>>>>> origin/aashika
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        disputeStatus: DisputeStatus.OPEN,
        disputeReason: reason,
      },
    });

    await this.notificationsService.notifyAllAdmins({
      category: 'SYSTEM',
      type: 'DISPUTE_OPENED',
      title: 'Payment dispute opened',
      description: `A dispute was opened on order for "${order.listing.title}".`,
    });

    return updated;
  }

  async getMyOrders(buyerId: string) {
    return this.prisma.order.findMany({
      where: { userId: buyerId },
      include: { listing: true },
      orderBy: { createdAt: 'desc' },
    });
  }

<<<<<<< HEAD
  // Cron: release reservations nobody paid for in time (conditional to avoid
  // racing a concurrent payment confirmation into contradictory state).
=======
  // Cron: release reservations nobody paid for in time
>>>>>>> origin/aashika
  @Cron('*/1 * * * *')
  async releaseExpiredReservations() {
    const expired = await this.prisma.order.findMany({
      where: {
        type: OrderType.RESERVATION,
        status: OrderStatus.PENDING,
        reservedUntil: { lt: new Date() },
      },
    });

    for (const order of expired) {
      await this.prisma.$transaction([
<<<<<<< HEAD
        this.prisma.order.updateMany({
          where: { id: order.id, status: OrderStatus.PENDING },
          data: { status: OrderStatus.EXPIRED, cancelReason: 'expired' },
        }),
        this.prisma.listing.updateMany({
          where: { id: order.listingId, status: ListingStatus.RESERVED },
=======
        this.prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.EXPIRED, cancelReason: 'expired' },
        }),
        this.prisma.listing.update({
          where: { id: order.listingId },
>>>>>>> origin/aashika
          data: { status: ListingStatus.ACTIVE },
        }),
      ]);
    }
  }
  async getOrderById(orderId: string, buyerId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: {
<<<<<<< HEAD
          include: {
            user: {
              select: {
                id: true,
                name: true,
=======
          include: { 
            user: { 
              select: { 
                id: true, 
                name: true, 
>>>>>>> origin/aashika
                phone: true,
                vendorKyc: {
                  select: { contactNumber: true, status: true },
                },
<<<<<<< HEAD
              },
=======
              } 
>>>>>>> origin/aashika
            },
            vehicle: { select: { reservationFee: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found.');
<<<<<<< HEAD
    if (order.userId !== buyerId)
      throw new ForbiddenException('Not your order.');
=======
    if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
>>>>>>> origin/aashika

    return order;
  }

  async getOrdersForSeller(sellerId: string) {
    return this.prisma.order.findMany({
      where: { listing: { userId: sellerId } },
      include: {
        listing: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countPendingForSeller(sellerId: string) {
<<<<<<< HEAD
    const count = await this.prisma.order.count({
      where: { listing: { userId: sellerId }, status: OrderStatus.PENDING },
    });
    return { count };
  }
=======
  const count = await this.prisma.order.count({
    where: { listing: { userId: sellerId }, status: OrderStatus.PENDING },
  });
  return { count };
}
>>>>>>> origin/aashika

  async getSellerOrderStats(sellerId: string) {
    const [totalOrders, pendingOrders] = await this.prisma.$transaction([
      this.prisma.order.count({
        where: { listing: { userId: sellerId } },
      }),
      this.prisma.order.count({
        where: { listing: { userId: sellerId }, status: OrderStatus.PENDING },
      }),
    ]);
    return { totalOrders, pendingOrders };
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
