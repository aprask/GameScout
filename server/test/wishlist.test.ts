import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';
import { db } from '../src/data/db.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const request = supertest(app);
const API_KEY = process.env.API_MANAGEMENT_KEY;

const gameId = uuidv4();
const userId = uuidv4();

describe('Wishlist Routes', () => {
  before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  });

  beforeEach(async () => {
    await utilRepo.truncateDb();
    await db
      .insertInto('games')
      .values({
        game_id: gameId,
        game_name: 'Game 1',
        is_supported: true,
        cover_id: 'cover1',
        summary: 'This is game 1',
        release_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();

    await db
      .insertInto('user')
      .values({
        user_id: userId,
        email: 'user@example.com',
        password: 'securepassword',
        created_at: new Date(),
        updated_at: new Date(),
        last_login: new Date(),
        is_active: true,
        is_banned: false,
        client_secret: 'secret',
      })
      .execute();
  });

  after(async () => {
    await utilRepo.truncateDb();
    await db.destroy();
  });

  it('POST /api/v1/wishlist should create a wishlist', async () => {
    const response = await request.post('/api/v1/wishlist').set('Authorization', API_KEY!).query({ owner_id: userId }).send({ game_id: gameId });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.new_wishlist.user_id, userId);
    assert.strictEqual(response.body.new_wishlist.game_id, gameId);
  });

  it('GET /api/v1/wishlist should return all wishlists', async () => {
    await request.post('/api/v1/wishlist').set('Authorization', API_KEY!).query({ owner_id: userId }).send({ game_id: gameId });

    const response = await request.get('/api/v1/wishlist').set('Authorization', API_KEY!);

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body.wishlists));
    assert.strictEqual(response.body.wishlists.length, 1);
  });

  it('GET /api/v1/wishlist/:wishlist_id should return a specific wishlist', async () => {
    const createResponse = await request.post('/api/v1/wishlist').set('Authorization', API_KEY!).query({ owner_id: userId }).send({ game_id: gameId });

    const wishlistId = createResponse.body.new_wishlist.wishlist_id;

    const response = await request.get(`/api/v1/wishlist/${wishlistId}`).set('Authorization', API_KEY!);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.wishlist.wishlist_id, wishlistId);
  });

  it('PUT /api/v1/wishlist/:wishlist_id should update a wishlist', async () => {
    const createResponse = await request.post('/api/v1/wishlist').set('Authorization', API_KEY!).query({ owner_id: userId }).send({ game_id: gameId });

    const wishlistId = createResponse.body.new_wishlist.wishlist_id;
    const newGameId = uuidv4();

    await db
      .insertInto('games')
      .values({
        game_id: newGameId,
        game_name: 'Game 2',
        is_supported: true,
        cover_id: 'cover2',
        summary: 'This is game 2',
        release_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();

    const response = await request.put(`/api/v1/wishlist/${wishlistId}`).set('Authorization', API_KEY!).send({ user_id: userId, game_id: newGameId });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.updated_wishlist.game_id, newGameId);
  });
});
