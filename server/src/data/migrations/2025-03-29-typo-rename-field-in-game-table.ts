import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
    await db.schema
        .alterTable('games')
        .dropColumn('release_data')
        .addColumn('release_date', 'timestamp')
        .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
    await db.schema
        .alterTable('auth')
        .dropColumn('release_date')
        .addColumn('release_data', 'timestamp')
        .execute();
}