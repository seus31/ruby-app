'use client';

import { useEffect, useState } from 'react';
import { getTags } from '../api';
import type { Tag } from '@/types/tag';
import TagBadge from './TagBadge';
import Spinner from '@/components/ui/Spinner';

type TagCloudProps = {
  className?: string;
};

export default function TagCloud({ className = '' }: TagCloudProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getTags(controller.signal)
      .then(setTags)
      .catch((_err: unknown) => {
        if (!controller.signal.aborted) {
          setError('タグの取得に失敗しました');
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

  if (tags.length === 0) {
    return <p className={['text-muted small', className].filter(Boolean).join(' ')}>タグはありません</p>;
  }

  return (
    <div className={['d-flex flex-wrap gap-1', className].filter(Boolean).join(' ')}>
      {tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
    </div>
  );
}
