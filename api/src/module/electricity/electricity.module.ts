import { forwardRef, Module } from '@nestjs/common';
import { ElectricityService } from './electricity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectricityEntity } from './electricity.entity';
import { ElectricityController } from './electricity.controller';
import { HttpModule } from '@nestjs/axios';
import { CityModule } from '../city/city.module';
import { ElectricityCronService } from './electricity.cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectricityEntity]),
    HttpModule,
    forwardRef(() => CityModule),
  ],
  providers: [ElectricityService, ElectricityCronService],
  controllers: [ElectricityController],
})
export class ElectricityModule {}
