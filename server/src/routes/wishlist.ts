import express from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as wishlistService from "../service/wishlist.js";

router.get('/', asyncHandler(async (req, res) => {
    const wishlists = await wishlistService.getAllWishlists();
    res.status(200).json({wishlists: wishlists});
}));

router.get('/:wishlist_id', asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlistById(req.params.wishlist_id);
    res.status(200).json({wishlist: wishlist});
}));

router.post('/', asyncHandler(async (req, res) => {
    const { user_id, game_id } = req.body;
    let admin_id: string = "";
    if (typeof req.query.admin_id === 'string') {
        admin_id = req.query.admin_id;
    }
    const newWishlist = await wishlistService.createWishlist(user_id, game_id, admin_id);
    res.status(201).json({ new_wishlist: newWishlist });
}));

router.put('/:wishlist_id', asyncHandler(async (req, res) => {
    const { user_id, game_id } = req.body;
    const updatedWishlist = await wishlistService.updateWishlist(req.params.wishlist_id, user_id, game_id);
    res.status(200).json({updated_wishlist: updatedWishlist});
}));

router.delete('/:wishlist_id', asyncHandler(async (req, res) => {
    const { wishlist_id } = req.params;
    let admin_id: string = "";
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    await wishlistService.deleteWishlist(wishlist_id, admin_id);
    res.sendStatus(204);
}));

export default router;