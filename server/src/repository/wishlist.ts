import { db } from '../data/db.js';
import { WishlistTable } from '../data/models/models.js';
import { throwErrorException } from '../util/error.js';

export async function getAllWishlists(): Promise<WishlistTable[]> {
  const wishlists = await db.selectFrom('wishlist').selectAll().execute();
  if (wishlists === undefined) throwErrorException(`[repository.wishlist.getAllWishlists] cannot get wishlists`, 'Wishlists is undefined', 404);
  return wishlists;
}

export async function getWishListsByUserId(user_id: string): Promise<WishlistTable[]> {
  const wishlists = await db.selectFrom('wishlist').selectAll().where('user_id', '=', user_id).execute();
  if (wishlists === undefined) throwErrorException(`[repository.wishlist.getAllWishlists] cannot get wishlists`, 'Wishlists is undefined', 404);
  return wishlists;
}

export async function getWishlistById(wishlist_id: string): Promise<WishlistTable> {
  const wishlist = await db.selectFrom('wishlist').selectAll().where('wishlist_id', '=', wishlist_id).executeTakeFirst();
  if (!wishlist || wishlist === undefined)
    throwErrorException(`[repository.wishlist.getWishlistById] cannot find wishlist with ID ${wishlist_id}`, 'Wishlist not found', 404);
  return wishlist!;
}

export async function createWishlist(wishlist: WishlistTable): Promise<WishlistTable> {
  const newWishlist = await db
    .insertInto('wishlist')
    .values({
      wishlist_id: wishlist.wishlist_id,
      user_id: wishlist.user_id,
      game_id: wishlist.game_id,
      created_at: wishlist.created_at,
      updated_at: wishlist.updated_at,
    })
    .returningAll()
    .executeTakeFirst();
  if (!newWishlist || newWishlist === undefined)
    throwErrorException(`[repository.wishlist.createWishlist] cannot create wishlist`, 'Cannot create wishlist', 500);
  return newWishlist!;
}

export async function updateWishlist(wishlist_id: string, wishlist: Omit<WishlistTable, 'wishlist_id' | 'created_at' | 'updated_at'>): Promise<WishlistTable> {
  const updatedWishlist = await db
    .updateTable('wishlist')
    .set({
      user_id: wishlist.user_id,
      game_id: wishlist.game_id,
      updated_at: new Date(),
    })
    .where('wishlist_id', '=', wishlist_id)
    .returningAll()
    .executeTakeFirst();
  if (!updatedWishlist || updatedWishlist === undefined)
    throwErrorException(`[repository.wishlist.updateWishlist] cannot update wishlist`, 'Cannot update wishlist', 500);
  return updatedWishlist!;
}

export async function deleteWishlist(wishlist_id: string): Promise<void> {
  await db.deleteFrom('wishlist').where('wishlist_id', '=', wishlist_id).executeTakeFirstOrThrow();
}

export async function getWishlistByGameAndUserId(game_id: string, user_id: string) {
  const review = await db.selectFrom('wishlist').selectAll().where('user_id', '=', user_id).where('game_id', '=', game_id).executeTakeFirst();
  if (!review) {
    throwErrorException(
      `[repository.wishlist.getWishlistByGameandUserId] No reviews found for game ID: ${game_id} and user ID: ${user_id}`,
      'Wishlist not found',
      200,
    );
  }
  return review;
}
