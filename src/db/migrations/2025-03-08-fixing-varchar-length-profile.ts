import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await sql`ALTER TABLE profile ALTER COLUMN profile_name TYPE VARCHAR(255)`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await sql`ALTER TABLE profile ALTER COLUMN profile_name TYPE VARCHAR(24)`.execute(db);
}
