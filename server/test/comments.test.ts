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

describe('Article Comments Routes', () => {
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

  it('should fetch all comments for an article', async () => {
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

    await request.post('/api/v1/community/articles/comment').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      comment_owner: userId,
      commented_article: articleId,
      comment_content: 'This is a test comment.',
    });

    const response = await request.get(`/api/v1/community/articles/comments/by-article/${articleId}`);
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.comments));
  });

  it('should fetch a single comment by ID', async () => {
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

    const commentRes = await request.post('/api/v1/community/articles/comment').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      comment_owner: userId,
      commented_article: articleId,
      comment_content: 'This is a test comment.',
    });
    const commentId = commentRes.body.new_comment.comment_id;

    const response = await request.get(`/api/v1/community/articles/comment/${commentId}`);
    assert.equal(response.status, 200);
    assert.ok(response.body.comment);
    assert.equal(response.body.comment.comment_id, commentId);
  });

  it('should create a new comment', async () => {
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

    const response = await request.post('/api/v1/community/articles/comment').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      comment_owner: userId,
      commented_article: articleId,
      comment_content: 'This is a test comment.',
    });

    const newComment = response.body.new_comment;

    assert.equal(response.status, 201);
    assert.ok(newComment);
    assert.equal(newComment.comment_content, 'This is a test comment.');
  });

  it('should update an existing comment', async () => {
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

    const commentRes = await request.post('/api/v1/community/articles/comment').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      comment_owner: userId,
      commented_article: articleId,
      comment_content: 'This is a test comment.',
    });
    const commentId = commentRes.body.new_comment.comment_id;

    const response = await request.put(`/api/v1/community/articles/comment/${commentId}`).set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      comment_owner: userId,
      commented_article: articleId,
      comment_content: 'This is an updated comment.',
    });

    assert.equal(response.status, 200);
    assert.ok(response.body.updated_comment);
    assert.equal(response.body.updated_comment.comment_content, 'This is an updated comment.');
  });

  it('should delete a comment by admin_id', async () => {
    const preAdminRes = await request.post('/api/v1/users').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      email: 'adminuser@example.com',
      password: 'securepassword',
    });
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

    const commentRes = await request.post('/api/v1/community/articles/comment').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      comment_owner: userId,
      commented_article: articleId,
      comment_content: 'This is a test comment.',
    });
    const commentId = commentRes.body.new_comment.comment_id;

    const response = await request
      .delete(`/api/v1/community/articles/comment/${commentId}?admin_id=${adminId}`)
      .set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 204);
  });

  it('should delete a comment by owner id', async () => {
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

    const commentRes = await request.post('/api/v1/community/articles/comment').set('Authorization', process.env.API_MANAGEMENT_KEY!).send({
      comment_owner: userId,
      commented_article: articleId,
      comment_content: 'This is a test comment.',
    });
    const commentId = commentRes.body.new_comment.comment_id;

    const response = await request
      .delete(`/api/v1/community/articles/comment/${commentId}?comment_owner=${userId}`)
      .set('Authorization', process.env.API_MANAGEMENT_KEY!);
    assert.equal(response.status, 204);
  });
});
