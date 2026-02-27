'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPosts, type GetPostsParams } from '../api';
import type { Post, PostMeta } from '@/types/post';

type UsePostsParams = Omit<GetPostsParams, 'signal'>;

export function usePosts(initialParams: UsePostsParams = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PostMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<UsePostsParams>({
    page: 1,
    per_page: 20,
    ...initialParams,
  });

  const fetchPosts = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    getPosts({ ...params, signal })
      .then((res) => {
        setPosts(res.posts);
        setMeta(res.meta);
      })
      .catch((_err: unknown) => {
        if (!signal?.aborted) {
          setError('記事の取得に失敗しました');
        }
      })
      .finally(() => setLoading(false));
  }, [params.page, params.per_page, params.q, params.category_slug, params.tag_slug, params.user_id]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPosts(controller.signal);
    return () => controller.abort();
  }, [fetchPosts]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setSearch = useCallback((q: string) => {
    setParams((prev) => ({ ...prev, q: q || undefined, page: 1 }));
  }, []);

  return {
    posts,
    meta,
    loading,
    error,
    params,
    setPage,
    setSearch,
    setParams,
  };
}
