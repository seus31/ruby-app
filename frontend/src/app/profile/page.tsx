'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-4">
        <p className="text-muted">読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container py-4">
        <p className="text-muted">ログインするとプロフィールを表示できます。</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">プロフィール</h1>
      <div className="card">
        <div className="card-body">
          <p className="mb-1">
            <strong>名前:</strong> {user.name}
          </p>
          <p className="mb-1">
            <strong>メール:</strong> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
