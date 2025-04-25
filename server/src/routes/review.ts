const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as reviewService from '../service/review.js';
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

router.use(authMiddleware as RequestHandler);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({ reviews: reviews });
  }),
);

router.get(
  '/game/:gameId',
  asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const reviews = await reviewService.getAllReviewsByGameId(gameId);
    res.status(200).json({ reviews: reviews });
  }),
);

router.get(
  '/:review_id',
  asyncHandler(async (req, res) => {
    const review = await reviewService.getReviewById(req.params.review_id);
    res.status(200).json({ review: review });
  }),
);

//get reviews by userid

//get review average by game

//get reviews by userid AND gameid
router.get(
  '/game/:game_id/user/:user_id',
  asyncHandler(async (req, res) => {
    const review = await reviewService.getReviewByGameAndUserId(req.params.game_id, req.params.user_id);
    res.status(200).json({ review });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { user_id, game_id, rating, review_text } = req.body;
    const newReview = await reviewService.createReview(user_id, game_id, rating, review_text);
    res.status(201).json({ new_review: newReview });
  }),
);

router.put(
  '/:review_id',
  asyncHandler(async (req, res) => {
    const { user_id, game_id, rating, review_text } = req.body;
    const updatedReview = await reviewService.updateReview(req.params.review_id, user_id, game_id, rating, review_text);
    res.status(200).json({ updated_review: updatedReview });
  }),
);

router.delete(
  '/:review_id',
  asyncHandler(async (req, res) => {
    const { review_id } = req.params;
    let admin_id: string | null = null;
    let user_id: string | null = null;
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    if (typeof req.query.user_id === 'string') user_id = req.query.user_id;
    await reviewService.deleteReview(review_id, user_id, admin_id);
    res.sendStatus(204);
  }),
);

export default router;
