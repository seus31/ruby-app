'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '../api';
import type { Category } from '@/types/category';
import CategoryBadge from './CategoryBadge';
import Spinner from '@/components/ui/Spinner';

type CategoryListProps = {
  className?: string;
};

export default function CategoryList({ className = '' }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getCategories(controller.signal)
      .then(setCategories)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError('カテゴリの取得に失敗しました');
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className={className}>
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return <p className={['text-danger small', className].filter(Boolean).join(' ')}>{error}</p>;
  }

  if (categories.length === 0) {
    return <p className={['text-muted small', className].filter(Boolean).join(' ')}>カテゴリはありません</p>;
  }

  return (
    <div className={['d-flex flex-wrap gap-1', className].filter(Boolean).join(' ')}>
      {categories.map((cat) => (
        <CategoryBadge key={cat.id} category={cat} />
      ))}
    </div>
  );
}
