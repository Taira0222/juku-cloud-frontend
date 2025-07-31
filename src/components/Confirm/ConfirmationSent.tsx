import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWarningStore } from '@/stores/warningStore';

export const ConfirmationSent = () => {
  const COUNTDOWN_SECONDS: number = 10; // カウントダウンの秒数
  const navigate = useNavigate();
  const location = useLocation();
  const setWarningMessage = useWarningStore((state) => state.setWarningMessage);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS); // 10秒後にホームに戻る

  useEffect(() => {
    if (location.state?.from !== '/sign_up') {
      // 直接アクセスされた場合はSignUpページにリダイレクト
      navigate('/sign_up');
      setWarningMessage('会員登録が必要です。');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // クリーンアップ関数でタイマーをクリア
    return () => clearInterval(timer);
  }, [navigate, location, setWarningMessage]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            確認メールを送信しました
          </CardTitle>
          <CardDescription>
            アカウント作成を完了するため、メールを確認してください
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>メールを確認してください</AlertTitle>
            <AlertDescription>
              メールボックスを確認し、リンクをクリックしてアカウントを有効化してください。
              メールが見つからない場合は、迷惑メールフォルダもご確認ください。
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {countdown}秒後に自動でホームページに戻ります
            </p>

            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              ホームに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
