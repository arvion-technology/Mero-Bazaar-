import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';

const MAX_MONTHS = 24;

@Controller('vendor-sales-overview')
@UseGuards(JwtAuthGuard)
export class VendorSalesOverviewController {
  constructor(
    private readonly salesOverviewService: VendorSalesOverviewService,
  ) {}

  @Get()
  async getOverview(@Req() req, @Query('months') months?: string) {
    const monthCount = months !== undefined ? parseInt(months, 10) : 6;

    if (
      !Number.isFinite(monthCount) ||
      monthCount < 1 ||
      monthCount > MAX_MONTHS
    ) {
      throw new BadRequestException(
        `months must be between 1 and ${MAX_MONTHS}`,
      );
    }

    // Scope strictly to the authenticated user (JWT provides user.id, not vendorId).
    return this.salesOverviewService.getMonthlySalesOverview(
      req.user.id,
      monthCount,
    );
  }
}
