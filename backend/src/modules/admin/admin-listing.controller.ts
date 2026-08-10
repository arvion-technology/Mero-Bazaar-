import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListingCategory, ListingStatus, UserRole } from '@prisma/client';
import { AdminListingService } from './admin-listing.service';

@Controller('admin/listings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminListingController {
  constructor(private adminListingService: AdminListingService) {}

  @Get()
  listListings(
    @Query('category') category?: ListingCategory,
    @Query('status') status?: ListingStatus,
  ) {
    return this.adminListingService.listListings(category, status);
  }

  @Get(':id')
  getListingById(@Param('id') id: string) {
    return this.adminListingService.getListingById(id);
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body('status') status: ListingStatus) {
    return this.adminListingService.setStatus(id, status);
  }

  @Patch(':id')
  updateListing(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.adminListingService.updateListing(id, body);
  }

  @Delete(':id')
  deleteListing(@Param('id') id: string) {
    return this.adminListingService.deleteListing(id);
  }
}