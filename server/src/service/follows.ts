import { FollowsTable, ProfileTable } from "../data/models/models.js";
import * as followsRepo from "../repository/follows.js";
import { throwErrorException } from "../util/error.js";
import * as adminRepo from '../repository/admin.js';
import { v4 as uuidv4, validate } from "uuid";

export function getAllFollows(): Promise<FollowsTable[]> {
    return followsRepo.getAllFollows();
}

export async function getFollowById(follow_id: string): Promise<FollowsTable> {
    if (!validate(follow_id)) throwErrorException(`[service.follows.getFollowById] Invalid UUID: ${follow_id}`, 'Invalid follow ID', 400);
    return followsRepo.getFollowById(follow_id);
}

export async function getAllFollowersByUserId(user_id: string): Promise<ProfileTable[]> {
    if (!validate(user_id)) throwErrorException(`[service.follows.getAllFollowersByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    return followsRepo.getFollowersByUserId(user_id);
}

export async function verifyFollowStatus(following_id: string, follower_id: string): Promise<FollowsTable | undefined> {
    if (!validate(following_id) || !validate(follower_id)) throwErrorException(`[service.follows.verifyFollowStatus] Invalid UUID`, 'Invalid following/follower ID', 400);
    return followsRepo.verifyFollowStatus(following_id, follower_id);
}

export async function getAllFollowingUsersByUserId(user_id: string): Promise<ProfileTable[]> {
    if (!validate(user_id)) throwErrorException(`[service.follows.getAllFollowingUsersByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    return followsRepo.getAllFollowingUsersByUserId(user_id);
}

export async function deleteFollowByUserId(user_id: string, following_user_id: string): Promise<void> {
    if (!validate(user_id) || !validate(following_user_id)) throwErrorException(`[service.follows.deleteFollowByUserId] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
    const status = await followsRepo.verifyFollowStatus(following_user_id, user_id);
    if (!status) throwErrorException(`[service.follows.deleteFollowByUserId] Non-existing relationship`, 'Following relationship does not exist', 404);
    return followsRepo.deleteFollowByUserId(user_id, following_user_id);
}

export async function createFollow(
    user_id_following: string,
    user_id_follower: string,
    status: string,
): Promise<FollowsTable> {
    let errorMessage = '';
    if (!user_id_following) errorMessage += "Following user ID not given";
    if (!user_id_follower) errorMessage += "Follower user ID not given";
    if (!validate(user_id_following)) errorMessage += "Following user ID is invalid";
    if (!validate(user_id_follower)) errorMessage += "Follower user ID is invalid";
    if (!status) errorMessage += "Follow status not given";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.follows.createFollow] ${errorMessage}`, 'Cannot create follow', 400);
    }

    const currentDate = new Date();
    const newFollow: FollowsTable = {
        follow_id: uuidv4(),
        user_id_following: user_id_following,
        user_id_follower: user_id_follower,
        status: status,
        followed_time: currentDate,
        created_at: currentDate,
        updated_at: currentDate
    };

    return followsRepo.createFollow(newFollow);
}

export async function updateFollow(
    follow_id: string,
    user_id_following: string,
    user_id_follower: string,
    status: string,
    followed_time: Date
): Promise<FollowsTable> {
    let errorMessage = '';
    if (!follow_id) errorMessage += "Follow ID not given";
    if (!validate(follow_id)) errorMessage += "Follow ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.follows.updateFollow] ${errorMessage}`, 'Cannot update follow', 400);
    }

    const currentFollow = await followsRepo.getFollowById(follow_id);
    const updatedFollow: Omit<FollowsTable, 'follow_id' | 'created_at' | 'updated_at'> = {
        user_id_following: user_id_following ?? currentFollow.user_id_following,
        user_id_follower: user_id_follower ?? currentFollow.user_id_follower,
        status: status ?? currentFollow.status,
        followed_time: followed_time ?? currentFollow.followed_time
    };

    return followsRepo.updateFollow(follow_id, updatedFollow);
}

export async function deleteFollow(follow_id: string, user_id: string | null, admin_id: string | null): Promise<void> {
    if ((admin_id || user_id) && follow_id) {
        if (admin_id) {
            if (!validate(admin_id)) throwErrorException(`[service.follows.deleteFollow] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
            if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.follows.deleteFollow] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);
        } else if (user_id) {
            if (!validate(user_id)) throwErrorException(`[service.follows.deleteFollow] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
        }

        if (!validate(follow_id)) throwErrorException(`[service.follows.deleteFollow] Invalid UUID: ${follow_id}`, 'Invalid follow ID', 400);
        else await followsRepo.deleteFollow(follow_id);
    }
    else throwErrorException(`[service.follows.deleteFollow] No valid ID provided`, 'Cannot delete follow', 403);
}

