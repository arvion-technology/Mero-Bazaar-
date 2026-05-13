import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { VehicleStrategy } from './strategies/vehicle.strategy';
import { JobStrategy } from './strategies/jobs.strategy';
import { PrismaModule } from 'src/database/prisma.module';
import { ListingsModule } from 'src/modules/listings/listings.module';

@Module({
  imports: [PrismaModule, ListingsModule],
  controllers: [SearchController],
  providers: [SearchService, VehicleStrategy, JobStrategy],
})
export class SearchModule {}
