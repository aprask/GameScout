import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as authService from "../service/auth.js";

dotenv.config();

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    const publicPaths = [
        '/google-auth',
        '/oauth',
        '/login',
        '/signup'
    ];

    if (publicPaths.includes(req.path)) {
        console.log('Skipping auth for public path:', req.path);
        next();
        return;
    }

    if (process.env.APP_ENV === 'test') {
        next();
        return;
    }

    const authHeader = req.headers['authorization'];
    if (authHeader === process.env.API_MANAGEMENT_KEY) {
        next();
        return;
    }

    const sessionCookie = req.cookies?.session_token;
    console.log(`Cookie: ${sessionCookie}`);

    if (!sessionCookie) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    const authStatus = await authService.authenticateSession(sessionCookie);

    if (authStatus === undefined) return res.status(401).json({ error: 'Session invalid or expired' });

    req.body.session_user_id = authStatus.user_id;

    next();
}
