import { before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';

dotenv.config();
const request = supertest(app);

describe('Auth Routes', () => {
  before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  });

  beforeEach(async () => {
    await utilRepo.truncateDb();
  });

  it('POST /auth/login should log in a user', async () => {
    await request.post('/api/v1/users').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request.post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
  });

  it('POST /auth/login should fail with invalid credentials', async () => {
    const res = await request.post('/api/v1/auth/login').send({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });
    assert.strictEqual(res.status, 401);
  });
});
