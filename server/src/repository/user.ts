import { db } from "../data/db.js";
import { UserTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllUsers(): Promise<UserTable[]> {
    const users = await db
        .selectFrom("user")
        .selectAll()
        .execute();
    if (users === undefined) throwErrorException(`[repository.user.getAllUsers] cannot get users`, 'Users is undefined', 404);
    return users; 
  }
  
  export async function getUserById(id: string): Promise<UserTable> {
    const user = await db
      .selectFrom("user")
      .selectAll()
      .where("user_id", "=", id)
      .executeTakeFirst();
    if (!user || user === undefined) throwErrorException(`[repository.user.getUserById] cannot find user with ID ${id}`, 'Users not found', 404);
    return user!;
  }
  
  export async function createUser(user: UserTable): Promise<UserTable> {
    const newUser = await db
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
      })
      .returningAll()
      .executeTakeFirst();
      if (!newUser || newUser === undefined) throwErrorException(`[repository.user.createUser] cannot create user`, 'Cannot create user', 500);
      return newUser!; 
  }
  
  export async function updateUser(id: string, user: Omit<UserTable, 'user_id' | 'created_at' | 'updated_at'>): Promise<UserTable> {
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
  