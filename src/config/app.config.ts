import { registerAs } from '@nestjs/config';

export default registerAs('APP_CONFIG', () => ({
  accessTokenSecret: process.env.JWT_SECRET_ACCESS ?? 'secret_access',
  refreshTokenSecret: process.env.JWT_SECRET_REFRESH ?? 'secret_refresh',
}));
