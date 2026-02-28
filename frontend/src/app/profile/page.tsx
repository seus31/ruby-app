'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { getTokenPayload } from '@/lib/auth';

export default function ProfilePage() {
  const { isAuthenticated, loading } = useAuth();
  const payload = getTokenPayload();

  if (loading) {
    return (
      <div className="container py-4">
        <p className="text-muted">読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated || !payload) {
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
            <strong>ユーザーID:</strong> {payload.user_id}
          </p>
          <p className="text-muted small mb-0">
            名前・メールは /api/v1/users/me などの専用エンドポイント実装後に表示できます。
          </p>
        </div>
      </div>
    </div>
  );
}
