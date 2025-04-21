import { GameTable, GameMessage, ImageTable, PaginatedGame } from "../data/models/models.js";
import * as gameRepo from "../repository/game.js";
import * as imgRepo from "../repository/image.js";
import { throwErrorException } from "../util/error.js";
import * as adminRepo from '../repository/admin.js';
import { v4 as uuidv4, validate } from "uuid";
import { isDigit } from "../util/digit.js";


export async function getPaginatedGames(lim: string, page: string): Promise<PaginatedGame> {
    let numLim: number = 0; // for entries per page
    let numPage: number = 0; // the actual page number

    // we're going to gracefully handle this (not sending a 400 for invalid query params)

    if (!isDigit(lim)) numLim = 1;
    else if (+lim <= 0) numLim = 1;
    else numLim = +lim;

    if (!isDigit(page)) numPage = 1;
    else if (+page <= 0) numPage = 1;
    else numPage = +page;

    const games = await getAllGames();
    const totalEntries = games.length;
    
    // if the user inputs a limit that is greater than the number of pages
    if (numLim > totalEntries) numLim = 1;

    let totalPages = Math.ceil(totalEntries / numLim);
    if (totalPages <= 0) totalPages = 1;

    // cannot exceed page limit
    if (numPage > totalPages) numPage = totalPages;

    // simple enough, we're getting the start of it Pg-1, since we start at 1 and then the number of rows we shift
    const start = (numPage - 1) * numLim;
    // this gives us column offset (basically it tells us where in that page we stop)
    const end = start + numLim;
    
    const paginatedGames: GameTable[] = [];
    for (let i = start; i < end; ++i) {
        if (i >= games.length) break;
        paginatedGames.push(games[i]);
    }

    const paginatedGameRes: PaginatedGame = {
        current_page: numPage,
        limit: numLim,
        items: totalEntries,
        pages: totalPages,
        data: paginatedGames
    }
    return paginatedGameRes;
}

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
    summary: string,
    release_date: Date,
    admin_id: string
): Promise<GameTable | undefined> {
    if (admin_id) {
        if (!validate(admin_id)) throwErrorException(`[service.game.createGame] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.game.createGame] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);

        let errorMessage = '';
        if (!game_name) errorMessage += "Game name not given";
        if (!release_date) errorMessage += "Release date not given";
        if (!game_art) errorMessage += "Game art not given"
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
            summary,
            release_date,
            created_at: currentDate,
            updated_at: currentDate
        };

        return gameRepo.createGame(newGame);
    }
    else throwErrorException(`[service.game.createGame] No valid ID provided`, 'Cannot create game', 403);
}

export async function updateGame(
    game_id: string,
    game_name: string,
    game_art: string,
    is_supported: boolean,
    summary: string,
    release_date: Date,
    admin_id: string
): Promise<GameTable | undefined> {
    if (admin_id && game_id) {
        if (!validate(admin_id)) throwErrorException(`[service.game.updateGame] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.game.updateGame] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);
        if (!validate(game_id)) throwErrorException(`[service.game.updateGame] Invalid UUID: ${game_id}`, 'Invalid game ID', 400);

        const currentGame = await gameRepo.getGameById(game_id);

        const updatedGame: Omit<GameTable, 'game_id' | 'created_at' | 'updated_at'> = {
            game_name: game_name ?? currentGame.game_name,
            game_art: game_art ?? currentGame.game_art,
            is_supported: is_supported ?? currentGame.is_supported,
            summary: summary ?? currentGame.summary,
            release_date: release_date ?? currentGame.release_date,
        };

        return gameRepo.updateGame(game_id, updatedGame);
    }
    else throwErrorException(`[service.game.updateGame] No valid ID provided`, 'Cannot update game', 403);
}

export async function deleteGame(game_id: string, admin_id: string): Promise<void> {
    if (admin_id && game_id) {
        if (!validate(admin_id)) throwErrorException(`[service.game.deleteGame] Invalid UUID: ${admin_id}`, 'Invalid admin ID', 400);
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.game.deleteGame] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 400);
        if (!validate(game_id)) throwErrorException(`[service.game.deleteGame] Invalid UUID: ${game_id}`, 'Invalid game ID', 400);
        else await gameRepo.deleteGame(game_id);
    }
    else throwErrorException(`[service.game.deleteGame] No valid ID provided`, 'Cannot delete game', 403);
}

export async function bulkGameInsert(gameMsg: GameMessage[]): Promise<void> {
    for (let i = 0; i < gameMsg.length; ++i) {
        const gameName = gameMsg[i].game_name;
        console.log(`Game Name: ${gameName}`);
        const gameSummary = gameMsg[i].summary;
        const releaseDate = gameMsg[i].release_date;
        const isSupported = gameMsg[i].is_supported;
        if (await gameRepo.doesGameExist(gameName, gameSummary)) continue;
        if (isNaN(releaseDate)) continue;
        if (gameName === undefined || gameSummary === undefined || releaseDate === undefined || isSupported === undefined) continue;

        const currentDate = new Date();
        const imageData = Buffer.from(gameMsg[i].game_art.data);
        if (imageData === undefined) continue;
        const imageId = uuidv4();
        const imageInstance: ImageTable = {
            image_id: imageId,
            image_text: "",
            image_data: imageData,
            created_at: currentDate,
            updated_at: currentDate
        }
        await imgRepo.createImage(imageInstance);
        const formattedReleaseDate = new Date(+gameMsg[i].release_date * 1000);
        const gameInstance: GameTable = {
            game_id: uuidv4(),
            game_art: imageId,
            is_supported: isSupported,
            summary: gameSummary,
            game_name: gameName,
            release_date: formattedReleaseDate,
            created_at: currentDate,
            updated_at: currentDate
        }
        await gameRepo.createGame(gameInstance);
    }
}