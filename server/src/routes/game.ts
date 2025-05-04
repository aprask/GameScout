const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as gameService from '../service/game.js';
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

dotenv.config();

router.use(authMiddleware as RequestHandler);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const games = await gameService.getAllGames();
    res.status(200).json({ games });
  }),
);

router.get(
  '/list',
  asyncHandler(async (req, res) => {
    let lim: string = '';
    let page: string = '';
    let sort: string = '';
    let search: string = '';
    if (typeof req.query.lim === 'string') lim = req.query.lim;
    if (typeof req.query.page === 'string') page = req.query.page;
    if (typeof req.query.sort === 'string') sort = req.query.sort;
    if (typeof req.query.search === 'string') search = req.query.search;

    const games = await gameService.getPaginatedGames(lim, page, sort, search);
    res.status(200).json({ games: games });
  }),
);

router.get(
  '/new',
  asyncHandler(async (req, res) => {
    let n: number = 0;
    if (typeof +req.query.n! === 'number') n = +req.query.n!;

    const games = await gameService.getNNewestGames(n);
    res.status(200).json({ games: games });
  }),
);

router.get(
  '/:game_id',
  asyncHandler(async (req, res) => {
    const game = await gameService.getGameById(req.params.game_id);
    res.status(200).json({ game });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { game_name, game_art, is_supported, summary, release_date, cover_id } = req.body;

    let admin_id: string = '';
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;

    const newGame = await gameService.createGame(game_name, game_art, is_supported, summary, new Date(release_date), cover_id, admin_id);

    res.status(201).json({ new_game: newGame });
  }),
);

router.put(
  '/:game_id',
  asyncHandler(async (req, res) => {
    const { game_name, is_supported, summary, release_date } = req.body;

    let admin_id: string = '';
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;

    const updatedGame = await gameService.updateGame(req.params.game_id, game_name, is_supported, summary, new Date(release_date), admin_id);

    res.status(200).json({ updated_game: updatedGame });
  }),
);

router.delete(
  '/:game_id',
  asyncHandler(async (req, res) => {
    const { game_id } = req.params;

    let admin_id: string = '';
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;

    await gameService.deleteGame(game_id, admin_id);
    res.sendStatus(204);
  }),
);

export default router;
