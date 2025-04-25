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
  });

  after(async () => {
    await utilRepo.truncateDb();
    await db.destroy();
  });

  it('POST /api/v1/review should create a review', async () => {
    const user = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });

    const review = await request.post('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user.body.new_user.user_id,
      game_id: gameId,
      rating: 5,
      review_text: 'Good Game',
    });

    assert.equal(review.status, 201);
  });

  it('GET /api/v1/review should return an array', async () => {
    const user1 = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user1@example.com',
      password: 'securepassword',
    });

    const review1 = await request.post('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user1.body.new_user.user_id,
      game_id: gameId,
      rating: 5,
      review_text: 'Good Game',
    });

    const user2 = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user2@example.com',
      password: 'securepassword',
    });

    const review2 = await request.post('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user2.body.new_user.user_id,
      game_id: gameId,
      rating: 2,
      review_text: 'Bad Game',
    });

    const response = await request.get('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.reviews));
  });

  it('GET /api/v1/review/game/:gameId should return reviews by game', async () => {
    const user = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });

    const review = await request.post('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user.body.new_user.user_id,
      game_id: gameId,
      rating: 5,
      review_text: 'Good Game',
    });

    const response = await request.get(`/api/v1/review/game/${gameId}`).set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.ok(response);
    assert.strictEqual(response.body.reviews[0].rating, 5);
  });

  it('PUT /api/v1/review/:review_id should update a review', async () => {
    const user = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });

    const review = await request.post('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user.body.new_user.user_id,
      game_id: gameId,
      rating: 5,
      review_text: 'Good Game',
    });

    const updatedReview = await request.put(`/api/v1/review/${review.body.new_review.review_id}`).set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user.body.new_user.user_id,
      game_id: gameId,
      rating: 4,
      review_text: 'Great Game',
    });

    assert.equal(updatedReview.status, 200);
    assert.strictEqual(updatedReview.body.updated_review.rating, 4);
  });

  it('GET /api/v1/review/:review_id should return a review by ID', async () => {
    const user = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });

    const review = await request.post('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user.body.new_user.user_id,
      game_id: gameId,
      rating: 5,
      review_text: 'Good Game',
    });

    const response = await request.get(`/api/v1/review/${review.body.new_review.review_id}`).set('Authorization', process.env.API_MANAGEMENT_KEY!);

    assert.equal(response.status, 200);
    assert.strictEqual(response.body.review.review_id, review.body.new_review.review_id);
  });

  it('DELETE /api/v1/review/:review_id should delete a review', async () => {
    const user = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });

    const review = await request.post('/api/v1/review').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: user.body.new_user.user_id,
      game_id: gameId,
      rating: 5,
      review_text: 'Good Game',
    });

    const deleteResponse = await request
      .delete(`/api/v1/review/${review.body.new_review.review_id}`)
      .set('Authorization', process.env.API_MANAGEMENT_KEY!)
      .query({ user_id: user.body.new_user.user_id });

    assert.equal(deleteResponse.status, 204);

    const getResponse = await request.get(`/api/v1/review/${review.body.new_review.review_id}`).set('Authorization', process.env.API_MANAGEMENT_KEY!);

    assert.equal(getResponse.status, 404);
  });
});
