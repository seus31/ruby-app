'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUserId } from '@/lib/auth';
import PostList from '@/features/posts/components/PostList';

export default function DashboardPage() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    setUserId(getCurrentUserId());
  }, []);

  if (userId === null) {
    return (
      <div className="container py-4">
        <p className="text-muted">ログインすると自分の記事を管理できます。</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">ダッシュボード</h1>
        <Link href="/posts/new" className="btn btn-primary">
          新規投稿
        </Link>
      </div>
      <PostList userId={userId} />
    </div>
  );
}
