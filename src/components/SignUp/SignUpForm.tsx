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

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [name, setName] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { VITE_API_BASE_URL } = import.meta.env;
  const warningMessage = useWarningStore((state) => state.warningMessage);
  const setClearWarningMessage = useWarningStore(
    (state) => state.setClearWarningMessage
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // フォームのデフォルト動作を防ぐ
    setError(null); // エラーをリセット
    setClearWarningMessage(); // 警告メッセージをクリア

    try {
      const response = await axios.post<LoginSuccessResponse>(
        `${VITE_API_BASE_URL}/auth/sign_up`,
        { email, password, name, password_confirmation: passwordConfirmation }
      );

      const headers = response.headers;

      // 必要なプロパティが存在するかチェック
      if (
        headers['access-token'] &&
        headers['client'] &&
        headers['uid'] &&
        headers['token-type']
      ) {
        // AuthHeader型に必要なプロパティのみを抽出
        const authHeader: AuthHeader = {
          'access-token': headers['access-token'],
          client: headers['client'],
          uid: headers['uid'],
          'token-type': headers['token-type'],
        };

        setAuth(authHeader);
        navigate('/student_management');
      } else {
        throw new Error('認証ヘッダーが不足しています');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError<LoginErrorResponse>(err)) {
        if (err.response) {
          // レスポンスがある場合、エラーメッセージを設定
          setError(err.response.data.errors.join(', '));
        } else {
          // レスポンスがない場合、一般的なエラーメッセージを設定
          setError('新規登録に失敗しました。もう一度お試しください。');
        }
      } else {
        setError('予期しないエラーが発生しました。');
      }
    }
  };
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center ">
        <h1 className="text-2xl font-bold">アカウントを新規作成</h1>
        <p className="text-muted-foreground text-sm text-balance">
          名前とメールアドレスを入力してください
        </p>
      </div>
      {/* エラーメッセージの表示 */}
      {warningMessage && (
        <p className="text-red-500 text-center">{warningMessage}</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            type="text"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="grid gap-3">
            <Label htmlFor="password_confirmation">パスワード確認</Label>
            <Input
              id="password_confirmation"
              type="password"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          会員登録
        </Button>
      </div>

      <div className="text-center text-sm">
        すでにアカウントをお持ちですか？{' '}
        <Link to="/sign_in" className="underline underline-offset-4">
          ログイン
        </Link>
      </div>
    </form>
  );
}
