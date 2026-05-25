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
import { AgricultureService } from './modules/agriculture/agriculture.service';
import { AgricultureModule } from './modules/agriculture/agriculture.module';
import { SecondhandModule } from './modules/secondhand/secondhand.module';
import { SecondhandService } from './module/secondhand/secondhand.service';
import { SecondhandController } from './module/secondhand/secondhand.controller';

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
    AgricultureModule,
    SecondhandModule,
  ],
  controllers: [AppController, RentalController, SecondhandController],
  providers: [AppService, RentalService, AgricultureService, SecondhandService],
})
export class AppModule {}