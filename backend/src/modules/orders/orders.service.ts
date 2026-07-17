import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderType, OrderStatus, ListingStatus, PaymentMethod } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

const RESERVATION_MINUTES = 15;

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Vehicle / SecondHand / Rental deposit / Livestock
    async reserveListing(listingId: string, buyerId: string) {
    const listing = await this.prisma.listing.findUnique({
        where: { id: listingId },
        include: { vehicle: true },
    });
    if (!listing) throw new NotFoundException('Listing not found.');
    if (!listing.price) throw new ConflictException('This listing has no price set.');

    const price = listing.price; // now narrowed to `number`, and stays narrowed since it's a fresh const

    let chargeNow = price;

    if (listing.category === 'VEHICLE') {
        if (!listing.vehicle?.reservationFee) {
        throw new ConflictException('This vehicle has no reservation fee set by the seller.');
        }
        chargeNow = listing.vehicle.reservationFee;
    }

    return this.prisma.$transaction(async (tx) => {
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
            priceAtOrder: price, // ← use the local const, not listing.price
            status: OrderStatus.PENDING,
            reservedUntil: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000),
        },
        });
    });
    }

  async createDeliveryOrder(
    listingId: string,
    buyerId: string,
    quantity: number,
    deliveryDate: string,
    deliveryAddress: string,
  ) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found.');
    if (!listing.price) throw new ConflictException('This listing has no price set.');

    const price = listing.price;
    const totalPrice = price * quantity;

    return this.prisma.order.create({
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
  }

  async confirmPayment(orderId: string, paymentRef: string, buyerId: string, paymentMethod: PaymentMethod ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { listing: true }, });
    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException(`Order is already ${order.status.toLowerCase()}.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED, paymentRef, paymentMethod },
      });

      if (order.type === OrderType.RESERVATION && order.listing.category !== 'VEHICLE') {
        await tx.listing.update({
          where: { id: order.listingId },
          data: { status: ListingStatus.SOLD },
        });
      }

      return updated;
    });
  }

  async cancelReservation(orderId: string, buyerId: string) {
  const order = await this.prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundException('Order not found.');
  if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
  if (order.status !== 'PENDING') {
    throw new ConflictException(`Cannot cancel an order that is already ${order.status.toLowerCase()}.`);
  }

  return this.prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', cancelReason: 'buyer_cancelled' },
    });
    await tx.listing.update({
      where: { id: order.listingId },
      data: { status: 'ACTIVE' },
    });
  });
}

  async getMyOrders(buyerId: string) {
    return this.prisma.order.findMany({
      where: { userId: buyerId },
      include: { listing: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Cron: release reservations nobody paid for in time ──
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
        this.prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.EXPIRED, cancelReason: 'expired' },
        }),
        this.prisma.listing.update({
          where: { id: order.listingId },
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
          include: { 
            user: { 
              select: { 
                id: true, 
                name: true, 
                phone: true,
                vendorKyc: {
                  select: { contactNumber: true, status: true },
                },
              } 
            },
            vehicle: { select: { reservationFee: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');

    return order;
  }
}