import { Module } from '@nestjs/common';
import { VendorKycService } from './vendor-kyc.service';
import { VendorKycController } from './vendor-kyc.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { PhoneOtpModule } from '../otp/otp.module';

@Module({
  imports: [ 
    PrismaModule,
    PhoneOtpModule,
    MulterModule.register({ dest: './uploads/kyc' }),
  ],
  providers: [VendorKycService],
  controllers: [VendorKycController]
})
export class VendorKycModule {}
