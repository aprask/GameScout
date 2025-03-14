"use server";
import * as reviewRepo from "@/app/api/core/repositories/reviews";
import * as userRepo from "@/app/api/core/repositories/user";
import { ReviewTable } from "@/db/types";
import { v4 as uuidv4, validate } from "uuid";

export async function getAllReviews(): Promise<ReviewTable[]> {
  return reviewRepo.getAllReviews();
}

export async function getReviewById(id: string): Promise<ReviewTable> {
  if (!validate(id)) throw new Error("Invalid ID type");
  return reviewRepo.getReviewById(id);
}

export async function getReviewsByUserId(
  userId: string
): Promise<ReviewTable[]> {
  if (!validate(userId)) throw new Error("Invalid ID type");
  return reviewRepo.getReviewsByUserId(userId);
}

export async function getReviewsByGameId(
  gameId: number
): Promise<ReviewTable[]> {
  return reviewRepo.getReviewsByGameId(gameId);
}

export async function createReview(
  user_id: string,
  game_id: number,
  rating: number,
  review: string | null
): Promise<ReviewTable> {
  let errorMessage = "";
  const userAlreadyReviewed = await reviewRepo.userAlreadyCreateReview(
    user_id,
    game_id
  );
  if (!validate(user_id)) errorMessage += "Invalid user ID type";
  if (!game_id) errorMessage += "Missing game ID";
  if (!rating) errorMessage += "Missing rating";
  if (userAlreadyReviewed) errorMessage += "User already reviewed this game ";
  if (errorMessage) {
    errorMessage.trim();
    throw new Error(`message: ${errorMessage}\nstatus: 400`);
  }
  const reviewId = uuidv4();
  const createdAt = new Date();
  const newReview: ReviewTable = {
    review_id: reviewId,
    user_id: user_id,
    game_id: game_id,
    rating: rating,
    review: review,
    created_at: createdAt,
  };
  return reviewRepo.createReview(newReview);
}

export async function updateReview(
  id: string,
  rating: number,
  review: string | null
): Promise<ReviewTable> {
  let errorMessage = "";
  if (!validate(id)) errorMessage += "Invalid review ID type";
  if (!rating) errorMessage += "Missing rating";
  if (errorMessage) {
    errorMessage.trim();
    throw new Error(`message: ${errorMessage}\nstatus: 400`);
  }
  return reviewRepo.updateReview(id, rating, review);
}

export async function deleteReview(id: string): Promise<void> {
  if (!validate(id)) throw new Error("Invalid ID type");
  return reviewRepo.deleteReview(id);
}
