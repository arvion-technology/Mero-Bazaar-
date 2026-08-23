import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
<<<<<<< HEAD
import { UserService } from './user.service';
import { ActivityLogService } from './activity_log.service';

process.env.INTERNAL_API_SECRET = 'test-internal-secret-1234567890';
=======
>>>>>>> origin/aashika

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
<<<<<<< HEAD
      providers: [
        { provide: UserService, useValue: {} },
        { provide: ActivityLogService, useValue: {} },
      ],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
