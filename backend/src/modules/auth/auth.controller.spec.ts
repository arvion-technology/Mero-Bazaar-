<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
>>>>>>> origin/aashika

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
<<<<<<< HEAD
      providers: [{ provide: AuthService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
