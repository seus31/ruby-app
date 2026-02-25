import type { AuthUser } from './user';

/**
 * コメントの型定義（API: CommentSerializer に対応）
 * 返信は replies で再帰的にネスト
 */
export type Comment = {
  id: number;
  body: string;
  parent_id: number | null;
  author: AuthUser;
  replies: Comment[];
  created_at: string;
};
