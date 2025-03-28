import { UserTable, ReviewTable, WishlistTable, ProfileTable, FollowsTable } from "./models.js";

export interface Schema {
    user: UserTable;
    game_review: ReviewTable;
    wishlist: WishlistTable;
    profile: ProfileTable;
    follows: FollowsTable;
  }