import express from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as authService from "../service/auth.js";
import { verifyJWT } from '../auth/token.js';

router.get('/:user_id', asyncHandler(async(req, res) => {
    const authDetails = await authService.getTokenByUserId(req.params.user_id);
    res.status(200).json({token: authDetails.token});
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const emailAndPasswordMatch = await authService.verifyEmailAndPasswordCombination(email, password);
    if (!emailAndPasswordMatch) res.status(401).json({message: "Invalid Password and Email Combination"});
    else {
        const { token } = await authService.getTokenByEmail(email);
        const isTokenValid = await verifyJWT(token);
        if (isTokenValid) res.status(200).json({message: "Welcome to Gamescout!"});
        else res.sendStatus(401);
    }
}));

router.delete('/:user_id', asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    let admin_id: string = "";
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    await authService.deleteTokenByUserId(user_id, admin_id);
    res.sendStatus(204);
}));

export default router;