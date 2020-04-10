import { Test, TestingModule } from '@nestjs/testing';
import { PerformerController } from './performer.controller';

describe('Performer Controller', () => {
  let controller: PerformerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformerController],
    }).compile();

    controller = module.get<PerformerController>(PerformerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
