<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
>>>>>>> origin/aashika

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: {} },
      ],
=======
      providers: [NotificationsService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
