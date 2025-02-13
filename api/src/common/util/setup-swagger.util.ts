import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  apiPrefixPath: string = '',
): void {
  const options = new DocumentBuilder()
    .setTitle('API Service Docs')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(
    `${apiPrefixPath ? apiPrefixPath + '/' : ''}docs`,
    app,
    document,
  );
}
