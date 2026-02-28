'use client';

import { useEffect, useState } from 'react';
import { getCategoryBySlug } from '@/features/categories/api';
import type { Category } from '@/types/category';
import PostList from '@/features/posts/components/PostList';

type Props = { slug: string };

export default function CategoryPageContent({ slug }: Props) {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getCategoryBySlug(slug, controller.signal)
      .then(setCategory)
      .catch(() => setCategory(null));
    return () => controller.abort();
  }, [slug]);

  const title = category ? category.category_name : decodeURIComponent(slug);

  return (
    <div className="container py-4">
      <h1 className="mb-4">カテゴリ: {title}</h1>
      <PostList categorySlug={slug} />
    </div>
  );
}
