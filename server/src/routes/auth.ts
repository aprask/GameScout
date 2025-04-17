import express from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as authService from "../service/auth.js";
import * as profileService from "../service/profile.js";
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

router.get('/:user_id', asyncHandler(async(req, res) => {
    const authDetails = await authService.getTokenByUserId(req.params.user_id);
    res.status(200).json({token: authDetails.token});
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.verifyEmailAndPasswordCombination(email, password);
    if (!user) res.status(401).json({message: "Invalid Password and Email Combination"});
    else {
        const token = await authService.createToken(email);
        const profile = await profileService.getProfileByUserId(user.user_id);
        if (!profile || !token) res.status(401).json({message: "Cannot authenticate user"});
        res.status(200).json({
            token: token,
            user_id: user.user_id,
            profile_id: profile.profile_id
        });
    }
}));

router.post('/logout', asyncHandler(async (req, res) => {
    const { user_id } = req.body;
    await authService.deleteTokenByUserId(user_id);
    res.sendStatus(204);
}));

export default router;