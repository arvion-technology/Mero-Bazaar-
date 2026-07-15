import { Controller, Post, Request, Body, Param, Get, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ToggleWishlistDto } from './dto/toggle_wishlist.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('toggle')
  toggle(@Body() dto: ToggleWishlistDto, @Request() req) {
    return this.wishlistService.toggle(req.user.id, dto.listingId);
  }

  @Get('mine')
  findALlMine(@Request() req) {
    return this.wishlistService.findAllMine(req.user.id);
  }

  @Get('check/:listingId')
  isFavorited(@Param('listingId') listingId: string, @Request() req) {
    return this.wishlistService.isFavorited(req.user.id, listingId);
  }
}
