/**
 * タグ関連の型定義（API: TagSerializer に対応）
 */
export type Tag = {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
};
