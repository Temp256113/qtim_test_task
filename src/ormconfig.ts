import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'node:path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT!, 10),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE_NAME,
  entities: ['/**/*.entity{.ts}'],
  migrations: ['migrations/*{.ts}'],
  synchronize: false,
});
