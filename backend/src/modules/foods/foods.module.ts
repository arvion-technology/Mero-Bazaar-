import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [FoodsService, PrismaService],
  controllers: [FoodsController],
})
export class FoodsModule {}
