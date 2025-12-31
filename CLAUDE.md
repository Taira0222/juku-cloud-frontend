# Claude開発ガイド - Juku Cloud Frontend

本ドキュメントは、Claudeを活用してJuku Cloud Frontendを開発する際のガイドラインです。

## プロジェクト概要

Juku Cloud Frontendは、塾管理業務のデジタル化を実現するフロントエンドアプリケーションです。教師が生徒一人ひとりに最適な教育を提供できるよう、授業記録、生徒情報、成績管理などを一元管理します。

## 重要なドキュメント

開発を始める前に、以下のドキュメントを必ず確認してください。

- [README.md](README.md) - 技術スタック、ディレクトリ構成、セットアップ方法
- [docs/product-requirements.md](docs/product-requirements.md) - プロダクト要求定義書(PRD)
- [docs/functional-design.md](docs/functional-design.md) - 機能設計書(SDD)

## SDD(Software Design Document)の開発について

### SDDとは

本プロジェクトでは、[docs/functional-design.md](docs/functional-design.md)がSoftware Design Document(ソフトウェア設計書)に相当します。このドキュメントには以下の情報が含まれています。

- 機能一覧と優先度
- 各機能の詳細設計(ユーザーストーリー、受入基準、画面設計、ワークフロー、API仕様)
- データモデル定義
- 画面遷移図
- バリデーションルール

### SDDと実装の関係

**重要**: SDDは要求仕様と概念モデルを示すものであり、実装時には技術的制約やアーキテクチャ上の判断により変更される場合があります。

#### データモデル
- **SDD**: 概念的なデータモデル（例: `lessonDate`, `subject`, `content`, `progress`, `homework`）
- **実装**: 実際のAPI仕様に基づくモデル（例: `expire_date`, `note_type`, `description`）
- **原則**: 実装時は実際のコードとAPI仕様を優先してください

#### API設計
- **SDD**: RESTfulな理想形（例: `POST /students/:studentId/traits`）
- **実装**: バックエンドの実装に合わせた形（例: `POST /student_traits` with `student_id` in request body）
- **原則**: 実装パターンセクションで実際のAPI設計を確認してください

#### 用語
- **SDD**: 「授業記録」などビジネス用語
- **実装**: 実際のコードで使用される用語（コメントやメッセージで確認）
- **原則**: コード内では実装で使用されている用語を統一して使用してください

### SDDに基づいた開発フロー

1. **機能の理解**
   - [docs/functional-design.md](docs/functional-design.md)で対象機能のセクションを確認
   - ユーザーストーリーと受入基準を理解
   - 画面設計とワークフローを確認

2. **既存コードの確認**
   - 類似機能の実装パターンを確認(例: `src/features/lessonNotes/`を参考)
   - データモデルがSDDの定義と一致しているか確認

3. **実装**
   - SDDで定義されたバリデーションルールに従う
   - API仕様に従ってエンドポイントを実装
   - エラーメッセージはSDDで定義されたものを使用

4. **テスト**
   - 受入基準を満たすことを確認
   - MSWでAPIモックを作成し、ユニット/結合テストを実装
   - カバレッジ80%以上を維持

### 機能別SDDリファレンス

各機能のSDD詳細は以下のセクションを参照してください。

- **F-001: ユーザー認証** - [docs/functional-design.md](docs/functional-design.md#f-001-ユーザー認証)
- **F-002: 授業記録管理** - [docs/functional-design.md](docs/functional-design.md#f-002-授業記録管理lessonnote)
- **F-004: 生徒特性管理** - [docs/functional-design.md](docs/functional-design.md#f-004-生徒特性管理studenttrait)
- **F-006: 成績管理** - [docs/functional-design.md](docs/functional-design.md#f-006-成績管理)
- **F-007: ダッシュボード** - [docs/functional-design.md](docs/functional-design.md#f-007-ダッシュボード)

### SDDで定義されている重要な設計原則

#### バリデーション
- フロントエンド・バックエンドの二重防御を実装
- Zodスキーマを使用してバリデーションルールを定義
- エラーメッセージはSDDで定義されたものを使用

#### 画面設計
- レスポンシブデザイン(PC・タブレット・スマートフォン対応)
- shadcn/uiコンポーネントを活用
- ローディング状態とエラー状態を適切に表示

#### API連携
- TanStack Query(React Query)でサーバ状態を管理
- Axiosクライアントで統一的なエラーハンドリング
- MSWでAPIモックを作成してテスト

#### 状態管理
- サーバ状態: TanStack Query
- UI状態: Zustand
- フォーム状態: React Hook Form

## 開発時のチェックリスト

新しい機能を実装する際は、以下を確認してください。

### 必須項目

- [ ] SDDで定義されたユーザーストーリーと受入基準を満たしているか
- [ ] SDDで定義されたバリデーションルールを実装しているか（実装は実際のAPI仕様に基づく）
- [ ] 実際のAPI仕様に従っているか（SDDは概念モデルとして参照）
- [ ] 既存の実装パターン（例: `lessonNotes`, `studentTraits`）に従っているか
- [ ] エラーハンドリングを [src/lib/errors/getErrorMessage.ts](src/lib/errors/getErrorMessage.ts) で統一しているか
- [ ] テストカバレッジが80%以上か

### 推奨項目

- [ ] 画面設計がSDDのワイヤーフレームの意図に沿っているか（細部は実装時に調整可）
- [ ] SDDで定義されたエラーメッセージを参考にしているか（実装では適切に調整）
- [ ] レスポンシブデザインが適切に実装されているか（PC・タブレット・スマートフォン）
- [ ] ローディング状態とエラー状態が適切に表示されるか

## 実装パターンの参考例

### 機能開発の標準構成

`src/features/lessonNotes/`を参考にしてください。

```
src/features/<feature>/
├── api/          # API client functions
├── components/   # Feature-specific components
├── hooks/        # Custom hooks
├── mutations/    # TanStack Query mutations
├── queries/      # TanStack Query queries
├── types/        # TypeScript types and Zod schemas
└── test/         # Tests with MSW mocks
```

### 典型的な実装フロー

1. **型定義** (`types/`)
   - SDDのデータモデルからTypeScript型を定義
   - Zodスキーマでバリデーションルールを定義

2. **API関数** (`api/`)
   - SDDのAPI仕様に従ってAxiosクライアントで実装

3. **Queries/Mutations** (`queries/`, `mutations/`)
   - TanStack Queryでサーバ状態管理を実装

4. **Components** (`components/`)
   - SDDの画面設計に従ってUIコンポーネントを実装

5. **Tests** (`test/`)
   - MSWでAPIモックを作成
   - 受入基準を満たすことをテスト

### MSWでのテスト実装

#### MSWハンドラーの定義

APIモックは [src/tests/fixtures/server/handlers.ts](src/tests/fixtures/server/handlers.ts) で定義します。

```typescript
// handlers.tsでのモック定義例
export const handlers = [
  http.post('/api/lesson_notes', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      id: 1,
      ...data,
      created_at: new Date().toISOString(),
    }, { status: 201 });
  }),

  // エラーケースのモック
  http.post('/api/lesson_notes', () => {
    return HttpResponse.json(
      { error: 'Validation failed' },
      { status: 422 }
    );
  }),
];
```

#### テストでのMSW利用

- **統合テスト**: MSWサーバーが自動的に起動（[src/tests/fixtures/server/server.ts](src/tests/fixtures/server/server.ts)で設定）
- **ユニットテスト**: 必要に応じてAPIクライアント関数をモック化

```typescript
// テスト実装例
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('授業記録を作成できる', async () => {
  const user = userEvent.setup();
  render(<LessonNoteForm />);

  // フォーム入力
  await user.type(screen.getByLabelText('説明'), 'テスト授業');
  await user.click(screen.getByRole('button', { name: '保存' }));

  // 成功メッセージの確認
  await waitFor(() => {
    expect(screen.getByText('授業引継ぎを作成しました')).toBeInTheDocument();
  });
});
```

### バリデーションの実装パターン

Zodスキーマでバリデーションルールを定義します。

```typescript
// src/features/lessonNotes/types/lessonNote.ts
import { z } from 'zod';
import { parseISO, startOfDay } from 'date-fns';

export const ExpireDateSchema = z.string().refine(
  (val) => {
    const today = startOfDay(new Date());
    const inputDate = startOfDay(parseISO(val));
    return inputDate >= today;
  },
  { message: "有効期限は今日以降の日付を入力してください" }
);

export const LessonNoteFormSchema = z.object({
  student_class_subject_id: z.number({
    required_error: "生徒・クラス・科目を選択してください",
  }),
  note_type_id: z.number({
    required_error: "授業引継ぎタイプを選択してください",
  }),
  description: z.string().min(1, "説明を入力してください"),
  expire_date: ExpireDateSchema,
});
```

React Hook Formと組み合わせて使用：

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const form = useForm({
  resolver: zodResolver(LessonNoteFormSchema),
  defaultValues: {
    student_class_subject_id: undefined,
    note_type_id: undefined,
    description: '',
    expire_date: '',
  },
});
```

## API設計の実装パターン

SDDではRESTful URLを示していますが、実装では以下のパターンを採用しています。

### エンドポイント設計

```typescript
// 授業記録（LessonNote）
POST   /lesson_notes              // 新規作成（student_idはリクエストボディ）
GET    /lesson_notes              // 一覧取得
GET    /lesson_notes/:id          // 詳細取得
PUT    /lesson_notes/:id          // 更新
DELETE /lesson_notes/:id          // 削除

// 生徒特性（StudentTrait）
POST   /student_traits            // 新規作成（student_idはリクエストボディ）
GET    /students/:id/traits       // 特定の生徒の特性一覧
DELETE /student_traits/:id        // 削除
```

### 共通エラーハンドリング

エラーハンドリングは [src/lib/errors/getErrorMessage.ts](src/lib/errors/getErrorMessage.ts) で統一的に処理します。

```typescript
import { getErrorMessage } from '@/lib/errors/getErrorMessage';

try {
  await apiCall();
} catch (error) {
  const message = getErrorMessage(error);
  // エラーメッセージを表示
}
```

## トラブルシューティング

### SDDと実装が一致しない場合

#### 確認手順

1. **SDDの最新性を確認**
   - [docs/functional-design.md](docs/functional-design.md)の変更履歴セクションを確認
   - 実装コードの`git log`で最終更新日を確認

2. **対応方針を決定**
   - データモデルやAPI仕様の不一致 → 実装を優先（SDDは概念モデル）
   - 機能追加・変更の場合 → SDDを先に更新してから実装
   - バグ修正の場合 → コード修正後、必要に応じてSDDも更新

3. **類似機能を参照**
   - `src/features/lessonNotes/` - 授業記録管理の実装例
   - `src/features/studentTraits/` - 生徒特性管理の実装例
   - 同じパターンが使われているか確認

### バリデーションエラーの対処

1. **Zodスキーマの確認**
   ```typescript
   // 例: src/features/lessonNotes/types/lessonNote.ts
   export const ExpireDateSchema = z.string().refine(
     (val) => {
       const today = startOfDay(new Date());
       const inputDate = startOfDay(parseISO(val));
       return inputDate >= today;
     },
     { message: "有効期限は今日以降の日付を入力してください" }
   );
   ```

2. **エラーメッセージの確認**
   - SDDで定義されたメッセージと実装が一致しているか
   - React Hook Formのエラーオブジェクトから適切にメッセージを取得しているか

### APIエラーの対処

1. **エラーハンドリングの統一**
   - [src/lib/errors/getErrorMessage.ts](src/lib/errors/getErrorMessage.ts)を使用
   - Axiosエラー、422エラー、通信障害を統一的に処理

2. **MSWモックの確認**
   - [src/tests/fixtures/server/handlers.ts](src/tests/fixtures/server/handlers.ts)でAPIモックを定義
   - エラーケースのモックも実装されているか確認

3. **デバッグ方法**
   - ブラウザの開発者ツールでネットワークタブを確認
   - MSWのコンソールログでモックが動作しているか確認

## 関連リンク

- [バックエンドリポジトリ](https://github.com/Taira0222/juku-cloud-backend)
- [技術スタック詳細](README.md#✨-技術スタック)
- [ディレクトリ構成](README.md#🧱-ディレクトリ構成抜粋)

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025-12-31 | 1.0 | 初版作成 | - |
| 2025-12-31 | 1.1 | レビュー反映：SDDと実装の関係性を明確化、API実装パターン追加、トラブルシューティング具体化、MSW/バリデーション実装例追加 | - |
