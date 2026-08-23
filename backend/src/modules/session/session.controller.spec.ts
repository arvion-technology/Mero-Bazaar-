<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './session.controller';
import { SessionsService } from './session.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [{ provide: SessionsService, useValue: {} }],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
=======
import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
    }).compile();

    controller = module.get<SessionController>(SessionController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
