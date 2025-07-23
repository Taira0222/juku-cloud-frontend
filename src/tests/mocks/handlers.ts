import type {
  LoginPathParams,
  LoginRequestBodyType,
  LoginResponseBodyType,
} from '@/types/msw';
import { http, HttpResponse } from 'msw';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const handlers = [
  http.post<LoginPathParams, LoginRequestBodyType, LoginResponseBodyType>(
    `${VITE_API_BASE_URL}/auth/sign_in`,
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
];
