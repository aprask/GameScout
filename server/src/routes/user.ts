import express, { RequestHandler } from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as userService from "../service/user.js";
import { authMiddleware } from '../middleware/auth.js';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

router.use(authMiddleware as RequestHandler);

router.post('/', asyncHandler(async (req, res) => {
    console.log("Creating user");
    const { email, google_token, picture } = req.body;
    const newUser = await userService.createUser(email, google_token, picture);
    console.log(`Created user: ${newUser}`);
    res.status(201).json({new_user: newUser});
}));

router.get('/', asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({users: users});
}));

router.get('/:user_id', asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.user_id);
    res.status(200).json({user: user});
}));

router.put('/:user_id', asyncHandler(async (req, res) => {
    const { email, is_active, is_banned, last_login } = req.body;
    const updatedUser = await userService.updateUser(req.params.user_id, email, is_active, is_banned, new Date(last_login));
    res.status(200).json({updated_user: updatedUser});
}));

router.delete('/:user_id', asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    await userService.deleteUser(user_id);
    res.sendStatus(204);
}));

router.patch('/ban', asyncHandler(async (req, res) => {
    const ban_action: boolean = req.query.ban_action === 'true';
    const { email, admin_id } = req.body;
    if (ban_action === true) {
        await userService.banUserByEmail(email, admin_id);
        res.status(200).json({banned_user: email});
    }
    else {
        await userService.unbanUserByEmail(email, admin_id);
        res.status(200).json({unbanned_user: email});
    }
}));

export default router;