import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
