import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';
import { db } from '../src/data/db.js';
import { v4 as uuidv4 } from 'uuid';

const gameId = uuidv4();

dotenv.config();
const request = supertest(app);

describe('Review Routes', () => {
  before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  });

  beforeEach(async () => {
    await utilRepo.truncateDb();
    console.log('before');

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
    console.log('after');
  });

  after(async () => {
    await utilRepo.truncateDb();
    await db.destroy();
  });

  it('POST /api/v1/review should create a review', async () => {
    console.log('1');

    const user = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });
    console.log('2');

    const review = await request.post('api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user.body.new_user.user_id,
      game_id: gameId,
      rating: 5,
      review_text: 'Good Game',
    });

    assert.equal(review.status, 201);
  });

  it('GET /api/v1/review should return an array', async () => {
    console.log('3');

    const response = await request.get('/api/v1/game').set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.reviews));
  });
});
