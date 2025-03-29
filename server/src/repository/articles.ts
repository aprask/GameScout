import { db } from "../data/db.js";
import { ArticleTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllArticles(): Promise<ArticleTable[]> {
    const articles = await db
        .selectFrom("articles")
        .selectAll()
        .execute();
    if (articles === undefined) throwErrorException(`[repository.article.getAllArticles] cannot get articles`, 'Articles is undefined', 404);
    return articles;
}

export async function getArticleById(article_id: string): Promise<ArticleTable> {
    const article = await db
        .selectFrom("articles")
        .selectAll()
        .where("article_id", "=", article_id)
        .executeTakeFirst();
    if (!article || article === undefined) throwErrorException(`[repository.article.getArticleById] cannot find article with ID ${article_id}`, 'Article not found', 404);
    return article!;
}

export async function createArticle(article: ArticleTable): Promise<ArticleTable> {
    const newArticle = await db
        .insertInto("articles")
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
        .updateTable("articles")
        .set({
            article_title: article.article_title,
            article_owner: article.article_owner,
            article_content: article.article_content,
            updated_at: new Date()
        })
        .where("article_id", "=", article_id)
        .returningAll()
        .executeTakeFirst();
    if (!updatedArticle || updatedArticle === undefined) throwErrorException(`[repository.article.updateArticle] cannot update article`, 'Cannot update article', 500);
    return updatedArticle!;
}

export async function deleteArticle(article_id: string): Promise<void> {
    await db
        .deleteFrom("articles")
        .where("article_id", "=", article_id)
        .executeTakeFirstOrThrow();
}