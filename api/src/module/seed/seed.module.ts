import { Module } from '@nestjs/common';
import { CountryModule } from '../country/country.module';
import { CityModule } from '../city/city.module';
import { SeedService } from './seed.service';

@Module({
  imports: [CountryModule, CityModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
