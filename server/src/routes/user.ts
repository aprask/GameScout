import express, { RequestHandler } from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as userService from "../service/user.js";
import { authMiddleware } from '../middleware/auth.js';

router.use(authMiddleware as RequestHandler);

router.get('/', asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({users: users});
}));

router.get('/:user_id', asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.user_id);
    res.status(200).json({user: user});
}));

router.post('/', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const newUser = await userService.createUser(email, password);
    res.status(201).json({new_user: newUser});
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

export default router;