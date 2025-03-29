import { ArticleTable } from "../data/models/models.js";
import * as articleRepo from "../repository/articles.js";
import * as adminRepo from "../repository/admin.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";

export function getAllArticles(): Promise<ArticleTable[]> {
    return articleRepo.getAllArticles();
}

export async function getArticleById(article_id: string): Promise<ArticleTable> {
    if (!validate(article_id)) throwErrorException(`[service.articles.getArticleById] Invalid UUID: ${article_id}`, 'Invalid article ID', 400);
    return articleRepo.getArticleById(article_id);
}

export async function createArticle(article_title: string, article_owner: string, article_content: string | null): Promise<ArticleTable> {
    let errorMessage = '';
    if (!article_title) errorMessage += "Article title not given";
    if (!article_owner) errorMessage += "Article owner not given";
    if (!validate(article_owner)) errorMessage += "Article owner ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.articles.createArticle] ${errorMessage}`, 'Cannot create article', 400);
    }

    const currentDate = new Date();
    const newArticle: ArticleTable = {
        article_id: uuidv4(),
        article_title,
        article_owner,
        article_content,
        created_at: currentDate,
        updated_at: currentDate
    };

    return articleRepo.createArticle(newArticle);
}

export async function updateArticle(article_id: string, article_title: string, article_owner: string, article_content: string | null): Promise<ArticleTable> {
    let errorMessage = '';
    if (!article_id) errorMessage += "Article ID not given";
    if (!validate(article_id)) errorMessage += "Article ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.articles.updateArticle] ${errorMessage}`, 'Cannot update article', 400);
    }

    const currentArticle = await articleRepo.getArticleById(article_id);
    const updatedArticle: Omit<ArticleTable, 'article_id' | 'created_at' | 'updated_at'> = {
        article_title: article_title ?? currentArticle.article_title,
        article_owner: article_owner ?? currentArticle.article_owner,
        article_content: article_content ?? currentArticle.article_content
    };

    return articleRepo.updateArticle(article_id, updatedArticle);
}

export async function deleteArticle(article_id: string, article_owner: string | null, admin_id: string | null): Promise<void> {
    if (!validate(article_id)) throwErrorException(`[service.articles.deleteArticle] Invalid UUID: ${article_id}`, 'Invalid article ID', 400);
    if (admin_id && validate(admin_id)) {
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.articles.deleteArticle] Admin ID invalid: ${admin_id}`, 'Admin ID invalid', 403);
        else articleRepo.deleteArticle(article_id);
    }
    else if (article_owner) {
        if (!validate(article_owner)) throwErrorException(`[service.articles.deleteArticle] Invalid UUID: ${article_owner}`, 'Invalid User ID', 400);
        if (!(await articleRepo.verifyArticleOwnership(article_owner, article_id))) throwErrorException(`[service.articles.deleteArticle] User does not own article: ${article_id}`, 'User ID and Article ID mismatch', 403);
        else articleRepo.deleteArticle(article_id);
    }
    else throwErrorException(`[service.articles.deleteArticle] No valid ID providded`, 'Cannot delete article', 403);
}
