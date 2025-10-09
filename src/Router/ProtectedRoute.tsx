import { useUserQuery } from "@/queries/useUserQuery";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useWarningStore } from "@/stores/warningStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setWarningMessage = useWarningStore((state) => state.setWarningMessage);
  const setUser = useUserStore((state) => state.setUser);
  const signOutInProgress = useAuthStore((state) => state.signOutInProgress);
  const authenticated = isAuthenticated();

  // サインアウト中 かつ 未承認 の場合は userQuery を無効化する
  const { data, isError, isSuccess } = useUserQuery({
    enabled: !signOutInProgress && authenticated,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (!authenticated) {
      setWarningMessage("ログインが必要です");
    }
  }, [authenticated, setWarningMessage]);

  if (isError) {
    return <Navigate to="404" />;
  }

  if (!authenticated) {
    // 未認証ならサインインへリダイレクト
    return <Navigate to="/sign_in" />;
  }

  return <Outlet />;
};
