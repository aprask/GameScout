const router = express.Router();
import asyncHandler from 'express-async-handler';
import { authMiddleware } from '../middleware/auth.js';
import express, { RequestHandler } from 'express';
import { resourceSharer } from '../middleware/resource.js';
router.use(resourceSharer);
router.use(authMiddleware as RequestHandler);

import * as articleService from '../service/articles.js';
import * as commentService from '../service/article_comments.js';

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const articles = await articleService.getAllArticles();
    res.status(200).json({ articles });
  }),
);

router.get(
  '/new',
  asyncHandler(async (req, res) => {
    let n: number = 0;
    if (typeof +req.query.n! === 'number') n = +req.query.n!;

    const articles = await articleService.getNNewestArticles(n);
    res.status(200).json({ articles: articles });
  }),
);

router.get(
  '/:article_id',
  asyncHandler(async (req, res) => {
    const article = await articleService.getArticleById(req.params.article_id);
    res.status(200).json({ article });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { article_title, article_owner, article_content } = req.body;
    const newArticle = await articleService.createArticle(article_title, article_owner, article_content);
    res.status(201).json({ new_article: newArticle });
  }),
);

router.put(
  '/:article_id',
  asyncHandler(async (req, res) => {
    const { article_title, article_owner, article_content } = req.body;
    const updatedArticle = await articleService.updateArticle(req.params.article_id, article_title, article_owner, article_content);
    res.status(200).json({ updated_article: updatedArticle });
  }),
);

router.delete(
  '/:article_id',
  asyncHandler(async (req, res) => {
    const { article_id } = req.params;
    let admin_id: string | null = null;
    let article_owner: string | null = null;

    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    if (typeof req.query.article_owner === 'string') article_owner = req.query.article_owner;

    await articleService.deleteArticle(article_id, article_owner, admin_id);
    res.sendStatus(204);
  }),
);

router.get(
  '/comments/by-article/:article_id',
  asyncHandler(async (req, res) => {
    const comments = await commentService.getAllCommentsByArticleId(req.params.article_id);
    res.status(200).json({ comments });
  }),
);

router.get(
  '/comment/:comment_id',
  asyncHandler(async (req, res) => {
    const comment = await commentService.getCommentByCommentId(req.params.comment_id);
    res.status(200).json({ comment });
  }),
);

router.post(
  '/comment',
  asyncHandler(async (req, res) => {
    const { comment_owner, commented_article, comment_content } = req.body;
    const newComment = await commentService.createComment(comment_owner, commented_article, comment_content);
    res.status(201).json({ new_comment: newComment });
  }),
);

router.put(
  '/comment/:comment_id',
  asyncHandler(async (req, res) => {
    const { comment_owner, commented_article, comment_content } = req.body;
    const updatedComment = await commentService.updateComment(req.params.comment_id, comment_owner, commented_article, comment_content);
    res.status(200).json({ updated_comment: updatedComment });
  }),
);

router.delete(
  '/comment/:comment_id',
  asyncHandler(async (req, res) => {
    const { comment_id } = req.params;
    let admin_id: string | null = null;
    let comment_owner: string | null = null;

    if (typeof req.query.admin_id === 'string') admin_id = req.query.admin_id;
    if (typeof req.query.comment_owner === 'string') comment_owner = req.query.comment_owner;

    await commentService.deleteComment(comment_id, comment_owner, admin_id);
    res.sendStatus(204);
  }),
);

export default router;
