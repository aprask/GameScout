import { db } from "../data/db.js";
import { AuthTable, ImageTable, ProfileTable, UserTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllUsers(): Promise<UserTable[]> {
    const users = await db
        .selectFrom("user")
        .selectAll()
        .execute();
    if (users === undefined) throwErrorException(`[repository.user.getAllUsers] cannot get users`, 'Users is undefined', 404);
    return users; 
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

  export async function getUserIdByClientSecret(secret: string, user_id: string): Promise<boolean> {
    const userId = await db
      .selectFrom('user')
      .select(['user_id'])
      .where('client_secret', '=', secret)
      .where('user_id', '=', user_id)
      .executeTakeFirst();
    if (!userId) return false;
    return true;
  }
  
  export async function createUser(user: UserTable, profile: ProfileTable, auth: AuthTable, image: ImageTable): Promise<UserTable> {
    return await db.transaction().execute(async (t) => {
      const newUser = await t
      .insertInto("user")
      .values({
        user_id: user.user_id,
        email: user.email,
        password: user.password,
        is_active: user.is_active,
        is_banned: user.is_banned,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
        client_secret: user.client_secret
      })
      .returningAll()
      .executeTakeFirst();
      if (!newUser || newUser === undefined) throwErrorException(`[repository.user.createUser] cannot create user`, 'Cannot create user', 500);
      
      const newImage = await db
        .insertInto("images")
        .values({
          image_id: image.image_id,
          image_text: image.image_text,
          image_data: image.image_data,
          created_at: image.created_at,
          updated_at: image.updated_at,
        })
        .returningAll()
        .executeTakeFirst();
      if (!newImage || newImage === undefined) throwErrorException(`[repository.user.createUser] cannot create image`, 'Cannot create image', 500);

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

      const authDetails = await t
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
        if (!authDetails || authDetails === undefined) throwErrorException(`[repository.user.createUser] could not create token`, 'Cannot create token', 401);
        return newUser!;
    });
  }
  
  export async function updateUser(id: string, user: Omit<UserTable, 'user_id' | 'created_at' | 'updated_at' | 'client_secret'>): Promise<UserTable> {
    const updatedUser = await db
      .updateTable("user")
      .set({
        email: user.email,
        password: user.password,
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