import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
    await db.schema
        .alterTable('auth')
        .dropColumn('token')
        .addColumn('token', 'text')
        .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
    await db.schema
        .alterTable('auth')
        .dropColumn('token')
        .addColumn('token', 'varchar(255)')
        .execute();
}