import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class KhaltiService {
  private readonly secretKey = process.env.KHALTI_SECRET_KEY!;
  private readonly gatewayUrl = process.env.KHALTI_GATEWAY_URL!;
  private readonly backendUrl = process.env.BACKEND_URL!;
  private readonly frontendUrl = process.env.FRONTEND_URL!;

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async initiate(orderId: string, buyerId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: true },
    });
    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
    if (order.status !== 'PENDING') {
      throw new ConflictException(`Order is already ${order.status.toLowerCase()}.`);
    }

    const buyer = await this.prisma.user.findUnique({ where: { id: buyerId } });

    const amountPaisa = Math.round(order.totalPrice * 100);

    const payload = {
      return_url: `${this.backendUrl}/api/payments/khalti/callback`,
      website_url: this.frontendUrl,
      amount: amountPaisa,
      purchase_order_id: order.id,
      purchase_order_name: order.listing.title,
      customer_info: {
        name: buyer?.name ?? 'Mero Bazaar Customer',
        email: buyer?.email ?? 'noemail@merobazaar.com',
        phone: buyer?.phone ?? '9800000000',
      },
    };

    const res = await fetch(`${this.gatewayUrl}/api/v2/epayment/initiate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${this.secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new BadRequestException(`Khalti initiate failed: ${errBody}`);
    }

    const data = await res.json();

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: data.pidx },
    });

    return { paymentUrl: data.payment_url };
  }

  async handleCallback(pidx: string) {
    if (!pidx) throw new BadRequestException('Missing pidx.');

    const res = await fetch(`${this.gatewayUrl}/api/v2/epayment/lookup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${this.secretKey}`,
      },
      body: JSON.stringify({ pidx }),
    });

    if (!res.ok) throw new BadRequestException('Khalti lookup failed.');

    const statusData = await res.json();

    if (statusData.status !== 'Completed') {
      throw new BadRequestException(`Payment not complete: ${statusData.status}`);
    }

    const order = await this.prisma.order.findFirst({ where: { paymentRef: pidx } });
    if (!order) throw new NotFoundException('Order not found for this transaction.');

    if (order.status === 'PENDING') {
      await this.ordersService.confirmPayment(order.id, pidx, order.userId, 'KHALTI');
    }

    return order;
  }

  get redirectFrontendUrl() {
    return this.frontendUrl;
  }
}