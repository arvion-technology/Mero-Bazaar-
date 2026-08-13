import { Module } from '@nestjs/common';
import { VendorKycService } from './vendor-kyc.service';
import { VendorKycController } from './vendor-kyc.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { PhoneOtpModule } from '../otp/otp.module';
import { FileValidationService } from './upload/file_validation.service';
import { FileSanitizeService } from './upload/file_sanitize.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ 
    PrismaModule,
    PhoneOtpModule,
    NotificationsModule
  ],
  providers: [VendorKycService, FileValidationService, FileSanitizeService],
  controllers: [VendorKycController]
})
export class VendorKycModule {}
