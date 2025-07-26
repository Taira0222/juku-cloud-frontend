import { useAuthStore } from '@/stores/authStore';
import { useWarningStore } from '@/stores/warningStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const ProtectedRoute = () => {
  const auth = useAuthStore((state) => state.auth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const setWarningMessage = useWarningStore((state) => state.setWarningMessage);

  useEffect(() => {
    // 認証情報が不完全または存在しない場合はログインページへリダイレクト
    if (!isAuthenticated) {
      setWarningMessage('認証情報が不完全です。ログインしてください。');
      navigate('/sign_in');
    }

    // expiryが過去の場合もログインページへリダイレクト
    // authオブジェクトが存在し、expiryが設定されている場合
    if (auth && auth['expiry']) {
      const expiryTimestamp = Number(auth['expiry']);
      // expiryが数値(NaNではない)であり、現在の時刻よりも過去の場合
      if (
        !Number.isFinite(expiryTimestamp) ||
        expiryTimestamp * 1000 < Date.now()
      ) {
        setWarningMessage(
          'セッションが期限切れです。再度ログインしてください。'
        );
        navigate('/sign_in');
      }
    }
  }, [auth, navigate, setWarningMessage, isAuthenticated]);

  // 認証情報が完全な場合は子コンポーネントを表示
  return auth && auth['access-token'] && auth['client'] && auth['uid'] ? (
    <Outlet />
  ) : null;
};
