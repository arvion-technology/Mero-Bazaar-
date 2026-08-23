<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserService } from './admin-user.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserService } from './admin-user.service';
>>>>>>> origin/aashika

describe('AdminUserService', () => {
  let service: AdminUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        AdminUserService,
        { provide: PrismaService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
      ],
=======
      providers: [AdminUserService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<AdminUserService>(AdminUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
