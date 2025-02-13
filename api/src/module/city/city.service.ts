import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CityEntity } from './city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async findById(id: number): Promise<CityEntity | null> {
    return this.cityRepository.findOneBy({
      id: id,
    });
  }

  async findByIds(ids: number[]): Promise<CityEntity[]> {
    return this.cityRepository.findBy({
      id: In(ids),
    });
  }
}
