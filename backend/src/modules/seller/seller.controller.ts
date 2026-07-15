import { Controller, Get, Param, Query } from '@nestjs/common';
import { SellersService } from './seller.service';


@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.sellersService.getSellerProfile(id);
  }

  @Get(':id/listings')
  getListings(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('take') take?: string,
  ) {
    return this.sellersService.getSellerListings(
      id,
      page ? Number(page) : 1,
      take ? Number(take) : 12,
    );
  }

  @Get(':id/reviews')
  getReviews(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('take') take?: string,
  ) {
    return this.sellersService.getSellerReviews(
      id,
      page ? Number(page) : 1,
      take ? Number(take) : 10,
    );
  }
}