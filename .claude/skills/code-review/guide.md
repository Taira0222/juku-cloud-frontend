# Code Review スキル使用ガイド

## 目的

コードベースの品質を体系的に評価し、具体的な改善点を特定します。

## レビュー観点とチェックリスト

---

## 1. コーディング規約とベストプラクティス

### 1.1 TypeScript型安全性

#### チェックポイント
- [ ] `any`型の使用を避けているか（正当な理由がある場合を除く）
- [ ] すべての関数に戻り値型が明示されているか
- [ ] Zodスキーマから型を推論している（`z.infer<typeof Schema>`）
- [ ] null/undefinedを適切に扱っている（optional chaining、nullish coalescing）

#### Good Example (from lessonNotes/types/lessonNote.ts)
```typescript
export const lessonNotesSchema = z.object({
  id: z.number({ message: "IDは数値である必要があります" }),
  title: titleSchema,
  description: descriptionSchema,
  note_type: noteTypeEnum,
  // ... 厳密な型定義
});

export type lessonNoteType = z.infer<typeof lessonNotesSchema>;
```

#### Bad Example
```typescript
// ❌ any型の無分別な使用
const data: any = await fetchData();

// ❌ 戻り値型の欠落
function processData(input) {
  return input.map(item => item.value);
}
```

#### 検出方法
- Grepで`any`を検索: `grep -rn ": any" src/`
- TypeScriptコンパイラエラーを確認

---

### 1.2 React 19ベストプラクティス

#### チェックポイント
- [ ] 関数コンポーネントを使用（クラスコンポーネント禁止）
- [ ] カスタムフックで再利用可能なロジックを抽出
- [ ] useEffectの依存配列が正しく設定されている
- [ ] 不要なレンダリングを避ける（useMemo, useCallback適切使用）
- [ ] コンポーネントの責務が単一（Single Responsibility Principle）

#### Good Example (from lessonNotes/hooks/)
```typescript
// カスタムフック: ロジックの再利用
export const useLessonNoteForm = (studentId: number) => {
  const form = useForm<LessonNoteCreate>({
    resolver: zodResolver(createLessonNoteSchema),
    defaultValues: {
      subject_id: 0,
      title: "",
      description: "",
      note_type: "lesson",
      expire_date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  return { form };
};
```

#### Bad Example
```typescript
// ❌ useEffectの依存配列不足
useEffect(() => {
  fetchData(userId); // userIdが依存配列にない
}, []);

// ❌ コンポーネント内に複雑なビジネスロジック
function StudentForm() {
  // 100行以上のロジック...
  // 複数の責務を持つ巨大コンポーネント
}
```

#### 検出方法
- ESLintルール: `@tanstack/query/exhaustive-deps`
- コンポーネントの行数をチェック（200行超えは要分割検討）

---

### 1.3 命名規則とコード可読性

#### チェックポイント
- [ ] ファイル名: camelCase（コンポーネント以外）、PascalCase（コンポーネント）
- [ ] 変数名: 意味のある名前（x, temp等の曖昧な名前を避ける）
- [ ] 定数: UPPER_SNAKE_CASE（グローバル定数）
- [ ] コンポーネント: PascalCase
- [ ] カスタムフック: `use`で始まる
- [ ] API関数: 動詞で始まる（`createLessonNote`, `fetchStudents`）

#### Good Example
```typescript
// ✅ 明確な命名
export const CreateLessonNote = async (
  payload: LessonNoteCreateRequest
): Promise<lessonNoteType> => {
  const response = await api.post<lessonNoteType>("/lesson_notes", payload);
  return lessonNotesSchema.parse(response.data);
};
```

#### Bad Example
```typescript
// ❌ 曖昧な命名
const data = await get();
const temp = x.map(i => i.val);
```

---

### 1.4 プロジェクト構造パターン準拠

#### チェックポイント
- [ ] Feature-based構造に従っている（`src/features/<feature>/`）
- [ ] 各featureに必要なディレクトリがある
  - `api/` - API client functions
  - `components/` - Feature-specific components
  - `hooks/` - Custom hooks
  - `mutations/` - TanStack Query mutations
  - `queries/` - TanStack Query queries
  - `types/` - TypeScript types and Zod schemas
  - `test/` - Tests with MSW mocks
- [ ] 共通コンポーネントは`src/components/`に配置
- [ ] グローバルストアは`src/stores/`に配置

#### 参照パターン
```
src/features/lessonNotes/
├── api/
│   ├── lessonNoteCreateApi.ts
│   ├── lessonNoteUpdateApi.ts
│   └── lessonNoteDeleteApi.ts
├── components/
│   ├── LessonNoteForm.tsx
│   └── LessonNoteTable.tsx
├── hooks/
│   └── useLessonNoteForm.ts
├── mutations/
│   ├── useCreateLessonNote.ts
│   └── useUpdateLessonNote.ts
├── queries/
│   └── useLessonNotes.ts
├── types/
│   ├── lessonNote.ts
│   └── lessonNoteForm.ts
└── test/
    ├── api/
    └── hooks/
```

#### 検出方法
- 各feature配下のディレクトリ構造を確認
- `ls -la src/features/*/`で一覧取得

---

### 1.5 エラーハンドリングの統一

#### チェックポイント
- [ ] `getErrorMessage()`を使用して統一的にエラー処理
- [ ] try-catchで適切にエラーをキャッチ
- [ ] ユーザーフレンドリーなエラーメッセージを表示
- [ ] エラー時のUI状態を適切に管理（ローディング解除、フォーム有効化）

#### Good Example (from lib/errors/getErrorMessage.ts)
```typescript
import { getErrorMessage } from '@/lib/errors/getErrorMessage';

try {
  await createLessonNote(data);
  toast.success('授業引継ぎを作成しました');
} catch (error) {
  const messages = getErrorMessage(error);
  messages.forEach(msg => toast.error(msg));
}
```

#### Bad Example
```typescript
// ❌ エラー処理の欠落
await createLessonNote(data);

// ❌ 生のエラーをそのまま表示
catch (error) {
  alert(error.toString());
}
```

---

## 2. テストカバレッジと品質

### 2.1 カバレッジ要件

#### チェックポイント
- [ ] ステートメントカバレッジ: 80%以上
- [ ] ブランチカバレッジ: 80%以上
- [ ] 関数カバレッジ: 80%以上
- [ ] 行カバレッジ: 80%以上

#### 確認方法
```bash
npm run test:coverage
```

#### 現在の実績（README.mdより）
- Statements: 97%
- Branches: 92%
- Functions: 92%
- Lines: 97%

---

### 2.2 MSWモック実装パターン

#### チェックポイント
- [ ] すべてのAPIエンドポイントにMSWハンドラーが定義されている
- [ ] 成功ケースとエラーケースの両方をモック
- [ ] レスポンスデータがZodスキーマに準拠
- [ ] ハンドラーは`src/tests/fixtures/server/handlers.ts`に集約

#### Good Example (from handlers.ts)
```typescript
http.post<never, LessonNoteCreateRequestBodyType, LessonNoteCreateResponseBodyType>(
  `${VITE_API_BASE_URL}/lesson_notes`,
  async ({ request }) => {
    const body = await request.json();

    // バリデーション
    if (!body.description || body.description.trim() === "") {
      return HttpResponse.json(
        { errors: [{ code: "invalid", message: "説明を入力してください" }] },
        { status: 422 }
      );
    }

    // 成功レスポンス
    return HttpResponse.json(
      {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  }
),
```

---

### 2.3 ユニットテストとAPI関数テスト

#### チェックポイント
- [ ] すべてのAPI関数にテストが存在
- [ ] 正常系・異常系の両方をテスト
- [ ] Zodエラーケースをテスト（不正なレスポンス）
- [ ] モックの適切な使用（vi.mock）

#### Good Example (from lessonNoteCreateApi.test.ts)
```typescript
describe("lessonNoteCreateApi", () => {
  test("CreateLessonNote", async () => {
    const mockResponse = { data: createResponseLessonNoteMock };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await CreateLessonNote(createLessonNotePayload);
    expect(result).toEqual(createResponseLessonNoteMock);
    expect(api.post).toHaveBeenCalledWith("/lesson_notes", createLessonNotePayload);
  });

  test("CreateLessonNote - handles API error", async () => {
    const apiError = new Error("API Error");
    vi.mocked(api.post).mockRejectedValueOnce(apiError);

    await expect(CreateLessonNote(createLessonNotePayload)).rejects.toThrow("API Error");
  });

  test("CreateLessonNote - handles invalid response data", async () => {
    const invalidResponse = { data: { invalid: "data" } };
    vi.mocked(api.post).mockResolvedValueOnce(invalidResponse);

    // Zodエラーがスローされることを確認
    await expect(CreateLessonNote(createLessonNotePayload)).rejects.toThrow();
  });
});
```

---

### 2.4 カスタムフックのテスト

#### チェックポイント
- [ ] フックのロジックをテスト（@testing-library/react使用）
- [ ] 初期値が正しいか確認
- [ ] フォームバリデーションが機能するか検証

---

## 3. セキュリティとバリデーション

### 3.1 OWASP Top 10対策

#### 3.1.1 A01: Broken Access Control（アクセス制御の不備）

**チェックポイント:**
- [ ] 認証・認可が適切に実装されている
- [ ] Protected Routeでアクセス制御
- [ ] ロールベースアクセス制御（RBAC）を実装
- [ ] APIリクエストに認証トークンを含める

**確認箇所:**
- `src/Router/` - AuthRoute, ProtectedRoute, RoleRoute
- API client（axios interceptors）で認証ヘッダー付与

---

#### 3.1.2 A02: Cryptographic Failures（暗号化の失敗）

**チェックポイント:**
- [ ] パスワード等の機密情報を平文で保存していない
- [ ] HTTPS強制（本番環境）
- [ ] LocalStorageに機密情報を保存する場合はリスクを理解
- [ ] CSP（Content Security Policy）設定（CloudFrontで付与）

**確認箇所:**
- README.mdに記載: "LocalStorageはXSSに弱いためCSPで外部スクリプト実行を抑制"

---

#### 3.1.3 A03: Injection（インジェクション）

**チェックポイント:**
- [ ] ユーザー入力をそのままHTMLに埋め込まない
- [ ] Reactのデフォルトエスケープ機構を活用
- [ ] `dangerouslySetInnerHTML`の使用を避ける（必要な場合DOMPurifyで浄化）
- [ ] SQLインジェクションはバックエンド側の責務（ORMを使用）

**検出方法:**
- Grepで`dangerouslySetInnerHTML`を検索
- `eval()`等の危険な関数使用をチェック

---

#### 3.1.4 A04: Insecure Design（安全でない設計）

**チェックポイント:**
- [ ] フロントエンド・バックエンドの二重防御
- [ ] クライアント側バリデーション（UX向上）
- [ ] サーバー側バリデーション（セキュリティ）
- [ ] エラーメッセージで内部情報を漏らさない

---

#### 3.1.5 A05: Security Misconfiguration（セキュリティ設定ミス）

**チェックポイント:**
- [ ] .envファイルをgit管理していない（.gitignore確認）
- [ ] APIキー等の秘密情報をコードに埋め込まない
- [ ] 開発用デバッグコードを本番に含めない（console.log削除）
- [ ] エラースタックトレースを本番で表示しない

**検出方法:**
- Grepで`console.log`を検索
- `.env`が`.gitignore`に含まれているか確認

---

#### 3.1.6 A07: Identification and Authentication Failures（認証・識別の失敗）

**チェックポイント:**
- [ ] パスワード強度要件（8文字以上）
- [ ] セッション管理の適切な実装
- [ ] トークンの有効期限管理
- [ ] ログアウト時のトークン削除

---

### 3.2 入力バリデーション

#### チェックポイント
- [ ] すべてのフォームにZodバリデーション
- [ ] バリデーションルールがSDD定義と一致
- [ ] エラーメッセージがユーザーフレンドリー
- [ ] カスタムバリデーション（refine）の適切な使用

#### Good Example (from lessonNote.ts)
```typescript
export const ExpireDateSchema = z.string().refine(
  (val) => {
    const today = startOfDay(new Date());
    const inputDate = startOfDay(parseISO(val));
    return inputDate >= today;
  },
  { message: "有効期限は今日以降の日付を入力してください" }
);

export const createLessonNoteSchema = z.object({
  subject_id: z.number().min(1, { message: "科目を1つ以上選択してください" }),
  title: titleSchema,
  description: descriptionSchema,
  note_type: noteTypeEnum,
  expire_date: ExpireDateSchema,
});
```

---

### 3.3 XSS/CSRF対策

#### チェックポイント
- [ ] Reactの自動エスケープを活用
- [ ] `dangerouslySetInnerHTML`の使用を最小化
- [ ] CSRFトークン（バックエンド: Rails側で実装）
- [ ] SameSite Cookie設定（バックエンド）

---

## 4. SDD準拠性チェックリスト

### 4.1 機能要件との整合性

#### チェックポイント
- [ ] SDDで定義された全機能が実装されている
- [ ] ユーザーストーリーを満たしている
- [ ] 受入基準を全てクリア
- [ ] 優先度「必須」機能が完成している

#### 確認方法
1. `docs/functional-design.md`の機能一覧を確認
2. 各機能（F-001, F-002, etc.）の実装状況を確認
3. 受入基準のGIVEN-WHEN-THEN-ANDをテストでカバー

---

### 4.2 APIエンドポイント仕様

#### チェックポイント
- [ ] エンドポイントURLがSDD仕様に準拠
  - ただし、SDDはRESTful理想形、実装は実際のバックエンド仕様に従う
  - 例: SDD `POST /students/:studentId/traits` → 実装 `POST /student_traits` (student_idはbody)
- [ ] HTTPメソッドが正しい（GET/POST/PUT/DELETE）
- [ ] リクエスト/レスポンス形式がSDDと整合
- [ ] エラーレスポンスのステータスコードが定義通り

#### 参照（CLAUDE.mdより）
```
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

---

### 4.3 バリデーションルール準拠

#### チェックポイント
- [ ] SDDで定義されたバリデーションルールを実装
- [ ] エラーメッセージがSDD定義と一致（または適切に調整）
- [ ] 必須項目チェック
- [ ] 文字数制限、形式チェック

#### 例（SDD F-001: ユーザー認証）
```
| 項目 | ルール | エラーメッセージ |
| メールアドレス | 必須、Email形式 | 「有効なメールアドレスを入力してください」 |
| パスワード | 必須、8文字以上 | 「パスワードは8文字以上で入力してください」 |
```

実装で同じルールとメッセージが使われているか確認。

---

### 4.4 画面設計とワークフロー

#### チェックポイント
- [ ] 画面構成がSDDのワイヤーフレームの意図に沿っている
  - 細部は実装時に調整可（shadcn/ui使用）
- [ ] 必要なUI要素が揃っている（ボタン、フォーム、テーブル等）
- [ ] ワークフローのシーケンス図に従った処理フロー
- [ ] エラー状態、ローディング状態の適切な表示

---

## レビュー実施の具体的手順

### Step 1: プロジェクト全体の理解
```bash
# READMEと開発ガイドラインを読む
Read: README.md
Read: CLAUDE.md
Read: docs/functional-design.md (機能一覧確認)

# ディレクトリ構造を把握
Bash: tree -L 2 src/
```

### Step 2: 実装パターンの参照
```bash
# 参照実装としてlessonNotesを確認
Read: src/features/lessonNotes/ (各ファイル)
Read: src/lib/errors/getErrorMessage.ts
Read: src/tests/fixtures/server/handlers.ts
```

### Step 3: コーディング規約チェック
```bash
# TypeScript型安全性
Grep: pattern="any" path="src/" output_mode="files_with_matches"
Grep: pattern="@ts-ignore" path="src/" output_mode="files_with_matches"

# React hooks依存配列
Bash: npm run lint

# コンソールログ残存
Grep: pattern="console\\.log" path="src/" output_mode="content"

# 命名規則
Glob: pattern="**/*.tsx" # コンポーネント名がPascalCaseか確認
```

### Step 4: テストカバレッジチェック
```bash
# カバレッジレポート生成
Bash: npm run test:coverage

# MSWハンドラー確認
Read: src/tests/fixtures/server/handlers.ts

# テストファイル存在確認
Glob: pattern="**/*.test.ts" path="src/features/"
```

### Step 5: セキュリティチェック
```bash
# 危険な関数使用
Grep: pattern="dangerouslySetInnerHTML" path="src/"
Grep: pattern="eval\\(" path="src/"

# 機密情報漏洩
Grep: pattern="password.*=.*['\"]" path="src/" # ハードコードされたパスワード
Grep: pattern="api[_-]?key" path="src/" -i # APIキー

# .envファイル管理
Read: .gitignore # .envが含まれているか確認
```

### Step 6: SDD準拠性チェック
```bash
# 各機能の実装状況確認
Read: docs/functional-design.md (F-001, F-002, etc.)
Read: src/features/auth/ (F-001対応)
Read: src/features/lessonNotes/ (F-002対応)
Read: src/features/studentTraits/ (F-004対応)

# APIエンドポイント確認
Grep: pattern="/lesson_notes" path="src/features/lessonNotes/api/"
Grep: pattern="/student_traits" path="src/features/studentTraits/api/"
```

---

## 重要度の判断基準

### Critical（緊急対応必須）
- セキュリティ脆弱性（XSS, CSRF, 認証不備）
- データ喪失のリスク
- アプリケーションクラッシュの原因
- OWASP Top 10の高リスク項目

### High（優先対応推奨）
- テストカバレッジ不足（80%未満）
- 型安全性の欠如（any型多用）
- エラーハンドリングの欠落
- SDD必須機能の未実装

### Medium（計画的に対応）
- コーディング規約違反（命名規則等）
- パフォーマンス最適化の余地
- コードの重複
- リファクタリング推奨箇所

### Low（改善提案）
- コメント不足
- console.log残存（開発環境のみ影響）
- より良い実装パターンの提案
- ドキュメント更新

---

## よくある問題パターン

### Pattern 1: any型の乱用
```typescript
// ❌ Bad
const data: any = await fetchData();

// ✅ Good
const data: FetchDataResponse = await fetchData();
// または
const data = fetchDataResponseSchema.parse(await fetchData());
```

### Pattern 2: エラーハンドリングの欠落
```typescript
// ❌ Bad
const result = await createStudent(data);

// ✅ Good
try {
  const result = await createStudent(data);
  toast.success('生徒を作成しました');
} catch (error) {
  const messages = getErrorMessage(error);
  messages.forEach(msg => toast.error(msg));
}
```

### Pattern 3: useEffectの依存配列不足
```typescript
// ❌ Bad
useEffect(() => {
  fetchStudents(classId);
}, []); // classIdが依存配列にない

// ✅ Good
useEffect(() => {
  fetchStudents(classId);
}, [classId]);
```

### Pattern 4: バリデーションの欠如
```typescript
// ❌ Bad
const handleSubmit = (data) => {
  api.post('/students', data);
};

// ✅ Good
const schema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Pattern 5: MSWモックの不足
```typescript
// ❌ Bad
// テストでAPIモックが未定義 → 実際のAPIにリクエストが飛ぶ

// ✅ Good
// handlers.tsでエンドポイントをモック
http.post(`${VITE_API_BASE_URL}/students`, async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json({ id: 1, ...body }, { status: 201 });
}),
```

---

## レビュー時の注意事項

1. **文脈を理解する**
   - 開発期間6ヶ月のMVP（最小限の機能）
   - 限定リソース（チームスキル、時間制約）
   - すべて完璧である必要はない

2. **SDDと実装の関係**
   - SDDは概念モデル（理想形）
   - 実装は実際のAPI仕様に従う
   - データモデルやAPI設計の不一致は正常（CLAUDE.md参照）

3. **優先順位をつける**
   - Critical/Highから対応
   - Low問題は継続的改善で対応

4. **建設的なフィードバック**
   - 問題指摘だけでなく、解決策を提示
   - Good ExampleとBad Exampleを併記
   - ファイルパスと行番号を明記

5. **定期的なレビュー**
   - 週次/月次で実行
   - 継続的な品質改善
   - 技術的負債の蓄積を防ぐ
