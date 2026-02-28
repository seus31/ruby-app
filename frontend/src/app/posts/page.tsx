'use client';

import { usePosts } from '@/features/posts/hooks/usePosts';
import PostList from '@/features/posts/components/PostList';
import SearchBar from '@/components/ui/SearchBar';

export default function PostsPage() {
  const { posts, meta, loading, error, setPage, setSearch } = usePosts();

  return (
    <div className="container py-4">
      <h1 className="mb-4">記事一覧</h1>
      <div className="mb-4">
        <SearchBar onSubmit={setSearch} placeholder="記事を検索" />
      </div>
      <PostList
        posts={posts}
        meta={meta}
        loading={loading}
        error={error}
        setPage={setPage}
      />
    </div>
  );
}
