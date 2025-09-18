import { Test, TestingModule } from '@nestjs/testing';
import { InstantWinsService } from './instant-wins.service';

describe('InstantWinsService', () => {
  let service: InstantWinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstantWinsService],
    }).compile();

    service = module.get<InstantWinsService>(InstantWinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
