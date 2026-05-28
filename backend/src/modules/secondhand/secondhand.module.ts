import { Module } from '@nestjs/common';
import { SecondhandService } from './secondhand.service';
import { SecondhandController } from './secondhand.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [SecondhandService, PrismaService],
  controllers: [SecondhandController],
})
export class SecondhandModule {}
