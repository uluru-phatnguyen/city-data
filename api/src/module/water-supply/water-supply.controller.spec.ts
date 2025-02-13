import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterSupplyEntity } from './water-supply.entity';
import { WaterSupplyService } from './water-supply.service';
import { WaterSupplyController } from './water-supply.controller';
import { CityService } from './../city/city.service';
import { CityEntity } from './../city/city.entity';

describe('WaterSupplyController', () => {
  let service: WaterSupplyService;
  let citySvc: CityService;
  let controller: WaterSupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaterSupplyController],
      providers: [
        WaterSupplyService,
        CityService,
        {
          provide: getRepositoryToken(WaterSupplyEntity), // ✅ Mock the repository
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CityEntity), // ✅ Mock the repository
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<WaterSupplyController>(WaterSupplyController);
    service = module.get<WaterSupplyService>(WaterSupplyService);
    citySvc = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(citySvc).toBeDefined();
  });
});
