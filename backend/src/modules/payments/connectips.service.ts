import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrdersService } from '../orders/orders.service';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as forge from 'node-forge';
import { randomUUID } from 'crypto';

@Injectable()
export class ConnectipsService {
  private readonly baseUrl = process.env.CONNECTIPS_BASE_URL!;          
  private readonly merchantId = process.env.CONNECTIPS_MERCHANT_ID!;
  private readonly appId = process.env.CONNECTIPS_APP_ID!;
  private readonly appName = process.env.CONNECTIPS_APP_NAME!;
  private readonly appPassword = process.env.CONNECTIPS_APP_PASSWORD!;    
  private readonly certPath = process.env.CONNECTIPS_CERT_PATH!;         
  private readonly certPassword = process.env.CONNECTIPS_CERT_PASSWORD!;  
  private readonly backendUrl = process.env.BACKEND_URL!;
  private readonly frontendUrl = process.env.FRONTEND_URL!;

  private privateKeyPem: string | null = null;

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  // Lazily loads + caches the private key extracted from the .pfx so we dont reparse on each request
  private getPrivateKeyPem(): string {
    if (this.privateKeyPem) return this.privateKeyPem;

    const pfxBuffer = fs.readFileSync(this.certPath);
    const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.certPassword);

    const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
    const bag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0];
    if (!bag?.key) throw new Error('Could not extract private key from connectIPS certificate.');

    this.privateKeyPem = forge.pki.privateKeyToPem(bag.key);
    return this.privateKeyPem;
  }

  private sign(message: string): string {
    const pem = this.getPrivateKeyPem();
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(message);
    return signer.sign(pem, 'base64');
  }

  async initiate(orderId: string, buyerId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found.');
    if (order.userId !== buyerId) throw new ForbiddenException('Not your order.');
    if (order.status !== 'PENDING') {
      throw new ConflictException(`Order is already ${order.status.toLowerCase()}.`);
    }

    const txnId = randomUUID();
    const txnDate = this.formatDate(new Date()); 
    const txnAmtPaisa = Math.round(order.totalPrice * 100);

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: txnId },
    });

    const tokenString = [
      `MERCHANTID=${this.merchantId}`,
      `APPID=${this.appId}`,
      `APPNAME=${this.appName}`,
      `TXNID=${txnId}`,
      `TXNDATE=${txnDate}`,
      `TXNCRNCY=NPR`,
      `TXNAMT=${txnAmtPaisa}`,
      `REFERENCEID=${order.id}`,
      `REMARKS=Mero Bazaar Order`,
      `PARTICULARS=Order Payment`,
      `TOKEN=TOKEN`,
    ].join(',');

    const token = this.sign(tokenString);

    return {
      gatewayUrl: `${this.baseUrl}/connectipswebgw/loginpage`,
      fields: {
        MERCHANTID: this.merchantId,
        APPID: this.appId,
        APPNAME: this.appName,
        TXNID: txnId,
        TXNDATE: txnDate,
        TXNCRNCY: 'NPR',
        TXNAMT: txnAmtPaisa,
        REFERENCEID: order.id,
        REMARKS: 'Mero Bazaar Order',
        PARTICULARS: 'Order Payment',
        TOKEN: token,
      },
    };
  }

  async handleCallback(txnId: string) {
    if (!txnId) throw new BadRequestException('Missing TXNID.');

    const order = await this.prisma.order.findFirst({ where: { paymentRef: txnId } });
    if (!order) throw new NotFoundException('Order not found for this transaction.');

    const txnAmtPaisa = Math.round(order.totalPrice * 100);

    const tokenString = [
      `MERCHANTID=${this.merchantId}`,
      `APPID=${this.appId}`,
      `REFERENCEID=${order.id}`,
      `TXNAMT=${txnAmtPaisa}`,
    ].join(',');

    const token = this.sign(tokenString);

    const res = await fetch(`${this.baseUrl}/connectipswebws/api/creditor/validatetxn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${this.appId}:${this.appPassword}`).toString('base64'),
      },
      body: JSON.stringify({
        merchantId: this.merchantId,
        appId: this.appId,
        referenceId: order.id,
        txnAmt: txnAmtPaisa,
        token,
      }),
    });

    if (!res.ok) throw new BadRequestException('connectIPS validation request failed.');

    const data = await res.json();
    // Expect data.status === 'SUCCESS' on success

    if (data.status !== 'SUCCESS') {
      throw new BadRequestException(`Payment not complete: ${data.status ?? data.statusDesc}`);
    }

    if (order.status === 'PENDING') {
      await this.ordersService.confirmPayment(order.id, txnId, order.userId, 'CONNECTIPS');
    }

    return order;
  }

  private formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  get redirectFrontendUrl() {
    return this.frontendUrl;
  }
}