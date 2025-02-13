import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor';
import { AllExceptionFilter } from './common/filter';
import { setupSwagger } from './common/util';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefixPath = `${configService.get('apiPrefix') ?? 'api/v1'}`;

  app.setGlobalPrefix(`${apiPrefixPath}`, { exclude: [] });

  app.enableCors({
    origin: '*', // Replace with your React frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're sending cookies or authorization headers
  });

  // Apply the global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Apply the global interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Apply the global exception filter
  app.useGlobalFilters(new AllExceptionFilter());

  setupSwagger(app, apiPrefixPath);

  await app.listen(Number(configService.get('port') || 6868));

  Logger.log(`API Service start with port: ${configService.get('port')}`);
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap();
