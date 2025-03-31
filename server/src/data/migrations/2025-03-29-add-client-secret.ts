import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
    await db.schema
        .alterTable('user')
        .addColumn('client_secret', 'varchar(255)')
        .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
    await db.schema
        .alterTable('user')
        .dropColumn('client_secret')
        .execute();
}