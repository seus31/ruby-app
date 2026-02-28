'use client';

import { useRouter } from 'next/navigation';
import { getCurrentUserId } from '@/lib/auth';
import { usePost } from '@/features/posts/hooks/usePost';
import PostForm from '@/features/posts/components/PostForm';
import Spinner from '@/components/ui/Spinner';

type Props = { slug: string };

export default function EditPostPageContent({ slug }: Props) {
  const router = useRouter();
  const { post, loading } = usePost(slug);
  const currentUserId = getCurrentUserId();

  if (loading && !post) {
    return (
      <div className="container py-4 d-flex justify-content-center">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-4">
        <p className="text-danger">記事が見つかりません</p>
      </div>
    );
  }

  if (currentUserId === null || post.author.id !== currentUserId) {
    return (
      <div className="container py-4">
        <p className="text-danger">この記事を編集する権限がありません。</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">記事を編集</h1>
      <PostForm
        slug={slug}
        initialValues={{
          title: post.title,
          body: post.body,
          excerpt: post.excerpt ?? null,
          status: post.status,
          thumbnail_url: post.thumbnail_url ?? '',
          category_ids: post.categories.map((c) => c.id),
          tag_ids: post.tags.map((t) => t.id),
        }}
        onSuccess={() => router.push(`/posts/${encodeURIComponent(slug)}`)}
        onCancel={() => router.back()}
      />
    </div>
  );
}
