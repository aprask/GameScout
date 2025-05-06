import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema
    .alterTable('profile')
    .alterColumn('profile_name', (col) => col.setDataType('varchar(255)'))
    .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema
    .alterTable('profile')
    .alterColumn('profile_name', (col) => col.setDataType('varchar(24)'))
    .execute();
}
