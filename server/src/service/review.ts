import { ReviewTable } from '../data/models/models.js';
import * as reviewRepo from '../repository/review.js';
import * as adminRepo from '../repository/admin.js';
import { throwErrorException } from '../util/error.js';
import { v4 as uuidv4, validate } from 'uuid';

export function getAllReviews(): Promise<ReviewTable[]> {
  return reviewRepo.getAllReviews();
}

export async function getReviewById(review_id: string): Promise<ReviewTable> {
  if (!validate(review_id)) throwErrorException(`[service.review.getReviewById] Invalid UUID: ${review_id}`, 'Invalid review ID', 400);
  return reviewRepo.getReviewById(review_id);
}

export async function createReview(user_id: string, game_id: string, rating: number, reviewText: string | null, review_title: string): Promise<ReviewTable> {
  let errorMessage = '';
  if (!user_id) errorMessage += 'User ID not given';
  if (!validate(user_id)) errorMessage += 'User ID is invalid';
  if (!game_id) errorMessage += 'Game ID not given';
  if (!validate(game_id)) errorMessage += 'Game ID is invalid';
  if (rating === undefined || rating === null) errorMessage += 'Rating not given';
  if (!review_title) errorMessage += ' Review not titled';
  if (errorMessage) {
    errorMessage.trim();
    throwErrorException(`[service.review.createReview] ${errorMessage}`, 'Cannot create review', 400);
  }

  const currentDate = new Date();
  const newReview: ReviewTable = {
    review_id: uuidv4(),
    user_id,
    game_id,
    review_title,
    rating,
    review: reviewText,
    created_at: currentDate,
    updated_at: currentDate,
  };

  return reviewRepo.createReview(newReview);
}

export async function updateReview(
  review_id: string,
  user_id: string,
  game_id: string,
  rating: number,
  reviewText: string | null,
  review_title: string,
): Promise<ReviewTable> {
  let errorMessage = '';
  if (!review_id) errorMessage += 'Review ID not given';
  if (!validate(review_id)) errorMessage += 'Review ID is invalid';
  if (errorMessage) {
    errorMessage.trim();
    throwErrorException(`[service.review.updateReview] ${errorMessage}`, 'Cannot update review', 400);
  }

  const currentReview = await reviewRepo.getReviewById(review_id);

  const updatedReview: Omit<ReviewTable, 'review_id' | 'created_at' | 'updated_at'> = {
    user_id: user_id ?? currentReview.user_id,
    game_id: game_id ?? currentReview.game_id,
    review_title: review_title,
    rating: rating ?? currentReview.rating,
    review: reviewText ?? currentReview.review,
  };

  return reviewRepo.updateReview(review_id, updatedReview);
}

export async function deleteReview(review_id: string, user_id: string | null, admin_id: string | null): Promise<void> {
  if (!validate(review_id)) throwErrorException(`[service.review.deleteReview] Invalid UUID: ${review_id}`, 'Invalid review ID', 400);
  if (admin_id) {
    if (!validate(admin_id)) throwErrorException(`[service.review.deleteReview] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
    if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.review.deleteReview] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 403);
    else reviewRepo.deleteReview(review_id);
  } else if (user_id) {
    if (!validate(user_id)) throwErrorException(`[service.review.deleteReview] Invalid UUID: ${user_id}`, 'Invalid User ID', 400);
    if (!(await reviewRepo.verifyReviewOwnership(user_id, review_id)))
      throwErrorException(`[service.review.deleteReview] User does not own review: ${review_id}`, 'User ID and Review ID mismatch', 403);
    else reviewRepo.deleteReview(review_id);
  } else throwErrorException(`[service.review.deleteReview] No valid ID providded`, 'Cannot delete review', 403);
}

export async function getAllReviewsByGameId(gameId: string): Promise<ReviewTable[]> {
  if (!gameId) {
    throwErrorException(`[service.review.getAllReviewsByGameId] Game ID not provided`, 'Invalid game ID', 400);
  }

  return reviewRepo.getAllReviewsByGameId(gameId);
}

export async function getReviewByGameAndUserId(user_id: string, game_id: string): Promise<ReviewTable> {
  if (!user_id) throwErrorException(`[service.review.getReviewByGameAndUserId] No user_id provided`, 'user_id', 404);
  if (!game_id) throwErrorException(`[service.review.getReviewByGameAndUserId] No game_id provided`, 'game_id', 404);
  return reviewRepo.getReviewByGameAndUserId(user_id, game_id);
}

export async function getAverageRating(game_id: string): Promise<Number> {
  if (!game_id) throwErrorException(`[service.review.getAverageRating] No game_id provided`, 'game_id', 404);
  const reviews = await reviewRepo.getAllReviewsByGameId(game_id);
  let sum = 0;
  reviews.forEach((review) => (sum += review.rating));
  return sum / reviews.length;
}
