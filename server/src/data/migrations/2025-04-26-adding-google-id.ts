import { Kysely } from 'kysely';
import { Schema } from '../models/schema.js';

export async function up(db: Kysely<Schema>): Promise<void> {
    await db.schema.dropTable('admin').execute();
    await db.schema.dropTable('review').execute();
    await db.schema.dropTable('wishlist').execute();
    await db.schema.dropTable('games').execute();
    await db.schema.dropTable('profile').execute();
    await db.schema.dropTable('images').execute();
    await db.schema.dropTable('follows').execute();
    await db.schema.dropTable('article_comments').execute();
    await db.schema.dropTable('articles').execute();
    await db.schema.dropTable('auth').execute();    
    await db.schema.dropTable('user').execute();

    await db.schema
    .createTable('user')
    .ifNotExists()
    .addColumn('user_id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('google_token', 'text', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.notNull())
    .addColumn('last_login', 'timestamp', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) => col.notNull())
    .addColumn('is_banned', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();
    
    
    await db.schema
        .createTable('auth')
        .ifNotExists()
        .addColumn('auth_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) => col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('session_id', 'varchar(255)', (col) => col.notNull())
        .addColumn('exp', 'timestamp', (col) => col.notNull())
        .addColumn('valid', 'boolean', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();

        await db.schema
        .createTable('admin')
        .ifNotExists()
        .addColumn('admin_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) => 
                col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('admin_key', 'varchar(255)')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('images')
        .ifNotExists()
        .addColumn('image_id', 'uuid', (col) => col.primaryKey())
        .addColumn('image_text', 'text')
        .addColumn('image_data', 'bytea')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('games')
        .ifNotExists()
        .addColumn('game_id', 'uuid', (col) => col.primaryKey())
        .addColumn('game_name', 'varchar(255)', (col) => col.notNull())
        .addColumn('cover_id', 'varchar(64)')
        .addColumn('is_supported', 'boolean', (col) => col.notNull())
        .addColumn('summary', 'text', (col) => col.notNull())
        .addColumn('release_data', 'timestamp', (col) => col.notNull())
        .addColumn('age_rating', 'varchar(24)', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('review')
        .ifNotExists()
        .addColumn('review_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('game_id', 'uuid', (col) => 
            col.notNull().references('games.game_id'))
        .addColumn('rating', 'integer', (col) => col.notNull())
        .addColumn('review', 'text')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('wishlist')
        .ifNotExists()
        .addColumn('wishlist_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('game_id', 'uuid', (col) => 
            col.notNull().references('games.game_id'))
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('profile')
        .ifNotExists()
        .addColumn('profile_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('profile_img', 'text')
        .addColumn('profile_name', 'varchar(24)', (col) => col.notNull().unique())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('follows')
        .ifNotExists()
        .addColumn('follow_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id_following', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('user_id_follower', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('status', 'varchar', (col) => col.notNull())
        .addColumn('followed_time', 'timestamp', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('articles')
        .ifNotExists()
        .addColumn('article_id', 'uuid', (col) => col.primaryKey())
        .addColumn('article_title', 'varchar', (col) => col.notNull())
        .addColumn('article_owner', 'uuid', (col) => col.notNull().references('user.user_id').onUpdate('no action').onDelete('no action'))
        .addColumn('article_content', 'text')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute()
    await db.schema
        .createTable('article_comments')
        .ifNotExists()
        .addColumn('comment_id', 'uuid', (col) => col.primaryKey())
        .addColumn('comment_owner', 'uuid', (col) => col.notNull().references('user.user_id').onUpdate('no action').onDelete('no action'))
        .addColumn('commented_article', 'uuid', (col) => col.notNull().references('articles.article_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('comment_content', 'text', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();

}

export async function down(db: Kysely<Schema>): Promise<void> {
    await db.schema
        .createTable('user')
        .ifNotExists()
        .addColumn('user_id', 'uuid', (col) => col.primaryKey())
        .addColumn('email', 'varchar', (col) => col.notNull().unique())
        .addColumn('password', 'varchar(255)', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .addColumn('last_login', 'timestamp', (col) => col.notNull())
        .addColumn('is_active', 'boolean', (col) => col.notNull())
        .addColumn('is_banned', 'boolean', (col) => col.notNull().defaultTo(false))
        .execute();
    await db.schema
        .createTable('admin')
        .ifNotExists()
        .addColumn('admin_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) => 
                col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('admin_key', 'varchar(255)')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('images')
        .ifNotExists()
        .addColumn('image_id', 'uuid', (col) => col.primaryKey())
        .addColumn('image_text', 'text')
        .addColumn('image_data', 'bytea')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('games')
        .ifNotExists()
        .addColumn('game_id', 'uuid', (col) => col.primaryKey())
        .addColumn('game_name', 'varchar(255)', (col) => col.notNull())
        .addColumn('game_art', 'uuid', (col) => 
            col.notNull().references('images.image_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('is_supported', 'boolean', (col) => col.notNull())
        .addColumn('company', 'varchar(255)', (col) => col.notNull())
        .addColumn('summary', 'text', (col) => col.notNull())
        .addColumn('release_data', 'timestamp', (col) => col.notNull())
        .addColumn('age_rating', 'varchar(24)', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('review')
        .ifNotExists()
        .addColumn('review_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('game_id', 'uuid', (col) => 
            col.notNull().references('games.game_id'))
        .addColumn('rating', 'integer', (col) => col.notNull())
        .addColumn('review', 'text')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('wishlist')
        .ifNotExists()
        .addColumn('wishlist_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('game_id', 'uuid', (col) => 
            col.notNull().references('games.game_id'))
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('profile')
        .ifNotExists()
        .addColumn('profile_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('profile_img', 'uuid', (col) => 
            col.notNull().references('images.image_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('profile_name', 'varchar(24)', (col) => col.notNull().unique())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('follows')
        .ifNotExists()
        .addColumn('follow_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id_following', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('user_id_follower', 'uuid', (col) =>
            col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade')
        )
        .addColumn('status', 'varchar', (col) => col.notNull())
        .addColumn('followed_time', 'timestamp', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
    await db.schema
        .createTable('articles')
        .ifNotExists()
        .addColumn('article_id', 'uuid', (col) => col.primaryKey())
        .addColumn('article_title', 'varchar', (col) => col.notNull())
        .addColumn('article_owner', 'uuid', (col) => col.notNull().references('user.user_id').onUpdate('no action').onDelete('no action'))
        .addColumn('article_content', 'text')
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute()
    await db.schema
        .createTable('article_comments')
        .ifNotExists()
        .addColumn('comment_id', 'uuid', (col) => col.primaryKey())
        .addColumn('comment_owner', 'uuid', (col) => col.notNull().references('user.user_id').onUpdate('no action').onDelete('no action'))
        .addColumn('commented_article', 'uuid', (col) => col.notNull().references('articles.article_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('comment_content', 'text', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute()
    await db.schema
        .createTable('auth')
        .ifNotExists()
        .addColumn('auth_id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'uuid', (col) => col.notNull().references('user.user_id').onUpdate('cascade').onDelete('cascade'))
        .addColumn('token', 'varchar(255)', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.notNull())
        .execute();
}