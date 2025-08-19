import SpinnerWithText from '@/components/common/status/Loading';
import { useUserStore } from '@/stores/userStore';
import { Navigate, Outlet } from 'react-router-dom';

export type Role = 'admin' | 'teacher';

type Props = {
  allowedRoles?: Role[];
};

export const RoleRoute = ({ allowedRoles }: Props) => {
  const user = useUserStore((state) => state.user);

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
