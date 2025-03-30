/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from '../auth/token.js';
import dotenv from 'dotenv';

dotenv.config();

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    if (process.env.APP_ENV === 'test') next();
    else {
        try {
            const token = req.headers['authorization'];
            if (!token) return res.status(400).json({ error: 'Missing Authorization header' });
            const isTokenValid = await verifyJWT(token);
            if (!isTokenValid) return res.status(401).json({ error: 'Invalid token' });
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Cannot authenticate user' });
        }
    }
}