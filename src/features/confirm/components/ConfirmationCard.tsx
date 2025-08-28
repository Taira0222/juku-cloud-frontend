import { CheckCircle2, XCircle, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/form/Button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/Card/card';
import { cn } from '@/lib/utils';

type ConfirmationCardProps = {
  isSuccess: boolean;
  countdown: number;
  onManualRedirect: () => void;
  onHomeRedirect: () => void;
};

export const ConfirmationCard = (props: ConfirmationCardProps) => {
  const { isSuccess, countdown, onManualRedirect, onHomeRedirect } = props;

  const config = isSuccess
    ? {
        icon: CheckCircle2,
        title: 'アカウント確認完了',
        description: 'アカウントが正常に確認されました',
        countdownText: 'ログインページに移動します',
        buttonText: 'ログインページへ',
      }
    : {
        icon: XCircle,
        title: 'アカウント確認失敗',
        description:
          '確認リンクが無効または期限切れの可能性があります。お手数ですが、再度会員登録を行ってください。',
        countdownText: '会員登録ページに移動します',
        buttonText: '会員登録ページへ',
      };

  const Icon = config.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={cn(
              'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
              isSuccess ? 'bg-green-100' : 'bg-red-100'
            )}
          >
            <Icon
              className={cn(
                'h-8 w-8',
                isSuccess ? 'text-green-600' : 'text-red-600'
              )}
            />
          </div>
          <CardTitle
            className={cn(
              'text-2xl font-bold',
              isSuccess ? 'text-green-700' : 'text-red-700'
            )}
          >
            {config.title}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {countdown}秒後に{config.countdownText}
              </span>
            </div>

            <Button
              onClick={onManualRedirect}
              className={cn(
                'w-full',
                isSuccess
                  ? 'bg-green-600 hover:bg-green-500'
                  : 'bg-red-600 hover:bg-red-500'
              )}
            >
              {config.buttonText}
            </Button>

            {!isSuccess && (
              <Button
                variant="outline"
                onClick={onHomeRedirect}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                ホームに戻る
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
