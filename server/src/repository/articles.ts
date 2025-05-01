import { db } from '../data/db.js';
import { ArticleTable } from '../data/models/models.js';
import { throwErrorException } from '../util/error.js';

export async function getAllArticles(): Promise<ArticleTable[]> {
  const articles = await db.selectFrom('articles').selectAll().execute();
  if (articles === undefined) throwErrorException(`[repository.article.getAllArticles] cannot get articles`, 'Articles is undefined', 404);
  return articles;
}

export async function getArticlesByUserId(user_id: string): Promise<ArticleTable[]> {
  const articles = await db.selectFrom('articles').selectAll().execute();
  if (articles === undefined)
    throwErrorException(`[repository.article.getArticlesByUserId] cannot get articles from user ID ${user_id}`, 'Articles is undefined', 404);
  return articles;
}

export async function verifyArticleOwnership(user_id: string, article_id: string): Promise<boolean> {
  const article = await db
    .selectFrom('articles')
    .selectAll()
    .where('articles.article_id', '=', article_id)
    .where('articles.article_owner', '=', user_id)
    .executeTakeFirst();
  if (!article) return false;
  return true;
}

export async function getArticleById(article_id: string): Promise<ArticleTable> {
  const article = await db.selectFrom('articles').selectAll().where('article_id', '=', article_id).executeTakeFirst();
  if (!article || article === undefined)
    throwErrorException(`[repository.article.getArticleById] cannot find article with ID ${article_id}`, 'Article not found', 404);
  return article!;
}

export async function createArticle(article: ArticleTable): Promise<ArticleTable> {
  const newArticle = await db
    .insertInto('articles')
    .values({
      article_id: article.article_id,
      article_title: article.article_title,
      article_owner: article.article_owner,
      article_content: article.article_content,
      created_at: article.created_at,
      updated_at: article.updated_at,
    })
    .returningAll()
    .executeTakeFirst();
  if (!newArticle || newArticle === undefined) throwErrorException(`[repository.article.createArticle] cannot create article`, 'Cannot create article', 500);
  return newArticle!;
}

export async function updateArticle(article_id: string, article: Omit<ArticleTable, 'article_id' | 'created_at' | 'updated_at'>): Promise<ArticleTable> {
  const updatedArticle = await db
    .updateTable('articles')
    .set({
      article_title: article.article_title,
      article_owner: article.article_owner,
      article_content: article.article_content,
      updated_at: new Date(),
    })
    .where('article_id', '=', article_id)
    .returningAll()
    .executeTakeFirst();
  if (!updatedArticle || updatedArticle === undefined)
    throwErrorException(`[repository.article.updateArticle] cannot update article`, 'Cannot update article', 500);
  return updatedArticle!;
}

export async function deleteArticle(article_id: string): Promise<void> {
  await db.deleteFrom('articles').where('article_id', '=', article_id).executeTakeFirstOrThrow();
}

export async function getNNewestArticles(n: number): Promise<ArticleTable[]> {
  const newestArticles = await db.selectFrom('articles').selectAll().orderBy('created_at', 'desc').limit(n).execute();
  if (!newestArticles || newestArticles.length === 0)
    throwErrorException(`[repository.game.getNNewestArticles] cannot find newest articles`, 'No articles found', 404);
  return newestArticles;
}
