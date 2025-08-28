import { useFetchUser } from '@/queries/useFetchUser';
import { useAuthStore } from '@/stores/authStore';
import { useWarningStore } from '@/stores/warningStore';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setWarningMessage = useWarningStore((state) => state.setWarningMessage);
  // ユーザー情報取得
  const { error } = useFetchUser();
  const authenticated = isAuthenticated();

  // 認証チェック
  useEffect(() => {
    if (!authenticated) {
      setWarningMessage('ログインが必要です');
    }
  }, [authenticated, setWarningMessage]);

  if (!authenticated) {
    return <Navigate to="/sign_in" />;
  }
  // エラーが出たら404に遷移させる。
  if (error) {
    return <Navigate to="/404" />;
  }

  return <Outlet />;
};
