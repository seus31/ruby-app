'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { CreateCommentParams } from '../api';
import Button from '@/components/ui/Button';

type CommentFormProps = {
  onAddComment: (params: CreateCommentParams) => Promise<void>;
  parentId?: number | null;
  className?: string;
};

export default function CommentForm({
  onAddComment,
  parentId = null,
  className = '',
}: CommentFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const trimmed = body.trim();
    if (!trimmed) {
      setError('コメントを入力してください');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAddComment({ body: trimmed, parent_id: parentId ?? undefined });
      setBody('');
    } catch {
      setError('投稿に失敗しました。再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {error && (
        <div className="alert alert-danger py-2 mb-2" role="alert">
          {error}
        </div>
      )}
      <textarea
        className="form-control mb-2"
        rows={3}
        placeholder={isAuthenticated ? (parentId ? '返信を入力...' : 'コメントを入力...') : 'ログインするとコメントできます'}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={!isAuthenticated}
      />
      <Button type="submit" disabled={loading || !isAuthenticated}>
        {loading ? '送信中...' : parentId ? '返信' : '投稿'}
      </Button>
    </form>
  );
}
