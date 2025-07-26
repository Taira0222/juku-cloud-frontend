import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type {
  AuthHeader,
  LoginErrorResponse,
  LoginSuccessResponse,
} from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';
import { useWarningStore } from '@/stores/warningStore';
import { api } from '@/lib/api';

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const warningMessage = useWarningStore((state) => state.warningMessage);
  const setClearWarningMessage = useWarningStore(
    (state) => state.setClearWarningMessage
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // フォームのデフォルト動作を防ぐ
    setError(null); // エラーをリセット
    setClearWarningMessage(); // 警告メッセージをクリア

    if (isSubmitting) return; // すでに送信中の場合は何もしない
    setIsSubmitting(true); // 送信中フラグを立てる

    try {
      const response = await api.post<LoginSuccessResponse>(
        '/api/v1/auth/sign_in',
        { email, password }
      );

      const headers = response.headers;

      // 必要なプロパティが存在するかチェック
      if (
        headers['access-token'] &&
        headers['client'] &&
        headers['uid'] &&
        headers['token-type'] &&
        headers['expiry']
      ) {
        // AuthHeader型に必要なプロパティのみを抽出
        const authHeader: AuthHeader = {
          'access-token': headers['access-token'],
          client: headers['client'],
          uid: headers['uid'],
          'token-type': headers['token-type'],
          expiry: headers['expiry'],
        };

        setAuth(authHeader);
        navigate('/student_management', { replace: true });
      } else {
        throw new Error('認証ヘッダーが不足しています');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError<LoginErrorResponse>(err)) {
        if (err.response) {
          setError(
            err.response?.data?.errors?.length > 0
              ? err.response.data.errors[0]
              : 'ログインに失敗しました。もう一度お試しください。'
          );
        } else {
          // レスポンスがない場合、一般的なエラーメッセージを設定
          setError('ログインに失敗しました。もう一度お試しください。');
        }
      } else {
        setError('予期しないエラーが発生しました。');
      }
    } finally {
      setIsSubmitting(false); // 送信中フラグを下ろす
    }
  };
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">アカウントにログイン</h1>
        <p className="text-muted-foreground text-sm text-balance">
          メールアドレスとパスワードを入力してログインしてください
        </p>
      </div>
      {/* エラーメッセージの表示 */}
      {warningMessage && (
        <p className="text-red-500 text-center">{warningMessage}</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">パスワード</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              パスワードを忘れましたか？
            </a>
          </div>
          <Input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className={`w-full ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </Button>

        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            または以下で続行
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          GitHubでログイン
        </Button> */}
      </div>

      <div className="text-center text-sm">
        アカウントをお持ちではありませんか？{' '}
        <Link to="/sign_up" className="underline underline-offset-4">
          会員登録
        </Link>
      </div>
    </form>
  );
}
