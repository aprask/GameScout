'use server';
import * as profileRepo from '@/app/api/core/repositories/profile'
import { ProfileTable } from '@/db/types';
import { validate } from 'uuid';

export async function getAllProfiles(): Promise<ProfileTable[]> {
    return profileRepo.getAllProfiles()
}

export async function getProfileById(id: string): Promise<ProfileTable> {
    if (!validate(id)) throw new Error("Invalid ID type");
    return profileRepo.getProfileById(id);
}

export async function updateProfile(id: string, profilePicture: string, profileName: string): Promise<ProfileTable> {
    let errorMessage = '';
    if (!validate(id)) errorMessage += "Invalid ID type";
    if (!profilePicture) errorMessage += "Missing profile picture";
    if (!profileName) errorMessage += "Missing profile name";
    if (errorMessage) {
        errorMessage.trim();
        throw new Error(`message: ${errorMessage}\nstatus: 400`);
    }
    return profileRepo.updateProfile(id, profilePicture, profileName);
}

export async function deleteProfile(id: string): Promise<void> {
    if (!validate(id)) throw new Error("Invalid ID type");
    return profileRepo.deleteProfile(id);
}