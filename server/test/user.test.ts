import { before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';

dotenv.config();
const request = supertest(app);

describe('User Routes', () => {
before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  })

  beforeEach(async () => {
    await utilRepo.truncateDb();
  });

  it('GET /users should return a list of users', async () => {
    let res = await request.post('/api/v1/users').send({
      email: 'test@example.com',
      password: 'password123'
    });
    assert.strictEqual(res.status, 201);

    res = await request.get('/api/v1/users').send();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.users.length, 1);
  });

  it('GET /users/:user_id should return a specific user', async () => {
    let res = await request.post('/api/v1/users').send({
      email: 'test@example.com',
      password: 'password123'
    });
    const userId = res.body.new_user.user_id;

    res = await request.get(`/api/v1/users/${userId}`).send();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.user_id, userId);
  });

  it('GET /users/:user_id should return 404 for invalid user', async () => {
    const res = await request.get('/api/v1/users/invalid-id').send();
    assert.strictEqual(res.status, 400);
  });

  it('POST /users should create a new user', async () => {
    const res = await request.post('/api/v1/users').send({
      email: 'user@example.com',
      password: 'securepassword'
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.new_user.email, 'user@example.com');
  });

  it('POST /users should fail with missing email', async () => {
    const res = await request.post('/api/v1/users').send({
      password: 'securepassword'
    });
    assert.strictEqual(res.status, 400);
  });

  it('PUT /users/:user_id should update a user', async () => {
    let res = await request.post('/api/v1/users').send({
      email: 'update@example.com',
      password: 'password'
    });
    const userId = res.body.new_user.user_id;

    res = await request.put(`/api/v1/users/${userId}`).send({
      email: 'updated@example.com',
      password: 'newpassword',
      is_active: false,
      is_banned: true,
      last_login: new Date().toISOString()
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.updated_user.email, 'updated@example.com');
  });

  it('PUT /users/:user_id should fail with invalid user ID', async () => {
    const res = await request.put('/api/v1/users/invalid-id').send({
      email: 'invalid@example.com',
      password: 'pass'
    });
    assert.strictEqual(res.status, 500);
  });

  it('DELETE /users/:user_id should delete a user by admin_id', async () => {
    let res = await request.post('/api/v1/users').send({
      email: 'deleteuser@example.com',
      password: 'deletepass'
    });
    const userToDeleteId = res.body.new_user.user_id;
    const userToDeleteSecret = res.body.new_user.client_secret;
    assert.strictEqual(res.status, 201);

    res = await request.delete(`/api/v1/users/${userToDeleteId}?admin_id=somethignwrong`).send();
    assert.strictEqual(res.status, 403);

    res = await request.delete(`/api/v1/users/${userToDeleteId}?client_secret=${userToDeleteSecret}`).send();
    assert.strictEqual(res.status, 204);
  });
  
});