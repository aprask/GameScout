"use server";
import { db } from "@/db/db";
import { UserTable, ProfileTable } from "@/db/types";

export async function getAllUsers(): Promise<UserTable[]> {
  return await db.selectFrom("user").selectAll().execute();
}

export async function getUserById(id: string): Promise<UserTable> {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("user_id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function createUser(
  user: UserTable,
  profile: ProfileTable
): Promise<UserTable> {
  return await db.transaction().execute(async (t) => {
    const createdUser: UserTable = await t
      .insertInto("user")
      .values({
        user_id: user.user_id,
        email: user.email,
        google_id: user.google_id,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    await t
      .insertInto("profile")
      .values({
        profile_id: profile.profile_id,
        user_id: profile.user_id,
        profile_pic: profile.profile_pic,
        profile_name: profile.profile_name,
      })
      .executeTakeFirstOrThrow();
    return createdUser;
  });
}

export async function updateUser(
  last_login: Date,
  is_active: boolean,
  id: string
): Promise<UserTable> {
  const updatedUser = await db
    .updateTable("user")
    .set({
      last_login: last_login,
      is_active: is_active,
      updated_at: new Date(),
    })
    .where("user.user_id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  await db
    .deleteFrom("user")
    .where("user.user_id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function userExists(user_id: string): Promise<boolean> {
  const user = await db
    .selectFrom("user")
    .select("user_id")
    .where("user_id", "=", user_id)
    .executeTakeFirst();
  return !!user;
}
