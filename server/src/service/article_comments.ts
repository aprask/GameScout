import { ArticleCommentTable } from "../data/models/models.js";
import * as commentRepo from "../repository/article_comments.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";

export async function getAllCommentsByArticleId(article_id: string): Promise<ArticleCommentTable[]> {
    if (!validate(article_id)) throwErrorException(`[service.articleComment.getAllCommentsByArticleId] Invalid UUID: ${article_id}`, 'Invalid article ID', 400);
    return commentRepo.getAllCommentsByArticleId(article_id);
}

export async function getCommentByCommentId(comment_id: string): Promise<ArticleCommentTable> {
    if (!validate(comment_id)) throwErrorException(`[service.articleComment.getCommentByCommentId] Invalid UUID: ${comment_id}`, 'Invalid comment ID', 400);
    return commentRepo.getCommentByCommentId(comment_id);
}

export async function createComment(comment_owner: string, commented_article: string, comment_content: string): Promise<ArticleCommentTable> {
    let errorMessage = '';
    if (!comment_owner) errorMessage += "Comment owner not given";
    if (!commented_article) errorMessage += "Article ID not given";
    if (!comment_content) errorMessage += "Comment content not given";
    if (!validate(comment_owner)) errorMessage += "Comment owner ID is invalid";
    if (!validate(commented_article)) errorMessage += "Article ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.articleComment.createComment] ${errorMessage}`, 'Cannot create comment', 400);
    }

    const currentDate = new Date();
    const newComment: ArticleCommentTable = {
        comment_id: uuidv4(),
        comment_owner,
        commented_article,
        comment_content,
        created_at: currentDate,
        updated_at: currentDate
    };

    return commentRepo.createComment(newComment);
}

export async function updateComment(
    comment_id: string,
    comment_owner: string,
    commented_article: string,
    comment_content: string
): Promise<ArticleCommentTable> {
    let errorMessage = '';
    if (!comment_id) errorMessage += "Comment ID not given";
    if (!validate(comment_id)) errorMessage += "Comment ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.articleComment.updateComment] ${errorMessage}`, 'Cannot update comment', 400);
    }

    const currentComment = await commentRepo.getCommentByCommentId(comment_id);
    const updatedComment: Omit<ArticleCommentTable, 'comment_id' | 'created_at' | 'updated_at'> = {
        comment_owner: comment_owner ?? currentComment.comment_owner,
        commented_article: commented_article ?? currentComment.commented_article,
        comment_content: comment_content ?? currentComment.comment_content
    };

    return commentRepo.updateComment(comment_id, updatedComment);
}

export async function deleteComment(comment_id: string): Promise<void> {
    if (!validate(comment_id)) throwErrorException(`[service.articleComment.deleteComment] Invalid UUID: ${comment_id}`, 'Invalid comment ID', 400);
    return commentRepo.deleteComment(comment_id);
}
