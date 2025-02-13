import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { getEnvPath } from './../helper';

config({
  path: getEnvPath('./'),
});

const sqliteOptions: DataSourceOptions = {
  type: 'sqlite',
  database: `${process.env.DB_NAME ?? 'city-data.sqlite'}`,
};

const postgresOptions: DataSourceOptions = {
  type: 'postgres',
  database: `${process.env.DB_NAME ?? 'city-data'}`,
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl:
    (process.env.DB_SSL_CERT_BASE64 ?? '') !== ''
      ? {
          ca: Buffer.from(
            process.env.DB_SSL_CERT_BASE64 as string,
            'base64',
          ).toString('ascii'),
        }
      : (process.env.DB_SSL ?? '') === 'true',
};

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const baseOptions: any = {
  migrations: [resolve(`${__dirname}/../database/migrations/*{.ts,.js}`)],
  migrationsTableName: 'migrations',
  logging: (process.env.DB_LOG ?? '') === 'true' ? true : false,
  synchronize: false,
};

export default new DataSource(
  process.env.NODE_ENV === 'production'
    ? {
        ...postgresOptions,
        ...baseOptions,
      }
    : {
        ...sqliteOptions,
        ...baseOptions,
      },
);
