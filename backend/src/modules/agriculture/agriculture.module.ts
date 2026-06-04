import { Module } from '@nestjs/common';
import { AgricultureController } from './agriculture.controller';
import { AgricultureService } from './agriculture.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [AgricultureController],
  providers: [AgricultureService, PrismaService],
})
export class AgricultureModule {}
