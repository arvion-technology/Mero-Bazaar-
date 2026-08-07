import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { SellerPaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class SellerPaymentsController {
  constructor(private readonly paymentsService: SellerPaymentsService) {}

  @Get('summary')
  getSummary(@Req() req) {
    return this.paymentsService.getEarningsSummary(req.user.id);
  }

  @Get('transactions')
  getTransactions(@Req() req) {
    return this.paymentsService.getTransactionHistory(req.user.id);
  }
}