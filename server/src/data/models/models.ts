export interface UserTable {
  user_id: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  is_active: boolean;
  is_banned: boolean;
}

export interface AdminTable {
  admin_id: string;
  user_id: string;
  admin_key: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ImageTable {
  image_id: string;
  image_text: string | null;
  image_data: Buffer | null;
  created_at: Date;
  updated_at: Date;
}

export interface GameTable {
  game_id: string;
  game_name: string;
  game_art: string;
  is_supported: boolean;
  company: string;
  summary: string;
  release_date: Date;
  age_rating: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewTable {
  review_id: string;
  user_id: string;
  game_id: string;
  rating: number;
  review: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface WishlistTable {
  wishlist_id: string;
  user_id: string;
  game_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProfileTable {
  profile_id: string;
  user_id: string;
  profile_img: string;
  profile_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface FollowsTable {
  follow_id: string;
  user_id_following: string;
  user_id_follower: string;
  status: string;
  followed_time: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ArticleTable {
  article_id: string;
  article_title: string;
  article_owner: string;
  article_content: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ArticleCommentTable {
  comment_id: string;
  comment_owner: string;
  commented_article: string;
  comment_content: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthTable {
  auth_id: string;
  user_id: string;
  token: string;
  created_at: Date;
  updated_at: Date;
}
