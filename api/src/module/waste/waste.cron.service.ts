import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WasteService } from './waste.service';

@Injectable()
export class WasteCronService {
  constructor(
    private readonly wasteService: WasteService,
    private readonly httpService: HttpService,
  ) {}

  /* eslint-disable */
  @Cron(CronExpression.EVERY_2_HOURS) // Fetch data every 2 hours
  async fetchData() {
    try {
      console.log('Cron Run fetchData Waste');

      const apiUrl = 'https://mock-api.com/Waste';

      // Use HttpService to make the request
      const response = await firstValueFrom(this.httpService.get(apiUrl));

      // @TODO: Insert data
      this.wasteService.cronBulk(response?.data);
    } catch (error) {
      console.error('Error fetching data Waste:', error?.message);
    }
  }
}
