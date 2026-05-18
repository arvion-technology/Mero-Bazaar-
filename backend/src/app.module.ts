import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './database/prisma.module';
import { ListingsModule } from './modules/listings/listings.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { SearchModule } from './search/search.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { LeadsModule } from './modules/leads/leads.module';
import { MedicalModule } from './modules/medical/medical.module';
import { TradesController } from './modules/trades/trades.controller';
import { TradesModule } from './modules/trades/trades.module';

@Module({
  imports: [
    PrismaModule,
    ListingsModule,
    VehiclesModule,
    SearchModule,
    JobsModule,
    LeadsModule,
    MedicalModule,
    TradesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}