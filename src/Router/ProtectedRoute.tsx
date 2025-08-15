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
  useFetchUser();

  // 認証・期限チェック
  if (!isAuthenticated()) {
    setWarningMessage('ログインが必要です');
    return <Navigate to="/sign_in" />;
  }
  if (allowedRoles) {
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
