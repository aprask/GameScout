import { checkPassword } from "../auth/password.js";
import { AuthTable } from "../data/models/models.js";
import * as authRepo from "../repository/auth.js";
import * as userRepo from "../repository/user.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";
import { UserTable } from "../data/models/models.js";
import { signJWT } from "../auth/token.js";

export function createToken(email: string): Promise<string | undefined> {
    if (!email) throwErrorException(`[service.auth.createToken] Invalid Email}`, 'Invalid email', 400);
    return signJWT(email);
}

export async function getTokenByUserId(user_id: string): Promise<AuthTable> {
    if (!validate(user_id)) throwErrorException(`[service.auth.getTokenByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    return authRepo.getTokenByUserId(user_id);
}

export async function getTokenByEmail(email: string): Promise<AuthTable> {
    const user = await userRepo.getUserByEmail(email);
    return authRepo.getTokenByUserId(user.user_id);
}

export async function verifyEmailAndPasswordCombination(email: string, password: string): Promise<UserTable | undefined> {
    if (email && password) {
        const user = await userRepo.getUserByEmail(email);
        if (await checkPassword(password, user.password)) return user;
        return undefined;
    }
    return undefined;
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

export async function deleteTokenByUserId(user_id: string): Promise<void> {
    if (!validate(user_id)) throwErrorException(`[service.auth.deleteTokenByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    else authRepo.deleteTokenByUserId(user_id);
}
