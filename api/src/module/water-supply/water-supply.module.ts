import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterSupplyEntity } from './water-supply.entity';
import { WaterSupplyService } from './water-supply.service';
import { WaterSupplyController } from './water-supply.controller';
import { CityModule } from './../city/city.module';
import { HttpModule } from '@nestjs/axios';
import { WaterSupplyCronService } from './water-supply.cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaterSupplyEntity]),
    HttpModule,
    forwardRef(() => CityModule),
  ],
  controllers: [WaterSupplyController],
  providers: [WaterSupplyService, WaterSupplyCronService],
})
export class WaterSupplyModule {}
