import { AdminTable } from "../data/models/models.js";
import * as adminRepo from "../repository/admin.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";
import dotenv from 'dotenv';

dotenv.config();

export function getAllAdmins(): Promise<AdminTable[]> {
    return adminRepo.getAllAdmins();
}

export async function getAdminById(admin_id: string): Promise<AdminTable> {
    if (!validate(admin_id)) throwErrorException(`[service.admin.getAdminById] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
    return adminRepo.getAdminById(admin_id);
}

export async function createAdmin(user_id: string, admin_key: string | null): Promise<AdminTable> {
    let errorMessage = '';
    if (!user_id) errorMessage += "User ID not given";
    if (!validate(user_id)) errorMessage += "User ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.admin.createAdmin] ${errorMessage}`, 'Cannot create admin', 400);
    }

    const currentDate = new Date();
    const newAdmin: AdminTable = {
        admin_id: uuidv4(),
        user_id,
        admin_key,
        created_at: currentDate,
        updated_at: currentDate
    };

    return adminRepo.createAdmin(newAdmin);
}

export async function updateAdmin(admin_id: string, admin_key: string | null): Promise<AdminTable> {
    let errorMessage = '';
    if (!admin_id) errorMessage += "Admin ID not given";
    if (!validate(admin_id)) errorMessage += "Admin ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.admin.updateAdmin] ${errorMessage}`, 'Cannot update admin', 400);
    }

    const currentAdmin = await adminRepo.getAdminById(admin_id);
    const updatedAdmin: Omit<AdminTable, 'user_id' | 'admin_id' | 'created_at' | 'updated_at'> = {
        admin_key: admin_key ?? currentAdmin.admin_key
    };

    return adminRepo.updateAdmin(admin_id, updatedAdmin);
}

export async function deleteAdmin(admin_id: string, admin_secret: string): Promise<void> {
    if (!validate(admin_id)) throwErrorException(`[service.admin.deleteAdmin] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
    if (admin_secret !== process.env.ADMIN_SECRET) throwErrorException(`[service.admin.deleteAdmin] Invalid Admin Secret`, 'Invalid admin secret', 403);
    return adminRepo.deleteAdmin(admin_id);
}
