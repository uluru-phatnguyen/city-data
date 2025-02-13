import { Injectable } from '@nestjs/common';
import { CountryService } from '../country/country.service';

@Injectable()
export class SeedService {
  constructor(private readonly countryService: CountryService) {}

  async seedLocations() {
    await this.countryService.seed();
  }
}
