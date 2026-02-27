'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPost } from '../api';
import type { Post } from '@/types/post';

export function usePost(slug: string | null) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback((signal?: AbortSignal) => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getPost(slug, signal)
      .then(setPost)
      .catch((_err: unknown) => {
        if (!signal?.aborted) {
          setError('記事の取得に失敗しました');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    refetch(controller.signal);
    return () => controller.abort();
  }, [slug, refetch]);

  return { post, loading, error, refetch };
}
