import Link from 'next/link';
import type { Tag } from '@/types/tag';

type TagBadgeProps = {
  tag: Tag;
  className?: string;
};

export default function TagBadge({ tag, className = '' }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag.slug)}`}
      className={['badge text-bg-light border text-dark text-decoration-none', className].filter(Boolean).join(' ')}
    >
      {tag.name}
    </Link>
  );
}
