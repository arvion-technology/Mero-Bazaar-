import { Module } from '@nestjs/common';
import { EsewaService } from './esewa.service';
import { EsewaController } from './esewa.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { OrdersModule } from '../orders/orders.module';
import { AuthModule } from '../auth/auth.module';
import { KhaltiService } from './khalti.service';
import { KhaltiController } from './khalti.controller';
import { ConnectipsService } from './connectips.service';
import { ConnectipsController } from './connectips.controller';
import { SellerPaymentsService } from './payments.service';
import { SellerPaymentsController } from './payments.controller';

@Module({
  imports: [PrismaModule, OrdersModule, AuthModule],
  providers: [EsewaService, KhaltiService, ConnectipsService, SellerPaymentsService],
  controllers: [EsewaController, KhaltiController, ConnectipsController, SellerPaymentsController], 
})
export class PaymentsModule {}
