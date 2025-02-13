import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { WaterSupplyEntity } from './water-supply.entity';
import { parsePaginationParams } from './../../common/helper';
import { WaterSupplyFindFiltersDto } from './water-supply.dto';

@Injectable()
export class WaterSupplyService {
  constructor(
    @InjectRepository(WaterSupplyEntity)
    private readonly waterRepository: Repository<WaterSupplyEntity>,
  ) {}

  async create(data: Partial<WaterSupplyEntity>): Promise<WaterSupplyEntity> {
    const waterData = this.waterRepository.create(data);

    return this.waterRepository.save(waterData);
  }

  async upsertBulk(
    entities: Partial<WaterSupplyEntity>[],
  ): Promise<WaterSupplyEntity[]> {
    const items: WaterSupplyEntity[] = [];

    for (const ent of entities) {
      // Check if the record already exists
      const existing = await this.waterRepository.findOne({
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

      const water = await this.waterRepository.save(data);
      items.push(water);
    }

    return items;
  }

  async insertBulk(entities: Partial<WaterSupplyEntity>[]): Promise<number[]> {
    return this.insertBatches(entities);
  }

  private async insertBatches(
    entities: Partial<WaterSupplyEntity>[],
    batchSize: number = 1000,
  ): Promise<number[]> {
    const ids: number[] = [];

    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      const {
        identifiers,
        // generatedMaps,
        // raw
      } = await this.waterRepository.insert(batch);
      // await this.waterRepository.upsert(batch, ['cityId', 'provider', 'dateRecorded']);

      identifiers?.forEach((i) => {
        ids.push(Number(i.id));
      });
    }

    return ids ?? [];
  }

  // @TODO: Fake
  cronBulk(entities: Partial<WaterSupplyEntity>[]) {
    return entities;
  }

  async findByFilters(
    filters: WaterSupplyFindFiltersDto,
  ): Promise<{ items: WaterSupplyEntity[]; total: number }> {
    const { page = 1, limit = null, ...restFilters } = filters; // Extract pagination and filters

    const paginationParams = parsePaginationParams(page, limit);

    const optionWheres: FindOptionsWhere<WaterSupplyEntity> = {};
    if (restFilters.cityId) {
      optionWheres.cityId = restFilters.cityId;
    }

    const [items, total] = await this.waterRepository.findAndCount({
      where: optionWheres,
      take: paginationParams.take,
      skip: paginationParams.offset,
    });

    return {
      items,
      total,
    };
  }

  async findOne(id: number): Promise<WaterSupplyEntity | null> {
    return this.waterRepository.findOne({
      where: {
        id,
      },
    });
  }
}
