import { resolve } from 'path';

export const getEnvPath = (dest: string, nodeEnv: string = ''): string => {
  const envName = nodeEnv ? `.env.${nodeEnv}` : '.env';

  return resolve(`${dest}/${envName}`);
};
