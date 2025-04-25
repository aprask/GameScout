import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';
import { db } from '../src/data/db.js';

dotenv.config();
const request = supertest(app);
const API_KEY = process.env.API_MANAGEMENT_KEY;

describe('User Routes', () => {
  before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  });

  beforeEach(async () => {
    await utilRepo.truncateDb();
  });

  after(async () => {
    await utilRepo.truncateDb();
    await db.destroy();
  });

  it('POST /api/v1/users should create a new user', async () => {
    const res = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.new_user.email, 'user@example.com');
  });

  it('GET /api/v1/users should create and return a list of users', async () => {
    let res = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      email: 'test@example.com',
      password: 'password123',
    });
    assert.strictEqual(res.status, 201);

    res = await request.get('/api/v1/users').set('Authorization', API_KEY!).send();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.users.length, 1);
  });

  it('GET /api/v1/users/:user_id should return a specific user', async () => {
    let res = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      email: 'test@example.com',
      password: 'password123',
    });
    const userId = res.body.new_user.user_id;

    res = await request.get(`/api/v1/users/${userId}`).set('Authorization', API_KEY!).send();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.user_id, userId);
  });

  it('GET /api/v1/users/:user_id should return 404 for invalid user', async () => {
    const res = await request.get('/api/v1/users/invalid-id').set('Authorization', API_KEY!).send();
    assert.strictEqual(res.status, 400);
  });

  it('POST /api/v1/users should fail with missing email', async () => {
    const res = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      password: 'securepassword',
    });
    assert.strictEqual(res.status, 400);
  });

  it('PUT /api/v1/users/:user_id should update a user', async () => {
    let res = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      email: 'update@example.com',
      password: 'password',
    });
    const userId = res.body.new_user.user_id;

    res = await request.put(`/api/v1/users/${userId}`).set('Authorization', API_KEY!).send({
      email: 'updated@example.com',
      password: 'newpassword',
      is_active: false,
      is_banned: true,
      last_login: new Date().toISOString(),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.updated_user.email, 'updated@example.com');
  });

  it('DELETE /api/v1/users/:user_id should delete a user by client_secret', async () => {
    let res = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      email: 'deleteuser@example.com',
      password: 'deletepass',
    });
    const userToDeleteId = res.body.new_user.user_id;
    const userToDeleteSecret = res.body.new_user.client_secret;
    assert.strictEqual(res.status, 201);

    res = await request.delete(`/api/v1/users/${userToDeleteId}?client_secret=${userToDeleteSecret}`).set('Authorization', API_KEY!).send();
    assert.strictEqual(res.status, 204);

    res = await request.get(`/api/v1/users/${userToDeleteId}`).set('Authorization', API_KEY!).send();
    assert.strictEqual(res.status, 404);
  });

  it('DELETE /api/v1/users/:user_id should delete a user by admin_id', async () => {
    const preAdminRes = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      email: 'admin@example.com',
      password: 'admin',
    });
    const adminRes = await request.post('/api/v1/admin').set('Authorization', API_KEY!).send({
      user_id: preAdminRes.body.new_user.user_id,
    });
    const toDeleteRes = await request.post('/api/v1/users').set('Authorization', API_KEY!).send({
      email: 'deleteuser@example.com',
      password: 'delete',
    });

    const userToDeleteId = toDeleteRes.body.new_user.user_id;
    assert.strictEqual(toDeleteRes.status, 201);

    const adminId = adminRes.body.new_admin.admin_id;

    let res = await request.delete(`/api/v1/users/${userToDeleteId}?admin_id=${adminId}`).set('Authorization', API_KEY!).send();
    assert.strictEqual(res.status, 204);

    res = await request.get(`/api/v1/users/${userToDeleteId}`).set('Authorization', API_KEY!).send();
    assert.strictEqual(res.status, 404);
  });
});
