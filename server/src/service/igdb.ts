import axios from 'axios';
import { throwErrorException } from '../util/error.js';

import dotenv from 'dotenv';

dotenv.config();

export async function getGameDetails(game_id: string) {
  if (!game_id) {
    throwErrorException('[service.game.getGameDetails] Game ID not provided', 'Invalid game ID', 400);
  }

  try {
    const tokenResponse = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
      params: {
        client_id: process.env.IGDB_CLIENT,
        client_secret: process.env.IGDB_SECRET,
        grant_type: 'client_credentials',
      },
    });
    const accessToken = tokenResponse.data.access_token;

    const gameResponse = await axios.post(
      `https://api.igdb.com/v4/games`,
      `fields name,summary,cover.url,genres.name,first_release_date,rating; where id = ${game_id};`,
      {
        headers: {
          'Client-ID': process.env.IGDB_CLIENT,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'text/plain',
        },
      },
    );

    if (gameResponse.data.length === 0) {
      throwErrorException('[service.game.getGameDetails] Game not found', 'Game not found', 404);
    }

    return gameResponse.data[0];
  } catch (error) {
    console.error(error);
    throwErrorException('[service.game.getGameDetails] Failed to fetch game details', 'Internal server error', 500);
  }
}
