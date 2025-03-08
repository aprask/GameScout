'use server';
import * as userRepo from '@/app/api/core/repositories/user'
import { ProfileTable, UserTable } from '@/db/types';
import { v4 as uuidv4, validate } from 'uuid';

export async function getAllUsers(): Promise<UserTable[]> {
    return userRepo.getAllUsers();
}

export async function getUserById(id: string): Promise<UserTable> {
    if (!validate(id)) throw new Error("Invalid ID type");
    return userRepo.getUserById(id);
}

export async function createUser(google_id: string, email: string): Promise<UserTable> {
    let errorMessage = '';
    if (!email) errorMessage += 'Missing email';
    if (!google_id) errorMessage += 'Missing google id';
    if (errorMessage) {
        errorMessage.trim();
        throw new Error(`message: ${errorMessage}\nstatus: 400`);
    }
    const currentTime = new Date();
    const userId = uuidv4();
    const newUser: UserTable = {
        user_id: userId,
        email: email,
        google_id: google_id,
        created_at: currentTime,
        updated_at: currentTime,
        last_login: currentTime,
        is_active: true,
    }
    const newProfile: ProfileTable = {
        profile_id: uuidv4(),
        user_id: userId,
        profile_pic: '',
        profile_name: email
    }
    return userRepo.createUser(newUser, newProfile);
}

export async function updateUser(last_login: Date, is_active: boolean, id: string): Promise<UserTable> {
    let errorMessage = '';
    if (!validate(id)) errorMessage += "Invalid ID type";
    if (!last_login) errorMessage += 'Missing last login date';
    if (is_active === undefined) errorMessage += 'Missing active status';
    if (errorMessage) {
        errorMessage.trim();
        throw new Error(`message: ${errorMessage}\nstatus: 400`);
    }
    return userRepo.updateUser(last_login, is_active, id);
}

export async function deleteUser(id: string): Promise<void> {
    if (!validate(id)) throw new Error("Invalid ID type");
    userRepo.deleteUser(id);
}