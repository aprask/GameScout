import { db } from "../data/db.js";
import { ArticleCommentTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllCommentsByArticleId(id: string): Promise<ArticleCommentTable[]> {
    const comments = await db
        .selectFrom("article_comments")
        .selectAll()
        .where('article_comments.commented_article', '=', id)
        .execute();
    if (comments === undefined) throwErrorException(`[repository.article_comments.getAllCommentsByArticleId] cannot get comments`, 'Comments is undefined', 404);
    return comments;
}

export async function getCommentByCommentId(id: string): Promise<ArticleCommentTable> {
    const comment = await db
        .selectFrom('article_comments')
        .selectAll()
        .where('article_comments.comment_id', '=', id)
        .executeTakeFirst();
    if (!comment || comment === undefined) throwErrorException(`[repository.article_comments.getCommentByCommentId] cannot find comment with ID ${id}`, 'Comment not found', 404);
    return comment!;
}

export async function createComment(comment: ArticleCommentTable): Promise<ArticleCommentTable> {
    const newComment = await db
        .insertInto('article_comments')
        .values({
            comment_id: comment.comment_id,
            comment_owner: comment.comment_owner,
            commented_article: comment.commented_article,
            comment_content: comment.comment_content,
            created_at: comment.created_at,
            updated_at: comment.updated_at
        })
        .returningAll()
        .executeTakeFirst();
    if (!newComment || newComment === undefined) throwErrorException(`[repository.article_comments.createComment] cannot create comment`, 'Cannot create comment', 500);
    return newComment!;
}

export async function updateComment(comment_id: string, comment: Omit<ArticleCommentTable, 'comment_id' | 'created_at' | 'updated_at'>): Promise<ArticleCommentTable> {
    const updatedComment = await db
        .updateTable('article_comments')
        .set({
            comment_owner: comment.comment_owner,
            commented_article: comment.commented_article,
            comment_content: comment.comment_content,
            updated_at: new Date()  
        })
        .where('article_comments.comment_id', '=', comment_id)
        .returningAll()
        .executeTakeFirst();
    if (!updatedComment || updatedComment === undefined) throwErrorException(`[repository.article_comments.updateComment] cannot update comment`, 'Cannot update comment', 500);
    return updatedComment!;
}

export async function deleteComment(id: string): Promise<void> {
    await db
        .deleteFrom('article_comments')
        .where('article_comments.comment_id', '=', id)
        .executeTakeFirstOrThrow();
}