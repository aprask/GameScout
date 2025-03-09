export interface UserTable {
  user_id: string;
  google_id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  is_active: boolean;
}

export interface ReviewTable {
  review_id: string;
  user_id: string;
  game_id: number;
  rating: number;
  review: string | null;
  created_at: Date;
}

export interface WishlistTable {
  wishlist_id: string;
  user_id: string;
  game_id: number;
  created_at: Date;
}

export interface ProfileTable {
  profile_id: string;
  user_id: string;
  profile_pic: string;
  profile_name: string;
}

export interface FollowsTable {
  follow_id: string;
  user_id_following: string;
  user_id_follower: string;
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

// ADDITIONAL MODELS (do not persist)

export interface FollowerProfile {
  profile_name: string;
  profile_pic: string;
  profile_id: string;
};