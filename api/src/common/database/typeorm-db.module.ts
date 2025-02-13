/* eslint-disable */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('nodeEnv') === 'production';

        const baseOptions: any = {
          migrationsTableName: 'migrations',
          database: configService.get('database.name'),
          synchronize: configService.get('database.synchronize'),
          logging: configService.get('database.logging'),
          entities: configService.get('database.entities'),
          subscribers: configService.get('database.subscribers'),
          migrations: configService.get('database.migrations'),
        };

        return isProd
          ? {
              type: 'postgres',
              host: configService.get('database.host'),
              port: configService.get('database.port'),
              username: configService.get('database.username'),
              password: configService.get('database.password'),
              ...baseOptions,
            }
          : {
              type: 'sqlite',
              ...baseOptions,
            };
      },
    }),
  ],
})
export class TypeOrmDBModule {}
