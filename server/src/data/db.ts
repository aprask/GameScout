import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Schema } from './models/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    database: process.env.POSTGRES_DB,
    host: process.env.DEV_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
    max: 10,
    idleTimeoutMillis: 30000, // how long a connection will stay idle in the pool
    connectionTimeoutMillis: 10000, // max time to wait for a new connection
    statement_timeout: 30000, // max time for any query statement to complete (subset of query)
    query_timeout: 30000, // max time to wait for query to complete (all query statements)
    keepAlive: true
  }),
});

export const db = new Kysely<Schema>({
  dialect,
});
