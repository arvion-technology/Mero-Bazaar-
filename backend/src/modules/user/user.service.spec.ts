import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PhoneOtpService } from 'src/modules/otp/otp.service';
import { ActivityLogService } from 'src/modules/user/activity_log.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: PhoneOtpService, useValue: {} },
        { provide: ActivityLogService, useValue: {} },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
