import { ColumnType, Generated } from 'kysely';

export interface UserTable {
  user_id: Generated<number>;
  google_id: string;
  email: string;
  username: string;
  hashed_password: string;
  created_at: Generated<Date>;
  updated_at: Date;
  last_login: Date;
  is_active: boolean;
}

export interface ReviewTable {
  review_id: Generated<number>;
  user_id: number;
  game_id: number;
  rating: number;
  review: string | null;
  created_at: Generated<Date>;
}

export interface WishlistTable {
  wishlist_id: Generated<number>;
  user_id: number;
  game_id: number;
  created_at: Date;
}

export interface ProfileTable {
  profile_id: Generated<number>;
  user_id: number;
  profile_pic: string;
  profile_name: string;
}

export interface FollowsTable {
  follow_id: Generated<number>;
  user_id_following: number;
  user_id_follower: number;
  status: string;
  followed_time: Date;
}

export interface Database {
  user: UserTable;
  game_review: ReviewTable;
  wishlist: WishlistTable;
  profile: ProfileTable;
  follows: FollowsTable;
}
