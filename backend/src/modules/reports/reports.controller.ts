import { Controller, Query, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('top-listings')
  getTopListings(@Req() requestAnimationFrame, @Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : 5;
    return this.reportsService.getTopListings(requestAnimationFrame.user.id, take);
  }

  @Get('category-breakdown')
  getCategoryBreakdown(@Req() req) {
    return this.reportsService.getCategoryBreakdown(req.user.id);
  }

  @Get('order-status-breakdown')
  getOrderStatusBreakdown(@Req() req) {
    return this.reportsService.getOrderStatusBreakdown(req.user.id);
  }
}
