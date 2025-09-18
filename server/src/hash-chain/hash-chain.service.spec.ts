import { Test, TestingModule } from '@nestjs/testing';
import { HashChainService } from './hash-chain.service';

describe('HashChainService', () => {
  let service: HashChainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashChainService],
    }).compile();

    service = module.get<HashChainService>(HashChainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
