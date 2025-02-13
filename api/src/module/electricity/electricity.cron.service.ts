import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ElectricityService } from './electricity.service';

@Injectable()
export class ElectricityCronService {
  constructor(
    private readonly electricityService: ElectricityService,
    private readonly httpService: HttpService,
  ) {}

  /* eslint-disable */
  @Cron(CronExpression.EVERY_2_HOURS) // Fetch data every 2 hours
  async fetchData() {
    try {
      console.log('Cron Run fetchData Electricity');

      const apiUrl = 'https://mock-api.com/electricity';

      // Use HttpService to make the request
      const response = await firstValueFrom(this.httpService.get(apiUrl));

      // @TODO: Insert data
      this.electricityService.cronBulk(response?.data);
    } catch (error) {
      console.error('Error fetching data Electricity:', error?.message);
    }
  }
}
