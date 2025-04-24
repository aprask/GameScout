import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema.alterTable('games').addColumn('cover_id', 'varchar(64)').execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.alterTable('games').dropColumn('cover_id').execute();
}
