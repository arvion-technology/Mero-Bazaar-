import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { VehicleStrategy } from './strategies/vehicle.strategy';
import { JobStrategy } from './strategies/jobs.strategy';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchService, VehicleStrategy, JobStrategy],
})
export class SearchModule {}
