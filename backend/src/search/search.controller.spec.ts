<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
>>>>>>> origin/aashika

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
<<<<<<< HEAD
      providers: [{ provide: SearchService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
