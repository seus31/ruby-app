'use client';

import Link from 'next/link';
import { usePost } from '../hooks/usePost';
import LikeButton from '@/features/likes/components/LikeButton';
import Spinner from '@/components/ui/Spinner';

type PostDetailProps = {
  slug: string;
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

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
        <img
          src={post.thumbnail_url}
          alt=""
          className="img-fluid rounded mb-3"
          style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
        />
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
          <Link key={c.id} href={`/categories/${encodeURIComponent(c.slug)}`} className="badge text-bg-secondary text-decoration-none">
            {c.category_name}
          </Link>
        ))}
        {post.tags.map((t) => (
          <Link key={t.id} href={`/tags/${encodeURIComponent(t.slug)}`} className="badge text-bg-light border text-decoration-none">
            {t.name}
          </Link>
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
