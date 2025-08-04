import type {
  LoginPathParams,
  LoginRequestBodyType,
  LoginResponseBodyType,
  SignUpPathParams,
  SignUpRequestBodyType,
  SignUpResponseBodyType,
} from '@/tests/mocks/types/msw';
import { http, HttpResponse } from 'msw';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const handlers = [
  // サインインのハンドラー
  http.post<LoginPathParams, LoginRequestBodyType, LoginResponseBodyType>(
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
  http.post<SignUpPathParams, SignUpRequestBodyType, SignUpResponseBodyType>(
    `${VITE_API_BASE_URL}/api/v1/auth`,
    async ({ request }) => {
      const body = await request.json();
      const { email, password, password_confirmation, school_code, name } =
        body;

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
      if (school_code !== '123456') {
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
];
