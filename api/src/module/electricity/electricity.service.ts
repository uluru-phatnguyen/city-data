import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ElectricityEntity } from './electricity.entity';
import { parsePaginationParams } from './../../common/helper';
import { ElectricityFindFiltersDto } from './electricity.dto';

@Injectable()
export class ElectricityService {
  constructor(
    @InjectRepository(ElectricityEntity)
    private readonly electricityRepository: Repository<ElectricityEntity>,
  ) {}

  async create(data: Partial<ElectricityEntity>): Promise<ElectricityEntity> {
    const electricityData = this.electricityRepository.create(data);

    return this.electricityRepository.save(electricityData);
  }

  async upsertBulk(
    entities: Partial<ElectricityEntity>[],
  ): Promise<ElectricityEntity[]> {
    const items: ElectricityEntity[] = [];

    for (const ent of entities) {
      // Check if the record already exists
      const existing = await this.electricityRepository.findOne({
        where: {
          cityId: ent.cityId,
          provider: ent.provider,
          dateRecorded: ent.dateRecorded,
        },
      });

      let data = ent;
      if (existing) {
        data = {
          ...existing,
          ...ent,
        };
      }

      const electricity = await this.electricityRepository.save(data);
      items.push(electricity);
    }

    return items;
  }

  async insertBulk(entities: Partial<ElectricityEntity>[]): Promise<number[]> {
    return this.insertBatches(entities);
  }

  private async insertBatches(
    entities: Partial<ElectricityEntity>[],
    batchSize: number = 1000,
  ): Promise<number[]> {
    const ids: number[] = [];

    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      const {
        identifiers,
        // generatedMaps,
        // raw
      } = await this.electricityRepository.insert(batch);
      // await this.electricityRepository.upsert(batch, ['cityId', 'provider', 'dateRecorded']);

      identifiers?.forEach((i) => {
        ids.push(Number(i.id));
      });
    }

    return ids ?? [];
  }

  // @TODO: Fake
  cronBulk(entities: Partial<ElectricityEntity>[]) {
    return entities;
  }

  async findByFilters(
    filters: ElectricityFindFiltersDto,
  ): Promise<{ items: ElectricityEntity[]; total: number }> {
    const { page = 1, limit = null, ...restFilters } = filters; // Extract pagination and filters

    const paginationParams = parsePaginationParams(page, limit);

    const optionWheres: FindOptionsWhere<ElectricityEntity> = {};
    if (restFilters.cityId) {
      optionWheres.cityId = restFilters.cityId;
    }

    const [items, total] = await this.electricityRepository.findAndCount({
      where: optionWheres,
      take: paginationParams.take,
      skip: paginationParams.offset,
    });

    return {
      items,
      total,
    };
  }

  async findOne(id: number): Promise<ElectricityEntity | null> {
    return this.electricityRepository.findOne({
      where: {
        id,
      },
    });
  }
}
