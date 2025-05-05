import express, { RequestHandler } from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as authService from "../service/auth.js";
import * as profileService from "../service/profile.js";
import * as adminService from "../service/admin.js";
import { resourceSharer } from '../middleware/resource.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import axios from 'axios';
import * as userService from "../service/user.js";
import { authMiddleware } from '../middleware/auth.js';

dotenv.config();

router.use(resourceSharer);
router.use(authMiddleware as RequestHandler);

const redirectUrl = process.env.APP_ENV === "production" // in gcp console
  ? 'https://gamescout.xyz/oauth/callback'
  : 'http://localhost:5173/oauth/callback';


router.post('/google-auth', asyncHandler(async (req, res) => {
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID, 
        process.env.CLIENT_SECRET, 
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'openid'
        ],
        prompt: 'consent',
    });

    res.status(200).json({ url: authorizeUrl });
}));

async function getUserData(access_token: string) {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return response.data;
}

router.get('/oauth', asyncHandler(async (req, res) => {
    console.log('HIT /oauth endpoint');
    const code = req.query.code as string;

    if (!code) {
        res.status(400).json({ error: 'Missing code parameter' });;
    }

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID, 
            process.env.CLIENT_SECRET, 
            redirectUrl
        );

        const tokenResponse = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokenResponse.tokens);

        const accessToken = tokenResponse.tokens.access_token;

        if (!accessToken) {
            res.status(400).json({ error: 'Failed to retrieve access token' });
        } else {
            const userData = await getUserData(accessToken);
            const user = await authService.findUserByGoogleID(userData.sub);
            if (user === undefined) {
                console.log("Creating user");
                console.log(userData.email)
                console.log(userData.sub)
                console.log(userData.picture)
                const newUser = await userService.createUser(userData.email, userData.sub, userData.picture);
                const { session_id } = await authService.createSession(newUser.email);
                res.cookie('session_token', session_id, {
                    httpOnly: true,
                    secure: process.env.APP_ENV === 'production',
                    sameSite: process.env.APP_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    path: '/',
                });
            } else {
                const { session_id } = await authService.createSession(user.email);
                res.cookie('session_token', session_id, {
                    httpOnly: true,
                    secure: process.env.APP_ENV === 'production',
                    sameSite: process.env.APP_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    path: '/',
                });
            }
            res.status(200).json({ message: 'Login complete' });
        }

    } catch (err) {
        if (err === 'invalid_grant') {
            console.warn('OAuth Warning: invalid_grant received (token likely already used or expired). Suppressing log.');
            res.status(400).json({ error: 'Invalid or expired authorization code.' });
        } else {
            console.error('OAuth Error:', err);
            res.status(500).json({ error: 'OAuth authentication failed.' });
        }
    }
}));

router.post('/logout', asyncHandler(async (req, res) => {
    const sessionId = req.cookies?.session_token;
    const userId = req.body.session_user_id;

    try {
        if (userId) {
            await authService.deleteSession(userId);
        } else if (sessionId) {
            await authService.deleteSessionBySessionId(sessionId);
        }
    } catch (err) {
        console.warn(`Logout warning: failed to delete session, possibly already invalid: ${err}`);
    }

    res.clearCookie('session_token', {
        httpOnly: true,
        secure: process.env.APP_ENV === 'production',
        sameSite: process.env.APP_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    });

    res.sendStatus(204);
}));

router.get('/me', asyncHandler(async (req, res) => {
    console.log("inside route 'me'");
    const { session_user_id } = req.body;

    if (!session_user_id) res.status(401).json({ error: 'Not authenticated' });

    const user = await userService.getUserById(session_user_id);
    const profile = await profileService.getProfileByUserId(session_user_id);
    const admin = await adminService.getAdminByUserId(session_user_id);
    let isAdmin = false;
    let adminId = '';
    if (admin) {
        isAdmin = true;
        adminId = admin.admin_id;
    }

    if (!user) res.status(404).json({ error: 'User not found' });

    res.status(200).json({
        email: user.email,
        picture: profile.profile_img,
        username: profile.profile_name,
        profile_id: profile.profile_id,
        user_id: user.user_id,
        is_admin: isAdmin,
        admin_id: adminId
    });
}));

export default router;