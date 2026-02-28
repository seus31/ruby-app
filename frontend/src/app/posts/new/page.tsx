'use client';

import { useRouter } from 'next/navigation';
import PostForm from '@/features/posts/components/PostForm';

export default function NewPostPage() {
  const router = useRouter();

  return (
    <div className="container py-4">
      <h1 className="mb-4">記事を作成</h1>
      <PostForm
        onSuccess={() => router.push('/dashboard')}
        onCancel={() => router.back()}
      />
    </div>
  );
}
