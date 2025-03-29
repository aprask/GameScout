import { db } from "../data/db.js";
import { AuthTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getTokenByUserId(id: string): Promise<AuthTable> {
    const authDetails = await db
        .selectFrom('auth')
        .selectAll()
        .where('auth.user_id', '=', id)
        .executeTakeFirst();
    if (!authDetails || authDetails === undefined) throwErrorException(`[repository.auth.getTokenByUserId] token not found from user id ${id}`, 'Invalid credentials', 401);
    return authDetails!;
}

export async function saveToken(auth: AuthTable): Promise<AuthTable> {
    const authDetails = await db
        .insertInto('auth')
        .values({
            auth_id: auth.auth_id,
            user_id: auth.user_id,
            token: auth.token,
            created_at: auth.created_at,
            updated_at: auth.updated_at
        })
        .returningAll()
        .executeTakeFirst();
        if (!authDetails || authDetails === undefined) throwErrorException(`[repository.auth.saveToken] could not create token`, 'Cannot create token', 401);
        return authDetails!;
}

export async function deleteTokenByUserId(id: string): Promise<void> {
    await db
        .deleteFrom('auth')
        .where('auth.user_id', '=', id)
        .executeTakeFirstOrThrow();
}