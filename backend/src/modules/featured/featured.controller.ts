import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { FeaturedSlot } from '@prisma/client';
import { FeaturedService } from './featured.service';

@Controller('featured')
export class FeaturedController {
  constructor(private readonly featured: FeaturedService) {}

  @Get('home')
  home(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('city') city?: string,
  ) {
    return this.featured.getFeatured({
      limit: Math.min(limit, 20),
      city,
      slot: FeaturedSlot.HOME_FEATURED,
    });
  }
}