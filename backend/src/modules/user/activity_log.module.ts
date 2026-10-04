import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity_log.service';
import { PrismaModule } from 'src/database/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
