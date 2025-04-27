import { ProfileTable, UserTable } from '../data/models/models.js';
import * as userRepo from '../repository/user.js';
import * as adminRepo from '../repository/admin.js';
import { throwErrorException } from '../util/error.js';
import { v4 as uuidv4, validate } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

export function getAllUsers(): Promise<UserTable[]> {
  return userRepo.getAllUsers();
}

export async function getUserById(user_id: string): Promise<UserTable> {
  if (!validate(user_id)) throwErrorException(`[service.user.getUserById] Invalid UUID: ${user_id}`, 'Invalid user ID', 400);
  if (!(await userRepo.userExists(user_id))) throwErrorException(`[service.user.getUserById] user with id ${user_id} not found`, 'User not found', 404);
  return userRepo.getUserById(user_id);
}

export async function banUserByEmail(email: string, adminId: string): Promise<void> {
  let errorMessage = '';
  if (!email) errorMessage += 'Email not provided';
  if (!adminId) errorMessage += 'Admin ID not provided';
  if (!validate(adminId)) errorMessage += 'Admin ID is invalid';
  if (errorMessage) {
    errorMessage.trim();
    throwErrorException(`[service.user.banUserByEmail] ${errorMessage}`, 'Cannot ban user', 400);
  }
  const admin = adminRepo.getAdminById(adminId);
  if (!admin) throwErrorException(`[service.user.banUserByEmail] ${errorMessage}`, 'Cannot find admin', 404);
  await userRepo.banUserByEmail(email);
}

export async function unbanUserByEmail(email: string, adminId: string): Promise<void> {
  let errorMessage = '';
  if (!email) errorMessage += 'Email not provided';
  if (!adminId) errorMessage += 'Admin ID not provided';
  if (!validate(adminId)) errorMessage += 'Admin ID is invalid';
  if (errorMessage) {
    errorMessage.trim();
    throwErrorException(`[service.user.banUserByEmail] ${errorMessage}`, 'Cannot ban user', 400);
  }
  const admin = adminRepo.getAdminById(adminId);
  if (!admin) throwErrorException(`[service.user.banUserByEmail] ${errorMessage}`, 'Cannot find admin', 404);
  await userRepo.unbanUserByEmail(email);
}

export async function createUser(email: string, googleID: string, profilePicture: string): Promise<Omit<UserTable, 'google_token'>> {
    let errorMessage = '';
    if (!email) errorMessage += 'Email not given';
    if (!googleID) errorMessage += 'Google ID not given';
    if (!profilePicture) errorMessage += 'Profile picture not given';
    if (errorMessage) {
      errorMessage.trim();
      throwErrorException(`[service.user.createUser] ${errorMessage}`, 'Cannot create user', 400);
    }
    const currentDate = new Date();
    const user_id = uuidv4();
    const newUser: UserTable = {
      user_id: user_id,
      email: email,
      google_token: googleID,
      is_active: true,
      last_login: currentDate,
      created_at: currentDate,
      updated_at: currentDate,
      is_banned: false
    }
    const newProfile: ProfileTable = {
      profile_id: uuidv4(),
      user_id: user_id,
      profile_img: profilePicture,
      profile_name: email, // default (we can add change later)
      created_at: currentDate,
      updated_at: currentDate,
    };
    return userRepo.createUser(newUser, newProfile);
}

export async function updateUser(
  user_id: string,
  email: string,
  is_active: boolean,
  is_banned: boolean,
  last_login: Date,
): Promise<UserTable> {
  let errorMessage = '';
  if (!user_id) errorMessage += 'ID not given';
  if (!validate(user_id)) errorMessage += 'ID is invalid';
  if (!(await userRepo.userExists(user_id))) errorMessage += 'User does not exist';
  if (errorMessage) {
    errorMessage.trim();
    throwErrorException(`[service.user.updateUser] ${errorMessage}`, 'Cannot update tenant', 400);
  }
  const currentUser = await userRepo.getUserById(user_id);

  const updatedUser: Omit<UserTable, 'user_id' | 'created_at' | 'updated_at' | 'google_token'> = {
    email: email ?? currentUser.email,
    is_active: is_active ?? currentUser.is_active,
    is_banned: is_banned ?? currentUser.is_banned,
    last_login: last_login ?? currentUser.last_login,
  };
  return userRepo.updateUser(user_id, updatedUser);
}

export async function deleteUser(user_id: string): Promise<void> {
  if (!(await userRepo.getUserById(user_id))) throwErrorException(`[service.user.deleteUser] User ID invalid: ${user_id}`, 'User ID invalid', 400);
  else userRepo.deleteUser(user_id);
}
