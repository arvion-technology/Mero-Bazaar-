<<<<<<< HEAD
﻿import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
=======
import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from 'src/database/prisma.service';
>>>>>>> origin/aashika
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from 'src/database/prisma.module';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
