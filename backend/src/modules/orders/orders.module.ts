import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentVerificationService } from '../payments/payment-verification.service';

@Module({
<<<<<<< HEAD
  imports: [
    PrismaModule,
    AuthModule,
    ScheduleModule.forRoot(),
    NotificationsModule,
  ],
=======
  imports: [PrismaModule, AuthModule, ScheduleModule.forRoot(), NotificationsModule],
>>>>>>> origin/aashika
  providers: [OrdersService, PaymentVerificationService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
