import { Controller, UseGuards, Post, Req, Body, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { InitiateKhaltiDto } from './dto/initiate_khalti.dto';
import { KhaltiService } from './khalti.service';

@Controller('payments/khalti')
export class KhaltiController {
  constructor(private readonly khaltiService: KhaltiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  initiate(@Body() dto: InitiateKhaltiDto, @Req() req) {
    return this.khaltiService.initiate(dto.orderId, req.user.id);
  }

  @Get('callback')
  async callback(@Query('pidx') pidx: string, @Res() res: Response) {
    try {
      const order = await this.khaltiService.handleCallback(pidx);
      return res.redirect(`${this.khaltiService.redirectFrontendUrl}/checkout/${order.id}?payment=success`);
    } catch {
      return res.redirect(`${this.khaltiService.redirectFrontendUrl}/checkout/failed?reason=verification_failed`);
    }
  }
}