# Copilot Development Guide (Ruby on Rails + Next.js)

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
- ✅ **思考は常に英語で行い、その後の出力は全て日本語で行うこと**
- ✅ **パフォーマンス・メンテナンス性・安全性・ユーザービリティ・アルゴリズムなどを考慮した実装や提案を行うこと**
- ✅ **わからない場合には勝手な行動はせずに必ず確認すること**

---

## 📋 プロジェクト概要
- **Frontend**: Next.js 15.1.6 (App Router), React 19, TypeScript, Bootstrap, Axios
- **Backend**: Ruby on Rails 7.1.3 (API Mode), MySQL 8.0, JWT認証
- **Infrastructure**: Docker Compose

---

## 🏗️ アーキテクチャ

### ディレクトリ構成
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

### 開発フロー
1. 型定義を先に作成
2. テストコードを書く
3. 実装する
4. コンテナ内でテスト実行
5. PR作成

---

## 🛡️ セキュリティ
- 環境変数は `.env.local.backend` と `.env.local.frontend` で管理
- Strong Parameters（Rails）と Zod（Next.js）でバリデーション
- JWT認証を使用

---

## 📝 命名規則
### Rails
- モデル: `User` (PascalCase・単数形)
- テーブル: `users` (snake_case・複数形)
- コントローラ: `UsersController` (PascalCase・複数形)

### TypeScript
- コンポーネント: `UserProfile.tsx` (PascalCase)
- 関数: `getUserById` (camelCase)
- 型: `User`, `ApiResponse<T>` (PascalCase)

---

## 🚀 よく使うコマンド

### サービス起動
```bash
docker compose up -d
```

### DB操作
```bash
docker compose run --rm backend bundle exec rails db:migrate
docker compose run --rm backend bundle exec rails db:seed
```

### テスト実行
```bash
docker compose run --rm backend bundle exec rspec
docker compose run --rm frontend npm run test
```

---

## ⚠️ 禁止事項
- ❌ ホストでの `bundle install` / `npm install`
- ❌ 直接 main ブランチへのコミット
- ❌ `.env` ファイルのコミット
- ❌ 勝手な行動（不明点は必ず確認）

---

**このドキュメントは AI_MASTER_SPEC.md をソースオブトゥルースとして生成されています。**
