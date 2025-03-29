import { AuthTable, ImageTable, ProfileTable, UserTable } from "../data/models/models.js";
import * as userRepo from '../repository/user.js';
import * as adminRepo from "../repository/admin.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from 'uuid';
import { signJWT } from '../auth/token.js';
import { hashPassword } from '../auth/password.js';

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
    const user_id = uuidv4();
    const token = await signJWT(email);
    if (token === undefined) throwErrorException(`[service.user.createUser] Invalid token parameters`, 'Cannot create token', 400);
    const hashedPassword = await hashPassword(password);
    if (hashedPassword === undefined) throwErrorException(`[service.user.createUser] Invalid password`, 'Cannot hash password', 400);
    const newUser: UserTable = {
        user_id: user_id,
        email: email,
        password: hashedPassword!,
        is_active: true,
        is_banned: false,
        last_login: currentDate,
        created_at: currentDate,
        updated_at: currentDate,
        client_secret: uuidv4()
    }
    const image_id = uuidv4();
    const newImage: ImageTable = {
        image_id: image_id,
        image_text: null,
        image_data: null,
        created_at: currentDate,
        updated_at: currentDate,
    }
    const newProfile: ProfileTable = {
        profile_id: uuidv4(),
        user_id: user_id,
        profile_img: image_id,
        profile_name: email,
        created_at: currentDate,
        updated_at: currentDate,
    }
    const authDetails: AuthTable = {
        auth_id: uuidv4(),
        user_id: user_id,
        token: token!,
        created_at: currentDate,
        updated_at: currentDate,
    }
    return userRepo.createUser(newUser, newProfile, authDetails, newImage);
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
    let hashedPassword: string | undefined = "";
    if (password) {
        hashedPassword = await hashPassword(password);
        if (hashedPassword === undefined) throwErrorException(`[service.user.createUser] Invalid password`, 'Cannot hash password', 400);
    }
    const updatedUser: Omit<UserTable, 'user_id' | 'created_at' | 'updated_at' | 'client_secret'> = {
        email: email ?? currentUser.email,
        password: hashedPassword ?? currentUser.password,
        is_active: is_active ?? currentUser.is_active,
        is_banned: is_banned ?? currentUser.is_banned,
        last_login: last_login ?? currentUser.last_login
    };
    return userRepo.updateUser(user_id, updatedUser);
}

export async function deleteUser(user_id: string | null, admin_id: string | null, client_secret: string | null): Promise<void> {
    if (admin_id) {
        if (!validate(admin_id)) throwErrorException(`[service.user.deleteUser] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.user.deleteUser] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);
        if (user_id && validate(user_id)) userRepo.deleteUser(user_id);
    }
    if (user_id && client_secret) {
        if (!validate(user_id) && !validate(client_secret)) throwErrorException(`[service.user.deleteUser] Invalid UUID: ${user_id}`, 'Invalid user ID/client secret', 400);
        if (!(await userRepo.getUserById(user_id))) throwErrorException(`[service.user.deleteUser] User ID invalid: ${user_id}`, 'User ID invalid', 400);
        if (!(await userRepo.getUserIdByClientSecret(client_secret, user_id))) throwErrorException(`[service.user.deleteUser] Cannot find user`, 'User ID/Secret invalid', 404);
        else userRepo.deleteUser(user_id);
    }
    else throwErrorException(`[service.user.deleteUser] No valid ID providded`, 'Cannot delete user', 403);
}