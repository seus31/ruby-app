'use client';

import { usePosts } from '../hooks/usePosts';
import PostCard from './PostCard';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';

type PostListProps = {
  categorySlug?: string;
  tagSlug?: string;
  userId?: number;
  className?: string;
};

export default function PostList({
  categorySlug,
  tagSlug,
  userId,
  className = '',
}: PostListProps) {
  const { posts, meta, loading, error, setPage } = usePosts({
    category_slug: categorySlug,
    tag_slug: tagSlug,
    user_id: userId,
  });

  if (loading && posts.length === 0) {
    return (
      <div className={['d-flex justify-content-center py-5', className].filter(Boolean).join(' ')}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className={['text-danger', className].filter(Boolean).join(' ')}>{error}</p>;
  }

  if (posts.length === 0) {
    return <p className={['text-muted', className].filter(Boolean).join(' ')}>記事はありません</p>;
  }

  return (
    <div className={className}>
      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.id} className="col-12 col-md-6 col-lg-4">
            <PostCard post={post} />
          </div>
        ))}
      </div>
      {meta && meta.total_pages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
