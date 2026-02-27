import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';
import CategoryBadge from '@/features/categories/components/CategoryBadge';
import TagBadge from '@/features/tags/components/TagBadge';
import { formatDate } from '@/lib/date';

type PostCardProps = {
  post: Post;
  className?: string;
};

export default function PostCard({ post, className = '' }: PostCardProps) {
  return (
    <article className={['card h-100', className].filter(Boolean).join(' ')}>
      {post.thumbnail_url && (
        <Link href={`/posts/${encodeURIComponent(post.slug)}`} style={{ position: 'relative', display: 'block', height: '12rem' }}>
          <Image
            src={post.thumbnail_url}
            alt=""
            fill
            className="card-img-top"
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
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
