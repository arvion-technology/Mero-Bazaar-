import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { ContentReportsController } from './content-reports.controller';
import { ContentReportsService } from './content-reports.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContentReportsController],
  providers: [ContentReportsService],
})
export class ContentReportsModule {}