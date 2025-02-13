import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WaterSupplyService } from './water-supply.service';

@Injectable()
export class WaterSupplyCronService {
  constructor(
    private readonly waterService: WaterSupplyService,
    private readonly httpService: HttpService,
  ) {}

  /* eslint-disable */
  @Cron(CronExpression.EVERY_2_HOURS) // Fetch data every 2 hours
  async fetchData() {
    try {
      console.log('Cron Run fetchData WaterSupply');

      const apiUrl = 'https://mock-api.com/water-supply';

      // Use HttpService to make the request
      const response = await firstValueFrom(this.httpService.get(apiUrl));

      // @TODO: Insert data
      this.waterService.cronBulk(response?.data);
    } catch (error) {
      console.error('Error fetching data Water Supply:', error?.message);
    }
  }
}
