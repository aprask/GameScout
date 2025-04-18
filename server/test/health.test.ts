import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';

const request = supertest(app);

describe('Health Routes', () => {
  it('GET /health should return server health status', async () => {
    const res = await request.get('/api/v1/health').send();
    assert.strictEqual(res.status, 200);
  });
});
