'use client';

import { useState } from 'react';
import { useComments } from '../hooks/useComments';
import { getCurrentUserId } from '@/lib/auth';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

type CommentSectionProps = {
  postSlug: string;
  className?: string;
};

/** コメント一覧と投稿フォーム。useComments をここで一元管理し、CommentList と CommentForm に props で渡す。 */
export default function CommentSection({ postSlug, className = '' }: CommentSectionProps) {
  const { comments, loading, error, addComment, removeComment } = useComments(postSlug);
  const [currentUserId] = useState(() => getCurrentUserId());

  return (
    <div className={className}>
      <CommentList
        comments={comments}
        loading={loading}
        error={error}
        onDelete={removeComment}
        currentUserId={currentUserId}
      />
      <CommentForm onAddComment={addComment} className="mt-4" />
    </div>
  );
}
