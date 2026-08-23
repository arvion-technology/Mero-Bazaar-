import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity_log.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
<<<<<<< HEAD
export class ActivityLogModule {}
=======
export class ActivityLogModule {}
>>>>>>> origin/aashika
