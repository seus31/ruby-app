'use client';

import { usePosts } from '@/features/posts/hooks/usePosts';
import PostList from '@/features/posts/components/PostList';
import CategoryList from '@/features/categories/components/CategoryList';
import TagCloud from '@/features/tags/components/TagCloud';

export default function HomePage() {
  const { posts, meta, loading, error, setPage } = usePosts();

  return (
    <div className="container py-4">
      <div className="row">
        <main className="col-lg-8">
          <h1 className="mb-4">最新記事</h1>
          <PostList
            posts={posts}
            meta={meta}
            loading={loading}
            error={error}
            setPage={setPage}
          />
        </main>
        <aside className="col-lg-4">
          <CategoryList />
          <TagCloud />
        </aside>
      </div>
    </div>
  );
}
