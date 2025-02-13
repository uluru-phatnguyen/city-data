import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ElectricityService } from './electricity.service';
import { ElectricityEntity } from './electricity.entity';

describe('ElectricityService', () => {
  let service: ElectricityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectricityService,
        {
          provide: getRepositoryToken(ElectricityEntity), // ✅ Mock the repository
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ElectricityService>(ElectricityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
