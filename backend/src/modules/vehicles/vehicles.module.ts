import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { PrismaModule } from 'src/database/prisma.module';
import { VehiclesController } from './vehicles.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
