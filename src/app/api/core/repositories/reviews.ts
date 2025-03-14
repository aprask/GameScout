"use server";
import { db } from "@/db/db";
import { ReviewTable } from "@/db/types";

export async function getAllReviews(): Promise<ReviewTable[]> {
  return await db.selectFrom("game_review").selectAll().execute();
}

export async function getReviewById(id: string): Promise<ReviewTable> {
  return await db
    .selectFrom("game_review")
    .selectAll()
    .where("review_id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function getReviewsByUserId(
  userId: string
): Promise<ReviewTable[]> {
  return await db
    .selectFrom("game_review")
    .selectAll()
    .where("user_id", "=", userId)
    .execute();
}

export async function getReviewsByGameId(
  gameId: number
): Promise<ReviewTable[]> {
  return await db
    .selectFrom("game_review")
    .selectAll()
    .where("game_id", "=", gameId)
    .execute();
}

export async function createReview(review: ReviewTable): Promise<ReviewTable> {
  return await db
    .insertInto("game_review")
    .values({
      review_id: review.review_id,
      user_id: review.user_id,
      game_id: review.game_id,
      rating: review.rating,
      review: review.review,
      created_at: review.created_at,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateReview(
  id: string,
  rating: number,
  review: string | null
): Promise<ReviewTable> {
  return await db
    .updateTable("game_review")
    .set({
      rating: rating,
      review: review,
      created_at: new Date(),
    })
    .where("review_id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteReview(id: string): Promise<void> {
  await db
    .deleteFrom("game_review")
    .where("review_id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function userAlreadyCreateReview(
  user_id: string,
  game_id: number
): Promise<boolean> {
  const review = await db
    .selectFrom("game_review")
    .select(["review_id"])
    .where("user_id", "=", user_id)
    .where("game_id", "=", game_id)
    .executeTakeFirst();
  return !!review;
}
