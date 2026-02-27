import apiClient from '@/lib/axios';
import type { Comment } from '@/types/comment';

/** 記事のコメント一覧を取得（親コメントのみ、replies はネストで含まれる） */
export async function getComments(postSlug: string, signal?: AbortSignal): Promise<Comment[]> {
  const { data } = await apiClient.get<Comment[]>(
    `/api/v1/posts/${encodeURIComponent(postSlug)}/comments`,
    { signal }
  );
  return data;
}

export type CreateCommentParams = {
  body: string;
  parent_id?: number | null;
};

/** コメントを投稿。認証必要。 */
export async function createComment(
  postSlug: string,
  params: CreateCommentParams
): Promise<Comment> {
  const { data } = await apiClient.post<Comment>(
    `/api/v1/posts/${encodeURIComponent(postSlug)}/comments`,
    { comment: params }
  );
  return data;
}

/** コメントを削除。認証必要（投稿者本人のみ）。 */
export async function deleteComment(postSlug: string, commentId: number): Promise<void> {
  await apiClient.delete(
    `/api/v1/posts/${encodeURIComponent(postSlug)}/comments/${commentId}`
  );
}
