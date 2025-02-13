import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './module/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedSvc = app.get(SeedService);

  try {
    await seedSvc.seedLocations();
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap();
