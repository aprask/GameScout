import { ArticleCommentTable } from "../data/models/models.js";
import * as commentRepo from "../repository/article_comments.js";
import * as adminRepo from "../repository/admin.js";
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

export async function deleteComment(comment_id: string, comment_owner: string | null, admin_id: string | null): Promise<void> {
    if (!validate(comment_id)) throwErrorException(`[service.articleComment.deleteComment] Invalid UUID: ${comment_id}`, 'Invalid comment ID', 400);
    if (admin_id) {
        if (!validate(admin_id)) throwErrorException(`[service.articleComment.deleteComment] Invalid UUID: ${comment_id}`, 'Invalid admin ID', 400);
        if (!(await adminRepo.getAdminById(admin_id))) throwErrorException(`[service.articleComment.deleteComment] Admin ID invalid: ${admin_id}`, 'Admin ID is invalid', 403);
        else commentRepo.deleteComment(comment_id);
    }
    else if (comment_owner) {
        if (!validate(comment_owner)) throwErrorException(`[service.articleComment.deleteComment] Invalid UUID: ${comment_id}`, 'Invalid User ID', 400);
        if (!(await commentRepo.verifyCommentOwnership(comment_owner, comment_id))) throwErrorException(`[service.articleComment.deleteComment] User does not own comment: ${comment_id}`, 'User ID and Comment ID mismatch', 403);
        else commentRepo.deleteComment(comment_id);
    }
    else throwErrorException(`[service.articleComment.deleteComment] No valid ID providded`, 'Cannot delete article', 403);
}