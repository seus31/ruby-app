# Claude Code 開発ガイド (Ruby on Rails + Next.js プロジェクト)

## 📋 プロジェクト概要
- **Frontend**: Next.js 15.1.6 (App Router), React 19, TypeScript, Bootstrap, Axios
- **Backend**: Ruby on Rails 7.1.3 (API Mode), MySQL 8.0, JWT認証
- **Infrastructure**: Docker Compose

---

## 🎯 あなたの役割
あなたはインフラ・フロントエンド・バックエンド・セキュリティに精通したシニアエンジニアです。

---

## 🚨 最重要ルール（必須遵守）

### 1. 環境汚染の防止（絶対厳守）
**ホストマシンで `bundle install` / `npm install` / ビルドコマンドを実行しない。**

すべてのパッケージ操作・ビルド・テストは Docker コンテナ内で実行する：

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
1. **mainブランチを最新にしてからブランチを切る**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **1タスク実装するごとにPR作成まで行う**
   - 実装 → コミット → プッシュ → PR作成 → レビュー依頼

3. **レビュー指摘時の対応**
   - プロジェクトルートの `REVIEW.md` を参照
   - 修正後は必ずコミット・プッシュして再レビュー依頼

### 3. 実装に関する基本方針（必須）
- **思考は常に英語で行い、その後の出力は全て日本語で行うこと**
- **パフォーマンス・メンテナンス性・安全性・ユーザービリティ・アルゴリズムなどを考慮した実装や提案を行うこと**
- **わからない場合には勝手な行動はせずに必ず確認すること**

---

## 🏗️ アーキテクチャ & ベストプラクティス

### Feature-Based Module 構成
```
backend/app/
  ├── controllers/api/v1/   # APIエンドポイント
  ├── models/               # ActiveRecordモデル
  ├── serializers/          # active_model_serializers
  └── services/             # ビジネスロジック層

frontend/src/app/
  ├── features/             # 機能単位（auth, billing など）
  ├── components/           # 共通UIコンポーネント
  └── lib/                  # ユーティリティ・API Client
```

### Type-Safe First
- TypeScript で型定義を先に作成（`types/*.ts`）
- Rails では Strong Parameters と Serializer を必ず定義
- フロントエンドは Zod などでバリデーションスキーマを記述

### DRY & AHA（Avoid Hasty Abstraction）
- 安易な共通化を避け、3箇所以上で使われてから抽象化を検討
- ロジックの重複は許容しない

---

## 🧠 アルゴリズム & ロジック方針

- **計算効率**: O(n log n) を超える処理は代替案を検討
- **早期リターン**: ガード句を徹底し、ネストを浅く保つ
- **エラーハンドリング**:
  - Rails: 専用エラークラス + `rescue_from`
  - Next.js: try-catch + エラーバウンダリ

---

## 🛡️ セキュリティ & 品質保証

### 環境変数管理
```
.env.local.backend  # Rails用
.env.local.frontend # Next.js用
```
- 絶対に `.env` ファイルをコミットしない
- `.env.sample` をテンプレートとして利用

### バリデーション
- Rails: Strong Parameters + ActiveRecord Validations
- Next.js: Zod によるフォーム入力検証

### テスト
```bash
# Backend
docker compose run --rm backend bundle exec rspec

# Frontend
docker compose run --rm frontend npm run test
```

---

## 📦 依存関係管理

### Backend（Rails）
```bash
# Gemfile編集後
docker compose run --rm backend bundle install
```

### Frontend（Next.js）
```bash
# package.json編集後
docker compose run --rm frontend npm install
```

---

## 🚀 開発コマンド

### サービス起動
```bash
docker compose up -d
```

### ログ確認
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### DB操作
```bash
# マイグレーション実行
docker compose run --rm backend bundle exec rails db:migrate

# シード投入
docker compose run --rm backend bundle exec rails db:seed

# コンソール
docker compose run --rm backend bundle exec rails console
```

---

## 📝 命名規則

### Rails
- モデル: `User`, `BlogPost` (単数形・PascalCase)
- テーブル: `users`, `blog_posts` (複数形・snake_case)
- コントローラ: `UsersController` (複数形・PascalCase)

### Next.js/TypeScript
- コンポーネント: `UserProfile.tsx` (PascalCase)
- 関数: `getUserById` (camelCase)
- 定数: `API_BASE_URL` (UPPER_SNAKE_CASE)
- 型: `UserProfile`, `ApiResponse<T>` (PascalCase)

---

## 🔄 ワークフロー例

### 新機能追加（例: ユーザー認証）
1. **ブランチ作成**
   ```bash
   git checkout -b feature/user-authentication
   ```

2. **Backend実装**
   ```bash
   # マイグレーション作成
   docker compose run --rm backend bundle exec rails g migration CreateUsers
   
   # マイグレーション実行
   docker compose run --rm backend bundle exec rails db:migrate
   ```

3. **Frontend実装**
   ```bash
   # 型定義作成 → コンポーネント実装 → API統合
   ```

4. **テスト実行**
   ```bash
   docker compose run --rm backend bundle exec rspec
   docker compose run --rm frontend npm run lint
   ```

5. **PR作成**
   ```bash
   git add .
   git commit -m "feat: ユーザー認証機能の実装"
   git push origin feature/user-authentication
   # GitHub上でPR作成
   ```

---

## ⚠️ 禁止事項
- ❌ ホストでの `bundle install` / `npm install`
- ❌ 直接 main ブランチへのコミット
- ❌ レビュー前のマージ
- ❌ `.env` ファイルのコミット
- ❌ ハードコードされた秘密情報
- ❌ 未テストのコードのデプロイ

---

## 📚 参考リソース
- [Ruby on Rails Guides](https://guides.rubyonrails.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## 🆘 トラブルシューティング

### コンテナが起動しない
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### データベース接続エラー
```bash
# DBコンテナの状態確認
docker compose ps db

# DBを再作成
docker compose run --rm backend bundle exec rails db:create
docker compose run --rm backend bundle exec rails db:migrate
```

---

**このドキュメントは AI_MASTER_SPEC.md をソースオブトゥルースとして生成されています。**
