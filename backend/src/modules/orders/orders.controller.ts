import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateReservationDto } from './dto/create_reservation.dto';
import { CreateDeliveryOrderDto } from './dto/create_delivery_order.dto';
import { ConfirmPaymentDto } from './dto/confirm_payment.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { RaiseDisputeDto } from './dto/raise_dispute.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}


  @Post('reservations')
  reserve(@Body() dto: CreateReservationDto, @Req() req) {
    return this.ordersService.reserveListing(dto.listingId, req.user.id);
  }

  @Post('delivery')
  createDelivery(@Body() dto: CreateDeliveryOrderDto, @Req() req) {
    return this.ordersService.createDeliveryOrder(
      dto.listingId,
      req.user.id,
      dto.quantity,
      dto.deliveryDate,
      dto.deliveryAddress,
    );
  }

  @Get('seller/mine')
  getSellerOrders(@Req() req) {
    return this.ordersService.getOrdersForSeller(req.user.id);
  }

  @Get('seller/unread-count')
  countPending(@Req() req) {
    return this.ordersService.countPendingForSeller(req.user.id);
  }

  @Get('mine')
  getMine(@Req() req) {
    return this.ordersService.getMyOrders(req.user.id);
  }

  @Get(':id')                                    
  getOne(@Param('id') id: string, @Req() req) {
    return this.ordersService.getOrderById(id, req.user.id);
  }

  @Post(':id/confirm-payment')
  confirmPayment(@Param('id') id: string, @Body() dto: ConfirmPaymentDto, @Req() req) {
    return this.ordersService.confirmPayment(id, dto.paymentRef, req.user.id, dto.paymentMethod);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Req() req) {
    return this.ordersService.cancelReservation(id, req.user.id);
  }

  @Get('seller/stats')
  getSellerStats(@Req() req) {
    return this.ordersService.getSellerOrderStats(req.user.id);
  }

  @Post(':id/dispute')
  raiseDispute(@Param('id') id: string, @Body() dto: RaiseDisputeDto, @Req() req) {
    return this.ordersService.raiseDispute(id, req.user.id, dto.reason);
  }
}