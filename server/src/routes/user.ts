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
    const token = req.headers['authorization'];
    const { email, password } = req.body;
    const newUser = await userService.createUser(email, password, token!);
    console.log('Created user');
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
    const { email, password, is_active, is_banned, last_login } = req.body;
    const updatedUser = await userService.updateUser(req.params.user_id, email, password, is_active, is_banned, new Date(last_login));
    res.status(200).json({updated_user: updatedUser});
}));

router.delete('/:user_id', asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    let admin_id: string | null = null;
    let client_secret: string | null = null;
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    if (typeof req.query.client_secret === 'string') client_secret = req.query.client_secret;
    await userService.deleteUser(user_id, admin_id, client_secret);
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