import { Controller, Param, Post, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('user/notifications')
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get()
  findAll(@Request() req) {
    return this.service.findAllForUser(req.user.id);
  }

  @Get('security')
  findSecurity(@Request() req) {
    return this.service.findSecurityForUser(req.user.id);
  }

  @Post('mark-all-read')
  markAllRead(@Request() req) {
    return this.service.markAllRead(req.user.id);
  }

  @Post('security/mark-read')
  markAllSecurityRead(@Request() req) {
    return this.service.markAllSecurityRead(req.user.id);
  }

  @Post(':id/mark-read')
  markRead(@Request() req, @Param('id') id: string) {
    return this.service.markRead(req.user.id, id);
  }
}
