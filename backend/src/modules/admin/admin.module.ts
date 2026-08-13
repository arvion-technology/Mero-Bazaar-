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
import { AdminFlagController } from './admin_flag.controller';
import { AdminFlagService } from './admin_flag.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminUserController, AdminListingController, AdminReportController, AdminPaymentController, AdminFlagController],
  providers: [AdminUserService, AdminListingService, AdminReportService, AdminPaymentService, AdminFlagService],
})
export class AdminModule {}