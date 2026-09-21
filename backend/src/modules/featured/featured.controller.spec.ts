import { Test, TestingModule } from '@nestjs/testing';
import { FeaturedController } from './featured.controller';
import { FeaturedService } from './featured.service';
import { PrismaService } from '../../database/prisma.service';

describe('FeaturedController', () => {
  let controller: FeaturedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeaturedController],
      providers: [FeaturedService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<FeaturedController>(FeaturedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
