'use server';
import * as userRepo from '@/app/api/core/repositories/user'
import { UserTable } from '@/db/types';
import { v4 as uuidv4 } from 'uuid';

export async function getAllUsers(): Promise<UserTable[]> {
    return userRepo.getAllUsers();
}

export async function getUserById(id: string): Promise<UserTable> {
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
    const newUser: UserTable = {
        user_id: uuidv4(),
        email: email,
        google_id: google_id,
        created_at: currentTime,
        updated_at: currentTime,
        last_login: currentTime,
        is_active: true,
    }
    return userRepo.createUser(newUser);
}

export async function updateUser(last_login: Date, is_active: boolean, id: string): Promise<UserTable> {
    let errorMessage = '';
    if (!last_login) errorMessage += 'Missing last login date';
    if (is_active === undefined) errorMessage += 'Missing active status';
    if (errorMessage) {
        errorMessage.trim();
        throw new Error(`message: ${errorMessage}\nstatus: 400`);
    }
    return userRepo.updateUser(last_login, is_active, id);
}

export async function deleteUser(id: string): Promise<void> {
    return userRepo.deleteUser(id);
}