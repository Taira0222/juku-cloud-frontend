import SpinnerWithText from '@/components/common/status/Loading';
import { useFetchUser } from '@/features/managementDashboard/hooks/useFetchUser';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { useWarningStore } from '@/stores/warningStore';
import { Navigate, Outlet } from 'react-router-dom';

type Role = 'admin' | 'teacher';

type Props = {
  allowedRoles?: Role[];
};

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const setWarningMessage = useWarningStore((state) => state.setWarningMessage);
  // ManagementDashboard でやっていたユーザー情報取得をここに移動
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
  // ロールチェック
  if (allowedRoles) {
    // useFetchUser 読み込み中UI
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <SpinnerWithText>Loading ...</SpinnerWithText>
        </div>
      );
    }
    if (!allowedRoles.includes(user.role as Role)) {
      return <Navigate to="/forbidden" />;
    }
  }

  return <Outlet />;
};
