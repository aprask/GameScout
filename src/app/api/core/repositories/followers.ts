'use server';
import { db } from '@/db/db'
import { FollowsTable, FollowerProfile } from '@/db/types';

export async function setFollowingStatus(follow: FollowsTable): Promise<FollowsTable> {
    return await db.transaction().execute(async (t) => {
        const followingRelationship: FollowsTable = await t
            .insertInto('follows')
            .values({
                follow_id: follow.follow_id,
                user_id_following: follow.user_id_following,
                user_id_follower: follow.user_id_follower,
                status: follow.status,
                followed_time: follow.followed_time,
                last_visit: new Date()
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        return followingRelationship;
    });
}

export async function getFollowers(id: string): Promise<FollowerProfile[]> {
    const followers = await db
        .selectFrom('profile')
        .innerJoin('follows', 'follows.user_id_follower', 'profile.user_id')
        .where('follows.user_id_following', '=', id)
        .select(['profile.profile_name', 'profile.profile_pic', 'profile.profile_id'])
        .execute();
    return followers;
}

export async function setStatus(id: string, status: string): Promise<FollowsTable> {
    const followRelationship = await db
        .updateTable('follows')
        .set({
            status: status
        })
        .where('follows.follow_id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();
    return followRelationship;
}

export async function getFollowingDetails(id: string): Promise<FollowsTable> {
    const followingDetails = await db
        .selectFrom('follows')
        .selectAll()
        .where('follows.follow_id', '=', id)
        .executeTakeFirstOrThrow();
    return followingDetails;
}

export async function deleteFollowingRelationship(id: string): Promise<void> {
    await db
        .deleteFrom('follows')
        .where('follows.follow_id', '=', id)
        .executeTakeFirstOrThrow();
} 