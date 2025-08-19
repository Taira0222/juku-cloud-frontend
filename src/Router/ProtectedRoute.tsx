import { useFetchUser } from '@/features/managementDashboard/hooks/useFetchUser';
import { useAuthStore } from '@/stores/authStore';
import { useWarningStore } from '@/stores/warningStore';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setWarningMessage = useWarningStore((state) => state.setWarningMessage);
  // ユーザー情報取得
  const { error } = useFetchUser();

  // 認証チェック
  if (!isAuthenticated()) {
    setWarningMessage('ログインが必要です');
    return <Navigate to="/sign_in" />;
  }
  // エラーが出たら404に遷移させる。
  if (error) {
    return <Navigate to="/404" />;
  }

  return <Outlet />;
};
