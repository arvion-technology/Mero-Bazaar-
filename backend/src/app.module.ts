import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { ListingsService } from './modules/listings/listings.service';
import { ListingsController } from './modules/listings/listings.controller';
import { ListingsModule } from './modules/listings/listings.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [PrismaModule, ListingsModule, VehiclesModule],
  controllers: [AppController, ListingsController],
  providers: [AppService, ListingsService],
})
export class AppModule {}
