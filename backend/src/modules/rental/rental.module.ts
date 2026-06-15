import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:  [AuthModule],
  controllers: [RentalController],
  providers: [RentalService, PrismaService],
})
export class RentalModule {}
