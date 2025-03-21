import { registerAs } from '@nestjs/config';

export default registerAs('REDIS_CONFIG', () => ({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
}));
