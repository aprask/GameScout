import { db } from "../data/db.js";
import { FollowsTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllFollows(): Promise<FollowsTable[]> {
    const follows = await db
        .selectFrom("follows")
        .selectAll()
        .execute();
    if (follows === undefined) throwErrorException(`[repository.follows.getAllFollows] cannot get follows`, 'Follows is undefined', 404);
    return follows;
}

export async function getFollowById(follow_id: string): Promise<FollowsTable> {
    const follow = await db
        .selectFrom("follows")
        .selectAll()
        .where("follow_id", "=", follow_id)
        .executeTakeFirst();
    if (!follow || follow === undefined) throwErrorException(`[repository.follows.getFollowById] cannot find follow with ID ${follow_id}`, 'Follow not found', 404);
    return follow!;
}

export async function createFollow(follow: FollowsTable): Promise<FollowsTable> {
    const newFollow = await db
        .insertInto("follows")
        .values({
            follow_id: follow.follow_id,
            user_id_following: follow.user_id_following,
            user_id_follower: follow.user_id_follower,
            status: follow.status,
            followed_time: follow.followed_time,
            created_at: follow.created_at,
            updated_at: follow.updated_at,
        })
        .returningAll()
        .executeTakeFirst();
    if (!newFollow || newFollow === undefined) throwErrorException(`[repository.follows.createFollow] cannot create follow`, 'Cannot create follow', 500);
    return newFollow!;
}

export async function updateFollow(follow_id: string, follow: Omit<FollowsTable, 'follow_id' | 'created_at' | 'updated_at'>): Promise<FollowsTable> {
    const updatedFollow = await db
        .updateTable("follows")
        .set({
            user_id_following: follow.user_id_following,
            user_id_follower: follow.user_id_follower,
            status: follow.status,
            followed_time: follow.followed_time,
            updated_at: new Date()
        })
        .where("follow_id", "=", follow_id)
        .returningAll()
        .executeTakeFirst();
    if (!updatedFollow || updatedFollow === undefined) throwErrorException(`[repository.follows.updateFollow] cannot update follow`, 'Cannot update follow', 500);
    return updatedFollow!;
}

export async function deleteFollow(follow_id: string): Promise<void> {
    await db
        .deleteFrom("follows")
        .where("follow_id", "=", follow_id)
        .executeTakeFirstOrThrow();
}