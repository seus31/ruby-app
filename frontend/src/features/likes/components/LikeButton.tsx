'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { createLike, destroyLike } from '../api';

type LikeButtonProps = {
  postSlug: string;
  initialLiked: boolean | null;
  initialCount: number;
  /** いいね状態が変わったときに親で状態を同期する場合に使用 */
  onUpdate?: (liked: boolean, count: number) => void;
  className?: string;
};

export default function LikeButton({
  postSlug,
  initialLiked,
  initialCount,
  onUpdate,
  className = '',
}: LikeButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(initialLiked ?? false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      if (liked) {
        const { likes_count } = await destroyLike(postSlug);
        setLiked(false);
        setCount(likes_count);
        onUpdate?.(false, likes_count);
      } else {
        const { likes_count } = await createLike(postSlug);
        setLiked(true);
        setCount(likes_count);
        onUpdate?.(true, likes_count);
      }
    } catch {
      // 401 は axios インターセプターで /login へリダイレクトされる
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={['btn btn-outline-danger btn-sm', className].filter(Boolean).join(' ')}
      aria-pressed={liked}
      aria-label={liked ? 'いいねを解除' : 'いいねする'}
    >
      {liked ? '♥' : '♡'} {count}
    </button>
  );
}
