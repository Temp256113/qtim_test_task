import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigType } from '@nestjs/config';
import redisConfig from '../config/redis.config';

export const redisClient: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (config: ConfigType<typeof redisConfig>) => {
    const redisInstance = new Redis({
      host: config.host ?? 'localhost',
      port: config.port ?? 6379,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [redisConfig.KEY],
};
