import { throwErrorException } from '../util/error.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';

export async function verifyJWT(token: string): Promise<boolean> {
    try {
        const public_key = await fs.readFile('./keys/public_key.pem', "utf-8");
        const authSegments = token.split(' ');
        if (authSegments.length !== 2 || authSegments[0] !== 'Bearer') {
            throwErrorException(`[server.src.utils.token.verifyJWT] token invalid`, 'Invalid Token', 401);
        }
        const parsedToken = authSegments[1];
        jwt.verify(parsedToken, public_key);
        return true;
    } catch (error: unknown) {
        throwErrorException(`[server.src.utils.token.verifyJWT] error verifying token`, (error as Error).message, 401);
    }
    return false;
}

export async function signJWT(email: string): Promise<string | undefined> {
    try {
        const private_key = await fs.readFile('./keys/private_key.pem', "utf-8");
        const token = jwt.sign({ email: email }, private_key, { expiresIn: '24h' })
        return token;
    } catch (error) {
        throwErrorException(`[server.src.utils.token.signJWT] error signing token`, (error as Error).message, 401);
    }
    return undefined;
}