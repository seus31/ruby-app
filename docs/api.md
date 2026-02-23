# API仕様

## 基本仕様

| 項目 | 内容 |
|---|---|
| ベースURL | `http://localhost:3001/api` |
| フォーマット | JSON |
| 文字コード | UTF-8 |
| 認証方式 | JWT Bearer Token |

### 認証が必要なエンドポイント

リクエストヘッダーに以下を付与する。

```
Authorization: Bearer <JWT_TOKEN>
```

### 共通レスポンス

**成功**
```json
HTTP 200 OK
{ "data": ... }
```

**バリデーションエラー**
```json
HTTP 422 Unprocessable Entity
{ "errors": ["フィールド名 エラーメッセージ"] }
```

**認証エラー**
```json
HTTP 401 Unauthorized
{ "error": "Unauthorized" }
```

**リソース未存在**
```json
HTTP 404 Not Found
{ "error": "Record not found" }
```

---

## 認証 API

### POST /api/auth/register — ユーザー登録

**リクエスト**
```json
{
  "name": "田中 太郎",
  "email": "taro@example.com",
  "password": "password123"
}
```

**レスポンス** `201 Created`
```json
{
  "message": "User created successfully"
}
```

---

### POST /api/auth/login — ログイン

**リクエスト**
```json
{
  "email": "taro@example.com",
  "password": "password123"
}
```

**レスポンス** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## ユーザー API

### GET /api/v1/users/:id — ユーザープロフィール取得

**認証**: 不要

**レスポンス** `200 OK`
```json
{
  "id": 1,
  "name": "田中 太郎",
  "bio": "Railsエンジニアです",
  "avatar_url": "https://...",
  "posts_count": 10,
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

---

### PATCH /api/v1/users/:id — プロフィール更新

**認証**: 必要（本人のみ）

**リクエスト**
```json
{
  "user": {
    "name": "田中 二郎",
    "bio": "フロントエンドエンジニアです",
    "avatar_url": "https://..."
  }
}
```

**レスポンス** `200 OK`
```json
{
  "id": 1,
  "name": "田中 二郎",
  "bio": "フロントエンドエンジニアです",
  "avatar_url": "https://...",
  "updated_at": "2025-06-01T00:00:00.000Z"
}
```

---

## 記事 API

### GET /api/v1/posts — 記事一覧

**認証**: 不要（公開記事のみ返す）

**クエリパラメータ**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| page | integer | 1 | ページ番号 |
| per_page | integer | 20 | 1ページあたりの件数（最大50） |
| q | string | - | タイトル・本文の全文検索 |
| category_slug | string | - | カテゴリスラッグでフィルタ |
| tag_slug | string | - | タグスラッグでフィルタ |
| user_id | integer | - | ユーザーIDでフィルタ |

**レスポンス** `200 OK`
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Railsの基礎",
      "excerpt": "Railsとは...",
      "slug": "rails-basics",
      "status": "published",
      "thumbnail_url": "https://...",
      "published_at": "2025-06-01T00:00:00.000Z",
      "author": {
        "id": 1,
        "name": "田中 太郎",
        "avatar_url": "https://..."
      },
      "categories": [{ "id": 1, "category_name": "Ruby", "slug": "ruby" }],
      "tags": [{ "id": 1, "name": "Rails", "slug": "rails" }],
      "comments_count": 5,
      "likes_count": 12
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 98
  }
}
```

---

### GET /api/v1/posts/:slug — 記事詳細

**認証**: 不要（公開記事のみ）

**レスポンス** `200 OK`
```json
{
  "id": 1,
  "title": "Railsの基礎",
  "body": "# Railsとは\n\nRuby on Rails は...",
  "excerpt": "Railsとは...",
  "slug": "rails-basics",
  "status": "published",
  "thumbnail_url": "https://...",
  "published_at": "2025-06-01T00:00:00.000Z",
  "author": {
    "id": 1,
    "name": "田中 太郎",
    "avatar_url": "https://..."
  },
  "categories": [{ "id": 1, "category_name": "Ruby", "slug": "ruby" }],
  "tags": [{ "id": 1, "name": "Rails", "slug": "rails" }],
  "comments_count": 5,
  "likes_count": 12,
  "liked_by_current_user": false
}
```

---

### POST /api/v1/posts — 記事作成

**認証**: 必要

**リクエスト**
```json
{
  "post": {
    "title": "新しい記事",
    "body": "# 見出し\n\n本文...",
    "excerpt": "この記事では...",
    "status": "draft",
    "thumbnail_url": "https://...",
    "category_ids": [1, 2],
    "tag_ids": [3, 4]
  }
}
```

**レスポンス** `201 Created`
```json
{
  "id": 10,
  "title": "新しい記事",
  "slug": "new-article",
  "status": "draft",
  ...
}
```

---

### PUT /api/v1/posts/:slug — 記事更新

**認証**: 必要（投稿者本人のみ）

**リクエスト**（`POST /api/v1/posts` と同形式）

**レスポンス** `200 OK`

---

### DELETE /api/v1/posts/:slug — 記事削除

**認証**: 必要（投稿者本人のみ）

**レスポンス** `200 OK`
```json
{ "message": "Post successfully deleted" }
```

---

## カテゴリ API

### GET /api/v1/categories — カテゴリ一覧

**認証**: 不要

**レスポンス** `200 OK`
```json
[
  {
    "id": 1,
    "category_name": "Ruby",
    "slug": "ruby",
    "description": "Ruby関連の記事",
    "posts_count": 15
  }
]
```

---

### GET /api/v1/categories/:slug — カテゴリ詳細

**レスポンス** `200 OK`（カテゴリ情報）

### POST /api/v1/categories — カテゴリ作成

**認証**: 必要

**リクエスト**
```json
{
  "category": {
    "category_name": "TypeScript",
    "description": "TypeScript関連"
  }
}
```

### PUT /api/v1/categories/:slug — カテゴリ更新

**認証**: 必要

### DELETE /api/v1/categories/:slug — カテゴリ削除

**認証**: 必要

---

## タグ API

### GET /api/v1/tags — タグ一覧

**認証**: 不要

**レスポンス** `200 OK`
```json
[
  { "id": 1, "name": "Rails", "slug": "rails", "posts_count": 20 }
]
```

### POST /api/v1/tags — タグ作成

**認証**: 必要

**リクエスト**
```json
{ "tag": { "name": "Docker" } }
```

### DELETE /api/v1/tags/:slug — タグ削除

**認証**: 必要

---

## コメント API

### GET /api/v1/posts/:post_slug/comments — コメント一覧

**認証**: 不要

**レスポンス** `200 OK`
```json
[
  {
    "id": 1,
    "body": "参考になりました！",
    "parent_id": null,
    "author": { "id": 2, "name": "鈴木 花子", "avatar_url": "..." },
    "created_at": "2025-06-01T00:00:00.000Z",
    "replies": [
      {
        "id": 2,
        "body": "ありがとうございます！",
        "parent_id": 1,
        "author": { "id": 1, "name": "田中 太郎", "avatar_url": "..." },
        "created_at": "2025-06-02T00:00:00.000Z",
        "replies": []
      }
    ]
  }
]
```

### POST /api/v1/posts/:post_slug/comments — コメント投稿

**認証**: 必要

**リクエスト**
```json
{
  "comment": {
    "body": "とても参考になりました。",
    "parent_id": null
  }
}
```

**レスポンス** `201 Created`

### DELETE /api/v1/posts/:post_slug/comments/:id — コメント削除

**認証**: 必要（投稿者本人のみ）

**レスポンス** `200 OK`

---

## いいね API

### POST /api/v1/posts/:post_slug/likes — いいね追加

**認証**: 必要

**レスポンス** `201 Created`
```json
{ "likes_count": 13 }
```

### DELETE /api/v1/posts/:post_slug/likes — いいね取消

**認証**: 必要

**レスポンス** `200 OK`
```json
{ "likes_count": 12 }
```

---

## エンドポイント一覧

| メソッド | パス | 認証 | 説明 |
|---|---|---|---|
| POST | /api/auth/register | 不要 | ユーザー登録 |
| POST | /api/auth/login | 不要 | ログイン |
| GET | /api/v1/users/:id | 不要 | プロフィール取得 |
| PATCH | /api/v1/users/:id | 必要 | プロフィール更新 |
| GET | /api/v1/posts | 不要 | 記事一覧 |
| GET | /api/v1/posts/:slug | 不要 | 記事詳細 |
| POST | /api/v1/posts | 必要 | 記事作成 |
| PUT | /api/v1/posts/:slug | 必要 | 記事更新 |
| DELETE | /api/v1/posts/:slug | 必要 | 記事削除 |
| GET | /api/v1/categories | 不要 | カテゴリ一覧 |
| GET | /api/v1/categories/:slug | 不要 | カテゴリ詳細 |
| POST | /api/v1/categories | 必要 | カテゴリ作成 |
| PUT | /api/v1/categories/:slug | 必要 | カテゴリ更新 |
| DELETE | /api/v1/categories/:slug | 必要 | カテゴリ削除 |
| GET | /api/v1/tags | 不要 | タグ一覧 |
| POST | /api/v1/tags | 必要 | タグ作成 |
| DELETE | /api/v1/tags/:slug | 必要 | タグ削除 |
| GET | /api/v1/posts/:post_slug/comments | 不要 | コメント一覧 |
| POST | /api/v1/posts/:post_slug/comments | 必要 | コメント投稿 |
| DELETE | /api/v1/posts/:post_slug/comments/:id | 必要 | コメント削除 |
| POST | /api/v1/posts/:post_slug/likes | 必要 | いいね追加 |
| DELETE | /api/v1/posts/:post_slug/likes | 必要 | いいね取消 |
