import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from './country.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async seed() {
    const existingCountries = await this.countryRepository.count({
      where: {
        code: In(['VN', 'DE']),
      },
    });

    if (existingCountries === 2) {
      console.log('🌍 Countries already seeded, skipping...');
      return;
    }

    const countries = [
      {
        code: 'VN',
        name: 'Vietnam',
        cities: [
          {
            code: 'HAN',
            name: 'Ha Noi',
            population: 8500000,
          },
          {
            code: 'HCM',
            name: 'Ho Chi Minh',
            population: 8900000,
          },
        ],
      },
      {
        code: 'DE',
        name: 'Germany',
        cities: [
          {
            code: 'Berlin',
            name: 'Berlin',
            population: 3677472,
          },
          {
            code: 'Hamburg',
            name: 'Hamburg',
            population: 1906411,
          },
          {
            code: 'Munich',
            name: 'Munich',
            population: 1487708,
          },
        ],
      },
    ];

    for (const countryData of countries) {
      const country = this.countryRepository.create({
        code: countryData.code,
        name: countryData.name,
        cities: countryData.cities,
      });

      await this.countryRepository.save(country);
    }

    console.log('✅ Countries and Cities Seeded Successfully!');

    return;
  }
}
