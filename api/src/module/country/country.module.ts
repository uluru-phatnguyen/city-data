import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';
import { CityModule } from '../city/city.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    forwardRef(() => CityModule),
  ],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
