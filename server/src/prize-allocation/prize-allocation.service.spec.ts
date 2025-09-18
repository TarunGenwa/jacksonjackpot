import { Test, TestingModule } from '@nestjs/testing';
import { PrizeAllocationService } from './prize-allocation.service';

describe('PrizeAllocationService', () => {
  let service: PrizeAllocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrizeAllocationService],
    }).compile();

    service = module.get<PrizeAllocationService>(PrizeAllocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
