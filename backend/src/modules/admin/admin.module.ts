import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { AdminListingController } from './admin-listing.controller';
import { AdminListingService } from './admin-listing.service';
import { AdminReportController } from './admin-report.controller';
import { AdminPaymentController } from './admin-payment.controller';
import { AdminReportService } from './admin-report.service';
import { AdminPaymentService } from './admin-payment.service';


@Module({
  imports: [PrismaModule],
  controllers: [AdminUserController, AdminListingController, AdminReportController, AdminPaymentController],
  providers: [AdminUserService, AdminListingService, AdminReportService, AdminPaymentService],
})
export class AdminModule {}