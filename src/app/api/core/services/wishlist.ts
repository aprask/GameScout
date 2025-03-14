"use server";
import * as wishlistRepo from "@/app/api/core/repositories/wishlist";
import * as userRepo from "@/app/api/core/repositories/user";
import { WishlistTable } from "@/db/types";
import { v4 as uuidv4, validate } from "uuid";

export async function getAllWishlist(): Promise<WishlistTable[]> {
  return wishlistRepo.getAllWishlist();
}

export async function getWishlistByUserId(
  user_id: string
): Promise<WishlistTable[]> {
  if (!validate(user_id)) throw new Error("Invalid ID type");
  const userExists = await userRepo.userExists(user_id);
  if (!userExists) throw new Error("User does not exist");
  return wishlistRepo.getWishlistByUserId(user_id);
}

export async function getWishlistByGameId(
  id: number
): Promise<WishlistTable[]> {
  return wishlistRepo.getWishlistByGameId(id);
}

export async function getWishlistById(id: string): Promise<WishlistTable> {
  if (!validate(id)) throw new Error("Invalid ID type");
  return wishlistRepo.getWishlistById(id);
}

export async function createWishlist(
  user_id: string,
  game_id: number
): Promise<WishlistTable> {
  let errorMessage = "";
  if (!validate(user_id)) errorMessage += "Invalid user ID type";
  if (!game_id) errorMessage += "Missing game ID";
  const alreadyOnWishlist = await wishlistRepo.alreadyOnWishlist(
    user_id,
    game_id
  );
  if (alreadyOnWishlist)
    errorMessage += "User already has this game on wishlist";
  if (errorMessage) {
    errorMessage.trim();
    throw new Error(`message: ${errorMessage}\nstatus: 400`);
  }
  const wishlistId = uuidv4();
  const createdAt = new Date();
  const newWishlist: WishlistTable = {
    wishlist_id: wishlistId,
    user_id: user_id,
    game_id: game_id,
    created_at: createdAt,
  };
  return wishlistRepo.createWishlist(newWishlist);
}

export async function deleteGameFromWishlist(id: string): Promise<void> {
  if (!validate(id)) throw new Error("Invalid Wishlist ID type");
  return wishlistRepo.deleteGameFromWishlist(id);
}
