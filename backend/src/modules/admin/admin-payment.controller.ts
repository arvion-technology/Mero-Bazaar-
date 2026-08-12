import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrderStatus, PaymentMethod, UserRole } from '@prisma/client';
import { AdminPaymentService } from './admin-payment.service';

@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPaymentController {
  constructor(private readonly adminPaymentService: AdminPaymentService) {}

  @Get()
  findAll(
    @Query('paymentMethod') paymentMethod?: PaymentMethod,
    @Query('status') status?: OrderStatus,
  ) {
    return this.adminPaymentService.findAllForAdmin({ paymentMethod, status });
  }
}