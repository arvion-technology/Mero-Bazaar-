import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReportsService],
<<<<<<< HEAD
  controllers: [ReportsController],
=======
  controllers: [ReportsController]
>>>>>>> origin/aashika
})
export class ReportsModule {}
