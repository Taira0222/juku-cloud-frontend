# 開発ガイドライン

## 1. コーディング規約

### 1.1 共通原則

#### SOLID原則
- **S**: Single Responsibility Principle (単一責任の原則)
- **O**: Open/Closed Principle (オープン・クローズドの原則)
- **L**: Liskov Substitution Principle (リスコフの置換原則)
- **I**: Interface Segregation Principle (インターフェース分離の原則)
- **D**: Dependency Inversion Principle (依存性逆転の原則)

#### DRY原則
- Don't Repeat Yourself
- 重複を避け、再利用可能なコードを書く

#### KISS原則
- Keep It Simple, Stupid
- シンプルで理解しやすいコードを書く

#### YAGNI原則
- You Aren't Gonna Need It
- 必要になるまで実装しない

### 1.2 TypeScript規約

#### 型定義
```typescript
// ✅ Good: 明確な型定義
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ Bad: any型の使用
const user: any = { ... };

// ✅ Good: unknown型を使用して型安全に
const data: unknown = JSON.parse(response);
if (isUser(data)) {
  // 型ガードで安全に使用
}
```

#### 型ガード
```typescript
// ✅ Good: 型ガードの実装
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}
```

#### Enum vs Union Type
```typescript
// ✅ Good: ユニオン型を優先
type Status = 'pending' | 'approved' | 'rejected';

// ⚠️ 必要な場合のみEnum
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
```

### 1.3 React規約

#### コンポーネント定義
```typescript
// ✅ Good: 関数コンポーネント + TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};
```

#### フック使用
```typescript
// ✅ Good: カスタムフックの作成
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}

// ❌ Bad: 全てをコンポーネント内に記述
```

#### 状態管理
```typescript
// ✅ Good: useReducer で複雑な状態管理
type State = {
  data: User[];
  loading: boolean;
  error: Error | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
  }
}
```

### 1.4 命名規則

#### 変数・関数
```typescript
// ✅ Good: 意味のある名前
const userCount = users.length;
const isAuthenticated = checkAuth();
const handleSubmit = () => { ... };

// ❌ Bad: 略語、意味不明な名前
const n = users.length;
const flag = checkAuth();
const h1 = () => { ... };
```

#### コンポーネント
```typescript
// ✅ Good: PascalCase、名詞
const UserProfile = () => { ... };
const LoginForm = () => { ... };

// ❌ Bad: camelCase、動詞
const userProfile = () => { ... };
const doLogin = () => { ... };
```

#### フック
```typescript
// ✅ Good: use プレフィックス
const useAuth = () => { ... };
const useLocalStorage = () => { ... };

// ❌ Bad: use プレフィックスなし
const auth = () => { ... };
```

#### 定数
```typescript
// ✅ Good: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// ❌ Bad: camelCase
const apiBaseUrl = 'https://api.example.com';
```

### 1.5 ファイル・ディレクトリ構成

#### コンポーネントファイル
```
components/
└── Button/
    ├── Button.tsx           # コンポーネント本体
    ├── Button.test.tsx      # テスト
    ├── Button.stories.tsx   # Storybook
    ├── Button.module.css    # スタイル
    └── index.ts             # エクスポート
```

#### インポート順序
```typescript
// 1. React関連
import React, { useState, useEffect } from 'react';

// 2. 外部ライブラリ
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 3. 内部モジュール (絶対パス)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/models/User';

// 4. 相対パス
import { formatDate } from '../utils/format';
import styles from './Component.module.css';
```

## 2. Git運用

### 2.1 ブランチ戦略

#### ブランチ命名規則
```
feature/[issue-number]-[short-description]   # 新機能
fix/[issue-number]-[short-description]       # バグ修正
hotfix/[issue-number]-[short-description]    # 緊急修正
refactor/[short-description]                 # リファクタリング
docs/[short-description]                     # ドキュメント
test/[short-description]                     # テスト追加
```

例:
```
feature/123-user-authentication
fix/456-login-validation
hotfix/789-critical-security-issue
```

#### ブランチフロー
```
main (本番環境)
 ↑
develop (開発環境)
 ↑
feature/xxx (機能開発)
```

### 2.2 コミットメッセージ

#### Conventional Commits形式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type一覧
- **feat**: 新機能
- **fix**: バグ修正
- **docs**: ドキュメント変更
- **style**: コードの意味に影響しない変更(空白、フォーマットなど)
- **refactor**: リファクタリング
- **perf**: パフォーマンス改善
- **test**: テスト追加・修正
- **chore**: ビルドプロセス、補助ツールの変更

#### 例
```
feat(auth): ユーザー認証機能を追加

- ログイン画面の実装
- JWT トークン管理
- 認証ミドルウェアの追加

Closes #123
```

```
fix(api): ユーザー取得APIのエラーハンドリングを修正

エラー時に適切なステータスコードを返すように修正

Fixes #456
```

### 2.3 プルリクエスト

#### PRタイトル
```
[Type] 簡潔な説明

例:
[Feature] ユーザー認証機能の追加
[Fix] ログインバリデーションの修正
```

#### PR説明テンプレート
```markdown
## 概要
この PR の目的を簡潔に説明

## 変更内容
- 変更点1
- 変更点2

## 関連Issue
Closes #123

## テスト方法
1. ...
2. ...

## スクリーンショット(該当する場合)
![image](url)

## チェックリスト
- [ ] テストを追加・更新した
- [ ] ドキュメントを更新した
- [ ] ESLint/Prettierでフォーマットした
- [ ] ビルドエラーがないことを確認した
```

#### レビュー基準
- コードの可読性
- テストカバレッジ
- パフォーマンスへの影響
- セキュリティ考慮
- ドキュメント更新

## 3. テスト

### 3.1 テスト戦略

#### テストピラミッド
```
      /\
     /E2E\        少
    /------\
   /  統合  \      中
  /----------\
 / ユニット  \    多
/------------\
```

### 3.2 ユニットテスト

#### コンポーネントテスト
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('ラベルが正しく表示される', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('クリック時にonClickが呼ばれる', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled時はクリックできない', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} disabled />);
    const button = screen.getByText('Click');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

#### フックテスト
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';

describe('useUser', () => {
  it('ユーザー情報を取得する', async () => {
    const { result } = renderHook(() => useUser('123'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual({ id: '123', name: 'Test' });
  });
});
```

### 3.3 統合テスト

```typescript
describe('ユーザー登録フロー', () => {
  it('正常に登録できる', async () => {
    render(<App />);

    // 登録ページに移動
    fireEvent.click(screen.getByText('新規登録'));

    // フォーム入力
    fireEvent.change(screen.getByLabelText('ユーザー名'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' }
    });

    // 送信
    fireEvent.click(screen.getByText('登録'));

    // 成功メッセージ確認
    await waitFor(() => {
      expect(screen.getByText('登録が完了しました')).toBeInTheDocument();
    });
  });
});
```

### 3.4 E2Eテスト (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('ログインからダッシュボード表示まで', async ({ page }) => {
  // ログインページにアクセス
  await page.goto('http://localhost:3000/login');

  // ログインフォーム入力
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // ダッシュボードに遷移
  await expect(page).toHaveURL('http://localhost:3000/dashboard');

  // ユーザー名が表示される
  await expect(page.locator('text=Test User')).toBeVisible();
});
```

### 3.5 テストカバレッジ目標
- **ユニットテスト**: 80%以上
- **統合テスト**: 主要フロー全て
- **E2Eテスト**: クリティカルパス全て

## 4. パフォーマンス

### 4.1 フロントエンド最適化

#### コンポーネント最適化
```typescript
// ✅ Good: React.memo で不要な再レンダリングを防ぐ
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* ... */}</div>;
});

// ✅ Good: useMemo で計算結果をキャッシュ
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// ✅ Good: useCallback でコールバックをメモ化
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

#### コード分割
```typescript
// ✅ Good: 動的インポート
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminPanel />
    </Suspense>
  );
}
```

#### 画像最適化
```typescript
// ✅ Good: Next.js Image コンポーネント
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
  loading="lazy"
/>
```

### 4.2 バックエンド最適化

#### データベースクエリ
```typescript
// ❌ Bad: N+1問題
const users = await User.findAll();
for (const user of users) {
  const posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Good: Eager Loading
const users = await User.findAll({
  include: [{ model: Post }]
});
```

#### キャッシュ
```typescript
// ✅ Good: Redis キャッシュ
async function getUser(id: string) {
  const cached = await redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }

  const user = await db.user.findUnique({ where: { id } });
  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);

  return user;
}
```

## 5. セキュリティ

### 5.1 入力バリデーション

```typescript
// ✅ Good: Zodでバリデーション
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  age: z.number().int().positive().max(150)
});

const result = userSchema.safeParse(input);
if (!result.success) {
  throw new ValidationError(result.error);
}
```

### 5.2 認証・認可

```typescript
// ✅ Good: JWTトークン検証
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden' });
  }
}
```

### 5.3 XSS対策

```typescript
// ✅ Good: サニタイゼーション
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
```

## 6. エラーハンドリング

### 6.1 フロントエンド

```typescript
// ✅ Good: Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 6.2 バックエンド

```typescript
// ✅ Good: カスタムエラークラス
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

// エラーハンドリングミドルウェア
function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;

  logger.error(err);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: isProduction ? 'Internal Server Error' : message
  });
}
```

## 7. ドキュメント

### 7.1 コードコメント

```typescript
// ✅ Good: 複雑なロジックに説明
/**
 * ユーザーの年齢から料金を計算する
 *
 * @param age - ユーザーの年齢
 * @returns 料金 (円)
 *
 * 料金体系:
 * - 12歳以下: 500円
 * - 13-64歳: 1000円
 * - 65歳以上: 700円
 */
function calculatePrice(age: number): number {
  if (age <= 12) return 500;
  if (age >= 65) return 700;
  return 1000;
}

// ❌ Bad: 自明なコードに不要なコメント
// ユーザー名を取得
const name = user.name;
```

### 7.2 README更新
- セットアップ手順
- 開発方法
- テスト実行方法
- デプロイ手順

## 8. ツール設定

### 8.1 ESLint設定

```.eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};
```

### 8.2 Prettier設定

```.prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 8.3 Husky + lint-staged

```package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```
