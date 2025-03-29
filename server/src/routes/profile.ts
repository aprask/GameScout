import express from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as profileService from '../service/profile.js';

router.get('/', asyncHandler(async (req, res) => {
    const profiles = await profileService.getAllProfiles();
    res.status(200).json({ profiles });
}));

router.get('/:profile_id', asyncHandler(async (req, res) => {
    const profile = await profileService.getProfileById(req.params.profile_id);
    res.status(200).json({ profile });
}));

router.post('/', asyncHandler(async (req, res) => {
    const { user_id, profile_img, profile_name } = req.body;
    let admin_id: string = '';
    if (typeof req.query.admin_id === 'string') {
        admin_id = req.query.admin_id;
    }
    const newProfile = await profileService.createProfile(user_id, profile_img, profile_name, admin_id);
    res.status(201).json({ new_profile: newProfile });
}));

router.put('/:profile_id', asyncHandler(async (req, res) => {
    const { user_id, profile_img, profile_name } = req.body;
    const updatedProfile = await profileService.updateProfile(
        req.params.profile_id,
        user_id,
        profile_img,
        profile_name
    );
    res.status(200).json({ updated_profile: updatedProfile });
}));

router.delete('/:profile_id', asyncHandler(async (req, res) => {
    const { profile_id } = req.params;
    let admin_id: string = '';
    if (typeof req.query.admin_id === 'string') {
        admin_id = req.query.admin_id;
    }
    await profileService.deleteProfile(profile_id, admin_id);
    res.sendStatus(204);
}));

export default router;
