import pg from 'pg'
import {Kysely, PostgresDialect} from 'kysely'
import { Schema } from './models/schema.js'
import dotenv from 'dotenv';

dotenv.config();

const dialect = new PostgresDialect({
    pool: new pg.Pool({
        database: process.env.POSTGRES_DB,
        host: process.env.DEV_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
        max: 10
    })
});

export const db = new Kysely<Schema>({
    dialect
})