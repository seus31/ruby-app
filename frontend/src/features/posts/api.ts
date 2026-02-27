import apiClient from '@/lib/axios';
import type { Post, PostListResponse } from '@/types/post';

export type GetPostsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  category_slug?: string;
  tag_slug?: string;
  user_id?: number;
  signal?: AbortSignal;
};

/** 記事一覧を取得。公開記事のみ。 */
export async function getPosts(params: GetPostsParams = {}): Promise<PostListResponse> {
  const { signal, ...query } = params;
  const { data } = await apiClient.get<PostListResponse>('/api/v1/posts', {
    params: query,
    signal,
  });
  return data;
}

/** スラッグで記事詳細を取得 */
export async function getPost(slug: string, signal?: AbortSignal): Promise<Post> {
  const { data } = await apiClient.get<Post>(
    `/api/v1/posts/${encodeURIComponent(slug)}`,
    { signal }
  );
  return data;
}

export type CreatePostParams = {
  title: string;
  body: string;
  excerpt?: string | null;
  status?: 'draft' | 'published' | 'archived';
  thumbnail_url?: string | null;
  category_ids?: number[];
  tag_ids?: number[];
};

/** 記事を作成。認証必要。 */
export async function createPost(params: CreatePostParams): Promise<Post> {
  const { data } = await apiClient.post<Post>('/api/v1/posts', {
    post: params,
  });
  return data;
}

/** 記事を更新。認証必要（投稿者本人のみ）。 */
export async function updatePost(slug: string, params: CreatePostParams): Promise<Post> {
  const { data } = await apiClient.put<Post>(
    `/api/v1/posts/${encodeURIComponent(slug)}`,
    { post: params }
  );
  return data;
}

/** 記事を削除。認証必要（投稿者本人のみ）。 */
export async function deletePost(slug: string): Promise<void> {
  await apiClient.delete(`/api/v1/posts/${encodeURIComponent(slug)}`);
}
