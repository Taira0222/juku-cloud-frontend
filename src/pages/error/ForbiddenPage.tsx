import { Button } from '@/components/ui/form/Button/button';
import { useAuthStore } from '@/stores/authStore';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ForbiddenPage = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const onClickBackToHome = () => {
    clearAuth();
    navigate('/', { replace: true });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-gray-300">403</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            アクセス権限がありません
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            このページにアクセスする権限がないため、管理者アカウントでのログインが必要です
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onClickBackToHome}>
            <Home className="h-4 w-4" />
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
};
