import { db } from "../data/db.js";
import { AdminTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllAdmins(): Promise<AdminTable[]> {
    const admins = await db
        .selectFrom("admin")
        .selectAll()
        .execute();
    if (admins === undefined) throwErrorException(`[repository.admin.getAllAdmins] cannot get admins`, 'Admins is undefined', 404);
    return admins;
}

export async function getAdminByUserId(user_id: string): Promise<AdminTable | undefined> {
    const admin = await db
        .selectFrom("admin")
        .selectAll()
        .where("admin.user_id", "=", user_id)
        .executeTakeFirst();
    if (!admin) return undefined;
    else return admin;
} 

export async function getAdminById(admin_id: string): Promise<AdminTable> {
    const admin = await db
        .selectFrom("admin")
        .selectAll()
        .where("admin_id", "=", admin_id)
        .executeTakeFirst();
    if (!admin || admin === undefined) throwErrorException(`[repository.admin.getAdminById] cannot find admin with ID ${admin_id}`, 'Admin not found', 404);
    return admin!;
}

export async function createAdmin(admin: AdminTable): Promise<AdminTable> {
    const newAdmin = await db
        .insertInto("admin")
        .values({
            admin_id: admin.admin_id,
            user_id: admin.user_id,
            admin_key: admin.admin_key,
            created_at: admin.created_at,
            updated_at: admin.updated_at,
        })
        .returningAll()
        .executeTakeFirst();
    if (!newAdmin || newAdmin === undefined) throwErrorException(`[repository.admin.createAdmin] cannot create admin`, 'Cannot create admin', 500);
    return newAdmin!;
}

export async function updateAdmin(admin_id: string, admin: Omit<AdminTable, 'user_id' | 'admin_id' | 'created_at' | 'updated_at'>): Promise<AdminTable> {
    const updatedAdmin = await db
        .updateTable("admin")
        .set({
            admin_key: admin.admin_key,
            updated_at: new Date()
        })
        .where("admin_id", "=", admin_id)
        .returningAll()
        .executeTakeFirst();
    if (!updatedAdmin || updatedAdmin === undefined) throwErrorException(`[repository.admin.updateAdmin] cannot update admin`, 'Cannot update admin', 500);
    return updatedAdmin!;
}

export async function deleteAdmin(admin_id: string): Promise<void> {
    await db
        .deleteFrom("admin")
        .where("admin_id", "=", admin_id)
        .executeTakeFirstOrThrow();
}