import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './types';

console.log(process.env.POSTGRES_PASSWORD);

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
