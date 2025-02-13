import { forwardRef, Module } from '@nestjs/common';
import { WasteService } from './waste.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WasteEntity } from './waste.entity';
import { WasteController } from './waste.controller';
import { HttpModule } from '@nestjs/axios';
import { CityModule } from '../city/city.module';
import { WasteCronService } from './waste.cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WasteEntity]),
    HttpModule,
    forwardRef(() => CityModule),
  ],
  providers: [WasteService, WasteCronService],
  controllers: [WasteController],
})
export class WasteModule {}
