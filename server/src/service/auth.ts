import { AuthTable } from "../data/models/models.js";
import * as authRepo from "../repository/auth.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";

export async function getTokenByUserId(user_id: string): Promise<AuthTable> {
    if (!validate(user_id)) throwErrorException(`[service.auth.getTokenByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    return authRepo.getTokenByUserId(user_id);
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
    return authRepo.deleteTokenByUserId(user_id);
}
