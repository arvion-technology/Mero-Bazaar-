import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
