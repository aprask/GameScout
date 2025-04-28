import { AuthTable, UserTable } from "../data/models/models.js";
import * as authRepo from "../repository/auth.js";
import * as userRepo from "../repository/user.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4 } from "uuid";

export async function findUserByGoogleID(googleId: string): Promise<UserTable | undefined> {
    return authRepo.getUserByGoogleID(googleId);
}

export async function createSession(email: string): Promise<AuthTable> {
    if (!email) throwErrorException(`[service.auth.createSessionId] Email invalid`, 'No email', 400);
    const user = await userRepo.getUserByEmail(email);
    if (!user) throwErrorException(`[service.auth.createSessionId] User not found`, 'No user with given email', 404);
    const sessionId = uuidv4();
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hrs
    const authDetails: AuthTable = {
        auth_id: uuidv4(),
        user_id: user.user_id,
        session_id: sessionId,
        exp: expirationDate,
        valid: true,
        created_at: currentDate,
        updated_at: currentDate
    }
    return authRepo.createSession(authDetails);
}

export async function deleteSession(userId: string): Promise<AuthTable> {
    if (!userId) throwErrorException(`[service.auth.createSessionId] User ID invalid`, 'No user ID', 400);
    const user = await userRepo.getUserById(userId);
    if (!user) throwErrorException(`[service.auth.createSessionId] User ID invalid`, 'No user with ID', 404);
    return authRepo.invalidateSession(userId);
}

export async function authenticateSession(sessionId: string): Promise<AuthTable | undefined> {
    if (!sessionId) throwErrorException(`[service.auth.authenticateSession] Session ID missing`, 'No session ID', 401);
    return authRepo.authenticateSession(sessionId);
}