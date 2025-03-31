const router = express.Router();
import asyncHandler from 'express-async-handler';
import * as imageService from "../service/image.js";
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';

router.use(authMiddleware as RequestHandler);

router.get('/', asyncHandler(async (req, res) => {
    const images = await imageService.getAllImages();
    res.status(200).send({images: images});
}));

router.get('/:image_id', asyncHandler(async (req, res) => {
    const image = await imageService.getImageById(req.params.image_id);
    res.status(200).json({image: image});
}));

router.post('/', asyncHandler(async (req, res) => {
    const { image_text, image_data } = req.body;
    const newImage = await imageService.createImage(image_text, image_data);
    res.status(201).json({new_image: newImage});
}));

router.put('/:image_id', asyncHandler(async (req, res) => {
    const { image_text, image_data } = req.body;
    const updatedImage = await imageService.updateImage(req.params.image_id, image_text, image_data);
    res.status(200).json({updated_image: updatedImage});
}));

router.delete('/:image_id', asyncHandler(async (req, res) => {
    const { image_id } = req.params;
    let admin_id: string = "";
    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    await imageService.deleteImage(image_id, admin_id);
    res.sendStatus(204);
}));


export default router;