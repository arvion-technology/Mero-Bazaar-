<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserController } from './admin-user.controller';
>>>>>>> origin/aashika

describe('AdminUserController', () => {
  let controller: AdminUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminUserController],
<<<<<<< HEAD
      providers: [{ provide: AdminUserService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<AdminUserController>(AdminUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
