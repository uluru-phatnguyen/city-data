import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CountryEntity } from './../country/country.entity';
import { CountryService } from '../country/country.service';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        CountryService,
        {
          provide: getRepositoryToken(CountryEntity), // ✅ Mock the repository
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
