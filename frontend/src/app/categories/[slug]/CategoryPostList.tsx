'use client';

import PostList from '@/features/posts/components/PostList';

type Props = { slug: string };

export default function CategoryPostList({ slug }: Props) {
  return <PostList categorySlug={slug} />;
}
