import { UserTable, ReviewTable, WishlistTable, ProfileTable, FollowsTable, AdminTable, ImageTable, GameTable, ArticleTable, ArticleCommentTable, AuthTable } from "./models.js";

export interface Schema {
    user: UserTable;
    admin: AdminTable;
    images: ImageTable;
    games: GameTable;
    review: ReviewTable;
    wishlist: WishlistTable;
    profile: ProfileTable;
    articles: ArticleTable;
    article_comments: ArticleCommentTable;
    auth: AuthTable;
    follows: FollowsTable;
  }