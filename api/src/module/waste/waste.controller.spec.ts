import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WasteEntity } from './waste.entity';
import { WasteService } from './waste.service';
import { WasteController } from './waste.controller';
import { CityService } from './../city/city.service';
import { CityEntity } from './../city/city.entity';

describe('WasteController', () => {
  let service: WasteService;
  let citySvc: CityService;
  let controller: WasteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WasteController],
      providers: [
        WasteService,
        CityService,
        {
          provide: getRepositoryToken(WasteEntity), // ✅ Mock the repository
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CityEntity), // ✅ Mock the repository
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<WasteController>(WasteController);
    service = module.get<WasteService>(WasteService);
    citySvc = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(citySvc).toBeDefined();
  });
});
