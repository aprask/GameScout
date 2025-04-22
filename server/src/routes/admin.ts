const router = express.Router();
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from "uuid";
import * as adminService from "../service/admin.js";
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

router.use(authMiddleware as RequestHandler);

router.get('/', asyncHandler(async (req, res) => {
    const admins = await adminService.getAllAdmins();
    res.status(200).json({admins: admins});
}));

router.get('/:user_id', asyncHandler(async (req, res) => {
    const admin = await adminService.getAdminByUserId(req.params.user_id);
    if (admin === undefined) res.status(200).json({isAdmin: false});
    else res.status(200).json({isAdmin: true, admin_id: admin.admin_id});
}));

router.get('/:admin_id', asyncHandler (async (req, res) => {
    const admin = await adminService.getAdminById(req.params.admin_id);
    res.status(200).json({admin: admin});
}));

router.post('/', asyncHandler (async(req, res) => {
    const { user_id } = req.body;
    const newAdmin = await adminService.createAdmin(user_id, uuidv4());
    res.status(201).json({new_admin: newAdmin});
}));

router.put('/:admin_id', asyncHandler(async (req, res) => {
    const { admin_key } = req.body;
    const updatedAdmin = await adminService.updateAdmin(req.params.admin_id, admin_key);
    res.status(200).json({updated_admin: updatedAdmin});
}));


router.delete('/:admin_id', asyncHandler(async (req, res) => {
    const { admin_id } = req.params;
    let admin_secret: string = "";
    if (typeof req.query.admin_secret === 'string') admin_secret = req.query.admin_secret;
    await adminService.deleteAdmin(admin_id, admin_secret);
    res.sendStatus(204);
}));

export default router;