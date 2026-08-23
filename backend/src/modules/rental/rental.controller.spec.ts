import { Test, TestingModule } from '@nestjs/testing';
import { RentalController } from './rental.controller';
<<<<<<< HEAD
import { RentalService } from './rental.service';
=======
>>>>>>> origin/aashika

describe('RentalController', () => {
  let controller: RentalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalController],
<<<<<<< HEAD
      providers: [{ provide: RentalService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<RentalController>(RentalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
