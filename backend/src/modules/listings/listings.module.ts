import { Module } from '@nestjs/common';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { PrismaModule } from 'src/database/prisma.module';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';

@Module({
  imports: [PrismaModule, VehiclesModule],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
