# システムアーキテクチャ設計

## システム全体構成

```
┌─────────────────────────────────────────────────────┐
│                    Docker Compose                    │
│                                                     │
│  ┌──────────────┐        ┌──────────────────────┐  │
│  │   Frontend   │◄──────►│      Backend         │  │
│  │  Next.js 15  │  HTTP  │  Rails 7.1 API Mode  │  │
│  │  Port: 3000  │        │  Port: 3001          │  │
│  └──────────────┘        └──────────┬───────────┘  │
│                                     │               │
│                           ┌─────────▼──────────┐   │
│                           │     MySQL 8.0       │   │
│                           │     Port: 3306      │   │
│                           └────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 技術スタック詳細

### Frontend

| 項目 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js (App Router) | 15.1.6 |
| UIライブラリ | React | 19 |
| 言語 | TypeScript | 5.x |
| スタイル | Bootstrap | 5.3.3 |
| HTTPクライアント | Axios | 1.7.9 |
| バリデーション | Zod | 最新版 |
| テスト | Jest / Testing Library | - |

### Backend

| 項目 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Ruby on Rails (API Mode) | 7.1.3 |
| 言語 | Ruby | 3.x |
| データベース | MySQL | 8.0 |
| 認証 | JWT (json-jwt gem) | - |
| シリアライザ | active_model_serializers | - |
| テスト | RSpec | - |

## ディレクトリ構成

### Backend

```
backend/
└── app/
    ├── controllers/
    │   └── api/
    │       ├── auth_controller.rb        # 認証 (register/login)
    │       ├── base_controller.rb        # 共通基底
    │       └── v1/
    │           ├── protected_controller.rb   # JWT検証共通
    │           ├── posts_controller.rb       # 記事CRUD
    │           ├── categories_controller.rb  # カテゴリCRUD
    │           ├── tags_controller.rb        # タグCRUD      (追加予定)
    │           ├── comments_controller.rb    # コメントCRUD  (追加予定)
    │           ├── likes_controller.rb       # いいね        (追加予定)
    │           └── users_controller.rb       # ユーザー管理  (追加予定)
    ├── models/
    │   ├── user.rb
    │   ├── post.rb
    │   ├── category.rb
    │   ├── tag.rb              (追加予定)
    │   ├── post_category.rb    (追加予定)
    │   ├── post_tag.rb         (追加予定)
    │   ├── comment.rb          (追加予定)
    │   └── like.rb             (追加予定)
    ├── serializers/
    │   ├── post_serializer.rb
    │   ├── category_serializer.rb
    │   ├── tag_serializer.rb       (追加予定)
    │   ├── comment_serializer.rb   (追加予定)
    │   └── user_serializer.rb      (追加予定)
    └── services/
        ├── auth_service.rb         (追加予定)
        └── post_search_service.rb  (追加予定)
```

### Frontend

```
frontend/src/app/
├── layout.tsx                    # 共通レイアウト
├── page.tsx                      # トップページ（記事一覧）
├── login/
│   └── page.tsx                  # ログイン
├── register/
│   └── page.tsx                  # 会員登録
├── posts/
│   ├── page.tsx                  # 記事一覧 (追加予定)
│   ├── new/
│   │   └── page.tsx              # 記事作成 (追加予定)
│   └── [slug]/
│       ├── page.tsx              # 記事詳細 (追加予定)
│       └── edit/
│           └── page.tsx          # 記事編集 (追加予定)
├── categories/
│   └── [slug]/
│       └── page.tsx              # カテゴリ別記事一覧 (追加予定)
├── tags/
│   └── [slug]/
│       └── page.tsx              # タグ別記事一覧 (追加予定)
├── dashboard/
│   └── page.tsx                  # マイページ (追加予定)
└── profile/
    └── page.tsx                  # プロフィール編集 (追加予定)

frontend/src/
├── features/
│   ├── auth/
│   │   ├── components/           # LoginForm, RegisterForm
│   │   ├── hooks/                # useAuth
│   │   └── api.ts                # auth API呼び出し
│   ├── posts/
│   │   ├── components/           # PostCard, PostForm, PostDetail
│   │   ├── hooks/                # usePosts, usePost
│   │   └── api.ts
│   ├── categories/
│   │   ├── components/           # CategoryBadge, CategoryList
│   │   └── api.ts
│   ├── tags/
│   │   ├── components/           # TagBadge, TagCloud
│   │   └── api.ts
│   └── comments/
│       ├── components/           # CommentList, CommentForm
│       ├── hooks/                # useComments
│       └── api.ts
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Pagination.tsx
│   │   └── SearchBar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Alert.tsx
├── lib/
│   ├── axios.ts                  # Axiosインスタンス設定
│   ├── auth.ts                   # JWT管理ユーティリティ
│   └── utils.ts
└── types/
    ├── post.ts
    ├── user.ts
    ├── category.ts
    ├── tag.ts
    └── comment.ts
```

## 認証フロー

```
クライアント                         サーバー
    │                                   │
    │── POST /api/auth/login ──────────►│
    │   { email, password }             │ bcryptでパスワード検証
    │                                   │ JWTトークン生成 (24h有効)
    │◄── { token } ─────────────────────│
    │                                   │
    │ localStorage に token 保存         │
    │                                   │
    │── GET /api/v1/posts ─────────────►│
    │   Authorization: Bearer <token>   │ JWT検証
    │                                   │ user_id をデコード
    │◄── [posts] ────────────────────── │
```

## セキュリティ方針

| 脅威 | 対策 |
|---|---|
| SQLインジェクション | ActiveRecord Prepared Statement |
| XSS | React JSX自動エスケープ / Railsエスケープ |
| CSRF | API Mode（Cookieを使用しない） |
| 認証バイパス | JWT署名検証（HS256） / トークン有効期限24h |
| 不正アクセス | ProtectedControllerによる認証必須化 |
| パスワード漏洩 | bcrypt (has_secure_password) |

## エラーハンドリング方針

### Backend（Rails）

```ruby
# application_controller.rb
rescue_from ActiveRecord::RecordNotFound,   with: :not_found
rescue_from ActiveRecord::RecordInvalid,    with: :unprocessable_entity
rescue_from JWT::DecodeError,               with: :unauthorized
```

### Frontend（Next.js）

- API エラーは Axios インターセプターで一元処理
- 401 → ログインページへリダイレクト
- 422 → フォームバリデーションエラー表示
- 500 → トースト通知でエラーメッセージ表示
