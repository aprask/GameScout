import { ProfileTable } from "../data/models/models.js";
import * as profileRepo from "../repository/profile.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";

export function getAllProfiles(): Promise<ProfileTable[]> {
    return profileRepo.getAllProfiles();
}

export async function getProfileById(profile_id: string): Promise<ProfileTable> {
    if (!validate(profile_id)) throwErrorException(`[service.profile.getProfileById] Invalid UUID: ${profile_id}`, 'Invalid profile ID', 400);
    return profileRepo.getProfileById(profile_id);
}

export async function createProfile(user_id: string, profile_img: string, profile_name: string): Promise<ProfileTable> {
    let errorMessage = '';
    if (!user_id) errorMessage += "User ID not given";
    if (!validate(user_id)) errorMessage += "User ID is invalid";
    if (!profile_img) errorMessage += "Profile image not given";
    if (!profile_name) errorMessage += "Profile name not given";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.profile.createProfile] ${errorMessage}`, 'Cannot create profile', 400);
    }

    const currentDate = new Date();
    const newProfile: ProfileTable = {
        profile_id: uuidv4(),
        user_id,
        profile_img,
        profile_name,
        created_at: currentDate,
        updated_at: currentDate
    };

    return profileRepo.createProfile(newProfile);
}

export async function updateProfile(profile_id: string, user_id: string, profile_img: string, profile_name: string): Promise<ProfileTable> {
    let errorMessage = '';
    if (!profile_id) errorMessage += "Profile ID not given";
    if (!validate(profile_id)) errorMessage += "Profile ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.profile.updateProfile] ${errorMessage}`, 'Cannot update profile', 400);
    }

    const currentProfile = await profileRepo.getProfileById(profile_id);
    const updatedProfile: Omit<ProfileTable, 'profile_id' | 'created_at' | 'updated_at'> = {
        user_id: user_id ?? currentProfile.user_id,
        profile_img: profile_img ?? currentProfile.profile_img,
        profile_name: profile_name ?? currentProfile.profile_name
    };

    return profileRepo.updateProfile(profile_id, updatedProfile);
}

export async function deleteProfile(profile_id: string): Promise<void> {
    if (!validate(profile_id)) throwErrorException(`[service.profile.deleteProfile] Invalid UUID: ${profile_id}`, 'Invalid profile ID', 400);
    return profileRepo.deleteProfile(profile_id);
}
