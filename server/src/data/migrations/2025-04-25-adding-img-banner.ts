import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
  await db.schema.alterTable('profile').addColumn('banner_img', 'text').execute();
  await db.schema.alterTable('profile').dropColumn('profile_img').execute();
  await db.schema.alterTable('profile').addColumn('profile_img', 'text').execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.alterTable('profile').dropColumn('banner_img').execute();
  await db.schema.alterTable('profile').dropColumn('profile_img').execute();
  await db.schema.alterTable('profile').addColumn('profile_img', 'uuid', (col) => 
    col.notNull().references('images.image_id').onUpdate('cascade').onDelete('cascade'))

}