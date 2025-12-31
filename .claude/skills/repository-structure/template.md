# リポジトリ構造定義書

## 1. リポジトリ概要

### 1.1 モノレポ vs マルチレポ
- **選定**: モノレポ / マルチレポ
- **理由**: [選定理由]
- **ツール**: Turborepo / Nx / Lerna (モノレポの場合)

### 1.2 ルートディレクトリ構成

```
project-root/
├── .github/                 # GitHub設定
│   ├── workflows/          # GitHub Actions
│   ├── ISSUE_TEMPLATE/     # Issue テンプレート
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/                # VSCode設定
│   ├── extensions.json     # 推奨拡張機能
│   ├── settings.json       # エディタ設定
│   └── launch.json         # デバッグ設定
├── docs/                   # ドキュメント
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md
│   ├── development-guidelines.md
│   └── glossary.md
├── src/                    # ソースコード
├── tests/                  # テストコード
├── scripts/                # スクリプト
├── public/                 # 静的ファイル
├── .env.example            # 環境変数サンプル
├── .gitignore              # Git除外設定
├── .eslintrc.js            # ESLint設定
├── .prettierrc             # Prettier設定
├── tsconfig.json           # TypeScript設定
├── package.json            # パッケージ定義
├── README.md               # プロジェクト説明
└── LICENSE                 # ライセンス
```

## 2. フロントエンド構造

### 2.1 ディレクトリ構成

```
src/
├── app/                    # Next.js App Router (使用する場合)
│   ├── (auth)/            # ルートグループ
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   └── dashboard/
│   ├── api/               # API Routes
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # トップページ
├── components/             # コンポーネント
│   ├── ui/                # 基本UIコンポーネント (Atomic)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── Modal/
│   ├── features/          # 機能別コンポーネント (Molecules/Organisms)
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   └── RegisterForm/
│   │   └── user/
│   │       ├── UserProfile/
│   │       └── UserList/
│   └── layouts/           # レイアウトコンポーネント (Templates)
│       ├── MainLayout/
│       └── AuthLayout/
├── hooks/                 # カスタムフック
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── lib/                   # ライブラリ初期化・設定
│   ├── axios.ts
│   ├── queryClient.ts
│   └── supabase.ts
├── store/                 # 状態管理
│   ├── slices/            # Redux スライス
│   │   ├── authSlice.ts
│   │   └── userSlice.ts
│   └── index.ts
├── api/                   # APIクライアント
│   ├── client.ts          # API クライアント設定
│   ├── endpoints/         # エンドポイント定義
│   │   ├── auth.ts
│   │   └── users.ts
│   └── types/             # APIレスポンス型
├── types/                 # 型定義
│   ├── models/            # ドメインモデル型
│   │   ├── User.ts
│   │   └── Post.ts
│   ├── api.ts             # API型
│   └── global.d.ts        # グローバル型拡張
├── utils/                 # ユーティリティ関数
│   ├── format.ts
│   ├── validation.ts
│   └── helpers.ts
├── constants/             # 定数
│   ├── routes.ts
│   ├── config.ts
│   └── errorMessages.ts
├── styles/                # スタイル
│   ├── globals.css
│   ├── variables.css
│   └── theme.ts
├── assets/                # アセット
│   ├── images/
│   ├── icons/
│   └── fonts/
└── __tests__/             # テスト (統合テスト)
    ├── integration/
    └── e2e/
```

### 2.2 ファイル命名規則

#### コンポーネント
- **PascalCase**: `Button.tsx`, `UserProfile.tsx`
- **ディレクトリ単位**: 各コンポーネントは専用ディレクトリに配置
- **index.ts**: エクスポート用

#### フック
- **camelCase**: `useAuth.ts`, `useLocalStorage.ts`
- **プレフィックス**: `use` で始める

#### ユーティリティ
- **camelCase**: `formatDate.ts`, `validateEmail.ts`
- **機能別グループ化**: 関連する関数をまとめる

#### 型定義
- **PascalCase**: `User.ts`, `ApiResponse.ts`
- **接尾辞**: `Type`, `Interface` は不要

### 2.3 インポート順序

```typescript
// 1. 外部ライブラリ
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. 内部の絶対インポート (@/ エイリアス)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/models/User';

// 3. 相対インポート
import { formatDate } from '../utils/format';
import styles from './Component.module.css';
```

## 3. バックエンド構造

### 3.1 ディレクトリ構成

```
src/
├── controllers/           # コントローラー
│   ├── auth.controller.ts
│   └── users.controller.ts
├── services/              # ビジネスロジック
│   ├── auth.service.ts
│   └── users.service.ts
├── repositories/          # データアクセス層
│   ├── user.repository.ts
│   └── post.repository.ts
├── models/                # ドメインモデル
│   ├── User.ts
│   └── Post.ts
├── dto/                   # Data Transfer Objects
│   ├── requests/
│   │   ├── CreateUserDto.ts
│   │   └── UpdateUserDto.ts
│   └── responses/
│       └── UserResponseDto.ts
├── middlewares/           # ミドルウェア
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
├── validators/            # バリデーション
│   ├── schemas/
│   │   └── user.schema.ts
│   └── index.ts
├── routes/                # ルート定義
│   ├── auth.routes.ts
│   ├── users.routes.ts
│   └── index.ts
├── database/              # データベース関連
│   ├── migrations/        # マイグレーション
│   ├── seeds/             # シードデータ
│   ├── schema.prisma      # Prisma スキーマ
│   └── client.ts          # DB クライアント
├── config/                # 設定
│   ├── database.ts
│   ├── auth.ts
│   └── app.ts
├── types/                 # 型定義
│   ├── express.d.ts       # Express型拡張
│   └── index.ts
├── utils/                 # ユーティリティ
│   ├── logger.ts
│   ├── errors.ts
│   └── helpers.ts
├── constants/             # 定数
│   └── index.ts
├── __tests__/             # テスト
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── app.ts                 # アプリケーション初期化
└── server.ts              # サーバー起動
```

### 3.2 ファイル命名規則

#### コントローラー
- **camelCase + 接尾辞**: `auth.controller.ts`
- **複数形**: リソースは複数形 (`users.controller.ts`)

#### サービス
- **camelCase + 接尾辞**: `auth.service.ts`

#### モデル
- **PascalCase**: `User.ts`, `Post.ts`
- **単数形**: モデル名は単数形

## 4. テスト構造

### 4.1 テストファイル配置

```
__tests__/
├── unit/                  # ユニットテスト
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/           # 統合テスト
│   ├── api/
│   └── features/
├── e2e/                   # E2Eテスト
│   └── scenarios/
├── fixtures/              # テストデータ
│   └── mockData.ts
└── setup/                 # テスト設定
    └── setupTests.ts
```

### 4.2 テストファイル命名
- **ユニットテスト**: `Component.test.tsx`, `util.test.ts`
- **統合テスト**: `auth.integration.test.ts`
- **E2Eテスト**: `login.e2e.test.ts`

## 5. 設定ファイル

### 5.1 環境変数管理

```
# 開発環境
.env.development
.env.development.local

# テスト環境
.env.test
.env.test.local

# 本番環境
.env.production
.env.production.local

# サンプル
.env.example
```

### 5.2 TypeScript設定

```
tsconfig.json              # ベース設定
tsconfig.app.json          # アプリ用設定
tsconfig.node.json         # Node用設定
tsconfig.test.json         # テスト用設定
```

## 6. ドキュメント構造

```
docs/
├── product-requirements.md      # PRD
├── functional-design.md         # 機能設計書
├── architecture.md              # アーキテクチャ
├── repository-structure.md      # リポジトリ構造
├── development-guidelines.md    # 開発ガイドライン
├── glossary.md                  # 用語集
├── api/                         # API仕様書
│   └── openapi.yaml
├── guides/                      # ガイド
│   ├── setup.md                # セットアップ手順
│   ├── deployment.md           # デプロイ手順
│   └── troubleshooting.md      # トラブルシューティング
└── decisions/                   # ADR (Architecture Decision Records)
    ├── 001-use-react.md
    └── 002-use-postgresql.md
```

## 7. スクリプト

```
scripts/
├── setup.sh               # 初期セットアップ
├── build.sh              # ビルド
├── deploy.sh             # デプロイ
├── db/                   # DB関連スクリプト
│   ├── migrate.sh
│   └── seed.sh
└── utils/                # ユーティリティスクリプト
    └── generate-types.sh
```

## 8. パスエイリアス

### 8.1 TypeScript設定 (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/api/*": ["src/api/*"],
      "@/store/*": ["src/store/*"]
    }
  }
}
```

### 8.2 使用例

```typescript
// ❌ 相対パス (深いネストで複雑)
import { Button } from '../../../components/ui/Button';

// ✅ エイリアス (明確で保守しやすい)
import { Button } from '@/components/ui/Button';
```

## 9. モノレポ構成 (該当する場合)

```
packages/
├── frontend/              # フロントエンドアプリ
│   ├── src/
│   └── package.json
├── backend/               # バックエンドアプリ
│   ├── src/
│   └── package.json
├── shared/                # 共有コード
│   ├── types/            # 共有型定義
│   ├── utils/            # 共有ユーティリティ
│   └── package.json
├── ui-components/         # 共有UIコンポーネント
│   ├── src/
│   └── package.json
└── config/                # 共有設定
    ├── eslint-config/
    ├── tsconfig/
    └── prettier-config/
```

## 10. 命名規則まとめ

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `UserProfile.tsx` |
| フック | camelCase + use | `useAuth.ts` |
| ユーティリティ | camelCase | `formatDate.ts` |
| 型 | PascalCase | `User.ts` |
| 定数 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| ディレクトリ | kebab-case or camelCase | `ui-components/` |
| CSS Module | kebab-case | `user-profile.module.css` |
