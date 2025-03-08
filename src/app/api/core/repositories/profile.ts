'use server';
import { db } from '@/db/db'
import { ProfileTable } from '@/db/types';

export async function getAllProfiles(): Promise<ProfileTable[]> {
    return await db
        .selectFrom('profile')
        .selectAll()
        .execute();
}

export async function getProfileById(id: string): Promise<ProfileTable> {
    return await db
        .selectFrom('profile')
        .selectAll()
        .where('profile.profile_id', '=', id)
        .executeTakeFirstOrThrow();
}

export async function updateProfile(id: string, profilePicture: string, profileName: string): Promise<ProfileTable> {
    const updatedProfile = await db
        .updateTable('profile')
        .set({
            profile_pic: profilePicture,
            profile_name: profileName
        })
        .where('profile.profile_id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();
    return updatedProfile;
}

export async function deleteProfile(id: string): Promise<void> {
    await db
        .deleteFrom('profile')
        .where('profile.profile_id', '=', id)
        .executeTakeFirstOrThrow();
}