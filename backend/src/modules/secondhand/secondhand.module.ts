import { Module } from '@nestjs/common';
import { SecondhandService } from './secondhand.service';
import { SecondhandController } from './secondhand.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SecondhandService, PrismaService],
  controllers: [SecondhandController],
})
export class SecondhandModule {}
