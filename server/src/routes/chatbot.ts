const router = express.Router();
import asyncHandler from 'express-async-handler';
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';
import { resourceSharer } from '../middleware/resource.js';
import * as gameService from '../service/game.js';
import axios from 'axios';
router.use(resourceSharer);
router.use(authMiddleware as RequestHandler);
import dotenv from 'dotenv';
import { Namespace } from '../data/models/models.js';

dotenv.config();

const API_MANAGEMENT_KEY = process.env.API_MANAGEMENT_KEY;

router.post('/', asyncHandler(async (req, res) => {

    const gameTitles = await gameService.getAllGameTitles();

    const formattedGames: Namespace[] = []

    for (const name of gameTitles) formattedGames.push({name: name.game_name}); // formatting for Fast API model (w/o this we get a 422)

    const { query } = req.body;

    console.log("Payload:", JSON.stringify({
        query,
        namespaces: gameTitles
    }, null, 2));

    
    const chatbotQuery = await axios.post(
        `http://chat:5000/query`,
        {
            query: query,
            namespaces: formattedGames
        },
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${API_MANAGEMENT_KEY}`
            }
        }
    );
    const chatbotReply = chatbotQuery.data.response;
    console.log(chatbotReply);
    res.status(200).json({response: chatbotReply});
}));

export default router;