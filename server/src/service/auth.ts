import { checkPassword } from "../auth/password.js";
import { AuthTable } from "../data/models/models.js";
import * as authRepo from "../repository/auth.js";
import * as userRepo from "../repository/user.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";
import * as adminRepo from "../repository/admin.js";


export async function getTokenByUserId(user_id: string): Promise<AuthTable> {
    if (!validate(user_id)) throwErrorException(`[service.auth.getTokenByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    return authRepo.getTokenByUserId(user_id);
}

export async function getTokenByEmail(email: string): Promise<AuthTable> {
    const user = await userRepo.getUserByEmail(email);
    return authRepo.getTokenByUserId(user.user_id);
}

export async function verifyEmailAndPasswordCombination(email: string, password: string): Promise<boolean> {
    if (email && password) {
        const user = await userRepo.getUserByEmail(email);
        if (await checkPassword(password, user.password)) return true;
        return false;
    }
    return false;
}

export async function saveToken(user_id: string, token: string): Promise<AuthTable> {
    let errorMessage = '';
    if (!user_id) errorMessage += "User ID not given";
    if (!token) errorMessage += "Token not provided";
    if (!validate(user_id)) errorMessage += "User ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.auth.saveToken] ${errorMessage}`, 'Cannot create token', 400);
    }

    const currentDate = new Date();
    const newAuth: AuthTable = {
        auth_id: uuidv4(),
        user_id,
        token,
        created_at: currentDate,
        updated_at: currentDate
    };

    return authRepo.saveToken(newAuth);
}

export async function deleteTokenByUserId(user_id: string, admin_id: string): Promise<void> {
    if (admin_id) {
        if (!validate(user_id)) throwErrorException(`[service.auth.deleteTokenByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
        if (!validate(admin_id)) throwErrorException(`[service.auth.deleteTokenByUserId] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.auth.deleteTokenByUserId] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);
        else authRepo.deleteTokenByUserId(user_id);
    }
    else throwErrorException(`[service.auth.deleteTokenByUserId] No valid ID providded`, 'Cannot delete token', 403);
}
