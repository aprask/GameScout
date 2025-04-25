import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { app } from '../src/index.js';
import * as dotenv from 'dotenv';
import * as utilRepo from '../src/repository/util.js';
import { migrateToLatest } from '../src/data/migrate.js';

dotenv.config();
const request = supertest(app);

describe('Articles Routes', () => {
  before(async () => {
    await migrateToLatest();
    await utilRepo.truncateDb();
  });

  beforeEach(async () => {
    await utilRepo.truncateDb();
  });

  after(async () => {
    await utilRepo.truncateDb();
  });

  it('should fetch all articles', async () => {
    const response = await request.get('/api/v1/community/articles');
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.articles));
  });

  it('should fetch a single article by ID', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });
    const userId = userRes.body.new_user.user_id;

    const articleRes = await request.post('/api/v1/community/articles').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      article_title: 'Test Article',
      article_owner: userId,
      article_content: 'This is a test article.',
    });

    const articleId = articleRes.body.new_article.article_id;

    const res = await request.get(`/api/v1/community/articles/${articleId}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.article);
    assert.equal(res.body.article.article_id, articleId);
  });

  it('should create a new article', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });
    const userId = userRes.body.new_user.user_id;

    const res = await request.post('/api/v1/community/articles').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      article_title: 'Test Article',
      article_owner: userId,
      article_content: 'This is a test article.',
    });

    const newArticle = res.body.new_article;

    assert.equal(res.status, 201);
    assert.ok(res.body.new_article);
    assert.equal(res.body.new_article.article_title, newArticle.article_title);
  });

  it('should update an existing article', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });
    const userId = userRes.body.new_user.user_id;

    const originalArticleRes = await request.post('/api/v1/community/articles').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      article_title: 'Test Article',
      article_owner: userId,
      article_content: 'This is a test article.',
    });
    const articleId = originalArticleRes.body.new_article.article_id;

    const res = await request.put(`/api/v1/community/articles/${articleId}`).set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      article_title: 'Updated Article',
      article_owner: userId,
      article_content: 'This is an Updated article.',
    });

    assert.equal(res.status, 200);
    assert.ok(res.body.updated_article);
    assert.equal(res.body.updated_article.article_title, 'Updated Article');
    assert.equal(res.body.updated_article.article_content, 'This is an Updated article.');
  });

  it('should delete an article by admin_id', async () => {
    const preAdminRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'adminuser@example.com',
      password: 'securepassword',
    });
    assert.strictEqual(preAdminRes.status, 201);

    const adminRes = await request.post('/api/v1/admin').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      user_id: preAdminRes.body.new_user.user_id,
    });

    const adminId = adminRes.body.new_admin.admin_id;

    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });
    const userId = userRes.body.new_user.user_id;

    const articleRes = await request.post('/api/v1/community/articles').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      article_title: 'Test Article',
      article_owner: userId,
      article_content: 'This is a test article.',
    });
    const articleId = articleRes.body.new_article.article_id;

    const response = await request.delete(`/api/v1/community/articles/${articleId}?admin_id=${adminId}`).set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 204);
  });

  it('should delete an article by owner id', async () => {
    const userRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'user@example.com',
      password: 'securepassword',
    });
    const userId = userRes.body.new_user.user_id;

    const articleRes = await request.post('/api/v1/community/articles').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      article_title: 'Test Article',
      article_owner: userId,
      article_content: 'This is a test article.',
    });
    const articleId = articleRes.body.new_article.article_id;

    const response = await request
      .delete(`/api/v1/community/articles/${articleId}?article_owner=${userId}`)
      .set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 204);
  });
});
