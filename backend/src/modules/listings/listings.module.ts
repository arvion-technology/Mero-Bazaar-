import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { AuthModule } from '../auth/auth.module';
import { GeocodingController } from './geocoding.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ListingsController, GeocodingController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
