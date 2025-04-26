import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema.alterTable('games').dropColumn('game_art').execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.alterTable('games').addColumn('game_art', 'uuid').execute();
}
