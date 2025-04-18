import { before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';

dotenv.config();
const request = supertest(app);

describe('Game Routes', () => {
  before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  });

  beforeEach(async () => {
    await utilRepo.truncateDb();
  });

  it('GET /games should return a list of games', async () => {
    const res = await request.get('/api/v1/games').send();
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.games));
  });

  it('POST /games should create a new game', async () => {
    const res = await request.post('/api/v1/games').send({
      name: 'Test Game',
      genre: 'Action',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.game.name, 'Test Game');
  });
});
