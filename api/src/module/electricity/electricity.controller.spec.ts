import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectricityEntity } from './electricity.entity';
import { ElectricityService } from './electricity.service';
import { ElectricityController } from './electricity.controller';
import { CityService } from './../city/city.service';
import { CityEntity } from './../city/city.entity';

describe('ElectricityController', () => {
  let service: ElectricityService;
  let citySvc: CityService;
  let controller: ElectricityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectricityController],
      providers: [
        ElectricityService,
        CityService,
        {
          provide: getRepositoryToken(ElectricityEntity), // ✅ Mock the repository
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CityEntity), // ✅ Mock the repository
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ElectricityController>(ElectricityController);
    service = module.get<ElectricityService>(ElectricityService);
    citySvc = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(citySvc).toBeDefined();
  });
});
