import Link from 'next/link';
import type { Post } from '@/types/post';
import CategoryBadge from '@/features/categories/components/CategoryBadge';
import TagBadge from '@/features/tags/components/TagBadge';

type PostCardProps = {
  post: Post;
  className?: string;
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PostCard({ post, className = '' }: PostCardProps) {
  return (
    <article className={['card h-100', className].filter(Boolean).join(' ')}>
      {post.thumbnail_url && (
        <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
          <img
            src={post.thumbnail_url}
            alt=""
            className="card-img-top"
            style={{ height: '12rem', objectFit: 'cover' }}
          />
        </Link>
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link href={`/posts/${encodeURIComponent(post.slug)}`} className="text-decoration-none text-dark">
            {post.title}
          </Link>
        </h5>
        {post.excerpt && <p className="card-text text-muted small flex-grow-1">{post.excerpt}</p>}
        <div className="d-flex flex-wrap gap-1 mb-2">
          {post.categories.map((cat) => (
            <CategoryBadge key={cat.id} category={cat} />
          ))}
          {post.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
        <p className="card-text small text-muted mb-0">
          {post.author.name} · {formatDate(post.published_at)} · コメント {post.comments_count} · いいね {post.likes_count}
        </p>
      </div>
    </article>
  );
}
