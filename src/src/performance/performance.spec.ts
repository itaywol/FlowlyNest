import { Test, TestingModule } from '@nestjs/testing';
import { Performance } from './performance';

describe('Performance', () => {
  let provider: Performance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Performance],
    }).compile();

    provider = module.get<Performance>(Performance);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
