import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { SessionsService } from './session.service';
import type { Request } from 'express';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMySessions(@Req() req: Request & { user: { id: string; sessionId?: string } }) {
    return this.sessionsService.findActiveByUser(req.user.id, req.user.sessionId);
  }
}