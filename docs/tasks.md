# 実装タスクリスト

設計ドキュメント（[database.md](./database.md) / [api.md](./api.md) / [frontend.md](./frontend.md)）をもとに作成した実装タスク一覧。
各タスクは **1ファイル = 1タスク** の粒度で定義し、AIによる実装を想定している。

## 依存関係の概要

```
Phase 1: Migration
  └─ Phase 2: Model
       └─ Phase 3: Serializer
            └─ Phase 4: Controller
                 └─ Phase 5: Routes
                      └─ Phase 6: RSpec

Phase 7: FE Types (独立)
  └─ Phase 8: FE Lib
       └─ Phase 9: FE Auth
            └─ Phase 10: FE Layout/UI
                 └─ Phase 11-15: FE Features
                      └─ Phase 16: FE Pages
```

---

## Phase 1: Migration（9タスク）

| ID | タスク | 依存 |
|---|---|---|
| `mig-users` | [Migration] usersにbio/avatar_urlを追加 | - |
| `mig-posts` | [Migration] postsにuser_id/slug等を追加 | - |
| `mig-categories` | [Migration] categoriesにslug/descriptionを追加 | - |
| `mig-tags` | [Migration] tagsテーブルを作成 | - |
| `mig-post-cats` | [Migration] post_categoriesテーブルを作成 | `mig-posts` `mig-categories` |
| `mig-post-tags` | [Migration] post_tagsテーブルを作成 | `mig-posts` `mig-tags` |
| `mig-comments` | [Migration] commentsテーブルを作成 | `mig-posts` |
| `mig-likes` | [Migration] likesテーブルを作成 | `mig-posts` |
| `mig-run` | [Migration] db:migrateを実行 | 上記8件すべて |

### 実装詳細

#### `mig-users`
```ruby
# add_bio_avatar_to_users
add_column :users, :bio, :text
add_column :users, :avatar_url, :string
```

#### `mig-posts`
```ruby
# add_columns_to_posts
add_column :posts, :user_id, :bigint, null: false
add_column :posts, :slug, :string
add_column :posts, :excerpt, :text
add_column :posts, :thumbnail_url, :string
add_column :posts, :published_at, :datetime
add_index :posts, :slug, unique: true
add_index :posts, :user_id
add_index :posts, :status
add_index :posts, :published_at
```

#### `mig-categories`
```ruby
# add_slug_description_to_categories
add_column :categories, :slug, :string
add_column :categories, :description, :text
add_index :categories, :slug, unique: true
```

#### `mig-tags`
```ruby
# create_tags
t.string :name, null: false
t.string :slug, null: false
add_index :tags, :name, unique: true
add_index :tags, :slug, unique: true
```

#### `mig-post-cats`
```ruby
# create_post_categories
t.bigint :post_id, null: false
t.bigint :category_id, null: false
add_index [:post_id, :category_id], unique: true
add_index :category_id
```

#### `mig-post-tags`
```ruby
# create_post_tags
t.bigint :post_id, null: false
t.bigint :tag_id, null: false
add_index [:post_id, :tag_id], unique: true
add_index :tag_id
```

#### `mig-comments`
```ruby
# create_comments
t.references :post, null: false, foreign_key: true
t.references :user, null: false, foreign_key: true
t.bigint :parent_id   # nullable (返信用)
t.text :body, null: false
add_index :parent_id
```

#### `mig-likes`
```ruby
# create_likes
t.references :post, null: false, foreign_key: true
t.references :user, null: false, foreign_key: true
add_index [:post_id, :user_id], unique: true  # 二重いいね防止
```

---

## Phase 2: Model（8タスク）

| ID | タスク | 依存 |
|---|---|---|
| `model-user` | [Model] Userモデルを更新 | `mig-run` |
| `model-post` | [Model] Postモデルを更新 | `mig-run` |
| `model-category` | [Model] Categoryモデルを更新 | `mig-run` |
| `model-tag` | [Model] Tagモデルを新規作成 | `mig-run` |
| `model-post-cat` | [Model] PostCategoryモデルを新規作成 | `mig-run` |
| `model-post-tag` | [Model] PostTagモデルを新規作成 | `mig-run` |
| `model-comment` | [Model] Commentモデルを新規作成 | `mig-run` |
| `model-like` | [Model] Likeモデルを新規作成 | `mig-run` |

### 実装詳細

#### `model-user`
```ruby
has_many :posts, dependent: :destroy
has_many :comments, dependent: :destroy
has_many :likes, dependent: :destroy
validates :name, presence: true
```

#### `model-post`
```ruby
belongs_to :user
has_many :post_categories, dependent: :destroy
has_many :categories, through: :post_categories
has_many :post_tags, dependent: :destroy
has_many :tags, through: :post_tags
has_many :comments, dependent: :destroy
has_many :likes, dependent: :destroy
enum status: { draft: 0, published: 1, archived: 2 }
validates :title, :body, presence: true
before_validation :generate_slug, on: :create
# generate_slug: SecureRandom.hex(8) ベースでユニークなslugを生成
```

#### `model-category`
```ruby
has_many :post_categories, dependent: :destroy
has_many :posts, through: :post_categories
before_validation :generate_slug, on: :create
validates :category_name, presence: true, uniqueness: true
```

#### `model-tag`
```ruby
has_many :post_tags, dependent: :destroy
has_many :posts, through: :post_tags
before_validation :generate_slug, on: :create
validates :name, presence: true, uniqueness: true
```

#### `model-post-cat`
```ruby
belongs_to :post
belongs_to :category
validates :post_id, uniqueness: { scope: :category_id }
```

#### `model-post-tag`
```ruby
belongs_to :post
belongs_to :tag
validates :post_id, uniqueness: { scope: :tag_id }
```

#### `model-comment`
```ruby
belongs_to :post
belongs_to :user
belongs_to :parent, class_name: 'Comment', optional: true
has_many :replies, class_name: 'Comment', foreign_key: :parent_id, dependent: :destroy
validates :body, presence: true
```

#### `model-like`
```ruby
belongs_to :post
belongs_to :user
validates :post_id, uniqueness: { scope: :user_id, message: 'already liked' }
```

---

## Phase 3: Serializer（5タスク）

| ID | タスク | 依存 |
|---|---|---|
| `ser-user` | [Serializer] UserSerializerを新規作成 | `model-user` |
| `ser-post` | [Serializer] PostSerializerを更新 | `model-post` `ser-user` |
| `ser-category` | [Serializer] CategorySerializerを更新 | `model-category` |
| `ser-tag` | [Serializer] TagSerializerを新規作成 | `model-tag` |
| `ser-comment` | [Serializer] CommentSerializerを新規作成 | `model-comment` `ser-user` |

### 実装詳細

#### `ser-user`
```ruby
attributes :id, :name, :bio, :avatar_url, :created_at
attribute :posts_count { object.posts.count }
```

#### `ser-post`
```ruby
attributes :id, :title, :body, :excerpt, :slug, :status,
           :thumbnail_url, :published_at, :created_at, :updated_at
attribute :comments_count { object.comments.count }
attribute :likes_count { object.likes.count }
attribute :liked_by_current_user { scope&.likes&.exists?(post: object) }
belongs_to :author, serializer: UserSerializer
has_many :categories, serializer: CategorySerializer
has_many :tags, serializer: TagSerializer
```

#### `ser-category`
```ruby
attributes :id, :category_name, :slug, :description
attribute :posts_count { object.posts.count }
```

#### `ser-tag`
```ruby
attributes :id, :name, :slug
attribute :posts_count { object.posts.count }
```

#### `ser-comment`
```ruby
attributes :id, :body, :parent_id, :created_at
belongs_to :author, serializer: UserSerializer
has_many :replies, serializer: CommentSerializer  # 再帰ネスト
```

---

## Phase 4: Controller（22タスク）

| ID | タスク | 依存 |
|---|---|---|
| `ctrl-error` | [Controller] 共通エラーハンドリングを実装 | `model-post` |
| `ctrl-protected` | [Controller] ProtectedControllerにcurrent_userを実装 | `ser-user` |
| `ctrl-post-index` | [Controller] PostsController#indexを更新 | `ser-post` `ctrl-protected` |
| `ctrl-post-show` | [Controller] PostsController#showをslugベースに変更 | `ser-post` `ctrl-protected` |
| `ctrl-post-create` | [Controller] PostsController#createを更新 | `ser-post` `ctrl-protected` |
| `ctrl-post-update` | [Controller] PostsController#updateを更新 | `ctrl-post-create` |
| `ctrl-post-destroy` | [Controller] PostsController#destroyを更新 | `ctrl-protected` |
| `ctrl-cat-index` | [Controller] CategoriesController#indexを更新 | `ser-category` |
| `ctrl-cat-show` | [Controller] CategoriesController#showをslugベースに変更 | `ser-category` |
| `ctrl-cat-create` | [Controller] CategoriesController#createを更新 | `ser-category` `ctrl-protected` |
| `ctrl-cat-update` | [Controller] CategoriesController#updateをslugベースに変更 | `ctrl-cat-create` |
| `ctrl-cat-destroy` | [Controller] CategoriesController#destroyを追加 | `ctrl-cat-create` |
| `ctrl-tag-index` | [Controller] TagsController#indexを新規作成 | `ser-tag` |
| `ctrl-tag-create` | [Controller] TagsController#createを新規作成 | `ser-tag` `ctrl-protected` |
| `ctrl-tag-destroy` | [Controller] TagsController#destroyを新規作成 | `ctrl-tag-create` |
| `ctrl-comment-index` | [Controller] CommentsController#indexを新規作成 | `ser-comment` |
| `ctrl-comment-create` | [Controller] CommentsController#createを新規作成 | `ser-comment` `ctrl-protected` |
| `ctrl-comment-destroy` | [Controller] CommentsController#destroyを新規作成 | `ctrl-comment-create` |
| `ctrl-like-create` | [Controller] LikesController#createを新規作成 | `model-like` `ctrl-protected` |
| `ctrl-like-destroy` | [Controller] LikesController#destroyを新規作成 | `ctrl-like-create` |
| `ctrl-user-show` | [Controller] UsersController#showを新規作成 | `ser-user` |
| `ctrl-user-update` | [Controller] UsersController#updateを新規作成 | `ser-user` `ctrl-protected` |

### 実装詳細

#### `ctrl-error`
```ruby
# app/controllers/application_controller.rb
rescue_from ActiveRecord::RecordNotFound do
  render json: { error: 'Not found' }, status: :not_found
end
rescue_from ActiveRecord::RecordInvalid do |e|
  render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
end
```

#### `ctrl-protected`
```ruby
before_action :authenticate_user!

def authenticate_user!
  token = request.headers['Authorization']&.split(' ')&.last
  decoded = decode_token(token)
  @current_user = User.find(decoded[0]['user_id']) if decoded
  render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
end

def current_user = @current_user
```

#### `ctrl-post-index`
- `published` ステータスのみ返す
- `q`: title/body の LIKE 検索
- `category_slug` / `tag_slug` / `user_id` フィルタ
- `page` / `per_page`（最大50）ページネーション
- レスポンス: `{ posts: [...], meta: { current_page, total_pages, total_count } }`

#### `ctrl-post-show`
```ruby
def set_post
  @post = Post.find_by!(slug: params[:slug])
end
# liked_by_current_user を serializer scope で渡す
render json: @post, serializer: PostSerializer, scope: current_user
```

#### `ctrl-post-create` / `ctrl-post-update`
- `post_params`: title / body / excerpt / status / thumbnail_url / category_ids / tag_ids
- `post.user = current_user`
- `post.category_ids = params[:post][:category_ids]` で中間テーブルを同期
- `published_at`: status が `published` に変わった時点で自動セット

#### `ctrl-like-create`
```ruby
Like.create!(post: @post, user: current_user)
render json: { likes_count: @post.likes.count }, status: :created
# 重複時は rescue_from ActiveRecord::RecordInvalid で 422
```

---

## Phase 5: Routes（1タスク）

| ID | タスク | 依存 |
|---|---|---|
| `routes` | [Routes] routes.rbを更新 | Phase 4 全コントローラ |

### 実装詳細

```ruby
namespace :api do
  post '/auth/register', to: 'auth#register'
  post '/auth/login',    to: 'auth#login'

  namespace :v1 do
    resources :posts, param: :slug do
      resources :comments, only: %i[index create destroy], param: :id
      resource  :likes,    only: %i[create destroy]
    end
    resources :categories, param: :slug
    resources :tags,       param: :slug, only: %i[index create destroy]
    resources :users,      only: %i[show update]
  end
end
```

---

## Phase 6: RSpec（12タスク）

| ID | タスク | 依存 |
|---|---|---|
| `spec-model-user` | [Spec] user_spec.rbを作成 | `model-user` |
| `spec-model-post` | [Spec] post_spec.rbを作成 | `model-post` |
| `spec-model-tag` | [Spec] tag_spec.rbを作成 | `model-tag` |
| `spec-model-comment` | [Spec] comment_spec.rbを作成 | `model-comment` |
| `spec-model-like` | [Spec] like_spec.rbを作成 | `model-like` |
| `spec-req-auth` | [Spec] auth_spec.rbを作成 | `routes` |
| `spec-req-posts` | [Spec] posts_spec.rbを作成 | `routes` |
| `spec-req-cats` | [Spec] categories_spec.rbを作成 | `routes` |
| `spec-req-tags` | [Spec] tags_spec.rbを作成 | `routes` |
| `spec-req-comments` | [Spec] comments_spec.rbを作成 | `routes` |
| `spec-req-likes` | [Spec] likes_spec.rbを作成 | `routes` |
| `spec-req-users` | [Spec] users_spec.rbを作成 | `routes` |

### テスト観点

| ファイル | 主なテストケース |
|---|---|
| `user_spec.rb` | associations / email uniqueness & format / name presence / has_secure_password |
| `post_spec.rb` | associations / enum status / title&body presence / slug自動生成 |
| `tag_spec.rb` | associations / name uniqueness / slug自動生成 |
| `comment_spec.rb` | associations / body presence / 返信ネスト（parent_id） |
| `like_spec.rb` | associations / post_id+user_id の uniqueness（二重いいね防止） |
| `auth_spec.rb` | register正常/重複/NG / login正常→token返却/PW誤り/未存在 |
| `posts_spec.rb` | index(認証不要/published絞込/検索/フィルタ) / show / create(認証あり/なし) / update(本人/他人) / destroy(本人/他人) |
| `categories_spec.rb` | index/show(認証不要) / create(認証必須) / update / destroy(紐付きpost有→422) |
| `tags_spec.rb` | index(認証不要) / create(認証必須) / destroy(PostTag有→422) |
| `comments_spec.rb` | index(ネスト構造) / create(parent_idあり/なし) / destroy(本人/他人) |
| `likes_spec.rb` | create(認証必須/二重→422) / destroy(likes_count返却) |
| `users_spec.rb` | show(認証不要) / update(本人/他人→403) |

---

## Phase 7: FE Types（5タスク）

> **依存なし。Phase 1〜6と並行して着手可能。**

| ID | タスク |
|---|---|
| `fe-type-user` | [Types] src/types/user.ts を作成 |
| `fe-type-post` | [Types] src/types/post.ts を作成 |
| `fe-type-category` | [Types] src/types/category.ts を作成 |
| `fe-type-tag` | [Types] src/types/tag.ts を作成 |
| `fe-type-comment` | [Types] src/types/comment.ts を作成 |

### 実装詳細

```typescript
// user.ts
export type User = {
  id: number; name: string; bio: string | null;
  avatar_url: string | null; posts_count?: number; created_at: string;
};
export type AuthUser = Pick<User, 'id' | 'name' | 'avatar_url'>;

// post.ts
export type PostStatus = 'draft' | 'published' | 'archived';
export type Post = {
  id: number; title: string; body: string; excerpt: string | null;
  slug: string; status: PostStatus; thumbnail_url: string | null;
  published_at: string | null; author: AuthUser;
  categories: Category[]; tags: Tag[];
  comments_count: number; likes_count: number;
  liked_by_current_user?: boolean;
  created_at: string; updated_at: string;
};
export type PostMeta = { current_page: number; total_pages: number; total_count: number; };
export type PostListResponse = { posts: Post[]; meta: PostMeta; };

// category.ts
export type Category = {
  id: number; category_name: string; slug: string;
  description: string | null; posts_count?: number;
};

// tag.ts
export type Tag = { id: number; name: string; slug: string; posts_count?: number; };

// comment.ts
export type Comment = {
  id: number; body: string; parent_id: number | null;
  author: AuthUser; replies: Comment[]; created_at: string;
};
```

---

## Phase 8: FE Lib（2タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-lib-axios` | [Lib] src/lib/axios.ts を作成 | `fe-type-user` `fe-type-post` |
| `fe-lib-auth` | [Lib] src/lib/auth.ts を作成 | `fe-type-user` |

### 実装詳細

#### `fe-lib-axios`
```typescript
// baseURL, requestインターセプター(JWT付与),
// responseインターセプター(401→/login リダイレクト)
```

#### `fe-lib-auth`
```typescript
export const getToken = (): string | null => localStorage.getItem('token');
export const setToken = (token: string): void => localStorage.setItem('token', token);
export const removeToken = (): void => localStorage.removeItem('token');
export const isTokenValid = (): boolean => { /* JWT exp check */ };
```

---

## Phase 9: FE Auth（5タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-auth-api` | [Auth] features/auth/api.ts を作成 | `fe-lib-axios` |
| `fe-auth-schema` | [Auth] features/auth/schemas.ts を作成 | `fe-type-user` |
| `fe-auth-hook` | [Auth] features/auth/hooks/useAuth.ts を作成 | `fe-auth-api` `fe-auth-schema` `fe-lib-auth` |
| `fe-login-form` | [Auth] LoginForm.tsx を作成 | `fe-auth-hook` |
| `fe-register-form` | [Auth] RegisterForm.tsx を作成 | `fe-auth-hook` |

---

## Phase 10: FE Layout / UI（9タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-ui-button` | [UI] Button.tsx を作成 | - |
| `fe-ui-modal` | [UI] Modal.tsx を作成 | - |
| `fe-ui-alert` | [UI] Alert.tsx を作成 | - |
| `fe-ui-spinner` | [UI] Spinner.tsx を作成 | - |
| `fe-ui-pagination` | [UI] Pagination.tsx を作成 | - |
| `fe-ui-searchbar` | [UI] SearchBar.tsx を作成 | - |
| `fe-layout-header` | [Layout] Header.tsx を作成 | `fe-auth-hook` |
| `fe-layout-footer` | [Layout] Footer.tsx を作成 | `fe-ui-button` |
| `fe-layout-root` | [Layout] app/layout.tsx を更新 | `fe-layout-header` `fe-layout-footer` |

---

## Phase 11: FE Posts Feature（8タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-post-api` | [Posts] features/posts/api.ts を作成 | `fe-lib-axios` `fe-type-post` |
| `fe-post-schema` | [Posts] features/posts/schemas.ts を作成 | `fe-type-post` `fe-type-category` `fe-type-tag` |
| `fe-post-hooks` | [Posts] hooks/usePosts.ts を作成 | `fe-post-api` |
| `fe-post-hook` | [Posts] hooks/usePost.ts を作成 | `fe-post-api` |
| `fe-post-card` | [Posts] PostCard.tsx を作成 | `fe-cat-badge` `fe-tag-badge` `fe-type-post` |
| `fe-post-list` | [Posts] PostList.tsx を作成 | `fe-post-card` `fe-ui-spinner` |
| `fe-md-editor` | [Posts] MarkdownEditor.tsx を作成 | - |
| `fe-post-form` | [Posts] PostForm.tsx を作成 | `fe-post-schema` `fe-md-editor` `fe-ui-button` |
| `fe-post-detail-c` | [Posts] PostDetail.tsx を作成 | `fe-post-card` `fe-like-button` |

---

## Phase 12: FE Categories Feature（3タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-cat-api` | [Categories] features/categories/api.ts を作成 | `fe-lib-axios` `fe-type-category` |
| `fe-cat-badge` | [Categories] CategoryBadge.tsx を作成 | `fe-type-category` |
| `fe-cat-list` | [Categories] CategoryList.tsx を作成 | `fe-cat-badge` |

---

## Phase 13: FE Tags Feature（3タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-tag-api` | [Tags] features/tags/api.ts を作成 | `fe-lib-axios` `fe-type-tag` |
| `fe-tag-badge` | [Tags] TagBadge.tsx を作成 | `fe-type-tag` |
| `fe-tag-cloud` | [Tags] TagCloud.tsx を作成 | `fe-tag-badge` |

---

## Phase 14: FE Comments Feature（5タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-comment-api` | [Comments] features/comments/api.ts を作成 | `fe-lib-axios` `fe-type-comment` |
| `fe-comment-hook` | [Comments] hooks/useComments.ts を作成 | `fe-comment-api` |
| `fe-comment-item` | [Comments] CommentItem.tsx を作成 | `fe-comment-hook` `fe-ui-button` |
| `fe-comment-list` | [Comments] CommentList.tsx を作成 | `fe-comment-item` |
| `fe-comment-form` | [Comments] CommentForm.tsx を作成 | `fe-comment-hook` `fe-auth-hook` |

---

## Phase 15: FE Likes Feature（2タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-like-api` | [Likes] features/likes/api.ts を作成 | `fe-lib-axios` `fe-type-post` |
| `fe-like-button` | [Likes] LikeButton.tsx を作成 | `fe-like-api` `fe-auth-hook` |

---

## Phase 16: FE Pages（11タスク）

| ID | タスク | 依存 |
|---|---|---|
| `fe-page-login` | [Page] app/login/page.tsx を更新 | `fe-layout-root` `fe-login-form` |
| `fe-page-register` | [Page] app/register/page.tsx を更新 | `fe-layout-root` `fe-register-form` |
| `fe-page-posts` | [Page] app/posts/page.tsx を作成 | `fe-layout-root` `fe-post-list` `fe-post-hooks` `fe-ui-pagination` `fe-ui-searchbar` |
| `fe-page-detail` | [Page] app/posts/[slug]/page.tsx を作成 | `fe-layout-root` `fe-post-detail-c` `fe-comment-list` `fe-comment-form` `fe-post-hook` |
| `fe-page-new` | [Page] app/posts/new/page.tsx を作成 | `fe-layout-root` `fe-post-form` `fe-post-api` |
| `fe-page-edit` | [Page] app/posts/[slug]/edit/page.tsx を作成 | `fe-layout-root` `fe-post-form` `fe-post-api` `fe-post-hook` |
| `fe-page-category` | [Page] app/categories/[slug]/page.tsx を作成 | `fe-layout-root` `fe-post-list` `fe-cat-api` `fe-post-hooks` |
| `fe-page-tag` | [Page] app/tags/[slug]/page.tsx を作成 | `fe-layout-root` `fe-post-list` `fe-tag-api` `fe-post-hooks` |
| `fe-page-dashboard` | [Page] app/dashboard/page.tsx を作成 | `fe-layout-root` `fe-post-list` `fe-post-api` `fe-post-hooks` `fe-ui-modal` |
| `fe-page-profile` | [Page] app/profile/page.tsx を作成 | `fe-layout-root` `fe-auth-hook` |
| `fe-page-top` | [Page] app/page.tsx(トップ)を更新 | `fe-layout-root` `fe-post-list` `fe-cat-list` `fe-tag-cloud` `fe-post-hooks` |

---

## タスク数サマリ

| フェーズ | タスク数 |
|---|---|
| 1. Migration | 9 |
| 2. Model | 8 |
| 3. Serializer | 5 |
| 4. Controller | 22 |
| 5. Routes | 1 |
| 6. RSpec | 12 |
| 7. FE Types | 5 |
| 8. FE Lib | 2 |
| 9. FE Auth | 5 |
| 10. FE Layout/UI | 9 |
| 11. FE Posts | 8 |
| 12. FE Categories | 3 |
| 13. FE Tags | 3 |
| 14. FE Comments | 5 |
| 15. FE Likes | 2 |
| 16. FE Pages | 11 |
| **合計** | **111** |
