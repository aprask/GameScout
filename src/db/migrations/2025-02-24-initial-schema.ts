import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  //User Table
  await db.schema
    .createTable('user')
    .addColumn('user_id', 'serial', (col) => col.primaryKey())
    .addColumn('google_id', 'varchar', (col) => col.notNull())
    .addColumn('email', 'varchar', (col) => col.notNull())
    .addColumn('username', 'varchar', (col) => col.notNull())
    .addColumn('hashed_password', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('last_login', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('is_active', 'boolean', (col) => col.notNull())
    .execute();
  //Game Review Table
  await db.schema
    .createTable('game_review')
    .addColumn('review_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('game_id', 'integer', (col) => col.notNull())
    .addColumn('rating', 'integer', (col) => col.notNull())
    .addColumn('review', 'varchar')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
  //Wishlist Table
  await db.schema
    .createTable('wishlist')
    .addColumn('wishlist_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('game_id', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
  //Profiel Table
  await db.schema
    .createTable('profile')
    .addColumn('profile_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('profile_pic', 'varchar') //need to figure out how to store image
    .addColumn('profile_name', 'varchar(24)', (col) => col.notNull())
    .execute();
  //Follower Table
  await db.schema
    .createTable('follows')
    .addColumn('follow_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id_following', 'integer', (col) =>
      col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('user_id_follower', 'integer', (col) =>
      col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
    )
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('followed_time', 'timestamp', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('game_review').execute();
  await db.schema.dropTable('wishlist').execute();
  await db.schema.dropTable('profile').execute();
  await db.schema.dropTable('follows').execute();
}
