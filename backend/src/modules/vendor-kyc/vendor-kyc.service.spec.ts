<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { VendorKycService } from './vendor-kyc.service';
import { PrismaService } from 'src/database/prisma.service';
import { PhoneOtpService } from 'src/modules/otp/otp.service';
import { FileValidationService } from 'src/modules/vendor-kyc/upload/file_validation.service';
import { FileSanitizeService } from 'src/modules/vendor-kyc/upload/file_sanitize.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { VendorKycService } from './vendor-kyc.service';
>>>>>>> origin/aashika

describe('VendorKycService', () => {
  let service: VendorKycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        VendorKycService,
        { provide: PrismaService, useValue: {} },
        { provide: PhoneOtpService, useValue: {} },
        { provide: FileValidationService, useValue: {} },
        { provide: FileSanitizeService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
      ],
=======
      providers: [VendorKycService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<VendorKycService>(VendorKycService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
