import { Module } from '@nestjs/common';
import { AgricultureController } from './agriculture.controller';
import { AgricultureService } from './agriculture.service';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AgricultureController],
  providers: [AgricultureService, PrismaService],
})
export class AgricultureModule {}
