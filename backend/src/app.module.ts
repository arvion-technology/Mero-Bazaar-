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
import { RentalController } from './modules/rental/rental.controller';
import { RentalService } from './modules/rental/rental.service';
import { RentalModule } from './modules/rental/rental.module';

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
    RentalModule,
  ],
  controllers: [AppController, RentalController],
  providers: [AppService, RentalService],
})
export class AppModule {}