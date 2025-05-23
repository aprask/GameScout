import { db } from '../data/db.js';
import { GameTable, GameTitle } from '../data/models/models.js';
import { throwErrorException } from '../util/error.js';

export async function getAllGameTitles(): Promise<GameTitle[]> {
  const gameTitles = await db.selectFrom('games').select(['game_name']).execute();
  if (gameTitles === undefined) throwErrorException(`[repository.game.getAllGameTitles] cannot get game titles`, 'No titles found', 404);
  return gameTitles;
}

export async function getAllGames(): Promise<GameTable[]> {
  const games = await db.selectFrom('games').selectAll().execute();
  if (games === undefined) throwErrorException(`[repository.game.getAllGames] cannot get games`, 'Games is undefined', 404);
  return games;
}

export async function getGameById(game_id: string): Promise<GameTable> {
  const game = await db.selectFrom('games').selectAll().where('game_id', '=', game_id).executeTakeFirst();
  if (!game || game === undefined) throwErrorException(`[repository.game.getGameById] cannot find game with ID ${game_id}`, 'Game not found', 404);
  return game!;
}

export async function createGame(game: GameTable): Promise<GameTable> {
  console.log('creating game');
  const newGame = await db
    .insertInto('games')
    .values({
      game_id: game.game_id,
      game_name: game.game_name,
      is_supported: game.is_supported,
      cover_id: game.cover_id,
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

export async function updateGame(game_id: string, game: Omit<GameTable, 'game_id' | 'created_at' | 'updated_at' | 'cover_id'>): Promise<GameTable> {
  const updatedGame = await db
    .updateTable('games')
    .set({
      game_name: game.game_name,
      is_supported: game.is_supported,
      summary: game.summary,
      release_date: game.release_date,
      updated_at: new Date(),
    })
    .where('game_id', '=', game_id)
    .returningAll()
    .executeTakeFirst();
  if (!updatedGame || updatedGame === undefined) throwErrorException(`[repository.game.updateGame] cannot update game`, 'Cannot update game', 500);
  return updatedGame!;
}

export async function deleteGame(game_id: string): Promise<void> {
  await db.deleteFrom('games').where('game_id', '=', game_id).executeTakeFirstOrThrow();
}

export async function doesGameExist(game_name: string, game_summary: string): Promise<boolean> {
  const game = await db.selectFrom('games').selectAll().where('game_name', '=', game_name).where('summary', '=', game_summary).executeTakeFirst();
  return !!game;
}

export async function getNNewestGames(n: number): Promise<GameTable[]> {
  const newestGames = await db.selectFrom('games').selectAll().orderBy('release_date', 'desc').limit(n).execute();
  if (!newestGames || newestGames.length === 0) throwErrorException(`[repository.game.getNNewestGames] cannot find newest games`, 'No games found', 404);
  return newestGames;
}
