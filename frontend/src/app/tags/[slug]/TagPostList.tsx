'use client';

import PostList from '@/features/posts/components/PostList';

type Props = { slug: string };

export default function TagPostList({ slug }: Props) {
  return <PostList tagSlug={slug} />;
}
