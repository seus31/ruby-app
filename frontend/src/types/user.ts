/**
 * ユーザー関連の型定義（API: UserSerializer に対応）
 */
export type User = {
  id: number;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  posts_count?: number;
  created_at: string;
};

/** 認証済みユーザーの最小情報（記事・コメントの author など） */
export type AuthUser = Pick<User, 'id' | 'name' | 'avatar_url'>;
