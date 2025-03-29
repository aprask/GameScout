import { GameTable } from "../data/models/models.js";
import * as gameRepo from "../repository/game.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";

export function getAllGames(): Promise<GameTable[]> {
    return gameRepo.getAllGames();
}

export async function getGameById(game_id: string): Promise<GameTable> {
    if (!validate(game_id)) throwErrorException(`[service.game.getGameById] Invalid UUID: ${game_id}`, 'Invalid game ID', 400);
    return gameRepo.getGameById(game_id);
}

export async function createGame(
    game_name: string,
    game_art: string,
    is_supported: boolean,
    company: string,
    summary: string,
    release_date: Date,
    age_rating: string
): Promise<GameTable> {
    let errorMessage = '';
    if (!game_name) errorMessage += "Game name not given";
    if (!company) errorMessage += "Company not given";
    if (!release_date) errorMessage += "Release date not given";
    if (!age_rating) errorMessage += "Age rating not given";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.game.createGame] ${errorMessage}`, 'Cannot create game', 400);
    }

    const currentDate = new Date();
    const newGame: GameTable = {
        game_id: uuidv4(),
        game_name,
        game_art,
        is_supported,
        company,
        summary,
        release_date,
        age_rating,
        created_at: currentDate,
        updated_at: currentDate
    };

    return gameRepo.createGame(newGame);
}

export async function updateGame(
    game_id: string,
    game_name: string,
    game_art: string,
    is_supported: boolean,
    company: string,
    summary: string,
    release_date: Date,
    age_rating: string
): Promise<GameTable> {
    let errorMessage = '';
    if (!game_id) errorMessage += "Game ID not given";
    if (!validate(game_id)) errorMessage += "Game ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.game.updateGame] ${errorMessage}`, 'Cannot update game', 400);
    }

    const currentGame = await gameRepo.getGameById(game_id);

    const updatedGame: Omit<GameTable, 'game_id' | 'created_at' | 'updated_at'> = {
        game_name: game_name ?? currentGame.game_name,
        game_art: game_art ?? currentGame.game_art,
        is_supported: is_supported ?? currentGame.is_supported,
        company: company ?? currentGame.company,
        summary: summary ?? currentGame.summary,
        release_date: release_date ?? currentGame.release_date,
        age_rating: age_rating ?? currentGame.age_rating
    };

    return gameRepo.updateGame(game_id, updatedGame);
}

export async function deleteGame(game_id: string): Promise<void> {
    if (!validate(game_id)) throwErrorException(`[service.game.deleteGame] Invalid UUID: ${game_id}`, 'Invalid game ID', 400);
    return gameRepo.deleteGame(game_id);
}
