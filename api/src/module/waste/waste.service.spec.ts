import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WasteService } from './waste.service';
import { WasteEntity } from './waste.entity';

describe('WasteService', () => {
  let service: WasteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WasteService,
        {
          provide: getRepositoryToken(WasteEntity), // ✅ Mock the repository
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WasteService>(WasteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
