'use client';

import { useState, useEffect } from 'react';
import { postFormSchema, type PostFormData } from '../schemas';
import { createPost, updatePost, type CreatePostParams } from '../api';
import { getCategories } from '@/features/categories/api';
import { getTags } from '@/features/tags/api';
import type { Category } from '@/types/category';
import type { Tag } from '@/types/tag';
import MarkdownEditor from './MarkdownEditor';
import Button from '@/components/ui/Button';

type PostFormProps = {
  slug?: string | null;
  initialValues?: Partial<PostFormData>;
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function PostForm({
  slug,
  initialValues,
  onSuccess,
  onCancel,
}: PostFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<PostFormData>({
    title: '',
    body: '',
    excerpt: null,
    status: 'draft',
    thumbnail_url: '',
    category_ids: [],
    tag_ids: [],
    ...initialValues,
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getTags().then(setTags).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const result = postFormSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === 'string' && !errors[path]) {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    const payload: CreatePostParams = {
      ...result.data,
      excerpt: result.data.excerpt || undefined,
      thumbnail_url: result.data.thumbnail_url || undefined,
    };

    setLoading(true);
    try {
      if (slug) {
        await updatePost(slug, payload);
      } else {
        await createPost(payload);
      }
      onSuccess();
    } catch {
      setError('保存に失敗しました。再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="post-title" className="form-label">タイトル</label>
        <input
          id="post-title"
          type="text"
          className={['form-control', fieldErrors.title && 'is-invalid'].filter(Boolean).join(' ')}
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />
        {fieldErrors.title && <div className="invalid-feedback">{fieldErrors.title}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="post-body" className="form-label">本文</label>
        <MarkdownEditor
          id="post-body"
          value={form.body}
          onChange={(v) => setForm((prev) => ({ ...prev, body: v }))}
        />
        {fieldErrors.body && <p className="text-danger small mt-1">{fieldErrors.body}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="post-excerpt" className="form-label">抜粋（任意）</label>
        <textarea
          id="post-excerpt"
          className="form-control"
          rows={2}
          value={form.excerpt ?? ''}
          onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value || null }))}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="post-thumbnail" className="form-label">サムネイル URL（任意）</label>
        <input
          id="post-thumbnail"
          type="text"
          className="form-control"
          value={form.thumbnail_url ?? ''}
          onChange={(e) => setForm((prev) => ({ ...prev, thumbnail_url: e.target.value || '' }))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">カテゴリ</label>
        <select
          multiple
          className="form-select"
          value={form.category_ids.map(String)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (o) => Number(o.value));
            setForm((prev) => ({ ...prev, category_ids: selected }));
          }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.category_name}</option>
          ))}
        </select>
        <small className="text-muted">Ctrl/Cmd で複数選択</small>
      </div>

      <div className="mb-3">
        <label className="form-label">タグ</label>
        <select
          multiple
          className="form-select"
          value={form.tag_ids.map(String)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (o) => Number(o.value));
            setForm((prev) => ({ ...prev, tag_ids: selected }));
          }}
        >
          {tags.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <small className="text-muted">Ctrl/Cmd で複数選択</small>
      </div>

      <div className="mb-3">
        <label className="form-label">ステータス</label>
        <select
          className="form-select"
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as PostFormData['status'] }))}
        >
          <option value="draft">下書き</option>
          <option value="published">公開</option>
          <option value="archived">アーカイブ</option>
        </select>
      </div>

      <div className="d-flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? '保存中...' : slug ? '更新' : '作成'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline-secondary" onClick={onCancel}>
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
