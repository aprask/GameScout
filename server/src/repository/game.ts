import { db } from "../data/db.js";
import { GameTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllGames(): Promise<GameTable[]> {
    const games = await db
        .selectFrom("games")
        .selectAll()
        .execute();
    if (games === undefined) throwErrorException(`[repository.game.getAllGames] cannot get games`, 'Games is undefined', 404);
    return games;
}

export async function getGameById(game_id: string): Promise<GameTable> {
    const game = await db
        .selectFrom("games")
        .selectAll()
        .where("game_id", "=", game_id)
        .executeTakeFirst();
    if (!game || game === undefined) throwErrorException(`[repository.game.getGameById] cannot find game with ID ${game_id}`, 'Game not found', 404);
    return game!;
}

export async function createGame(game: GameTable): Promise<GameTable> {
    const newGame = await db
        .insertInto("games")
        .values({
            game_id: game.game_id,
            game_name: game.game_name,
            game_art: game.game_art,
            is_supported: game.is_supported,
            summary: game.summary,
            release_date: game.release_date,
            created_at: game.created_at,
            updated_at: game.updated_at,
        })
        .returningAll()
        .executeTakeFirst();
    if (!newGame || newGame === undefined) throwErrorException(`[repository.game.createGame] cannot create game`, 'Cannot create game', 500);
    return newGame!;
}

export async function updateGame(game_id: string, game: Omit<GameTable, 'game_id' | 'created_at' | 'updated_at'>): Promise<GameTable> {
    const updatedGame = await db
        .updateTable("games")
        .set({
            game_name: game.game_name,
            game_art: game.game_art,
            is_supported: game.is_supported,
            summary: game.summary,
            release_date: game.release_date,
            updated_at: new Date()
        })
        .where("game_id", "=", game_id)
        .returningAll()
        .executeTakeFirst();
    if (!updatedGame || updatedGame === undefined) throwErrorException(`[repository.game.updateGame] cannot update game`, 'Cannot update game', 500);
    return updatedGame!;
}

export async function deleteGame(game_id: string): Promise<void> {
    await db
        .deleteFrom("games")
        .where("game_id", "=", game_id)
        .executeTakeFirstOrThrow();
}
