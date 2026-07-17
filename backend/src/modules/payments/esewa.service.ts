import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrdersService } from '../orders/orders.service';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';

@Injectable()
export class EsewaService {
  private readonly secretKey = process.env.ESEWA_SECRET_KEY!;
  private readonly productCode = process.env.ESEWA_PRODUCT_CODE!;
  private readonly gatewayUrl = process.env.ESEWA_GATEWAY_URL!;
  private readonly statusUrl = process.env.ESEWA_STATUS_URL!;
  private readonly backendUrl = process.env.BACKEND_URL!;
  private readonly frontendUrl = process.env.FRONTEND_URL!;

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  private sign(message: string): string {
    return crypto.createHmac('sha256', this.secretKey).update(message).digest('base64');
  }

  async initiate(orderId: string, buyerId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
    if (order.status !== 'PENDING') {
      throw new ConflictException(`Order is already ${order.status.toLowerCase()}.`);
    }

    const totalAmount = order.totalPrice.toString();
    const transactionUuid = randomUUID();

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: transactionUuid },
    });

    const signature = this.sign(
      `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${this.productCode}`,
    );

    return {
      gatewayUrl: this.gatewayUrl,
      fields: {
        amount: totalAmount,
        tax_amount: '0',
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: this.productCode,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: `${this.backendUrl}/api/payments/esewa/success`,
        failure_url: `${this.backendUrl}/api/payments/esewa/failure`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature,
      },
    };
  }

  async handleCallback(encodedData: string) {
    let decoded: Record<string, string>;
    try {
      decoded = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
    } catch {
      throw new BadRequestException('Malformed payment response.');
    }

    const { total_amount, transaction_uuid, product_code, signed_field_names, signature } = decoded;
    if (!signed_field_names || !signature) {
      throw new BadRequestException('Missing signature fields.');
    }

    const message = signed_field_names
      .split(',')
      .map((field) => `${field}=${decoded[field]}`)
      .join(',');
    const expectedSignature = this.sign(message);

    if (expectedSignature !== signature) {
      throw new BadRequestException('Signature mismatch — response may be tampered.');
    }
    if (product_code !== this.productCode) {
      throw new BadRequestException('Product code mismatch.');
    }

    const statusRes = await fetch(
      `${this.statusUrl}?product_code=${this.productCode}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`,
    );
    const statusData = await statusRes.json();
    if (statusData.status !== 'COMPLETE') {
      throw new BadRequestException(`Payment not complete: ${statusData.status}`);
    }

    const order = await this.prisma.order.findFirst({ where: { paymentRef: transaction_uuid } });
    if (!order) throw new NotFoundException('Order not found for this transaction.');

    if (order.status === 'PENDING') {
      await this.ordersService.confirmPayment(order.id, transaction_uuid, order.userId, 'ESEWA');
    }

    return order;
  }

  get redirectFrontendUrl() {
    return this.frontendUrl;
  }
}