import { ReviewTable } from "../data/models/models.js";
import * as reviewRepo from "../repository/review.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";

export function getAllReviews(): Promise<ReviewTable[]> {
    return reviewRepo.getAllReviews();
}

export async function getReviewById(review_id: string): Promise<ReviewTable> {
    if (!validate(review_id)) throwErrorException(`[service.review.getReviewById] Invalid UUID: ${review_id}`, 'Invalid review ID', 400);
    return reviewRepo.getReviewById(review_id);
}

export async function createReview(user_id: string, game_id: string, rating: number, reviewText: string | null): Promise<ReviewTable> {
    let errorMessage = '';
    if (!user_id) errorMessage += "User ID not given";
    if (!validate(user_id)) errorMessage += "User ID is invalid";
    if (!game_id) errorMessage += "Game ID not given";
    if (!validate(game_id)) errorMessage += "Game ID is invalid";
    if (rating === undefined || rating === null) errorMessage += "Rating not given";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.review.createReview] ${errorMessage}`, 'Cannot create review', 400);
    }

    const currentDate = new Date();
    const newReview: ReviewTable = {
        review_id: uuidv4(),
        user_id,
        game_id,
        rating,
        review: reviewText,
        created_at: currentDate,
        updated_at: currentDate
    };

    return reviewRepo.createReview(newReview);
}

export async function updateReview(review_id: string, user_id: string, game_id: string, rating: number, reviewText: string | null): Promise<ReviewTable> {
    let errorMessage = '';
    if (!review_id) errorMessage += "Review ID not given";
    if (!validate(review_id)) errorMessage += "Review ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.review.updateReview] ${errorMessage}`, 'Cannot update review', 400);
    }

    const currentReview = await reviewRepo.getReviewById(review_id);

    const updatedReview: Omit<ReviewTable, 'review_id' | 'created_at' | 'updated_at'> = {
        user_id: user_id ?? currentReview.user_id,
        game_id: game_id ?? currentReview.game_id,
        rating: rating ?? currentReview.rating,
        review: reviewText ?? currentReview.review
    };

    return reviewRepo.updateReview(review_id, updatedReview);
}

export async function deleteReview(review_id: string): Promise<void> {
    if (!validate(review_id)) throwErrorException(`[service.review.deleteReview] Invalid UUID: ${review_id}`, 'Invalid review ID', 400);
    return reviewRepo.deleteReview(review_id);
}
