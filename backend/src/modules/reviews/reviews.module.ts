import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ReviewsService, PrismaService],
})
export class ReviewsModule {}
