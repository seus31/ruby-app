# Ruby on Rails + Next.js フルスタックアプリケーション

## 📋 プロジェクト概要
- **Frontend**: Next.js 15.1.6 (App Router), React 19, TypeScript, Bootstrap, Axios
- **Backend**: Ruby on Rails 7.1.3 (API Mode), MySQL 8.0, JWT認証
- **Infrastructure**: Docker Compose

---

## 🚀 クイックスタート

### 環境構築
```bash
# リポジトリクローン
git clone <repository-url>
cd ruby-app

# 環境変数設定
cp .env.sample .env
cp .env.backend.sample .env.local.backend
cp .env.frontend.sample .env.local.frontend
# 各ファイルを編集して環境変数を設定

# コンテナビルド & 起動
docker compose build
docker compose up -d

# データベースセットアップ
docker compose run --rm backend bundle exec rails db:create
docker compose run --rm backend bundle exec rails db:migrate
docker compose run --rm backend bundle exec rails db:seed
```

### アクセス
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

## 📂 プロジェクト構造

```
ruby-app/
├── backend/              # Ruby on Rails API
│   ├── app/
│   │   ├── controllers/api/v1/
│   │   ├── models/
│   │   ├── serializers/
│   │   └── services/
│   ├── config/
│   ├── db/
│   └── spec/
├── frontend/             # Next.js Application
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── lib/
│       └── types/
├── docker/               # Dockerfiles
├── .cursor/rules/        # Cursor用ルール
├── AGENTS.md            # 全AIエージェント共通ガイド
├── CLAUDE.md            # Claude Code用ガイド
├── CODEX.md             # Codex用ガイド
├── GEMINI.md            # Gemini用ガイド
├── KIRO.md              # Kiro用ガイド
├── .clinerules          # Roo Code用ルール
└── docker-compose.yml
```

---

## 🛠️ 開発コマンド

### Backend（Rails）
```bash
# Gemインストール
docker compose run --rm backend bundle install

# マイグレーション
docker compose run --rm backend bundle exec rails db:migrate

# Railsコンソール
docker compose run --rm backend bundle exec rails console

# テスト実行
docker compose run --rm backend bundle exec rspec
```

### Frontend（Next.js）
```bash
# パッケージインストール
docker compose run --rm frontend npm install

# ビルド
docker compose run --rm frontend npm run build

# Lint
docker compose run --rm frontend npm run lint

# テスト
docker compose run --rm frontend npm run test
```

---

## 🚨 重要な開発ルール

### 環境汚染の防止（必須）
**ホストマシンで `bundle install` / `npm install` を実行しない**

すべてのコマンドは Docker コンテナ内で実行してください。

### 開発フロー
1. mainブランチを最新にする
2. フィーチャーブランチを作成
3. 実装・テスト
4. コミット・プッシュ
5. PR作成
6. レビュー対応

---

## 📚 AIエージェント用ドキュメント

各AIエージェントは対応するドキュメントを参照してください：

| AIツール | ドキュメント |
|----------|-------------|
| All Agents | [AGENTS.md](./AGENTS.md) |
| Claude Code | [CLAUDE.md](./CLAUDE.md) |
| GitHub Copilot | [.github/copilot-instructions.md](./.github/copilot-instructions.md) |
| Codex | [CODEX.md](./CODEX.md) |
| Gemini | [GEMINI.md](./GEMINI.md) |
| Kiro | [KIRO.md](./KIRO.md) |
| Roo Code | [.clinerules](./.clinerules) |
| Cursor | [.cursor/rules/](./.cursor/rules/) |

マスター仕様書: [AI_MASTER_SPEC.md](./AI_MASTER_SPEC.md)

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
docker compose run --rm backend bundle exec rails db:drop
docker compose run --rm backend bundle exec rails db:create
docker compose run --rm backend bundle exec rails db:migrate
```

---

## 📄 ライセンス
[ライセンス情報を記載]
