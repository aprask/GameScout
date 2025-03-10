import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('follows')
        .addColumn('last_visit', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
    .alterTable('follows')
    .dropColumn('last_visit')
    .execute();
}
