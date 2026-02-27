import apiClient from '@/lib/axios';

export type LikeResponse = { likes_count: number };

/** 記事にいいねを追加。認証必要。 */
export async function createLike(postSlug: string): Promise<LikeResponse> {
  const { data } = await apiClient.post<LikeResponse>(
    `/api/v1/posts/${encodeURIComponent(postSlug)}/likes`
  );
  return data;
}

/** 記事のいいねを取消。認証必要。 */
export async function destroyLike(postSlug: string): Promise<LikeResponse> {
  const { data } = await apiClient.delete<LikeResponse>(
    `/api/v1/posts/${encodeURIComponent(postSlug)}/likes`
  );
  return data;
}
