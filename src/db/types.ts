import { ColumnType, Generated } from 'kysely';
import { UUID } from 'crypto';

export interface UserTable {
  user_id: Generated<UUID>;
  google_id: ColumnType<string, string, undefined>;
  email: ColumnType<string, string, undefined>;
  created_at: Generated<ColumnType<Date, Date, undefined>>;
  updated_at: Date;
  last_login: Date;
  is_active: boolean;
}

export interface ReviewTable {
  review_id: Generated<UUID>;
  user_id: ColumnType<UUID, UUID, undefined>;
  game_id: ColumnType<number, number, undefined>;
  rating: number;
  review: string | null;
  created_at: Generated<ColumnType<Date, Date, undefined>>;
}

export interface WishlistTable {
  wishlist_id: Generated<UUID>;
  user_id: ColumnType<UUID, UUID, undefined>;
  game_id: ColumnType<number, number, undefined>;
  created_at: Date;
}

export interface ProfileTable {
  profile_id: Generated<UUID>;
  user_id: ColumnType<UUID, UUID, undefined>;
  profile_pic: string;
  profile_name: string;
}

export interface FollowsTable {
  follow_id: Generated<UUID>;
  user_id_following: ColumnType<UUID, UUID, undefined>;
  user_id_follower: ColumnType<UUID, UUID, undefined>;
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
