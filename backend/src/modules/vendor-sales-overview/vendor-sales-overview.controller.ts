import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';

@Controller('vendor-sales-overview')
@UseGuards(JwtAuthGuard)
export class VendorSalesOverviewController {
  constructor(private readonly salesOverviewService: VendorSalesOverviewService) {}

  @Get()
  async getOverview(@Req() req, @Query('months') months?: string) {
    const monthCount = months ? parseInt(months, 10) : 6;
    return this.salesOverviewService.getMonthlySalesOverview(
      req.user.vendorId,
      monthCount,
    );
  }
}