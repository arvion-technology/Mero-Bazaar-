import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { VendorService } from './vendor.service';

@Controller('seller/dashboard')
export class VendorController {
  constructor(private readonly vendorDashboardService: VendorService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('stats')
  async getStats(@Request() req) {
    const [stats, recentOrders] = await Promise.all([
      this.vendorDashboardService.getStats(req.user.id),
      this.vendorDashboardService.getRecentOrders(req.user.id),
    ]);
    return { ...stats, recentOrders };
  }
}