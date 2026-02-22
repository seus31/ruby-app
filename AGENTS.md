# AI Agents 共通ガイド（全AIエージェント対象）

## 📋 プロジェクト概要
- **プロジェクト名**: Ruby on Rails + Next.js フルスタックアプリケーション
- **Frontend**: Next.js 15.1.6 (App Router), React 19, TypeScript, Bootstrap, Axios
- **Backend**: Ruby on Rails 7.1.3 (API Mode), MySQL 8.0, JWT認証
- **Infrastructure**: Docker Compose

---

## 🎯 あなたの役割
あなたはインフラ・フロントエンド・バックエンド・セキュリティに精通したシニアエンジニアです。

---

## 🚨 最重要ルール（全AIエージェント必須遵守）

### 1. 環境汚染の防止（絶対厳守）
**ホストマシンで環境に影響するコマンドを実行しない。**

#### 禁止事項
- ❌ `bundle install`
- ❌ `npm install` / `pnpm install`
- ❌ `go build` / `go get`
- ❌ `cargo build`

#### 正しい実行方法（Docker コンテナ内）
```bash
# Backend（Rails）
docker compose run --rm backend bundle install
docker compose run --rm backend bundle exec rails db:migrate
docker compose run --rm backend bundle exec rspec

# Frontend（Next.js）
docker compose run --rm frontend npm install
docker compose run --rm frontend npm run build
docker compose run --rm frontend npm run lint
```

### 2. タスクの実装フロー（必須）

#### ステップ1: ブランチ作成前の準備
```bash
# mainブランチを最新にする
git checkout main
git pull origin main

# フィーチャーブランチ作成
git checkout -b feature/your-feature-name
```

#### ステップ2: 実装とコミット
```bash
# 実装作業
# ...

# コミット
git add .
git commit -m "feat: 機能の説明"

# プッシュ
git push origin feature/your-feature-name
```

#### ステップ3: PR作成とレビュー
1. GitHub上でPRを作成
2. レビューを依頼
3. レビュー指摘事項は `REVIEW.md` に記載される
4. 修正後は **必ずコミットとpushを行い再レビューを依頼**

### 3. 実装に関する基本方針（必須）
- ✅ **思考は常に英語で行い、その後の出力は全て日本語で行うこと**
- ✅ **パフォーマンス・メンテナンス性・安全性・ユーザービリティ・アルゴリズムなどを考慮した実装や提案を行うこと**
- ✅ **わからない場合には勝手な行動はせずに必ず確認すること**

---

## 🏗️ アーキテクチャ原則

### Feature-Based Module 構成
機能単位でディレクトリを構成し、技術レイヤーごとの分割は避ける。

```
backend/app/
  ├── controllers/api/v1/   # APIエンドポイント
  ├── models/               # ActiveRecordモデル
  ├── serializers/          # JSON出力
  └── services/             # ビジネスロジック層

frontend/src/app/
  ├── features/             # 機能単位（auth, billing など）
  │   ├── auth/
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   └── api.ts
  │   └── dashboard/
  ├── components/           # 共通UIコンポーネント
  └── lib/                  # ユーティリティ・API Client
```

### Type-Safe First
実装の前に必ずスキーマ・型定義を作成する。

#### Rails
```ruby
# Strong Parameters
def user_params
  params.require(:user).permit(:name, :email, :password)
end

# Serializer
class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :created_at
end
```

#### TypeScript
```typescript
// types/user.ts
export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

// Zodでバリデーション
import { z } from 'zod';
export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});
```

### DRY & AHA（Avoid Hasty Abstraction）
- 拙速な共通化を避ける
- 3箇所以上で使われてから抽象化を検討
- ロジックの重複は排除する

---

## 🧠 アルゴリズム & ロジック方針

### 計算効率
- 計算量 O(n²) 以上のアルゴリズムは避ける
- 可能な限り O(n log n) 以下に抑える
- 早期リターン（ガード句）を徹底

### エラーハンドリング
エラーを握りつぶさず、呼び出し側に安全に伝える。

#### Rails
```ruby
class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  private

  def record_not_found
    render json: { error: 'Record not found' }, status: :not_found
  end
end
```

#### Next.js
```typescript
// エラーバウンダリ + try-catch
try {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
} catch (error) {
  console.error(error);
  // ユーザーへのエラー表示
}
```

---

## 🛡️ セキュリティ & 品質保証

### Shift-Left Security
開発初期からセキュリティを組み込む。

#### 環境変数管理
```bash
# ファイル構成
.env.sample              # テンプレート（コミット可）
.env.local.backend       # Rails用（コミット禁止）
.env.local.frontend      # Next.js用（コミット禁止）
```

#### バリデーション
- **Rails**: Strong Parameters + ActiveRecord Validations
- **Next.js**: Zod による入力検証

#### OWASP Top 10 の考慮
- SQL Injection 対策: ActiveRecord の Prepared Statement
- XSS 対策: Rails の自動エスケープ、React の JSX エスケープ
- CSRF 対策: Rails の CSRF トークン

### Test-Driven Development
複雑なロジックを実装する前に、まずテストコードを書く。

```bash
# Backend（RSpec）
docker compose run --rm backend bundle exec rspec

# Frontend（Jest / Testing Library）
docker compose run --rm frontend npm run test
```

---

## 📦 パッケージ管理（コンテナ内で実行）

### Backend（Rails）
```bash
# Gemfile編集後
docker compose run --rm backend bundle install

# 新しいGemを追加
# 1. Gemfile に gem 'xxx' を追記
# 2. docker compose run --rm backend bundle install
```

### Frontend（Next.js）
```bash
# package.json編集後
docker compose run --rm frontend npm install

# 新しいパッケージを追加
docker compose run --rm frontend npm install <package-name>
```

---

## 🚀 開発コマンド

### サービス起動
```bash
# 全サービス起動
docker compose up -d

# 特定サービスのみ起動
docker compose up -d backend
```

### ログ確認
```bash
# リアルタイムログ
docker compose logs -f backend
docker compose logs -f frontend

# 過去のログを表示
docker compose logs --tail=100 backend
```

### データベース操作
```bash
# マイグレーション作成
docker compose run --rm backend bundle exec rails g migration CreateUsers

# マイグレーション実行
docker compose run --rm backend bundle exec rails db:migrate

# ロールバック
docker compose run --rm backend bundle exec rails db:rollback

# シード投入
docker compose run --rm backend bundle exec rails db:seed

# Railsコンソール
docker compose run --rm backend bundle exec rails console
```

---

## 📝 命名規則

### Rails
| 種類 | 命名規則 | 例 |
|------|----------|-----|
| モデル | 単数形・PascalCase | `User`, `BlogPost` |
| テーブル | 複数形・snake_case | `users`, `blog_posts` |
| コントローラ | 複数形・PascalCase | `UsersController` |
| メソッド | snake_case | `find_by_email` |
| 定数 | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS` |

### Next.js/TypeScript
| 種類 | 命名規則 | 例 |
|------|----------|-----|
| コンポーネント | PascalCase | `UserProfile.tsx` |
| 関数 | camelCase | `getUserById` |
| 型 | PascalCase | `User`, `ApiResponse<T>` |
| 定数 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| ファイル（非コンポーネント） | kebab-case | `user-api.ts` |

---

## 🔄 標準ワークフロー

### 新機能追加の例
```bash
# 1. ブランチ作成
git checkout main
git pull origin main
git checkout -b feature/user-profile

# 2. Backend実装
docker compose run --rm backend bundle exec rails g model User name:string email:string
docker compose run --rm backend bundle exec rails db:migrate

# 3. Frontend実装
# 型定義 → コンポーネント → API統合

# 4. テスト実行
docker compose run --rm backend bundle exec rspec
docker compose run --rm frontend npm run lint

# 5. コミット・プッシュ
git add .
git commit -m "feat: ユーザープロフィール機能の実装"
git push origin feature/user-profile

# 6. PR作成（GitHub UI）
# 7. レビュー対応
# 8. マージ
```

---

## ⚠️ 禁止事項（全AIエージェント）
- ❌ ホストでの `bundle install` / `npm install` 実行
- ❌ 直接 main ブランチへのコミット
- ❌ レビュー前のマージ
- ❌ `.env` ファイルのコミット
- ❌ ハードコードされた秘密情報（APIキー、パスワードなど）
- ❌ 未テストのコードのデプロイ
- ❌ 勝手な技術スタック変更

---

## 📊 現在の進捗状況（随時更新）

### 完了したタスク
- [ ] 初期プロジェクトセットアップ
- [ ] Docker環境構築
- [ ] データベース設計

### 進行中のタスク
- [ ] （記載してください）

### 次に着手すべきタスク
- [ ] （記載してください）

### 技術的負債
- [ ] （記載してください）

---

## 🆘 トラブルシューティング

### コンテナが起動しない
```bash
# すべてのコンテナとボリュームを削除して再構築
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### データベース接続エラー
```bash
# DBコンテナの状態確認
docker compose ps db

# DBを再作成
docker compose run --rm backend bundle exec rails db:drop
docker compose run --rm backend bundle exec rails db:create
docker compose run --rm backend bundle exec rails db:migrate
```

### フロントエンドがビルドできない
```bash
# node_modulesを削除して再インストール
docker compose run --rm frontend rm -rf node_modules
docker compose run --rm frontend npm install
```

---

## 📚 参考リソース
- [AI_MASTER_SPEC.md](./AI_MASTER_SPEC.md) - マスター仕様書（Source of Truth）
- [Ruby on Rails Guides](https://guides.rubyonrails.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**このドキュメントは AI_MASTER_SPEC.md をソースオブトゥルースとして生成されています。**
**プロジェクトの進行に応じて「現在の進捗状況」セクションを更新してください。**
