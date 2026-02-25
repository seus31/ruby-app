import type { AuthUser } from './user';
import type { Category } from './category';
import type { Tag } from './tag';

/**
 * 記事ステータス（API: Post.status enum に対応）
 */
export type PostStatus = 'draft' | 'published' | 'archived';

/**
 * 記事の型定義（API: PostSerializer に対応）
 */
export type Post = {
  id: number;
  title: string;
  body: string;
  excerpt: string | null;
  slug: string;
  status: PostStatus;
  thumbnail_url: string | null;
  published_at: string | null;
  author: AuthUser;
  categories: Category[];
  tags: Tag[];
  comments_count: number;
  likes_count: number;
  liked_by_current_user?: boolean;
  created_at: string;
  updated_at: string;
};

/** 記事一覧のメタ情報（ページネーション） */
export type PostMeta = {
  current_page: number;
  total_pages: number;
  total_count: number;
};

/** 記事一覧 API レスポンス */
export type PostListResponse = {
  posts: Post[];
  meta: PostMeta;
};
