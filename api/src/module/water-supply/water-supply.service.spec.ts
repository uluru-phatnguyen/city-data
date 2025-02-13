import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WaterSupplyService } from './water-supply.service';
import { WaterSupplyEntity } from './water-supply.entity';

describe('WaterSupplyService', () => {
  let service: WaterSupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaterSupplyService,
        {
          provide: getRepositoryToken(WaterSupplyEntity), // ✅ Mock the repository
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WaterSupplyService>(WaterSupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
