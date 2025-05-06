import { db } from "../data/db.js";
import { AuthTable, UserTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

 export async function authenticateSession(sessionId: string): Promise<AuthTable | undefined> {
    const session = await db
        .selectFrom('auth')
        .selectAll()
        .where('session_id', '=', sessionId)
        .where('valid', '=', true)
        .executeTakeFirst();
    if (!session) return undefined;
    return session;
}

export async function getUserByGoogleID(googleId: string): Promise<UserTable | undefined> {
    const user = await db
        .selectFrom('user')
        .selectAll()
        .where('google_token', '=', googleId)
        .executeTakeFirst();
    if (!user) return undefined;
    return user;
}

export async function createSession(auth: AuthTable): Promise<AuthTable> {
    const session = await db
        .insertInto('auth')
        .values({
            auth_id: auth.auth_id,
            user_id: auth.user_id,
            session_id: auth.session_id,
            exp: auth.exp,
            valid: auth.valid,
            created_at: auth.created_at,
            updated_at: auth.updated_at
        })
        .returningAll()
        .executeTakeFirst();
    if (!session) throwErrorException(`[repository.auth.createSession] unable to create session`, 'Failed to create session', 500);
    return session;
}

export async function invalidateSession(user_id: string): Promise<AuthTable> {
    const session = await db
        .updateTable('auth')
        .set({
            valid: false
        })
        .where('auth.user_id', '=', user_id)
        .where('auth.valid', '=', true)
        .returningAll()
        .executeTakeFirst();
    if (!session) throwErrorException(`[repository.auth.invalidateSession] unable to invalidate session`, 'Failed to invalidate session', 500);
    return session;
}

export async function invalidateSessionBySessionId(session_id: string): Promise<AuthTable> {
    const session = await db
        .updateTable('auth')
        .set({
            valid: false
        })
        .where('auth.session_id', '=', session_id)
        .where('auth.valid', '=', true)
        .returningAll()
        .executeTakeFirst();
    if (!session) throwErrorException(`[repository.auth.invalidateSessionBySessionId] unable to invalidate session`, 'Failed to invalidate session', 500);
    return session;
}