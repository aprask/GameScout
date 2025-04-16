const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as igdbService from '../service/igdb.js';
//import { authMiddleware } from '../middleware/auth.js';
import express from 'express';
import dotenv from 'dotenv';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

dotenv.config();

router.get(
  '/:game_id',
  asyncHandler(async (req, res) => {
    const { game_id } = req.params;
    const gameDetails = await igdbService.getGameDetails(game_id);
    res.status(200).json({ game: gameDetails });
  }),
);

export default router;
