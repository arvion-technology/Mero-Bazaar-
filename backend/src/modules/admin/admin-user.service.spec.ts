import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserService } from './admin-user.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';

describe('AdminUserService', () => {
  let service: AdminUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUserService,
        { provide: PrismaService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
      ],
    }).compile();

    service = module.get<AdminUserService>(AdminUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
