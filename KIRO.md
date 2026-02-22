# Kiro Development Guide (Ruby on Rails + Next.js)

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

## 🏗️ アーキテクチャ & ベストプラクティス

### Feature-Based Module 構成
技術レイヤーではなく、機能単位でディレクトリを構成する。

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

---

## 🛡️ セキュリティ & 品質保証

### Shift-Left Security
開発初期からセキュリティを組み込む。

#### 環境変数管理
```
.env.local.backend   # Rails用（コミット禁止）
.env.local.frontend  # Next.js用（コミット禁止）
```

#### バリデーション
- Rails: Strong Parameters + ActiveRecord Validations
- Next.js: Zod による入力検証

#### OWASP Top 10 の考慮
- SQL Injection 対策
- XSS 対策
- CSRF 対策

### Test-Driven Development
複雑なロジックを実装する前に、まずテストコードを書く。

---

## 📝 命名規則

### Rails
| 種類 | 命名規則 | 例 |
|------|----------|-----|
| モデル | 単数形・PascalCase | `User`, `BlogPost` |
| テーブル | 複数形・snake_case | `users`, `blog_posts` |
| コントローラ | 複数形・PascalCase | `UsersController` |
| メソッド | snake_case | `find_by_email` |

### Next.js/TypeScript
| 種類 | 命名規則 | 例 |
|------|----------|-----|
| コンポーネント | PascalCase | `UserProfile.tsx` |
| 関数 | camelCase | `getUserById` |
| 型 | PascalCase | `User`, `ApiResponse<T>` |
| 定数 | UPPER_SNAKE_CASE | `API_BASE_URL` |

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

### データベース操作
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
# Backend（RSpec）
docker compose run --rm backend bundle exec rspec

# Frontend
docker compose run --rm frontend npm run test
```

---

## ⚠️ 禁止事項
- ❌ ホストでの `bundle install` / `npm install` 実行
- ❌ 直接 main ブランチへのコミット
- ❌ レビュー前のマージ
- ❌ `.env` ファイルのコミット
- ❌ ハードコードされた秘密情報
- ❌ 未テストのコードのデプロイ
- ❌ 勝手な行動（不明点は必ず確認）

---

## 🔄 標準ワークフロー

### 新機能追加の例
1. ブランチ作成（mainから最新を取得）
2. Backend実装（マイグレーション → モデル → コントローラ → テスト）
3. Frontend実装（型定義 → コンポーネント → API統合 → テスト）
4. コンテナ内でテスト実行
5. コミット・プッシュ
6. PR作成
7. レビュー対応
8. マージ

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
docker compose ps db
docker compose run --rm backend bundle exec rails db:create
docker compose run --rm backend bundle exec rails db:migrate
```

---

**このドキュメントは AI_MASTER_SPEC.md をソースオブトゥルースとして生成されています。**
