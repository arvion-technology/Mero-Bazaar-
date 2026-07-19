import { Controller, UseGuards, Post, Req, Body, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { ConnectipsService } from './connectips.service';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { InitiateConnectipsDto } from './dto/initiate_connectips.dto';

@Controller('payments/connectips')
export class ConnectipsController {
  constructor(private readonly connectipsService: ConnectipsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  initiate(@Body() dto: InitiateConnectipsDto, @Req() req) {
    return this.connectipsService.initiate(dto.orderId, req.user.id);
  }

  // connectIPS redirects here as configured with NCHL: successURL/failureURL, both hit with ?TXNID=...
  @Get('success')
  async success(@Query('TXNID') txnId: string, @Res() res: Response) {
    try {
      const order = await this.connectipsService.handleCallback(txnId);
      return res.redirect(`${this.connectipsService.redirectFrontendUrl}/checkout/${order.id}?payment=success`);
    } catch {
      return res.redirect(`${this.connectipsService.redirectFrontendUrl}/checkout/failed?reason=verification_failed`);
    }
  }

  @Get('failure')
  failure(@Res() res: Response) {
    return res.redirect(`${this.connectipsService.redirectFrontendUrl}/checkout/failed?reason=payment_cancelled`);
  }
}