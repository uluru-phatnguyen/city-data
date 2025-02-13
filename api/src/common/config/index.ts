import { resolve } from 'path';

export default () => ({
  host: process.env.HOST ?? 'localhost',
  port: parseInt(process.env.PORT as string, 10) || 8686,
  logger: process.env.LOGGER ? process.env.LOGGER?.split(',') : false,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  database: {
    host: process.env.DB_HOST ?? '',
    port: parseInt(process.env.DB_PORT as string, 10) || 0,
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    name: process.env.DB_NAME ?? 'city-data',
    synchronize: process.env.DB_SYNC === 'true' ? false : true,
    ssl:
      (process.env.DB_SSL_CERT_BASE64 ?? '') !== ''
        ? {
            ca: Buffer.from(
              process.env.DB_SSL_CERT_BASE64 as string,
              'base64',
            ).toString('ascii'),
          }
        : (process.env.DB_SSL ?? '') === 'true',
    logging: (process.env.DB_LOG ?? '') === 'true',
    migrations: [process.cwd() + '/migrations/*.{ts,js}'],
    entities: [resolve(`${__dirname}/../../**/*.entity.{ts,js}`)],
    subscribers: [resolve(`${__dirname}/../../**/*.subscriber.{ts,js}`)],
    cli: {
      migrationsDir: './migrations',
    },
    chunk: parseInt(process.env.DB_CHUNK as string, 10) || 100,
  },
});
