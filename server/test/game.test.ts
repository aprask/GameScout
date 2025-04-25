import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';
import { db } from '../src/data/db.js';
import { v4 as uuidv4 } from 'uuid';

const uuid1 = uuidv4();

dotenv.config();
const request = supertest(app);

describe('Game Routes', () => {
  before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  });

  beforeEach(async () => {
    await utilRepo.truncateDb();
    await db
      .insertInto('games')
      .values({
        game_id: uuid1,
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
  });

  it('should fetch all games', async () => {
    const response = await request.get('/api/v1/game').set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.games));
  });

  it('should fetch a game by ID', async () => {
    const response = await request.get(`/api/v1/game/${uuid1}`).set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.strictEqual(response.body.game.game_name, 'Game 1');
  });

  it('should delete a game', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'adminuser@example.com',
      password: 'securepassword',
    });
    assert.strictEqual(userRes.status, 201);

    const adminRes = await request.post('/api/v1/admin').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: userRes.body.new_user.user_id,
    });

    const adminId = adminRes.body.new_admin.admin_id;

    const response = await request.delete(`/api/v1/game/${uuid1}?admin_id=${adminId}`).set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 204);
  });
});
