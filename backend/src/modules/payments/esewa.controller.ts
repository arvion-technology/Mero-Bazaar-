import { Controller, UseGuards, Post, Req, Body, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { EsewaService } from './esewa.service';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { InitiateEsewaDto } from './dto/initiate_esewa.dto';

@Controller('payments/esewa')
export class EsewaController {
  constructor(private readonly esewaService: EsewaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  initiate(@Body() dto: InitiateEsewaDto, @Req() req) {
    return this.esewaService.initiate(dto.orderId, req.user.id);
  }

  @Get('success')
  async success(@Query('data') data: string, @Res() res: Response) {
    try {
      const order = await this.esewaService.handleCallback(data);
      return res.redirect(`${this.esewaService.redirectFrontendUrl}/checkout/${order.id}?payment=success`);
    } catch {
      return res.redirect(`${this.esewaService.redirectFrontendUrl}/checkout/failed?reason=verification_failed`);
    }
  }

  @Get('failure')
  failure(@Res() res: Response) {
    return res.redirect(`${this.esewaService.redirectFrontendUrl}/checkout/failed?reason=payment_cancelled`);
  }
}