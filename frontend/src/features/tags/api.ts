import apiClient from '@/lib/axios';
import type { Tag } from '@/types/tag';

/** タグ一覧を取得。signal を渡すとアンマウント時にリクエストをキャンセルできる。 */
export async function getTags(signal?: AbortSignal): Promise<Tag[]> {
  const { data } = await apiClient.get<Tag[]>('/api/v1/tags', { signal });
  return data;
}
