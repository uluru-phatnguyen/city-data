import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config';
import { getEnvPath } from './common/helper';
import { TypeOrmDBModule } from './common/database/typeorm-db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryModule } from './module/country/country.module';
import { CityModule } from './module/city/city.module';
import { SeedModule } from './module/seed/seed.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WaterSupplyModule } from './module/water-supply/water-supply.module';
import { ElectricityModule } from './module/electricity/electricity.module';
import { WasteModule } from './module/waste/waste.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [getEnvPath('./')],
      load: [configuration],
      isGlobal: true,
      cache: false,
    }),
    TypeOrmDBModule,
    ScheduleModule.forRoot(),
    CountryModule,
    CityModule,
    SeedModule,
    WaterSupplyModule,
    ElectricityModule,
    WasteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CountryModule, CityModule],
})
export class AppModule {}
