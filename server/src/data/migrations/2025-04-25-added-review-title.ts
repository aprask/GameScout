import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema
    .alterTable('review')
    .addColumn('review_title', 'varchar(64)', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.alterTable('review').dropColumn('review_title').execute();
}
