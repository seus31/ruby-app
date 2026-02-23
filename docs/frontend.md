# フロントエンド設計

## 画面一覧

| パス | 画面名 | 認証 | 説明 |
|---|---|---|---|
| `/` | トップページ | 不要 | 公開記事の新着一覧 |
| `/posts` | 記事一覧 | 不要 | 全記事一覧・検索・フィルタ |
| `/posts/[slug]` | 記事詳細 | 不要 | 記事本文・コメント・いいね |
| `/posts/new` | 記事作成 | 必要 | Markdownエディタ付き作成フォーム |
| `/posts/[slug]/edit` | 記事編集 | 必要 | 記事編集フォーム（投稿者本人のみ） |
| `/categories/[slug]` | カテゴリ別記事一覧 | 不要 | カテゴリで絞り込んだ記事一覧 |
| `/tags/[slug]` | タグ別記事一覧 | 不要 | タグで絞り込んだ記事一覧 |
| `/login` | ログイン | 不要 | ログインフォーム |
| `/register` | 会員登録 | 不要 | 登録フォーム |
| `/dashboard` | ダッシュボード | 必要 | 自分の記事一覧・管理 |
| `/profile` | プロフィール編集 | 必要 | 名前・自己紹介・アバター編集 |

---

## 画面設計

### トップページ `/`

```
┌─────────────────────────────────────────┐
│  Header [ロゴ] [記事一覧] [ログイン]    │
├─────────────────────────────────────────┤
│  ヒーローセクション                      │
│  「最新記事」 [検索バー]               │
├───────────────────────┬─────────────────┤
│  記事カード × 6      │  サイドバー     │
│  ┌──────────────┐    │  ・カテゴリ一覧 │
│  │ [サムネイル] │    │  ・人気タグ     │
│  │ タイトル     │    │  ・最新記事     │
│  │ 抜粋...      │    │                 │
│  │ [カテゴリ]  │    │                 │
│  │ 著者 / 日時  │    │                 │
│  └──────────────┘    │                 │
│  ...                  │                 │
├───────────────────────┴─────────────────┤
│  ページネーション  [< 1 2 3 ... >]      │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

---

### 記事詳細 `/posts/[slug]`

```
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│  パンくずリスト: トップ > カテゴリ > 記事 │
├────────────────────────┬────────────────┤
│  [サムネイル]          │  サイドバー    │
│  # 記事タイトル        │  目次          │
│  著者 / 公開日 / カテゴリ │             │
│  ───────────────────   │               │
│  本文（Markdown）      │               │
│  # 見出し1             │               │
│  ## 見出し2            │               │
│  ...                   │               │
│  ───────────────────   │               │
│  [タグ一覧]            │               │
│  ───────────────────   │               │
│  ♡ いいね 12 [いいね！] │               │
├────────────────────────┴────────────────┤
│  コメント (5件)                          │
│  ┌──────────────────────────────────┐  │
│  │ [アバター] 鈴木 花子 / 2025-06-01 │  │
│  │ 参考になりました！                │  │
│  │ [返信する]                        │  │
│  │   └─ [アバター] 田中 太郎         │  │
│  │      ありがとうございます！       │  │
│  └──────────────────────────────────┘  │
│                                          │
│  コメントを投稿                          │
│  [テキストエリア]                        │
│  [投稿する]                              │
├──────────────────────────────────────────┤
│  Footer                                  │
└──────────────────────────────────────────┘
```

---

### 記事作成・編集 `/posts/new`, `/posts/[slug]/edit`

```
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│  記事の作成                             │
│                                         │
│  タイトル: [─────────────────────────] │
│                                         │
│  抜粋:     [─────────────────────────] │
│                                         │
│  本文:                                  │
│  ┌────────────────┬────────────────┐   │
│  │ Markdownエディタ │  プレビュー    │   │
│  │                │                │   │
│  └────────────────┴────────────────┘   │
│                                         │
│  カテゴリ: [Ruby ×] [Rails ×] [+ 追加] │
│  タグ:    [Rails ×] [API ×] [+ 追加]   │
│  サムネイル: [URLを入力] or [アップロード]│
│                                         │
│  ステータス: ● 下書き  ○ 公開         │
│                                         │
│  [下書き保存]  [公開する]              │
└─────────────────────────────────────────┘
```

---

### ダッシュボード `/dashboard`

```
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│  マイページ                             │
│  [新しい記事を書く +]                   │
│                                         │
│  タブ: [全て] [公開] [下書き] [アーカイブ]│
│  ───────────────────────────────────   │
│  タイトル           状態   いいね  操作 │
│  Railsの基礎...     公開   ♡ 12  [編集][削除]│
│  Dockerの使い方...  下書き  -    [編集][削除]│
│  ...                                    │
│                                         │
│  ページネーション                        │
└─────────────────────────────────────────┘
```

---

## コンポーネント構成

### 共通コンポーネント (`src/components/`)

```
components/
├── common/
│   ├── Header.tsx          # グローバルナビゲーション
│   ├── Footer.tsx          # フッター
│   ├── Pagination.tsx      # ページネーション
│   └── SearchBar.tsx       # 検索バー
└── ui/
    ├── Button.tsx          # ボタン共通コンポーネント
    ├── Modal.tsx           # 確認ダイアログ
    ├── Alert.tsx           # アラート・トースト
    └── Spinner.tsx         # ローディングスピナー
```

### 機能別コンポーネント (`src/features/`)

```
features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx        # ログインフォーム
│   │   └── RegisterForm.tsx     # 会員登録フォーム
│   ├── hooks/
│   │   └── useAuth.ts           # 認証状態管理
│   └── api.ts                   # auth API呼び出し
│
├── posts/
│   ├── components/
│   │   ├── PostCard.tsx         # 記事カード（一覧用）
│   │   ├── PostDetail.tsx       # 記事詳細本文
│   │   ├── PostForm.tsx         # 記事作成・編集フォーム
│   │   ├── PostList.tsx         # 記事一覧
│   │   └── MarkdownEditor.tsx   # Markdownエディタ
│   ├── hooks/
│   │   ├── usePosts.ts          # 記事一覧取得
│   │   └── usePost.ts           # 記事詳細取得
│   └── api.ts
│
├── categories/
│   ├── components/
│   │   ├── CategoryBadge.tsx    # カテゴリバッジ
│   │   └── CategoryList.tsx     # カテゴリ一覧（サイドバー用）
│   └── api.ts
│
├── tags/
│   ├── components/
│   │   ├── TagBadge.tsx         # タグバッジ
│   │   └── TagCloud.tsx         # タグクラウド
│   └── api.ts
│
├── comments/
│   ├── components/
│   │   ├── CommentList.tsx      # コメント一覧（ネスト表示）
│   │   ├── CommentItem.tsx      # コメント単体
│   │   └── CommentForm.tsx      # コメント投稿フォーム
│   ├── hooks/
│   │   └── useComments.ts
│   └── api.ts
│
└── likes/
    ├── components/
    │   └── LikeButton.tsx       # いいねボタン
    └── api.ts
```

---

## 型定義 (`src/types/`)

```typescript
// types/user.ts
export type User = {
  id: number;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  posts_count?: number;
  created_at: string;
};

// types/post.ts
export type PostStatus = 'draft' | 'published' | 'archived';

export type Post = {
  id: number;
  title: string;
  body: string;
  excerpt: string | null;
  slug: string;
  status: PostStatus;
  thumbnail_url: string | null;
  published_at: string | null;
  author: Pick<User, 'id' | 'name' | 'avatar_url'>;
  categories: Category[];
  tags: Tag[];
  comments_count: number;
  likes_count: number;
  liked_by_current_user?: boolean;
  created_at: string;
  updated_at: string;
};

// types/category.ts
export type Category = {
  id: number;
  category_name: string;
  slug: string;
  description: string | null;
  posts_count?: number;
};

// types/tag.ts
export type Tag = {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
};

// types/comment.ts
export type Comment = {
  id: number;
  body: string;
  parent_id: number | null;
  author: Pick<User, 'id' | 'name' | 'avatar_url'>;
  replies: Comment[];
  created_at: string;
};
```

---

## 状態管理

| 状態 | 手法 | 理由 |
|---|---|---|
| JWTトークン | `localStorage` + React Context | ページリロード後も保持する必要があるため |
| ログイン状態 | React Context (`useAuth`) | アプリ全体で参照するため |
| サーバーデータ | `useState` + Axios | Next.js App Router ではシンプルな fetch で十分 |
| フォーム状態 | React Hook Form + Zod | バリデーションとパフォーマンスを両立 |

### 認証コンテキスト例

```typescript
// features/auth/hooks/useAuth.ts
type AuthContext = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};
```

---

## Zodバリデーションスキーマ

```typescript
// features/posts/schemas.ts
import { z } from 'zod';

export const PostFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(255, '255文字以内で入力してください'),
  body: z.string().min(1, '本文は必須です'),
  excerpt: z.string().max(500).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  category_ids: z.array(z.number()),
  tag_ids: z.array(z.number()),
});

export type PostFormValues = z.infer<typeof PostFormSchema>;
```

---

## ルーティング設計

```typescript
// Next.js App Router ファイル構成
app/
├── layout.tsx                       # 共通レイアウト（Header/Footer）
├── page.tsx                         # / トップページ
├── login/page.tsx                   # /login
├── register/page.tsx                # /register
├── posts/
│   ├── page.tsx                     # /posts 記事一覧
│   ├── new/page.tsx                 # /posts/new 記事作成
│   └── [slug]/
│       ├── page.tsx                 # /posts/[slug] 記事詳細
│       └── edit/page.tsx            # /posts/[slug]/edit 記事編集
├── categories/[slug]/page.tsx       # /categories/[slug]
├── tags/[slug]/page.tsx             # /tags/[slug]
├── dashboard/page.tsx               # /dashboard
└── profile/page.tsx                 # /profile
```

---

## Axiosインスタンス設定

```typescript
// lib/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// リクエストインターセプター: JWTを自動付与
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター: 401でログインページへ
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```
