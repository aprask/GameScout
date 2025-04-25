import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';
import { truncate } from 'node:fs';
import { db } from '../src/data/db.js';

dotenv.config();
const request = supertest(app);
//const API_KEY = process.env.API_MANAGMENT_KEY

describe('Admin Routes', () => {
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

  it('POST /api/v1/admin should create a new admin', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'adminuser@example.com',
      password: 'securepassword',
    });
    assert.strictEqual(userRes.status, 201);

    const res = await request.post('/api/v1/admin').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: userRes.body.new_user.user_id,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.new_admin.user_id, userRes.body.new_user.user_id);
  });

  it('GET /api/v1/admin should return all admins', async () => {
    const res = await request.get('/api/v1/admin').set('Authorization', process.env.API_MANAGEMENT_KEY!).send();
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.admins));
  });

  it('GET /api/v1/admin/adminid/:admin_id should return a specific admin', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'admin@GET.com',
      password: 'securepassword',
    });
    assert.strictEqual(userRes.status, 201);

    const adminRes = await request.post('/api/v1/admin').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: userRes.body.new_user.user_id,
    });

    assert.strictEqual(adminRes.status, 201);

    const res = await request.get(`/api/v1/admin/adminid/${adminRes.body.new_admin.admin_id}`).set('Authorization', process.env.API_MANAGEMENT_KEY!).send();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.admin.admin_id, adminRes.body.new_admin.admin_id);
  });

  it('DELETE /api/v1/admin/:admin_id should delete an admin', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'deleteadmin@example.com',
      password: 'securepassword',
    });
    assert.strictEqual(userRes.status, 201);

    const adminRes = await request.post('/api/v1/admin').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: userRes.body.new_user.user_id,
    });
    assert.strictEqual(adminRes.status, 201);

    const res = await request
      .delete(`/api/v1/admin/${adminRes.body.new_admin.admin_id}?admin_secret=${process.env.ADMIN_SECRET}`)
      .set('Authorization', process.env.API_MANAGEMENT_KEY!)
      .send();
    assert.strictEqual(res.status, 204);
  });

  it('PUT /api/v1/admin/:admin_id should update an admin key', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'admin@PUT.com',
      password: 'securepassword',
    });
    assert.strictEqual(userRes.status, 201);

    const adminRes = await request.post('/api/v1/admin').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: userRes.body.new_user.user_id,
    });
    assert.strictEqual(adminRes.status, 201);

    const newAdminKey = 'new-admin-key';
    const res = await request.put(`/api/v1/admin/${adminRes.body.new_admin.admin_id}`).set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      admin_key: newAdminKey,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.updated_admin.admin_key, newAdminKey);
  });
});
