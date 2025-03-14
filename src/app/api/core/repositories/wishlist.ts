"use server";
import { db } from "@/db/db";
import { WishlistTable } from "@/db/types";

export async function getAllWishlist(): Promise<WishlistTable[]> {
  return await db.selectFrom("wishlist").selectAll().execute();
}

export async function getWishlistByUserId(
  id: string
): Promise<WishlistTable[]> {
  return await db
    .selectFrom("wishlist")
    .where("user_id", "=", id)
    .selectAll()
    .execute();
}

export async function getWishlistByGameId(
  id: number
): Promise<WishlistTable[]> {
  return await db
    .selectFrom("wishlist")
    .selectAll()
    .where("game_id", "=", id)
    .execute();
}

export async function getWishlistById(id: string): Promise<WishlistTable> {
  return await db
    .selectFrom("wishlist")
    .selectAll()
    .where("wishlist_id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function createWishlist(
  wishlist: WishlistTable
): Promise<WishlistTable> {
  return await db
    .insertInto("wishlist")
    .values({
      wishlist_id: wishlist.wishlist_id,
      user_id: wishlist.user_id,
      game_id: wishlist.game_id,
      created_at: wishlist.created_at,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteGameFromWishlist(id: string): Promise<void> {
  await db
    .deleteFrom("wishlist")
    .where("wishlist_id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function alreadyOnWishlist(
  user_id: string,
  game_id: number
): Promise<boolean> {
  const wishlist = await db
    .selectFrom("wishlist")
    .select(["wishlist_id"])
    .where("user_id", "=", user_id)
    .where("game_id", "=", game_id)
    .executeTakeFirst();
  return !!wishlist;
}
