import {
  currentUserResponse,
  teacher1,
  teachers,
} from '@/tests/fixtures/teachers/teachers';
import type {
  InviteTokenCreateResponseBodyType,
  SignInRequestBodyType,
  SignInResponseBodyType,
  SignUpRequestBodyType,
  SignUpResponseBodyType,
  TeacherDeletePathParams,
  TeacherDeleteResponseBodyType,
  TeacherFetchResponseBodyType,
  TokenConfirmPathParams,
  TokenConfirmResponseBodyType,
} from '@/tests/fixtures/server/types/msw';
import { http, HttpResponse } from 'msw';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_ID = '1';

export const handlers = [
  // サインインのハンドラー
  http.post<never, SignInRequestBodyType, SignInResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/auth/sign_in`,
    async ({ request }) => {
      // リクエストボディからemailとpasswordを取得
      const body = await request.json();
      const { email, password } = body;

      // テスト用の認証情報
      const testEmail = 'test@example.com';
      const testPassword = 'password123';

      // エラーメッセージの内容
      const errorMessage = 'ログインに失敗しました。もう一度お試しください。';

      if (email === testEmail && password === testPassword) {
        // 成功時のレスポンス
        return HttpResponse.json(
          {
            data: {
              email: testEmail,
              provider: 'email',
              uid: 'fake-uid',
              id: 1,
              allow_password_change: false,
              name: 'Test User',
              role: 'teacher',
              school_stage: 'bachelor',
              grade: 1,
              graduated_university: 'Fake University',
            },
          },
          {
            status: 200,
            headers: {
              'access-token': 'fake-access-token',
              client: 'fake-client',
              uid: 'fake-uid',
              'token-type': 'Bearer',
              expiry: '1754694561', // string としてわたってくるので、Date型に変換する必要はない
            },
          }
        );
      } else {
        // 失敗時のレスポンス
        return HttpResponse.json(
          {
            success: false,
            errors: [errorMessage],
          },
          {
            status: 401,
          }
        );
      }
    }
  ),
  // サインアップのハンドラー
  http.post<never, SignUpRequestBodyType, SignUpResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/auth`,
    async ({ request }) => {
      const body = await request.json();
      const { email, password, password_confirmation, token, name } = body;

      // エラーを収集する配列
      const errors: { [key: string]: string[] } = {};
      const fullMessages: string[] = [];

      // バリデーション
      // メールアドレスの重複チェック
      if (email === 'duplicate@example.com') {
        errors.email = ['メールアドレスはすでに使用されています。'];
        fullMessages.push(errors.email[0]);
      }

      // パスワードの長さチェック
      if (password && password.length < 6) {
        errors.password = ['パスワードは6文字以上で入力してください。'];
        fullMessages.push(errors.password[0]);
      }

      // パスワード確認チェック
      if (password !== password_confirmation) {
        errors.password_confirmation = ['パスワードが一致しません。'];
        fullMessages.push(errors.password_confirmation[0]);
      }

      // 学校コードの有効性チェック
      if (token !== '123456') {
        errors.school_code = ['学校コードが無効です。'];
        fullMessages.push(errors.school_code[0]);
      }

      // エラーがある場合
      if (Object.keys(errors).length > 0) {
        return HttpResponse.json(
          {
            data: {
              id: null,
              provider: 'email',
              uid: 'fake-uid',
              allow_password_change: false,
              name: name || 'Test User',
              role: null,
              school_stage: null,
              grade: null,
              graduated_university: null,
              email: email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            errors: {
              ...errors,
              full_messages: fullMessages,
            },
          },
          {
            status: 422, // devise token auth が返すステータスコード
          }
        );
      }

      // 成功時のレスポンス
      return HttpResponse.json(
        {
          data: {
            id: 1,
            provider: 'email',
            uid: 'fake-uid',
            allow_password_change: false,
            name: name || 'Test User',
            role: 'admin',
            school_stage: null,
            grade: null,
            graduated_university: null,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          status: 200,
        }
      );
    }
  ),
  // 講師一覧のハンドラー
  http.get<never, never, TeacherFetchResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/teachers`,
    async () => {
      try {
        return HttpResponse.json(
          {
            current_user: currentUserResponse,
            teachers: teachers,
          },
          {
            status: 200,
          }
        );
      } catch {
        return HttpResponse.json(
          { error: '予期せぬエラーが発生しました。' },
          { status: 500 }
        );
      }
    }
  ),

  // 講師作成用のトークン作成用のハンドラー
  http.post<never, never, InviteTokenCreateResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/invites`,
    async () => {
      try {
        return HttpResponse.json(
          {
            token: '123456',
          },
          {
            status: 200,
          }
        );
      } catch {
        return HttpResponse.json(
          { message: 'トークン作成に失敗しました' },
          { status: 422 }
        );
      }
    }
  ),

  // 確認メールのトークン確認のハンドラー
  http.get<TokenConfirmPathParams, never, TokenConfirmResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/invites/:token`,
    async ({ params }) => {
      try {
        const token = params.token;
        if (token !== '123456') {
          return HttpResponse.json(
            { message: 'この招待リンクは無効か期限切れです。' },
            { status: 404 }
          );
        }

        return HttpResponse.json(
          { school_name: 'First_school' },
          { status: 200 }
        );
      } catch {
        return HttpResponse.json(
          { message: '予期せぬエラーが発生しました。' },
          { status: 500 }
        );
      }
    }
  ),

  // 講師削除のハンドラー
  http.delete<TeacherDeletePathParams, never, TeacherDeleteResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/teachers/:id`,
    async ({ params }) => {
      const { id } = params;
      const teacher1Id = teacher1.id.toString();
      try {
        // 成功時にはstatus のみ返却する
        if (id === teacher1Id) {
          return new HttpResponse(null, { status: 204 });
        }
      } catch {
        // idが1の時はadminのため削除できない
        if (id === ADMIN_ID) {
          return HttpResponse.json(
            { error: '管理者は削除できません。' },
            { status: 403 }
          );
          // フロントに削除ボタンはあるけど、db 側でユーザーが見つからない想定
        } else if (id !== teacher1Id) {
          return HttpResponse.json(
            { error: 'ユーザーが見つかりませんでした。' },
            { status: 404 }
          );
        } else {
          return HttpResponse.json(
            { error: '予期せぬエラーが発生しました。' },
            { status: 500 }
          );
        }
      }
    }
  ),
];
