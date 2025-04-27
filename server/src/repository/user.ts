import { db } from "../data/db.js";
import { ProfileTable, UserTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllUsers(): Promise<UserTable[]> {
  const users = await db
      .selectFrom("user")
      .selectAll()
      .execute();
  if (users === undefined) throwErrorException(`[repository.user.getAllUsers] cannot get users`, 'Users is undefined', 404);
  return users; 
}

export async function banUserByEmail(email: string): Promise<void> {
  await db
    .updateTable('user')
    .set({
      is_banned: true
    })
    .where("email", "=", email)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function unbanUserByEmail(email: string): Promise<void> {
  await db
  .updateTable('user')
  .set({
    is_banned: false
  })
  .where("email", "=", email)
  .returningAll()
  .executeTakeFirstOrThrow();
}

export async function getUserByEmail(email: string): Promise<UserTable> {
  const user = await db
    .selectFrom('user')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();
  if (!user) throwErrorException(`[repository.user.getUserByEmail] cannot get user`, 'Cannot find user from email', 404);
  return user!;
}

export async function getUserById(id: string): Promise<UserTable> {
  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("user_id", "=", id)
    .executeTakeFirst();
  if (!user || user === undefined) throwErrorException(`[repository.user.getUserById] cannot find user with ID ${id}`, 'User not found', 404);
  return user!;
}

export async function createUser(user: UserTable, profile: ProfileTable): Promise<UserTable> {
  console.log("HERE");
  return await db.transaction().execute(async (t) => {
    const newUser = await t
    .insertInto("user")
    .values({
      user_id: user.user_id,
      email: user.email,
      google_token: user.google_token,
      is_active: user.is_active,
      is_banned: user.is_banned,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })
    .returningAll()
    .executeTakeFirst();
    if (!newUser || newUser === undefined) throwErrorException(`[repository.user.createUser] cannot create user`, 'Cannot create user', 500);
  
    const newProfile = await t
      .insertInto('profile')
      .values({
        profile_id: profile.profile_id,
        user_id: profile.user_id,
        profile_img: profile.profile_img,
        profile_name: profile.profile_name,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      })
      .returningAll()
      .executeTakeFirst();
    if (!newProfile || newProfile === undefined) throwErrorException(`[repository.user.createUser] cannot create profile`, 'Cannot create profile', 500);

      return newUser!;
  });
}

export async function updateUser(id: string, user: Omit<UserTable, 'user_id' | 'created_at' | 'updated_at' | 'google_token' | 'email'>): Promise<UserTable> {
  const updatedUser = await db
    .updateTable("user")
    .set({
      last_login: user.last_login,
      is_active: user.is_active,
      is_banned: user.is_banned,
      updated_at: new Date()
    })
    .where("user_id", "=", id)
    .returningAll()
    .executeTakeFirst();
  if (!updatedUser || updatedUser === undefined) throwErrorException(`[repository.user.createUser] cannot update user`, 'Cannot update user', 500);
  return updatedUser!;
}

export async function deleteUser(id: string): Promise<void> {
  await db
      .deleteFrom("user")
      .where("user_id", "=", id)
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

export async function checkUserEmail(email: string): Promise<boolean> {
  const user = await db
      .selectFrom('user')
      .selectAll()
      .where('user.email', '=', email)
      .executeTakeFirst();
  return !!user;
}