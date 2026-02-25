/**
 * カテゴリ関連の型定義（API: CategorySerializer に対応）
 */
export type Category = {
  id: number;
  category_name: string;
  slug: string;
  description: string | null;
  posts_count: number;
};
