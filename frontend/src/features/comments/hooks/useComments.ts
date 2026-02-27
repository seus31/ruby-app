'use client';

import { useState, useEffect, useCallback } from 'react';
import { getComments, createComment, deleteComment, type CreateCommentParams } from '../api';
import type { Comment } from '@/types/comment';

export function useComments(postSlug: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(!!postSlug);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    (signal?: AbortSignal) => {
      if (!postSlug) return;
      setLoading(true);
      setError(null);
      getComments(postSlug, signal)
        .then(setComments)
        .catch((_err: unknown) => {
          if (!signal?.aborted) {
            setError('コメントの取得に失敗しました');
          }
        })
        .finally(() => setLoading(false));
    },
    [postSlug]
  );

  useEffect(() => {
    if (!postSlug) {
      setComments([]);
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    refetch(controller.signal);
    return () => controller.abort();
  }, [postSlug, refetch]);

  const addComment = useCallback(
    async (params: CreateCommentParams) => {
      if (!postSlug) return;
      await createComment(postSlug, params);
      refetch();
    },
    [postSlug, refetch]
  );

  const removeComment = useCallback(
    async (commentId: number) => {
      if (!postSlug) return;
      await deleteComment(postSlug, commentId);
      refetch();
    },
    [postSlug, refetch]
  );

  return { comments, loading, error, refetch, addComment, removeComment };
}
