'use server';
import { db } from '@/db/db'
import { UserTable } from '@/db/types';

export async function getAllUsers(): Promise<UserTable[]> {
    return await db
        .selectFrom('user')
        .selectAll()
        .execute()
}

export async function getUserById(id: string): Promise<UserTable> {
    return await db
        .selectFrom('user')
        .selectAll()
        .where('user_id', '=', id)
        .executeTakeFirstOrThrow();
}

export async function createUser(user: UserTable): Promise<UserTable> {
    const newUser = await db
        .insertInto('user')
        .values({
            user_id: user.user_id,
            email: user.email,
            google_id: user.google_id,
            is_active: user.is_active,
            last_login: user.last_login,
            created_at: user.created_at,
            updated_at: user.updated_at
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    return newUser;
}

export async function updateUser(last_login: Date, is_active: boolean, id: string): Promise<UserTable> {
    const updatedUser = await db
        .updateTable('user')
        .set({
            last_login: last_login,
            is_active: is_active,
            updated_at: new Date()
        })
        .where('user.user_id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();
    return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
    await db
        .deleteFrom('user')
        .where('user.user_id', '=', id)
        .executeTakeFirstOrThrow();
}