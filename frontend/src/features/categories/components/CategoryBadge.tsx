import Link from 'next/link';
import type { Category } from '@/types/category';

type CategoryBadgeProps = {
  category: Category;
  className?: string;
};

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${encodeURIComponent(category.slug)}`}
      className={['badge text-bg-secondary text-decoration-none', className].filter(Boolean).join(' ')}
    >
      {category.category_name}
    </Link>
  );
}
