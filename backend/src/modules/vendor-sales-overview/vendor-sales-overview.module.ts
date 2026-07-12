import { Module } from '@nestjs/common';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';
import { PrismaModule } from 'src/database/prisma.module';
import { VendorSalesOverviewController } from './vendor-sales-overview.controller';

@Module({
  imports: [PrismaModule],
  providers: [VendorSalesOverviewService],
  controllers: [VendorSalesOverviewController],
})
export class VendorSalesOverviewModule {}
