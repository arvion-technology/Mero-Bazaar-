import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { PrismaModule } from 'src/database/prisma.module';
import { VehiclesController } from './vehicles.controller';

@Module({
  imports: [PrismaModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
