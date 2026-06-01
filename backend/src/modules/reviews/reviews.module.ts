import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [ReviewsService, PrismaService],
})
export class ReviewsModule {}
