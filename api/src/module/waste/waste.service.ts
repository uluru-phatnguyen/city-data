import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { WasteEntity } from './waste.entity';
import { parsePaginationParams } from './../../common/helper';
import { WasteFindFiltersDto } from './waste.dto';

@Injectable()
export class WasteService {
  constructor(
    @InjectRepository(WasteEntity)
    private readonly wasteRepository: Repository<WasteEntity>,
  ) {}

  async create(data: Partial<WasteEntity>): Promise<WasteEntity> {
    const wasteData = this.wasteRepository.create(data);

    return this.wasteRepository.save(wasteData);
  }

  async upsertBulk(entities: Partial<WasteEntity>[]): Promise<WasteEntity[]> {
    const items: WasteEntity[] = [];

    for (const ent of entities) {
      // Check if the record already exists
      const existing = await this.wasteRepository.findOne({
        where: {
          cityId: ent.cityId,
          type: ent.type,
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

      const Waste = await this.wasteRepository.save(data);
      items.push(Waste);
    }

    return items;
  }

  async insertBulk(entities: Partial<WasteEntity>[]): Promise<number[]> {
    return this.insertBatches(entities);
  }

  private async insertBatches(
    entities: Partial<WasteEntity>[],
    batchSize: number = 1000,
  ): Promise<number[]> {
    const ids: number[] = [];

    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      const {
        identifiers,
        // generatedMaps,
        // raw
      } = await this.wasteRepository.insert(batch);
      // await this.wasteRepository.upsert(batch, ['cityId', 'type', 'dateRecorded']);

      identifiers?.forEach((i) => {
        ids.push(Number(i.id));
      });
    }

    return ids ?? [];
  }

  // @TODO: Fake
  cronBulk(entities: Partial<WasteEntity>[]) {
    return entities;
  }

  async findByFilters(
    filters: WasteFindFiltersDto,
  ): Promise<{ items: WasteEntity[]; total: number }> {
    const { page = 1, limit = null, ...restFilters } = filters; // Extract pagination and filters

    const paginationParams = parsePaginationParams(page, limit);

    const optionWheres: FindOptionsWhere<WasteEntity> = {};
    if (restFilters.cityId) {
      optionWheres.cityId = restFilters.cityId;
    }

    const [items, total] = await this.wasteRepository.findAndCount({
      where: optionWheres,
      take: paginationParams.take,
      skip: paginationParams.offset,
    });

    return {
      items,
      total,
    };
  }

  async findOne(id: number): Promise<WasteEntity | null> {
    return this.wasteRepository.findOne({
      where: {
        id,
      },
    });
  }
}
