'use server';
import * as followsRepo from '@/app/api/core/repositories/followers'
import { FollowsTable, FollowerProfile } from '@/db/types';
import { v4 as uuidv4, validate } from 'uuid';

export async function createFollowingRelationship(following: string, follower: string, status: string): Promise<FollowsTable> {
    let errorMessage = '';
    if (!following) errorMessage += "Missing following ID";
    if (!follower) errorMessage += "Missing follower ID";
    if (!validate(follower) || !validate(following)) errorMessage += "Invalid UUID";
    if (!status) errorMessage += "Missing status";
    if (follower === following) errorMessage += "Following cannot be equal to follower";
    if (errorMessage) {
        errorMessage.trim();
        throw new Error(`message: ${errorMessage}\nstatus: 400`);
    }
    const followingStatus: FollowsTable = {
        follow_id: uuidv4(),
        user_id_following: following,
        user_id_follower: follower,
        status: status,
        followed_time: new Date()
    }
    return followsRepo.setFollowingStatus(followingStatus);
}

export async function getFollowers(id: string): Promise<FollowerProfile[]> {
    if(!validate(id)) throw new Error("Invalid UUID");
    return followsRepo.getFollowers(id);
}

export async function setFollowStatus(id: string, status: string): Promise<FollowsTable> {
    let errorMessage = '';
    if (!id) errorMessage += "Missing ID";
    if(!validate(id)) errorMessage += "Invalid UUID";
    if (!status) errorMessage += "Invalid status";
    if (errorMessage) {
        errorMessage.trim();
        throw new Error(`message: ${errorMessage}\nstatus: 400`);
    }
    return followsRepo.setStatus(id, status);
}

export async function getFollowingDetails(id: string): Promise<FollowsTable> {
    if(!validate(id)) throw new Error("Invalid UUID");
    return followsRepo.getFollowingDetails(id);
}

export async function deleteFollowingRelationship(id: string): Promise<void> {
    if(!validate(id)) throw new Error("Invalid UUID");
    followsRepo.deleteFollowingRelationship(id);
}