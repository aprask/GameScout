import { WishlistTable } from "../data/models/models.js";
import * as wishlistRepo from "../repository/wishlist.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";
import * as adminRepo from "../repository/admin.js";

export function getAllWishlists(): Promise<WishlistTable[]> {
    return wishlistRepo.getAllWishlists();
}

export async function getWishlistById(wishlist_id: string): Promise<WishlistTable> {
    if (!validate(wishlist_id)) throwErrorException(`[service.wishlist.getWishlistById] Invalid UUID: ${wishlist_id}`, 'Invalid wishlist ID', 400);
    return wishlistRepo.getWishlistById(wishlist_id);
}

export async function createWishlist(user_id: string, game_id: string, admin_id: string): Promise<WishlistTable> {
    if (!admin_id) {
        throwErrorException(`[service.wishlist.createWishlist] No valid ID provided`, 'Cannot create wishlist', 403);
    }

    if (!validate(admin_id)) {
        throwErrorException(`[service.wishlist.createWishlist] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
    }

    const admin = await adminRepo.getAdminById(admin_id);
    if (!admin) {
        throwErrorException(`[service.wishlist.createWishlist] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);
    }

    let errorMessage = '';
    if (!user_id) errorMessage += "User ID not given. ";
    if (!game_id) errorMessage += "Game ID not given. ";
    if (!validate(user_id)) errorMessage += "User ID is invalid. ";
    if (!validate(game_id)) errorMessage += "Game ID is invalid. ";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.wishlist.createWishlist] ${errorMessage}`, 'Cannot create wishlist', 400);
    }

    const currentDate = new Date();
    const newWishlist: WishlistTable = {
        wishlist_id: uuidv4(),
        user_id,
        game_id,
        created_at: currentDate,
        updated_at: currentDate
    };

    return wishlistRepo.createWishlist(newWishlist);
}

export async function updateWishlist(wishlist_id: string, user_id: string, game_id: string): Promise<WishlistTable> {
    let errorMessage = '';
    if (!wishlist_id) errorMessage += "Wishlist ID not given";
    if (!validate(wishlist_id)) errorMessage += "Wishlist ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.wishlist.updateWishlist] ${errorMessage}`, 'Cannot update wishlist', 400);
    }

    const currentWishlist = await wishlistRepo.getWishlistById(wishlist_id);
    const updatedWishlist: Omit<WishlistTable, 'wishlist_id' | 'created_at' | 'updated_at'> = {
        user_id: user_id ?? currentWishlist.user_id,
        game_id: game_id ?? currentWishlist.game_id
    };

    return wishlistRepo.updateWishlist(wishlist_id, updatedWishlist);
}

export async function deleteWishlist(wishlist_id: string, admin_id: string): Promise<void> {
    if (admin_id && wishlist_id) {
        if (!validate(admin_id)) throwErrorException(`[service.wishlist.deleteWishlist] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.wishlist.deleteWishlist] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);
        if (!validate(wishlist_id)) throwErrorException(`[service.wishlist.deleteWishlist] Invalid UUID: ${wishlist_id}`, 'Invalid wishlist ID', 400);
        else wishlistRepo.deleteWishlist(wishlist_id);
    }
    else throwErrorException(`[service.wishlist.deleteWishlist] No valid ID providded`, 'Cannot delete wishlist', 403);
}