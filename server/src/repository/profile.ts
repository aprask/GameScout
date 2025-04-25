import { db } from "../data/db.js";
import { ProfileTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllProfiles(): Promise<ProfileTable[]> {
    const profiles = await db
        .selectFrom("profile")
        .selectAll()
        .execute();
    if (profiles === undefined) throwErrorException(`[repository.profile.getAllProfiles] cannot get profiles`, 'Profiles is undefined', 404);
    return profiles;
}

export async function getProfileByUserId(user_id: string): Promise<ProfileTable> {
    const profile = await db
        .selectFrom("profile")
        .selectAll()
        .where("profile.user_id", '=', user_id)
        .executeTakeFirst();
    if (!profile || profile === undefined) throwErrorException(`[repository.profile.getProfileById] cannot find profile with user ID ${user_id}`, 'Profile not found', 404);
    return profile;
}

export async function getProfileById(profile_id: string): Promise<ProfileTable> {
    const profile = await db
        .selectFrom("profile")
        .selectAll()
        .where("profile_id", "=", profile_id)
        .executeTakeFirst();
    if (!profile || profile === undefined) throwErrorException(`[repository.profile.getProfileById] cannot find profile with ID ${profile_id}`, 'Profile not found', 404);
    return profile!;
}

export async function createProfile(profile: ProfileTable): Promise<ProfileTable> {
    const newProfile = await db
        .insertInto("profile")
        .values({
            profile_id: profile.profile_id,
            user_id: profile.user_id,
            profile_img: profile.profile_img,
            banner_img: profile.banner_img,
            profile_name: profile.profile_name,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
        })
        .returningAll()
        .executeTakeFirst();
    if (!newProfile || newProfile === undefined) throwErrorException(`[repository.profile.createProfile] cannot create profile`, 'Cannot create profile', 500);
    return newProfile!;
}

export async function updateProfile(profile_id: string, profile: Omit<ProfileTable, 'profile_id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ProfileTable> {
    const updatedProfile = await db
        .updateTable("profile")
        .set({
            profile_img: profile.profile_img,
            profile_name: profile.profile_name,
            updated_at: new Date()
        })
        .where("profile_id", "=", profile_id)
        .returningAll()
        .executeTakeFirst();
    if (!updatedProfile || updatedProfile === undefined) throwErrorException(`[repository.profile.updateProfile] cannot update profile`, 'Cannot update profile', 500);
    return updatedProfile!;
}

export async function deleteProfile(profile_id: string): Promise<void> {
    await db
        .deleteFrom("profile")
        .where("profile_id", "=", profile_id)
        .executeTakeFirstOrThrow();
}
