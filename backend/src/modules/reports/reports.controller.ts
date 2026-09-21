import { Controller, Query, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { ReportsService } from './reports.service';
import { SellerOnly } from '../auth/roles_access.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @SellerOnly()
  @Get('top-listings')
  getTopListings(@Req() req, @Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : 5;
    return this.reportsService.getTopListings(req.user.id, take);
  }

  @SellerOnly()
  @Get('category-breakdown')
  getCategoryBreakdown(@Req() req) {
    return this.reportsService.getCategoryBreakdown(req.user.id);
  }

  @SellerOnly()
  @Get('order-status-breakdown')
  getOrderStatusBreakdown(@Req() req) {
    return this.reportsService.getOrderStatusBreakdown(req.user.id);
  }
}
