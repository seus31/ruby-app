'use client';

import { useComments } from '../hooks/useComments';
import { getCurrentUserId } from '@/lib/auth';
import CommentItem from './CommentItem';
import Spinner from '@/components/ui/Spinner';

type CommentListProps = {
  postSlug: string;
  className?: string;
};

export default function CommentList({ postSlug, className = '' }: CommentListProps) {
  const { comments, loading, error, removeComment } = useComments(postSlug);
  const currentUserId = getCurrentUserId();

  if (loading && comments.length === 0) {
    return (
      <div className={['d-flex justify-content-center py-3', className].filter(Boolean).join(' ')}>
        <Spinner size="sm" />
      </div>
    );
  }

  if (error) {
    return <p className={['text-danger small', className].filter(Boolean).join(' ')}>{error}</p>;
  }

  if (comments.length === 0) {
    return <p className={['text-muted small', className].filter(Boolean).join(' ')}>コメントはまだありません</p>;
  }

  return (
    <div className={className}>
      <h6 className="mb-3">コメント（{comments.length}件）</h6>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={removeComment}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
