<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { PaymentVerificationService } from 'src/modules/payments/payment-verification.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
>>>>>>> origin/aashika

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: PaymentVerificationService, useValue: {} },
      ],
=======
      providers: [OrdersService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
