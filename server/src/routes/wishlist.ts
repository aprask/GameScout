const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as wishlistService from '../service/wishlist.js';
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);

router.use(authMiddleware as RequestHandler);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const wishlists = await wishlistService.getAllWishlists();
    res.status(200).json({ wishlists: wishlists });
  }),
);

router.get(
  '/:wishlist_id',
  asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlistById(req.params.wishlist_id);
    res.status(200).json({ wishlist: wishlist });
  }),
);

router.get(
  '/userList/:user_id',
  asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishListsByUserId(req.params.user_id);
    res.status(200).json({ wishlists: wishlist });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { game_id, user_id } = req.body;
    const newWishlist = await wishlistService.createWishlist(user_id, game_id);
    res.status(201).json({ new_wishlist: newWishlist });
  }),
);

router.put(
  '/:wishlist_id',
  asyncHandler(async (req, res) => {
    const { user_id, game_id } = req.body;
    const updatedWishlist = await wishlistService.updateWishlist(req.params.wishlist_id, user_id, game_id);
    res.status(200).json({ updated_wishlist: updatedWishlist });
  }),
);

router.delete(
  '/:wishlist_id',
  asyncHandler(async (req, res) => {
    const { wishlist_id } = req.params;
    let admin_id: string = '';
    let user_id: string = '';
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    if (typeof req.query.user_id === 'string') user_id = req.query.user_id;
    await wishlistService.deleteWishlist(wishlist_id, admin_id, user_id);
    res.sendStatus(204);
  }),
);

router.get(
  '/game/:game_id/user/:user_id',
  asyncHandler(async (req, res) => {
    const { game_id, user_id } = req.params;
    const wishlist = await wishlistService.getWishlistByGameAndUserId(game_id, user_id);
    res.status(200).json({ wishlist });
  }),
);

export default router;
