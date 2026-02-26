import apiClient from '@/lib/axios';
import type { Category } from '@/types/category';

/** カテゴリ一覧を取得 */
export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/api/v1/categories');
  return data;
}

/** スラッグでカテゴリ詳細を取得 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data } = await apiClient.get<Category>(`/api/v1/categories/${encodeURIComponent(slug)}`);
  return data;
}
