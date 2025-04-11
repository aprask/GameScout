import { db } from '../data/db.js';
import { ReviewTable } from '../data/models/models.js';
import { throwErrorException } from '../util/error.js';

export async function getAllReviews(): Promise<ReviewTable[]> {
  const reviews = await db.selectFrom('review').selectAll().execute();
  if (reviews === undefined) throwErrorException(`[repository.review.getAllReviews] cannot get reviews`, 'Reviews is undefined', 404);
  return reviews;
}

export async function getReviewById(review_id: string): Promise<ReviewTable> {
  const review = await db.selectFrom('review').selectAll().where('review_id', '=', review_id).executeTakeFirst();
  if (!review || review === undefined)
    throwErrorException(`[repository.review.getReviewById] cannot find review with ID ${review_id}`, 'Review not found', 404);
  return review!;
}

export async function createReview(review: ReviewTable): Promise<ReviewTable> {
  const newReview = await db
    .insertInto('review')
    .values({
      review_id: review.review_id,
      user_id: review.user_id,
      game_id: review.game_id,
      rating: review.rating,
      review: review.review,
      created_at: review.created_at,
      updated_at: review.updated_at,
    })
    .returningAll()
    .executeTakeFirst();
  if (!newReview || newReview === undefined) throwErrorException(`[repository.review.createReview] cannot create review`, 'Cannot create review', 500);
  return newReview!;
}

export async function updateReview(review_id: string, review: Omit<ReviewTable, 'review_id' | 'created_at' | 'updated_at'>): Promise<ReviewTable> {
  const updatedReview = await db
    .updateTable('review')
    .set({
      user_id: review.user_id,
      game_id: review.game_id,
      rating: review.rating,
      review: review.review,
      updated_at: new Date(),
    })
    .where('review_id', '=', review_id)
    .returningAll()
    .executeTakeFirst();
  if (!updatedReview || updatedReview === undefined) throwErrorException(`[repository.review.updateReview] cannot update review`, 'Cannot update review', 500);
  return updatedReview!;
}

export async function deleteReview(review_id: string): Promise<void> {
  await db.deleteFrom('review').where('review_id', '=', review_id).executeTakeFirstOrThrow();
}

export async function verifyReviewOwnership(user_id: string, review_id: string): Promise<boolean> {
  const review = await db.selectFrom('review').selectAll().where('review_id', '=', review_id).where('user_id', '=', user_id).executeTakeFirst();
  if (!review) return false;
  return true;
}

export async function getAllReviewsByGameId(gameId: string): Promise<ReviewTable[]> {
  const reviews = await db.selectFrom('review').selectAll().where('game_id', '=', gameId).execute();

  if (!reviews) {
    throwErrorException(`[repository.review.getAllReviewsByGameId] No reviews found for game ID: ${gameId}`, 'Reviews not found', 404);
  }

  return reviews;
}
