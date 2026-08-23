<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
>>>>>>> origin/aashika

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
<<<<<<< HEAD
      providers: [{ provide: NotificationsService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
