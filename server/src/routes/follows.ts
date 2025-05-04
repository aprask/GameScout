const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as followsService from '../service/follows.js';
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

router.use(authMiddleware as RequestHandler);

router.get('/', asyncHandler(async (req, res) => {
    const follows = await followsService.getAllFollows();
    res.status(200).json({ follows });
}));

router.get('/:follow_id', asyncHandler(async (req, res) => {
    const follow = await followsService.getFollowById(req.params.follow_id);
    res.status(200).json({ follow });
}));

router.get('/verify/:following_id/:follower_id', asyncHandler(async (req, res) => {
    const status = await followsService.verifyFollowStatus(req.params.following_id, req.params.follower_id);
    console.log(`Target User = ${req.params.following_id}`);
    console.log(`Follower = ${req.params.follower_id}`);
    console.log(`Status: ${status}`);
    if (status === undefined) res.status(200).json({status: false});
    res.status(200).json({status: true});
    
}));

router.get(`/user/followers/:userId`, asyncHandler(async (req, res) => {
    const followers = await followsService.getAllFollowersByUserId(req.params.userId);
    res.status(200).json({followers: followers});
}));

router.get(`/user/following/:userId`, asyncHandler(async (req, res) => {
    const following_users = await followsService.getAllFollowingUsersByUserId(req.params.userId);
    res.status(200).json({following_users: following_users});
}));

router.post('/', asyncHandler(async (req, res) => {
    const { user_id_following, user_id_follower, status } = req.body;
    const newFollow = await followsService.createFollow(user_id_following, user_id_follower, status);
    res.status(201).json({ new_follow: newFollow });
}));

router.put('/:follow_id', asyncHandler(async (req, res) => {
    const { user_id_following, user_id_follower, status, followed_time } = req.body;

    const updatedFollow = await followsService.updateFollow(
        req.params.follow_id,
        user_id_following,
        user_id_follower,
        status,
        new Date(followed_time)
    );

    res.status(200).json({ updated_follow: updatedFollow });
}));

router.delete('/following/:followingUserId/follower/:followerUserId', asyncHandler(async (req, res) => {
    const {followingUserId, followerUserId} = req.params;
    await followsService.deleteFollowByUserId(followerUserId, followingUserId);
    res.sendStatus(204);
}));

router.delete('/:follow_id', asyncHandler(async (req, res) => {
    const { follow_id } = req.params;

    let admin_id: string | null = null;
    let user_id: string | null = null;
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    if (typeof req.query.user_id === 'string') user_id = req.query.user_id;

    await followsService.deleteFollow(follow_id, user_id, admin_id);
    res.sendStatus(204);
}));


export default router;
