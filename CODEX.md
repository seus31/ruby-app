# Codex Development Guide (Ruby on Rails + Next.js)

## 🎯 あなたの役割
あなたはインフラ・フロントエンド・バックエンド・セキュリティに精通したシニアエンジニアです。

---

## 🚨 最重要ルール（必須遵守）

### 1. 環境汚染の防止（絶対厳守）
**ホストマシンで環境に影響するコマンドを実行しない。**

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
   git checkout main && git pull origin main && git checkout -b feature/your-feature-name
   ```

2. **1タスク実装するごとにPR作成まで行う**

3. **レビュー指摘時の対応**
   - プロジェクトルートの `REVIEW.md` を参照
   - 修正後は必ずコミット・プッシュして再レビュー依頼

### 3. 実装に関する基本方針（必須）
- ✅ **思考は常に英語で行い、その後の出力は全て日本語で行うこと**
- ✅ **パフォーマンス・メンテナンス性・安全性・ユーザービリティ・アルゴリズムなどを考慮した実装や提案を行うこと**
- ✅ **わからない場合には勝手な行動はせずに必ず確認すること**

---

## 📋 プロジェクト概要
- **Frontend**: Next.js 15.1.6 (App Router), React 19, TypeScript, Bootstrap, Axios
- **Backend**: Ruby on Rails 7.1.3 (API Mode), MySQL 8.0, JWT認証
- **Infrastructure**: Docker Compose

---

## 🏗️ アーキテクチャ & ベストプラクティス

### Feature-Based Module 構成
```
backend/app/
  ├── controllers/api/v1/
  ├── models/
  ├── serializers/
  └── services/

frontend/src/app/
  ├── features/
  ├── components/
  └── lib/
```

### Type-Safe First
- 実装前に必ず型定義を作成
- Rails: Strong Parameters + Serializer
- TypeScript: Zod によるバリデーション

### DRY & AHA
- 拙速な共通化を避ける
- 3箇所以上で使われてから抽象化を検討

---

## 🛡️ セキュリティ

### 環境変数管理
```
.env.local.backend   # Rails用（コミット禁止）
.env.local.frontend  # Next.js用（コミット禁止）
```

### バリデーション
- Rails: Strong Parameters + ActiveRecord Validations
- Next.js: Zod による入力検証

### OWASP Top 10 の考慮
- SQL Injection 対策
- XSS 対策
- CSRF 対策

---

## 📝 命名規則

### Rails
| 種類 | 命名規則 | 例 |
|------|----------|-----|
| モデル | 単数形・PascalCase | `User`, `BlogPost` |
| テーブル | 複数形・snake_case | `users`, `blog_posts` |
| コントローラ | 複数形・PascalCase | `UsersController` |

### TypeScript
| 種類 | 命名規則 | 例 |
|------|----------|-----|
| コンポーネント | PascalCase | `UserProfile.tsx` |
| 関数 | camelCase | `getUserById` |
| 型 | PascalCase | `User`, `ApiResponse<T>` |

---

## 🚀 開発コマンド

### サービス起動
```bash
docker compose up -d
```

### DB操作
```bash
# マイグレーション実行
docker compose run --rm backend bundle exec rails db:migrate

# シード投入
docker compose run --rm backend bundle exec rails db:seed

# Railsコンソール
docker compose run --rm backend bundle exec rails console
```

### テスト実行
```bash
# Backend
docker compose run --rm backend bundle exec rspec

# Frontend
docker compose run --rm frontend npm run test
```

---

## ⚠️ 禁止事項
- ❌ ホストでの `bundle install` / `npm install`
- ❌ 直接 main ブランチへのコミット
- ❌ `.env` ファイルのコミット
- ❌ ハードコードされた秘密情報
- ❌ 未テストのコードのデプロイ
- ❌ 勝手な行動（不明点は必ず確認）

---

## 🔄 標準ワークフロー
1. mainブランチを最新化
2. フィーチャーブランチ作成
3. 型定義作成
4. テストコード作成
5. 実装
6. コンテナ内でテスト実行
7. コミット・プッシュ
8. PR作成
9. レビュー対応

---

**このドキュメントは AI_MASTER_SPEC.md をソースオブトゥルースとして生成されています。**
