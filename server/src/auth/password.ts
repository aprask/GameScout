import bcrypt from 'bcrypt';
import { throwErrorException } from '../util/error.js';

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string | undefined> {
    if (password.length <= 0) throwErrorException(`[server.src.utils.password.hashPassword] password length is a value less than or equal to 0`, `Invalid Password Length`, 401);
    try {
        const generatedSalt = await bcrypt.genSalt(saltRounds, 'b');
        const generatedHash = await bcrypt.hash(password, generatedSalt);
        return generatedHash;
    } catch(error) {
        throwErrorException(`[server.src.utils.password.hashPassword] error`, (error as Error).message, 401);
        return undefined;
    }
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    if (password.length <= 0 || hashedPassword.length <= 0) throwErrorException(`[server.src.utils.password.hashPassword] password/hash length is a value less than or equal to 0`, `Invalid Password/Hash Length`, 401);
    try {
        const compareStatus = await bcrypt.compare(password, hashedPassword);
        return compareStatus;
    } catch (error) {
        throwErrorException(`[server.src.utils.password.checkPassword] error`, (error as Error).message, 401);
        return false;
    }
}