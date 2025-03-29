import { UserTable } from "../data/models/models.js";
import * as userRepo from '../repository/user.js';
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from 'uuid';

export function getAllUsers(): Promise<UserTable[]> {
    return userRepo.getAllUsers();
}

export async function getUserById(user_id: string): Promise<UserTable> {
    if (!validate(user_id)) throwErrorException(`[service.user.getUserById] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    if (!(await userRepo.userExists(user_id))) throwErrorException(`[service.user.getUserById] user with id ${user_id} not found`, 'User not found', 404);
    return userRepo.getUserById(user_id);
}

export async function createUser(email: string, password: string): Promise<UserTable> {
    let errorMessage = '';
    if (!email) errorMessage += "Email not given";
    if (!password) errorMessage += "Password not given";
    if (await userRepo.checkUserEmail(email)) errorMessage += "Duplicate email";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.user.createUser] ${errorMessage}`, 'Cannot create user', 400);
    }
    const currentDate = new Date();
    const newUser: UserTable = {
        user_id: uuidv4(),
        email: email,
        password: password,
        is_active: true,
        is_banned: false,
        last_login: currentDate,
        created_at: currentDate,
        updated_at: currentDate
    }
    return userRepo.createUser(newUser);
}

export async function updateUser(user_id: string, email: string, password: string, is_active: boolean, is_banned: boolean, last_login: Date): Promise<UserTable> {
    let errorMessage = '';
    if (!user_id) errorMessage += "ID not given";
    if (!validate(user_id)) errorMessage += "ID is invalid";
    if (!(await userRepo.userExists(user_id))) errorMessage += "User does not exist";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.user.updateUser] ${errorMessage}`, 'Cannot update tenant', 400);
    }
    const currentUser = await userRepo.getUserById(user_id);
    const updatedUser: Omit<UserTable, 'user_id' | 'created_at' | 'updated_at'> = {
        email: email ?? currentUser.email,
        password: password ?? currentUser.password,
        is_active: is_active ?? currentUser.is_active,
        is_banned: is_banned ?? currentUser.is_banned,
        last_login: last_login ?? currentUser.last_login
    };
    return userRepo.updateUser(user_id, updatedUser);
}

export async function deleteUser(user_id: string): Promise<void> {
    if (!validate(user_id)) throwErrorException(`[service.user.getUserById] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    if (!(await userRepo.userExists(user_id))) throwErrorException(`[service.user.deleteUser] user with id ${user_id} not found`, 'User not found', 404);
    return userRepo.deleteUser(user_id);
}