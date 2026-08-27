import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { PaymentVerificationService } from 'src/modules/payments/payment-verification.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: PaymentVerificationService, useValue: {} },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
