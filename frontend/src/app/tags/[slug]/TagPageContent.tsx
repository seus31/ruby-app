'use client';

import { useEffect, useState } from 'react';
import { getTagBySlug } from '@/features/tags/api';
import type { Tag } from '@/types/tag';
import PostList from '@/features/posts/components/PostList';

type Props = { slug: string };

export default function TagPageContent({ slug }: Props) {
  const [tag, setTag] = useState<Tag | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getTagBySlug(slug, controller.signal)
      .then(setTag)
      .catch(() => setTag(null));
    return () => controller.abort();
  }, [slug]);

  const title = tag ? tag.name : decodeURIComponent(slug);

  return (
    <div className="container py-4">
      <h1 className="mb-4">タグ: {title}</h1>
      <PostList tagSlug={slug} />
    </div>
  );
}
