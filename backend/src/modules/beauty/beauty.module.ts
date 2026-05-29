import { Module } from '@nestjs/common';
import { BeautyController } from './beauty.controller';
import { BeautyService } from './beauty.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [BeautyController],
  providers: [BeautyService, PrismaService],
})
export class BeautyModule {}
