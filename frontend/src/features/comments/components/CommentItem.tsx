'use client';

import type { Comment } from '@/types/comment';
import { formatDate } from '@/lib/date';
import Button from '@/components/ui/Button';

type CommentItemProps = {
  comment: Comment;
  onDelete?: (commentId: number) => void;
  currentUserId?: number | null;
  depth?: number;
};

export default function CommentItem({
  comment,
  onDelete,
  currentUserId,
  depth = 0,
}: CommentItemProps) {
  const isOwn = currentUserId != null && comment.author.id === currentUserId;

  return (
    <div className={['border-start border-2 ps-2 mb-2', depth > 0 && 'ms-3'].filter(Boolean).join(' ')}>
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div className="flex-grow-1">
          <strong>{comment.author.name}</strong>
          <span className="text-muted small ms-2">{formatDate(comment.created_at)}</span>
        </div>
        {isOwn && onDelete && (
          <Button
            variant="outline-danger"
            size="sm"
            type="button"
            onClick={() => onDelete(comment.id)}
          >
            削除
          </Button>
        )}
      </div>
      <p className="mb-1 mt-1">{comment.body}</p>
      {comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
