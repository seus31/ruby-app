'use client';

import Image from 'next/image';
import { usePost } from '../hooks/usePost';
import LikeButton from '@/features/likes/components/LikeButton';
import Spinner from '@/components/ui/Spinner';
import CategoryBadge from '@/features/categories/components/CategoryBadge';
import TagBadge from '@/features/tags/components/TagBadge';
import { formatDate } from '@/lib/date';

type PostDetailProps = {
  slug: string;
};

export default function PostDetail({ slug }: PostDetailProps) {
  const { post, loading, error } = usePost(slug);

  if (loading && !post) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner />
      </div>
    );
  }

  if (error || !post) {
    return <p className="text-danger">{error ?? '記事が見つかりません'}</p>;
  }

  return (
    <article>
      {post.thumbnail_url && (
        <div className="rounded mb-3 overflow-hidden" style={{ position: 'relative', maxHeight: '400px', width: '100%' }}>
          <Image
            src={post.thumbnail_url}
            alt=""
            width={800}
            height={400}
            className="img-fluid"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            unoptimized
          />
        </div>
      )}
      <h1 className="mb-2">{post.title}</h1>
      <p className="text-muted small mb-3">
        {post.author.name} · {formatDate(post.published_at)}
        {post.categories.length > 0 && (
          <> · {post.categories.map((c) => c.category_name).join(', ')}</>
        )}
      </p>
      <div className="d-flex flex-wrap gap-1 mb-3">
        {post.categories.map((c) => (
          <CategoryBadge key={c.id} category={c} />
        ))}
        {post.tags.map((t) => (
          <TagBadge key={t.id} tag={t} />
        ))}
      </div>

      <div
        className="mb-4"
        style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        {post.body}
      </div>

      <div className="d-flex align-items-center gap-2 mb-4">
        <LikeButton
          postSlug={post.slug}
          initialLiked={post.liked_by_current_user}
          initialCount={post.likes_count}
        />
        <span className="text-muted small">コメント {post.comments_count}</span>
      </div>

      <hr />
      <p className="text-muted small">コメント機能は Phase 14 で実装予定です。</p>
    </article>
  );
}
