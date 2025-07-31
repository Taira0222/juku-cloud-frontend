import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import type {
  SignUpErrorResponse,
  SignUpSuccessResponse,
} from '@/types/signUp';
import { api } from '@/lib/api';

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [schoolCode, setSchoolCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // パスワード表示/非表示
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false); // 確認用パスワード表示/非表示
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const requestData = {
      name,
      email,
      school_code: schoolCode,
      password,
      password_confirmation: passwordConfirmation,
    };

    if (isSubmitting) return; // すでに送信中の場合は何もしない
    setIsSubmitting(true); // 送信中フラグを立てる

    try {
      await api.post<SignUpSuccessResponse>('/auth', requestData);
      navigate('/sign_up/confirmation_sent', { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError<SignUpErrorResponse>(err)) {
        if (err.response) {
          setError(
            err.response?.data?.errors?.full_messages?.join('\n') ||
              '新規登録に失敗しました。もう一度お試しください。'
          );
        } else {
          setError('新規登録に失敗しました。もう一度お試しください。');
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
      <div className="flex flex-col items-center gap-2 text-center ">
        <h1 className="text-2xl font-bold">アカウントを新規作成</h1>
        <p className="text-muted-foreground text-sm text-balance">
          名前とメールアドレスを入力してください
        </p>
      </div>
      {/* エラーメッセージの表示 */}
      {error && (
        <div className="text-red-500 text-center text-sm">
          <ul>
            {error.split('\n').map((message, index) => (
              <li key={index} className="mb-1 last:mb-0">
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            type="text"
            placeholder="山田 太郎"
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
          <Label htmlFor="school_code">学校コード</Label>
          <Input
            id="school_code"
            type="text"
            placeholder="例: 123456"
            onChange={(e) => setSchoolCode(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3 relative">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="grid gap-3 relative">
          <Label htmlFor="password_confirmation">パスワード確認</Label>
          <Input
            id="password_confirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9"
            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
            aria-label={
              showPasswordConfirmation
                ? 'Hide password confirmation'
                : 'Show password confirmation'
            }
          >
            {showPasswordConfirmation ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <Button
          type="submit"
          className={cn('w-full', {
            'opacity-50 cursor-not-allowed': isSubmitting,
          })}
          disabled={isSubmitting}
        >
          {isSubmitting ? '登録中...' : '会員登録'}
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
